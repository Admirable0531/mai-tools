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
exports.fetchScoresFull = exports.fetchScores = exports.getMyDxScoreInfo = exports.SELF_SCORE_URLS = void 0;
const chart_type_1 = require("./chart-type");
const dx_star_1 = require("./dx-star");
const fetch_score_util_1 = require("./fetch-score-util");
const level_helper_1 = require("./level-helper");
const net_helpers_1 = require("./net-helpers");
exports.SELF_SCORE_URLS = new Map([
    [4 /* Difficulty.ReMASTER */, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=4'],
    [3 /* Difficulty.MASTER */, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=3'],
    [2 /* Difficulty.EXPERT */, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=2'],
    [1 /* Difficulty.ADVANCED */, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=1'],
    [0 /* Difficulty.BASIC */, '/maimai-mobile/record/musicGenre/search/?genre=99&diff=0'],
]);
function getMyDxScoreInfo(row) {
    const scoreBlocks = row.querySelectorAll('.music_score_block');
    if (scoreBlocks.length !== 2) {
        return null;
    }
    const dxScoreNodes = scoreBlocks[1].childNodes;
    const textNode = dxScoreNodes[dxScoreNodes.length - 1];
    const scoreSegments = textNode instanceof Text
        ? textNode.wholeText.split('/').map((segment) => segment.replace(',', '').trim())
        : [];
    if (scoreSegments.length !== 2) {
        return null;
    }
    try {
        const playerScore = parseInt(scoreSegments[0]);
        const maxScore = parseInt(scoreSegments[1]);
        if (isNaN(playerScore) || isNaN(maxScore)) {
            throw new Error(`failed to parse DX score. Input was ${JSON.stringify(scoreSegments)}`);
        }
        const ratio = playerScore / maxScore;
        const star = (0, dx_star_1.determineDxStar)(ratio);
        return { max: maxScore, player: playerScore, ratio, star };
    }
    catch (err) {
        console.warn(err);
    }
    return { max: 0, player: 0, ratio: 0, star: 0 };
}
exports.getMyDxScoreInfo = getMyDxScoreInfo;
function processRow(row, difficulty, songDb, state) {
    const isGenreRow = row.classList.contains('screw_block');
    const isScoreRow = row.classList.contains('w_450') &&
        row.classList.contains('m_15') &&
        row.classList.contains('p_r') &&
        row.classList.contains('f_0');
    if (isGenreRow) {
        state.genre = row.innerText;
        return null;
    }
    else if (isScoreRow) {
        const achievement = (0, fetch_score_util_1.getAchievement)(row);
        if (!achievement) {
            return null;
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
            level,
            chartType,
            achievement,
        };
    }
}
function fetchScores(difficulty, domCache, songDb) {
    return __awaiter(this, void 0, void 0, function* () {
        let dom = domCache.get(difficulty);
        if (!dom) {
            const url = exports.SELF_SCORE_URLS.get(difficulty);
            if (!url) {
                return [];
            }
            try {
                dom = yield (0, net_helpers_1.fetchPage)(url);
            }
            catch (e) {
                console.warn(`Failed to load score page for difficulty ${difficulty}`, e);
                return [];
            }
            domCache.set(difficulty, dom);
        }
        const rows = Array.from(dom.querySelectorAll('.main_wrapper.t_c .m_15'));
        const state = { genre: '' };
        const records = [];
        for (const row of rows) {
            const record = processRow(row, difficulty, songDb, state);
            if (record != null) {
                records.push(record);
            }
        }
        return records;
    });
}
exports.fetchScores = fetchScores;
function processRowFull(row, difficulty, songDb, state) {
    const baseRecord = processRow(row, difficulty, songDb, state);
    if (baseRecord == null) {
        return null;
    }
    const props = songDb.getSongProperties(baseRecord.songName, state.genre, baseRecord.chartType);
    return Object.assign(Object.assign({}, baseRecord), { fcap: (0, fetch_score_util_1.getApFcStatus)(row), sync: (0, fetch_score_util_1.getSyncStatus)(row), dxscore: getMyDxScoreInfo(row), version: props ? props.debut : -1 });
}
/** Similar to fetchScores, but return more fields per each record. */
function fetchScoresFull(difficulty, domCache, songDb) {
    return __awaiter(this, void 0, void 0, function* () {
        let dom = domCache.get(difficulty);
        if (!dom) {
            const url = exports.SELF_SCORE_URLS.get(difficulty);
            if (!url) {
                return;
            }
            dom = yield (0, net_helpers_1.fetchPage)(url);
            domCache.set(difficulty, dom);
        }
        const rows = Array.from(dom.querySelectorAll('.main_wrapper.t_c .m_15'));
        const state = { genre: '' };
        const records = [];
        for (const row of rows) {
            const record = processRowFull(row, difficulty, songDb, state);
            if (record != null) {
                records.push(record);
            }
        }
        return records;
    });
}
exports.fetchScoresFull = fetchScoresFull;
