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
exports.addLvToSongTitle = exports.removeScrollControl = exports.getEpochTimeFromText = exports.fetchGameVersion = exports.fetchPage = void 0;
const date_util_1 = require("./date-util");
const difficulties_1 = require("./difficulties");
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 1 day
const CACHE_KEY = 'MaiToolsGameVer';
const EXPIRATION_KEY = 'MaiToolsGameVerExpire';
// 1x1 PNG with transparent background
const TRANSPARENT_PNG_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
function fetchPage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url, { redirect: 'error' });
        const html = yield response.text();
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    });
}
exports.fetchPage = fetchPage;
function fetchGameVersion(dom) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheExpiration = parseInt(window.localStorage.getItem(EXPIRATION_KEY));
        if (!isNaN(cacheExpiration) && cacheExpiration >= Date.now()) {
            const cachedGameVer = parseInt(window.localStorage.getItem(CACHE_KEY));
            if (!isNaN(cachedGameVer)) {
                return cachedGameVer;
            }
        }
        const gameVerOption = dom.querySelector('select[name=version] option:last-of-type');
        if (gameVerOption instanceof HTMLOptionElement) {
            const gameVer = parseInt(gameVerOption.value);
            window.localStorage.setItem(CACHE_KEY, String(gameVer));
            window.localStorage.setItem(EXPIRATION_KEY, String(Date.now() + CACHE_DURATION));
            return gameVer;
        }
        dom = yield fetchPage('/maimai-mobile/record/musicVersion/');
        return fetchGameVersion(dom);
    });
}
exports.fetchGameVersion = fetchGameVersion;
function getEpochTimeFromText(datetimeStr) {
    const m = datetimeStr.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
    const date = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]));
    return (0, date_util_1.fixTimezone)(date).getTime();
}
exports.getEpochTimeFromText = getEpochTimeFromText;
function removeScrollControl(dom) {
    for (const btnSelector of ['#page-top', '#page-bottom']) {
        const button = dom.querySelector(btnSelector);
        if (button instanceof HTMLImageElement) {
            button.src = TRANSPARENT_PNG_DATA_URL;
            button.style.pointerEvents = 'none';
        }
    }
    const menuToggle = dom.querySelector('.spmenu_toggle');
    if (menuToggle instanceof HTMLElement) {
        menuToggle.style.backgroundImage = `url(${TRANSPARENT_PNG_DATA_URL})`;
    }
}
exports.removeScrollControl = removeScrollControl;
/**
 * Add level information to play record. This would be displayed at where the "CLEAR!"
 * image is. Only supported on play record list page and single play record page.
 */
function addLvToSongTitle(row, diff, chartLv) {
    return __awaiter(this, void 0, void 0, function* () {
        const songTitleDiv = row.querySelector('.basic_block.break');
        const clearImg = songTitleDiv.querySelector('img');
        if (clearImg) {
            clearImg.remove();
        }
        const lvElem = document.createElement('div');
        lvElem.className = 'f_r'; // float: right
        lvElem.append('Lv ' + chartLv);
        lvElem.style.color = (0, difficulties_1.getDifficultyTextColor)(diff);
        songTitleDiv.append(lvElem);
    });
}
exports.addLvToSongTitle = addLvToSongTitle;
