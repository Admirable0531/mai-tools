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
exports.MaiToolsApi = void 0;
const song_name_helper_1 = require("../song-name-helper");
class MaiToolsApi {
    constructor(maiToolsBaseUrl) {
        this.maiToolsBaseUrl = maiToolsBaseUrl;
    }
    fetchChartLevelOverrides(gameVer) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetchJson(`${this.maiToolsBaseUrl}/data/chart-levels/version${gameVer}.json`);
            const output = [];
            ['standard', 'dx'].forEach((chartType, index) => {
                if (!data[chartType]) {
                    return;
                }
                for (const name of Object.keys(data[chartType])) {
                    output.push({
                        name,
                        genre: (0, song_name_helper_1.getGenreFromNickname)(name),
                        dx: index,
                        debut: gameVer,
                        lv: data[chartType][name],
                    });
                }
            });
            return output;
        });
    }
    fetchRegionOverrides(region) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fetchJson(`${this.maiToolsBaseUrl}/data/song-info/${region}.json`);
            return ['standard', 'dx'].flatMap((chartType, index) => {
                const songsByVer = data[chartType];
                if (!songsByVer) {
                    return;
                }
                const icosByVer = data[chartType + 'Ico'] || {};
                return Object.keys(songsByVer).flatMap((version) => {
                    const songList = songsByVer[version];
                    const icoList = icosByVer[version] || [];
                    const versionInt = parseInt(version);
                    return songList.map((name, i) => {
                        const song = {
                            name,
                            dx: index,
                            debut: versionInt,
                            ico: icoList.at(i),
                        };
                        return song;
                    });
                });
            });
        });
    }
}
exports.MaiToolsApi = MaiToolsApi;
function fetchJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = '';
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                return {};
            }
            body = yield response.text();
            return JSON.parse(body);
        }
        catch (e) {
            // Can be network error or parse error
            console.warn(e);
            console.warn('Failed to parse JSON: ' + body);
        }
        return {};
    });
}
