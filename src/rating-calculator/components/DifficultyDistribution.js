"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DifficultyDistribution = void 0;
const react_1 = __importDefault(require("react"));
const chart_type_1 = require("../../common/chart-type");
const difficulties_1 = require("../../common/difficulties");
const lang_react_1 = require("../../common/lang-react");
const common_messages_1 = require("../common-messages");
const RankDistributionDataRow_1 = require("./RankDistributionDataRow");
const RankDistributionHeadRow_1 = require("./RankDistributionHeadRow");
const DIFF_RANK_CELL_BASE_CLASSNAME = 'diffRankCell';
const DIFF_RANK_TOP_LEFT_CELL_CLASSNAME = 'difficultyRankDistHead';
function getRecordsPerDifficulty(records) {
    const recordsPerDifficulty = new Map();
    for (let i = difficulties_1.DIFFICULTIES.length - 1; i >= 0; i--) {
        recordsPerDifficulty.set(difficulties_1.DIFFICULTIES[i], {
            [1 /* ChartType.DX */]: 0,
            [0 /* ChartType.STANDARD */]: 0,
            [2 /* ChartType.UTAGE */]: 0,
        });
    }
    for (const r of records) {
        recordsPerDifficulty.get(r.difficulty)[r.chartType] += 1;
    }
    return recordsPerDifficulty;
}
const DifficultyDistribution = ({ chartRecords, topChartsCount }) => {
    const lang = (0, lang_react_1.useLanguage)();
    const topRecords = chartRecords.slice(0, topChartsCount);
    const hasChartType = topRecords.reduce((has, r) => {
        has[r.chartType] = true;
        return has;
    }, { [0 /* ChartType.STANDARD */]: false, [1 /* ChartType.DX */]: false, [2 /* ChartType.UTAGE */]: false });
    const chartTypeNames = [1 /* ChartType.DX */, 0 /* ChartType.STANDARD */]
        .filter((chartType) => hasChartType[chartType])
        .map(chart_type_1.getChartTypeName);
    const recordsPerDiff = getRecordsPerDifficulty(topRecords);
    return (react_1.default.createElement("table", { className: "rankDistributionTable" },
        react_1.default.createElement("thead", null,
            react_1.default.createElement(RankDistributionHeadRow_1.RankDistributionHeadRow, { firstCell: common_messages_1.CommonMessages[lang].difficulty, baseCellClassname: DIFF_RANK_CELL_BASE_CLASSNAME, perColumnClassnames: [DIFF_RANK_TOP_LEFT_CELL_CLASSNAME], columns: chartTypeNames })),
        react_1.default.createElement("tbody", null, Array.from(recordsPerDiff.entries())
            .filter(([_, countByChartType]) => countByChartType[1 /* ChartType.DX */] + countByChartType[0 /* ChartType.STANDARD */] > 0)
            .map(([d, countByChartType]) => {
            const dist = new Map([
                [(0, chart_type_1.getChartTypeName)(0 /* ChartType.STANDARD */), countByChartType[0 /* ChartType.STANDARD */]],
                [(0, chart_type_1.getChartTypeName)(1 /* ChartType.DX */), countByChartType[1 /* ChartType.DX */]],
            ]);
            return (react_1.default.createElement(RankDistributionDataRow_1.RankDistributionDataRow, { key: d, rowHead: (0, difficulties_1.getDifficultyName)(d), columns: chartTypeNames, rankDist: dist, baseCellClassname: DIFF_RANK_CELL_BASE_CLASSNAME, perColumnClassnames: [(0, difficulties_1.getDifficultyClassName)(d)] }));
        }))));
};
exports.DifficultyDistribution = DifficultyDistribution;
