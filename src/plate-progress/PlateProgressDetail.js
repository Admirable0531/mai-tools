"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlateProgressDetail = void 0;
const react_1 = __importStar(require("react"));
const difficulties_1 = require("../common/difficulties");
const song_name_helper_1 = require("../common/song-name-helper");
const ChartRecordTable_1 = require("./ChartRecordTable");
const plate_predicates_1 = require("./plate_predicates");
const PlateProgressTable_1 = require("./PlateProgressTable");
function PlateProgressDetail(props) {
    const { versionInfo, playerScores } = props;
    const [plateType, setPlateType] = (0, react_1.useState)(null);
    const [selectedDifficulty, setSelectedDifficulty] = (0, react_1.useState)(null);
    const handleSelectPlateAndDifficulty = (0, react_1.useCallback)((plate, d) => {
        setPlateType(plate);
        setSelectedDifficulty(d);
    }, [plateType, selectedDifficulty]);
    const allSongs = {
        dx: new Set(versionInfo.dx_songs),
        std: new Set(versionInfo.std_songs),
    };
    const remasterSongs = {
        dx: new Set(versionInfo.dx_remaster_songs),
        std: new Set(versionInfo.std_remaster_songs),
    };
    const songCount = {
        [0 /* Difficulty.BASIC */]: allSongs.dx.size + allSongs.std.size,
        [1 /* Difficulty.ADVANCED */]: allSongs.dx.size + allSongs.std.size,
        [2 /* Difficulty.EXPERT */]: allSongs.dx.size + allSongs.std.size,
        [3 /* Difficulty.MASTER */]: allSongs.dx.size + allSongs.std.size,
        [4 /* Difficulty.ReMASTER */]: remasterSongs.dx.size + remasterSongs.std.size,
        [5 /* Difficulty.UTAGE */]: 0,
    };
    const progressByPlate = (0, react_1.useMemo)(() => {
        const result = Object.keys(versionInfo.plate_name).reduce((res, plateType) => {
            res[plateType] = createEmptyProgress();
            return res;
        }, {});
        playerScores
            .filter((record) => {
            const nickname = (0, song_name_helper_1.getSongNickname)(record.songName, record.genre);
            if (record.difficulty === 4 /* Difficulty.ReMASTER */) {
                return record.chartType === 0 /* ChartType.STANDARD */
                    ? remasterSongs.std.has(nickname)
                    : remasterSongs.dx.has(nickname);
            }
            return record.chartType === 0 /* ChartType.STANDARD */
                ? allSongs.std.has(nickname)
                : allSongs.dx.has(nickname);
        })
            .forEach((record) => {
            for (const plateType of Object.keys(versionInfo.plate_name)) {
                result[plateType][record.difficulty][toInt((0, plate_predicates_1.isRecordMatchPlateCriteria)(record, plateType))].push(record);
            }
        });
        return result;
    }, [playerScores, versionInfo]);
    if (props.playerScores.length === 0) {
        return null;
    }
    const activeDifficulties = difficulties_1.DIFFICULTIES.filter((d) => songCount[d] > 0);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h3", null,
            "Completion status of ",
            versionInfo.version_name),
        react_1.default.createElement(PlateProgressTable_1.PlateProgressTable, { activeDifficulties: activeDifficulties, songCount: songCount, progressByPlate: progressByPlate, plateNames: versionInfo.plate_name, selectPlateAndDifficulty: handleSelectPlateAndDifficulty }),
        react_1.default.createElement(ChartRecordTable_1.ChartRecordTable, { d: selectedDifficulty, versionInfo: versionInfo, plateType: plateType, progressByPlate: progressByPlate })));
}
exports.PlateProgressDetail = PlateProgressDetail;
function toInt(val) {
    return Number(val);
}
function createEmptyProgress() {
    return {
        [0 /* Difficulty.BASIC */]: { 0: [], 1: [] },
        [1 /* Difficulty.ADVANCED */]: { 0: [], 1: [] },
        [2 /* Difficulty.EXPERT */]: { 0: [], 1: [] },
        [3 /* Difficulty.MASTER */]: { 0: [], 1: [] },
        [4 /* Difficulty.ReMASTER */]: { 0: [], 1: [] },
        [5 /* Difficulty.UTAGE */]: { 0: [], 1: [] },
    };
}
