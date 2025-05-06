"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteJudgement = exports.getLastColumnText = void 0;
const react_1 = __importDefault(require("react"));
const number_helper_1 = require("../../common/number-helper");
function getLastColumnText(score, isDxMode) {
    if (typeof score === 'string') {
        // When showDetail is true and there is no loss score, score will be empty string.
        return score.length == 0 ? '0' : score;
    }
    return isDxMode ? (0, number_helper_1.formatFloat)(score, 4) + '%' : score.toLocaleString('en');
}
exports.getLastColumnText = getLastColumnText;
class NoteJudgement extends react_1.default.PureComponent {
    render() {
        const { noteType, judgements, lastColumn, loss, isDxMode, showDetail } = this.props;
        if (!judgements) {
            return null;
        }
        const heading = noteType.charAt(0).toUpperCase() + noteType.substring(1);
        const scoreClass = lastColumn.isMax ? 'score maxScore' : 'score';
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("th", { className: "rowHead" }, heading),
            react_1.default.createElement("td", { className: "perfect" },
                judgements.perfect,
                showDetail ? react_1.default.createElement("p", null, loss.perfect) : ''),
            react_1.default.createElement("td", { className: "great" },
                judgements.great,
                showDetail ? react_1.default.createElement("p", null, loss.great) : ''),
            react_1.default.createElement("td", { className: "good" },
                judgements.good,
                showDetail ? react_1.default.createElement("p", null, loss.good) : ''),
            react_1.default.createElement("td", { className: "miss" },
                judgements.miss,
                showDetail ? react_1.default.createElement("p", null, loss.miss) : ''),
            react_1.default.createElement("td", { className: scoreClass }, getLastColumnText(lastColumn.score, isDxMode))));
    }
}
exports.NoteJudgement = NoteJudgement;
