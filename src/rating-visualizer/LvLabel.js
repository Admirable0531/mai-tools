"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvLabel = void 0;
const react_1 = __importDefault(require("react"));
class LvLabel extends react_1.default.PureComponent {
    render() {
        const { canZoomIn, onClick, title } = this.props;
        return (react_1.default.createElement("div", { className: "lvLabel" },
            react_1.default.createElement("div", { className: "lvLabelButtonContainer" },
                react_1.default.createElement("button", { className: "lvLabelButton", disabled: !canZoomIn, onClick: onClick }, title))));
    }
}
exports.LvLabel = LvLabel;
