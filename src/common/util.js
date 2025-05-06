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
exports.sleep = exports.getPostMessageFunc = exports.fetchSongDetailPage = exports.fetchAllSongs = exports.handleError = exports.ALLOWED_ORIGINS = void 0;
const chart_type_1 = require("./chart-type");
const fetch_score_util_1 = require("./fetch-score-util");
const fetch_self_score_1 = require("./fetch-self-score");
const net_helpers_1 = require("./net-helpers");
const song_name_helper_1 = require("./song-name-helper");
exports.ALLOWED_ORIGINS = [
    'https://cdpn.io',
    'https://myjian.github.io',
    'http://localhost:8080',
];
function handleError(msg) {
    alert(msg);
}
exports.handleError = handleError;
function parseSongList(dom) {
    return __awaiter(this, void 0, void 0, function* () {
        // This is simplified from scripts/build-song-db.ts
        const rows = Array.from(dom.querySelectorAll('.w_450.m_15.f_0'));
        const songs = [];
        for (const d of rows) {
            const idx = (0, song_name_helper_1.getSongIdx)(d);
            const name = (0, fetch_score_util_1.getSongName)(d);
            const isDx = (0, chart_type_1.getChartType)(d);
            const genre = name === 'Link' ? yield (0, song_name_helper_1.fetchSongGenre)(idx) : '';
            songs.push({ dx: isDx, name, genre });
        }
        return songs;
    });
}
function fetchAllSongs(dom) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dom) {
            const url = fetch_self_score_1.SELF_SCORE_URLS.get(0 /* Difficulty.BASIC */);
            dom = yield (0, net_helpers_1.fetchPage)(url);
        }
        return yield parseSongList(dom);
    });
}
exports.fetchAllSongs = fetchAllSongs;
function fetchSongDetailPage(idx) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new URLSearchParams({ idx }).toString();
        return (0, net_helpers_1.fetchPage)('/maimai-mobile/record/musicDetail/?' + query);
    });
}
exports.fetchSongDetailPage = fetchSongDetailPage;
function getPostMessageFunc(w, origin) {
    return (action, payload) => {
        const obj = { action, payload };
        w.postMessage(obj, origin);
    };
}
exports.getPostMessageFunc = getPostMessageFunc;
function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
exports.sleep = sleep;
