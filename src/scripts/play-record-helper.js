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
const difficulties_1 = require("../common/difficulties");
const fetch_score_util_1 = require("../common/fetch-score-util");
const game_region_1 = require("../common/game-region");
const level_helper_1 = require("../common/level-helper");
const net_helpers_1 = require("../common/net-helpers");
const song_name_helper_1 = require("../common/song-name-helper");
const song_props_1 = require("../common/song-props");
const util_1 = require("../common/util");
(function (d) {
    return __awaiter(this, void 0, void 0, function* () {
        function fetchChartLv(diff) {
            return __awaiter(this, void 0, void 0, function* () {
                // First, try magic
                const gameVer = yield (0, net_helpers_1.fetchGameVersion)(d.body);
                const gameRegion = (0, game_region_1.getGameRegionFromOrigin)(d.location.origin);
                const songDb = yield (0, song_props_1.loadSongDatabase)(gameVer, gameRegion);
                const name = (0, fetch_score_util_1.getSongName)(d.body);
                const songImg = d.querySelector('img.music_img');
                const genre = (0, song_name_helper_1.getSongGenreFromImg)(name, songImg.src);
                const chartType = (0, chart_type_1.getChartType)(d.body);
                if (chartType != 2 /* ChartType.UTAGE */) {
                    const props = songDb.getSongProperties(name, genre, chartType);
                    if (props) {
                        return (0, level_helper_1.getDisplayLv)(props.lv[diff], diff === 5 /* Difficulty.UTAGE */);
                    }
                }
                // If magic does not work, load from maimai-NET.
                const songIdxElem = d.querySelector('input[name=idx]');
                const songDetailPage = yield (0, util_1.fetchSongDetailPage)(songIdxElem.value);
                const lvElem = songDetailPage.querySelector(`.music_detail_table tr:nth-child(${chartType == 2 /* ChartType.UTAGE */ ? 1 : diff + 1}) .music_lv_back`);
                return lvElem.innerHTML.trim();
            });
        }
        if ((0, game_region_1.isMaimaiNetOrigin)(d.location.origin) &&
            d.location.pathname.includes('/maimai-mobile/record/playlogDetail/')) {
            const diff = (0, difficulties_1.getDifficultyForRecord)(d.body);
            const lv = yield fetchChartLv(diff);
            (0, net_helpers_1.addLvToSongTitle)(d.body, diff, lv);
        }
    });
})(document);
