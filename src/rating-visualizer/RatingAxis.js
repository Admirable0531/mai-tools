"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingAxis = void 0;
const react_1 = __importDefault(require("react"));
/**
 * The y-axis displaying the rating values.
 */
const RatingAxis = ({ step, maxRating, heightUnit, containerHeight, onClick, }) => {
    const containerStyle = {
        height: containerHeight + "px",
    };
    const values = [];
    // values should include maxRating
    for (let r = 0; r < maxRating + step; r += step) {
        values.push(r);
    }
    return (react_1.default.createElement("div", { className: "axisLabelContainer", style: containerStyle, onClick: onClick }, values.map((v) => (react_1.default.createElement(AxisLabel, { key: v, value: v, heightUnit: heightUnit })))));
};
exports.RatingAxis = RatingAxis;
const AxisLabel = ({ value, heightUnit }) => {
    const childStyle = { bottom: value * heightUnit + "px" };
    return (react_1.default.createElement("div", { className: "axisLabel", style: childStyle },
        react_1.default.createElement("span", { className: "axisLabelText" }, value)));
};
