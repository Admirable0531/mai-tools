// Fetching play count and last-played date from maimai DX NET's song detail
// pages, shared by the score-list annotation (scripts/play-last) and the
// last-played overview (scripts/play-heatmap).
//
// The unit of work is a SONG, not a chart: one detail page carries every
// difficulty, so two difficulties of the same song cost one request between
// them. Results are cached per song, which is what makes the overview's second
// run cheap.

import {addToCache} from './cache';
import {getEpochTimeFromText} from './net-helpers';

const DETAIL_URL = '/maimai-mobile/record/musicDetail/';
// Version suffix: an earlier build cached empty results when the site was
// refusing requests, and those entries would otherwise keep rows blank until
// they expired. Bumping the prefix abandons them.
const CACHE_PREFIX = 'MaiToolsPlayInfo2:';
/** Play count and last-played only change when you actually play, so a few hours is safe. */
const CACHE_DURATION = 1000 * 60 * 60 * 6;

/**
 * Pacing. maimai DX NET answers with ERROR CODE 200001 — "too many access
 * within a short period, the connection has been locked" — and it takes very
 * little to provoke. One request at a time, spaced out, is the only setting
 * observed not to trip it.
 *
 * Rate is only half of it: a level page holds 150-200 played charts, and
 * asking for all of them trips the lock at any rate that finishes in
 * reasonable time. That is why callers load on demand rather than up front.
 */
const MAX_CONCURRENCY = 1;
/** Minimum spacing between request starts, always applied. */
const BASE_GAP_MS = 700;
/** Extra spacing once the site does push back, on top of the base gap. */
const MAX_BACKOFF_MS = 5000;
const MAX_ATTEMPTS = 3;
/**
 * A long run of failures means something systemic, not a bad row. Generous,
 * because a handful of failures is normal and killing the run over them leaves
 * most of the work undone.
 */
const MAX_CONSECUTIVE_FAILURES = 20;

/**
 * maimai's "too many access ... the connection has been locked" page. It comes
 * back as a perfectly ordinary 200 with no redirect, so nothing but its text
 * distinguishes it from a real detail page — and treating it as a success is
 * how a run ends up hammering a site that has already said no.
 */
const LOCKED_PAGE =
  /too many access|connection has been locked|アクセスが集中|ロックされ|접속이 많아|連線已被鎖定|连接已被锁定/i;
const LOCKOUT_KEY = 'MaiToolsPlayInfoLockedUntil';
/** How long to stay away after being locked out, so page loads stop re-triggering it. */
const LOCKOUT_MS = 10 * 60 * 1000;
export const LOCKED_REASON = 'maimai DX NET locked the connection (too many requests)';

export type PlayInfo = {count: number; lastPlayed: string};
/** Every difficulty of one song, keyed by the detail page's section id. */
export type SongPlayInfo = Record<string, PlayInfo>;

/** Detail page section ids, which are also the words the row classes use. */
export const DIFF_IDS = ['basic', 'advanced', 'expert', 'master', 'remaster', 'utage'];

// The detail page labels these rows in the page language, so match all of them —
// and fall back to the shape of the value, which is language independent.
const COUNT_LABEL = /play\s*count|プレイ回数|플레이\s*횟수|[遊游]玩次[數数]/i;
const DATE_LABEL = /last\s*played|最終プレイ|최종\s*플레이|最[後后][遊游]玩/i;
const DATE_VALUE = /^\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2}/;
const COUNT_VALUE = /^\d{1,6}$/;

/** getEpochTimeFromText throws on anything it does not recognize, so check first. */
export function toEpochTime(dateText: string): number {
  if (!dateText || !DATE_VALUE.test(dateText)) {
    return 0;
  }
  try {
    return getEpochTimeFromText(dateText) || 0;
  } catch (e) {
    return 0;
  }
}

/**
 * Throttle shared by every worker. Keeps a floor under the request rate at all
 * times, and widens the gap when the site pushes back.
 */
class Backoff {
  private extraMs = 0;
  private nextSlot = 0;

  /** Hold until this worker's turn, so the spacing applies across all of them. */
  async wait(): Promise<void> {
    const gap = BASE_GAP_MS + this.extraMs;
    const now = Date.now();
    const slot = Math.max(now, this.nextSlot);
    this.nextSlot = slot + gap;
    if (slot > now) {
      await new Promise((resolve) => setTimeout(resolve, slot - now));
    }
  }

  penalize(): void {
    this.extraMs = Math.min(this.extraMs === 0 ? BASE_GAP_MS : this.extraMs * 2, MAX_BACKOFF_MS);
    console.warn(`[play-info] backing off to ${BASE_GAP_MS + this.extraMs}ms between requests`);
  }

  relax(): void {
    if (this.extraMs > 0) {
      this.extraMs = this.extraMs <= BASE_GAP_MS ? 0 : Math.floor(this.extraMs / 2);
    }
  }
}

/**
 * One throttle for the whole page. The row annotation and the overview can be
 * in flight at the same time, and two independent throttles would each think
 * they were being polite while together doubling the rate.
 */
const sharedBackoff = new Backoff();

/** Shared across the worker pool: the throttle, plus the give-up-entirely switch. */
class RunState {
  readonly backoff = sharedBackoff;
  aborted = false;
  abortReason = '';
  private consecutiveFailures = 0;

  recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.backoff.relax();
  }

  recordFailure(): void {
    this.backoff.penalize();
    if (++this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      this.abortRun(`${this.consecutiveFailures} requests failed in a row`);
    }
  }

  abortRun(reason: string): void {
    this.aborted = true;
    this.abortReason = reason;
    console.warn(`[play-info] stopping: ${reason}`);
  }
}

/**
 * True when this page is maimai's "connection has been locked" notice rather
 * than the page we asked for. Callers that fetch pages outside this module
 * need it too, since the notice arrives as an ordinary 200.
 */
export function isLockedPage(text: string): boolean {
  return LOCKED_PAGE.test(text);
}

/** Records the lockout so other entry points stop asking as well. */
export function noteLockedOut(): void {
  markLockedOut();
}

/** Milliseconds left on a self-imposed lockout, or 0 when there is none. */
export function lockedOutFor(): number {
  try {
    const until = parseInt(window.localStorage.getItem(LOCKOUT_KEY), 10);
    return isNaN(until) ? 0 : Math.max(0, until - Date.now());
  } catch (e) {
    return 0;
  }
}

function markLockedOut(): void {
  try {
    window.localStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
  } catch (e) {
    // Without the record we just risk asking again too soon.
  }
}

export function readCache(idx: string): SongPlayInfo | null {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + idx);
    if (!raw) {
      return null;
    }
    const {value, expiration} = JSON.parse(raw);
    if (!expiration || expiration <= Date.now()) {
      window.localStorage.removeItem(CACHE_PREFIX + idx);
      return null;
    }
    return value;
  } catch (e) {
    return null;
  }
}

function clearByPrefix(prefix: string): void {
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(prefix)) {
      keys.push(key);
    }
  }
  keys.forEach((key) => window.localStorage.removeItem(key));
}

function clearCache(): void {
  clearByPrefix(CACHE_PREFIX);
}

// One-time sweep of the previous cache generation, whose entries could be
// empty results recorded while the site was refusing requests. Leaving them
// would waste quota for hours and teach nobody anything.
try {
  clearByPrefix('MaiToolsPlayInfo:');
} catch (e) {
  // Storage unavailable; nothing to sweep.
}

function writeCache(idx: string, info: SongPlayInfo): void {
  try {
    addToCache(CACHE_PREFIX + idx, info, CACHE_DURATION);
  } catch (e) {
    // Out of quota. Our own entries are the ones that grow without bound as you
    // browse more levels, so drop them and keep the newest. Everything still
    // works uncached.
    console.warn('[play-info] cache full, clearing it', e);
    try {
      clearCache();
      addToCache(CACHE_PREFIX + idx, info, CACHE_DURATION);
    } catch (e2) {
      // Not our quota to reclaim; carry on uncached.
    }
  }
}

function parseDifficultySection(section: HTMLElement): PlayInfo | null {
  const tds = Array.from(section.querySelectorAll('td'));
  const texts = tds.map((td) => td.textContent?.trim() ?? '');
  let count: string = null;
  let lastPlayed: string = null;

  for (let i = 0; i < texts.length; i++) {
    if (count === null && COUNT_LABEL.test(texts[i])) {
      count = texts[i + 1] ?? null;
    }
    if (lastPlayed === null && DATE_LABEL.test(texts[i])) {
      lastPlayed = texts[i + 1] ?? null;
    }
  }

  // Unknown page language: recognize the values instead of the labels.
  if (lastPlayed === null) {
    lastPlayed = texts.find((t) => DATE_VALUE.test(t)) ?? null;
  }
  if (count === null) {
    count = texts.find((t) => COUNT_VALUE.test(t)) ?? null;
  }

  const parsedCount = parseInt(count, 10);
  if (isNaN(parsedCount) && !lastPlayed) {
    return null;
  }
  return {count: isNaN(parsedCount) ? 0 : parsedCount, lastPlayed: lastPlayed ?? ''};
}

/** One detail page carries every difficulty of the song, so parse them all while we're here. */
function parseDetailPage(html: string): SongPlayInfo {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const info: SongPlayInfo = {};
  for (const diffId of DIFF_IDS) {
    const section = doc.querySelector<HTMLElement>(`#${diffId}`);
    if (!section) {
      continue;
    }
    const parsed = parseDifficultySection(section);
    if (parsed) {
      info[diffId] = parsed;
    }
  }
  return info;
}

async function fetchOne(idx: string, run: RunState): Promise<SongPlayInfo | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS && !run.aborted; attempt++) {
    await run.backoff.wait();
    try {
      // Relative URL: same-origin, so this works on every maimai DX NET region
      // and sends the session cookie without an explicit credentials mode.
      // Redirects are FOLLOWED, not treated as errors — maimai redirects on
      // plenty of ordinary responses, and failing them turns a working run
      // into a backoff spiral.
      const res = await fetch(`${DETAIL_URL}?idx=${encodeURIComponent(idx)}`);
      if (!res.ok) {
        run.recordFailure();
        continue;
      }
      const html = await res.text();
      // Check this BEFORE parsing: the lock page is a 200 with no redirect, so
      // it parses to an empty result that would otherwise look like success.
      if (LOCKED_PAGE.test(html)) {
        markLockedOut();
        run.abortRun(LOCKED_REASON);
        return null;
      }
      const info = parseDetailPage(html);
      // No difficulty sections at all: the login page, an error page, or
      // something else we cannot read. Never a real detail page, so never a
      // success — and never cached, or the row stays blank for hours.
      if (!Object.keys(info).length) {
        if (res.redirected) {
          run.abortRun('the session has expired — log in to maimai DX NET again');
          return null;
        }
        run.recordFailure();
        continue;
      }
      run.recordSuccess();
      return info;
    } catch (e) {
      run.recordFailure();
    }
  }
  if (!run.aborted) {
    console.warn('[play-info] gave up on idx =', idx);
  }
  return null;
}

export type FetchResult = {
  /** Songs fetched over the network this run. */
  fetched: number;
  /** Songs served from cache without a request. */
  cached: number;
  /** Set when the run stopped early; the text says why. */
  abortReason: string;
};

/**
 * Resolve play info for each song idx, from cache where possible and over the
 * network otherwise. `onSong` is called as each result lands, so callers can
 * render progressively rather than waiting for the whole set.
 */
export async function fetchSongPlayInfo(
  idxs: string[],
  onSong: (idx: string, info: SongPlayInfo) => void,
  onProgress?: (done: number, total: number) => void,
  shouldStop?: () => boolean
): Promise<FetchResult> {
  const pending: string[] = [];
  let cached = 0;
  for (const idx of idxs) {
    const hit = readCache(idx);
    if (hit) {
      cached++;
      onSong(idx, hit);
    } else {
      pending.push(idx);
    }
  }
  onProgress?.(cached, idxs.length);

  if (!pending.length) {
    return {fetched: 0, cached, abortReason: ''};
  }

  // Still serving out a lockout: cached rows are already shown, and asking
  // again now is what keeps the lock alive.
  const remaining = lockedOutFor();
  if (remaining > 0) {
    const minutes = Math.ceil(remaining / 60000);
    const reason = `${LOCKED_REASON}; waiting ${minutes} more minute${minutes === 1 ? '' : 's'}`;
    console.warn(`[play-info] skipping: ${reason}`);
    return {fetched: 0, cached, abortReason: reason};
  }

  const run = new RunState();
  const startedAt = Date.now();
  let next = 0;
  let done = 0;
  // A sliding pool keeps MAX_CONCURRENCY requests in flight the whole way
  // through, instead of stalling on the slowest response in each batch.
  const workers = Array.from({length: Math.min(MAX_CONCURRENCY, pending.length)}, async () => {
    while (next < pending.length && !run.aborted) {
      if (shouldStop?.()) {
        run.abortRun('cancelled');
        break;
      }
      const idx = pending[next++];
      const info = await fetchOne(idx, run);
      done++;
      onProgress?.(cached + done, idxs.length);
      if (info) {
        writeCache(idx, info);
        onSong(idx, info);
      }
    }
  });
  await Promise.all(workers);

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `[play-info] fetched ${done}/${pending.length} songs in ${elapsed}s` +
      (run.aborted ? ' (stopped early)' : '')
  );
  return {fetched: done, cached, abortReason: run.abortReason};
}

/**
 * A queue for loading songs one at a time, as they turn out to be needed.
 *
 * The score list is the reason this exists. Fetching every played chart on the
 * page up front is 150-200 requests, which trips maimai's lock at any rate
 * that finishes in reasonable time — so the annotation asks only for rows the
 * viewer actually scrolls to, and this spreads those requests out behind the
 * shared throttle. Cache hits are answered immediately without queueing.
 */
export class PlayInfoLoader {
  private readonly queue: string[] = [];
  private readonly requested = new Set<string>();
  private readonly run = new RunState();
  private draining = false;

  constructor(
    private readonly onSong: (idx: string, info: SongPlayInfo) => void,
    private readonly onIdle?: () => void
  ) {}

  get stopped(): boolean {
    return this.run.aborted;
  }

  get stopReason(): string {
    return this.run.abortReason;
  }

  /** Number of songs still waiting to be fetched. */
  get pending(): number {
    return this.queue.length;
  }

  /** Ask for a song. Cached answers come back before this returns. */
  request(idx: string): void {
    if (this.requested.has(idx)) {
      return;
    }
    this.requested.add(idx);
    const hit = readCache(idx);
    if (hit) {
      this.onSong(idx, hit);
      return;
    }
    this.queue.push(idx);
    void this.drain();
  }

  /**
   * Drop what is queued but stay usable — the request in flight finishes, and
   * anything dropped can be asked for again. This is "stop loading the rest of
   * the page", not "give up": rows scrolled to afterwards should still load.
   */
  clearQueue(): void {
    for (const idx of this.queue) {
      this.requested.delete(idx);
    }
    this.queue.length = 0;
  }

  /** Give up on anything not yet fetched, for good. */
  cancel(reason = 'cancelled'): void {
    this.queue.length = 0;
    this.run.abortRun(reason);
  }

  private async drain(): Promise<void> {
    if (this.draining) {
      return;
    }
    this.draining = true;
    try {
      while (this.queue.length && !this.run.aborted) {
        const remaining = lockedOutFor();
        if (remaining > 0) {
          this.run.abortRun(
            `${LOCKED_REASON}; waiting ${Math.ceil(remaining / 60000)} more minute(s)`
          );
          break;
        }
        // Shift rather than pop: rows asked for first are the ones on screen.
        const idx = this.queue.shift();
        const info = await fetchOne(idx, this.run);
        if (info) {
          writeCache(idx, info);
          this.onSong(idx, info);
        }
      }
    } finally {
      this.draining = false;
      if (!this.queue.length) {
        this.onIdle?.();
      }
    }
  }
}
