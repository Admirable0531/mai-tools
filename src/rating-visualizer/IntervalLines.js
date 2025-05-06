"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervalLines = void 0;
const react_1 = __importDefault(require("react"));
class IntervalLines extends react_1.default.PureComponent {
    render() {
        const { interval, heightUnit, onClick } = this.props;
        const isCollapsed = interval[0] === interval[1];
        let lowLabelBottom, highLabelBottom;
        const lowLineBottom = lowLabelBottom = (interval[0] - 0.5) * heightUnit - 1;
        const highLineBottom = highLabelBottom = (interval[1] + 0.5) * heightUnit;
        const lowLineStyle = { bottom: lowLineBottom + "px" };
        const highLineStyle = { bottom: highLineBottom + "px" };
        if (isCollapsed) {
            lowLabelBottom += 4;
        }
        else if (highLabelBottom - lowLabelBottom < 14) {
            highLabelBottom += 2;
            lowLabelBottom -= 5;
        }
        const lowLabelStyle = { bottom: lowLabelBottom + "px" };
        const highLabelStyle = { bottom: highLabelBottom + "px" };
        return (react_1.default.createElement("div", { onClick: onClick },
            react_1.default.createElement("div", { className: "intervalBoundary", style: highLineStyle }),
            react_1.default.createElement("div", { className: "intervalBoundary", style: lowLineStyle }),
            react_1.default.createElement("div", { className: "intervalLabel", style: lowLabelStyle },
                react_1.default.createElement("span", { className: "intervalLabelText axisLabelText" }, interval[0])),
            !isCollapsed && (react_1.default.createElement("div", { className: "intervalLabel", style: highLabelStyle },
                react_1.default.createElement("span", { className: "intervalLabelText axisLabelText" }, interval[1])))));
    }
}
exports.IntervalLines = IntervalLines;
