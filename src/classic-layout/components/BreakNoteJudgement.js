"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakNoteJudgement = void 0;
const react_1 = __importDefault(require("react"));
const NoteJudgement_1 = require("./NoteJudgement");
class BreakNoteJudgement extends react_1.default.PureComponent {
    render() {
        const { judgements, distribution, lastColumn, loss, isDxMode, showDetail } = this.props;
        const scoreClass = lastColumn.isMax ? 'score maxScore' : 'score';
        if (showDetail) {
            return (react_1.default.createElement("tr", null,
                react_1.default.createElement("th", { className: "rowHead" }, "Break"),
                react_1.default.createElement("td", { className: "perfect" },
                    distribution.get(2600),
                    "-",
                    distribution.get(2550),
                    "-",
                    distribution.get(2500),
                    react_1.default.createElement("p", null, loss.perfect)),
                react_1.default.createElement("td", { className: "great" },
                    distribution.get(2000),
                    "-",
                    distribution.get(1500),
                    "-",
                    distribution.get(1250),
                    react_1.default.createElement("p", null, loss.great)),
                react_1.default.createElement("td", { className: "good" },
                    distribution.get(1000),
                    react_1.default.createElement("p", null, loss.good)),
                react_1.default.createElement("td", { className: "miss" },
                    distribution.get(0),
                    react_1.default.createElement("p", null, loss.miss)),
                react_1.default.createElement("td", { className: scoreClass }, (0, NoteJudgement_1.getLastColumnText)(lastColumn.score, isDxMode))));
        }
        else {
            return (react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: "break", judgements: judgements, loss: loss, lastColumn: lastColumn, isDxMode: isDxMode, showDetail: showDetail }));
        }
    }
}
exports.BreakNoteJudgement = BreakNoteJudgement;
