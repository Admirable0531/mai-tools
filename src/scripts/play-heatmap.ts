// "Last played" overview for everything you have played, opened from a button
// on the score list. Reads the five per-difficulty score pages to enumerate
// your played charts, then resolves each song's play info through the shared
// cache, and draws three views over it:
//
//   - a calendar heatmap of when charts were last played,
//   - a level x recency grid, for spotting levels that have gone stale,
//   - a plain list of the longest untouched charts.

import {ChartType, getChartType, getChartTypeName} from '../common/chart-type';
import {
  DIFFICULTIES,
  Difficulty,
  getDifficultyClassName,
  getDifficultyName,
  getDifficultyTextColor,
} from '../common/difficulties';
import {getChartLevel, getSongName} from '../common/fetch-score-util';
import {SELF_SCORE_URLS} from '../common/fetch-self-score';
import {getInitialLanguage, Language} from '../common/lang';
import {fetchPage} from '../common/net-helpers';
import {fetchSongPlayInfo, toEpochTime} from '../common/play-info-fetch';
import {getSongIdx} from '../common/song-name-helper';

const DAY_MS = 86400000;
const CALENDAR_WEEKS = 53;
/** Upper edge of each recency bucket, in days. The last bucket is everything older. */
const RECENCY_BUCKETS = [7, 30, 90, 180, 365];
const STALE_LIST_SIZE = 40;
/** Short, language-neutral enough to sit above 13px columns. */
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const UIString = {
  [Language.en_US]: {
    button: '📊 Last played overview',
    scanning: 'Reading your score pages…',
    fetching: (done: number, total: number) => `Loading play data… ${done} / ${total} songs`,
    noCharts: 'No played charts found on your score pages.',
    stoppedEarly: (reason: string) => `Stopped early: ${reason}. Showing what was loaded.`,
    title: 'Last played overview',
    close: 'Close',
    calendar: 'When charts were last played',
    grid: 'Level × time since last play',
    stale: 'Longest untouched',
    chartsOn: (n: number, date: string) => `${n} chart${n === 1 ? '' : 's'} last played ${date}`,
    none: 'nothing',
    level: 'Level',
    never: 'No date',
    summary: (charts: number, songs: number) => `${charts} played charts across ${songs} songs.`,
    days: (n: number) => (n === 1 ? '1 day ago' : `${n} days ago`),
    today: 'today',
    older: 'over a year',
    within: (n: number) => `≤ ${n}d`,
    legendLess: 'fewer',
    legendMore: 'more',
    legendPeak: (n: number) => `(busiest day: ${n})`,
  },
  [Language.zh_TW]: {
    button: '📊 最後遊玩總覽',
    scanning: '正在讀取成績頁面…',
    fetching: (done: number, total: number) => `正在載入遊玩資料… ${done} / ${total} 首`,
    noCharts: '成績頁面中找不到已遊玩的譜面。',
    stoppedEarly: (reason: string) => `提前停止：${reason}。顯示已載入的部分。`,
    title: '最後遊玩總覽',
    close: '關閉',
    calendar: '各譜面最後遊玩的日期',
    grid: '等級 × 距離上次遊玩',
    stale: '最久沒碰的譜面',
    chartsOn: (n: number, date: string) => `${date} 最後遊玩 ${n} 個譜面`,
    none: '無',
    level: '等級',
    never: '無日期',
    summary: (charts: number, songs: number) => `${charts} 個已遊玩譜面，共 ${songs} 首歌。`,
    days: (n: number) => `${n} 天前`,
    today: '今天',
    older: '超過一年',
    within: (n: number) => `≤ ${n}天`,
    legendLess: '少',
    legendMore: '多',
    legendPeak: (n: number) => `(單日最多 ${n})`,
  },
  [Language.ko_KR]: {
    button: '📊 최종 플레이 개요',
    scanning: '성적 페이지를 읽는 중…',
    fetching: (done: number, total: number) => `플레이 데이터 불러오는 중… ${done} / ${total} 곡`,
    noCharts: '성적 페이지에서 플레이한 보면을 찾을 수 없습니다.',
    stoppedEarly: (reason: string) => `조기 중단: ${reason}. 불러온 만큼만 표시합니다.`,
    title: '최종 플레이 개요',
    close: '닫기',
    calendar: '보면별 최종 플레이 날짜',
    grid: '난이도 × 최종 플레이 경과',
    stale: '가장 오래 안 친 보면',
    chartsOn: (n: number, date: string) => `${date}에 마지막으로 플레이한 보면 ${n}개`,
    none: '없음',
    level: '레벨',
    never: '날짜 없음',
    summary: (charts: number, songs: number) => `플레이한 보면 ${charts}개, ${songs}곡.`,
    days: (n: number) => `${n}일 전`,
    today: '오늘',
    older: '1년 초과',
    within: (n: number) => `≤ ${n}일`,
    legendLess: '적음',
    legendMore: '많음',
    legendPeak: (n: number) => `(최다 ${n}개)`,
  },
}[getInitialLanguage()];

type ChartRow = {
  idx: string;
  songName: string;
  level: string;
  difficulty: Difficulty;
  chartType: ChartType;
  /** Epoch ms, or 0 when the detail page reported no date. */
  lastPlayed: number;
  playCount: number;
};

function startOfDay(time: number): number {
  const d = new Date(time);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatDate(time: number): string {
  const d = new Date(time);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}/${mm}/${dd}`;
}

function daysAgo(time: number, now: number): number {
  return Math.floor((startOfDay(now) - startOfDay(time)) / DAY_MS);
}

/** 0 = Sunday, matching the calendar grid's top row. */
function dayOfWeek(time: number): number {
  return new Date(time).getDay();
}

// ---------------------------------------------------------------- enumeration

/**
 * Every played chart, from the five per-difficulty score pages. Five requests,
 * regardless of how large your library is.
 */
async function collectPlayedCharts(onStatus: (text: string) => void): Promise<ChartRow[]> {
  const charts: ChartRow[] = [];
  for (const difficulty of DIFFICULTIES) {
    const url = SELF_SCORE_URLS.get(difficulty);
    if (!url) {
      continue;
    }
    onStatus(`${UIString.scanning} (${getDifficultyName(difficulty)})`);
    let dom: Document;
    try {
      dom = await fetchPage(url);
    } catch (e) {
      console.warn('[play-heatmap] could not load score page', url, e);
      continue;
    }
    const rows = Array.from(dom.querySelectorAll<HTMLElement>('.main_wrapper.t_c .w_450.m_15.f_0'));
    for (const row of rows) {
      // Same test the row annotation uses: an unplayed chart renders no score
      // block at all.
      if (!row.querySelector('.music_score_block')) {
        continue;
      }
      let idx: string = null;
      try {
        idx = getSongIdx(row);
      } catch (e) {
        continue;
      }
      if (!idx) {
        continue;
      }
      charts.push({
        idx,
        songName: getSongName(row),
        level: getChartLevel(row),
        difficulty,
        chartType: getChartType(row),
        lastPlayed: 0,
        playCount: 0,
      });
    }
  }
  return charts;
}

// ------------------------------------------------------------------- drawing

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  style?: Partial<CSSStyleDeclaration>,
  text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (style) {
    Object.assign(node.style, style);
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

/** Five steps of one hue, so density reads as intensity without a legend. */
function heatColor(value: number, max: number): string {
  if (!value) {
    return '#ebedf0';
  }
  const steps = ['#c6e48b', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  const ratio = max <= 1 ? 1 : value / max;
  const step = Math.ceil(ratio * steps.length) - 1;
  return steps[Math.max(0, Math.min(steps.length - 1, step))];
}

function sectionHeading(text: string): HTMLElement {
  return el(
    'h3',
    {
      margin: '18px 0 8px',
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#333',
    },
    text
  );
}

function drawCalendar(charts: ChartRow[], now: number): HTMLElement {
  const outer = el('div');
  const wrap = el('div', {overflowX: 'auto', paddingBottom: '6px'});

  const countByDay = new Map<number, number>();
  for (const chart of charts) {
    if (!chart.lastPlayed) {
      continue;
    }
    const day = startOfDay(chart.lastPlayed);
    countByDay.set(day, (countByDay.get(day) ?? 0) + 1);
  }
  const max = Math.max(1, ...countByDay.values());

  // Right-align the grid on this week, so the last column is the current one.
  const today = startOfDay(now);
  const lastColumnStart = today - dayOfWeek(today) * DAY_MS;
  const firstColumnStart = lastColumnStart - (CALENDAR_WEEKS - 1) * 7 * DAY_MS;

  // A year of shaded cells says nothing without a time axis, so label the
  // column where each month starts.
  const months = el('div', {
    display: 'grid',
    gridTemplateColumns: `repeat(${CALENDAR_WEEKS}, 13px)`,
    width: 'max-content',
    height: '13px',
    fontSize: '9px',
    color: '#767676',
  });
  let lastMonth = -1;
  for (let week = 0; week < CALENDAR_WEEKS; week++) {
    const columnStart = new Date(firstColumnStart + week * 7 * DAY_MS);
    const month = columnStart.getMonth();
    // Label a column only when its month differs from the previous column's,
    // and leave room so the text is not clipped by the next label.
    const isNewMonth = month !== lastMonth;
    lastMonth = month;
    const cell = el('div', {overflow: 'visible', whiteSpace: 'nowrap'});
    if (isNewMonth && week < CALENDAR_WEEKS - 2) {
      cell.textContent = MONTH_LABELS[month];
    }
    months.append(cell);
  }

  const grid = el('div', {
    display: 'grid',
    gridTemplateRows: 'repeat(7, 11px)',
    gridAutoFlow: 'column',
    gridAutoColumns: '11px',
    gap: '2px',
    width: 'max-content',
  });

  for (let week = 0; week < CALENDAR_WEEKS; week++) {
    for (let weekday = 0; weekday < 7; weekday++) {
      const day = firstColumnStart + (week * 7 + weekday) * DAY_MS;
      const cell = el('div', {
        width: '11px',
        height: '11px',
        borderRadius: '2px',
        backgroundColor: day > today ? 'transparent' : heatColor(countByDay.get(day) ?? 0, max),
      });
      if (day <= today) {
        const count = countByDay.get(day) ?? 0;
        cell.title = count
          ? UIString.chartsOn(count, formatDate(day))
          : `${formatDate(day)}: ${UIString.none}`;
      }
      grid.append(cell);
    }
  }
  const inner = el('div', {width: 'max-content'});
  inner.append(months);
  inner.append(grid);
  wrap.append(inner);
  outer.append(wrap);
  // The legend stays outside the scroller, so it does not slide out of view
  // with the grid.
  outer.append(drawLegend(max));
  // A year is wider than the panel, and the interesting end is the recent one,
  // so start scrolled to it rather than to last autumn.
  requestAnimationFrame(() => {
    wrap.scrollLeft = wrap.scrollWidth;
  });
  return outer;
}

/** Without a scale, a shade is just a shade. */
function drawLegend(max: number): HTMLElement {
  const legend = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    marginTop: '5px',
    fontSize: '9px',
    color: '#767676',
  });
  legend.append(el('span', {}, UIString.legendLess));
  for (let step = 0; step < 5; step++) {
    legend.append(
      el('div', {
        width: '11px',
        height: '11px',
        borderRadius: '2px',
        backgroundColor: heatColor(step === 0 ? 0 : (step / 5) * max, max),
      })
    );
  }
  legend.append(el('span', {}, UIString.legendMore));
  legend.append(el('span', {marginLeft: '4px'}, UIString.legendPeak(max)));
  return legend;
}

function bucketLabels(): string[] {
  return RECENCY_BUCKETS.map((d) => UIString.within(d)).concat(UIString.older);
}

function bucketOf(chart: ChartRow, now: number): number {
  if (!chart.lastPlayed) {
    return RECENCY_BUCKETS.length;
  }
  const age = daysAgo(chart.lastPlayed, now);
  for (let i = 0; i < RECENCY_BUCKETS.length; i++) {
    if (age <= RECENCY_BUCKETS[i]) {
      return i;
    }
  }
  return RECENCY_BUCKETS.length;
}

/** Sort levels the way the game does: 13 < 13+ < 14. */
function compareLevelText(a: string, b: string): number {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  if (na !== nb) {
    return nb - na;
  }
  return (b.includes('+') ? 1 : 0) - (a.includes('+') ? 1 : 0);
}

function drawLevelGrid(charts: ChartRow[], now: number): HTMLElement {
  const labels = bucketLabels();
  const byLevel = new Map<string, number[]>();
  for (const chart of charts) {
    let row = byLevel.get(chart.level);
    if (!row) {
      row = new Array(labels.length).fill(0);
      byLevel.set(chart.level, row);
    }
    row[bucketOf(chart, now)]++;
  }
  const levels = Array.from(byLevel.keys()).sort(compareLevelText);
  const max = Math.max(1, ...Array.from(byLevel.values()).flat());

  const wrap = el('div', {overflowX: 'auto'});
  const table = el('table', {
    borderCollapse: 'collapse',
    fontSize: '11px',
    width: 'max-content',
  });

  const head = el('tr');
  head.append(el('th', {padding: '3px 6px', textAlign: 'left', color: '#666'}, UIString.level));
  for (const label of labels) {
    head.append(el('th', {padding: '3px 6px', color: '#666', fontWeight: 'normal'}, label));
  }
  table.append(head);

  for (const level of levels) {
    const row = byLevel.get(level);
    const tr = el('tr');
    tr.append(el('td', {padding: '3px 6px', fontWeight: 'bold', whiteSpace: 'nowrap'}, level));
    row.forEach((count) => {
      tr.append(
        el(
          'td',
          {
            padding: '3px 6px',
            textAlign: 'center',
            backgroundColor: heatColor(count, max),
            color: count && count / max > 0.6 ? '#fff' : '#333',
          },
          count ? String(count) : ''
        )
      );
    });
    table.append(tr);
  }
  wrap.append(table);
  return wrap;
}

function drawStaleList(charts: ChartRow[], now: number): HTMLElement {
  const dated = charts.filter((c) => c.lastPlayed).sort((a, b) => a.lastPlayed - b.lastPlayed);
  const undated = charts.filter((c) => !c.lastPlayed);
  const shown = dated.concat(undated).slice(0, STALE_LIST_SIZE);

  const table = el('table', {borderCollapse: 'collapse', width: '100%', fontSize: '11px'});
  for (const chart of shown) {
    const tr = el('tr', {borderBottom: '1px solid #eee'});

    const name = el('td', {padding: '4px 4px', textAlign: 'left', wordBreak: 'break-word'});
    name.append(el('span', {}, chart.songName));
    name.append(
      el(
        'span',
        {color: '#999', fontSize: '10px', marginLeft: '4px'},
        getChartTypeName(chart.chartType)
      )
    );
    tr.append(name);

    tr.append(
      el(
        'td',
        {
          padding: '4px',
          whiteSpace: 'nowrap',
          color: getDifficultyTextColor(chart.difficulty),
          fontWeight: 'bold',
        },
        chart.level
      )
    );

    const age = chart.lastPlayed ? daysAgo(chart.lastPlayed, now) : -1;
    const ageText = age < 0 ? UIString.never : age === 0 ? UIString.today : UIString.days(age);
    tr.append(
      el('td', {padding: '4px', whiteSpace: 'nowrap', textAlign: 'right', color: '#666'}, ageText)
    );
    tr.append(
      el(
        'td',
        {padding: '4px', whiteSpace: 'nowrap', textAlign: 'right', color: '#999'},
        chart.lastPlayed ? formatDate(chart.lastPlayed) : ''
      )
    );
    table.append(tr);
  }
  return table;
}

// --------------------------------------------------------------------- panel

function createPanel(): {panel: HTMLElement; body: HTMLElement; close: () => void} {
  const backdrop = el('div', {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: '10000',
    overflowY: 'auto',
    padding: '16px 8px',
    boxSizing: 'border-box',
  });

  const panel = el('div', {
    maxWidth: '460px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '12px 14px 18px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
    color: '#333',
    fontSize: '12px',
  });

  const header = el('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  });
  header.append(el('h2', {margin: '0', fontSize: '16px'}, UIString.title));
  const closeButton = el('button', {
    border: 'none',
    background: '#eee',
    borderRadius: '4px',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: '12px',
  });
  closeButton.type = 'button';
  closeButton.textContent = UIString.close;
  header.append(closeButton);
  panel.append(header);

  const body = el('div');
  panel.append(body);
  backdrop.append(panel);

  const close = () => backdrop.remove();
  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', (evt) => {
    if (evt.target === backdrop) {
      close();
    }
  });

  document.body.append(backdrop);
  return {panel, body, close};
}

let running = false;

async function showOverview(): Promise<void> {
  if (running) {
    return;
  }
  running = true;
  const {body} = createPanel();
  const status = el('p', {margin: '10px 0', color: '#666'}, UIString.scanning);
  body.append(status);

  try {
    const charts = await collectPlayedCharts((text) => (status.textContent = text));
    if (!charts.length) {
      status.textContent = UIString.noCharts;
      return;
    }

    const bySong = new Map<string, ChartRow[]>();
    for (const chart of charts) {
      const group = bySong.get(chart.idx);
      if (group) {
        group.push(chart);
      } else {
        bySong.set(chart.idx, [chart]);
      }
    }

    const result = await fetchSongPlayInfo(
      Array.from(bySong.keys()),
      (idx, info) => {
        for (const chart of bySong.get(idx) ?? []) {
          const diffInfo = info[getDifficultyClassName(chart.difficulty)];
          if (diffInfo) {
            chart.lastPlayed = toEpochTime(diffInfo.lastPlayed);
            chart.playCount = diffInfo.count;
          }
        }
      },
      (done, total) => (status.textContent = UIString.fetching(done, total))
    );

    const now = Date.now();
    body.textContent = '';
    if (result.abortReason) {
      body.append(
        el('p', {margin: '8px 0', color: '#b00'}, UIString.stoppedEarly(result.abortReason))
      );
    }
    body.append(
      el('p', {margin: '8px 0', color: '#666'}, UIString.summary(charts.length, bySong.size))
    );

    body.append(sectionHeading(UIString.calendar));
    body.append(drawCalendar(charts, now));

    body.append(sectionHeading(UIString.grid));
    body.append(drawLevelGrid(charts, now));

    body.append(sectionHeading(UIString.stale));
    body.append(drawStaleList(charts, now));
  } catch (e) {
    console.error('[play-heatmap]', e);
    status.textContent = String(e);
  } finally {
    running = false;
  }
}

export function addLastPlayedOverviewButton(d: Document): void {
  const anchor = d.body.querySelector('.main_wrapper.t_c .screw_block');
  if (!anchor || d.getElementById('maiToolsPlayOverviewButton')) {
    return;
  }
  const container = el('div', {margin: '10px 15px'});
  const button = el('button', {
    width: '100%',
    padding: '8px',
    fontSize: '13px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
  });
  button.id = 'maiToolsPlayOverviewButton';
  button.type = 'button';
  button.textContent = UIString.button;
  button.addEventListener('click', showOverview);
  container.append(button);
  anchor.insertAdjacentElement('beforebegin', container);
}
