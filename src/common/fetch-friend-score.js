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
exports.fetchFriendScoresFull = exports.fetchFriendScores = exports.FRIEND_SCORE_URLS = void 0;
const chart_type_1 = require("./chart-type");
const fetch_score_util_1 = require("./fetch-score-util");
const level_helper_1 = require("./level-helper");
const net_helpers_1 = require("./net-helpers");
const song_name_helper_1 = require("./song-name-helper");
const util_1 = require("./util");
exports.FRIEND_SCORE_URLS = new Map([
    [
        4 /* Difficulty.ReMASTER */,
        '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=4&idx=',
    ],
    [
        3 /* Difficulty.MASTER */,
        '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=3&idx=',
    ],
    [
        2 /* Difficulty.EXPERT */,
        '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=2&idx=',
    ],
    [
        1 /* Difficulty.ADVANCED */,
        '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=1&idx=',
    ],
    [
        0 /* Difficulty.BASIC */,
        '/maimai-mobile/friend/friendGenreVs/battleStart/?scoreType=2&genre=99&diff=0&idx=',
    ],
]);
function getAchievement(row) {
    const ach = row.querySelector('td.w_120.f_b:last-child');
    const achText = ach && ach.innerText.trim();
    return achText !== '0' && achText !== '― %' ? achText : null;
}
function processRow(row, difficulty, songDb, state) {
    const isGenreRow = row.classList.contains('screw_block');
    const isScoreRow = row.classList.contains('w_450') &&
        row.classList.contains('m_15') &&
        row.classList.contains('p_3') &&
        row.classList.contains('f_0');
    if (isGenreRow) {
        state.genre = row.innerText;
        return;
    }
    else if (isScoreRow) {
        const achievement = getAchievement(row);
        if (!achievement) {
            return;
        }
        const songName = (0, fetch_score_util_1.getSongName)(row);
        const chartType = (0, chart_type_1.getChartType)(row);
        const props = songDb.getSongProperties(songName, state.genre, chartType);
        let level = props ? props.lv[difficulty] : 0;
        if (!level) {
            level = -(0, level_helper_1.getMinConstant)(songDb.gameVer, (0, fetch_score_util_1.getChartLevel)(row));
        }
        return {
            songName,
            genre: state.genre,
            difficulty,
            chartType,
            level,
            achievement: parseFloat(achievement),
        };
    }
}
function processDxScoreRow(row, difficulty, state) {
    const isGenreRow = row.classList.contains('screw_block');
    const isScoreRow = row.classList.contains('w_450') &&
        row.classList.contains('m_15') &&
        row.classList.contains('p_3') &&
        row.classList.contains('f_0');
    if (isGenreRow) {
        state.genre = row.innerText;
        return;
    }
    else if (isScoreRow) {
        const achievement = getAchievement(row);
        if (!achievement) {
            return;
        }
        const songName = (0, fetch_score_util_1.getSongName)(row);
        const chartType = (0, chart_type_1.getChartType)(row);
        const dxStar = (0, fetch_score_util_1.getFriendDxStar)(row);
        return {
            songName,
            genre: state.genre,
            difficulty,
            chartType,
            dxscore: { max: 0, player: 0, ratio: 0, star: dxStar }, // TODO: player dx score
        };
    }
}
function processRowFull(row, difficulty, songDb, state) {
    const baseRecord = processRow(row, difficulty, songDb, state);
    if (baseRecord == null) {
        return null;
    }
    const props = songDb.getSongProperties(baseRecord.songName, state.genre, baseRecord.chartType);
    return Object.assign(Object.assign({}, baseRecord), { fcap: (0, fetch_score_util_1.getApFcStatus)(row, true), sync: (0, fetch_score_util_1.getSyncStatus)(row, true), version: props ? props.debut : -1, 
        // NOTE: dxscore has to be provided by processDxScoreRow.
        dxscore: { max: 0, player: 0, ratio: 0, star: 0 } });
}
function fetchFriendScoresPage(friendIdx, difficulty, dxScore = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = exports.FRIEND_SCORE_URLS.get(difficulty);
        if (!url) {
            return;
        }
        if (dxScore) {
            // avoid sending too many requests in short period of time
            yield (0, util_1.sleep)(300);
            url = url.replace('scoreType=2', 'scoreType=1');
        }
        url += friendIdx;
        return (0, net_helpers_1.fetchPage)(url);
    });
}
function fetchFriendScores(friendIdx, difficulty, songDb) {
    return __awaiter(this, void 0, void 0, function* () {
        const dom = yield fetchFriendScoresPage(friendIdx, difficulty);
        const rows = dom.querySelectorAll('.main_wrapper.t_c .m_15');
        const state = { genre: '' };
        const recordsWithNull = Array.from(rows).map((row) => processRow(row, difficulty, songDb, state));
        return recordsWithNull.filter((record) => record != null);
    });
}
exports.fetchFriendScores = fetchFriendScores;
function addDxStarInfoToRecords(recordsWithNull, dxScoreRecordsWithNull) {
    recordsWithNull.forEach((r, i) => {
        const dxScoreRecord = dxScoreRecordsWithNull[i];
        if (!r || !dxScoreRecord) {
            return;
        }
        if (r.songName !== dxScoreRecord.songName ||
            r.difficulty !== dxScoreRecord.difficulty ||
            r.genre !== dxScoreRecord.genre ||
            r.chartType !== dxScoreRecord.chartType) {
            const nickname1 = (0, song_name_helper_1.getSongNicknameWithChartType)(r.songName, r.genre, r.chartType);
            const nickname2 = (0, song_name_helper_1.getSongNicknameWithChartType)(dxScoreRecord.songName, dxScoreRecord.genre, dxScoreRecord.chartType);
            console.warn(`Achievement VS song order is different from DX Score VS song order. Expected ${nickname1} got ${nickname2}`);
            return;
        }
        r.dxscore.star = dxScoreRecord.dxscore.star;
    });
}
/**
 * @param withDxStar if true, fetch dx star for each record.
 * @returns list of chart records for the given difficulty.
 */
function fetchFriendScoresFull(friendIdx, difficulty, songDb, withDxStar = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const achvVsDom = yield fetchFriendScoresPage(friendIdx, difficulty);
        const rows = achvVsDom.querySelectorAll('.main_wrapper.t_c .m_15');
        const state = { genre: '' };
        const recordsWithNull = Array.from(rows).map((row) => processRowFull(row, difficulty, songDb, state));
        if (withDxStar) {
            const dxScoreVsDom = yield fetchFriendScoresPage(friendIdx, difficulty, true);
            const dxScoreRows = dxScoreVsDom.querySelectorAll('.main_wrapper.t_c .m_15');
            const dxScoreRecordsWithNull = Array.from(dxScoreRows).map((row) => processDxScoreRow(row, difficulty, state));
            addDxStarInfoToRecords(recordsWithNull, dxScoreRecordsWithNull);
        }
        return recordsWithNull.filter((record) => record != null);
    });
}
exports.fetchFriendScoresFull = fetchFriendScoresFull;
