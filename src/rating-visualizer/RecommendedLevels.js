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
const RecommendedLevelRow_1 = require("../common/components/RecommendedLevelRow");
const lang_react_1 = require("../common/lang-react");
const rank_functions_1 = require("../common/rank-functions");
const user_preference_1 = require("../common/user-preference");
const common_messages_1 = require("../rating-calculator/common-messages");
const rating_analyzer_1 = require("../rating-calculator/rating-analyzer");
const MIN_ACHIEVEMENT = 99;
const DEFAULT_TARGET_RATING = 12000;
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        target: 'Target',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        target: '과녁',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        target: '目標',
    },
};
const RecommendedLevels = () => {
    const queryParams = new URLSearchParams(location.search);
    const [targetRating, setTargetRating] = (0, react_1.useState)(() => parseInt(queryParams.get("targetRating" /* QueryParam.TargetRating */)) ||
        parseInt((0, user_preference_1.loadUserPreference)("targetRating" /* UserPreference.TargetRating */)) ||
        DEFAULT_TARGET_RATING);
    const handleTargetRatingChange = (e) => {
        const rating = parseInt(e.currentTarget.value);
        if (isNaN(rating) || rating <= 0) {
            return;
        }
        (0, user_preference_1.saveUserPreference)("targetRating" /* UserPreference.TargetRating */, rating.toFixed(0));
        setTargetRating(rating);
    };
    const lang = (0, lang_react_1.useLanguage)();
    const messages = MessagesByLang[lang];
    const commonMessages = common_messages_1.CommonMessages[lang];
    const targetRatingPerSong = Math.ceil(targetRating / (rating_analyzer_1.NUM_TOP_NEW_CHARTS + rating_analyzer_1.NUM_TOP_OLD_CHARTS));
    const ranks = (0, rank_functions_1.getRankDefinitions)().slice(0, (0, rank_functions_1.getRankIndexByAchievement)(MIN_ACHIEVEMENT) + 1);
    const recLvsByRank = (0, rank_functions_1.calcRecommendedLevels)(targetRatingPerSong, ranks);
    return (react_1.default.createElement("div", { className: "suggestLvByRating" },
        react_1.default.createElement("label", { className: "targetRatingLabel" },
            messages.target,
            ":",
            ' ',
            react_1.default.createElement("input", { className: "targetRating", onChange: handleTargetRatingChange, type: "number", value: targetRating })),
        react_1.default.createElement("table", { className: "lookupTable recLvTable" },
            react_1.default.createElement("thead", { className: "lookupTableHead" },
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, commonMessages.level),
                    react_1.default.createElement("th", null, commonMessages.rank),
                    react_1.default.createElement("th", null, commonMessages.achievementAbbr),
                    react_1.default.createElement("th", null, commonMessages.rating))),
            react_1.default.createElement("tbody", null, ranks.map((rank) => recLvsByRank[rank.title].map((recLv, idx) => (react_1.default.createElement(RecommendedLevelRow_1.RecommendedLevelRow, { key: idx, rankTitle: rank.title, recLv: recLv }))))))));
};
exports.RecommendedLevels = RecommendedLevels;
