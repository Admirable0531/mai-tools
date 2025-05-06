"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriendDxStar = exports.getSyncStatus = exports.getApFcStatus = exports.getAchievement = exports.getPlayerGrade = exports.getPlayerName = exports.getChartDifficulty = exports.getChartLevel = exports.getSongName = void 0;
const difficulties_1 = require("./difficulties");
const song_name_helper_1 = require("./song-name-helper");
function getSongName(row) {
    const playRecordSongNameElem = row.querySelector('.basic_block.break');
    if (playRecordSongNameElem) {
        // There can be 1 or 2 childNodes depending on whether "CLEAR!" image exists.
        // If "CLEAR!" image exists, it will be the first childNode.
        // Therefore, we always retrieve song name from the last childNode.
        return playRecordSongNameElem.childNodes.item(playRecordSongNameElem.childNodes.length - 1)
            .nodeValue;
    }
    return (0, song_name_helper_1.normalizeSongName)(row.querySelector('.music_name_block').innerText);
}
exports.getSongName = getSongName;
function getChartLevel(row) {
    return row.querySelector('.music_lv_block').innerText;
}
exports.getChartLevel = getChartLevel;
function getChartDifficulty(row) {
    if (!row.classList.contains('pointer')) {
        const actualRow = row.querySelector('.pointer');
        row = actualRow || row;
    }
    const d = row.className.match(/music_([a-z]+)_score_back/)[1];
    return (0, difficulties_1.getDifficultyByName)(d);
}
exports.getChartDifficulty = getChartDifficulty;
function getPlayerName(n) {
    var _a, _b;
    if (n.className.includes('friend_vs_friend_block')) {
        return (_a = n.querySelector('.t_l')) === null || _a === void 0 ? void 0 : _a.innerText;
    }
    return (_b = n.querySelector('.name_block')) === null || _b === void 0 ? void 0 : _b.innerText;
}
exports.getPlayerName = getPlayerName;
function getPlayerGrade(n) {
    const gradeImg = n.querySelector('.user_data_block_line ~ img.h_25');
    if (gradeImg instanceof HTMLImageElement) {
        const gradeIdx = gradeImg.src.lastIndexOf('grade_');
        return gradeImg.src.substring(gradeIdx + 6, gradeIdx + 8);
    }
    return null;
}
exports.getPlayerGrade = getPlayerGrade;
function getAchievement(row, isFriendScore = false) {
    const elem = isFriendScore
        ? row.querySelector('tr:first-child td:last-child')
        : row.querySelectorAll('.music_score_block')[0];
    return elem instanceof HTMLElement ? parseFloat(elem.innerText) : 0;
}
exports.getAchievement = getAchievement;
function getApFcStatus(row, isFriendScore = false) {
    const img = isFriendScore
        ? row.querySelector('tr:last-child td:last-child img:nth-child(2)')
        : row.children[0].querySelector('img.f_r:nth-last-of-type(2)');
    if (!(img instanceof HTMLImageElement)) {
        return null;
    }
    const statusImgSrc = img.src.replace(/\?ver=.*$/, '');
    const lastUnderscoreIdx = statusImgSrc.lastIndexOf('_');
    const lastDotIdx = statusImgSrc.lastIndexOf('.');
    const lowercaseStatus = statusImgSrc.substring(lastUnderscoreIdx + 1, lastDotIdx);
    if (lowercaseStatus === 'back') {
        return null;
    }
    return lowercaseStatus.replace('ap', 'AP').replace('p', '+').toUpperCase();
}
exports.getApFcStatus = getApFcStatus;
function getSyncStatus(row, isFriendScore = false) {
    const img = isFriendScore
        ? row.querySelector('tr:last-child td:last-child img:first-child')
        : row.children[0].querySelector('img.f_r:nth-last-of-type(3)');
    if (!(img instanceof HTMLImageElement)) {
        return null;
    }
    const statusImgSrc = img.src.replace(/\?ver=.*$/, '');
    const lastUnderscoreIdx = statusImgSrc.lastIndexOf('_');
    const lastDotIdx = statusImgSrc.lastIndexOf('.');
    const lowercaseStatus = statusImgSrc.substring(lastUnderscoreIdx + 1, lastDotIdx);
    if (lowercaseStatus === 'back') {
        return null;
    }
    // FSD was renamed back to FDX in maimai BUDDiES.
    // To keep terminology consistent, we choose to say FSD and FSD+.
    return lowercaseStatus.toUpperCase().replace('P', '+').replace('FDX', 'FSD');
}
exports.getSyncStatus = getSyncStatus;
/**
 * Get DX Star on Friend VS page (DX score VS)
 */
function getFriendDxStar(row) {
    const img = row.querySelector('tr:first-child td:last-child img');
    if (!img) {
        return 0;
    }
    const imgPath = new URL(img.src).pathname;
    const dxStar = imgPath.substring(imgPath.lastIndexOf('_') + 1, imgPath.lastIndexOf('.'));
    try {
        const dxStarInt = parseInt(dxStar);
        if (isNaN(dxStarInt) || dxStarInt < 0) {
            console.warn('invalid dx star ' + dxStar);
            return 0;
        }
        return dxStarInt;
    }
    catch (err) {
        console.warn('invalid dx star ' + dxStar);
    }
    return 0;
}
exports.getFriendDxStar = getFriendDxStar;
