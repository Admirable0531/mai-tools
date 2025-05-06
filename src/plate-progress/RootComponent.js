"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootComponent = void 0;
const react_1 = __importDefault(require("react"));
const game_region_1 = require("../common/game-region");
const game_version_1 = require("../common/game-version");
const lang_1 = require("../common/lang");
const PlateProgress_1 = require("./PlateProgress");
const VersionSelect_1 = require("./VersionSelect");
class RootComponent extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.referrer = document.referrer && new URL(document.referrer).origin;
        this.handleSelectRegion = (evt) => {
            this.setState({ region: evt.currentTarget.value });
        };
        this.handleSelectVersion = (evt) => {
            this.setState({ version: evt.currentTarget.value });
        };
        this.initWindowCommunication = () => {
            window.addEventListener('message', (evt) => {
                if ((0, game_region_1.isMaimaiNetOrigin)(evt.origin)) {
                    this.referrer = evt.origin;
                    console.log(evt.origin, evt.data);
                    switch (evt.data.action) {
                        case 'showProgress':
                            this.setState({
                                progress: evt.data.payload,
                            });
                            break;
                        case 'setPlayerScore':
                            this.setState({
                                playerScores: evt.data.payload,
                                region: (0, game_region_1.getGameRegionFromOrigin)(evt.origin),
                            });
                            break;
                    }
                }
            });
            const { friendIdx, lang } = this.state;
            if (friendIdx) {
                // Analyze friend rating
                this.postMessageToOpener({ action: 'fetchFriendScoresFull', payload: friendIdx });
            }
            else {
                // Analyze self rating
                this.postMessageToOpener({ action: 'fetchScoresFull', payload: lang });
            }
        };
        const queryParams = new URLSearchParams(location.search);
        const friendIdx = queryParams.get("friendIdx" /* QueryParam.FriendIdx */);
        const playerName = queryParams.get("playerName" /* QueryParam.PlayerName */);
        const gameVerParam = queryParams.get("gameVersion" /* QueryParam.GameVersion */);
        const gameVer = (0, game_version_1.validateGameVersion)(gameVerParam, game_version_1.LATEST_VERSION);
        const region = (0, game_region_1.getGameRegionFromShortString)(queryParams.get("region" /* QueryParam.GameRegion */));
        const lang = (0, lang_1.getInitialLanguage)();
        updateDocumentTitle(lang);
        this.state = {
            lang,
            region,
            currentVersion: gameVer,
            version: (gameVer - 1).toString(),
            friendIdx,
            playerName,
            progress: '',
            playerScores: [],
        };
        if (window.opener) {
            this.initWindowCommunication();
        }
    }
    render() {
        const { playerName, region, version, progress, playerScores, currentVersion } = this.state;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("select", { onChange: this.handleSelectRegion, value: region },
                react_1.default.createElement("option", { value: "", disabled: true }, "== Game Region =="),
                react_1.default.createElement("option", { value: "jp" /* GameRegion.Jp */ }, "Japan"),
                react_1.default.createElement("option", { value: "intl" /* GameRegion.Intl */ }, "International")),
            react_1.default.createElement("br", null),
            react_1.default.createElement(VersionSelect_1.VersionSelect, { version: version, onChange: this.handleSelectVersion }),
            react_1.default.createElement("br", null),
            react_1.default.createElement("h2", null,
                "Player: ",
                playerName),
            progress ? react_1.default.createElement("div", null, progress) : null,
            react_1.default.createElement(PlateProgress_1.PlateProgress, { region: region, currentVersion: currentVersion, version: version, playerScores: playerScores })));
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
}
exports.RootComponent = RootComponent;
function updateDocumentTitle(lang) {
    document.title = {
        ["en-US" /* Language.en_US */]: 'maimai Plate Progress',
        ["zh-TW" /* Language.zh_TW */]: 'maimai 名牌板進度分析',
        ["ko-KR" /* Language.ko_KR */]: 'maimai Plate Progress', // TODO
    }[lang];
}
