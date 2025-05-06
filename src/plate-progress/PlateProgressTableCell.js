"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlateProgressTableCell = void 0;
const react_1 = __importStar(require("react"));
const difficulties_1 = require("../common/difficulties");
function PlateProgressTableCell(props) {
    const { onClick, plateType } = props;
    const handleClick = (0, react_1.useCallback)(() => {
        if (plateType) {
            onClick(plateType, props.d);
        }
    }, []);
    const handleKeyDown = (0, react_1.useCallback)((evt) => {
        if (evt.ctrlKey || evt.altKey || evt.metaKey || evt.shiftKey) {
            return;
        }
        if (evt.key === 'Enter' || evt.key == ' ') {
            evt.preventDefault();
            handleClick();
        }
    }, []);
    const clickableProps = plateType && onClick
        ? {
            onClick: handleClick,
            onKeyDown: handleKeyDown,
            tabIndex: 0,
        }
        : {};
    return props.useTh ? (react_1.default.createElement("th", Object.assign({ className: (0, difficulties_1.getDifficultyClassName)(props.d) }, clickableProps), props.value)) : (react_1.default.createElement("td", Object.assign({ className: props.className }, clickableProps), props.value));
}
exports.PlateProgressTableCell = PlateProgressTableCell;
