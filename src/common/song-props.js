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
exports.loadSongDatabase = exports.SongDatabase = void 0;
const magic_api_1 = require("./infra/magic-api");
const mai_tools_api_1 = require("./infra/mai-tools-api");
const song_database_factory_1 = require("./infra/song-database-factory");
const script_host_1 = require("./script-host");
const song_name_helper_1 = require("./song-name-helper");
class SongDatabase {
    constructor(gameVer = null, region = null, verbose = true, dxMap = new Map(), standardMap = new Map(), nameByIco = new Map()) {
        this.gameVer = gameVer;
        this.region = region;
        this.verbose = verbose;
        this.dxMap = dxMap;
        this.standardMap = standardMap;
        this.nameByIco = nameByIco;
    }
    insertOrUpdateSong(song) {
        if (this.updateSong(song)) {
            return;
        }
        const map = song.dx === 1 /* ChartType.DX */ ? this.dxMap : this.standardMap;
        const key = (0, song_name_helper_1.getSongNickname)(song.name, song.genre);
        if (song.ico) {
            this.nameByIco.set(song.ico, key);
        }
        if (map.has(key)) {
            console.warn(`Found existing song properties for ${key} ${song.dx}: ${JSON.stringify(map.get(key))}`);
            console.warn(`Will ignore ${song}`);
            return;
        }
        if (song.regionOverrides && song.regionOverrides[this.region]) {
            const regionOverride = song.regionOverrides[this.region];
            if (regionOverride.debut >= 0) {
                song.debut = regionOverride.debut;
            }
            if (Array.isArray(regionOverride.lv)) {
                song.lv = song.lv.map((lvItem, idx) => regionOverride.lv[idx] > 0 ? regionOverride.lv[idx] : lvItem);
            }
        }
        map.set(key, song);
    }
    /**
     * @return true if song prop is successfully updated.
     */
    updateSong(update) {
        const map = update.dx === 1 /* ChartType.DX */ ? this.dxMap : this.standardMap;
        const key = map.has(update.name) ? update.name : (0, song_name_helper_1.getSongNickname)(update.name, update.genre);
        const existing = map.get(key);
        if (!existing) {
            return false;
        }
        let levels = existing.lv;
        if (update.lv instanceof Array) {
            levels = existing.lv.map((oldLevel, i) => {
                const newLevel = update.lv[i];
                // NaN > 0 will evaluate to false
                return typeof newLevel === 'number' && newLevel > 0 ? newLevel : oldLevel;
            });
        }
        if (update.ico) {
            this.nameByIco.set(update.ico, key);
        }
        map.set(key, Object.assign(Object.assign(Object.assign({}, existing), update), { lv: levels }));
        return true;
    }
    deleteSong(name) {
        this.dxMap.delete(name);
        this.standardMap.delete(name);
    }
    hasDualCharts(songName) {
        if (songName === 'Link')
            return true;
        return this.dxMap.has(songName) && this.standardMap.has(songName);
    }
    getSongPropsByIco(ico, chartType) {
        const name = this.nameByIco.get(ico);
        return this.getSongProperties(name, '', chartType);
    }
    getSongProperties(songName, genre, chartType = 0 /* ChartType.STANDARD */) {
        if (songName == null) {
            return;
        }
        const map = chartType === 1 /* ChartType.DX */ ? this.dxMap : this.standardMap;
        let songProps = map.get(songName);
        if (songProps) {
            return songProps;
        }
        const nickname = (0, song_name_helper_1.getSongNickname)(songName, genre);
        songProps = map.get(nickname);
        if (songProps) {
            return songProps;
        }
        if (this.verbose) {
            console.warn(`Could not find song properties for ${songName} ${chartType}`);
        }
    }
    getAllProps() {
        return Array.from(this.dxMap.values()).concat(Array.from(this.standardMap.values()));
    }
    getPropsForSongs(songs) {
        return songs
            .map((s) => {
            const props = this.getSongProperties(s.name, s.genre, s.dx);
            if (!props) {
                console.warn('Could not find song properties for', s);
            }
            return props;
        })
            .filter((props) => !!props);
    }
    toString() {
        return String({ dxMap: this.dxMap, standardMap: this.standardMap });
    }
}
exports.SongDatabase = SongDatabase;
function loadSongDatabase(gameVer, gameRegion) {
    return __awaiter(this, void 0, void 0, function* () {
        const factory = new song_database_factory_1.SongDatabaseFactory(new mai_tools_api_1.MaiToolsApi((0, script_host_1.getMaiToolsBaseUrl)()), new magic_api_1.MagicApi());
        return factory.create(gameVer, gameRegion);
    });
}
exports.loadSongDatabase = loadSongDatabase;
