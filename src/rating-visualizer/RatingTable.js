"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingTable = void 0;
const react_1 = __importDefault(require("react"));
class RatingTable extends react_1.default.PureComponent {
    render() {
        const { displayValue, levels, ranks } = this.props;
        return (react_1.default.createElement("table", { className: "lookupTable" },
            react_1.default.createElement("thead", { className: "lookupTableHead" },
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", { className: "lookupTopLeftCell" }),
                    ranks.map((r, idx) => (react_1.default.createElement("th", { key: idx }, r.title))))),
            react_1.default.createElement("tbody", { className: "lookupTableBody" }, levels
                .map((lv, idx) => {
                return (react_1.default.createElement("tr", { key: idx },
                    react_1.default.createElement("th", null, lv.title),
                    ranks.map((r, idx) => {
                        const maxAchv = idx === 0 ? r.minAchv : ranks[idx - 1].minAchv - 0.0001;
                        const minRating = Math.floor(lv.minLv * r.minAchv * r.factor);
                        if (displayValue === "MIN" /* DisplayValue.MIN */) {
                            return react_1.default.createElement("td", { key: idx }, minRating);
                        }
                        const maxRating = r.maxAchv && r.maxFactor
                            ? Math.floor(lv.maxLv * r.maxAchv * r.maxFactor)
                            : Math.floor(lv.maxLv * maxAchv * r.factor);
                        if (displayValue === "MAX" /* DisplayValue.MAX */) {
                            return react_1.default.createElement("td", { key: idx }, maxRating);
                        }
                        const text = minRating === maxRating ? minRating : `${maxRating} - ${minRating}`;
                        return react_1.default.createElement("td", { key: idx }, text);
                    })));
            })
                .reverse() // make highest level the first row
            )));
    }
}
exports.RatingTable = RatingTable;
