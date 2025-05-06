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
exports.MultiplierTable = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../common/lang-react");
const rank_functions_1 = require("../common/rank-functions");
const rating_functions_1 = require("../common/rating-functions");
const common_messages_1 = require("../rating-calculator/common-messages");
const MIN_RANK_OPTION = 'A';
const RANK_FACTOR_CELL_BASE_CLASSNAME = 'qlRankFactorCell';
const RANK_FACTOR_CELL_CLASSNAMES = ['qlRankTitleCell', 'qlThresholdCell'];
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        calculator: 'Calculator',
        rank: 'Rank',
        achievement: 'Achievement',
        factor: 'Factor',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        calculator: '計算機',
        rank: 'Rank',
        achievement: '達成率',
        factor: '係數',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        calculator: '계산기',
        rank: '등급',
        achievement: '정확도',
        factor: '배수',
    },
};
const RankFactorRow = (props) => {
    const { isHeading } = props;
    return (react_1.default.createElement("tr", null, props.values.map((v, index) => {
        const useTh = isHeading || index === 0;
        let className = RANK_FACTOR_CELL_BASE_CLASSNAME;
        if (index < RANK_FACTOR_CELL_CLASSNAMES.length) {
            className += ' ' + RANK_FACTOR_CELL_CLASSNAMES[index];
        }
        return useTh ? (react_1.default.createElement("th", { key: index, className: className }, v)) : (react_1.default.createElement("td", { key: index, className: className }, v));
    })));
};
const MultiplierTable = () => {
    const rankDefs = (0, rank_functions_1.getRankDefinitions)();
    const stopIndex = rankDefs.findIndex((r) => r.title === MIN_RANK_OPTION) + 1;
    const lang = (0, lang_react_1.useLanguage)();
    const messages = MessagesByLang[lang];
    const commonMessages = common_messages_1.CommonMessages[lang];
    const [level, setLevel] = (0, react_1.useState)(13);
    const [achv, setAchv] = (0, react_1.useState)(100);
    const handleLevelChange = (0, react_1.useCallback)((evt) => {
        const value = parseFloat(evt.currentTarget.value);
        if (!isNaN(value)) {
            setLevel(value);
        }
    }, []);
    const handleAchvChange = (0, react_1.useCallback)((evt) => {
        const value = parseFloat(evt.currentTarget.value);
        if (!isNaN(value)) {
            setAchv(value);
        }
    }, []);
    const rating = (0, rating_functions_1.getRating)(level, achv);
    return (react_1.default.createElement("div", { className: "quickLookup" },
        react_1.default.createElement("h2", { className: "quickLookupHeading" }, messages.calculator),
        react_1.default.createElement("table", { className: "calculatorTable" },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, commonMessages.level),
                    react_1.default.createElement("th", null, messages.achievement),
                    react_1.default.createElement("th", null, commonMessages.rating))),
            react_1.default.createElement("tbody", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("input", { name: "level", onChange: handleLevelChange, defaultValue: level })),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("input", { name: "achv", onChange: handleAchvChange, defaultValue: achv })),
                    react_1.default.createElement("td", null, Math.floor(rating))))),
        react_1.default.createElement("table", { className: "lookupTable" },
            react_1.default.createElement("thead", { className: "lookupTableHead" },
                react_1.default.createElement(RankFactorRow, { values: [
                        messages.rank,
                        messages.achievement,
                        messages.factor,
                        `${commonMessages.rating} - ${level}`,
                    ], isHeading: true })),
            react_1.default.createElement("tbody", null, rankDefs.slice(0, stopIndex).map((r, idx) => (react_1.default.createElement(RankFactorRow, { key: idx, values: [r.title, r.minAchv, r.factor, Math.floor((0, rating_functions_1.getRating)(level, r.minAchv))] })))))));
};
exports.MultiplierTable = MultiplierTable;
