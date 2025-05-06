"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRating = exports.getAvg = exports.calculateFullRating = exports.calculateRatingRange = void 0;
const number_helper_1 = require("./number-helper");
const rank_functions_1 = require("./rank-functions");
function calculateRatingRange(lv, rank) {
    const rankDefs = (0, rank_functions_1.getRankDefinitions)();
    const idx = rankDefs.indexOf(rank);
    const minRating = Math.floor(lv * rank.minAchv * rank.factor);
    if (rank.maxAchv && rank.maxFactor) {
        return [minRating, Math.floor(lv * rank.maxAchv * rank.maxFactor)];
    }
    const maxAchv = idx >= 1 ? rankDefs[idx - 1].minAchv - 0.0001 : rank.minAchv;
    return [minRating, Math.floor(lv * maxAchv * rank.factor)];
}
exports.calculateRatingRange = calculateRatingRange;
function calculateFullRating(songs, count) {
    let allLvs = [];
    for (const song of songs) {
        allLvs = allLvs.concat(song.lv.filter((lv) => typeof lv === 'number').map((lv) => Math.abs(lv)));
    }
    allLvs.sort(number_helper_1.compareNumber);
    const topLvs = allLvs.slice(Math.max(0, allLvs.length - count));
    let totalRating = 0;
    for (const lv of topLvs) {
        totalRating += Math.floor(lv * rank_functions_1.RANK_SSS_PLUS.minAchv * rank_functions_1.RANK_SSS_PLUS.factor);
    }
    return totalRating;
}
exports.calculateFullRating = calculateFullRating;
function getAvg(sum, count) {
    return count ? (sum / count).toFixed(0) : 0;
}
exports.getAvg = getAvg;
function getRating(level, achv) {
    const achievement = Math.min(achv, rank_functions_1.RANK_SSS_PLUS.minAchv);
    const rank = (0, rank_functions_1.getRankByAchievement)(achievement);
    if (!rank) {
        console.warn(`Could not find rank for achievement ${achievement.toFixed(4)}%`);
        return 0;
    }
    const positiveLv = Math.abs(level);
    if (rank.maxAchv && rank.maxFactor && rank.maxAchv == achv) {
        return positiveLv * rank.maxAchv * rank.maxFactor;
    }
    return positiveLv * achievement * rank.factor;
}
exports.getRating = getRating;
