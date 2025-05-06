"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankDistributionHeadRow = void 0;
const react_1 = __importDefault(require("react"));
const RankDistributionRow_1 = require("./RankDistributionRow");
const RankDistributionHeadRow = ({ firstCell, columns, baseCellClassname, perColumnClassnames, }) => {
    const values = [firstCell];
    for (const key of columns) {
        values.push(key);
    }
    return (react_1.default.createElement(RankDistributionRow_1.RankDistributionRow, { values: values, isHeading: true, baseCellClassname: baseCellClassname, perColumnClassnames: perColumnClassnames }));
};
exports.RankDistributionHeadRow = RankDistributionHeadRow;
