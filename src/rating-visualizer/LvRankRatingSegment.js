"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvRankRatingSegment = void 0;
const react_1 = __importDefault(require("react"));
class LvRankRatingSegment extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.minRt = 0;
        this.maxRt = 0;
        this.handleClick = () => {
            this.props.highlightInterval(this.minRt, this.maxRt);
        };
    }
    render() {
        const { minLv, minAchv, minFactor, maxLv, maxAchv, maxFactor, heightUnit, title } = this.props;
        this.minRt = Math.floor(minLv * minAchv * minFactor);
        this.maxRt = Math.floor(maxLv * maxAchv * maxFactor);
        const style = {
            bottom: (this.minRt - 0.5) * heightUnit + 'px',
            height: (this.maxRt - this.minRt + 1) * heightUnit + 'px',
        };
        const className = 'ratingSegment ' + 'segment' + title.replace('+', 'P');
        return (react_1.default.createElement("div", { className: className, style: style, title: this.hoverText(), tabIndex: 0, onClick: this.handleClick },
            react_1.default.createElement("div", { className: "ratingSegmentLabel" }, title)));
    }
    hoverText() {
        if (this.minRt < this.maxRt) {
            return `${this.minRt} - ${this.maxRt}`;
        }
        return this.maxRt.toString();
    }
}
exports.LvRankRatingSegment = LvRankRatingSegment;
