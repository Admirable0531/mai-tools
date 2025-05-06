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
exports.VersionSelect = void 0;
const react_1 = __importStar(require("react"));
const game_version_1 = require("../../common/game-version");
const magic_api_1 = require("../../common/infra/magic-api");
const lang_react_1 = require("../../common/lang-react");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        gameVer: 'Game version:',
        dataSource: 'Chart data source:',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        gameVer: '遊戲版本：',
        dataSource: '譜面定數來源：',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        gameVer: '게임 버전：',
        dataSource: '게임 데이터 소스：',
    },
};
const VersionSelect = ({ gameVer, handleVersionSelect }) => {
    const handleChange = (0, react_1.useCallback)((evt) => {
        handleVersionSelect(parseInt(evt.currentTarget.value));
    }, [handleVersionSelect]);
    const messages = MessagesByLang[(0, lang_react_1.useLanguage)()];
    return (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", null,
            react_1.default.createElement("label", { htmlFor: "versionSelect" }, messages.gameVer)),
        react_1.default.createElement("td", null,
            react_1.default.createElement("select", { id: "versionSelect", onChange: handleChange, value: gameVer }, magic_api_1.RATING_CALCULATOR_SUPPORTED_VERSIONS.map((ver) => {
                const verStr = ver.toFixed(0);
                return (react_1.default.createElement("option", { key: verStr, value: verStr }, (0, game_version_1.getVersionName)(ver)));
            })),
            react_1.default.createElement("span", null,
                messages.dataSource,
                ' ',
                gameVer >= 23 /* GameVersion.PRiSM */ ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("a", { href: "https://arcade-songs.zetaraku.dev/maimai/about/", target: "_blank" }, "zetaraku"),
                    ' ',
                    "&",
                    ' ',
                    react_1.default.createElement("a", { href: "https://github.com/zvuc/otoge-db", target: "_blank" }, "otoge-db"))) : (react_1.default.createElement("a", { href: "https://sgimera.github.io/mai_RatingAnalyzer/", target: "_blank" }, "sgimera"))))));
};
exports.VersionSelect = VersionSelect;
