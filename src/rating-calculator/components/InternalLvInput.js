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
exports.parseInternalLvInput = exports.InternalLvInput = void 0;
const react_1 = __importStar(require("react"));
const difficulties_1 = require("../../common/difficulties");
const lang_react_1 = require("../../common/lang-react");
const user_preference_1 = require("../../common/user-preference");
const common_messages_1 = require("../common-messages");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        internalLvHeading: 'Chart Internal Level Data',
        manualInput: 'Manual input',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        internalLvHeading: '譜面定數',
        manualInput: '手動輸入',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        internalLvHeading: '채보 상수 데이터',
        manualInput: '직접입력',
    },
};
const InternalLvInput = () => {
    const savedValue = (0, user_preference_1.loadUserPreference)("internalLvOverride" /* UserPreference.InternalLvOverride */) || '';
    const [showTextarea, setShowTextarea] = (0, react_1.useState)(savedValue.length > 0);
    const handleShowTextarea = (0, react_1.useCallback)((evt) => {
        setShowTextarea(evt.currentTarget.checked);
    }, [showTextarea]);
    const lang = (0, lang_react_1.useLanguage)();
    const commonMessages = common_messages_1.CommonMessages[lang];
    const messages = MessagesByLang[lang];
    return (react_1.default.createElement("div", { className: "w90" },
        react_1.default.createElement("h2", { className: "lvInputHeading" }, messages.internalLvHeading),
        react_1.default.createElement("form", null,
            react_1.default.createElement("label", { className: "radioLabel" },
                react_1.default.createElement("input", { name: "showLvInput", type: "checkbox", checked: showTextarea, onChange: handleShowTextarea }),
                ' ',
                messages.manualInput)),
        showTextarea && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("p", null,
                commonMessages.example,
                ":",
                react_1.default.createElement("br", null),
                react_1.default.createElement("code", { style: { color: '#cc6900' } },
                    "VIIIbit Explorer##std##exp##12.9",
                    react_1.default.createElement("br", null),
                    "INTERNET OVERDOSE##dx##mas##13.5",
                    react_1.default.createElement("br", null),
                    "\u30D5\u30A9\u30CB\u30A4##dx##rem##13.3")),
            react_1.default.createElement("textarea", { id: "lvInput", className: "lvInput", defaultValue: savedValue })))));
};
exports.InternalLvInput = InternalLvInput;
function parseInternalLvInput(input) {
    return input
        .split('\n')
        .map((line) => {
        const props = {};
        const parts = line.trim().split('##');
        if (parts.length != 4) {
            if (parts[0].length > 0) {
                // title, chart type, difficulty, internal level
                console.warn(`Skip malformed line "${line}"`);
            }
            return null;
        }
        const difficulty = (0, difficulties_1.getDifficultyFromShortName)(parts[2]);
        if (difficulty < 0 || difficulty > 4 /* Difficulty.ReMASTER */) {
            console.warn(`"${line}" contains invalid difficulty "${parts[2]}"`);
            return null;
        }
        const level = parseFloat(parts[3]);
        if (!(level > 0)) {
            // We intentionally use > 0 rather than <= 0 to handle NaN
            console.warn(`"${line}" contains invalid level "${parts[3]}"`);
            return;
        }
        props.name = parts[0].trim();
        props.dx = parts[1].toLowerCase() === 'dx' ? 1 /* ChartType.DX */ : 0 /* ChartType.STANDARD */;
        props.lv = difficulties_1.DIFFICULTIES.map((_, idx) => (idx === difficulty ? level : NaN));
        return props;
    })
        .filter((props) => props != null);
}
exports.parseInternalLvInput = parseInternalLvInput;
