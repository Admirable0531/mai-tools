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
exports.ScorePage = void 0;
const react_1 = __importStar(require("react"));
const game_version_1 = require("../../common/game-version");
const number_helper_1 = require("../../common/number-helper");
const rank_functions_1 = require("../../common/rank-functions");
const AchievementInfo_1 = require("./AchievementInfo");
const DateAndPlace_1 = require("./DateAndPlace");
const JudgementContainer_1 = require("./JudgementContainer");
const SongImg_1 = require("./SongImg");
const SongInfo_1 = require("./SongInfo");
function formatLossNumber(loss, digits) {
    return loss == 0
        ? ''
        : '-' + (digits ? (0, number_helper_1.formatFloat)(loss, digits) + '%' : loss.toLocaleString('en'));
}
const ScorePage = (props) => {
    const { achievement, apFcImg, rankImg, syncImg, highScore, date, place, songTitle, track, difficulty, songImgSrc, judgementDisplayMap, combo, syncStatus, apFcStatus, finaleAchievement, maxFinaleScore, breakDistribution, } = props;
    const gameVerStr = new URLSearchParams(window.location.search).get("gameVersion" /* QueryParam.GameVersion */);
    const gameVer = (0, game_version_1.validateGameVersion)(gameVerStr, 0);
    const [isDxMode, setIsDxMode] = (0, react_1.useState)(gameVer >= 13 /* GameVersion.DX */);
    const [showDetail, setShowDetail] = (0, react_1.useState)(true);
    const noteLoss = getNoteLoss(isDxMode, props.achvLossDetail);
    const toggleDxMode = (0, react_1.useCallback)(() => {
        setIsDxMode(!isDxMode);
    }, [isDxMode, setIsDxMode]);
    const toggleDisplayMode = (0, react_1.useCallback)(() => {
        setShowDetail(!showDetail);
    }, [showDetail, setShowDetail]);
    return (react_1.default.createElement("div", { className: "songScoreContainer" },
        react_1.default.createElement(DateAndPlace_1.DateAndPlace, { actualPlace: place, date: date, isDxMode: isDxMode, toggleDxMode: toggleDxMode }),
        react_1.default.createElement("div", { className: "songScoreBody" },
            react_1.default.createElement("hr", { className: "trackTopLine" }),
            react_1.default.createElement(SongInfo_1.SongInfo, { songTitle: songTitle, track: track, difficulty: difficulty }),
            react_1.default.createElement(SongImg_1.SongImg, { imgSrc: songImgSrc }),
            react_1.default.createElement(AchievementInfo_1.AchievementInfo, { apFcStatus: apFcStatus, apFcImg: apFcImg, rankImgMap: rankImg, syncStatus: syncStatus, syncImg: syncImg, isDxMode: isDxMode, isHighScore: highScore, dxAchv: achievement, finaleAchv: finaleAchievement, maxFinaleAchv: maxFinaleScore, showMaxAchv: showDetail, toggleDisplayMode: toggleDisplayMode, fetchRankImage: props.fetchRankImage }),
            react_1.default.createElement(JudgementContainer_1.JudgementContainer, { judgementDisplayMap: judgementDisplayMap, noteLoss: noteLoss, breakDistribution: breakDistribution, scorePerType: getDisplayScorePerType(isDxMode, showDetail, props), nextRank: getNextRankEntry(isDxMode, props), combo: combo, isDxMode: isDxMode, showDetail: showDetail }))));
};
exports.ScorePage = ScorePage;
function getNextRankEntry(isDxMode, props) {
    const achv = isDxMode ? props.achievement : props.finaleAchievement;
    if (isDxMode) {
        if (achv === 101) {
            return undefined;
        }
        else if (achv >= 100.5) {
            return {
                title: 'AP+',
                diff: 101 - achv,
            };
        }
        const nextRankDef = (0, rank_functions_1.getRankDefinitions)()[(0, rank_functions_1.getRankIndexByAchievement)(achv) - 1];
        return {
            title: nextRankDef.title,
            diff: nextRankDef.minAchv - achv,
        };
    }
    let nextRank;
    props.finaleBorder.forEach((diff, title) => {
        if (diff > 0 && !nextRank) {
            nextRank = { title, diff };
        }
    });
    return nextRank;
}
function getNoteLoss(isDxMode, achvLossDetail) {
    const lossDetail = isDxMode ? achvLossDetail.dx : achvLossDetail.finale;
    const digits = isDxMode ? 2 : 0;
    const map = new Map();
    lossDetail.forEach((d, noteType) => {
        map.set(noteType, {
            perfect: formatLossNumber(d.perfect, digits),
            great: formatLossNumber(d.great, digits),
            good: formatLossNumber(d.good, digits),
            miss: formatLossNumber(d.miss, digits),
        });
    });
    return map;
}
function getDisplayScorePerType(isDxMode, showDetail, props) {
    const lossDetail = isDxMode ? props.achvLossDetail.dx : props.achvLossDetail.finale;
    if (showDetail) {
        const digits = isDxMode ? 4 : 0;
        const displayScorePerType = new Map();
        lossDetail.forEach((detail, noteType) => {
            const isMax = detail.total === 0;
            const score = formatLossNumber(detail.total, digits);
            displayScorePerType.set(noteType, { isMax, score });
        });
        return displayScorePerType;
    }
    return isDxMode ? props.dxAchvPerType : props.playerScorePerType;
}
