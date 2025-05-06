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
exports.LanguageChooser = void 0;
const react_1 = __importStar(require("react"));
const lang_1 = require("../../common/lang");
const LangText = {
    ["zh-TW" /* Language.zh_TW */]: '繁體中文',
    ["en-US" /* Language.en_US */]: 'English',
    ["ko-KR" /* Language.ko_KR */]: '한국어',
};
const LanguageChooser = ({ activeLanguage, changeLanguage }) => {
    const handleChange = (0, react_1.useCallback)((evt) => {
        changeLanguage(evt.currentTarget.value);
    }, [changeLanguage]);
    return (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", null,
            react_1.default.createElement("label", { htmlFor: "languageSelect" }, "\uD83C\uDF10 \u4ECB\u9762\u8A9E\u8A00 (Language)\uFF1A")),
        react_1.default.createElement("td", null,
            react_1.default.createElement("select", { id: "languageSelect", onChange: handleChange, value: activeLanguage }, lang_1.SUPPORTED_LANGUAGES.map((lang) => {
                const langText = LangText[lang];
                return (react_1.default.createElement("option", { key: lang, value: lang }, langText));
            })))));
};
exports.LanguageChooser = LanguageChooser;
