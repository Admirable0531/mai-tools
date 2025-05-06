"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DxAchievementCalculator = void 0;
const react_1 = __importDefault(require("react"));
const DxAchvDetails_1 = require("./DxAchvDetails");
const finaleBacktracing_1 = require("./finaleBacktracing");
class DxAchievementCalculator extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.handleChangeFinaleAchv = (evt) => {
            const achv = parseFloat(evt.currentTarget.value);
            if (achv > 0) {
                this.setState({ finaleAchv: achv });
            }
        };
        this.handleChangeTotalScore = (evt) => {
            const totalScore = parseInt(evt.currentTarget.value);
            if (totalScore > 0) {
                const name = evt.currentTarget.name;
                const newState = { [name]: totalScore };
                this.setState(newState);
            }
        };
        this.handleChangeBreakJudgement = (evt) => {
            const count = parseInt(evt.currentTarget.value);
            if (count >= 0) {
                const index = parseInt(evt.currentTarget.name.substring(6));
                this.setState(({ breakJudgements }) => ({
                    breakJudgements: breakJudgements.map((v, idx) => (idx === index ? count : v)),
                }));
            }
        };
        this.handleFillExample = (evt) => {
            evt.preventDefault();
            if (Math.random() > 0.5) {
                // 全人類ノ非想天則 EXPERT
                location.assign('?achv=100.46&bs=170850&ts=385300&bj=65-2-0-0');
            }
            else {
                // Shake it! MASTER
                location.assign('?achv=99.96&bs=64050&ts=380850&bj=24-1-0-0');
            }
        };
        this.handleReset = (evt) => {
            evt.preventDefault();
            location.assign('?');
        };
        const queryParams = new URLSearchParams(location.search);
        const rawAchvArg = queryParams.get("ac" /* QueryParam.Achievement */) || queryParams.get("achv" /* QueryParam.AchievementOld */);
        const rawTotalScoreArg = queryParams.get("ts" /* QueryParam.TotalScore */);
        const rawBreakScoreArg = queryParams.get("bs" /* QueryParam.BreakScore */);
        const rawBreakJudgementsArg = queryParams.get("bj" /* QueryParam.BreakJudgement */);
        if (rawAchvArg && rawTotalScoreArg && rawBreakScoreArg && rawBreakJudgementsArg) {
            const achvArg = parseFloat(rawAchvArg);
            const totalScoreArg = parseInt(rawTotalScoreArg);
            const breakScoreArg = parseInt(rawBreakScoreArg);
            const breakJudgementTexts = rawBreakJudgementsArg.split('-');
            const breakJudgementNums = breakJudgementTexts.map((j) => parseInt(j, 10));
            if (achvArg > 0 &&
                totalScoreArg > 0 &&
                breakScoreArg >= 0 &&
                breakJudgementNums.length === 4) {
                this.state = {
                    initialFinaleAchvInput: rawAchvArg,
                    finaleAchv: achvArg,
                    initialTotalScoreInput: rawTotalScoreArg,
                    totalScore: totalScoreArg,
                    initialBreakScoreInput: rawBreakScoreArg,
                    breakScore: breakScoreArg,
                    initialBreakJudgementsInput: breakJudgementTexts,
                    breakJudgements: breakJudgementNums,
                };
                return;
            }
        }
        this.state = {
            initialFinaleAchvInput: '',
            finaleAchv: 0,
            initialTotalScoreInput: '',
            totalScore: 0,
            initialBreakScoreInput: '',
            breakScore: 0,
            initialBreakJudgementsInput: ['', '', '', ''],
            breakJudgements: [0, 0, 0, 0],
        };
    }
    render() {
        const { finaleAchv, initialFinaleAchvInput, totalScore, initialTotalScoreInput, breakScore, initialBreakScoreInput, breakJudgements, initialBreakJudgementsInput, } = this.state;
        const distByAchv = (0, finaleBacktracing_1.calculateDxAchvFromFinaleResult)(finaleAchv, totalScore, breakScore, breakJudgements);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("form", null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement("button", { onClick: this.handleFillExample }, "Fill example data"),
                    react_1.default.createElement("button", { onClick: this.handleReset }, "Reset")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("strong", null, "Finale Achievement:"),
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("input", { onChange: this.handleChangeFinaleAchv, defaultValue: initialFinaleAchvInput }),
                    "%"),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("strong", null, "Total Score:"),
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("input", { name: "totalScore", onChange: this.handleChangeTotalScore, defaultValue: initialTotalScoreInput })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("strong", null, "Break Score:"),
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("input", { name: "breakScore", defaultValue: initialBreakScoreInput, onChange: this.handleChangeTotalScore })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("strong", null, "Break Judgements:"),
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("div", { className: "judgementInputRow" },
                        react_1.default.createElement("div", { className: "judgementInputCol perfectJudgement" },
                            "Perfect",
                            react_1.default.createElement("br", null),
                            react_1.default.createElement("input", { className: "noteCount", name: "break_0", defaultValue: initialBreakJudgementsInput[0], onChange: this.handleChangeBreakJudgement })),
                        react_1.default.createElement("div", { className: "judgementInputCol greatJudgement" },
                            "Great",
                            react_1.default.createElement("br", null),
                            react_1.default.createElement("input", { className: "noteCount", name: "break_1", defaultValue: initialBreakJudgementsInput[1], onChange: this.handleChangeBreakJudgement })),
                        react_1.default.createElement("div", { className: "judgementInputCol goodJudgement" },
                            "Good",
                            react_1.default.createElement("br", null),
                            react_1.default.createElement("input", { className: "noteCount", defaultValue: initialBreakJudgementsInput[2], name: "break_2", onChange: this.handleChangeBreakJudgement })),
                        react_1.default.createElement("div", { className: "judgementInputCol missJudgement" },
                            "Miss",
                            react_1.default.createElement("br", null),
                            react_1.default.createElement("input", { className: "noteCount", name: "break_3", defaultValue: initialBreakJudgementsInput[3], onChange: this.handleChangeBreakJudgement }))))),
            react_1.default.createElement("div", { className: "resultHeading" },
                react_1.default.createElement("h3", null, this.getDxAchvRange(distByAchv)),
                react_1.default.createElement("a", { href: this.getUrlForCurrentInput() }, "Link to this result")),
            Array.from(distByAchv.entries()).map(([dxAchv, dist], index) => (react_1.default.createElement(DxAchvDetails_1.DxAchvDetails, { key: index, dxAchv: dxAchv, breakDist: dist })))));
    }
    getDxAchvRange(distsByAchv) {
        if (!distsByAchv.size) {
            return `DX Achievement: ?`;
        }
        let first, last;
        for (const key of distsByAchv.keys()) {
            if (!first) {
                first = key;
            }
            last = key;
        }
        if (first === last)
            return `DX Achievement: ${first}%`;
        return parseFloat(first) < parseFloat(last)
            ? `DX Achievement Range: ${first}% - ${last}%`
            : `DX Achievement Range: ${last}% - ${first}%`;
    }
    getUrlForCurrentInput() {
        const { finaleAchv, totalScore, breakScore, breakJudgements } = this.state;
        return ('?' +
            new URLSearchParams({
                ["ac" /* QueryParam.Achievement */]: finaleAchv.toFixed(2),
                ["bs" /* QueryParam.BreakScore */]: breakScore.toString(),
                ["ts" /* QueryParam.TotalScore */]: totalScore.toString(),
                ["bj" /* QueryParam.BreakJudgement */]: breakJudgements.join('-'),
            }));
    }
}
exports.DxAchievementCalculator = DxAchievementCalculator;
