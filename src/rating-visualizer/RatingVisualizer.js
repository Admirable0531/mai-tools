"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingVisualizer = void 0;
const react_1 = __importDefault(require("react"));
const IntervalLines_1 = require("./IntervalLines");
const LvRatingContainer_1 = require("./LvRatingContainer");
const RatingAxis_1 = require("./RatingAxis");
class RatingVisualizer extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.removeIntervalTimeout = 0;
        this.state = {};
        this.highlightInterval = (minRt, maxRt) => {
            const curItvl = this.state.highlightInterval;
            if (curItvl && curItvl[0] === minRt && curItvl[1] === maxRt) {
                this.removeHighlightInterval();
            }
            else {
                this.setState({ highlightInterval: [minRt, maxRt] });
            }
        };
        this.removeHighlightInterval = () => {
            this.removeIntervalTimeout = window.setTimeout(() => {
                this.setState({ highlightInterval: undefined });
                this.removeIntervalTimeout = 0;
            }, 0);
        };
        this.cancelRemoveHighlightInterval = () => {
            if (this.removeIntervalTimeout) {
                clearTimeout(this.removeIntervalTimeout);
                this.removeIntervalTimeout = 0;
            }
        };
    }
    render() {
        const { axisLabelStep, canZoomIn, onSetRange, heightUnit, levels, maxRating, ranks } = this.props;
        const { highlightInterval } = this.state;
        const containerHeight = this.getContainerHeight();
        if (!heightUnit) {
            return null;
        }
        return (react_1.default.createElement("div", { className: "container", onBlur: this.removeHighlightInterval, onFocus: this.cancelRemoveHighlightInterval, tabIndex: -1 },
            react_1.default.createElement("div", { className: "ratingContainer" },
                react_1.default.createElement(RatingAxis_1.RatingAxis, { maxRating: maxRating, heightUnit: heightUnit, containerHeight: containerHeight, step: axisLabelStep, onClick: this.removeHighlightInterval }),
                levels.map((lv, i) => {
                    return (react_1.default.createElement(LvRatingContainer_1.LvRatingContainer, { key: i, canZoomIn: canZoomIn, lvTitle: lv.title, minLv: lv.minLv, maxLv: lv.maxLv, heightUnit: heightUnit, containerHeight: containerHeight, ranks: ranks, onZoomIn: onSetRange, highlightInterval: this.highlightInterval }));
                }),
                highlightInterval && (react_1.default.createElement(IntervalLines_1.IntervalLines, { interval: highlightInterval, heightUnit: heightUnit, onClick: this.removeHighlightInterval })))));
    }
    getContainerHeight() {
        const { axisLabelStep, maxRating, heightUnit, topPadding } = this.props;
        return (maxRating + axisLabelStep) * heightUnit + topPadding;
    }
}
exports.RatingVisualizer = RatingVisualizer;
