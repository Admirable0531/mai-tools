"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DxAchvDetails = void 0;
const react_1 = __importDefault(require("react"));
const constants_1 = require("../classic-layout/constants");
function getClassNameByBreakScore(score) {
    return score > 2000
        ? 'perfectJudgement'
        : score > 1000
            ? 'greatJudgement'
            : score > 0
                ? 'goodJudgement'
                : 'missJudgement';
}
class DxAchvDetails extends react_1.default.PureComponent {
    render() {
        const { dxAchv, breakDist } = this.props;
        return (react_1.default.createElement("table", { className: "dxAchvDetails" },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", { className: "dxAchv", colSpan: 8 },
                        dxAchv,
                        "%")),
                react_1.default.createElement("tr", null, Array.from(constants_1.BREAK_BONUS_MULTIPLIER.keys()).map((score, i) => (react_1.default.createElement("th", { key: i, className: getClassNameByBreakScore(score) }, score))))),
            react_1.default.createElement("tbody", null,
                react_1.default.createElement("tr", null, Array.from(constants_1.BREAK_BONUS_MULTIPLIER.keys()).map((score, i) => (react_1.default.createElement("td", { key: i, className: getClassNameByBreakScore(score) }, breakDist.get(score))))))));
    }
}
exports.DxAchvDetails = DxAchvDetails;
