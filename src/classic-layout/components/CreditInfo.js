"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditInfo = void 0;
const react_1 = __importDefault(require("react"));
class CreditInfo extends react_1.default.PureComponent {
    render() {
        return (react_1.default.createElement("div", { className: "credit" },
            react_1.default.createElement("span", { className: "madeBy" }, "Made by "),
            react_1.default.createElement("a", { className: "authorLink", href: "https://github.com/myjian", target: "_blank" }, "myjian"),
            "."));
    }
}
exports.CreditInfo = CreditInfo;
