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
import {getSongIdx} from '../common/song-name-helper';

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
    // wasted request — which is most of the cost on a full level page. Both
    // kinds of row carry the idx input, so the score block is the only signal:
    // a played row has one for the achievement (and usually one for DX score),
    // an unplayed row renders none at all. Test for the element rather than
    // parsing it, so a real 0.0000% play is not mistaken for unplayed.
    if (!row.querySelector('.music_score_block')) {
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

/** Rows within this far of the viewport are worth loading before they arrive. */
const PRELOAD_MARGIN = '300px';

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

  const loader = new PlayInfoLoader(
    (idx, info) => {
      for (const target of bySong.get(idx) ?? []) {
        const diffInfo = info[target.diffId];
        if (diffInfo) {
          annotate(target.row, target.block, diffInfo);
        }
      }
    },
    // Fires whenever the queue empties, so sorting can re-run on what arrived.
    () => document.dispatchEvent(new CustomEvent(PLAY_INFO_READY_EVENT))
  );

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

  // Sorting reorders rows, which can bring unloaded ones on screen; the
  // observer handles that on its own. Requesting the whole page is available
  // through the overview, which shows progress and can be cancelled.
  document.addEventListener(REQUEST_ALL_EVENT, () => {
    for (const target of targets) {
      loader.request(target.idx);
    }
  });
}
