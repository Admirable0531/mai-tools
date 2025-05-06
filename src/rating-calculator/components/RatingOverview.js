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
exports.RatingOverview = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const rating_functions_1 = require("../../common/rating-functions");
const common_messages_1 = require("../common-messages");
const grade_1 = require("../grade");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        analysisResult: 'Analysis Result',
        maximum: 'Max',
        minimum: 'Min',
        column: ':',
        date: 'Date',
        newChartsRating: 'New Charts Rating',
        oldChartsRating: 'Old Charts Rating',
        grade: 'Grade',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        analysisResult: '分析結果',
        maximum: '最大',
        minimum: '最小',
        column: '：',
        date: '日期',
        newChartsRating: '新譜面 Rating',
        oldChartsRating: '舊譜面 Rating',
        grade: '段位',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        analysisResult: '분석결과',
        maximum: '최대',
        minimum: '최소',
        column: '：',
        date: '날짜',
        newChartsRating: '신곡 레이팅',
        oldChartsRating: '구곡 레이팅',
        grade: '등급',
    },
};
const RatingOverview = ({ compactMode, playerGradeIndex, fullNewChartsRating, fullOldChartsRating, ratingData, totalRating, }) => {
    const [showMore, setShowMore] = (0, react_1.useState)();
    const toggleShowMore = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        setShowMore(!showMore);
    }, [showMore]);
    const lang = (0, lang_react_1.useLanguage)();
    const commonMsgs = common_messages_1.CommonMessages[lang];
    const messages = MessagesByLang[lang];
    const { newChartsRating, newTopChartsCount, oldChartsRating, oldTopChartsCount } = ratingData;
    const minNewChartRating = newTopChartsCount > 0
        ? Math.floor(ratingData.newChartRecords[newTopChartsCount - 1].rating)
        : 0;
    const minOldChartRating = oldTopChartsCount > 0
        ? Math.floor(ratingData.oldChartRecords[oldTopChartsCount - 1].rating)
        : 0;
    const maxNewChartRating = newTopChartsCount > 0 ? Math.floor(ratingData.newChartRecords[0].rating) : 0;
    const maxOldChartRating = oldTopChartsCount > 0 ? Math.floor(ratingData.oldChartRecords[0].rating) : 0;
    const playerGrade = playerGradeIndex > 0 ? (0, grade_1.getGradeByIndex)(playerGradeIndex) : null;
    if (compactMode) {
        return (react_1.default.createElement("div", { className: "ratingOverview" },
            react_1.default.createElement("div", null, ratingData.date.toLocaleDateString()),
            react_1.default.createElement("span", { className: "totalRating" }, totalRating),
            react_1.default.createElement("div", null, newChartsRating),
            react_1.default.createElement("div", null, "+"),
            react_1.default.createElement("div", null, oldChartsRating)));
    }
    return (react_1.default.createElement("div", { className: "ratingOverview" },
        react_1.default.createElement("div", null,
            react_1.default.createElement("span", null,
                messages.date,
                messages.column,
                ' '),
            react_1.default.createElement("span", null, ratingData.date.toLocaleDateString())),
        react_1.default.createElement("h2", { id: "outputHeading" }, ratingData.playerName || messages.analysisResult),
        react_1.default.createElement("div", { className: "totalRatingRow" },
            react_1.default.createElement("span", { className: "totalRating" },
                "Rating\uFF1A",
                ' ',
                showMore
                    ? `${totalRating} / ${getDenominatorText(fullNewChartsRating + fullOldChartsRating)}`
                    : totalRating),
            react_1.default.createElement("button", { className: "expandRatingOverview", onClick: toggleShowMore }, showMore ? '－' : '＋')),
        react_1.default.createElement("table", { className: "ratingOverviewTable" },
            react_1.default.createElement("tbody", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null, messages.newChartsRating),
                    react_1.default.createElement("td", { className: "columnColumn" }, messages.column),
                    react_1.default.createElement("td", { className: "subRatingColumn" }, showMore
                        ? `${newChartsRating} / ${getDenominatorText(fullNewChartsRating)}`
                        : newChartsRating),
                    react_1.default.createElement("td", { className: "avgRatingColumn" },
                        "(",
                        `${commonMsgs.average} ${(0, rating_functions_1.getAvg)(newChartsRating, newTopChartsCount)}`,
                        showMore
                            ? ` ${messages.maximum} ${maxNewChartRating} ${messages.minimum} ${minNewChartRating}`
                            : '',
                        ")")),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null, messages.oldChartsRating),
                    react_1.default.createElement("td", null, messages.column),
                    react_1.default.createElement("td", { className: "subRatingColumn" }, showMore
                        ? `${oldChartsRating} / ${getDenominatorText(fullOldChartsRating)}`
                        : oldChartsRating),
                    react_1.default.createElement("td", { className: "avgRatingColumn" },
                        "(",
                        `${commonMsgs.average} ${(0, rating_functions_1.getAvg)(oldChartsRating, oldTopChartsCount)}`,
                        showMore
                            ? ` ${messages.maximum} ${maxOldChartRating} ${messages.minimum} ${minOldChartRating}`
                            : '',
                        ")")),
                playerGrade && (react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null, messages.grade),
                    react_1.default.createElement("td", null, messages.column),
                    react_1.default.createElement("td", { className: "subRatingColumn", colSpan: 2 }, playerGrade.title)))))));
};
exports.RatingOverview = RatingOverview;
function getDenominatorText(denom) {
    return denom ? denom.toFixed(0) : '?';
}
