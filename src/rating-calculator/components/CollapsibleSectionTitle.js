"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleSectionTitle = void 0;
const react_1 = __importDefault(require("react"));
class CollapsibleSectionTitle extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { symbolClassName: '' };
        this.handleClick = (evt) => {
            evt.preventDefault();
            this.props.onClick(evt);
        };
        this.handleKeyPress = (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
                evt.preventDefault();
                this.props.onClick(evt);
            }
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.contentHidden && !this.props.contentHidden) {
            this.setState({ symbolClassName: 'cSecShow' });
            window.setTimeout(() => {
                this.setState({ symbolClassName: '' });
            }, 300);
        }
    }
    render() {
        const { isCandidateList, contentHidden, title } = this.props;
        let { symbolClassName } = this.state;
        const symbol = isCandidateList ? '▷' : '▶';
        symbolClassName += ' cSecTitleSymbol';
        if (contentHidden) {
            symbolClassName += ' cSecHidden';
        }
        return (react_1.default.createElement("h3", { className: "cSecTitleContainer" },
            react_1.default.createElement("span", { className: "cSecTitle", tabIndex: 0, onClick: this.handleClick, onKeyDown: this.handleKeyPress },
                react_1.default.createElement("span", { className: symbolClassName }, symbol),
                title)));
    }
}
exports.CollapsibleSectionTitle = CollapsibleSectionTitle;
