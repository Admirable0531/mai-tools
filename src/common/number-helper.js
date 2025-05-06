"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFloat = exports.roundFloat = exports.sum = exports.compareNumber = void 0;
function compareNumber(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
exports.compareNumber = compareNumber;
function sum(values) {
    let total = 0;
    for (const v of values) {
        total += v;
    }
    return total;
}
exports.sum = sum;
function roundFloat(num, method, unit) {
    return Math[method](num / unit) * unit;
}
exports.roundFloat = roundFloat;
function formatFloat(n, digits) {
    if (n) {
        return n.toFixed(digits);
    }
    return "0";
}
exports.formatFloat = formatFloat;
