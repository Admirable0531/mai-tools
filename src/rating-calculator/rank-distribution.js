"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRankMap = exports.getRankDistribution = void 0;
const rank_functions_1 = require("../common/rank-functions");
function getRankDistribution(scoreList) {
    const rankDefs = (0, rank_functions_1.getRankDefinitions)();
    const countPerRank = new Map();
    for (const r of rankDefs) {
        countPerRank.set(r.title, 0);
    }
    scoreList.forEach((record) => {
        const rankTitle = (0, rank_functions_1.getRankTitle)(record.achievement);
        const rankCount = countPerRank.get(rankTitle);
        countPerRank.set(rankTitle, rankCount + 1);
    });
    return countPerRank;
}
exports.getRankDistribution = getRankDistribution;
function getRankMap(records) {
    const overallRankDistribution = getRankDistribution(records);
    const rankMap = new Map();
    let remaining = records.length;
    for (const [rank, count] of overallRankDistribution) {
        if (remaining > 0) {
            rankMap.set(rank, true);
        }
        remaining -= count;
    }
    return rankMap;
}
exports.getRankMap = getRankMap;
