"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayRecordFromRow = exports.getChartRecordFromPlayRecordRow = exports.getIsNewRecord = exports.PLAY_HISTORY_PATH = void 0;
const chart_type_1 = require("./chart-type");
const date_util_1 = require("./date-util");
const difficulties_1 = require("./difficulties");
const dx_star_1 = require("./dx-star");
const song_name_helper_1 = require("./song-name-helper");
exports.PLAY_HISTORY_PATH = '/maimai-mobile/record/';
// Only include tab and new line, but not space.
const FRONT_WHITESPACE_REGEX = /^[\n\t]/g;
const END_WHITESPACE_REGEX = /[\n\t]$/g;
const AP_FC_IMG_NAME_TO_TEXT = new Map([
    ['fc', 'FC'],
    ['fcplus', 'FC+'],
    ['ap', 'AP'],
    ['applus', 'AP+'],
]);
const SYNC_IMG_NAME_TO_TEXT = new Map([
    ['fs', 'FS'],
    ['fsplus', 'FS+'],
    ['fsd', 'FSD'],
    ['fsdplus', 'FSD+'],
]);
function getPlayDate(row) {
    const playDateText = row.querySelector('.sub_title').children[1].innerText;
    const m = playDateText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    const japanDt = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]));
    return (0, date_util_1.fixTimezone)(japanDt);
}
function getSongName(row) {
    try {
        return Array.from(row.querySelector('.m_5.p_5.f_13').childNodes)
            .reverse()
            .find((node) => node instanceof Text)
            .textContent.replace(FRONT_WHITESPACE_REGEX, '')
            .replace(END_WHITESPACE_REGEX, '');
    }
    catch (e) {
        console.log(e);
        console.log(row);
        return '';
    }
}
function getSongImgSrc(row) {
    const img = row.querySelector('.music_img');
    return img ? img.src : '';
}
function getDifficulty(row) {
    const recordBody = row.children[1];
    const cn = recordBody.className;
    let diff = cn.substring(cn.indexOf('_') + 1, cn.lastIndexOf('_'));
    return (0, difficulties_1.getDifficultyByName)(diff);
}
function getAchievement(row) {
    return parseFloat(row.querySelector('.playlog_achievement_txt').innerText);
}
function getDxStar(row) {
    const dxStarIndex = (0, dx_star_1.calculateDetailedDxStar)(row);
    return (0, dx_star_1.getDxStarText)(dxStarIndex);
}
function getRank(row) {
    const rankImgSrc = row.querySelector('img.playlog_scorerank').src.replace(/\?ver=.*$/, '');
    return rankImgSrc
        .substring(rankImgSrc.lastIndexOf('/') + 1, rankImgSrc.lastIndexOf('.'))
        .replace('plus', '+')
        .toUpperCase();
}
function getMarks(row) {
    const results = [];
    // FC/AP
    const stampImgs = row.querySelectorAll('.playlog_result_innerblock > img');
    const fcapSrc = stampImgs[0].src.replace(/\?ver=.*$/, '');
    const fcapImgName = fcapSrc.substring(fcapSrc.lastIndexOf('/') + 1, fcapSrc.lastIndexOf('.'));
    if (AP_FC_IMG_NAME_TO_TEXT.has(fcapImgName)) {
        results.push(AP_FC_IMG_NAME_TO_TEXT.get(fcapImgName));
    }
    // SYNC
    const fullSyncSrc = stampImgs[1].src.replace(/\?ver=.*$/, '');
    const fullSyncImgName = fullSyncSrc.substring(fullSyncSrc.lastIndexOf('/') + 1, fullSyncSrc.lastIndexOf('.'));
    if (SYNC_IMG_NAME_TO_TEXT.has(fullSyncImgName)) {
        results.push(SYNC_IMG_NAME_TO_TEXT.get(fullSyncImgName));
    }
    // DX Star
    const dxStar = getDxStar(row);
    if (dxStar) {
        results.push(dxStar);
    }
    return results.join(' ');
}
function getIsNewRecord(row) {
    return !!row.querySelector('.playlog_achievement_label_block + img.playlog_achievement_newrecord');
}
exports.getIsNewRecord = getIsNewRecord;
function getChartRecordFromPlayRecordRow(row, songDb) {
    const songName = getSongName(row);
    const chartType = (0, chart_type_1.getChartType)(row);
    const songImgSrc = getSongImgSrc(row);
    const genre = (0, song_name_helper_1.getSongGenreFromImg)(songName, songImgSrc);
    const difficulty = getDifficulty(row);
    const props = songDb.getSongProperties(songName, genre, chartType);
    const level = difficulty !== 5 /* Difficulty.UTAGE */ && props ? props.lv[difficulty] : 0;
    return {
        songName,
        genre,
        chartType,
        difficulty,
        achievement: getAchievement(row),
        level,
    };
}
exports.getChartRecordFromPlayRecordRow = getChartRecordFromPlayRecordRow;
function getPlayRecordFromRow(row, songDb) {
    const baseRecord = getChartRecordFromPlayRecordRow(row, songDb);
    return Object.assign(Object.assign({}, baseRecord), { date: getPlayDate(row), songImgSrc: getSongImgSrc(row), rank: getRank(row), marks: getMarks(row), isNewRecord: getIsNewRecord(row) });
}
exports.getPlayRecordFromRow = getPlayRecordFromRow;
