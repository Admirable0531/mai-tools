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
const fetch_score_util_1 = require("../common/fetch-score-util");
const fetch_self_score_1 = require("../common/fetch-self-score");
const game_region_1 = require("../common/game-region");
const lang_1 = require("../common/lang");
const level_helper_1 = require("../common/level-helper");
const net_helpers_1 = require("../common/net-helpers");
const song_name_helper_1 = require("../common/song-name-helper");
const song_props_1 = require("../common/song-props");
(function (d) {
    const LANG = (0, lang_1.getInitialLanguage)();
    const SortLabels = {
        ["en-US" /* Language.en_US */]: {
            ["None" /* SortBy.None */]: '-- Choose Sort Option --',
            ["RankAsc" /* SortBy.RankAsc */]: 'Rank (low \u2192 high)',
            ["RankDes" /* SortBy.RankDes */]: 'Rank (high \u2192 low)',
            ["ApFcAsc" /* SortBy.ApFcAsc */]: 'AP/FC (FC \u2192 AP+)',
            ["ApFcDes" /* SortBy.ApFcDes */]: 'AP/FC (AP+ \u2192 FC)',
            ["SyncAsc" /* SortBy.SyncAsc */]: 'Sync (SYNC PLAY \u2192 FSD+)',
            ["SyncDes" /* SortBy.SyncDes */]: 'Sync (FSD+ \u2192 SYNC PLAY)',
            ["VsResultAsc" /* SortBy.VsResultAsc */]: 'VS Result (Lose \u2192 Win)',
            ["VsResultDes" /* SortBy.VsResultDes */]: 'VS Result (Win \u2192 Lose)',
            ["LvAsc" /* SortBy.LvAsc */]: 'Level (low \u2192 high)',
            ["LvDes" /* SortBy.LvDes */]: 'Level (high \u2192 low)',
            ["InLvAsc" /* SortBy.InLvAsc */]: 'Internal Level (low \u2192 high)',
            ["InLvDes" /* SortBy.InLvDes */]: 'Internal Level (high \u2192 low)',
            ["DxStarDes" /* SortBy.DxStarDes */]: 'DX-Star (7 \u2192 none)',
            ["DxStarAsc" /* SortBy.DxStarAsc */]: 'DX-Star (none \u2192 7)',
            ["PlayCountAsc" /* SortBy.PlayCountAsc */]: 'Play Count (low \u2192 high)',
            ["PlayCountDes" /* SortBy.PlayCountDes */]: 'Play Count (high \u2192 low)',
            ["LastPlayedAsc" /* SortBy.LastPlayedAsc */]: 'Last Played (old \u2192 new)',
            ["LastPlayedDes" /* SortBy.LastPlayedDes */]: 'Last Played (new \u2192 old)',
        },
        ["zh-TW" /* Language.zh_TW */]: {
            ["None" /* SortBy.None */]: '-- 選擇排序方式 --',
            ["RankAsc" /* SortBy.RankAsc */]: '達成率 (由低至高)',
            ["RankDes" /* SortBy.RankDes */]: '達成率 (由高至低)',
            ["ApFcAsc" /* SortBy.ApFcAsc */]: 'AP/FC (由 FC 到 AP+)',
            ["ApFcDes" /* SortBy.ApFcDes */]: 'AP/FC (由 AP+ 到 FC)',
            ["SyncAsc" /* SortBy.SyncAsc */]: 'Sync (由 SYNC PLAY 到 FSD+)',
            ["SyncDes" /* SortBy.SyncDes */]: 'Sync (由 FSD+ 到 SYNC PLAY)',
            ["VsResultAsc" /* SortBy.VsResultAsc */]: '對戰結果 (由敗北到勝利)',
            ["VsResultDes" /* SortBy.VsResultDes */]: '對戰結果 (由勝利到敗北)',
            ["LvAsc" /* SortBy.LvAsc */]: '譜面等級 (由低至高)',
            ["LvDes" /* SortBy.LvDes */]: '譜面等級 (由高至低)',
            ["InLvAsc" /* SortBy.InLvAsc */]: '內部譜面等級 (由低至高)',
            ["InLvDes" /* SortBy.InLvDes */]: '內部譜面等級 (由高至低)',
            ["DxStarDes" /* SortBy.DxStarDes */]: 'DX-Star (7 星至無星)',
            ["DxStarAsc" /* SortBy.DxStarAsc */]: 'DX-Star (無星至 7 星)',
            ["PlayCountAsc" /* SortBy.PlayCountAsc */]: 'Play Count (由低至高)',
            ["PlayCountDes" /* SortBy.PlayCountDes */]: 'Play Count (由高至低)',
            ["LastPlayedAsc" /* SortBy.LastPlayedAsc */]: 'Last Played (由低至高)',
            ["LastPlayedDes" /* SortBy.LastPlayedDes */]: 'Last Played (由高至低)',
        },
        ["ko-KR" /* Language.ko_KR */]: {
            ["None" /* SortBy.None */]: '-- 정렬 순서를 선택해주세요 --',
            ["RankAsc" /* SortBy.RankAsc */]: '정확도 오름차순 (낮음 \u2192 높음)',
            ["RankDes" /* SortBy.RankDes */]: '정확도 내림차순 (높음 \u2192 낮음)',
            ["ApFcAsc" /* SortBy.ApFcAsc */]: 'AP/FC 오름차순 (FC \u2192 AP+)',
            ["ApFcDes" /* SortBy.ApFcDes */]: 'AP/FC 내림차순 (AP+ \u2192 FC)',
            ["SyncAsc" /* SortBy.SyncAsc */]: 'Sync 오름차순 (SYNC PLAY \u2192 FSD+)',
            ["SyncDes" /* SortBy.SyncDes */]: 'Sync 내림차순 (FSD+ \u2192 SYNC PLAY)',
            ["VsResultAsc" /* SortBy.VsResultAsc */]: 'VS 결과 오름차순 (Lose \u2192 Win)',
            ["VsResultDes" /* SortBy.VsResultDes */]: 'VS 결과 내림차순 (Win \u2192 Lose)',
            ["LvAsc" /* SortBy.LvAsc */]: '난이도 오름차순 (낮음 \u2192 높음)',
            ["LvDes" /* SortBy.LvDes */]: '난이도 내림차순 (높음 \u2192 낮음)',
            ["InLvAsc" /* SortBy.InLvAsc */]: '난이도 상수 오름차순 (낮음 \u2192 높음)',
            ["InLvDes" /* SortBy.InLvDes */]: '난이도 상수 내림차순 (높음 \u2192 낮음)',
            ["DxStarDes" /* SortBy.DxStarDes */]: 'DX-Star 내림차순 (7 \u2192 none)',
            ["DxStarAsc" /* SortBy.DxStarAsc */]: 'DX-Star 오름차순 (none \u2192 7)',
            ["PlayCountAsc" /* SortBy.PlayCountAsc */]: 'Play Count (낮음 \u2192 높음)',
            ["PlayCountDes" /* SortBy.PlayCountDes */]: 'Play Count (높음 \u2192 낮음)',
            ["LastPlayedAsc" /* SortBy.LastPlayedAsc */]: 'Last Played (낮음 \u2192 높음)',
            ["LastPlayedDes" /* SortBy.LastPlayedDes */]: 'Last Played (높음 \u2192 낮음)',
        },
    }[LANG];
    const CHART_LEVELS = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '7+',
        '8',
        '8+',
        '9',
        '9+',
        '10',
        '10+',
        '11',
        '11+',
        '12',
        '12+',
        '13',
        '13+',
        '14',
        '14+',
        '15',
    ];
    const RANK_TITLES = [
        'SSS+',
        'SSS',
        'SS+',
        'SS',
        'S+',
        'S',
        'AAA',
        'AA',
        'A',
        'BBB',
        'BB',
        'B',
        'C',
        'D',
        null,
    ];
    const AP_FC_TYPES = ['AP+', 'AP', 'FC+', 'FC', null];
    const SYNC_TYPES = ['FSD+', 'FSD', 'FS+', 'FS', 'SYNC', null];
    const VS_RESULTS = ['WIN', 'DRAW', 'LOSE'];
    const DX_STARS = [
        null,
        '✦ - 85%',
        '✦✦ - 90%',
        '✦✦✦ - 93%',
        '✦✦✦✦ - 95%',
        '✦✦✦✦✦ - 97%',
        '✦6 - 99%',
        '✦7 - 100%',
    ];
    const isFriendScore = location.pathname.includes('battleStart');
    const isDxScoreVs = location.search.includes('scoreType=1');
    const isUtage = location.search.includes('diff=10');
    const cache = {};
    function addOfficialLvDataset() {
        Array.from(d.getElementsByClassName('music_lv_block')).forEach((n) => {
            if (!n.dataset['lv'])
                n.dataset['lv'] = n.innerText;
        });
    }
    function getInLvSecTitle(gameVer, lv) {
        const isPrecise = lv > 0;
        if (isPrecise) {
            return 'INTERNAL LEVEL ' + lv.toFixed(1);
        }
        return 'UNKNOWN LEVEL ' + (0, level_helper_1.getOfficialLevel)(gameVer, Math.abs(lv));
    }
    function createMap(sections, reverse) {
        const map = new Map();
        if (reverse) {
            sections.reverse();
        }
        for (const sec of sections) {
            map.set(sec, []);
        }
        if (reverse) {
            sections.reverse();
        }
        return map;
    }
    function getSectionTitle(style, section, size, totalSize) {
        let title = style === 3 /* SectionHeadStyle.DxStar */ ? '' : '《';
        switch (style) {
            case 1 /* SectionHeadStyle.Level */:
                title += 'LEVEL ' + section;
                break;
            case 2 /* SectionHeadStyle.Rank */:
                title += section ? 'RANK ' + section : 'NO RANK';
                break;
            default:
                title += section || ' ― ';
                break;
        }
        if (style !== 3 /* SectionHeadStyle.DxStar */) {
            title += '》';
        }
        return title + '\u3000\u3000\u3000' + size + '/' + totalSize;
    }
    function createRowsWithSection(map, headingStyle, totalSize) {
        let rows = [];
        map.forEach((subRows, section) => {
            if (subRows.length) {
                const sectionHeading = d.createElement('div');
                sectionHeading.className = 'screw_block m_15 f_15 p_s';
                sectionHeading.innerText = getSectionTitle(headingStyle, section, subRows.length, totalSize);
                rows.push(sectionHeading);
                rows = rows.concat(subRows);
            }
        });
        return rows;
    }
    function getChartLvElem(row) {
        return row.getElementsByClassName('music_lv_block')[0];
    }
    function getChartLv(row, key = 'lv') {
        var _a;
        return (_a = getChartLvElem(row)) === null || _a === void 0 ? void 0 : _a.dataset[key];
    }
    function saveInLv(row, lv) {
        const elem = getChartLvElem(row);
        if (!elem.dataset['inlv']) {
            elem.dataset['inlv'] = lv.toFixed(1);
            const t = (0, level_helper_1.getDisplayLv)(lv, isUtage);
            if (t.length > 4) {
                elem.classList.remove('f_14');
                elem.classList.add('f_13');
            }
            elem.innerText = t;
        }
    }
    function coalesceInLv(gameVer, row, lvIndex, props) {
        const lv = props ? props.lv[lvIndex] : 0;
        return lv || -(0, level_helper_1.getMinConstant)(gameVer, getChartLv(row));
    }
    function getChartInLv(row, songDb) {
        const inLvText = getChartLv(row, 'inlv');
        if (inLvText) {
            return parseFloat(inLvText);
        }
        const name = (0, fetch_score_util_1.getSongName)(row);
        const t = (0, chart_type_1.getChartType)(row);
        const lvIndex = difficulties_1.DIFFICULTIES.indexOf((0, fetch_score_util_1.getChartDifficulty)(row));
        let props;
        if (name !== 'Link') {
            props = songDb.getSongProperties(name, '', t);
        }
        else if (!isFriendScore) {
            const idx = (0, song_name_helper_1.getSongIdx)(row);
            const genre = (0, song_name_helper_1.getCachedSongGenre)(idx);
            if (genre) {
                props = songDb.getSongProperties(name, genre, t);
            }
            console.log(props);
        }
        return coalesceInLv(songDb.gameVer, row, lvIndex, props);
    }
    function compareInLv(row1, row2) {
        const lv1 = getChartInLv(row1, cache.songDb);
        const lv2 = getChartInLv(row2, cache.songDb);
        return (0, level_helper_1.compareLevels)(lv1, lv2);
    }
    function sortRowsByLevel(rows, reverse) {
        const map = createMap(CHART_LEVELS, reverse);
        rows.forEach((row) => {
            const lv = getChartLv(row);
            map.get(lv).push(row);
        });
        if (cache.songDb) {
            map.forEach((subRows) => {
                subRows.sort(compareInLv);
                if (reverse) {
                    subRows.reverse();
                }
            });
        }
        return createRowsWithSection(map, 1 /* SectionHeadStyle.Level */, rows.length);
    }
    function getRankTitle(row) {
        const rankImg = isFriendScore
            ? row.querySelector('tr:last-child td:last-child img:last-child')
            : row.children[0].querySelector('img.f_r:not(.music_kind_icon):last-of-type');
        if (!rankImg) {
            return null;
        }
        const rankImgPath = new URL(rankImg.src).pathname;
        const lowercaseRank = rankImgPath.substring(rankImgPath.lastIndexOf('_') + 1, rankImgPath.lastIndexOf('.'));
        if (lowercaseRank === 'back') {
            return null;
        }
        return lowercaseRank.replace('p', '+').toUpperCase();
    }
    function compareAchievement(row1, row2) {
        const ach1 = (0, fetch_score_util_1.getAchievement)(row1, isFriendScore), ach2 = (0, fetch_score_util_1.getAchievement)(row2, isFriendScore);
        if (ach1 === null && ach2 === null) {
            return 0;
        }
        else if (ach2 === null) {
            return -1;
        }
        else if (ach1 === null) {
            return 1;
        }
        return ach1 > ach2 ? -1 : ach1 < ach2 ? 1 : 0;
    }
    function sortRowsByRank(rows, reverse) {
        const map = createMap(RANK_TITLES, reverse);
        rows.forEach((row) => {
            const rank = getRankTitle(row);
            try {
                map.get(rank).push(row);
            }
            catch (e) {
                console.warn(rank);
                map.get(null).push(row);
            }
        });
        if (!isDxScoreVs) {
            map.forEach((subRows, key) => {
                subRows.sort(compareAchievement);
                if (key !== null && reverse) {
                    subRows.reverse();
                }
            });
        }
        return createRowsWithSection(map, 2 /* SectionHeadStyle.Rank */, rows.length);
    }
    function sortRowsByApFc(rows, reverse) {
        const map = createMap(AP_FC_TYPES, reverse);
        rows.forEach((row) => {
            const status = (0, fetch_score_util_1.getApFcStatus)(row, isFriendScore);
            map.get(status).push(row);
        });
        return createRowsWithSection(map, 0 /* SectionHeadStyle.Default */, rows.length);
    }
    function sortRowsBySync(rows, reverse) {
        const map = createMap(SYNC_TYPES, reverse);
        rows.forEach((row) => {
            const sync = (0, fetch_score_util_1.getSyncStatus)(row, isFriendScore);
            try {
                map.get(sync).push(row);
            }
            catch (ex) {
                console.error(`Unknown sync status: ${sync}`, row);
            }
        });
        return createRowsWithSection(map, 0 /* SectionHeadStyle.Default */, rows.length);
    }
    function getVsResult(row) {
        const img = row.querySelector('tr:first-child td:nth-child(2) img');
        const imgSrc = img.src.replace(/\?ver=.*$/, '');
        const lastUnderscoreIdx = imgSrc.lastIndexOf('_');
        const lastDotIdx = imgSrc.lastIndexOf('.');
        return imgSrc.substring(lastUnderscoreIdx + 1, lastDotIdx).toUpperCase();
    }
    function sortRowsByVsResult(rows, reverse) {
        const map = createMap(VS_RESULTS, reverse);
        rows.forEach((row) => {
            const res = getVsResult(row);
            map.get(res).push(row);
        });
        return createRowsWithSection(map, 0 /* SectionHeadStyle.Default */, rows.length);
    }
    function getDxStar(row) {
        if (isFriendScore) {
            const dxStarInt = (0, fetch_score_util_1.getFriendDxStar)(row);
            if (dxStarInt >= DX_STARS.length) {
                console.warn('invalid dx star ' + dxStarInt);
                return DX_STARS[DX_STARS.length - 1];
            }
            return DX_STARS[dxStarInt];
        }
        // my score
        if (row.dataset.dxStar) {
            return row.dataset.dxStar === 'null' ? null : row.dataset.dxStar;
        }
        const dxScoreInfo = (0, fetch_self_score_1.getMyDxScoreInfo)(row);
        const dxStar = dxScoreInfo ? DX_STARS[dxScoreInfo.star] : null;
        row.dataset.dxStar = dxStar;
        return dxStar;
    }
    function sortRowsByDxStar(rows, reverse) {
        const map = createMap(DX_STARS, reverse);
        rows.forEach((row) => {
            const dxStar = getDxStar(row);
            map.get(dxStar).push(row);
        });
        return createRowsWithSection(map, 3 /* SectionHeadStyle.DxStar */, rows.length);
    }
    function sortRowsByInLv(gameVer, rows, reverse) {
        const inLvSet = new Set();
        const inLvs = [];
        for (const row of Array.from(rows)) {
            const lv = getChartInLv(row, cache.songDb);
            inLvSet.add(lv);
            inLvs.push(lv);
        }
        const sortedInLv = Array.from(inLvSet.keys()).sort(level_helper_1.compareLevels);
        if (reverse) {
            sortedInLv.reverse();
        }
        const map = new Map();
        sortedInLv.forEach((lv) => {
            map.set(getInLvSecTitle(gameVer, lv), []);
        });
        Array.from(rows).forEach((row, index) => {
            map.get(getInLvSecTitle(gameVer, inLvs[index])).push(row);
        });
        return createRowsWithSection(map, 0 /* SectionHeadStyle.Default */, rows.length);
    }
    function getScoreRows() {
        return d.body.querySelectorAll('.main_wrapper.t_c .w_450.m_15.f_0');
    }
    function performSort(sortBy) {
        const rows = getScoreRows();
        const screwBlocks = Array.from(d.body.querySelectorAll('.main_wrapper.t_c .screw_block'));
        let sortedRows = null;
        switch (sortBy) {
            case "RankDes" /* SortBy.RankDes */:
                sortedRows = sortRowsByRank(rows, false);
                break;
            case "RankAsc" /* SortBy.RankAsc */:
                sortedRows = sortRowsByRank(rows, true);
                break;
            case "ApFcDes" /* SortBy.ApFcDes */:
                sortedRows = sortRowsByApFc(rows, false);
                break;
            case "ApFcAsc" /* SortBy.ApFcAsc */:
                sortedRows = sortRowsByApFc(rows, true);
                break;
            case "SyncDes" /* SortBy.SyncDes */:
                sortedRows = sortRowsBySync(rows, false);
                break;
            case "SyncAsc" /* SortBy.SyncAsc */:
                sortedRows = sortRowsBySync(rows, true);
                break;
            case "VsResultAsc" /* SortBy.VsResultAsc */:
                sortedRows = sortRowsByVsResult(rows, true);
                break;
            case "VsResultDes" /* SortBy.VsResultDes */:
                sortedRows = sortRowsByVsResult(rows, false);
                break;
            case "LvDes" /* SortBy.LvDes */:
                sortedRows = sortRowsByLevel(rows, true);
                break;
            case "LvAsc" /* SortBy.LvAsc */:
                sortedRows = sortRowsByLevel(rows, false);
                break;
            case "InLvDes" /* SortBy.InLvDes */:
                sortedRows = sortRowsByInLv(cache.songDb.gameVer, rows, true);
                break;
            case "InLvAsc" /* SortBy.InLvAsc */:
                sortedRows = sortRowsByInLv(cache.songDb.gameVer, rows, false);
                break;
            case "DxStarAsc" /* SortBy.DxStarAsc */:
                sortedRows = sortRowsByDxStar(rows, false);
                break;
            case "DxStarDes" /* SortBy.DxStarDes */:
                sortedRows = sortRowsByDxStar(rows, true);
                break;
            case "PlayCountAsc" /* SortBy.PlayCountAsc */:
                sortedRows = sortRowsByPlayCount(rows, false);
                break;
            case "PlayCountDes" /* SortBy.PlayCountDes */:
                sortedRows = sortRowsByPlayCount(rows, true);
                break;
            case "LastPlayedAsc" /* SortBy.LastPlayedAsc */:
                sortedRows = sortRowsByLastPlayed(rows, false);
                break;
            case "LastPlayedDes" /* SortBy.LastPlayedDes */:
                sortedRows = sortRowsByLastPlayed(rows, true);
                break;
            default:
                return;
        }
        for (let i = 1; i < screwBlocks.length; i++) {
            screwBlocks[i].remove();
        }
        const firstScrewBlock = screwBlocks[0];
        for (let i = sortedRows.length - 1; i >= 1; i--) {
            firstScrewBlock.insertAdjacentElement('afterend', sortedRows[i]);
        }
        firstScrewBlock.innerText = sortedRows[0].innerText;
    }
    function addSummaryBlock() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const scorePage = yield (0, net_helpers_1.fetchPage)(fetch_self_score_1.SELF_SCORE_URLS.get(4 /* Difficulty.ReMASTER */));
            const summaryTable = (_a = scorePage.querySelector('.music_scorelist_table')) === null || _a === void 0 ? void 0 : _a.parentElement;
            if (!summaryTable) {
                console.warn('could not find summary table');
                return;
            }
            if (!isDxScoreVs) {
                (_b = summaryTable.querySelector('tr:last-child')) === null || _b === void 0 ? void 0 : _b.remove();
            }
            const rows = getScoreRows();
            const total = rows.length;
            function updateRankSummary() {
                const rankCount = {};
                for (const x of RANK_TITLES) {
                    rankCount[x] = 0;
                }
                rows.forEach((row) => {
                    rankCount[getRankTitle(row)]++;
                });
                // 9 is the index of A in RANK_TITLES
                for (let i = 1; i < 9; i++) {
                    rankCount[RANK_TITLES[i]] += rankCount[RANK_TITLES[i - 1]];
                }
                const columns = summaryTable.querySelectorAll('tr:first-child .f_10');
                columns[0].innerHTML = `${rankCount['A']}/${total}`;
                columns[1].innerHTML = `${rankCount['S']}/${total}`;
                columns[2].innerHTML = `${rankCount['S+']}/${total}`;
                columns[3].innerHTML = `${rankCount['SS']}/${total}`;
                columns[4].innerHTML = `${rankCount['SS+']}/${total}`;
                columns[5].innerHTML = `${rankCount['SSS']}/${total}`;
                columns[6].innerHTML = `${rankCount['SSS+']}/${total}`;
            }
            function updateApFcSummary() {
                const apfcCount = {};
                for (const x of AP_FC_TYPES) {
                    apfcCount[x] = 0;
                }
                rows.forEach((row) => {
                    apfcCount[(0, fetch_score_util_1.getApFcStatus)(row, true)]++;
                });
                // 4 is the index of null
                for (let i = 1; i < AP_FC_TYPES.length - 1; i++) {
                    apfcCount[AP_FC_TYPES[i]] += apfcCount[AP_FC_TYPES[i - 1]];
                }
                const columns = summaryTable.querySelectorAll('tr:nth-child(2) .f_10');
                columns[0].innerHTML = `${apfcCount['FC']}/${total}`;
                columns[1].innerHTML = `${apfcCount['FC+']}/${total}`;
                columns[2].innerHTML = `${apfcCount['AP']}/${total}`;
                columns[3].innerHTML = `${apfcCount['AP+']}/${total}`;
            }
            function updateSyncSummary() {
                const syncCount = {};
                for (const x of SYNC_TYPES) {
                    syncCount[x] = 0;
                }
                rows.forEach((row) => {
                    syncCount[(0, fetch_score_util_1.getSyncStatus)(row, true)]++;
                });
                // 4 is the index of null
                for (let i = 1; i < SYNC_TYPES.length - 1; i++) {
                    syncCount[SYNC_TYPES[i]] += syncCount[SYNC_TYPES[i - 1]];
                }
                const columns = summaryTable.querySelectorAll('tr:nth-child(3) .f_10');
                columns[0].innerHTML = `${syncCount['SYNC']}/${total}`;
                columns[1].innerHTML = `${syncCount['FS']}/${total}`;
                columns[2].innerHTML = `${syncCount['FS+']}/${total}`;
                columns[3].innerHTML = `${syncCount['FSD']}/${total}`;
                columns[4].innerHTML = `${syncCount['FSD+']}/${total}`;
            }
            function updateDxStarSummary() {
                const dxStarCount = {};
                for (const x of DX_STARS) {
                    dxStarCount[x] = 0;
                }
                rows.forEach((row) => {
                    dxStarCount[getDxStar(row)]++;
                });
                for (let i = DX_STARS.length - 2; i >= 1; i--) {
                    dxStarCount[DX_STARS[i]] += dxStarCount[DX_STARS[i + 1]];
                }
                const columns = summaryTable.querySelectorAll('tr:last-child .f_10');
                columns[0].innerHTML = `${dxStarCount[DX_STARS[1]]}/${total}`;
                columns[1].innerHTML = `${dxStarCount[DX_STARS[2]]}/${total}`;
                columns[2].innerHTML = `${dxStarCount[DX_STARS[3]]}/${total}`;
                columns[3].innerHTML = `${dxStarCount[DX_STARS[4]]}/${total}`;
                columns[4].innerHTML = `${dxStarCount[DX_STARS[5]]}/${total}`;
            }
            setTimeout(updateRankSummary, 0);
            setTimeout(updateApFcSummary, 0);
            setTimeout(updateSyncSummary, 0);
            if (isDxScoreVs) {
                setTimeout(updateDxStarSummary, 0);
            }
            const vsResultBlock = d.querySelector('.town_block + .see_through_block');
            vsResultBlock.insertAdjacentElement('afterend', summaryTable);
        });
    }
    function expandDualChartRows() {
        const songRecords = d.querySelectorAll('div.w_450.m_15.p_r.f_0[id]');
        songRecords.forEach((row) => {
            var _a, _b;
            row.style.removeProperty('display');
            row.style.removeProperty('margin-top');
            if (row.id.includes('sta_')) {
                (_a = row.querySelector('.music_kind_icon_dx')) === null || _a === void 0 ? void 0 : _a.remove();
            }
            else {
                (_b = row.querySelector('.music_kind_icon_standard')) === null || _b === void 0 ? void 0 : _b.remove();
            }
            const chartTypeImg = row.querySelector('img:nth-child(2)');
            chartTypeImg.onclick = null;
            chartTypeImg.className = 'music_kind_icon';
        });
    }
    function createOption(sortBy, hidden) {
        const label = SortLabels[sortBy];
        let option = d.getElementsByClassName('option_' + sortBy)[0];
        if (!option) {
            option = d.createElement('option');
            option.className = 'option_' + sortBy;
            option.innerText = label;
            option.value = sortBy;
        }
        if (hidden) {
            option.classList.add('d_n');
        }
        else {
            option.classList.remove('d_n');
        }
        return option;
    }
    function createSortOptions() {
        const id = 'scoreSortContainer';
        let div = d.getElementById(id);
        if (div) {
            return div;
        }
        div = d.createElement('div');
        div.id = id;
        div.className = 'w_450 m_15';
        const select = d.createElement('select');
        select.className = 'w_300 m_10';
        select.addEventListener('change', (evt) => {
            performSort(evt.target.value);
        });
        select.append(createOption("None" /* SortBy.None */));
        select.append(createOption("RankAsc" /* SortBy.RankAsc */));
        select.append(createOption("RankDes" /* SortBy.RankDes */));
        select.append(createOption("ApFcAsc" /* SortBy.ApFcAsc */));
        select.append(createOption("ApFcDes" /* SortBy.ApFcDes */));
        select.append(createOption("SyncAsc" /* SortBy.SyncAsc */));
        select.append(createOption("SyncDes" /* SortBy.SyncDes */));
        if (isFriendScore) {
            if (!isUtage && isDxScoreVs) {
                select.append(createOption("DxStarDes" /* SortBy.DxStarDes */));
                select.append(createOption("DxStarAsc" /* SortBy.DxStarAsc */));
            }
            select.append(createOption("VsResultAsc" /* SortBy.VsResultAsc */));
            select.append(createOption("VsResultDes" /* SortBy.VsResultDes */));
        }
        else if (!isUtage) {
            select.append(createOption("DxStarDes" /* SortBy.DxStarDes */));
            select.append(createOption("DxStarAsc" /* SortBy.DxStarAsc */));
        }
        select.append(createOption("LvAsc" /* SortBy.LvAsc */));
        select.append(createOption("LvDes" /* SortBy.LvDes */));
        select.append(createOption("InLvAsc" /* SortBy.InLvAsc */, true));
        select.append(createOption("InLvDes" /* SortBy.InLvDes */, true));
        select.append(createOption("PlayCountAsc" /* SortBy.PlayCountAsc */));
        select.append(createOption("PlayCountDes" /* SortBy.PlayCountDes */));
        select.append(createOption("LastPlayedAsc" /* SortBy.LastPlayedAsc */));
        select.append(createOption("LastPlayedDes" /* SortBy.LastPlayedDes */));
        div.append(select);
        return div;
    }
    function getPlayCount(row) {
        const el = row.querySelector('.play-count');
        return el ? parseInt(el.textContent.trim()) : 0;
    }
    function getLastPlayed(row) {
        const el = row.querySelector('.last-played');
        return el ? new Date(el.textContent.trim()).getTime() : 0;
    }
    function sortRowsByPlayCount(rows, reverse) {
        const sorted = Array.from(rows).sort((a, b) => reverse ? getPlayCount(b) - getPlayCount(a) : getPlayCount(a) - getPlayCount(b));
        return sorted;
    }
    function sortRowsByLastPlayed(rows, reverse) {
        const sorted = Array.from(rows).sort((a, b) => reverse ? getLastPlayed(b) - getLastPlayed(a) : getLastPlayed(a) - getLastPlayed(b));
        return sorted;
    }
    function fetchAndAddInternalLvSort() {
        return __awaiter(this, void 0, void 0, function* () {
            const gameVer = yield (0, net_helpers_1.fetchGameVersion)(d.body);
            const gameRegion = (0, game_region_1.getGameRegionFromOrigin)(d.location.origin);
            const songDb = yield (0, song_props_1.loadSongDatabase)(gameVer, gameRegion);
            console.log(songDb);
            const rows = Array.from(getScoreRows());
            for (const row of rows) {
                const name = (0, fetch_score_util_1.getSongName)(row);
                if (name === 'Link') {
                    const lvIndex = difficulties_1.DIFFICULTIES.indexOf((0, fetch_score_util_1.getChartDifficulty)(row));
                    const idx = (0, song_name_helper_1.getSongIdx)(row);
                    if (idx) {
                        // idx is only available on self score page
                        const genre = yield (0, song_name_helper_1.fetchSongGenre)(idx);
                        const props = songDb.getSongProperties(name, genre, 0 /* ChartType.STANDARD */);
                        saveInLv(row, coalesceInLv(gameVer, row, lvIndex, props));
                    }
                    else {
                        saveInLv(row, coalesceInLv(gameVer, row, lvIndex));
                    }
                }
                else {
                    const lv = getChartInLv(row, songDb);
                    saveInLv(row, lv);
                }
            }
            console.log('enabling internal level sort');
            createOption("InLvAsc" /* SortBy.InLvAsc */, false);
            createOption("InLvDes" /* SortBy.InLvDes */, false);
            cache.songDb = songDb;
        });
    }
    // main
    if (isFriendScore) {
        addSummaryBlock();
    }
    else {
        expandDualChartRows();
    }
    addOfficialLvDataset();
    const firstScrewBlock = d.body.querySelector('.main_wrapper.t_c .screw_block');
    if (firstScrewBlock) {
        firstScrewBlock.insertAdjacentElement('beforebegin', createSortOptions());
        fetchAndAddInternalLvSort();
    }
})(document);
