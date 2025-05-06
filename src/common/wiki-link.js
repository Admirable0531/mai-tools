"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArcadeSongLink = exports.getZhWikiLink = void 0;
const difficulties_1 = require("./difficulties");
const WIKI_URL_PREFIX = 'https://maimai.fandom.com/zh/wiki/';
const WIKI_URL_SUFFIX = '?variant=zh-hant';
const ARCADE_SONG_BASE_URL = 'https://arcade-songs.zetaraku.dev/maimai/?';
function getZhWikiLink(title) {
    return WIKI_URL_PREFIX + encodeURIComponent(title) + WIKI_URL_SUFFIX;
}
exports.getZhWikiLink = getZhWikiLink;
function getArcadeSongLink(title, chartType, d) {
    const query = new URLSearchParams();
    query.set('title', title);
    query.set('types', chartType === 1 /* ChartType.DX */ ? 'dx' : 'std');
    query.set('difficulties', (0, difficulties_1.getDifficultyName)(d).replace(':', '').toLowerCase());
    return ARCADE_SONG_BASE_URL + query;
}
exports.getArcadeSongLink = getArcadeSongLink;
