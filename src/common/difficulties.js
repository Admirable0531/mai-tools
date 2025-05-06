"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDifficultyTextColor = exports.getDifficultyClassName = exports.getDifficultyForRecord = exports.getDifficultyByName = exports.getDifficultyShortName = exports.getDifficultyFromShortName = exports.getDifficultyNameForDxRatingNet = exports.getDifficultyName = exports.DIFFICULTIES = void 0;
exports.DIFFICULTIES = [
    0 /* Difficulty.BASIC */,
    1 /* Difficulty.ADVANCED */,
    2 /* Difficulty.EXPERT */,
    3 /* Difficulty.MASTER */,
    4 /* Difficulty.ReMASTER */,
];
const DIFFICULTY_TEXT = ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'Re:MASTER', 'UTAGE'];
const DIFFICULTY_SHORT_TEXT = ['BAS', 'ADV', 'EXP', 'MAS', 'ReM', 'UTG'];
function getDifficultyName(diff) {
    return DIFFICULTY_TEXT[diff];
}
exports.getDifficultyName = getDifficultyName;
function getDifficultyNameForDxRatingNet(d) {
    switch (d) {
        case 0 /* Difficulty.BASIC */:
            return 'basic';
        case 1 /* Difficulty.ADVANCED */:
            return 'advanced';
        case 2 /* Difficulty.EXPERT */:
            return 'expert';
        case 3 /* Difficulty.MASTER */:
            return 'master';
        case 4 /* Difficulty.ReMASTER */:
            return 'remaster';
        case 5 /* Difficulty.UTAGE */:
            return 'utage';
        default:
            return 'unknown';
    }
}
exports.getDifficultyNameForDxRatingNet = getDifficultyNameForDxRatingNet;
function getDifficultyFromShortName(diff) {
    return DIFFICULTY_SHORT_TEXT.findIndex((d) => d.toLowerCase() === diff.toLowerCase());
}
exports.getDifficultyFromShortName = getDifficultyFromShortName;
function getDifficultyShortName(diff) {
    return DIFFICULTY_SHORT_TEXT[diff];
}
exports.getDifficultyShortName = getDifficultyShortName;
function getDifficultyByName(cn) {
    const diff = DIFFICULTY_TEXT.indexOf(cn.toUpperCase());
    return diff < 0 ? 4 /* Difficulty.ReMASTER */ : diff;
}
exports.getDifficultyByName = getDifficultyByName;
function getDifficultyForRecord(row) {
    const diffImg = row.querySelector('.playlog_top_container img.playlog_diff');
    const src = diffImg.src;
    const d = src.substring(src.lastIndexOf('_') + 1, src.lastIndexOf('.'));
    return getDifficultyByName(d);
}
exports.getDifficultyForRecord = getDifficultyForRecord;
/** @return class name to be applied on HTML elements */
function getDifficultyClassName(diff) {
    return ['basic', 'advanced', 'expert', 'master', 'remaster', 'utage'][diff] || '';
}
exports.getDifficultyClassName = getDifficultyClassName;
function getDifficultyTextColor(diff) {
    return ([
        '#45c124',
        '#ffba01',
        '#ff7b7b',
        '#9f51dc',
        '#dbaaff',
        '#f540f3', // utage
    ][diff] || 'black');
}
exports.getDifficultyTextColor = getDifficultyTextColor;
