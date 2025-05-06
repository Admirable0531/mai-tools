"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionsInput = exports.LEVELS = void 0;
const react_1 = __importDefault(require("react"));
exports.LEVELS = [
    '15',
    '14+',
    '14',
    '13+',
    '13',
    '12+',
    '12',
    '11+',
    '11',
    '10+',
    '10',
];
class OptionsInput extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.handleChangeMinLv = (evt) => {
            const minLv = evt.currentTarget.value;
            const minLvIdx = exports.LEVELS.indexOf(minLv);
            const maxLvIdx = exports.LEVELS.indexOf(this.props.maxLv);
            this.props.onSetRange(minLv, exports.LEVELS[Math.min(minLvIdx, maxLvIdx)]);
        };
        this.handleChangeMaxLv = (evt) => {
            const maxLv = evt.currentTarget.value;
            const minLvIdx = exports.LEVELS.indexOf(this.props.minLv);
            const maxLvIdx = exports.LEVELS.indexOf(maxLv);
            this.props.onSetRange(exports.LEVELS[Math.max(minLvIdx, maxLvIdx)], maxLv);
        };
        this.handleChangeHeightUnit = (evt) => {
            const unit = parseInt(evt.currentTarget.value);
            this.props.onChangeUnit(unit);
        };
        this.handleChangeMinRank = (evt) => {
            this.props.onSetMinRank(evt.currentTarget.value);
        };
        this.handleChangeTableDisplay = (evt) => {
            this.props.onSetTableDisplay(evt.currentTarget.value);
        };
    }
    render() {
        const { heightUnit, minLv, minRank, maxLv, tableDisplay } = this.props;
        return (react_1.default.createElement("div", { className: "optionsContainer" },
            react_1.default.createElement("div", { className: "container", tabIndex: -1 },
                react_1.default.createElement("span", { className: "lvRangeLabelContainer" },
                    react_1.default.createElement("label", { className: "optionGroup" },
                        "Min\u00A0Lv:\u00A0",
                        react_1.default.createElement("select", { onChange: this.handleChangeMinLv, value: minLv }, this.renderLvOptions())),
                    react_1.default.createElement("label", { className: "optionGroup" },
                        "Max\u00A0Lv:\u00A0",
                        react_1.default.createElement("select", { onChange: this.handleChangeMaxLv, value: maxLv }, this.renderLvOptions()))),
                react_1.default.createElement("label", { className: "optionGroup" },
                    "Min Rank:\u00A0",
                    react_1.default.createElement("select", { onChange: this.handleChangeMinRank, value: minRank },
                        react_1.default.createElement("option", { value: "AAA" }, "AAA"),
                        react_1.default.createElement("option", { value: "S" }, "S"),
                        react_1.default.createElement("option", { value: "SS" }, "SS"),
                        react_1.default.createElement("option", { value: "SSS" }, "SSS"))),
                react_1.default.createElement("br", null),
                react_1.default.createElement("label", { className: "optionGroup" },
                    "Graph:\u00A0",
                    react_1.default.createElement("select", { onChange: this.handleChangeHeightUnit, value: heightUnit.toFixed(0) },
                        react_1.default.createElement("option", { value: "0" }, "Hide"),
                        react_1.default.createElement("option", { value: "3" }, "3x"),
                        react_1.default.createElement("option", { value: "4" }, "4x"),
                        react_1.default.createElement("option", { value: "5" }, "5x"),
                        react_1.default.createElement("option", { value: "8" }, "8x"),
                        react_1.default.createElement("option", { value: "12" }, "12x"))),
                react_1.default.createElement("label", { className: "optionGroup" },
                    "Table values:\u00A0",
                    react_1.default.createElement("select", { onChange: this.handleChangeTableDisplay, value: tableDisplay },
                        react_1.default.createElement("option", { value: "MIN" }, "MIN"),
                        react_1.default.createElement("option", { value: "MAX" }, "MAX"),
                        react_1.default.createElement("option", { value: "RANGE" }, "RANGE"))))));
    }
    renderLvOptions() {
        const options = [];
        for (let i = 0; i <= exports.LEVELS.length; i++) {
            const lv = exports.LEVELS[i];
            options.push(react_1.default.createElement("option", { key: i, value: lv }, lv));
        }
        return options;
    }
}
exports.OptionsInput = OptionsInput;
