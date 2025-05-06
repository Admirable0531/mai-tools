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
exports.CandidateChartRecords = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const level_helper_1 = require("../../common/level-helper");
const rank_functions_1 = require("../../common/rank-functions");
const candidate_songs_1 = require("../candidate-songs");
const common_messages_1 = require("../common-messages");
const record_comparator_1 = require("../record-comparator");
const CandidatesPlayedToggle_1 = require("./CandidatesPlayedToggle");
const ChartRecordsTable_1 = require("./ChartRecordsTable");
const CollapsibleContainer_1 = require("./CollapsibleContainer");
const CANDIDATE_SONGS_LIMIT = 20;
const NEW_CANDIDATE_SONGS_POOL_SIZE = 100;
const OLD_CANDIDATE_SONGS_POOL_SIZE = 250;
const COLUMNS = [
    0 /* ColumnType.NO */,
    1 /* ColumnType.SONG_TITLE */,
    2 /* ColumnType.CHART_TYPE */,
    3 /* ColumnType.LEVEL */,
    4 /* ColumnType.ACHIEVEMENT */,
    6 /* ColumnType.NEXT_RANK */,
    8 /* ColumnType.NEXT_RATING */,
];
const COMPARATOR = new Map([
    [1 /* ColumnType.SONG_TITLE */, record_comparator_1.compareSongsByName],
    [2 /* ColumnType.CHART_TYPE */, record_comparator_1.compareSongsByChartType],
    [3 /* ColumnType.LEVEL */, record_comparator_1.compareSongsByLevel],
    [4 /* ColumnType.ACHIEVEMENT */, record_comparator_1.compareSongsByAchv],
    [6 /* ColumnType.NEXT_RANK */, record_comparator_1.compareSongsByNextRank],
    [8 /* ColumnType.NEXT_RATING */, record_comparator_1.compareSongsByNextRating],
]);
const CandidateChartRecords = ({ hidden, songDatabase, ratingData, isCurrentVersion, songList, }) => {
    const [showPlayed, setShowPlayed] = (0, react_1.useState)(true);
    const [showAll, setShowAll] = (0, react_1.useState)(false);
    const [sortBy, setSortBy] = (0, react_1.useState)();
    const [reverse, setReverse] = (0, react_1.useState)();
    const [levelToShow, setLevelToShow] = (0, react_1.useState)();
    const [minorLvToShow, setMinorLvToShow] = (0, react_1.useState)();
    const name = isCurrentVersion ? 'new' : 'old';
    const records = isCurrentVersion ? ratingData.newChartRecords : ratingData.oldChartRecords;
    const topCount = isCurrentVersion ? ratingData.newTopChartsCount : ratingData.oldTopChartsCount;
    const minRating = topCount > 0 ? Math.floor(records[topCount - 1].rating) : 0;
    // If we have no topCount (likely meaning the latest version has not been played), estimate
    // minRating by using 0.9 * lowest rating in old records.
    const levels = generateLevels(songDatabase.gameVer, minRating ||
        (ratingData.oldTopChartsCount
            ? Math.floor(0.9 * ratingData.oldChartRecords[ratingData.oldTopChartsCount - 1].rating)
            : 0));
    const candidates = (0, react_1.useMemo)(() => {
        const poolSize = isCurrentVersion
            ? NEW_CANDIDATE_SONGS_POOL_SIZE
            : OLD_CANDIDATE_SONGS_POOL_SIZE;
        const lvFilter = minorLvToShow
            ? { title: levelToShow.title, minLv: minorLvToShow, maxLv: minorLvToShow }
            : levelToShow;
        return showPlayed
            ? (0, candidate_songs_1.getCandidateCharts)(records, topCount, poolSize, lvFilter)
            : songList
                ? (0, candidate_songs_1.getNotPlayedCharts)(songList, records, minRating, poolSize, lvFilter)
                : [];
    }, [songList, records, showPlayed, levelToShow, minorLvToShow]);
    const toggleShowMore = (0, react_1.useCallback)((evt) => {
        evt.preventDefault();
        setShowAll(!showAll);
    }, [showAll]);
    const toggleShowPlayed = (0, react_1.useCallback)((showPlayed) => {
        setShowPlayed(showPlayed);
    }, []);
    const selectLv = (0, react_1.useCallback)((evt) => {
        const majorLv = levels.find((lv) => evt.currentTarget.value === lv.title);
        if (levelToShow !== majorLv) {
            setMinorLvToShow(null);
        }
        setLevelToShow(majorLv);
    }, [setLevelToShow]);
    const selectMinorLv = (0, react_1.useCallback)((evt) => {
        const minorLv = parseFloat(evt.currentTarget.value);
        setMinorLvToShow(isNaN(minorLv) ? null : minorLv);
    }, [setMinorLvToShow]);
    const handleSortBy = (0, react_1.useCallback)((col) => {
        if (!COMPARATOR.has(col)) {
            setSortBy(undefined);
        }
        else if (col === sortBy) {
            setReverse(!reverse);
        }
        else {
            setSortBy(col);
            setReverse(false);
        }
    }, [sortBy, reverse]);
    const endIndex = showAll ? candidates.length : Math.min(candidates.length, CANDIDATE_SONGS_LIMIT);
    // make a copy
    const candidatesToShow = candidates.slice(0, endIndex).map((r, i) => {
        r.order = i + 1;
        return r;
    });
    if (sortBy) {
        candidatesToShow.sort(COMPARATOR.get(sortBy));
        if (reverse) {
            candidatesToShow.reverse();
        }
    }
    const hasMore = candidates.length > CANDIDATE_SONGS_LIMIT;
    const minorLvs = [];
    if (levelToShow) {
        for (let i = levelToShow.minLv; i <= levelToShow.maxLv; i += 0.1) {
            minorLvs.push(i);
        }
    }
    const messages = common_messages_1.CommonMessages[(0, lang_react_1.useLanguage)()];
    return (react_1.default.createElement(CollapsibleContainer_1.CollapsibleContainer, { className: "songRecordTableContainer", hidden: hidden },
        songList && (react_1.default.createElement(CandidatesPlayedToggle_1.CandidatesPlayedToggle, { name: name, showPlayed: showPlayed, toggleShowPlayed: toggleShowPlayed })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("select", { className: "candidateLvSelect", value: (levelToShow === null || levelToShow === void 0 ? void 0 : levelToShow.title) || '--', onChange: selectLv },
                react_1.default.createElement("option", { value: "--" },
                    messages.level,
                    " - ",
                    messages.all),
                levels.map((lv) => (react_1.default.createElement("option", { key: lv.title, value: lv.title }, lv.title)))),
            minorLvs.length ? (react_1.default.createElement("select", { className: "candidateMinorLvSelect", value: minorLvToShow == null ? '--' : minorLvToShow.toFixed(1), onChange: selectMinorLv },
                react_1.default.createElement("option", { value: "--" },
                    messages.all,
                    " ",
                    levelToShow.title),
                minorLvs.map((lv) => (react_1.default.createElement("option", { key: lv.toFixed(1), value: lv.toFixed(1) }, lv.toFixed(1)))))) : null),
        react_1.default.createElement(ChartRecordsTable_1.ChartRecordsTable, { tableClassname: "candidateTable", records: candidatesToShow, sortBy: handleSortBy, columns: COLUMNS, isCandidate: true }),
        hasMore && (react_1.default.createElement("a", { className: "showMore", href: "#", onClick: toggleShowMore }, showAll ? messages.showLess : messages.showMore)),
        react_1.default.createElement("div", { className: "marginBottom30" })));
};
exports.CandidateChartRecords = CandidateChartRecords;
function generateLevels(gameVer, minRating) {
    const easiestLv = minRating / (rank_functions_1.RANK_SSS_PLUS.factor * rank_functions_1.RANK_SSS_PLUS.minAchv);
    let baseLv = Math.floor(easiestLv);
    const maxMinorBeforePlus = (0, level_helper_1.getMaxMinorBeforePlus)(gameVer);
    const minMinorOfPlus = (0, level_helper_1.getMinMinorOfPlus)(gameVer);
    const isPlus = easiestLv - baseLv > maxMinorBeforePlus;
    const levels = [];
    if (easiestLv <= 14.9) {
        if (!isPlus) {
            levels.push({ title: String(baseLv), minLv: baseLv, maxLv: baseLv + maxMinorBeforePlus });
        }
        levels.push({ title: baseLv + '+', minLv: baseLv + minMinorOfPlus, maxLv: baseLv + 0.9 });
        baseLv += 1;
        while (baseLv < 15) {
            levels.push({ title: String(baseLv), minLv: baseLv, maxLv: baseLv + maxMinorBeforePlus });
            levels.push({ title: baseLv + '+', minLv: baseLv + minMinorOfPlus, maxLv: baseLv + 0.9 });
            baseLv += 1;
        }
    }
    levels.push({ title: '15', minLv: 15.0, maxLv: 15.0 });
    return levels;
}
