"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgementContainer = void 0;
const react_1 = __importDefault(require("react"));
const BreakNoteJudgement_1 = require("./BreakNoteJudgement");
const NextRankInfo_1 = require("./NextRankInfo");
const NoteJudgement_1 = require("./NoteJudgement");
class JudgementContainer extends react_1.default.PureComponent {
    render() {
        const { breakDistribution, combo, isDxMode, nextRank, judgementDisplayMap, noteLoss, scorePerType, showDetail, } = this.props;
        return (react_1.default.createElement("div", { className: "judgementContainer" },
            react_1.default.createElement("table", { className: "judgement" },
                react_1.default.createElement("tbody", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { className: "rowHead" }, "\u00A0"),
                        react_1.default.createElement("th", { className: "perfect" }, "Perfect"),
                        react_1.default.createElement("th", { className: "great" }, "Great"),
                        react_1.default.createElement("th", { className: "good" }, "Good"),
                        react_1.default.createElement("th", { className: "miss" }, "Miss"),
                        react_1.default.createElement("th", { className: "score" }, "Score")),
                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: "total", judgements: judgementDisplayMap.get('total'), loss: noteLoss.get('total'), lastColumn: scorePerType.get('total'), isDxMode: isDxMode, showDetail: showDetail }),
                    react_1.default.createElement(NextRankInfo_1.NextRankInfo, { nextRank: nextRank, showTitle: showDetail }),
                    combo && (react_1.default.createElement("tr", { className: "maxCombo" },
                        react_1.default.createElement("th", { className: "noRightBorder", colSpan: 4 }, "MAX COMBO"),
                        react_1.default.createElement("td", { className: "noLeftBorder", colSpan: 2 }, combo))),
                    react_1.default.createElement("tr", { className: "tableSeparator" },
                        react_1.default.createElement("td", { colSpan: 6 })),
                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: "tap", judgements: judgementDisplayMap.get('tap'), loss: noteLoss.get('tap'), lastColumn: scorePerType.get('tap'), isDxMode: isDxMode, showDetail: showDetail }),
                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: "hold", judgements: judgementDisplayMap.get('hold'), loss: noteLoss.get('hold'), lastColumn: scorePerType.get('hold'), isDxMode: isDxMode, showDetail: showDetail }),
                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: "slide", judgements: judgementDisplayMap.get('slide'), loss: noteLoss.get('slide'), lastColumn: scorePerType.get('slide'), isDxMode: isDxMode, showDetail: showDetail }),
                    react_1.default.createElement(NoteJudgement_1.NoteJudgement, { noteType: "touch", judgements: judgementDisplayMap.get('touch'), loss: noteLoss.get('touch'), lastColumn: scorePerType.get('touch'), isDxMode: isDxMode, showDetail: showDetail }),
                    react_1.default.createElement(BreakNoteJudgement_1.BreakNoteJudgement, { judgements: judgementDisplayMap.get('break'), loss: noteLoss.get('break'), distribution: breakDistribution, lastColumn: scorePerType.get('break'), isDxMode: isDxMode, showDetail: showDetail })))));
    }
}
exports.JudgementContainer = JudgementContainer;
