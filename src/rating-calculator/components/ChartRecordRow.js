"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartRecordRow = void 0;
const react_1 = __importDefault(require("react"));
const SCORE_RECORD_ROW_CLASSNAME = 'scoreRecordRow';
const SCORE_RECORD_CELL_BASE_CLASSNAME = 'scoreRecordCell';
const ACHV_CELL_CLASSNAME = 'achievementCell';
const SCORE_RECORD_CELL_CLASSNAMES = {
    [0 /* ColumnType.NO */]: 'orderCell',
    [1 /* ColumnType.SONG_TITLE */]: 'songTitleCell',
    [2 /* ColumnType.CHART_TYPE */]: 'chartTypeCell',
    [3 /* ColumnType.LEVEL */]: 'levelCell',
    [4 /* ColumnType.ACHIEVEMENT */]: ACHV_CELL_CLASSNAME,
    [5 /* ColumnType.RANK */]: 'rankCell',
    [6 /* ColumnType.NEXT_RANK */]: 'rankCell',
    [7 /* ColumnType.RATING */]: 'ratingCell',
    [8 /* ColumnType.NEXT_RATING */]: 'nextRatingCell',
};
class ChartRecordRow extends react_1.default.PureComponent {
    render() {
        const { columns, isHeading, renderCell, onClickCell } = this.props;
        let className = SCORE_RECORD_ROW_CLASSNAME;
        if (this.props.className) {
            className += ' ' + this.props.className;
        }
        return (react_1.default.createElement("tr", { className: className }, columns.map((v, index) => {
            const columnClassName = SCORE_RECORD_CELL_CLASSNAMES[v];
            let className = SCORE_RECORD_CELL_BASE_CLASSNAME + ' ' + columnClassName;
            const children = renderCell(v);
            const clickProps = onClickCell
                ? {
                    tabIndex: 0,
                    onClick: () => onClickCell(index),
                    onKeyDown: (evt) => {
                        if (evt.key === 'Enter') {
                            onClickCell(index);
                        }
                    },
                }
                : {};
            if (isHeading) {
                return (react_1.default.createElement("th", Object.assign({ key: index, className: className }, clickProps), children));
            }
            return (react_1.default.createElement("td", Object.assign({ key: index, className: className }, clickProps), children));
        })));
    }
}
exports.ChartRecordRow = ChartRecordRow;
