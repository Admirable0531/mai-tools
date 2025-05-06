"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongGenreFromImg = exports.fetchSongGenre = exports.getCachedSongGenre = exports.getSongNicknameWithChartType = exports.getSheetIdForDxRatingNet = exports.getGenreFromNickname = exports.getSongNickname = exports.getSongIdx = exports.normalizeSongName = exports.RATING_TARGET_SONG_NAME_PREFIX = void 0;
const chart_type_1 = require("./chart-type");
const difficulties_1 = require("./difficulties");
const util_1 = require("./util");
exports.RATING_TARGET_SONG_NAME_PREFIX = '▶ ';
// This function is shared with Taiwan-independence.
function normalizeSongName(name) {
    if (name === 'D✪N’T  ST✪P  R✪CKIN’') {
        return 'D✪N’T ST✪P R✪CKIN’';
    }
    return name.replace(/" \+ '/g, '').replace(/' \+ "/g, '');
}
exports.normalizeSongName = normalizeSongName;
function getSongIdx(row) {
    const form = row.getElementsByTagName('form');
    if (!form.length) {
        return null;
    }
    return form[0].elements.namedItem('idx').value;
}
exports.getSongIdx = getSongIdx;
function getSongNickname(name, genre) {
    if (name === 'Link') {
        return genre.includes('niconico') ? 'Link (nico)' : 'Link (org)';
    }
    return name;
}
exports.getSongNickname = getSongNickname;
function getGenreFromNickname(nickname) {
    if (nickname === 'Link (nico)') {
        return 'niconico';
    }
    else if (nickname === 'Link (org)') {
        return 'maimai';
    }
    return '';
}
exports.getGenreFromNickname = getGenreFromNickname;
function getSheetIdForDxRatingNet(name, genre, c, d) {
    const songName = name !== 'Link' ? name : genre.includes('niconico') ? 'Link (2)' : 'Link';
    const chartType = (0, chart_type_1.getChartTypeNameForDxRatingNet)(c);
    const difficulty = (0, difficulties_1.getDifficultyNameForDxRatingNet)(d);
    return `${songName}__dxrt__${chartType}__dxrt__${difficulty}`;
}
exports.getSheetIdForDxRatingNet = getSheetIdForDxRatingNet;
function getSongNicknameWithChartType(name, genre, chartType) {
    return getSongNickname(name, genre) + ' [' + (0, chart_type_1.getChartTypeName)(chartType) + ']';
}
exports.getSongNicknameWithChartType = getSongNicknameWithChartType;
let cachedGenreByIdx = {};
function getCachedSongGenre(idx) {
    return cachedGenreByIdx[idx];
}
exports.getCachedSongGenre = getCachedSongGenre;
function fetchSongGenre(idx) {
    return __awaiter(this, void 0, void 0, function* () {
        const cachedGenre = getCachedSongGenre(idx);
        if (cachedGenre) {
            return cachedGenre;
        }
        const dom = yield (0, util_1.fetchSongDetailPage)(idx);
        const name = dom.body.querySelector('.m_5.f_15.break').textContent.trim();
        const genre = dom.body.querySelector('.t_r.blue').textContent.trim();
        console.log(`${idx} is ${name} from ${genre}`);
        cachedGenreByIdx[idx] = genre;
        return genre;
    });
}
exports.fetchSongGenre = fetchSongGenre;
function getSongGenreFromImg(songName, imgSrc) {
    if (songName !== 'Link') {
        return '';
    }
    return imgSrc.includes('e90f79d9dcff84df') ? 'niconico' : 'maimai';
}
exports.getSongGenreFromImg = getSongGenreFromImg;
