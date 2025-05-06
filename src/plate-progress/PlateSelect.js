"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlateSelect = void 0;
const react_1 = __importDefault(require("react"));
function PlateSelect(props) {
    if (!props.versionInfo) {
        return (react_1.default.createElement("select", null,
            react_1.default.createElement("option", { value: "" }, "== Plate Name ===")));
    }
    const { plate_name } = props.versionInfo;
    return (react_1.default.createElement("select", { onChange: props.onChange },
        react_1.default.createElement("option", { value: "" }, "== Plate Name ==="),
        plate_name.CLEAR && react_1.default.createElement("option", { value: "CLEAR" }, plate_name.CLEAR),
        react_1.default.createElement("option", { value: "FC" }, plate_name.FC),
        plate_name.SSS && react_1.default.createElement("option", { value: "SSS" }, plate_name.SSS),
        react_1.default.createElement("option", { value: "FSD" }, plate_name.FSD),
        react_1.default.createElement("option", { value: "AP" }, plate_name.AP)));
}
exports.PlateSelect = PlateSelect;
