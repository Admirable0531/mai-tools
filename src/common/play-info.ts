// Contract between play-last (which fetches the values) and score-sort (which
// sorts by them). Kept free of logic so importing it does not pull the fetching
// code into the score-sort bundle.

/** Fired on `document` whenever a batch of rows has finished being annotated. */
export const PLAY_INFO_READY_EVENT = 'mai-tools:play-info-ready';

/**
 * Fired on `document` to ask for every row on the page, not just the visible
 * ones. Sorting by play count or last played needs the whole page to mean
 * anything, so choosing one of those sorts is the opt-in.
 */
export const REQUEST_ALL_EVENT = 'mai-tools:request-all-play-info';

/** Play count, as an integer string. Absent when the row was not annotated. */
export const PLAY_COUNT_ATTR = 'data-mt-play-count';

/** Last played date, as epoch milliseconds. 0 when the page did not report one. */
export const LAST_PLAYED_ATTR = 'data-mt-last-played';
