"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootComponent = void 0;
const react_1 = __importDefault(require("react"));
const LangSwitcher_1 = require("../common/components/LangSwitcher");
const lang_1 = require("../common/lang");
const lang_react_1 = require("../common/lang-react");
const level_helper_1 = require("../common/level-helper");
const rank_functions_1 = require("../common/rank-functions");
const user_preference_1 = require("../common/user-preference");
const MultiplierTable_1 = require("./MultiplierTable");
const OptionsInput_1 = require("./OptionsInput");
const RatingTable_1 = require("./RatingTable");
const RatingVisualizer_1 = require("./RatingVisualizer");
const RecommendedLevels_1 = require("./RecommendedLevels");
class RootComponent extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.handleChangeHeightUnit = (unit) => {
            (0, user_preference_1.saveUserPreference)("visualizerHeightUnit" /* UserPreference.HeightUnit */, unit.toFixed(0));
            this.setState({ heightUnit: unit });
        };
        this.handleSetRange = (minLv, maxLv) => {
            (0, user_preference_1.saveUserPreference)("visualizerMinLv" /* UserPreference.MinLv */, minLv);
            (0, user_preference_1.saveUserPreference)("visualizerMaxLv" /* UserPreference.MaxLv */, maxLv);
            this.setState({
                minLv,
                maxLv,
                maxRating: calculateMaxRating(parseFloat(maxLv)),
            });
        };
        this.handleSetMinRank = (minRank) => {
            (0, user_preference_1.saveUserPreference)("visualizerMinRank" /* UserPreference.MinRank */, minRank);
            this.setState({ minRank });
        };
        this.handleSetTableDisplay = (tableDisplay) => {
            (0, user_preference_1.saveUserPreference)("visualizerTableDisplay" /* UserPreference.TableDisplay */, tableDisplay);
            this.setState({ tableDisplay });
        };
        const savedHeightUnit = parseInt((0, user_preference_1.loadUserPreference)("visualizerHeightUnit" /* UserPreference.HeightUnit */));
        const heightUnit = isNaN(savedHeightUnit) ? 0 : savedHeightUnit; // Hide visualizer by default
        const maxLv = 15;
        const lang = (0, lang_1.getInitialLanguage)();
        updateDocumentTitle(lang);
        this.state = {
            lang,
            minLv: (0, user_preference_1.loadUserPreference)("visualizerMinLv" /* UserPreference.MinLv */) || '10',
            minRank: (0, user_preference_1.loadUserPreference)("visualizerMinRank" /* UserPreference.MinRank */) || 'SS',
            maxLv: (0, user_preference_1.loadUserPreference)("visualizerMaxLv" /* UserPreference.MaxLv */) || '14',
            width: 30,
            heightUnit,
            maxRating: calculateMaxRating(maxLv),
            tableDisplay: (0, user_preference_1.loadUserPreference)("visualizerTableDisplay" /* UserPreference.TableDisplay */) || "RANGE" /* DisplayValue.RANGE */,
            topPadding: heightUnit * 2 + 50,
            axisLabelStep: 5,
        };
    }
    componentDidUpdate(_, prevState) {
        if (this.state.lang !== prevState.lang) {
            updateDocumentTitle(this.state.lang);
        }
    }
    render() {
        const { lang, heightUnit, maxRating, axisLabelStep, minLv, minRank, maxLv, tableDisplay, topPadding, } = this.state;
        const levels = this.getLevels();
        const canZoomIn = levels[0].minLv + 1 < levels[levels.length - 1].maxLv;
        const allRanks = (0, rank_functions_1.getRankDefinitions)();
        const ranksEndIndex = allRanks.findIndex((rank) => rank.title == minRank);
        const ranks = allRanks.slice(0, ranksEndIndex + 1);
        return (react_1.default.createElement(lang_react_1.LangContext.Provider, { value: lang },
            react_1.default.createElement("div", { className: "ratingVisualizer" },
                react_1.default.createElement(OptionsInput_1.OptionsInput, { heightUnit: heightUnit, maxLv: maxLv, minLv: minLv, minRank: minRank, tableDisplay: tableDisplay, onChangeUnit: this.handleChangeHeightUnit, onSetMinRank: this.handleSetMinRank, onSetRange: this.handleSetRange, onSetTableDisplay: this.handleSetTableDisplay }),
                react_1.default.createElement(RatingVisualizer_1.RatingVisualizer, { canZoomIn: canZoomIn, heightUnit: heightUnit, maxRating: maxRating, levels: levels, topPadding: topPadding, axisLabelStep: axisLabelStep, ranks: ranks, onSetRange: this.handleSetRange }),
                react_1.default.createElement("div", { className: "container" },
                    react_1.default.createElement(RatingTable_1.RatingTable, { ranks: ranks, levels: levels, displayValue: tableDisplay }),
                    react_1.default.createElement(RecommendedLevels_1.RecommendedLevels, null),
                    react_1.default.createElement("hr", { className: "sectionSep" }),
                    react_1.default.createElement(MultiplierTable_1.MultiplierTable, null),
                    react_1.default.createElement("footer", { className: "footer" },
                        react_1.default.createElement("hr", { className: "sectionSep" }),
                        react_1.default.createElement(LangSwitcher_1.LangSwitcher, null),
                        react_1.default.createElement("br", null),
                        react_1.default.createElement("span", null, "Made by "),
                        react_1.default.createElement("a", { className: "authorLink", href: "https://github.com/myjian", target: "_blank" }, "myjian"),
                        react_1.default.createElement("span", null, "."))))));
    }
    getLevels() {
        const { minLv, maxLv } = this.state;
        // TODO: Take input from option or query params
        const startLv = (0, level_helper_1.getMinConstant)(21 /* GameVersion.BUDDiES */, minLv);
        const endLv = (0, level_helper_1.getMaxConstant)(21 /* GameVersion.BUDDiES */, maxLv);
        const lvs = [];
        let currentLv = startLv;
        const showEachConstant = endLv - startLv < 1;
        while (currentLv <= endLv) {
            // TODO: support BUDDiES PLUS
            const nextLv = showEachConstant
                ? currentLv + 0.1
                : Math.round(currentLv) === currentLv
                    ? currentLv + 0.7
                    : currentLv + 0.3;
            lvs.push({
                title: showEachConstant
                    ? currentLv.toFixed(1)
                    : (0, level_helper_1.getOfficialLevel)(21 /* GameVersion.BUDDiES */, currentLv),
                minLv: currentLv,
                maxLv: nextLv - 0.1,
            });
            currentLv = nextLv;
        }
        return lvs;
    }
}
exports.RootComponent = RootComponent;
function calculateMaxRating(maxLv) {
    const maxRank = (0, rank_functions_1.getRankDefinitions)()[0];
    return Math.floor(maxRank.minAchv * maxRank.factor * maxLv);
}
function updateDocumentTitle(lang) {
    document.title = {
        ["en-US" /* Language.en_US */]: 'maimai DX Rating Lookup Table & Visualization',
        ["zh-TW" /* Language.zh_TW */]: 'maimai DX R值圖表',
        ["ko-KR" /* Language.ko_KR */]: 'maimai DX 레이팅 상수 표 & 시각화',
    }[lang];
}
