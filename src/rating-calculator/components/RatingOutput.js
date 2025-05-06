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
exports.RatingOutput = void 0;
require("../css/rating-output.css");
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const rating_functions_1 = require("../../common/rating-functions");
const rating_analyzer_1 = require("../rating-analyzer");
const RatingCandidates_1 = require("./RatingCandidates");
const RatingOverview_1 = require("./RatingOverview");
const RatingSubjects_1 = require("./RatingSubjects");
const RecommendedLevels_1 = require("./RecommendedLevels");
const ShareRating_1 = require("./ShareRating");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        compactMode: 'Compact mode',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        compactMode: '精簡版',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        compactMode: '간결한 모드',
    },
};
const RatingOutput = ({ gameVer, allSongs, ratingData, gameRegion, playerGradeIndex, songDatabase, }) => {
    const state = (0, react_1.useMemo)(() => {
        const allSongProps = allSongs
            ? songDatabase.getPropsForSongs(allSongs)
            : gameRegion === "jp" /* GameRegion.Jp */
                ? songDatabase.getAllProps()
                : null;
        const newSongs = allSongProps === null || allSongProps === void 0 ? void 0 : allSongProps.filter((song) => song.debut === gameVer);
        const oldSongs = allSongProps === null || allSongProps === void 0 ? void 0 : allSongProps.filter((song) => song.debut < gameVer);
        const fullNewChartsRating = newSongs ? (0, rating_functions_1.calculateFullRating)(newSongs, rating_analyzer_1.NUM_TOP_NEW_CHARTS) : 0;
        const fullOldChartsRating = oldSongs ? (0, rating_functions_1.calculateFullRating)(oldSongs, rating_analyzer_1.NUM_TOP_OLD_CHARTS) : 0;
        return { newSongs, oldSongs, fullNewChartsRating, fullOldChartsRating };
    }, [songDatabase, allSongs, gameVer, gameRegion]);
    const [compactMode, setCompactMode] = (0, react_1.useState)(false);
    const toggleCompactMode = (0, react_1.useCallback)((evt) => {
        setCompactMode(evt.currentTarget.checked);
    }, []);
    const { newTopChartsCount, oldTopChartsCount } = ratingData;
    const { fullNewChartsRating, fullOldChartsRating } = state;
    const totalRating = ratingData.newChartsRating + ratingData.oldChartsRating;
    const messages = MessagesByLang[(0, lang_react_1.useLanguage)()];
    const ratingOverview = (react_1.default.createElement(RatingOverview_1.RatingOverview, { compactMode: compactMode, fullNewChartsRating: fullNewChartsRating, fullOldChartsRating: fullOldChartsRating, ratingData: ratingData, totalRating: totalRating, playerGradeIndex: playerGradeIndex }));
    const ratingSubjectsNew = (react_1.default.createElement(RatingSubjects_1.RatingSubjects, { songDatabase: songDatabase, ratingData: ratingData, compactMode: compactMode, isCurrentVersion: true }));
    const ratingSubjectsOld = (react_1.default.createElement(RatingSubjects_1.RatingSubjects, { songDatabase: songDatabase, ratingData: ratingData, compactMode: compactMode }));
    return (react_1.default.createElement("div", { id: "ratingOutput" },
        react_1.default.createElement("hr", { className: "sectionSep" }),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", null,
                react_1.default.createElement("input", { type: "checkbox", checked: compactMode, onChange: toggleCompactMode }),
                ' ',
                messages.compactMode)),
        react_1.default.createElement(ShareRating_1.ShareRating, { gameRegion: gameRegion, gameVer: gameVer, ratingData: ratingData, songDb: songDatabase }),
        compactMode ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: "compactRatingRow" },
                ratingOverview,
                ratingSubjectsNew),
            ratingSubjectsOld)) : (react_1.default.createElement(react_1.default.Fragment, null,
            ratingOverview,
            react_1.default.createElement(RecommendedLevels_1.RecommendedLevels, { gameRegion: gameRegion, gameVer: gameVer, lowestNewChartRating: newTopChartsCount > 0 ? ratingData.newChartRecords[newTopChartsCount - 1].rating : 0, lowestOldChartRating: oldTopChartsCount > 0 ? ratingData.oldChartRecords[oldTopChartsCount - 1].rating : 0 }),
            react_1.default.createElement("div", null,
                ratingSubjectsNew,
                ratingSubjectsOld))),
        !compactMode && (react_1.default.createElement("div", null,
            react_1.default.createElement(RatingCandidates_1.RatingCandidates, { songDatabase: songDatabase, isCurrentVersion: true, songList: state.newSongs, ratingData: ratingData }),
            react_1.default.createElement(RatingCandidates_1.RatingCandidates, { songDatabase: songDatabase, songList: state.oldSongs, ratingData: ratingData })))));
};
exports.RatingOutput = RatingOutput;
