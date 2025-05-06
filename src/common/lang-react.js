"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLanguage = exports.LangContext = void 0;
const react_1 = require("react");
const lang_1 = require("./lang");
exports.LangContext = (0, react_1.createContext)((0, lang_1.getInitialLanguage)());
function useLanguage() {
    return (0, react_1.useContext)(exports.LangContext);
}
exports.useLanguage = useLanguage;
