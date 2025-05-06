"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelRankDistribution = void 0;
const react_1 = __importDefault(require("react"));
const level_helper_1 = require("../../common/level-helper");
const number_helper_1 = require("../../common/number-helper");
const rank_distribution_1 = require("../rank-distribution");
const RankDistributionDataRow_1 = require("./RankDistributionDataRow");
const RankDistributionHeadRow_1 = require("./RankDistributionHeadRow");
const LEVEL_RANK_CELL_BASE_CLASSNAME = 'levelRankCell';
const LEVEL_RANK_CELL_CLASSNAMES = ['officialLevelCell'];
function getRecordsPerLevel(gameVer, records) {
    const levels = records.map((r) => r.level);
    levels.sort(number_helper_1.compareNumber);
    levels.reverse();
    const recordsPerLevel = new Map();
    for (const lv of levels) {
        const officialLv = (0, level_helper_1.getOfficialLevel)(gameVer, lv);
        if (!recordsPerLevel.has(officialLv)) {
            recordsPerLevel.set(officialLv, []);
        }
    }
    for (const r of records) {
        recordsPerLevel.get((0, level_helper_1.getOfficialLevel)(gameVer, r.level)).push(r);
    }
    return recordsPerLevel;
}
class LevelRankDistribution extends react_1.default.PureComponent {
    render() {
        const { gameVer, chartRecords, topLeftCell, topChartsCount } = this.props;
        const topRecords = chartRecords.slice(0, topChartsCount);
        const rankMap = (0, rank_distribution_1.getRankMap)(topRecords);
        const recordsPerLevel = getRecordsPerLevel(gameVer, topRecords);
        return (react_1.default.createElement("table", { className: "rankDistributionTable" },
            react_1.default.createElement("thead", null,
                react_1.default.createElement(RankDistributionHeadRow_1.RankDistributionHeadRow, { columns: rankMap.keys(), firstCell: topLeftCell, baseCellClassname: LEVEL_RANK_CELL_BASE_CLASSNAME, perColumnClassnames: LEVEL_RANK_CELL_CLASSNAMES })),
            react_1.default.createElement("tbody", null, Array.from(recordsPerLevel.entries()).map(([level, records]) => (react_1.default.createElement(RankDistributionDataRow_1.RankDistributionDataRow, { key: level, rowHead: level, columns: rankMap.keys(), rankDist: (0, rank_distribution_1.getRankDistribution)(records), baseCellClassname: LEVEL_RANK_CELL_BASE_CLASSNAME, perColumnClassnames: LEVEL_RANK_CELL_CLASSNAMES }))))));
    }
}
exports.LevelRankDistribution = LevelRankDistribution;
