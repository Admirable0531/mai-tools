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
exports.DebugActions = void 0;
const react_1 = __importStar(require("react"));
const magic_api_1 = require("../../common/infra/magic-api");
const lang_react_1 = require("../../common/lang-react");
const ClearCacheText = {
    ["en-US" /* Language.en_US */]: 'Clear cache',
    ["zh-TW" /* Language.zh_TW */]: '清除快取資料',
    ["ko-KR" /* Language.ko_KR */]: '캐시 삭제',
};
const DebugActions = () => {
    const handleClearCache = (0, react_1.useCallback)(() => {
        (0, magic_api_1.clearMagicCache)();
        window.location.reload();
    }, []);
    const lang = (0, lang_react_1.useLanguage)();
    const clearCacheText = ClearCacheText[lang];
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { className: "clearCacheBtn", onClick: handleClearCache }, clearCacheText)));
};
exports.DebugActions = DebugActions;
