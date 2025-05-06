"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcRecommendedLevels = exports.getFinaleRankTitle = exports.getRankTitle = exports.getRankByAchievement = exports.getRankIndexByAchievement = exports.getRankDefinitions = exports.RANK_SSS_PLUS = exports.RANK_S = void 0;
const level_helper_1 = require("./level-helper");
const number_helper_1 = require("./number-helper");
exports.RANK_S = {
    minAchv: 97.0,
    factor: 0.2,
    title: 'S',
};
exports.RANK_SSS_PLUS = {
    minAchv: 100.5,
    factor: 0.224,
    title: 'SSS+',
};
const RANK_DEFINITIONS = [
    exports.RANK_SSS_PLUS,
    { minAchv: 100.0, factor: 0.216, title: 'SSS', maxAchv: 100.4999, maxFactor: 0.222 },
    { minAchv: 99.5, factor: 0.211, title: 'SS+', maxAchv: 99.9999, maxFactor: 0.214 },
    { minAchv: 99.0, factor: 0.208, title: 'SS' },
    { minAchv: 98.0, factor: 0.203, title: 'S+', maxAchv: 98.9999, maxFactor: 0.206 },
    exports.RANK_S,
    {
        minAchv: 94.0,
        factor: 0.168,
        title: 'AAA',
        maxAchv: 96.9999,
        maxFactor: 0.176,
    },
    { minAchv: 90.0, factor: 0.152, title: 'AA' },
    { minAchv: 80.0, factor: 0.136, title: 'A' },
    {
        minAchv: 75.0,
        factor: 0.12,
        title: 'BBB',
        maxAchv: 79.9999,
        maxFactor: 0.128,
    },
    { minAchv: 70.0, factor: 0.112, title: 'BB' },
    { minAchv: 60.0, factor: 0.096, title: 'B' },
    { minAchv: 50.0, factor: 0.08, title: 'C' },
    { minAchv: 0.0, factor: 0.016, title: 'D' },
];
function getRankDefinitions() {
    return RANK_DEFINITIONS;
}
exports.getRankDefinitions = getRankDefinitions;
function getRankIndexByAchievement(achievement) {
    return RANK_DEFINITIONS.findIndex((rank) => {
        return achievement >= rank.minAchv;
    });
}
exports.getRankIndexByAchievement = getRankIndexByAchievement;
function getRankByAchievement(achievement) {
    const idx = getRankIndexByAchievement(achievement);
    return idx < 0 ? null : getRankDefinitions()[idx];
}
exports.getRankByAchievement = getRankByAchievement;
function getRankTitle(achievement) {
    const idx = getRankIndexByAchievement(achievement);
    return idx < 0 ? 'D' : RANK_DEFINITIONS[idx].title;
}
exports.getRankTitle = getRankTitle;
function getFinaleRankTitle(achievement) {
    return getRankTitle(achievement).replace('SSS+', 'SSS');
}
exports.getFinaleRankTitle = getFinaleRankTitle;
/** Returns recommended levels by rank title */
function calcRecommendedLevels(rating, ranks) {
    rating = Math.floor(rating);
    const ranksLowToHigh = ranks.slice();
    ranksLowToHigh.sort((r1, r2) => {
        return r1.minAchv < r2.minAchv ? -1 : 1;
    });
    const levelsByRank = {};
    for (let rankIdx = 0; rankIdx < ranksLowToHigh.length; rankIdx++) {
        const r = ranksLowToHigh[rankIdx];
        levelsByRank[r.title] = [];
        const levels = levelsByRank[r.title];
        let maxLv = (0, number_helper_1.roundFloat)(rating / r.factor / r.minAchv, 'ceil', 0.1);
        if (maxLv > level_helper_1.MAX_LEVEL)
            continue;
        /* Show another 0.1 level. This is too verbose so disable it for now */
        // const previousLevels = rankIdx > 0 ? levelsByRank[ranksLowToHigh[rankIdx - 1].title] : [];
        // if (previousLevels.length && maxLv + 0.1 < previousLevels[previousLevels.length - 1].lv) {
        //   maxLv += 0.1;
        // }
        // NOTE(myjian): ignore r.maxAchv and r.maxFactor because it makes levels unnecessarily long
        const maxAchv = rankIdx + 1 < ranksLowToHigh.length
            ? ranksLowToHigh[rankIdx + 1].minAchv - 0.0001
            : r.minAchv;
        while (Math.floor(maxLv * r.factor * maxAchv) >= rating) {
            const minAchv = Math.max((0, number_helper_1.roundFloat)(rating / r.factor / maxLv, 'ceil', 0.0001), r.minAchv);
            levels.push({
                lv: maxLv,
                minAchv,
                rating: Math.floor(maxLv * r.factor * minAchv),
            });
            maxLv -= 0.1;
        }
        levels.reverse();
    }
    return levelsByRank;
}
exports.calcRecommendedLevels = calcRecommendedLevels;
