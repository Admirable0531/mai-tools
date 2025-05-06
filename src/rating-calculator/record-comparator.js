"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareSongsByChartType = exports.compareSongsByNextRank = exports.compareSongsByName = exports.compareSongsByAchv = exports.compareSongsByLevel = exports.compareSongsByNextRating = exports.compareCandidate = exports.compareSongsByRating = void 0;
function compareNumbers(x, y) {
    return x > y ? -1 : Number(x < y);
}
function compareSongsByStrAttr(a, b, f) {
    return a[f].localeCompare(b[f]);
}
function compareSongsByNumAttr(a, b, f) {
    return compareNumbers(a[f], b[f]);
}
function compareSongsByRating(record1, record2) {
    return (compareSongsByNumAttr(record1, record2, 'rating') ||
        compareSongsByNumAttr(record1, record2, 'level') ||
        compareSongsByNumAttr(record1, record2, 'achievement'));
}
exports.compareSongsByRating = compareSongsByRating;
function compareCandidate(record1, record2) {
    const nextRating1 = record1.nextRanks.values().next().value;
    const nextRating2 = record2.nextRanks.values().next().value;
    if (!nextRating1 && !nextRating2) {
        return 0;
    }
    else if (!nextRating1) {
        // Put record2 first
        return 1;
    }
    else if (!nextRating2) {
        // Put record1 first
        return -1;
    }
    const costPerformance1 = nextRating1.minRt / (nextRating1.rank.minAchv - record1.achievement);
    const costPerformance2 = nextRating2.minRt / (nextRating2.rank.minAchv - record2.achievement);
    return (compareNumbers(costPerformance1, costPerformance2) ||
        compareNumbers(nextRating1.minRt, nextRating2.minRt) ||
        compareSongsByNumAttr(record1, record2, 'level'));
}
exports.compareCandidate = compareCandidate;
function compareSongsByNextRating(record1, record2) {
    const nextRating1 = record1.nextRanks.values().next().value;
    const nextRating2 = record2.nextRanks.values().next().value;
    return (compareNumbers(nextRating1.minRt, nextRating2.minRt) ||
        compareSongsByNumAttr(record1, record2, 'level'));
}
exports.compareSongsByNextRating = compareSongsByNextRating;
function compareSongsByLevel(record1, record2) {
    // smaller first
    return compareSongsByNumAttr(record2, record1, 'level');
}
exports.compareSongsByLevel = compareSongsByLevel;
function compareSongsByAchv(record1, record2) {
    return compareSongsByNumAttr(record1, record2, 'achievement');
}
exports.compareSongsByAchv = compareSongsByAchv;
function compareSongsByName(record1, record2) {
    return compareSongsByStrAttr(record1, record2, 'songName');
}
exports.compareSongsByName = compareSongsByName;
function compareSongsByNextRank(record1, record2) {
    const nextRank1 = record1.nextRanks.values().next().value.rank;
    const nextRank2 = record2.nextRanks.values().next().value.rank;
    return compareNumbers(nextRank1.minAchv, nextRank2.minAchv);
}
exports.compareSongsByNextRank = compareSongsByNextRank;
function compareSongsByChartType(record1, record2) {
    const type1 = record1.chartType;
    const type2 = record2.chartType;
    return compareNumbers(type1, type2);
}
exports.compareSongsByChartType = compareSongsByChartType;
