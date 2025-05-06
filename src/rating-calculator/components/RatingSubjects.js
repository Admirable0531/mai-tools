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
exports.RatingSubjects = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const rating_functions_1 = require("../../common/rating-functions");
const common_messages_1 = require("../common-messages");
const rating_analyzer_1 = require("../rating-analyzer");
const CollapsibleSectionTitle_1 = require("./CollapsibleSectionTitle");
const TopChartRecords_1 = require("./TopChartRecords");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        newChartsRatingSubjects: 'New Charts Rating Subjects (best {count}):',
        oldChartsRatingSubjects: 'Old Charts Rating Subjects (best {count}):',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        newChartsRatingSubjects: '新譜面 Rating 對象曲 (取最佳 {count} 首)：',
        oldChartsRatingSubjects: '舊譜面 Rating 對象曲 (取最佳 {count} 首)：',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        newChartsRatingSubjects: '신곡 레이팅 (최고 기록 {count} 개)：',
        oldChartsRatingSubjects: '구곡 레이팅 (최고 기록 {count} 개)：',
    },
};
const RatingSubjects = ({ compactMode, songDatabase, ratingData, isCurrentVersion, }) => {
    const [hideContent, setHideContent] = (0, react_1.useState)(false);
    const toggleContentDisplay = (0, react_1.useCallback)(() => {
        setHideContent(!hideContent);
    }, [hideContent]);
    const lang = (0, lang_react_1.useLanguage)();
    const commonMsgs = common_messages_1.CommonMessages[lang];
    const messages = MessagesByLang[lang];
    const avgRating = isCurrentVersion
        ? (0, rating_functions_1.getAvg)(ratingData.newChartsRating, ratingData.newTopChartsCount)
        : (0, rating_functions_1.getAvg)(ratingData.oldChartsRating, ratingData.oldTopChartsCount);
    const records = isCurrentVersion ? ratingData.newChartRecords : ratingData.oldChartRecords;
    const topCount = isCurrentVersion ? ratingData.newTopChartsCount : ratingData.oldTopChartsCount;
    const maxTopCount = isCurrentVersion ? rating_analyzer_1.NUM_TOP_NEW_CHARTS : rating_analyzer_1.NUM_TOP_OLD_CHARTS;
    const titleWithPlaceholder = isCurrentVersion
        ? messages.newChartsRatingSubjects
        : messages.oldChartsRatingSubjects;
    const title = titleWithPlaceholder.replace('{count}', maxTopCount.toFixed(0));
    return (react_1.default.createElement("div", { className: 'ratingSubjects ' + (hideContent ? 'contentHidden' : '') },
        compactMode ? (react_1.default.createElement("div", { className: "ratingSubjectsMiniHeading" }, `${title} ${commonMsgs.average} ${avgRating}`)) : (react_1.default.createElement(CollapsibleSectionTitle_1.CollapsibleSectionTitle, { title: title, contentHidden: hideContent, onClick: toggleContentDisplay })),
        react_1.default.createElement(TopChartRecords_1.TopChartRecords, { songDatabase: songDatabase, records: records, limit: topCount, hidden: hideContent, compactMode: compactMode })));
};
exports.RatingSubjects = RatingSubjects;
