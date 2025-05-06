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
const chart_type_1 = require("../common/chart-type");
const dx_star_1 = require("../common/dx-star");
const game_region_1 = require("../common/game-region");
const level_helper_1 = require("../common/level-helper");
const net_helpers_1 = require("../common/net-helpers");
const song_name_helper_1 = require("../common/song-name-helper");
const song_props_1 = require("../common/song-props");
(function (d) {
    const cache = {};
    const isUtage = d.querySelectorAll('.music_utage_btn').length > 0;
    function addDxStarDetail(row) {
        const label = row.querySelector('img.f_l');
        if (!label) {
            // do not run this function twice
            return;
        }
        label.remove();
        const [playerDxScore, maxDxScore] = row.textContent
            .split('/')
            .map((t) => parseInt(t.replace(',', '').trim()));
        const dxScoreRatio = playerDxScore / maxDxScore;
        const dxStar = (0, dx_star_1.getDxStarText)((0, dx_star_1.determineDxStar)(dxScoreRatio), true) + ` (${(dxScoreRatio * 100).toFixed(1)}%)`;
        const dxStarBlock = d.createElement('div');
        dxStarBlock.className = 'f_l';
        dxStarBlock.append(dxStar);
        row.prepend(dxStarBlock);
    }
    function fetchAndAddInternalLv() {
        return __awaiter(this, void 0, void 0, function* () {
            const gameVer = yield (0, net_helpers_1.fetchGameVersion)(d.body);
            const gameRegion = (0, game_region_1.getGameRegionFromOrigin)(d.location.origin);
            const songDb = yield (0, song_props_1.loadSongDatabase)(gameVer, gameRegion);
            const song = getSongName();
            const genre = getSongGenre();
            const chartType = (0, chart_type_1.getChartType)(d.body);
            const props = songDb.getSongProperties(song, genre, chartType);
            cache.songProp = props;
            // replace table song level
            Array.from(getLevelTable(), (row, idx) => {
                const levelElement = getLevelElement(row);
                if (!levelElement) {
                    return;
                }
                saveInLv(levelElement, coalesceInLv(gameVer, levelElement, idx, props));
            });
            // replace play history's level
            ['basic', 'advanced', 'expert', 'master', 'remaster'].forEach((rowId, idx) => {
                const row = d.querySelector(`#${rowId}`);
                if (!row) {
                    return;
                }
                const levelElement = getLevelElement(row);
                saveInLv(levelElement, coalesceInLv(gameVer, levelElement, idx, props));
            });
        });
    }
    function saveInLv(levelElement, lv) {
        if (!levelElement.dataset['inlv']) {
            levelElement.dataset['inlv'] = lv.toFixed(1);
            levelElement.innerText = (0, level_helper_1.getDisplayLv)(lv, isUtage);
        }
    }
    function coalesceInLv(gameVer, levelElement, lvIndex, props) {
        const lv = props ? props.lv[lvIndex] : 0;
        return lv || -(0, level_helper_1.getMinConstant)(gameVer, levelElement.innerText);
    }
    function getSongName() {
        return (0, song_name_helper_1.normalizeSongName)(document.querySelector('.m_5.f_15.break').textContent);
    }
    function getSongGenre() {
        const elem = document.querySelector('.t_r.blue');
        return elem != null ? elem.textContent.trim() : '';
    }
    function getLevelTable() {
        return d.querySelectorAll('.music_detail_table tr');
    }
    function getLevelElement(row) {
        return row.querySelector('.music_lv_back');
    }
    const rows = d.querySelectorAll('.music_score_block.w_310');
    rows.forEach(addDxStarDetail);
    fetchAndAddInternalLv();
})(document);
