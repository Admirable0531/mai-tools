"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartRecordTable = void 0;
const react_1 = __importDefault(require("react"));
const difficulties_1 = require("../common/difficulties");
const song_name_helper_1 = require("../common/song-name-helper");
const ChartRecordTableRow_1 = require("./ChartRecordTableRow");
function ChartRecordTable(props) {
    const { d, versionInfo, plateType } = props;
    if (typeof d !== 'number') {
        return null;
    }
    const progressByDifficulty = props.progressByPlate[props.plateType];
    if (!progressByDifficulty) {
        return null;
    }
    const progress = progressByDifficulty[props.d];
    const doneRecords = progress[1].slice().sort((a, b) => {
        return a.achievement > b.achievement ? -1 : 1;
    });
    const undoneRecords = progress[0].slice().sort((a, b) => {
        return a.achievement > b.achievement ? -1 : 1;
    });
    const playedDxSongs = new Set(progress[0]
        .concat(progress[1])
        .filter((r) => r.chartType === 1 /* ChartType.DX */)
        .map((r) => (0, song_name_helper_1.getSongNickname)(r.songName, r.genre)));
    const playedStdSongs = new Set(progress[0]
        .concat(progress[1])
        .filter((r) => r.chartType === 0 /* ChartType.STANDARD */)
        .map((r) => (0, song_name_helper_1.getSongNickname)(r.songName, r.genre)));
    const unplayedDxSongs = (props.d === 4 /* Difficulty.ReMASTER */
        ? props.versionInfo.dx_remaster_songs
        : props.versionInfo.dx_songs).filter((s) => !playedDxSongs.has(s));
    const unplayedStdSongs = (props.d === 4 /* Difficulty.ReMASTER */
        ? props.versionInfo.std_remaster_songs
        : props.versionInfo.std_songs).filter((s) => !playedStdSongs.has(s));
    // Highlight sort column based on plateType
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h3", null,
            react_1.default.createElement("span", { className: (0, difficulties_1.getDifficultyClassName)(d) }, (0, difficulties_1.getDifficultyName)(d)),
            " scores for",
            ' ',
            versionInfo.plate_name[plateType]),
        react_1.default.createElement("table", null,
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, "Song"),
                    react_1.default.createElement("th", null, "Chart"),
                    react_1.default.createElement("th", null,
                        plateType === 'CLEAR' || plateType === 'SSS' ? '▸ ' : '',
                        "Achv"),
                    react_1.default.createElement("th", null,
                        plateType === 'FC' ? '▸ ' : '',
                        "FC"),
                    react_1.default.createElement("th", null,
                        plateType === 'AP' ? '▸ ' : '',
                        "AP"),
                    react_1.default.createElement("th", null,
                        plateType === 'FSD' ? '▸ ' : '',
                        "Sync"))),
            react_1.default.createElement("tbody", null,
                doneRecords.map((r) => {
                    const nickname = (0, song_name_helper_1.getSongNickname)(r.songName, r.genre);
                    return (react_1.default.createElement(ChartRecordTableRow_1.ChartRecordTableRow, { key: nickname, songNickname: nickname, chartType: r.chartType, done: true, r: r }));
                }),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", { colSpan: 5 }, "- - - - - - - -")),
                undoneRecords.map((r) => {
                    const nickname = (0, song_name_helper_1.getSongNickname)(r.songName, r.genre);
                    return (react_1.default.createElement(ChartRecordTableRow_1.ChartRecordTableRow, { key: nickname, songNickname: nickname, chartType: r.chartType, r: r }));
                }),
                unplayedStdSongs.map((songName) => {
                    return (react_1.default.createElement(ChartRecordTableRow_1.ChartRecordTableRow, { key: songName, songNickname: songName, chartType: 0 /* ChartType.STANDARD */ }));
                }),
                unplayedDxSongs.map((songName) => {
                    return (react_1.default.createElement(ChartRecordTableRow_1.ChartRecordTableRow, { key: songName, songNickname: songName, chartType: 1 /* ChartType.DX */ }));
                })))));
}
exports.ChartRecordTable = ChartRecordTable;
