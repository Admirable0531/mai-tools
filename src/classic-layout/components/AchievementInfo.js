"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementInfo = void 0;
const react_1 = __importDefault(require("react"));
const rank_functions_1 = require("../../common/rank-functions");
const MAX_DX_ACHIEVEMENT = 101;
function calculateRankTitle(finaleAchv, isDxMode, dxAchv, apFcStatus) {
    if (isDxMode) {
        return (0, rank_functions_1.getRankTitle)(dxAchv);
    }
    if (apFcStatus === 'AP+') {
        return 'SSS+';
    }
    return (0, rank_functions_1.getFinaleRankTitle)(finaleAchv);
}
function getApFcClassName(apFcStatus) {
    const base = 'apfc';
    if (!apFcStatus) {
        return base;
    }
    else if (apFcStatus === 'FC+') {
        return base + ' fcplus';
    }
    return apFcStatus.includes('AP') ? base + ' ap' : base;
}
function getSyncClassName(isDxMode) {
    return isDxMode ? 'sync' : 'sync finaleSync';
}
class AchievementInfo extends react_1.default.PureComponent {
    static getDerivedStateFromProps(props) {
        const { dxAchv, apFcStatus, finaleAchv, isDxMode } = props;
        return { rankTitle: calculateRankTitle(finaleAchv, isDxMode, dxAchv, apFcStatus) };
    }
    componentDidMount() {
        this.fetchRankImage();
    }
    componentDidUpdate() {
        this.fetchRankImage();
    }
    render() {
        const { apFcStatus, apFcImg, rankImgMap, isHighScore, syncStatus, syncImg, maxFinaleAchv, dxAchv, finaleAchv, isDxMode, toggleDisplayMode, showMaxAchv, } = this.props;
        const { rankTitle } = this.state;
        const rankImg = rankImgMap.get(rankTitle);
        const rankElem = rankImg ? (react_1.default.createElement("img", { className: "rankImg", src: rankImg, alt: rankTitle })) : (rankTitle);
        const apFcElem = apFcImg ? (react_1.default.createElement("img", { className: "apFcImg", src: apFcImg, alt: apFcStatus })) : (apFcStatus);
        const syncElem = syncImg ? (react_1.default.createElement("img", { className: "syncImg", src: syncImg, alt: syncStatus })) : (this.getSyncStatusText(syncStatus, isDxMode));
        const achvText = isDxMode ? dxAchv.toFixed(4) : finaleAchv.toFixed(2);
        const maxAchvText = isDxMode ? MAX_DX_ACHIEVEMENT.toFixed(4) : maxFinaleAchv.toFixed(2);
        return (react_1.default.createElement("div", { className: "achievementInfo" },
            react_1.default.createElement("div", { className: "achvInfoSpace" }),
            react_1.default.createElement("div", { className: "rank" }, rankElem),
            react_1.default.createElement("div", { className: getApFcClassName(apFcStatus) }, apFcElem),
            react_1.default.createElement("div", { className: getSyncClassName(isDxMode) }, syncElem),
            react_1.default.createElement("div", { className: "playerScore" },
                react_1.default.createElement("div", { className: "highScore" }, isHighScore ? 'HIGH SCORE!!' : ' '),
                react_1.default.createElement("button", { className: "achievement", onClick: toggleDisplayMode },
                    "\u9054\u6210\u7387\uFF1A",
                    react_1.default.createElement("span", { className: 'achvNum' + (showMaxAchv ? ' hasMaxAchv' : '') },
                        react_1.default.createElement("span", { className: "playerAchv" },
                            achvText,
                            "\uFF05"),
                        showMaxAchv && react_1.default.createElement("span", { className: "maxAchv" },
                            maxAchvText,
                            "\uFF05"))))));
    }
    getSyncStatusText(syncStatus, isDxMode) {
        if (syncStatus && !isDxMode) {
            switch (syncStatus) {
                case 'FS':
                case 'FS+':
                    return 'MAX FEVER';
                case 'FSD':
                case 'FSD+':
                    return '100% SYNC';
            }
        }
        return syncStatus;
    }
    fetchRankImage() {
        const { rankImgMap, fetchRankImage } = this.props;
        const { rankTitle } = this.state;
        if (!rankImgMap.has(rankTitle)) {
            fetchRankImage(rankTitle);
        }
    }
}
exports.AchievementInfo = AchievementInfo;
