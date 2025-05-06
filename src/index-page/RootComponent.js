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
exports.RootComponent = void 0;
const react_1 = __importStar(require("react"));
const LangSwitcher_1 = require("../common/components/LangSwitcher");
const lang_1 = require("../common/lang");
const lang_react_1 = require("../common/lang-react");
const Bookmarklets_1 = require("./Bookmarklets");
const OtherTools_1 = require("./OtherTools");
const UIMessages = {
    ["zh-TW" /* Language.zh_TW */]: { pageTitle: "mai-tools 介紹" },
    ["en-US" /* Language.en_US */]: { pageTitle: "mai-tools index" },
    ["ko-KR" /* Language.ko_KR */]: { pageTitle: "mai-tools 소개" },
};
const RootComponent = () => {
    const lang = (0, lang_1.getInitialLanguage)();
    const messages = UIMessages[lang];
    (0, react_1.useEffect)(() => {
        document.title = messages.pageTitle;
    }, [lang]);
    return (react_1.default.createElement(lang_react_1.LangContext.Provider, { value: lang },
        react_1.default.createElement("br", null),
        react_1.default.createElement(LangSwitcher_1.LangSwitcher, null),
        react_1.default.createElement(Bookmarklets_1.Bookmarklets, null),
        react_1.default.createElement(OtherTools_1.OtherTools, null),
        react_1.default.createElement("div", { className: "footer" },
            react_1.default.createElement("hr", null),
            "Made by",
            " ",
            react_1.default.createElement("a", { className: "authorLink", href: "https://github.com/myjian", target: "_blank" }, "myjian"),
            ".")));
};
exports.RootComponent = RootComponent;
