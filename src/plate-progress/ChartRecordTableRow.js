"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartRecordTableRow = void 0;
const react_1 = __importDefault(require("react"));
const chart_type_1 = require("../common/chart-type");
function ChartRecordTableRow({ done, r, songNickname, chartType }) {
    if (!r) {
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", { className: 'songName ' + (done ? 'done' : 'undone'), title: songNickname }, songNickname),
            react_1.default.createElement("td", null, (0, chart_type_1.getChartTypeName)(chartType)),
            react_1.default.createElement("td", { className: "achv" }, "0.0000%"),
            react_1.default.createElement("td", null),
            react_1.default.createElement("td", null),
            react_1.default.createElement("td", null)));
    }
    return (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", { className: 'songName ' + (done ? 'done' : 'undone'), title: songNickname }, songNickname),
        react_1.default.createElement("td", null, (0, chart_type_1.getChartTypeName)(chartType)),
        react_1.default.createElement("td", { className: "achv" }, r.achievement.toFixed(4) + '%'),
        react_1.default.createElement("td", null, hasFullCombo(r.fcap) && '✓'),
        react_1.default.createElement("td", null, hasAllPerfect(r.fcap) && '✓'),
        react_1.default.createElement("td", null, hasFullSyncDx(r.sync) && '✓')));
}
exports.ChartRecordTableRow = ChartRecordTableRow;
function hasFullCombo(fcap) {
    return ['FC', 'FC+', 'AP', 'AP+'].includes(fcap);
}
function hasAllPerfect(fcap) {
    return ['AP', 'AP+'].includes(fcap);
}
function hasFullSyncDx(sync) {
    return ['FSD', 'FSD+'].includes(sync);
}
