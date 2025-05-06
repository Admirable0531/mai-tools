"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankDistributionRow = void 0;
const react_1 = __importDefault(require("react"));
class RankDistributionRow extends react_1.default.PureComponent {
    render() {
        const { values, isHeading, rowClassname, baseCellClassname, perColumnClassnames } = this.props;
        return (react_1.default.createElement("tr", { className: rowClassname }, values.map((v, index) => {
            const useTh = isHeading || index === 0;
            let className = baseCellClassname;
            if (perColumnClassnames[index]) {
                className += " " + perColumnClassnames[index];
            }
            if (useTh) {
                return react_1.default.createElement("th", { key: index, className: className }, v);
            }
            return react_1.default.createElement("td", { key: index, className: className }, v);
        })));
    }
}
exports.RankDistributionRow = RankDistributionRow;
