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
exports.ChartRecordHeadRow = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const common_messages_1 = require("../common-messages");
const ChartRecordRow_1 = require("./ChartRecordRow");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        num: '#',
        song: 'Song',
        nextGoal: 'Next Goal',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        num: '#',
        song: '歌曲',
        nextGoal: '下個\n目標',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        num: '#',
        song: '노래',
        nextGoal: '다음 목표',
    },
};
function getColumnTitle(lang, col) {
    const messages = MessagesByLang[lang];
    return {
        [0 /* ColumnType.NO */]: messages.num,
        [1 /* ColumnType.SONG_TITLE */]: messages.song,
        [2 /* ColumnType.CHART_TYPE */]: common_messages_1.CommonMessages[lang].chartType,
        [3 /* ColumnType.LEVEL */]: common_messages_1.CommonMessages[lang].level,
        [4 /* ColumnType.ACHIEVEMENT */]: common_messages_1.CommonMessages[lang].achievementAbbr,
        [5 /* ColumnType.RANK */]: common_messages_1.CommonMessages[lang].rank,
        [7 /* ColumnType.RATING */]: common_messages_1.CommonMessages[lang].rating,
        [6 /* ColumnType.NEXT_RANK */]: messages.nextGoal,
        [8 /* ColumnType.NEXT_RATING */]: common_messages_1.CommonMessages[lang].rating,
    }[col];
}
exports.ChartRecordHeadRow = react_1.default.memo(({ columns, sortBy }) => {
    const lang = (0, lang_react_1.useLanguage)();
    const handleClick = sortBy && ((index) => sortBy(columns[index]));
    const renderCell = (0, react_1.useCallback)((col) => getColumnTitle(lang, col), [lang]);
    return (react_1.default.createElement(ChartRecordRow_1.ChartRecordRow, { columns: columns, onClickCell: handleClick, isHeading: true, renderCell: renderCell }));
});
