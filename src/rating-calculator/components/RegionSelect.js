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
exports.RegionSelect = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        gameVer: 'Game region:',
        japan: 'Japan',
        international: 'International',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        gameVer: '遊戲區域：',
        japan: '日本',
        international: '國際',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        gameVer: '게임 지역：',
        japan: '일본',
        international: '국제',
    },
};
const RegionSelect = ({ gameRegion, handleRegionSelect }) => {
    const handleChange = (0, react_1.useCallback)((evt) => {
        const region = evt.currentTarget.value;
        handleRegionSelect(region);
    }, [handleRegionSelect]);
    const messages = MessagesByLang[(0, lang_react_1.useLanguage)()];
    return (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", null,
            react_1.default.createElement("label", { htmlFor: "regionSelect" }, messages.gameVer)),
        react_1.default.createElement("td", null,
            react_1.default.createElement("select", { id: "regionSelect", onChange: handleChange, value: gameRegion },
                react_1.default.createElement("option", { value: "jp" /* GameRegion.Jp */ }, messages.japan),
                react_1.default.createElement("option", { value: "intl" /* GameRegion.Intl */ }, messages.international)))));
};
exports.RegionSelect = RegionSelect;
