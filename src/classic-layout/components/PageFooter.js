"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageFooter = void 0;
const react_1 = __importDefault(require("react"));
class PageFooter extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.handleClick = (evt) => {
            evt.preventDefault();
            window.close();
        };
    }
    render() {
        return (react_1.default.createElement("div", { className: "pageFooter" },
            react_1.default.createElement("a", { className: "closePage", href: "#", onClick: this.handleClick }, "\u623B\u308B")));
    }
}
exports.PageFooter = PageFooter;
