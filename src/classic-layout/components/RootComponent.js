"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootComponent = void 0;
const react_1 = __importDefault(require("react"));
const date_util_1 = require("../../common/date-util");
const difficulties_1 = require("../../common/difficulties");
const game_region_1 = require("../../common/game-region");
const parser_1 = require("../parser");
const CreditInfo_1 = require("./CreditInfo");
const PageFooter_1 = require("./PageFooter");
const PageTitle_1 = require("./PageTitle");
const ScorePageContainer_1 = require("./ScorePageContainer");
const SectionSeparator_1 = require("./SectionSeparator");
const defaultPlayRecord = {
    date: String(Date.now()),
    track: 'TRACK ' + (Math.floor(Math.random() * 3) + 1),
    // difficulty: 3,
    songTitle: '分からない',
    achievement: '95.3035%',
    highScore: Math.random() > 0.9 ? '1' : '0',
    // combo: "234/953",
    noteDetails: '654-96-31-28\n25-0-0-0\n78-0-0-1\n\n37-2-1-0',
};
function getQueryParam(qp, key, fallback) {
    const value = qp.get(key);
    if (!value) {
        console.warn('URL does not contain "' + key + '", using default value "' + fallback + '"');
        return fallback;
    }
    return value;
}
function parseQueryParams(qp, dft = defaultPlayRecord) {
    const date = getQueryParam(qp, "dt" /* QueryParam.Date */, dft.date);
    const place = getQueryParam(qp, "place" /* QueryParam.Place */, 'DX');
    const track = getQueryParam(qp, "tk" /* QueryParam.Track */, dft.track);
    const rawDifficulty = getQueryParam(qp, "df" /* QueryParam.Difficulty */);
    const songTitle = getQueryParam(qp, "st" /* QueryParam.SongTitle */, dft.songTitle);
    const achievement = getQueryParam(qp, "ac" /* QueryParam.Achievement */, dft.achievement);
    const highScore = getQueryParam(qp, "hs" /* QueryParam.HighScore */, dft.highScore);
    const combo = getQueryParam(qp, "cb" /* QueryParam.Combo */);
    const noteDetails = getQueryParam(qp, "nd" /* QueryParam.NoteDetails */, dft.noteDetails);
    const syncStatus = getQueryParam(qp, "sc" /* QueryParam.SyncStatus */);
    // TODO: handling NaN for parseInt
    const difficulty = (0, difficulties_1.getDifficultyName)(parseInt(rawDifficulty));
    return {
        date: (0, date_util_1.formatDate)(new Date(parseInt(date))),
        place,
        track,
        songTitle,
        difficulty,
        syncStatus,
        noteJudgements: (0, parser_1.parseJudgements)(noteDetails),
        combo: combo && combo.replace('/', ' / '),
        highScore: highScore === '1',
        achievement: parseFloat(achievement),
    };
}
class RootComponent extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.referrer = document.referrer && new URL(document.referrer).origin;
        this.fetchRankImage = (title) => {
            console.log('fetchRankImage ' + title);
            this.state.rankImg.set(title, null);
            this.sendMessageToOpener({ action: 'getRankImage', payload: title });
        };
        this.handleWindowMessage = (evt) => {
            if ((0, game_region_1.isMaimaiNetOrigin)(evt.origin)) {
                this.referrer = evt.origin;
                switch (evt.data.action) {
                    case 'songImage':
                        this.setState({ songImg: evt.data.imgSrc });
                        break;
                    case 'apFcImage':
                        this.setState({ apFcImg: URL.createObjectURL(evt.data.img) });
                        break;
                    case 'syncImage':
                        this.setState({ syncImg: URL.createObjectURL(evt.data.img) });
                        break;
                    case 'rankImage':
                        this.setState((state) => {
                            const existingUrl = state.rankImg.get(evt.data.title);
                            if (existingUrl) {
                                URL.revokeObjectURL(existingUrl);
                            }
                            const map = new Map(state.rankImg);
                            map.set(evt.data.title, URL.createObjectURL(evt.data.img));
                            return { rankImg: map };
                        });
                        break;
                    default:
                        console.log(evt.data);
                        break;
                }
            }
        };
        const qp = new URLSearchParams(location.search);
        try {
            this.state = Object.assign(Object.assign({}, parseQueryParams(qp)), { rankImg: new Map() });
        }
        catch (e) {
            console.error(e.message);
            console.error(e.stack);
            this.state = Object.assign(Object.assign({}, parseQueryParams(new URLSearchParams())), { rankImg: new Map(), showError: true });
        }
    }
    componentDidMount() {
        document.title = this.state.songTitle + ' - maimai classic score layout';
        window.addEventListener('message', this.handleWindowMessage);
        this.sendMessageToOpener({ action: 'ready' });
    }
    render() {
        const { achievement, combo, date, place, difficulty, highScore, noteJudgements, songTitle, track, songImg, apFcImg, rankImg, syncImg, syncStatus, showError, } = this.state;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: "widthLimit" },
                react_1.default.createElement("div", { className: "container" },
                    react_1.default.createElement(PageTitle_1.PageTitle, null),
                    react_1.default.createElement(SectionSeparator_1.SectionSep, null),
                    showError ? (react_1.default.createElement("div", { className: "error" }, "Failed to parse input. Please contact the developer!")) : (react_1.default.createElement(ScorePageContainer_1.ScorePageContainer, { achievement: achievement, combo: combo, date: date, place: place, difficulty: difficulty, highScore: highScore, noteJudgements: noteJudgements, songTitle: songTitle, track: track, syncStatus: syncStatus, songImgSrc: songImg, apFcImg: apFcImg, rankImg: rankImg, syncImg: syncImg, fetchRankImage: this.fetchRankImage })),
                    react_1.default.createElement(SectionSeparator_1.SectionSep, null),
                    react_1.default.createElement(PageFooter_1.PageFooter, null))),
            react_1.default.createElement(CreditInfo_1.CreditInfo, null)));
    }
    sendMessageToOpener(data) {
        if (window.opener) {
            console.log('sending message to opener', data);
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
}
exports.RootComponent = RootComponent;
