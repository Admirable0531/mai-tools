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
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_friend_score_1 = require("../common/fetch-friend-score");
const fetch_score_util_1 = require("../common/fetch-score-util");
const game_region_1 = require("../common/game-region");
const lang_1 = require("../common/lang");
const net_helpers_1 = require("../common/net-helpers");
const score_fetch_progress_1 = require("../common/score-fetch-progress");
const script_host_1 = require("../common/script-host");
const song_props_1 = require("../common/song-props");
const util_1 = require("../common/util");
(function (d) {
    const BASE_URL = (0, script_host_1.getScriptHost)('analyze-friend-rating-in-new-tab');
    let LANG = (0, lang_1.getInitialLanguage)();
    const UIString = {
        ["zh-TW" /* Language.zh_TW */]: {
            pleaseLogIn: '請登入 maimai NET',
            analyze: '分析 Rating',
            plateProgress: '名牌板',
            pleaseFavoriteFriend: '無法讀取分數。請先將好友加入最愛',
        },
        ["en-US" /* Language.en_US */]: {
            pleaseLogIn: 'Please log in to maimai DX NET.',
            analyze: 'Analyze Rating',
            plateProgress: 'Plates',
            pleaseFavoriteFriend: 'Failed to load scores. Please add friend to favorite.',
        },
        ["ko-KR" /* Language.ko_KR */]: {
            pleaseLogIn: 'maimai DX NET에 로그인 해 주세요.',
            analyze: '레이팅 분석하기',
            plateProgress: 'Plates',
            pleaseFavoriteFriend: 'Failed to load scores. Please add friend to favorite.', // TODO: translation
        },
    };
    const friends_cache = {};
    function getFriendIdx(n) {
        return n.querySelector('[name=idx]').value;
    }
    function insertAnalyzeButton(gameVer, friend, container) {
        const region = (0, game_region_1.getGameRegionFromOrigin)(window.location.origin);
        const queryParams = new URLSearchParams({
            ["region" /* QueryParam.GameRegion */]: region,
            ["gameVersion" /* QueryParam.GameVersion */]: gameVer.toString(),
            ["friendIdx" /* QueryParam.FriendIdx */]: friend.idx,
            ["playerName" /* QueryParam.PlayerName */]: friend.name,
        });
        let analyzeSpan = (friend.page === 2 /* FriendPage.FRIEND_VS */ ? document : container).querySelector('.analyzeSpan');
        if (analyzeSpan) {
            analyzeSpan.remove();
        }
        analyzeSpan = document.createElement('span');
        analyzeSpan.className = 'analyzeSpan';
        const analyzeRatingLink = d.createElement('a');
        analyzeRatingLink.className = 'f_14';
        analyzeRatingLink.style.color = '#1477e6';
        analyzeRatingLink.target = 'friendRating';
        analyzeRatingLink.innerText = UIString[LANG].analyze;
        analyzeRatingLink.href = BASE_URL + '/rating-calculator/?' + queryParams;
        const analyzePlatesLink = document.createElement('a');
        analyzePlatesLink.className = 'f_14';
        analyzePlatesLink.style.color = '#1477e6';
        analyzePlatesLink.target = 'plateProgress';
        analyzePlatesLink.append(UIString[LANG].plateProgress);
        analyzePlatesLink.href = BASE_URL + '/plate-progress/?' + queryParams;
        analyzeSpan.append(analyzeRatingLink, ' / ', analyzePlatesLink);
        if (friend.page === 2 /* FriendPage.FRIEND_VS */) {
            analyzeSpan.className += ' d_ib friend_comment_block f_r';
            analyzeSpan.style.transform = 'translate(-25px, -20px)';
            container.parentElement.insertAdjacentElement('afterend', analyzeSpan);
        }
        else {
            analyzeSpan.className += ' d_b';
            container
                .querySelector(friend.page === 0 /* FriendPage.FRIEND_LIST */ ? '.friend_comment_block' : '.comment_block')
                .insertAdjacentElement('afterbegin', analyzeSpan);
        }
    }
    function fetchFriendRecords(gameVer, friend, full, send) {
        return __awaiter(this, void 0, void 0, function* () {
            // Send player grade
            if (friend.grade) {
                send('playerGrade', friend.grade);
            }
            // Fetch all scores
            try {
                let scoreList = [];
                for (const difficulty of fetch_friend_score_1.FRIEND_SCORE_URLS.keys()) {
                    send('showProgress', (0, score_fetch_progress_1.statusText)(LANG, difficulty, false));
                    scoreList = scoreList.concat(yield (full ? fetch_friend_score_1.fetchFriendScoresFull : fetch_friend_score_1.fetchFriendScores)(friend.idx, difficulty, new song_props_1.SongDatabase(gameVer, null, false)));
                }
                send('showProgress', '');
                send('setPlayerScore', scoreList);
            }
            catch (err) {
                console.warn(err);
                (0, util_1.handleError)(UIString[LANG].pleaseFavoriteFriend);
            }
        });
    }
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, game_region_1.isMaimaiNetOrigin)(document.location.origin)) {
                (0, util_1.handleError)(UIString[LANG].pleaseLogIn);
                return;
            }
            const gameVer = yield (0, net_helpers_1.fetchGameVersion)(document.body);
            if (location.pathname.includes('/friendLevelVs/') ||
                location.pathname.includes('/friendGenreVs/')) {
                const elem = document.querySelector('.friend_vs_friend_block');
                const idx = new URLSearchParams(location.search).get('idx');
                const info = { idx, name: (0, fetch_score_util_1.getPlayerName)(elem), grade: '', page: 2 /* FriendPage.FRIEND_VS */ };
                friends_cache[idx] = info;
                insertAnalyzeButton(gameVer, info, elem);
            }
            else if (location.pathname.includes('/friend/friendDetail/')) {
                const elem = document.querySelector('.see_through_block');
                const idx = new URLSearchParams(location.search).get('idx');
                const info = {
                    idx,
                    name: (0, fetch_score_util_1.getPlayerName)(elem),
                    grade: (0, fetch_score_util_1.getPlayerGrade)(elem),
                    page: 1 /* FriendPage.FRIEND_DETAIL */,
                };
                friends_cache[idx] = info;
                insertAnalyzeButton(gameVer, info, elem);
            }
            else {
                const list = Array.from(d.querySelectorAll('img.friend_favorite_icon')).map((n) => n.parentElement);
                list.forEach((elem) => {
                    const idx = getFriendIdx(elem);
                    const info = {
                        idx,
                        name: (0, fetch_score_util_1.getPlayerName)(elem),
                        grade: (0, fetch_score_util_1.getPlayerGrade)(elem),
                        page: 0 /* FriendPage.FRIEND_LIST */,
                    };
                    friends_cache[idx] = info;
                    insertAnalyzeButton(gameVer, info, elem);
                });
            }
            if (window.ratingCalcMsgListener) {
                window.removeEventListener('message', window.ratingCalcMsgListener);
            }
            window.ratingCalcMsgListener = (evt) => {
                console.log(evt.origin, evt.data);
                if (util_1.ALLOWED_ORIGINS.includes(evt.origin)) {
                    const send = (0, util_1.getPostMessageFunc)(evt.source, evt.origin);
                    if (typeof evt.data !== 'object') {
                        return;
                    }
                    if (evt.data.action === 'getFriendRecords') {
                        send('gameVersion', gameVer);
                        const friend = friends_cache[evt.data.payload];
                        if (friend) {
                            fetchFriendRecords(gameVer, friend, false, send);
                            (0, util_1.fetchAllSongs)().then((songs) => {
                                send('allSongs', songs);
                            });
                        }
                    }
                    else if (evt.data.action === 'fetchFriendScoresFull') {
                        const friend = friends_cache[evt.data.payload];
                        if (friend) {
                            fetchFriendRecords(gameVer, friend, true, send);
                        }
                    }
                    else if (evt.data.action === 'saveLanguage') {
                        LANG = evt.data.payload;
                        (0, lang_1.saveLanguage)(LANG);
                    }
                }
            };
            window.addEventListener('message', window.ratingCalcMsgListener);
        });
    }
    main();
})(document);
