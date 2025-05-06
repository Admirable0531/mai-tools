"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangSwitcher = void 0;
const react_1 = __importDefault(require("react"));
const lang_1 = require("../lang");
const lang_react_1 = require("../lang-react");
const UIString = {
    ["zh-TW" /* Language.zh_TW */]: '繁體中文',
    ["en-US" /* Language.en_US */]: 'English',
    ["ko-KR" /* Language.ko_KR */]: '한국어',
};
function LangSwitcher() {
    const lang = (0, lang_react_1.useLanguage)();
    const handleClick = (evt) => {
        (0, lang_1.saveLanguage)(evt.currentTarget.dataset['lang']);
    };
    return (react_1.default.createElement("div", null,
        "\u8A9E\u8A00 (Language)\uFF1A",
        lang_1.SUPPORTED_LANGUAGES.map((otherLang) => (react_1.default.createElement(react_1.default.Fragment, { key: otherLang },
            otherLang === lang ? (UIString[otherLang]) : (react_1.default.createElement("a", { href: `?${"hl" /* QueryParam.HostLanguage */}=${otherLang}`, "data-lang": otherLang, onClick: handleClick }, UIString[otherLang])),
            "\u00A0")))));
}
exports.LangSwitcher = LangSwitcher;
