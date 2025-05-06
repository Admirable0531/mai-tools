"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookmarklets = void 0;
const react_1 = __importDefault(require("react"));
const lang_react_1 = require("../common/lang-react");
const all_bookmarklets_1 = require("./all-bookmarklets");
const BookmarkItem_1 = require("./BookmarkItem");
const MobileCreateManual_1 = require("./MobileCreateManual");
const MobileUseManual_1 = require("./MobileUseManual");
const PCManual_1 = require("./PCManual");
const UIMessages = {
    ["zh-TW" /* Language.zh_TW */]: {
        title: 'maimai 小工具介紹與設定教學',
        intro1: '如果想在 maimai DX NET 使用以下功能，請參照 ',
        howto: '使用教學',
        intro2: ' 設定書籤小工具。',
        features: '功能介紹',
    },
    ["en-US" /* Language.en_US */]: {
        title: 'mai-tools homepage (Features & How to use)',
        intro1: 'If you want to use the following features, follow ',
        howto: 'Instructions',
        intro2: ' to set up the bookmarklet.',
        features: 'Features',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        title: 'maimai 책갈피 (기능 및 사용법)',
        intro1: 'maimai DX NET 에서 해당 기능을 사용하고 싶으면 아래 적힌 ',
        howto: '사용법',
        intro2: '을 따라주세요.',
        features: '기능',
    },
};
const Bookmarklets = () => {
    const messages = UIMessages[(0, lang_react_1.useLanguage)()];
    // NOTE: id is used by other pages to link to this section. Do not remove.
    return (react_1.default.createElement("div", { id: "bookmarklets" },
        react_1.default.createElement("h2", null, messages.title),
        react_1.default.createElement("p", null,
            messages.intro1,
            react_1.default.createElement("a", { href: "#howto" }, messages.howto),
            messages.intro2),
        react_1.default.createElement("div", { className: "bookmarkletList" },
            all_bookmarklets_1.ALL_BOOKMARKLETS.map((bookmarklet, idx) => (react_1.default.createElement(BookmarkItem_1.BookmarkItem, Object.assign({ key: idx }, bookmarklet)))),
            react_1.default.createElement("br", null),
            react_1.default.createElement("div", null,
                react_1.default.createElement("h2", { id: "howto" }, messages.howto),
                react_1.default.createElement(PCManual_1.PCManual, null),
                react_1.default.createElement(MobileCreateManual_1.MobileCreateManual, null),
                react_1.default.createElement(MobileUseManual_1.MobileUseManual, null)))));
};
exports.Bookmarklets = Bookmarklets;
