"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextRankInfo = void 0;
const react_1 = __importDefault(require("react"));
class NextRankInfo extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { showTitle: false };
    }
    render() {
        const { nextRank, showTitle } = this.props;
        const nextRankTitle = (showTitle && nextRank) ? nextRank.title : "";
        const nextRankDiff = this.getNextRankDiff();
        return (react_1.default.createElement("tr", { className: "nextRank" },
            react_1.default.createElement("th", { className: "noRightBorder", colSpan: 4 }, "NEXT RANK"),
            react_1.default.createElement("td", { className: "noLeftBorder", colSpan: 2 },
                nextRankTitle && react_1.default.createElement("span", { className: "nextRankTitle" }, nextRankTitle),
                nextRankDiff && react_1.default.createElement("span", { className: "nextRankDiff" }, nextRankDiff))));
    }
    getNextRankDiff() {
        const { nextRank } = this.props;
        if (!nextRank) {
            return "—————";
        }
        const { diff } = nextRank;
        if (typeof diff === "number") {
            if (Math.round(diff) !== diff) {
                return diff.toFixed(4) + "%";
            }
            return diff.toLocaleString("en");
        }
        return diff;
    }
}
exports.NextRankInfo = NextRankInfo;
