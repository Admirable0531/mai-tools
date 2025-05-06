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
exports.ChartRecordDataRow = void 0;
const react_1 = __importStar(require("react"));
const chart_type_1 = require("../../common/chart-type");
const difficulties_1 = require("../../common/difficulties");
const level_helper_1 = require("../../common/level-helper");
const rank_functions_1 = require("../../common/rank-functions");
const song_name_helper_1 = require("../../common/song-name-helper");
const wiki_link_1 = require("../../common/wiki-link");
const ChartRecordRow_1 = require("./ChartRecordRow");
function getSongNameCell(record, isCandidate) {
    const prefix = isCandidate && record.isTarget ? song_name_helper_1.RATING_TARGET_SONG_NAME_PREFIX : '';
    const displayName = prefix + (0, song_name_helper_1.getSongNickname)(record.songName, record.genre);
    return (react_1.default.createElement("a", { className: "songWikiLink", href: (0, wiki_link_1.getArcadeSongLink)(record.songName, record.chartType, record.difficulty), target: "_blank" }, displayName));
}
exports.ChartRecordDataRow = react_1.default.memo((props) => {
    const { record, index, columns, isCandidate } = props;
    const renderColumn = (0, react_1.useCallback)((c) => {
        switch (c) {
            case 0 /* ColumnType.NO */:
                return index.toString();
            case 1 /* ColumnType.SONG_TITLE */:
                return getSongNameCell(record, isCandidate);
            case 2 /* ColumnType.CHART_TYPE */:
                return (0, chart_type_1.getChartTypeName)(record.chartType);
            case 3 /* ColumnType.LEVEL */:
                return (0, level_helper_1.getDisplayLv)(record.level, record.difficulty === 5 /* Difficulty.UTAGE */);
            case 4 /* ColumnType.ACHIEVEMENT */:
                return isCandidate && record.rating ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("div", { className: "textAlignRight" }, record.achievement.toFixed(4) + '%'),
                    react_1.default.createElement("div", { className: "textAlignCenter" }, Math.floor(record.rating)))) : (record.achievement.toFixed(4) + '%');
            case 5 /* ColumnType.RANK */:
                return (0, rank_functions_1.getRankTitle)(record.achievement);
            case 6 /* ColumnType.NEXT_RANK */:
                return record.nextRanks
                    ? Array.from(record.nextRanks.values()).map((r, idx) => (react_1.default.createElement("div", { key: idx }, r.rank.minAchv + '%')))
                    : '';
            case 8 /* ColumnType.NEXT_RATING */:
                return record.nextRanks
                    ? Array.from(record.nextRanks.values()).map((r, idx) => (react_1.default.createElement("div", { key: idx },
                        Math.floor(record.level * r.rank.factor * r.rank.minAchv).toFixed(0),
                        "\u00A0(+",
                        r.minRt.toFixed(0),
                        ")")))
                    : '';
            case 7 /* ColumnType.RATING */:
                return Math.floor(record.rating).toString();
        }
    }, [index, record, isCandidate]);
    return (react_1.default.createElement(ChartRecordRow_1.ChartRecordRow, { className: (0, difficulties_1.getDifficultyClassName)(record.difficulty), columns: columns, renderCell: renderColumn }));
});
