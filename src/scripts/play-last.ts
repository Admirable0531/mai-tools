// Adds play count and last played date to each row of the score list.
// The fetching, caching and throttling live in common/play-info-fetch, shared
// with the last-played overview.

import {
  LAST_PLAYED_ATTR,
  PLAY_COUNT_ATTR,
  PLAY_INFO_READY_EVENT,
  REQUEST_ALL_EVENT,
} from '../common/play-info';
import {lockedOutFor, PlayInfo, PlayInfoLoader, toEpochTime} from '../common/play-info-fetch';
import {getInitialLanguage, Language} from '../common/lang';
import {getSongIdx} from '../common/song-name-helper';

/** Observed safe pacing, used only to give an honest estimate up front. */
const SECONDS_PER_SONG = 0.75;

const UIString = {
  [Language.en_US]: {
    loadAll: (songs: number, minutes: number) =>
      `⬇️ Load all play data (${songs} songs, ~${minutes} min)`,
    loading: (done: number, total: number) => `Loading ${done} / ${total}… (tap to stop)`,
    allLoaded: '✅ All play data loaded',
    stopped: (done: number, total: number) => `Stopped at ${done} / ${total} — tap to resume`,
    locked: (minutes: number) => `⏳ Rate limited — try again in ~${minutes} min`,
  },
  [Language.zh_TW]: {
    loadAll: (songs: number, minutes: number) =>
      `⬇️ 載入全部遊玩資料 (${songs} 首，約 ${minutes} 分鐘)`,
    loading: (done: number, total: number) => `載入中 ${done} / ${total}…（點擊停止）`,
    allLoaded: '✅ 已載入全部遊玩資料',
    stopped: (done: number, total: number) => `已停止於 ${done} / ${total} — 點擊繼續`,
    locked: (minutes: number) => `⏳ 已被限制存取 — 約 ${minutes} 分鐘後再試`,
  },
  [Language.ko_KR]: {
    loadAll: (songs: number, minutes: number) =>
      `⬇️ 전체 플레이 데이터 불러오기 (${songs}곡, 약 ${minutes}분)`,
    loading: (done: number, total: number) => `불러오는 중 ${done} / ${total}… (탭하면 중지)`,
    allLoaded: '✅ 전체 플레이 데이터 불러옴',
    stopped: (done: number, total: number) => `${done} / ${total}에서 중지 — 탭하면 계속`,
    locked: (minutes: number) => `⏳ 요청 제한 — 약 ${minutes}분 후 재시도`,
  },
}[getInitialLanguage()];

// The look of a score block lives entirely in maimai's own .music_score_block
// rule, and we cannot use that class (mai-tools reads achievement and DX score
// by position among those elements, so an extra one breaks DX-star parsing).
// Copy the painted properties off a real block in the same row instead: it
// matches exactly, and keeps matching if the site restyles.
const COPIED_STYLES = [
  'background-color',
  'background-image',
  'background-size',
  'background-repeat',
  'background-position',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-radius',
  'box-shadow',
  'color',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-right',
  'min-height',
  'line-height',
];

function createInfoBlock(
  styleTemplate: HTMLElement | null,
  className: string,
  width: string,
  text: string
): HTMLElement {
  const div = document.createElement('div');
  div.className = `mai-tools-play-info ${className} ${width} d_ib t_r f_12`;
  div.textContent = text;
  if (styleTemplate) {
    const computed = window.getComputedStyle(styleTemplate);
    for (const prop of COPIED_STYLES) {
      const value = computed.getPropertyValue(prop);
      if (value) {
        div.style.setProperty(prop, value);
      }
    }
  }
  return div;
}

function annotate(row: HTMLElement, block: HTMLElement, info: PlayInfo): void {
  const lastPlayed = info.lastPlayed || 'N/A';
  row.setAttribute(PLAY_COUNT_ATTR, String(info.count));
  row.setAttribute(LAST_PLAYED_ATTR, String(toEpochTime(info.lastPlayed)));

  // The achievement block, whose look we borrow.
  const styleTemplate = block.querySelector<HTMLElement>('.music_score_block');

  const outer = document.createElement('div');
  outer.className = 't_l';
  outer.style.marginTop = '4px';
  outer.append(createInfoBlock(styleTemplate, 'play-count', 'w_120', `🕹️ ${info.count} plays`));
  const lastPlayedBlock = createInfoBlock(
    styleTemplate,
    'last-played',
    'w_310',
    `📅 ${lastPlayed}`
  );
  lastPlayedBlock.style.marginRight = '0';
  outer.append(lastPlayedBlock);
  block.append(outer);
}

type Target = {row: HTMLElement; block: HTMLElement; idx: string; diffId: string};

function collectTargets(document: Document): Target[] {
  // Key off the difficulty block, not the row's utility classes. The wrapper is
  // spelled differently across the score pages (musicGenre, musicLevel,
  // musicVersion, ...), and matching an exact class list there silently found
  // nothing on the ones that differ. The coloured block is the constant.
  const blocks = Array.from(
    document.body.querySelectorAll<HTMLElement>('div[class*="_score_back"]')
  );
  const targets: Target[] = [];
  for (const block of blocks) {
    // Everything we read — score blocks, the idx form — lives inside the
    // coloured block. The row is only needed to carry the data attributes
    // sorting reads, so fall back to the block's parent when the usual row
    // wrapper is not there.
    const row = (block.closest<HTMLElement>('.w_450') ?? block.parentElement) as HTMLElement;
    if (!row || row.hasAttribute(PLAY_COUNT_ATTR)) {
      continue;
    }
    // An unplayed chart has no play count to show, and asking for it is a
    // wasted request — which is most of the cost on a full level page. Both
    // kinds of row carry the idx input, so the score block is the only signal:
    // a played row has one for the achievement (and usually one for DX score),
    // an unplayed row renders none at all. Test for the element rather than
    // parsing it, so a real 0.0000% play is not mistaken for unplayed.
    if (!block.querySelector('.music_score_block')) {
      continue;
    }
    // The detail page's section ids are the same words the block's class uses:
    // basic / advanced / expert / master / remaster.
    const diffId = block.className.match(/music_([a-z]+)_score_back/)?.[1];
    // getSongIdx throws on an element with a form but no idx input, and pages
    // other than the score list do not always have one.
    let idx: string = null;
    try {
      idx = getSongIdx(block);
    } catch (e) {
      continue;
    }
    if (!diffId || !idx) {
      continue;
    }
    targets.push({row, block, idx, diffId});
  }
  if (blocks.length && !targets.length) {
    console.warn(
      `[play-last] found ${blocks.length} chart blocks but none usable — ` +
        'the page markup is not what this expects'
    );
  }
  return targets;
}

/** Rows within this far of the viewport are worth loading before they arrive. */
const PRELOAD_MARGIN = '300px';

/**
 * A button that loads the rest of the page at the same paced rate, for when
 * you want to sort by play count or last played rather than browse. Scrolling
 * covers the browsing case; this covers wanting the whole picture, and says
 * what it will cost before it starts.
 */
function addLoadAllControl(
  d: Document,
  loader: PlayInfoLoader,
  bySong: Map<string, Target[]>,
  loadedSongs: Set<string>,
  firstTarget: Target | undefined
): {refresh: () => void; startAll: () => void} | null {
  if (d.getElementById('maiToolsLoadAllPlayInfo')) {
    return null;
  }
  // Not every score page has a screw_block header, so fall back to sitting
  // above the first chart row rather than not appearing at all.
  const anchor =
    d.body.querySelector('.main_wrapper.t_c .screw_block') ??
    firstTarget?.row ??
    d.body.querySelector('.main_wrapper.t_c div[class*="_score_back"]')?.parentElement;
  if (!anchor) {
    return null;
  }

  const container = d.createElement('div');
  container.className = 'w_450 m_15';
  const button = d.createElement('button');
  button.id = 'maiToolsLoadAllPlayInfo';
  button.type = 'button';
  Object.assign(button.style, {
    width: '100%',
    padding: '8px',
    fontSize: '13px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
  });
  container.append(button);
  anchor.insertAdjacentElement('beforebegin', container);

  let loadingAll = false;

  const refresh = () => {
    const total = bySong.size;
    const done = loadedSongs.size;
    const lockedFor = lockedOutFor();
    if (lockedFor > 0) {
      button.textContent = UIString.locked(Math.ceil(lockedFor / 60000));
      button.disabled = true;
      return;
    }
    button.disabled = false;
    if (done >= total) {
      button.textContent = UIString.allLoaded;
      button.disabled = true;
      loadingAll = false;
      return;
    }
    if (loadingAll) {
      button.textContent = loader.pending
        ? UIString.loading(done, total)
        : UIString.stopped(done, total);
      if (!loader.pending) {
        loadingAll = false;
      }
      return;
    }
    const remaining = total - done;
    button.textContent = UIString.loadAll(
      remaining,
      Math.max(1, Math.round((remaining * SECONDS_PER_SONG) / 60))
    );
  };

  const startAll = () => {
    if (loadingAll || lockedOutFor() > 0) {
      return;
    }
    loadingAll = true;
    for (const idx of bySong.keys()) {
      loader.request(idx);
    }
    refresh();
  };

  button.addEventListener('click', () => {
    if (loadingAll) {
      // Stop, but stay usable: rows scrolled to afterwards still load, and
      // pressing again picks up where this left off.
      loader.clearQueue();
      loadingAll = false;
      refresh();
    } else {
      startAll();
    }
  });

  refresh();
  return {refresh, startAll};
}

export async function addPlayAndLastPlayedInfo(document: Document): Promise<void> {
  const targets = collectTargets(document);
  if (!targets.length) {
    return;
  }

  // One request per song, not per row: rows for two difficulties of the same
  // song share a single fetch.
  const bySong = new Map<string, Target[]>();
  for (const target of targets) {
    const group = bySong.get(target.idx);
    if (group) {
      group.push(target);
    } else {
      bySong.set(target.idx, [target]);
    }
  }

  const lockedFor = lockedOutFor();
  if (lockedFor > 0) {
    console.warn(
      `[play-last] not fetching for another ${Math.ceil(lockedFor / 60000)} minute(s): ` +
        'maimai DX NET locked the connection recently. Cached rows still show.'
    );
  }
  console.log(
    `[play-last] ${targets.length} played charts across ${bySong.size} songs; ` +
      'loading as they scroll into view'
  );

  const loadedSongs = new Set<string>();
  let onProgress: () => void = () => undefined;

  const loader = new PlayInfoLoader(
    (idx, info) => {
      loadedSongs.add(idx);
      for (const target of bySong.get(idx) ?? []) {
        const diffInfo = info[target.diffId];
        if (diffInfo) {
          annotate(target.row, target.block, diffInfo);
        }
      }
      onProgress();
    },
    // Fires whenever the queue empties, so sorting can re-run on what arrived.
    () => {
      onProgress();
      document.dispatchEvent(new CustomEvent(PLAY_INFO_READY_EVENT));
    }
  );

  const control = addLoadAllControl(document, loader, bySong, loadedSongs, targets[0]);
  if (control) {
    onProgress = control.refresh;
  }

  // Asking for every played chart up front is 150-200 requests, which is what
  // trips maimai's lock however slowly they are paced. Ask only for rows the
  // viewer actually reaches: scrolling is its own rate limit, and cached rows
  // cost nothing either way.
  if (typeof IntersectionObserver === 'undefined') {
    // No observer: fall back to loading the first screenful and nothing more,
    // rather than silently loading everything.
    targets.slice(0, 12).forEach((target) => loader.request(target.idx));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        observer.unobserve(entry.target);
        const idx = (entry.target as HTMLElement).dataset.mtIdx;
        if (idx) {
          loader.request(idx);
        }
      }
      if (loader.stopped) {
        observer.disconnect();
      }
    },
    {rootMargin: PRELOAD_MARGIN}
  );

  for (const target of targets) {
    target.row.dataset.mtIdx = target.idx;
    observer.observe(target.row);
  }

  // Choosing a play-count or last-played sort needs the whole page, so it asks
  // for the rest through the same paced queue the button uses — and shows the
  // same progress, rather than appearing to hang.
  document.addEventListener(REQUEST_ALL_EVENT, () => {
    control?.startAll();
  });
}
