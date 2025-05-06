"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotPlayedCharts = exports.getCandidateCharts = void 0;
const array_util_1 = require("../common/array-util");
const difficulties_1 = require("../common/difficulties");
const rank_functions_1 = require("../common/rank-functions");
const rating_functions_1 = require("../common/rating-functions");
const song_name_helper_1 = require("../common/song-name-helper");
const record_comparator_1 = require("./record-comparator");
// const MIN_RATING_ADJUSTMENT = 10; // for sorting order tweak
const LOWEST_RANK_FOR_CANDIDATE = (0, rank_functions_1.getRankIndexByAchievement)(94);
function getNextRating(record, lowestRating, numOfRanks) {
    // Choose the higher one (if 50% vs 94%, choose 94%; if 98% vs 94%. choose 98%)
    let rankDefIdx = Math.min((0, rank_functions_1.getRankIndexByAchievement)(record.achievement), LOWEST_RANK_FOR_CANDIDATE);
    const ranks = (0, rank_functions_1.getRankDefinitions)();
    const ratingByRank = new Map();
    for (let i = rankDefIdx - 1; i >= 0; i--) {
        const rank = ranks[i];
        if (rank.title === ranks[i + 1].title) {
            continue;
        }
        const [minRt] = (0, rating_functions_1.calculateRatingRange)(record.level, rank);
        if (minRt > lowestRating) {
            ratingByRank.set(rank.title, { minRt: minRt - lowestRating, rank });
            if (ratingByRank.size >= numOfRanks) {
                break;
            }
        }
    }
    return ratingByRank;
}
function getCandidateCharts(records, topCount, count, requiredLv) {
    const candidates = [];
    if (topCount <= 0) {
        return candidates;
    }
    for (let i = 0; i < topCount; i++) {
        const record = records[i];
        if (record.achievement >= rank_functions_1.RANK_SSS_PLUS.minAchv)
            continue;
        if (requiredLv && (record.level < requiredLv.minLv || record.level > requiredLv.maxLv))
            continue;
        record.nextRanks = getNextRating(record, Math.floor(record.rating), 2);
        candidates.push(record);
    }
    const minRating = Math.floor(records[topCount - 1].rating);
    for (let i = topCount; i < records.length; i++) {
        const record = records[i];
        if (record.achievement >= rank_functions_1.RANK_SSS_PLUS.minAchv)
            continue;
        if (requiredLv && (record.level < requiredLv.minLv || record.level > requiredLv.maxLv))
            continue;
        const ratingByRank = getNextRating(record, minRating, 2);
        if (!ratingByRank.size) {
            continue;
        }
        record.nextRanks = ratingByRank;
        candidates.push(record);
        if (candidates.length >= count) {
            break;
        }
    }
    candidates.sort(record_comparator_1.compareCandidate);
    return candidates;
}
exports.getCandidateCharts = getCandidateCharts;
/**
 * @param songList List of all available songs
 * @param records Played charts
 * @param count Number of not played charts to return
 * @param requiredLv Required level (choose only charts of this level)
 */
function getNotPlayedCharts(songList, records, minRating, count, requiredLv) {
    const playedCharts = new Set();
    for (const r of records) {
        const key = (0, song_name_helper_1.getSheetIdForDxRatingNet)(r.songName, r.genre, r.chartType, r.difficulty);
        playedCharts.add(key);
    }
    const maxRating = records.length ? Math.ceil(records[0].rating) : 0;
    const hardestLv = requiredLv
        ? requiredLv.maxLv
        : maxRating
            ? maxRating / (rank_functions_1.RANK_S.factor * rank_functions_1.RANK_S.minAchv)
            : 15;
    const easiestLv = requiredLv
        ? requiredLv.minLv
        : minRating / (rank_functions_1.RANK_SSS_PLUS.factor * rank_functions_1.RANK_SSS_PLUS.minAchv);
    const candidates = [];
    const shuffledSongList = (0, array_util_1.shuffleArray)(songList);
    for (const s of shuffledSongList) {
        // index 1 means ADVANCED (skip BASIC)
        for (let index = 1; index < s.lv.length; index++) {
            const level = s.lv[index];
            const positiveLv = Math.abs(level);
            // Math.min is hack for newly added Re:MASTER charts.
            // I think the hack is no longer needed as I made parseSongProperties check lv array length,
            // but just want to stay safe.
            const diff = difficulties_1.DIFFICULTIES[Math.min(index, difficulties_1.DIFFICULTIES.length - 1)];
            const key = (0, song_name_helper_1.getSheetIdForDxRatingNet)(s.name, s.genre, s.dx, diff);
            if (playedCharts.has(key) || positiveLv < easiestLv || positiveLv > hardestLv) {
                continue; // skip played, too easy, or too hard charts
            }
            const record = {
                songName: s.name,
                difficulty: diff,
                level,
                genre: '',
                chartType: s.dx,
                rating: 0,
                achievement: 0,
            };
            const ratingByRank = getNextRating(record, minRating, 1);
            if (!ratingByRank.size) {
                continue;
            }
            record.nextRanks = ratingByRank;
            candidates.push(record);
        }
        if (candidates.length >= count) {
            break;
        }
    }
    candidates.sort(record_comparator_1.compareSongsByLevel);
    return candidates;
}
exports.getNotPlayedCharts = getNotPlayedCharts;
