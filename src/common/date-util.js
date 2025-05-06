"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.fixTimezone = void 0;
// 540 = 9 * 60 minutes = UTC+9 (Japan Time), 1 minute = 60000 milliseconds
const timezoneOffset = (540 + new Date().getTimezoneOffset()) * 60000;
/**
 * Get date with correct timezone. The date displayed on maimai NET is always
 * Japan Time (UTC-9), which can be different from the actual time zone the player
 * is at.
 */
function fixTimezone(japanDt) {
    return new Date(japanDt.valueOf() - timezoneOffset);
}
exports.fixTimezone = fixTimezone;
function padNumberWithZeros(n, len) {
    len = len || 2;
    return n.toString().padStart(len, '0');
}
function formatDate(dt, hourMinuteSep = ':') {
    return (dt.getFullYear() +
        '-' +
        padNumberWithZeros(dt.getMonth() + 1) +
        '-' +
        padNumberWithZeros(dt.getDate()) +
        ' ' +
        padNumberWithZeros(dt.getHours()) +
        hourMinuteSep +
        padNumberWithZeros(dt.getMinutes()));
}
exports.formatDate = formatDate;
