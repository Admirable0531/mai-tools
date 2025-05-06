"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateAndPlace = void 0;
const react_1 = __importDefault(require("react"));
class DateAndPlace extends react_1.default.PureComponent {
    render() {
        const { actualPlace, date, isDxMode } = this.props;
        const place = isDxMode ? actualPlace : 'CAFE MiLK';
        return (react_1.default.createElement("div", { className: "dateAndPlace" },
            react_1.default.createElement("div", { className: "date" }, date),
            react_1.default.createElement("button", { className: "place", onClick: this.props.toggleDxMode }, place)));
    }
}
exports.DateAndPlace = DateAndPlace;
