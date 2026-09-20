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
const CACHE_PREFIX = 'MaiToolsPlayInfo:';
/** Play count and last-played only change when you actually play, so a few hours is safe. */
const CACHE_DURATION = 1000 * 60 * 60 * 6;

/** How many detail pages may be in flight at once. */
const MAX_CONCURRENCY = 4;
/**
 * Minimum spacing between request starts, always applied. Firing a pool flat
 * out is what gets the site to start refusing, and being refused is far slower
 * than pacing ourselves.
 */
const BASE_GAP_MS = 100;
/** Extra spacing once the site does push back, on top of the base gap. */
const MAX_BACKOFF_MS = 5000;
const MAX_ATTEMPTS = 3;
/**
 * A long run of failures means something systemic, not a bad row. Generous,
 * because a handful of failures is normal and killing the run over them leaves
 * most of the work undone.
 */
const MAX_CONSECUTIVE_FAILURES = 20;

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

/** Shared across the worker pool: the throttle, plus the give-up-entirely switch. */
class RunState {
  readonly backoff = new Backoff();
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

function clearCache(): void {
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keys.push(key);
    }
  }
  keys.forEach((key) => window.localStorage.removeItem(key));
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
      const info = parseDetailPage(await res.text());
      // Landed somewhere with no difficulty sections at all: the session is
      // gone and we are looking at the login or error page. More requests will
      // not fix that.
      if (!Object.keys(info).length && res.redirected) {
        run.abortRun('the session has expired — log in to maimai DX NET again');
        return null;
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
  onProgress?: (done: number, total: number) => void
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

  const run = new RunState();
  const startedAt = Date.now();
  let next = 0;
  let done = 0;
  // A sliding pool keeps MAX_CONCURRENCY requests in flight the whole way
  // through, instead of stalling on the slowest response in each batch.
  const workers = Array.from({length: Math.min(MAX_CONCURRENCY, pending.length)}, async () => {
    while (next < pending.length && !run.aborted) {
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
