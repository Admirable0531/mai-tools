"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkItem = void 0;
const react_1 = __importDefault(require("react"));
const lang_react_1 = require("../common/lang-react");
const BookmarkItem = (props) => {
    const lang = (0, lang_react_1.useLanguage)();
    const { id, itemTitleByLang, featureByLang, howToByLang, screenshotUrl } = props;
    return (react_1.default.createElement("div", { className: "bookmarklet", id: id },
        react_1.default.createElement("div", { className: "bookmarkletText" },
            react_1.default.createElement("h3", { className: "bookmarkletTitle" }, itemTitleByLang[lang]),
            react_1.default.createElement("ul", null,
                react_1.default.createElement("li", null, featureByLang[lang]),
                react_1.default.createElement("li", null, howToByLang[lang]))),
        react_1.default.createElement("div", { className: "bookmarkletImage" },
            react_1.default.createElement("img", { className: "screenshot", alt: "screenshot", src: screenshotUrl }))));
};
exports.BookmarkItem = BookmarkItem;
