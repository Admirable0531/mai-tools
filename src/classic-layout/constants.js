"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_JUDGEMENT_OBJ = exports.BREAK_BONUS_MULTIPLIER = exports.BREAK_BASE_SCORE_MULTIPLIER = exports.MAX_BREAK_POINTS = exports.BREAK_BONUS_POINTS = exports.REGULAR_BASE_SCORE_MULTIPLIER = exports.BASE_SCORE_PER_TYPE = exports.DX_NOTE_TYPES = void 0;
exports.DX_NOTE_TYPES = ['tap', 'hold', 'slide', 'touch', 'break'];
exports.BASE_SCORE_PER_TYPE = {
    tap: 500,
    hold: 1000,
    touch: 500,
    slide: 1500,
    break: 2500,
};
exports.REGULAR_BASE_SCORE_MULTIPLIER = {
    cp: 1,
    perfect: 1,
    great: 0.8,
    good: 0.5,
    miss: 0,
};
exports.BREAK_BONUS_POINTS = 100;
exports.MAX_BREAK_POINTS = (exports.BASE_SCORE_PER_TYPE.break + exports.BREAK_BONUS_POINTS);
exports.BREAK_BASE_SCORE_MULTIPLIER = new Map([
    [exports.MAX_BREAK_POINTS, 1],
    [2550, 1],
    [2500, 1],
    [2000, 0.8],
    [1500, 0.6],
    [1250, 0.5],
    [1000, 0.4],
    [0, 0],
]);
exports.BREAK_BONUS_MULTIPLIER = new Map([
    [exports.MAX_BREAK_POINTS, 1],
    [2550, 0.75],
    [2500, 0.5],
    [2000, 0.4],
    [1500, 0.4],
    [1250, 0.4],
    [1000, 0.3],
    [0, 0],
]);
exports.EMPTY_JUDGEMENT_OBJ = {
    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,
};
