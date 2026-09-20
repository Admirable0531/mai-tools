import {addToCache} from '../common/cache';
import {getAchievement} from '../common/fetch-score-util';
import {getEpochTimeFromText} from '../common/net-helpers';
import {LAST_PLAYED_ATTR, PLAY_COUNT_ATTR, PLAY_INFO_READY_EVENT} from '../common/play-info';
import {getSongIdx} from '../common/song-name-helper';

const DETAIL_URL = '/maimai-mobile/record/musicDetail/';
const CACHE_PREFIX = 'MaiToolsPlayInfo:';
/** Play count and last-played only change when you actually play, so a few hours is safe. */
const CACHE_DURATION = 1000 * 60 * 60 * 6;

/** How many detail pages may be in flight at once. */
const MAX_CONCURRENCY = 6;
/** Gap between request starts once the site starts pushing back. */
const INITIAL_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 5000;
const MAX_ATTEMPTS = 3;
/**
 * Consecutive failures that mean something is actually wrong — an expired
 * session, or the site refusing us outright. Retrying past this only burns
 * requests against the rate limit.
 */
const MAX_CONSECUTIVE_FAILURES = 5;

type PlayInfo = {count: number; lastPlayed: string};
/** Every difficulty of one song, keyed by the detail page's section id. */
type SongPlayInfo = Record<string, PlayInfo>;

// The detail page labels these rows in the page language, so match all of them —
// and fall back to the shape of the value, which is language independent.
const COUNT_LABEL = /play\s*count|プレイ回数|플레이\s*횟수|[遊游]玩次[數数]/i;
const DATE_LABEL = /last\s*played|最終プレイ|최종\s*플레이|最[後后][遊游]玩/i;
const DATE_VALUE = /^\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2}/;
const COUNT_VALUE = /^\d{1,6}$/;

/**
 * Throttle shared by every worker. It stays out of the way until the site
 * actually pushes back, then spaces requests out and decays again once
 * responses start succeeding.
 */
class Backoff {
  private gapMs = 0;
  private nextSlot = 0;

  /** Hold until this worker's turn, so the gap applies across all of them. */
  async wait(): Promise<void> {
    if (this.gapMs === 0) {
      return;
    }
    const now = Date.now();
    const slot = Math.max(now, this.nextSlot);
    this.nextSlot = slot + this.gapMs;
    if (slot > now) {
      await new Promise((resolve) => setTimeout(resolve, slot - now));
    }
  }

  penalize(): void {
    this.gapMs = Math.min(this.gapMs === 0 ? INITIAL_BACKOFF_MS : this.gapMs * 2, MAX_BACKOFF_MS);
    console.warn(`[play-last] throttled, spacing requests ${this.gapMs}ms apart`);
  }

  relax(): void {
    if (this.gapMs > 0) {
      this.gapMs = this.gapMs <= INITIAL_BACKOFF_MS ? 0 : Math.floor(this.gapMs / 2);
    }
  }
}

/** Shared across the worker pool: the throttle, plus the give-up-entirely switch. */
class RunState {
  readonly backoff = new Backoff();
  aborted = false;
  private consecutiveFailures = 0;

  recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.backoff.relax();
  }

  recordFailure(): void {
    this.backoff.penalize();
    if (++this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      this.aborted = true;
      console.warn(
        `[play-last] ${this.consecutiveFailures} requests failed in a row — stopping. ` +
          'The session has probably expired, or the site is refusing requests.'
      );
    }
  }
}

function readCache(idx: string): SongPlayInfo | null {
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
    // browse more levels, so drop them and keep the newest. Annotation itself
    // still works either way.
    console.warn('[play-last] play info cache full, clearing it', e);
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
  for (const diffId of ['basic', 'advanced', 'expert', 'master', 'remaster', 'utage']) {
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

async function fetchSongPlayInfo(idx: string, run: RunState): Promise<SongPlayInfo | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS && !run.aborted; attempt++) {
    await run.backoff.wait();
    try {
      // Relative URL: same-origin, so this works on every maimai DX NET region
      // and sends the session cookie without an explicit credentials mode.
      const res = await fetch(`${DETAIL_URL}?idx=${encodeURIComponent(idx)}`, {redirect: 'error'});
      if (!res.ok) {
        run.recordFailure();
        continue;
      }
      const info = parseDetailPage(await res.text());
      run.recordSuccess();
      return info;
    } catch (e) {
      // `redirect: 'error'` turns the logged-out redirect into a rejection, so
      // an expired session lands here and trips the failure streak below.
      run.recordFailure();
    }
  }
  if (!run.aborted) {
    console.warn('[play-last] gave up on idx =', idx);
  }
  return null;
}

function createInfoBlock(className: string, width: string, text: string): HTMLElement {
  const div = document.createElement('div');
  // Deliberately NOT "music_score_block": mai-tools reads the achievement and
  // DX score by position among those, and extra ones break DX-star parsing.
  div.className = `mai-tools-play-info ${className} ${width} d_ib t_r f_12`;
  div.textContent = text;
  return div;
}

/** getEpochTimeFromText throws on anything it does not recognize, so check first. */
function toEpochTime(dateText: string): number {
  if (!DATE_VALUE.test(dateText)) {
    return 0;
  }
  try {
    return getEpochTimeFromText(dateText) || 0;
  } catch (e) {
    return 0;
  }
}

function annotate(row: HTMLElement, block: HTMLElement, info: PlayInfo): void {
  const lastPlayed = info.lastPlayed || 'N/A';
  row.setAttribute(PLAY_COUNT_ATTR, String(info.count));
  row.setAttribute(LAST_PLAYED_ATTR, String(toEpochTime(info.lastPlayed)));

  const outer = document.createElement('div');
  outer.className = 't_l';
  outer.style.marginTop = '4px';
  outer.append(createInfoBlock('play-count', 'w_120', `🕹️ ${info.count} plays`));
  outer.append(createInfoBlock('last-played', 'w_310 m_r_0', `📅 ${lastPlayed}`));
  block.append(outer);
}

type Target = {row: HTMLElement; block: HTMLElement; idx: string; diffId: string};

function collectTargets(document: Document): Target[] {
  const rows = Array.from(
    document.body.querySelectorAll<HTMLElement>('.main_wrapper.t_c .w_450.m_15.f_0')
  );
  const targets: Target[] = [];
  for (const row of rows) {
    // Already annotated (script run twice on the same page).
    if (row.hasAttribute(PLAY_COUNT_ATTR)) {
      continue;
    }
    // An unplayed chart has no play count to show, and asking for it is a
    // wasted request — which is most of the cost on a full level page.
    if (!getAchievement(row)) {
      continue;
    }
    const block = row.querySelector<HTMLElement>('div[class*="_score_back"]');
    // The detail page's section ids are the same words the row's class uses:
    // basic / advanced / expert / master / remaster.
    const diffId = block?.className.match(/music_([a-z]+)_score_back/)?.[1];
    // getSongIdx throws on a row with a form but no idx input, and pages other
    // than the score list do not always have one.
    let idx: string = null;
    try {
      idx = getSongIdx(row);
    } catch (e) {
      continue;
    }
    if (!block || !diffId || !idx) {
      continue;
    }
    targets.push({row, block, idx, diffId});
  }
  return targets;
}

export async function addPlayAndLastPlayedInfo(document: Document): Promise<void> {
  const targets = collectTargets(document);
  if (!targets.length) {
    return;
  }

  // One request per song, not per row: the detail page holds every difficulty,
  // so two difficulties of the same song on one page share a single fetch.
  const bySong = new Map<string, Target[]>();
  for (const target of targets) {
    const group = bySong.get(target.idx);
    if (group) {
      group.push(target);
    } else {
      bySong.set(target.idx, [target]);
    }
  }

  const songIdxs = Array.from(bySong.keys());
  const pending: string[] = [];
  let cacheHits = 0;
  for (const idx of songIdxs) {
    const cachedInfo = readCache(idx);
    if (cachedInfo) {
      cacheHits++;
      for (const target of bySong.get(idx)) {
        const info = cachedInfo[target.diffId];
        if (info) {
          annotate(target.row, target.block, info);
        }
      }
    } else {
      pending.push(idx);
    }
  }
  console.log(
    `[play-last] ${targets.length} played charts, ${songIdxs.length} songs, ` +
      `${cacheHits} from cache, ${pending.length} to fetch`
  );

  if (pending.length) {
    const run = new RunState();
    let next = 0;
    // A sliding pool keeps MAX_CONCURRENCY requests in flight the whole way
    // through, instead of stalling on the slowest response in each batch.
    const workers = Array.from({length: Math.min(MAX_CONCURRENCY, pending.length)}, async () => {
      while (next < pending.length && !run.aborted) {
        const idx = pending[next++];
        const info = await fetchSongPlayInfo(idx, run);
        if (!info) {
          continue;
        }
        writeCache(idx, info);
        for (const target of bySong.get(idx)) {
          const diffInfo = info[target.diffId];
          if (diffInfo) {
            annotate(target.row, target.block, diffInfo);
          }
        }
      }
    });
    await Promise.all(workers);
  }

  document.dispatchEvent(new CustomEvent(PLAY_INFO_READY_EVENT));
}
