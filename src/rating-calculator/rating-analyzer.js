"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePlayerRating = exports.NUM_TOP_OLD_CHARTS = exports.NUM_TOP_NEW_CHARTS = void 0;
const rating_functions_1 = require("../common/rating-functions");
const removed_songs_1 = require("../common/removed-songs");
const record_comparator_1 = require("./record-comparator");
exports.NUM_TOP_NEW_CHARTS = 15;
exports.NUM_TOP_OLD_CHARTS = 35;
/**
 * Compute rating value based on the chart level and player achievement.
 * If we don't find the inner level for the chart, use its estimated level and move on.
 */
function getRecordWithRating(record, songProps) {
    if (songProps) {
        const lv = songProps.lv[record.difficulty];
        if (typeof lv === 'number') {
            record.level = Math.abs(lv);
        }
    }
    return Object.assign(Object.assign({}, record), { rating: (0, rating_functions_1.getRating)(record.level, record.achievement) });
}
/**
 * @param excludeSongsWithNoProps Set this to true when you want to calculate rating for past
 *    versions but don't want to include new songs.
 */
function analyzePlayerRating(songDb, date, playerName, playerScores, gameRegion, gameVer, excludeSongsWithNoProps) {
    const newChartRecords = [];
    const oldChartRecords = [];
    const removedSongs = (0, removed_songs_1.getRemovedSongs)(gameRegion, gameVer);
    for (const record of playerScores) {
        if (removedSongs.includes(record.songName)) {
            continue;
        }
        const songProps = songDb.getSongProperties(record.songName, record.genre, record.chartType);
        if (excludeSongsWithNoProps && !songProps) {
            continue;
        }
        const isNewChart = songProps ? songProps.debut === gameVer : record.chartType === 1 /* ChartType.DX */;
        const recordWithRating = getRecordWithRating(record, songProps);
        if (isNewChart) {
            newChartRecords.push(recordWithRating);
        }
        else {
            oldChartRecords.push(recordWithRating);
        }
    }
    newChartRecords.sort(record_comparator_1.compareSongsByRating);
    oldChartRecords.sort(record_comparator_1.compareSongsByRating);
    let newChartsRating = 0;
    const newTopChartsCount = Math.min(exports.NUM_TOP_NEW_CHARTS, newChartRecords.length);
    for (let i = 0; i < newTopChartsCount; i++) {
        const rec = newChartRecords[i];
        rec.isTarget = true;
        newChartsRating += Math.floor(rec.rating);
    }
    let oldChartsRating = 0;
    const oldTopChartsCount = Math.min(exports.NUM_TOP_OLD_CHARTS, oldChartRecords.length);
    for (let i = 0; i < oldTopChartsCount; i++) {
        const rec = oldChartRecords[i];
        rec.isTarget = true;
        oldChartsRating += Math.floor(rec.rating);
    }
    return {
        date,
        newChartRecords,
        newChartsRating,
        newTopChartsCount,
        oldChartRecords,
        oldChartsRating,
        oldTopChartsCount,
        playerName,
    };
}
exports.analyzePlayerRating = analyzePlayerRating;
