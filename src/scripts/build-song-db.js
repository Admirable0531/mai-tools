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
const fetch_score_util_1 = require("../common/fetch-score-util");
const song_name_helper_1 = require("../common/song-name-helper");
function buildSongDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const rows = Array.from(document.querySelectorAll('.w_450.m_15.f_0'));
        const songs = [];
        for (const d of rows) {
            const idx = (0, song_name_helper_1.getSongIdx)(d);
            let n = (0, fetch_score_util_1.getSongName)(d);
            const di = (0, fetch_score_util_1.getChartDifficulty)(d);
            let lv = (0, fetch_score_util_1.getChartLevel)(d);
            const c = (0, chart_type_1.getChartType)(d);
            if (n === 'Link') {
                const genre = yield (0, song_name_helper_1.fetchSongGenre)(idx);
                n = (0, song_name_helper_1.getSongNickname)(n, genre);
            }
            else if (n === '+♂' || n === '39') {
                n = "'" + n;
            }
            if (c === 1 /* ChartType.DX */) {
                n += ' [dx]';
            }
            if (!lv.includes('+')) {
                lv = "'" + lv;
            }
            songs.push([n, di, lv].join('\t'));
        }
        return songs;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(yield buildSongDb());
    });
}
main();
