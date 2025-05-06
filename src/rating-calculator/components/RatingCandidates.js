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
exports.RatingCandidates = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const CandidatesChartRecords_1 = require("./CandidatesChartRecords");
const CollapsibleSectionTitle_1 = require("./CollapsibleSectionTitle");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        newChartsRatingCandidates: 'New Charts Rating Candidates:',
        oldChartsRatingCandidates: 'Old Charts Rating Candidates:',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        newChartsRatingCandidates: '新譜面 Rating 候選曲：',
        oldChartsRatingCandidates: '舊譜面 Rating 候選曲：',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        newChartsRatingCandidates: '신곡 레이팅 후보：',
        oldChartsRatingCandidates: '구곡 레이팅 후보：',
    },
};
const RatingCandidates = ({ songDatabase, ratingData, songList, isCurrentVersion }) => {
    const [hideCandidates, setHideCandidates] = (0, react_1.useState)(false);
    const toggleCandidateChartsDisplay = (0, react_1.useCallback)(() => {
        setHideCandidates(!hideCandidates);
    }, [hideCandidates]);
    const messages = MessagesByLang[(0, lang_react_1.useLanguage)()];
    const title = isCurrentVersion
        ? messages.newChartsRatingCandidates
        : messages.oldChartsRatingCandidates;
    return (react_1.default.createElement("div", { className: 'ratingCandidates ' + (hideCandidates ? 'contentHidden' : '') },
        react_1.default.createElement(CollapsibleSectionTitle_1.CollapsibleSectionTitle, { title: title, contentHidden: hideCandidates, onClick: toggleCandidateChartsDisplay, isCandidateList: true }),
        react_1.default.createElement(CandidatesChartRecords_1.CandidateChartRecords, { ratingData: ratingData, songDatabase: songDatabase, hidden: hideCandidates, isCurrentVersion: isCurrentVersion, songList: songList })));
};
exports.RatingCandidates = RatingCandidates;
