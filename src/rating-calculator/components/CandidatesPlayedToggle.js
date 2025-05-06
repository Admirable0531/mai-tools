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
exports.CandidatesPlayedToggle = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        showPlayed: 'Show played charts',
        showNotPlayed: 'Show not yet played charts',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        showPlayed: '顯示已玩過的譜面',
        showNotPlayed: '顯示未玩過的譜面',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        showPlayed: '플레이한 채보 보기',
        showNotPlayed: '플레이 한 적 없는 채보 보기',
    },
};
const CandidatesPlayedToggle = ({ name, showPlayed, toggleShowPlayed }) => {
    const handleRadioChange = (0, react_1.useCallback)((evt) => {
        toggleShowPlayed(evt.currentTarget.value === '1');
    }, [toggleShowPlayed]);
    const messages = MessagesByLang[(0, lang_react_1.useLanguage)()];
    return (react_1.default.createElement("div", { className: "w90" },
        react_1.default.createElement("form", { className: "playedToggleForm" },
            react_1.default.createElement("label", { className: "radioLabel" },
                react_1.default.createElement("input", { className: "radioInput", name: `showPlayed-${name}`, value: "1", type: "radio", checked: showPlayed, onChange: handleRadioChange }),
                messages.showPlayed),
            react_1.default.createElement("label", { className: "radioLabel" },
                react_1.default.createElement("input", { className: "radioInput", name: `showPlayed-${name}`, value: "0", type: "radio", checked: !showPlayed, onChange: handleRadioChange }),
                messages.showNotPlayed))));
};
exports.CandidatesPlayedToggle = CandidatesPlayedToggle;
