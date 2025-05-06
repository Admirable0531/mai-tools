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
exports.TopChartRecords = void 0;
require("../css/song-record-styles.css");
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const common_messages_1 = require("../common-messages");
const record_comparator_1 = require("../record-comparator");
const ChartRecordsTable_1 = require("./ChartRecordsTable");
const CollapsibleContainer_1 = require("./CollapsibleContainer");
const DifficultyDistribution_1 = require("./DifficultyDistribution");
const LevelRankDistribution_1 = require("./LevelRankDistribution");
const COLUMNS = [
    0 /* ColumnType.NO */,
    1 /* ColumnType.SONG_TITLE */,
    2 /* ColumnType.CHART_TYPE */,
    3 /* ColumnType.LEVEL */,
    4 /* ColumnType.ACHIEVEMENT */,
    5 /* ColumnType.RANK */,
    7 /* ColumnType.RATING */,
];
const COMPARATOR = new Map([
    [1 /* ColumnType.SONG_TITLE */, record_comparator_1.compareSongsByName],
    [2 /* ColumnType.CHART_TYPE */, record_comparator_1.compareSongsByChartType],
    [3 /* ColumnType.LEVEL */, record_comparator_1.compareSongsByLevel],
    [4 /* ColumnType.ACHIEVEMENT */, record_comparator_1.compareSongsByAchv],
    [5 /* ColumnType.RANK */, record_comparator_1.compareSongsByAchv],
    [7 /* ColumnType.RATING */, record_comparator_1.compareSongsByRating],
]);
const TopChartRecords = (props) => {
    const { compactMode, limit, songDatabase } = props;
    // Force visible if compact mode is enabled
    const hidden = compactMode ? false : props.hidden;
    const [sortBy, setSortBy] = (0, react_1.useState)(7 /* ColumnType.RATING */);
    const [reverse, setReverse] = (0, react_1.useState)(false);
    const handleSortBy = (0, react_1.useCallback)((col) => {
        if (!COMPARATOR.has(col)) {
            setSortBy(undefined);
        }
        else if (col === sortBy) {
            setReverse(!reverse);
        }
        else {
            setSortBy(col);
            setReverse(false);
        }
    }, [sortBy, reverse]);
    let records = props.records.slice(0, limit);
    records.forEach((r, i) => (r.order = i + 1));
    if (sortBy) {
        records.sort(COMPARATOR.get(sortBy));
        if (reverse) {
            records.reverse();
        }
    }
    const lang = (0, lang_react_1.useLanguage)();
    return (react_1.default.createElement(CollapsibleContainer_1.CollapsibleContainer, { className: 'songRecordTableContainer ' + (compactMode ? 'songRecordCompactTableContainer' : ''), hidden: hidden },
        !compactMode && (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "inlineBlock" },
                react_1.default.createElement(LevelRankDistribution_1.LevelRankDistribution, { gameVer: songDatabase.gameVer, topLeftCell: common_messages_1.CommonMessages[lang].level, chartRecords: records, topChartsCount: limit })),
            react_1.default.createElement("div", { className: "inlineBlock" },
                react_1.default.createElement(DifficultyDistribution_1.DifficultyDistribution, { chartRecords: records, topChartsCount: limit })))),
        react_1.default.createElement(ChartRecordsTable_1.ChartRecordsTable, { columns: COLUMNS, tableClassname: "topRecordTable", records: records, sortBy: handleSortBy }),
        !compactMode && react_1.default.createElement("div", { className: "marginBottom30" })));
};
exports.TopChartRecords = TopChartRecords;
