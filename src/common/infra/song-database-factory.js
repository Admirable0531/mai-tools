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
exports.SongDatabaseFactory = void 0;
const game_version_1 = require("../game-version");
const removed_songs_1 = require("../removed-songs");
const song_props_1 = require("../song-props");
class SongDatabaseFactory {
    constructor(maiToolsApi, magicApi) {
        this.maiToolsApi = maiToolsApi;
        this.magicApi = magicApi;
    }
    create(gameVer, gameRegion) {
        return __awaiter(this, void 0, void 0, function* () {
            const dxMap = new Map();
            const standardMap = new Map();
            const nameByIco = new Map();
            const database = new song_props_1.SongDatabase(gameVer, gameRegion, true, dxMap, standardMap, nameByIco);
            const songs = yield this.magicApi.loadMagic(gameVer);
            for (const song of songs) {
                database.insertOrUpdateSong(song);
            }
            const chartLevelOverrides = yield this.maiToolsApi.fetchChartLevelOverrides(gameVer);
            // console.log('chartLevelOverrides', chartLevelOverrides);
            for (const songProps of chartLevelOverrides) {
                database.insertOrUpdateSong(songProps);
            }
            const regionOverrides = yield this.maiToolsApi.fetchRegionOverrides(gameRegion);
            // console.log('regionOverrides', regionOverrides);
            for (const songProps of regionOverrides) {
                database.updateSong(songProps);
            }
            const removedSongs = (0, removed_songs_1.getRemovedSongs)(gameRegion, gameVer);
            for (const songName of removedSongs) {
                database.deleteSong(songName);
            }
            this.validate(dxMap, standardMap);
            return database;
        });
    }
    // validation: every song must have debut and lv
    validate(dxMap, standardMap) {
        for (const map of [dxMap, standardMap]) {
            map.forEach((song) => {
                console.assert(song.debut != null);
                console.assert(song.debut >= 0 && song.debut <= game_version_1.LATEST_VERSION);
                console.assert(song.lv.length >= 4);
            });
        }
    }
}
exports.SongDatabaseFactory = SongDatabaseFactory;
