"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootComponent = void 0;
const react_1 = __importDefault(require("react"));
const game_region_1 = require("../../common/game-region");
const game_version_1 = require("../../common/game-version");
const magic_api_1 = require("../../common/infra/magic-api");
const lang_1 = require("../../common/lang");
const lang_react_1 = require("../../common/lang-react");
const song_props_1 = require("../../common/song-props");
const user_preference_1 = require("../../common/user-preference");
const rating_analyzer_1 = require("../rating-analyzer");
const DebugActions_1 = require("./DebugActions");
const InternalLvInput_1 = require("./InternalLvInput");
const LanguageChooser_1 = require("./LanguageChooser");
const OtherTools_1 = require("./OtherTools");
const PageFooter_1 = require("./PageFooter");
const RatingOutput_1 = require("./RatingOutput");
const RegionSelect_1 = require("./RegionSelect");
const ScoreInput_1 = require("./ScoreInput");
const VersionSelect_1 = require("./VersionSelect");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        computeRating: 'Calculate Rating',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        computeRating: '計算 Rating 值',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        computeRating: '레이팅 계산하기',
    },
};
class RootComponent extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.playerGradeIndex = 0;
        this.referrer = document.referrer && new URL(document.referrer).origin;
        this.date = new Date();
        this.playerScores = [];
        this.changeLanguage = (lang) => {
            this.setState({ lang });
            (0, lang_1.saveLanguage)(lang);
            this.postMessageToOpener({ action: 'saveLanguage', payload: lang });
        };
        this.selectVersion = (gameVer) => __awaiter(this, void 0, void 0, function* () {
            this.setState({ gameVer }, this.analyzeRating);
        });
        this.selectRegion = (region) => __awaiter(this, void 0, void 0, function* () {
            this.setState({ region }, this.analyzeRating);
        });
        this.setPlayerScores = (records) => {
            this.playerScores = records;
            this.analyzeRating();
        };
        this.analyzeRating = (evt) => __awaiter(this, void 0, void 0, function* () {
            if (evt) {
                evt.preventDefault();
            }
            const { gameVer, region, playerName } = this.state;
            if (!this.songDatabase ||
                this.songDatabase.gameVer !== gameVer ||
                this.songDatabase.region !== region) {
                this.songDatabase = yield (0, song_props_1.loadSongDatabase)(gameVer, region);
            }
            const lvInputTextarea = document.querySelector('#lvInput');
            if (lvInputTextarea instanceof HTMLTextAreaElement) {
                (0, user_preference_1.saveUserPreference)("internalLvOverride" /* UserPreference.InternalLvOverride */, lvInputTextarea.value);
                const overrides = (0, InternalLvInput_1.parseInternalLvInput)(lvInputTextarea.value);
                console.log(overrides);
                overrides.forEach((override) => this.songDatabase.updateSong(override));
            }
            console.log('Song database:', this.songDatabase);
            console.log('Player scores:', this.playerScores);
            if (!this.playerScores.length) {
                this.setState({ ratingData: undefined });
                return;
            }
            const ratingData = (0, rating_analyzer_1.analyzePlayerRating)(this.songDatabase, this.date, playerName, this.playerScores, region, gameVer, gameVer < this.currentGameVer);
            console.log('Rating Data:', ratingData);
            this.setState({ ratingData }, () => setTimeout(() => {
                location.assign('#ratingOutput');
            }, 0));
        });
        const queryParams = new URLSearchParams(location.search);
        const gameVerParam = queryParams.get("gameVersion" /* QueryParam.GameVersion */);
        this.currentGameVer = (0, game_version_1.validateGameVersion)(gameVerParam, magic_api_1.RATING_CALCULATOR_SUPPORTED_VERSIONS[0], magic_api_1.RATING_CALCULATOR_SUPPORTED_VERSIONS[magic_api_1.RATING_CALCULATOR_SUPPORTED_VERSIONS.length - 1]);
        const region = (0, game_region_1.getGameRegionFromShortString)(queryParams.get("region" /* QueryParam.GameRegion */));
        const friendIdx = queryParams.get("friendIdx" /* QueryParam.FriendIdx */);
        const playerName = queryParams.get("playerName" /* QueryParam.PlayerName */);
        const date = parseInt(queryParams.get("dt" /* QueryParam.Date */) || '');
        const lang = (0, lang_1.getInitialLanguage)();
        updateDocumentTitle(lang);
        this.state = {
            lang,
            region,
            gameVer: this.currentGameVer,
            friendIdx,
            playerName,
            progress: '',
        };
        if (!isNaN(date)) {
            this.date = new Date(date);
        }
        (0, song_props_1.loadSongDatabase)(this.currentGameVer, region).then((songDb) => {
            this.songDatabase = songDb;
            this.setPlayerScores(readPlayerScoresFromQueryParams(queryParams, songDb));
        });
        this.initWindowCommunication();
    }
    componentDidUpdate(_prevProps, prevState) {
        if (this.state.lang != prevState.lang) {
            updateDocumentTitle(this.state.lang);
        }
    }
    render() {
        const { lang, region, gameVer, ratingData, allSongs, progress } = this.state;
        const messages = MessagesByLang[lang];
        return (react_1.default.createElement(lang_react_1.LangContext.Provider, { value: lang },
            react_1.default.createElement("table", { className: "inputSelectTable" },
                react_1.default.createElement("tbody", null,
                    react_1.default.createElement(LanguageChooser_1.LanguageChooser, { activeLanguage: lang, changeLanguage: this.changeLanguage }),
                    react_1.default.createElement(RegionSelect_1.RegionSelect, { gameRegion: region, handleRegionSelect: this.selectRegion }),
                    react_1.default.createElement(VersionSelect_1.VersionSelect, { gameVer: gameVer, handleVersionSelect: this.selectVersion }))),
            react_1.default.createElement(ScoreInput_1.ScoreInput, { setPlayerScores: this.setPlayerScores }),
            react_1.default.createElement(InternalLvInput_1.InternalLvInput, null),
            react_1.default.createElement("div", { className: "actionArea" },
                react_1.default.createElement("button", { className: "analyzeRatingBtn", onClick: this.analyzeRating }, messages.computeRating)),
            progress ? react_1.default.createElement("p", null, progress) : null,
            ratingData && (react_1.default.createElement(RatingOutput_1.RatingOutput, { gameRegion: region, gameVer: gameVer, songDatabase: this.songDatabase, ratingData: ratingData, playerGradeIndex: this.playerGradeIndex, allSongs: allSongs })),
            react_1.default.createElement("hr", { className: "sectionSep" }),
            react_1.default.createElement(DebugActions_1.DebugActions, null),
            react_1.default.createElement("hr", { className: "sectionSep" }),
            react_1.default.createElement(PageFooter_1.PageFooter, null),
            react_1.default.createElement(OtherTools_1.OtherTools, { gameVer: gameVer })));
    }
    postMessageToOpener(data) {
        if (window.opener) {
            if (this.referrer) {
                window.opener.postMessage(data, this.referrer);
            }
            else {
                // Unfortunately, document.referrer is not set when mai-tools is run on localhost.
                // Send message to all maimai net origins and pray that one of them will respond.
                for (const origin of game_region_1.MAIMAI_NET_ORIGINS) {
                    window.opener.postMessage(data, origin);
                }
            }
        }
    }
    initWindowCommunication() {
        window.addEventListener('message', (evt) => {
            if (!(0, game_region_1.isMaimaiNetOrigin)(evt.origin) && evt.origin !== window.origin) {
                return;
            }
            this.referrer = evt.origin;
            console.log(evt.origin, evt.data);
            if (typeof evt.data !== 'object') {
                return;
            }
            let payloadAsInt;
            switch (evt.data.action) {
                case 'gameVersion':
                    this.setState({
                        region: (0, game_region_1.getGameRegionFromOrigin)(evt.origin),
                        gameVer: (0, game_version_1.validateGameVersion)(evt.data.payload, magic_api_1.RATING_CALCULATOR_SUPPORTED_VERSIONS[0], magic_api_1.RATING_CALCULATOR_SUPPORTED_VERSIONS[magic_api_1.RATING_CALCULATOR_SUPPORTED_VERSIONS.length - 1]),
                    }, this.analyzeRating);
                    break;
                case 'playerGrade':
                    payloadAsInt = parseInt(evt.data.payload);
                    if (payloadAsInt) {
                        this.playerGradeIndex = payloadAsInt;
                    }
                    break;
                case 'showProgress':
                    this.setState({ progress: evt.data.payload });
                    break;
                case 'setPlayerScore':
                    this.setPlayerScores(evt.data.payload);
                    break;
                case 'allSongs':
                    this.setState({ allSongs: evt.data.payload });
                    break;
            }
        });
        const { friendIdx, lang } = this.state;
        if (friendIdx) {
            // Analyze friend rating
            this.postMessageToOpener({ action: 'getFriendRecords', payload: friendIdx });
        }
        else {
            // Analyze self rating
            this.postMessageToOpener({ action: 'ready', payload: lang });
        }
    }
}
exports.RootComponent = RootComponent;
function updateDocumentTitle(lang) {
    switch (lang) {
        case "en-US" /* Language.en_US */:
            document.title = 'maimai DX Rating Analyzer';
            break;
        case "zh-TW" /* Language.zh_TW */:
            document.title = 'maimai DX R 值分析工具';
            break;
    }
}
function readPlayerScoresFromQueryParams(qp, songDb) {
    // Query params must exist
    const rawImages = qp.get("si" /* QueryParam.SongImage */);
    const rawChartTypes = qp.get("ct" /* QueryParam.ChartType */);
    const rawDifficulties = qp.get("df" /* QueryParam.Difficulty */);
    const rawAchievements = qp.get("ac" /* QueryParam.Achievement */);
    if (!rawImages || !rawChartTypes || !rawDifficulties || !rawAchievements) {
        return [];
    }
    // Query params must have valid values
    const images = rawImages.split('_');
    const chartTypes = Array.from(rawChartTypes)
        .map((ct) => parseInt(ct))
        .filter((ct) => !isNaN(ct));
    const difficulties = Array.from(rawDifficulties)
        .map((df) => parseInt(df))
        .filter((df) => !isNaN(df));
    const achievements = rawAchievements
        .split('_')
        .map((ac) => parseFloat(ac))
        .filter((ac) => !isNaN(ac));
    if (images.length !== chartTypes.length ||
        images.length !== difficulties.length ||
        images.length !== achievements.length) {
        return [];
    }
    // All records must exist in SongDatabase
    let failed = false;
    const records = images.map((ico, i) => {
        const chartType = chartTypes[i];
        const difficulty = difficulties[i];
        const achievement = achievements[i];
        const props = songDb.getSongPropsByIco(ico, chartType);
        if (!props) {
            console.warn('Could not find song for ', ico, chartType, difficulty, achievement);
            failed = true;
            return;
        }
        const lv = props.lv[difficulty];
        return {
            songName: props.name,
            genre: props.genre,
            difficulty,
            chartType,
            level: lv,
            achievement,
        };
    });
    return failed ? [] : records;
}
