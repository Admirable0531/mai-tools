"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankDistributionDataRow = void 0;
const react_1 = __importDefault(require("react"));
const RankDistributionRow_1 = require("./RankDistributionRow");
exports.RankDistributionDataRow = react_1.default.memo((props) => {
    const values = [props.rowHead];
    for (const key of props.columns) {
        const count = props.rankDist.get(key);
        values.push(count || '-');
    }
    return (react_1.default.createElement(RankDistributionRow_1.RankDistributionRow, { values: values, rowClassname: props.rowClassname, baseCellClassname: props.baseCellClassname, perColumnClassnames: props.perColumnClassnames }));
});
