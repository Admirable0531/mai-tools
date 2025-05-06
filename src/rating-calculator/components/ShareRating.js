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
exports.ShareRating = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const song_name_helper_1 = require("../../common/song-name-helper");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        share: 'Share',
        exportAsJson: 'Export as JSON (all records)',
        exportAllForDxRatingNet: 'Export as DXRating.net format (all records)',
        exportTopForDxRatingNet: 'Export as DXRating.net format (only b15 & b35)',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        share: '分享',
        exportAsJson: '匯出成 JSON 格式 (所有歌曲)',
        exportAllForDxRatingNet: '匯出成 DXRating.net 格式 (所有歌曲)',
        exportTopForDxRatingNet: '匯出成 DXRating.net 格式 (R 值對象曲)',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        share: '공유',
        exportAsJson: 'JSON 형식으로 내보내기 (모든 기록)',
        exportAllForDxRatingNet: 'DXRating.net 형식으로 내보내기 (모든 기록)',
        exportTopForDxRatingNet: 'DXRating.net 형식으로 내보내기 (베스트 15 & 베스트 35)',
    },
};
function downloadJson(fileContent, filename) {
    const file = new Blob([fileContent], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    console.log(url);
    const anchor = document.createElement('a');
    anchor.href = url;
    // `dxrating.export-${new Date().toISOString()}.json`
    anchor.download = filename + '.json';
    anchor.click();
    URL.revokeObjectURL(url);
}
function downloadPlayerScores(ratingData) {
    const recordsToDownload = ratingData.newChartRecords.concat(ratingData.oldChartRecords);
    const records = recordsToDownload.map((r) => {
        return {
            songName: r.songName,
            chartType: r.chartType,
            difficulty: r.difficulty,
            achievement: r.achievement,
            genre: r.genre,
            level: r.level,
        };
    });
    const filename = `maimai-scores-${new Date().toISOString()}`;
    downloadJson(JSON.stringify(records, null, 2), filename);
}
function downloadAsDxRatingNetJson(ratingData, onlyTopRecords) {
    const recordsToDownload = onlyTopRecords
        ? ratingData.newChartRecords
            .slice(0, ratingData.newTopChartsCount)
            .concat(ratingData.oldChartRecords.slice(0, ratingData.oldTopChartsCount))
        : ratingData.newChartRecords.concat(ratingData.oldChartRecords);
    const sheets = recordsToDownload.map((r) => {
        const sheetId = (0, song_name_helper_1.getSheetIdForDxRatingNet)(r.songName, r.genre, r.chartType, r.difficulty);
        return {
            sheetId,
            achievementRate: r.achievement,
        };
    });
    const filename = onlyTopRecords
        ? `dxrating-top-${new Date().toISOString()}`
        : `dxrating-all-${new Date().toISOString()}`;
    downloadJson(JSON.stringify(sheets, null, 2), filename);
}
function ShareRating(props) {
    const { gameRegion, gameVer, ratingData, songDb } = props;
    const [encodedSongImages, setEncodedSongImages] = (0, react_1.useState)('');
    const [encodedChartTypes, setEncodedChartTypes] = (0, react_1.useState)('');
    const [encodedDifficulties, setEncodedDifficulties] = (0, react_1.useState)('');
    const [encodedAchievements, setEncodedAchievements] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const topRecords = ratingData.newChartRecords
            .slice(0, ratingData.newTopChartsCount)
            .concat(ratingData.oldChartRecords.slice(0, ratingData.oldTopChartsCount));
        const songProps = topRecords
            .map((record) => songDb.getSongProperties(record.songName, record.genre, record.chartType))
            .filter((sp) => sp === null || sp === void 0 ? void 0 : sp.ico);
        if (songProps.length < topRecords.length) {
            // We can only create URL if we have ico for every song.
            setEncodedSongImages('');
            setEncodedChartTypes('');
            setEncodedDifficulties('');
            setEncodedAchievements('');
            return;
        }
        setEncodedSongImages(songProps.map((sp) => sp.ico).join('_'));
        setEncodedChartTypes(topRecords.reduce((acc, rec) => acc + rec.chartType, ''));
        setEncodedDifficulties(topRecords.reduce((acc, rec) => acc + rec.difficulty, ''));
        setEncodedAchievements(topRecords.map((res) => res.achievement).join('_'));
    }, [ratingData, songDb]);
    const downloadAllPlayerScores = (0, react_1.useCallback)((evt) => {
        evt.preventDefault();
        downloadPlayerScores(ratingData);
    }, [ratingData]);
    const downloadTopAsDxRatingNetJson = (0, react_1.useCallback)((evt) => {
        evt.preventDefault();
        downloadAsDxRatingNetJson(ratingData, true);
    }, [ratingData]);
    const downloadAllAsDxRatingNetJson = (0, react_1.useCallback)((evt) => {
        evt.preventDefault();
        downloadAsDxRatingNetJson(ratingData, false);
    }, [ratingData]);
    const messages = MessagesByLang[(0, lang_react_1.useLanguage)()];
    let shareLink = '';
    if (encodedSongImages && encodedChartTypes && encodedDifficulties && encodedAchievements) {
        const queryParams = new URLSearchParams();
        queryParams.set("region" /* QueryParam.GameRegion */, gameRegion);
        queryParams.set("gameVersion" /* QueryParam.GameVersion */, gameVer.toString());
        if (ratingData.playerName) {
            queryParams.set("playerName" /* QueryParam.PlayerName */, ratingData.playerName);
        }
        queryParams.set("dt" /* QueryParam.Date */, ratingData.date.getTime().toString());
        // We choose to use image name to identify songs because it makes the URL shorter than 2000 bytes.
        // In local testing the URL length was around 1600.
        queryParams.set("si" /* QueryParam.SongImage */, encodedSongImages);
        queryParams.set("ct" /* QueryParam.ChartType */, encodedChartTypes);
        queryParams.set("df" /* QueryParam.Difficulty */, encodedDifficulties);
        queryParams.set("ac" /* QueryParam.Achievement */, encodedAchievements);
        shareLink = '?' + queryParams;
    }
    return (react_1.default.createElement("div", null,
        shareLink ? (react_1.default.createElement("p", { className: "shareLinkItem" },
            react_1.default.createElement("a", { href: shareLink, target: "_blank" }, messages.share))) : null,
        react_1.default.createElement("p", { className: "shareLinkItem" },
            react_1.default.createElement("a", { href: "#", onClick: downloadAllPlayerScores }, messages.exportAsJson)),
        react_1.default.createElement("p", { className: "shareLinkItem" },
            react_1.default.createElement("a", { href: "#", onClick: downloadTopAsDxRatingNetJson }, messages.exportTopForDxRatingNet)),
        react_1.default.createElement("p", { className: "shareLinkItem" },
            react_1.default.createElement("a", { href: "#", onClick: downloadAllAsDxRatingNetJson }, messages.exportAllForDxRatingNet))));
}
exports.ShareRating = ShareRating;
