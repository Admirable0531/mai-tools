"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScorePageContainer = void 0;
const react_1 = __importDefault(require("react"));
const constants_1 = require("../constants");
const scoreCalc_1 = require("../scoreCalc");
const ScorePage_1 = require("./ScorePage");
function calculateJudgementDisplayMap(noteJudgements) {
    const res = new Map();
    const totalCount = Object.assign({}, constants_1.EMPTY_JUDGEMENT_OBJ);
    noteJudgements.forEach((noteJ, noteType) => {
        res.set(noteType, {
            perfect: noteJ.cp + noteJ.perfect,
            great: noteJ.great,
            good: noteJ.good,
            miss: noteJ.miss,
        });
        // Update total judgement count
        Object.keys(noteJ).forEach((rawJ) => {
            const j = rawJ;
            totalCount[j === 'cp' ? 'perfect' : j] += noteJ[j];
        });
    });
    res.set('total', totalCount);
    return res;
}
function calculateApFcStatus(totalJudgements, finaleBorder) {
    if (totalJudgements.miss) {
        return null;
    }
    else if (finaleBorder.get('AP+') === 0) {
        return 'AP+';
    }
    else if (totalJudgements.good) {
        return 'FC';
    }
    else if (totalJudgements.great) {
        return 'FC+';
    }
    return 'AP';
}
class ScorePageContainer extends react_1.default.PureComponent {
    static getDerivedStateFromProps(nextProps) {
        const info = (0, scoreCalc_1.calculateScoreInfo)(nextProps.noteJudgements, nextProps.achievement);
        const judgementDisplayMap = calculateJudgementDisplayMap(nextProps.noteJudgements);
        const apFcStatus = calculateApFcStatus(judgementDisplayMap.get('total'), info.finaleBorder);
        return Object.assign(Object.assign({}, info), { judgementDisplayMap, apFcStatus });
    }
    render() {
        return react_1.default.createElement(ScorePage_1.ScorePage, Object.assign({}, this.props, this.state));
    }
}
exports.ScorePageContainer = ScorePageContainer;
