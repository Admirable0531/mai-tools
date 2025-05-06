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
const difficulties_1 = require("../common/difficulties");
const fetch_friend_score_1 = require("../common/fetch-friend-score");
const fetch_self_score_1 = require("../common/fetch-self-score");
const game_region_1 = require("../common/game-region");
const game_version_1 = require("../common/game-version");
const lang_1 = require("../common/lang");
const level_helper_1 = require("../common/level-helper");
const net_helpers_1 = require("../common/net-helpers");
const rank_functions_1 = require("../common/rank-functions");
const score_fetch_progress_1 = require("../common/score-fetch-progress");
const song_props_1 = require("../common/song-props");
(function (d) {
    var _a;
    const LANG = (0, lang_1.getInitialLanguage)();
    const UIString = {
        ["zh-TW" /* Language.zh_TW */]: {
            achievement: '達成率',
            chartConstant: '定數',
            chartType: '譜面',
            copied: '已複製到剪貼簿',
            copy: '複製成績',
            difficulty: '難度',
            dxScore: 'DX 分數',
            exclude: '不包含',
            fetch: '下載所有成績',
            genre: '分類',
            include: '包含',
            level: '等級',
            rank: 'Rank',
            songName: '歌曲',
            version: '版本',
            allDone: '✅ 已載入全部成績到文字框，請按「複製成績」把資料複製到剪貼簿。複製後可於 Excel 或 Google 試算表內貼上。',
            pleaseFavoriteFriend: '無法讀取分數。請先將好友加入最愛',
        },
        ["en-US" /* Language.en_US */]: {
            achievement: 'Achv',
            chartConstant: 'Chart Constant',
            chartType: 'Chart',
            copied: 'Copied to clipboard',
            copy: 'Copy',
            difficulty: 'Difficulty',
            dxScore: 'DX Score',
            exclude: 'Exclude',
            fetch: 'Load all scores',
            genre: 'Genre',
            include: 'Include',
            level: 'Level',
            rank: 'Rank',
            songName: 'Song',
            version: 'Version',
            allDone: '✅ All scores are loaded into text box. Click "Copy" to copy scores to clipboard. You can paste it in Excel or Google Sheets.',
            pleaseFavoriteFriend: 'Failed to load scores. Please add friend to favorite.',
        },
        // TODO: verify Korean translation
        ["ko-KR" /* Language.ko_KR */]: {
            achievement: '정확도',
            chartConstant: '상수',
            chartType: '유형',
            copied: '클립보드에 복사되었습니다',
            copy: '복사',
            difficulty: '난이도',
            dxScore: 'DX 점수',
            exclude: '제외',
            fetch: '모든 기록 불러오기',
            genre: '장르',
            include: '포함',
            level: '레벨',
            rank: '등급',
            songName: '노래',
            version: '버전',
            allDone: '✅ 모든 기록이 로드되었습니다. "복사"를 눌러 클립보드로 복사하고 엑셀이나 구글 시트에 붙여 넣으세요.',
            pleaseFavoriteFriend: 'Failed to load scores. Please add friend to favorite.', // TODO: translation
        },
    }[LANG];
    const friendIdx = location.pathname.includes('/friend/friendDetail/')
        ? new URLSearchParams(location.search).get('idx')
        : '';
    const cache = {
        div: null,
        scores: null,
    };
    const FRIEND_SCORE_FIELD_NAME = {
        ["SongName" /* Field.SongName */]: UIString.songName,
        ["Genre" /* Field.Genre */]: UIString.genre,
        ["Version" /* Field.Version */]: UIString.version,
        ["ChartType" /* Field.ChartType */]: UIString.chartType,
        ["Difficulty" /* Field.Difficulty */]: UIString.difficulty,
        ["Level" /* Field.Level */]: UIString.level,
        ["InternalLevel" /* Field.InternalLevel */]: UIString.chartConstant,
        ["Achievement" /* Field.Achievement */]: UIString.achievement,
        ["Rank" /* Field.Rank */]: UIString.rank,
        ["FcAp" /* Field.FcAp */]: 'FC/AP',
        ["Sync" /* Field.Sync */]: 'Sync',
        ["DxStar" /* Field.DxStar */]: 'DX ✦',
    };
    // DX score is only supported for self score, as Friend VS does not show max DX score.
    const ALL_FIELD_NAME = Object.assign(Object.assign({}, FRIEND_SCORE_FIELD_NAME), { ["DxScore" /* Field.DxScore */]: UIString.dxScore, ["DxRatio" /* Field.DxRatio */]: 'DX %' });
    const FIELD_GETTER = {
        ["SongName" /* Field.SongName */]: (r) => r.songName,
        ["Genre" /* Field.Genre */]: (r) => r.genre,
        ["Version" /* Field.Version */]: (r) => (r.version < 0 ? '?' : (0, game_version_1.getVersionName)(r.version)),
        ["ChartType" /* Field.ChartType */]: (r) => (0, chart_type_1.getChartTypeName)(r.chartType),
        ["Difficulty" /* Field.Difficulty */]: (r) => (0, difficulties_1.getDifficultyName)(r.difficulty),
        ["Level" /* Field.Level */]: (r, v) => (0, level_helper_1.getOfficialLevel)(v, Math.abs(r.level)),
        ["InternalLevel" /* Field.InternalLevel */]: (r) => (r.level > 0 ? r.level.toFixed(1) : '?'),
        ["Achievement" /* Field.Achievement */]: (r) => r.achievement.toFixed(4) + '%',
        ["Rank" /* Field.Rank */]: (r) => (0, rank_functions_1.getRankByAchievement)(r.achievement).title,
        ["FcAp" /* Field.FcAp */]: (r) => r.fcap || '-',
        ["Sync" /* Field.Sync */]: (r) => r.sync || '-',
        ["DxScore" /* Field.DxScore */]: (r) => `${r.dxscore.player}/${r.dxscore.max}`,
        ["DxRatio" /* Field.DxRatio */]: (r) => (r.dxscore.ratio * 100).toFixed(1) + '%',
        ["DxStar" /* Field.DxStar */]: (r) => r.dxscore.star.toFixed(0),
    };
    // TODO: Save and load included fields set by user
    const EXCLUDED_FIELDS = friendIdx ? ["InternalLevel" /* Field.InternalLevel */] : ["DxScore" /* Field.DxScore */, "InternalLevel" /* Field.InternalLevel */];
    const INCLUDED_FIELDS = Object.keys(friendIdx ? FRIEND_SCORE_FIELD_NAME : ALL_FIELD_NAME).filter((f) => !EXCLUDED_FIELDS.includes(f));
    function createOption(field) {
        const label = d.createElement('label');
        label.className = 'f_14 d_ib p_r p_5 m_5';
        label.style.borderRadius = '4px';
        label.style.border = '1px solid #333';
        const input = d.createElement('input');
        input.name = field;
        // We use checkbox type but we don't care about checked state.
        // Whether a field is included is solely determined by which section it belongs to.
        input.type = 'checkbox';
        input.addEventListener('change', () => {
            if (label.parentElement.classList.contains('excluded')) {
                cache.div.querySelector(`.included`).append(label);
            }
            else if (label.parentElement.classList.contains('included')) {
                cache.div.querySelector(`.excluded`).append(label);
            }
        });
        label.append(input, ALL_FIELD_NAME[field]);
        return label;
    }
    function createOutputArea(container) {
        const div = d.createElement('div');
        div.id = 'outputArea';
        div.style.position = 'relative';
        div.style.marginBottom = '16px';
        cache.div = div;
        const included = d.createElement('div');
        included.className = 'included p_10 m_10';
        included.append(UIString.include);
        included.style.textAlign = 'left';
        included.style.backgroundColor = '#ffdd00';
        included.style.borderRadius = '5px';
        for (const field of INCLUDED_FIELDS) {
            included.append(createOption(field));
        }
        div.append(included);
        const excluded = d.createElement('div');
        excluded.className = 'excluded p_10 m_10';
        excluded.append(UIString.exclude);
        excluded.style.textAlign = 'left';
        excluded.style.backgroundColor = 'gray';
        excluded.style.borderRadius = '5px';
        for (const field of EXCLUDED_FIELDS) {
            excluded.append(createOption(field));
        }
        div.append(excluded);
        const fetchBtn = d.createElement('button');
        fetchBtn.className = 'm_r_5';
        fetchBtn.innerText = UIString.fetch;
        fetchBtn.addEventListener('click', handleStartDownload);
        div.append(fetchBtn);
        const copyBtn = d.createElement('button');
        copyBtn.innerText = UIString.copy;
        for (let btn of [fetchBtn, copyBtn]) {
            btn.style.backgroundColor = '#9f51dc';
            btn.style.border = '2px solid black';
            btn.style.borderRadius = '5px';
            btn.style.color = 'white';
            btn.style.fontWeight = '700';
            btn.style.padding = '8px 12px';
        }
        div.append(copyBtn);
        const tx = d.createElement('textarea');
        tx.className = 'f_12';
        tx.id = 'outputText';
        tx.style.whiteSpace = 'pre';
        div.append(tx);
        copyBtn.addEventListener('click', () => {
            tx.select();
            copyBtn.disabled = true;
            copyBtn.style.cursor = 'default';
            copyBtn.style.filter = 'grayscale(1.0)';
            document.execCommand('copy');
            copyBtn.innerText = UIString.copied;
            setTimeout(() => {
                copyBtn.disabled = false;
                copyBtn.style.cursor = '';
                copyBtn.style.filter = '';
                copyBtn.innerText = UIString.copy;
            }, 3000);
        });
        const res = document.createElement('div');
        res.className = 'fetchStatus f_16 m_t_10';
        res.style.fontWeight = '700';
        res.style.color = 'white';
        res.style.textShadow = '1px 1px 2px black';
        div.append(res);
        container.insertAdjacentElement('afterend', div);
        return tx;
    }
    function getSelectedFields() {
        const inputs = cache.div.querySelectorAll(`.included input`);
        return Array.from(inputs)
            .map((input) => (input instanceof HTMLInputElement ? input.name : null))
            .filter((field) => field != null);
    }
    function getTableHead(fields) {
        return fields.map((f) => ALL_FIELD_NAME[f]).join('\t');
    }
    function formatRecord(gameVer, r, fields) {
        return fields.map((f) => FIELD_GETTER[f](r, gameVer)).join('\t');
    }
    function handleStartDownload(evt) {
        return __awaiter(this, void 0, void 0, function* () {
            evt.preventDefault();
            const gameVer = yield (0, net_helpers_1.fetchGameVersion)(d.body);
            const gameRegion = (0, game_region_1.getGameRegionFromOrigin)(d.location.origin);
            const songDb = yield (0, song_props_1.loadSongDatabase)(gameVer, gameRegion);
            const textarea = document.getElementById('outputText');
            if (cache.scores == null) {
                textarea.value = '';
                cache.scores = [];
                try {
                    for (const difficulty of difficulties_1.DIFFICULTIES) {
                        textarea.value += (0, score_fetch_progress_1.statusText)(LANG, difficulty, false) + '\n';
                        cache.scores = cache.scores.concat(yield (friendIdx
                            ? (0, fetch_friend_score_1.fetchFriendScoresFull)(friendIdx, difficulty, songDb, true)
                            : (0, fetch_self_score_1.fetchScoresFull)(difficulty, new Map(), songDb)));
                    }
                }
                catch (err) {
                    console.warn(err);
                    textarea.value += friendIdx ? UIString.pleaseFavoriteFriend : err;
                    return;
                }
            }
            const fields = getSelectedFields();
            textarea.value =
                getTableHead(fields) +
                    '\n' +
                    cache.scores.map((record) => formatRecord(gameVer, record, fields)).join('\n');
            document.querySelector('.fetchStatus').innerText = UIString.allDone;
        });
    }
    if (!(0, game_region_1.isMaimaiNetOrigin)(d.location.origin)) {
        return;
    }
    (_a = d.getElementById('outputArea')) === null || _a === void 0 ? void 0 : _a.remove();
    createOutputArea(d.querySelector('.see_through_block'));
})(document);
