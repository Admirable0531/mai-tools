"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvRatingContainer = void 0;
const react_1 = __importDefault(require("react"));
const LvLabel_1 = require("./LvLabel");
const LvRankRatingSegment_1 = require("./LvRankRatingSegment");
class LvRatingContainer extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.handleLabelClick = () => {
            const { lvTitle } = this.props;
            this.props.onZoomIn(lvTitle, lvTitle);
        };
    }
    render() {
        const { canZoomIn, lvTitle, minLv, maxLv, heightUnit, containerHeight, ranks } = this.props;
        const style = {
            height: containerHeight + 'px',
        };
        return (react_1.default.createElement("div", { className: "lvRatingContainer", style: style },
            react_1.default.createElement(LvLabel_1.LvLabel, { title: lvTitle, onClick: this.handleLabelClick, canZoomIn: canZoomIn }),
            heightUnit
                ? ranks.map((rank, idx) => {
                    const maxAchv = rank.maxAchv || (idx === 0 ? rank.minAchv : ranks[idx - 1].minAchv - 0.0001);
                    return (react_1.default.createElement(LvRankRatingSegment_1.LvRankRatingSegment, { key: rank.title, minLv: minLv, maxLv: maxLv, minAchv: rank.minAchv, maxAchv: maxAchv, minFactor: rank.factor, maxFactor: rank.maxFactor || rank.factor, heightUnit: heightUnit, title: rank.title, highlightInterval: this.props.highlightInterval }));
                })
                : null));
    }
}
exports.LvRatingContainer = LvRatingContainer;
