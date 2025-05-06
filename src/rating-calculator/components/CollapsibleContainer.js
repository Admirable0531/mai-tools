"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleContainer = void 0;
require("../css/collapsible-container.css");
const react_1 = __importDefault(require("react"));
class CollapsibleContainer extends react_1.default.PureComponent {
    render() {
        let className = 'collapsibleContainer';
        if (this.props.className) {
            className += ' ' + this.props.className;
        }
        if (this.props.hidden) {
            className += ' hidden';
        }
        return react_1.default.createElement("div", { className: className }, this.props.children);
    }
}
exports.CollapsibleContainer = CollapsibleContainer;
