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
exports.RecommendedLevels = void 0;
const react_1 = __importStar(require("react"));
const RecommendedLevelRow_1 = require("../../common/components/RecommendedLevelRow");
const lang_react_1 = require("../../common/lang-react");
const rank_functions_1 = require("../../common/rank-functions");
const common_messages_1 = require("../common-messages");
const CollapsibleContainer_1 = require("./CollapsibleContainer");
const CollapsibleSectionTitle_1 = require("./CollapsibleSectionTitle");
const MIN_ACHIEVEMENT = 99;
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        recommendedLevels: 'Recommended levels',
        projectedRating: 'Potential Rating',
        newChartsRecLv: 'New Charts',
        oldChartsRecLv: 'Old Charts',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        recommendedLevels: '刷分目標 (推薦等級)',
        newChartsRecLv: '新譜面',
        oldChartsRecLv: '舊譜面',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        recommendedLevels: '추천 레벨',
        newChartsRecLv: '신곡 채보',
        oldChartsRecLv: '구곡 채보',
    },
};
const RecommendedLevels = ({ gameRegion, gameVer, lowestNewChartRating, lowestOldChartRating, }) => {
    const lang = (0, lang_react_1.useLanguage)();
    const messages = MessagesByLang[lang];
    const ranks = (0, rank_functions_1.getRankDefinitions)().slice(0, (0, rank_functions_1.getRankIndexByAchievement)(MIN_ACHIEVEMENT) + 1);
    const newLvsByRank = (0, rank_functions_1.calcRecommendedLevels)(lowestNewChartRating + 1, ranks);
    const oldLvsByRank = (0, rank_functions_1.calcRecommendedLevels)(lowestOldChartRating + 1, ranks);
    const [contentHidden, setContentHidden] = (0, react_1.useState)(false);
    const handleTitleClick = (0, react_1.useCallback)(() => {
        setContentHidden(!contentHidden);
    }, [contentHidden]);
    return (react_1.default.createElement("div", { className: "recLvSection" },
        react_1.default.createElement(CollapsibleSectionTitle_1.CollapsibleSectionTitle, { title: messages.recommendedLevels, contentHidden: contentHidden, onClick: handleTitleClick }),
        react_1.default.createElement(CollapsibleContainer_1.CollapsibleContainer, { hidden: contentHidden },
            react_1.default.createElement("table", { className: "recLvTable" },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null, common_messages_1.CommonMessages[lang].level),
                        react_1.default.createElement("th", null, common_messages_1.CommonMessages[lang].rank),
                        react_1.default.createElement("th", null, common_messages_1.CommonMessages[lang].achievementAbbr),
                        react_1.default.createElement("th", null, common_messages_1.CommonMessages[lang].rating))),
                react_1.default.createElement("tbody", null,
                    lowestNewChartRating > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { colSpan: 4 }, messages.newChartsRecLv)),
                        ranks
                            .map((rank, rowIdx) => newLvsByRank[rank.title].map((recLv, idx) => (react_1.default.createElement(RecommendedLevelRow_1.RecommendedLevelRow, { key: rowIdx.toString() + idx, gameRegion: gameRegion, gameVer: gameVer, rankTitle: rank.title, recLv: recLv }))))
                            .flat())),
                    lowestOldChartRating > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { colSpan: 4 }, messages.oldChartsRecLv)),
                        ranks
                            .map((rank, rowIdx) => oldLvsByRank[rank.title].map((recLv, idx) => (react_1.default.createElement(RecommendedLevelRow_1.RecommendedLevelRow, { key: rowIdx.toString() + idx, gameRegion: gameRegion, gameVer: gameVer - 1, rankTitle: rank.title, recLv: recLv, includeOldVersions: true }))))
                            .flat())))),
            react_1.default.createElement("p", { className: "recLvDesc" }, gameVer > 21 /* GameVersion.BUDDiES */ ? 'X+ = X.6, X.7, X.8, X.9' : 'X+ = X.7, X.8, X.9'))));
};
exports.RecommendedLevels = RecommendedLevels;
