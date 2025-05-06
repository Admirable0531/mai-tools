"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartRecordsTable = void 0;
const react_1 = __importDefault(require("react"));
const ChartRecordDataRow_1 = require("./ChartRecordDataRow");
const ChartRecordHeadRow_1 = require("./ChartRecordHeadRow");
class ChartRecordsTable extends react_1.default.PureComponent {
    render() {
        const { columns, sortBy, records, isCandidate } = this.props;
        let { tableClassname } = this.props;
        tableClassname += ' songRecordTable';
        return (react_1.default.createElement("table", { className: tableClassname },
            react_1.default.createElement("thead", null,
                react_1.default.createElement(ChartRecordHeadRow_1.ChartRecordHeadRow, { sortBy: sortBy, columns: columns })),
            react_1.default.createElement("tbody", null, records.map((r, index) => {
                index = r.order || index + 1;
                return (react_1.default.createElement(ChartRecordDataRow_1.ChartRecordDataRow, { record: r, columns: columns, key: index, index: index, isCandidate: isCandidate }));
            }))));
    }
}
exports.ChartRecordsTable = ChartRecordsTable;
