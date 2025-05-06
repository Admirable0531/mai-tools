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
const chart_type_1 = require("../common/chart-type");
const fetch_score_util_1 = require("../common/fetch-score-util");
const fetch_self_score_1 = require("../common/fetch-self-score");
const game_region_1 = require("../common/game-region");
const lang_1 = require("../common/lang");
const level_helper_1 = require("../common/level-helper");
const net_helpers_1 = require("../common/net-helpers");
const play_history_1 = require("../common/play-history");
const score_fetch_progress_1 = require("../common/score-fetch-progress");
const script_host_1 = require("../common/script-host");
const song_name_helper_1 = require("../common/song-name-helper");
const song_props_1 = require("../common/song-props");
const util_1 = require("../common/util");
(function () {
    const BASE_URL = (0, script_host_1.getScriptHost)('analyze-rating-in-newtab');
    let LANG = (0, lang_1.getInitialLanguage)();
    const UIString = {
        ["zh-TW" /* Language.zh_TW */]: {
            pleaseLogIn: '請登入 maimai NET',
            analyze: '分析 Rating',
            plateProgress: '名牌板',
        },
        ["en-US" /* Language.en_US */]: {
            pleaseLogIn: 'Please log in to maimai DX NET.',
            analyze: 'Analyze Rating',
            plateProgress: 'Plates',
        },
        ["ko-KR" /* Language.ko_KR */]: {
            pleaseLogIn: 'maimai DX NET에 로그인 해 주세요.',
            analyze: '레이팅 분석하기',
            plateProgress: 'Plates', // TODO
        },
    };
    const isOnFriendPage = location.pathname.includes('friend');
    const domCache = new Map();
    function fetchRecentPlays(songDb, visitedCharts) {
        return __awaiter(this, void 0, void 0, function* () {
            const dom = yield (0, net_helpers_1.fetchPage)(play_history_1.PLAY_HISTORY_PATH);
            // Keep only new records
            const rows = Array.from(dom.querySelectorAll('.main_wrapper .p_10.t_l.f_0.v_b')).filter((row) => (0, play_history_1.getIsNewRecord)(row));
            return rows
                .map((row) => (0, play_history_1.getChartRecordFromPlayRecordRow)(row, songDb))
                .filter((r) => {
                if (r.difficulty === 5 /* Difficulty.UTAGE */) {
                    return false;
                }
                // When multiple records of one chart exist, keep the most recent one
                const key = (0, song_name_helper_1.getSongNicknameWithChartType)(r.songName, r.genre, r.chartType) + r.difficulty;
                if (visitedCharts.has(key)) {
                    return false;
                }
                visitedCharts.add(key);
                return true;
            });
        });
    }
    function fetchRecordsFromRatingPage(songDb, visitedCharts) {
        return __awaiter(this, void 0, void 0, function* () {
            const dom = location.pathname === '/maimai-mobile/home/ratingTargetMusic/'
                ? document
                : yield (0, net_helpers_1.fetchPage)('/maimai-mobile/home/ratingTargetMusic/');
            const rows = Array.from(dom.querySelectorAll('.main_wrapper.t_c .m_15'));
            const records = [];
            for (const row of rows) {
                const idx = (0, song_name_helper_1.getSongIdx)(row);
                if (!idx) {
                    // Note: we cannot use song name to determine whether to skip this row.
                    // as there is a song whose name is empty.
                    continue;
                }
                const songName = (0, fetch_score_util_1.getSongName)(row);
                const genre = songName === 'Link' ? yield (0, song_name_helper_1.fetchSongGenre)(idx) : '';
                const difficulty = (0, fetch_score_util_1.getChartDifficulty)(row);
                const chartType = (0, chart_type_1.getChartType)(row);
                // When multiple records of one chart exist, keep the most recent one
                const key = (0, song_name_helper_1.getSongNicknameWithChartType)(songName, genre, chartType) + difficulty;
                if (visitedCharts.has(key)) {
                    continue;
                }
                const level = -(0, level_helper_1.getMinConstant)(songDb.gameVer, (0, fetch_score_util_1.getChartLevel)(row));
                const achievement = (0, fetch_score_util_1.getAchievement)(row, false);
                records.push({
                    songName,
                    genre,
                    difficulty,
                    level,
                    chartType,
                    achievement,
                });
                visitedCharts.add(key);
            }
            return records;
        });
    }
    /**
     * Load self scores and send them via the callback provided.
     * @return recent play records
     */
    function fetchSelfRecords(gameVer, send, fullRecords = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch player grade
            const playerGrade = isOnFriendPage ? null : (0, fetch_score_util_1.getPlayerGrade)(document.body);
            if (playerGrade) {
                send('playerGrade', playerGrade);
            }
            const songDb = new song_props_1.SongDatabase(gameVer, null, false);
            // Fetch recent plays
            const visitedCharts = new Set();
            send('showProgress', (0, score_fetch_progress_1.statusText)(LANG, null, false));
            const recentScoreList = yield fetchRecentPlays(songDb, visitedCharts);
            let scoreList = recentScoreList;
            try {
                scoreList = scoreList.concat(yield fetchRecordsFromRatingPage(songDb, visitedCharts));
            }
            catch (e) {
                console.warn('Failed to fetch rating page', e);
            }
            // Fetch scores by difficulty
            for (const difficulty of fetch_self_score_1.SELF_SCORE_URLS.keys()) {
                send('showProgress', (0, score_fetch_progress_1.statusText)(LANG, difficulty, false));
                const scoresByDifficulty = yield (fullRecords ? fetch_self_score_1.fetchScoresFull : fetch_self_score_1.fetchScores)(difficulty, domCache, songDb);
                scoreList = scoreList.concat(scoresByDifficulty.filter((r) => {
                    const key = (0, song_name_helper_1.getSongNicknameWithChartType)(r.songName, r.genre, r.chartType) + r.difficulty;
                    return !visitedCharts.has(key);
                }));
            }
            send('showProgress', '');
            send('setPlayerScore', scoreList);
            return recentScoreList;
        });
    }
    function insertAnalyzeButton(gameVer, playerName) {
        const region = (0, game_region_1.getGameRegionFromOrigin)(window.location.origin);
        const urlSearch = new URLSearchParams({
            ["gameVersion" /* QueryParam.GameVersion */]: gameVer.toString(),
            ["region" /* QueryParam.GameRegion */]: region,
        });
        if (playerName) {
            urlSearch.set("playerName" /* QueryParam.PlayerName */, playerName);
        }
        const profileBlock = document.body.querySelector('.basic_block.p_10.f_0');
        if (!profileBlock) {
            return;
        }
        let analyzeSpan = document.querySelector('.analyzeLinks');
        if (analyzeSpan) {
            analyzeSpan.remove();
        }
        analyzeSpan = document.createElement('span');
        analyzeSpan.className = 'analyzeLinks f_14';
        const analyzeRatingLink = document.createElement('a');
        analyzeRatingLink.style.color = '#1477e6';
        analyzeRatingLink.target = 'selfRating';
        analyzeRatingLink.append(UIString[LANG].analyze);
        analyzeRatingLink.href = BASE_URL + '/rating-calculator/?' + urlSearch;
        const analyzePlatesLink = document.createElement('a');
        analyzePlatesLink.style.color = '#1477e6';
        analyzePlatesLink.target = 'plateProgress';
        analyzePlatesLink.append(UIString[LANG].plateProgress);
        analyzePlatesLink.href = BASE_URL + '/plate-progress/?' + urlSearch;
        analyzeSpan.append(analyzeRatingLink, ' / ', analyzePlatesLink, document.createElement('br'));
        if (location.pathname.indexOf('/maimai-mobile/playerData/') >= 0) {
            analyzeSpan.className += ' f_l';
            const playCountDiv = document.querySelector('.m_5.t_r.f_12');
            playCountDiv.insertAdjacentElement('afterbegin', analyzeSpan);
        }
        else {
            // If we are at /maimai-mobile/home/, comment block should exist.
            const playCommentDiv = document.querySelector('.comment_block.f_l.f_12');
            if (playCommentDiv) {
                playCommentDiv.insertAdjacentElement('afterbegin', analyzeSpan);
            }
            else {
                profileBlock.querySelector('.name_block').parentElement.append(analyzeSpan);
            }
        }
    }
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, game_region_1.isMaimaiNetOrigin)(document.location.origin)) {
                (0, util_1.handleError)(UIString[LANG].pleaseLogIn);
                return;
            }
            const gameVer = yield (0, net_helpers_1.fetchGameVersion)(document.body);
            const playerName = isOnFriendPage ? null : (0, fetch_score_util_1.getPlayerName)(document.body);
            insertAnalyzeButton(gameVer, playerName);
            if (window.ratingCalcMsgListener) {
                window.removeEventListener('message', window.ratingCalcMsgListener);
            }
            window.ratingCalcMsgListener = (evt) => __awaiter(this, void 0, void 0, function* () {
                console.log(evt.origin, evt.data);
                if (util_1.ALLOWED_ORIGINS.includes(evt.origin)) {
                    const send = (0, util_1.getPostMessageFunc)(evt.source, evt.origin);
                    if (typeof evt.data === 'object') {
                        if (evt.data.action === 'ready') {
                            send('gameVersion', gameVer);
                            if (typeof evt.data.payload === 'string') {
                                LANG = evt.data.payload;
                            }
                            const recentRecords = yield fetchSelfRecords(gameVer, send);
                            // domCache should be populated by fetchSelfRecords
                            const allSongs = yield (0, util_1.fetchAllSongs)(domCache.get(0 /* Difficulty.BASIC */));
                            const visitedSongs = new Set();
                            allSongs.forEach((s) => visitedSongs.add((0, song_name_helper_1.getSongNicknameWithChartType)(s.name, s.genre, s.dx)));
                            for (const r of recentRecords) {
                                if (!visitedSongs.has((0, song_name_helper_1.getSongNicknameWithChartType)(r.songName, r.genre, r.chartType))) {
                                    allSongs.push({
                                        dx: r.chartType,
                                        name: r.songName,
                                        genre: r.genre,
                                    });
                                }
                            }
                            send('allSongs', allSongs);
                        }
                        else if (evt.data.action === 'fetchScoresFull') {
                            if (typeof evt.data.payload === 'string') {
                                LANG = evt.data.payload;
                            }
                            fetchSelfRecords(gameVer, send, true);
                        }
                        else if (evt.data.action === 'saveLanguage') {
                            LANG = evt.data.payload;
                            (0, lang_1.saveLanguage)(LANG);
                        }
                    }
                }
            });
            window.addEventListener('message', window.ratingCalcMsgListener);
        });
    }
    main();
})();
