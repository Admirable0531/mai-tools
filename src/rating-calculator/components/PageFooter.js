"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageFooter = void 0;
const react_1 = __importDefault(require("react"));
class PageFooter extends react_1.default.PureComponent {
    render() {
        return (react_1.default.createElement("footer", null,
            "Made by",
            " ",
            react_1.default.createElement("a", { className: "authorLink", href: "https://github.com/myjian/" }, "myjian"),
            "."));
    }
}
exports.PageFooter = PageFooter;
