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
const game_region_1 = require("../common/game-region");
const lang_1 = require("../common/lang");
const net_helpers_1 = require("../common/net-helpers");
const play_history_1 = require("../common/play-history");
const util_1 = require("../common/util");
(function (d) {
    const LANG = (0, lang_1.getInitialLanguage)();
    const UIString = {
        ["zh-TW" /* Language.zh_TW */]: {
            pleaseLogIn: '請登入 maimai DX NET',
        },
        ["en-US" /* Language.en_US */]: {
            pleaseLogIn: 'Please log in to maimai DX NET.',
        },
        ["ko-KR" /* Language.ko_KR */]: {
            pleaseLogIn: 'maimai DX NET에 로그인 해 주세요.',
        },
    }[LANG];
    if (!(0, game_region_1.isMaimaiNetOrigin)(d.location.origin)) {
        (0, util_1.handleError)(UIString.pleaseLogIn);
        return;
    }
    // Enable right click
    d.body.oncontextmenu = null;
    const path = d.location.pathname;
    if (path === play_history_1.PLAY_HISTORY_PATH) {
        Promise.resolve().then(() => __importStar(require('./recent-play-downloader')));
    }
    else if (path.startsWith('/maimai-mobile/record/playlogDetail/')) {
        Promise.resolve().then(() => __importStar(require('./score-converter')));
        Promise.resolve().then(() => __importStar(require('./play-record-helper')));
    }
    else if (path.startsWith('/maimai-mobile/record/musicDetail/')) {
        (0, net_helpers_1.removeScrollControl)(d);
        Promise.resolve().then(() => __importStar(require('./song-detail-helper')));
    }
    else if (path.startsWith('/maimai-mobile/record/music')) {
        Promise.resolve().then(() => __importStar(require('./score-sort')));
        Promise.resolve().then(() => __importStar(require('./play-last')));
    }
    else if (path.startsWith('/maimai-mobile/friend/')) {
        Promise.resolve().then(() => __importStar(require('./analyze-friend-rating-in-new-tab')));
        if (path.startsWith('/maimai-mobile/friend/friendDetail/')) {
            Promise.resolve().then(() => __importStar(require('./score-download')));
        }
        if (path.startsWith('/maimai-mobile/friend/friendGenreVs/battleStart/') ||
            path.startsWith('/maimai-mobile/friend/friendLevelVs/battleStart/')) {
            Promise.resolve().then(() => __importStar(require('./score-sort')));
        }
    }
    else if (path === '/maimai-mobile/home/' ||
        path === '/maimai-mobile/home/ratingTargetMusic/' ||
        path === '/maimai-mobile/playerData/') {
        (0, net_helpers_1.removeScrollControl)(d);
        Promise.resolve().then(() => __importStar(require('./score-download')));
        Promise.resolve().then(() => __importStar(require('./analyze-rating-in-newtab')));
    }
    else if (path.startsWith('/maimai-mobile/photo/') ||
        path.startsWith('/maimai-mobile/playerData/photo/')) {
        Promise.resolve().then(() => __importStar(require('./album-download-helper')));
    }
})(document);
