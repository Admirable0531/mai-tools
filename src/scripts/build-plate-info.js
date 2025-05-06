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
const game_region_1 = require("../common/game-region");
const song_name_helper_1 = require("../common/song-name-helper");
const FILE_PREFIX = (0, game_region_1.getGameRegionFromOrigin)(window.location.origin);
const PLATE_PREFIX = {
    0: '真',
    1: '真',
    2: '超',
    3: '檄',
    4: '橙',
    5: '暁',
    6: '桃',
    7: '櫻',
    8: '紫',
    9: '菫',
    10: '白',
    11: '雪',
    12: '輝',
    13: '熊',
    14: '華',
    15: '爽',
    16: '煌',
    17: '宙',
    18: '星',
    19: '祭',
    20: '祝',
    21: '双',
    22: '宴',
};
function buildSongDb(versionName, platePrefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const rows = Array.from(document.querySelectorAll('.w_450.m_15.f_0'));
        const result = {
            version_name: versionName,
            plate_name: {
                FC: `${platePrefix}極`,
                SSS: `${platePrefix}将`,
                AP: `${platePrefix}神`,
                FSD: `${platePrefix}舞舞`,
            },
            dx_songs: [],
            std_songs: [],
        };
        for (const d of rows) {
            const idx = (0, song_name_helper_1.getSongIdx)(d);
            let n = (0, fetch_score_util_1.getSongName)(d);
            // const di = getChartDifficulty(d);
            // let lv = getChartLevel(d);
            const c = (0, chart_type_1.getChartType)(d);
            if (n === 'Link') {
                const genre = yield (0, song_name_helper_1.fetchSongGenre)(idx);
                n = (0, song_name_helper_1.getSongNickname)(n, genre);
                // } else if (n === '+♂' || n === '39') {
                //   n = "'" + n;
            }
            // if (c === ChartType.DX) {
            //   n += ' [dx]';
            // }
            // if (!lv.includes('+')) {
            //   lv = "'" + lv;
            // }
            // songs.push([n, di, lv].join('\t'));
            if (c === 1 /* ChartType.DX */) {
                result.dx_songs.push(n);
            }
            else {
                result.std_songs.push(n);
            }
        }
        return result;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const version = (document.querySelector('select[name=version]') ||
            document.querySelector('select[name]')).selectedOptions[0];
        const platePrefix = PLATE_PREFIX[version.value];
        const fileContent = JSON.stringify(yield buildSongDb(version.textContent, platePrefix), null, 2);
        const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(file);
        console.log(url);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = FILE_PREFIX + version.value + '.json';
        anchor.innerText = anchor.download;
        anchor.style.color = 'black';
        document.body.prepend(anchor);
    });
}
main();
