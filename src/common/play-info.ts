// Contract between play-last (which fetches the values) and score-sort (which
// sorts by them). Kept free of logic so importing it does not pull the fetching
// code into the score-sort bundle.

/** Fired on `document` once every row that could be annotated has been. */
export const PLAY_INFO_READY_EVENT = 'mai-tools:play-info-ready';

/** Play count, as an integer string. Absent when the row was not annotated. */
export const PLAY_COUNT_ATTR = 'data-mt-play-count';

/** Last played date, as epoch milliseconds. 0 when the page did not report one. */
export const LAST_PLAYED_ATTR = 'data-mt-last-played';
