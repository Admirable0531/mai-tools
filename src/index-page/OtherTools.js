"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherTools = void 0;
const react_1 = __importDefault(require("react"));
const lang_react_1 = require("../common/lang-react");
const UIMessages = {
    ["zh-TW" /* Language.zh_TW */]: {
        otherToolsTitle: "其他工具 (不透過書籤使用的工具)",
        dxAchievement: "轉換舊筐分數為 DX 達成率",
        ratingVisualizer: "單曲 R 值圖表",
    },
    ["en-US" /* Language.en_US */]: {
        otherToolsTitle: "Other tools (these are not part of bookmarklets)",
        dxAchievement: "Convert FiNALE score to DX achievement",
        ratingVisualizer: "Rating Lookup Table & Visualization",
    },
    ["ko-KR" /* Language.ko_KR */]: {
        otherToolsTitle: "다른 도구들 (북마크에 포함되지 않은 도구들)",
        dxAchievement: "FiNALE 점수 -> DX 정확도 변환",
        ratingVisualizer: "레이팅 점수표 & 시각화",
    },
};
const OtherTools = () => {
    const messages = UIMessages[(0, lang_react_1.useLanguage)()];
    return (react_1.default.createElement("div", { className: "otherToolsContainer" },
        react_1.default.createElement("hr", { className: "sectionSep" }),
        react_1.default.createElement("h2", { className: "otherToolsHeading" }, messages.otherToolsTitle),
        react_1.default.createElement("ul", null,
            react_1.default.createElement("li", { className: "toolItem" },
                react_1.default.createElement("a", { href: "./rating-visualizer/", target: "_blank" }, messages.ratingVisualizer)),
            react_1.default.createElement("li", { className: "toolItem" },
                react_1.default.createElement("a", { href: "./dx-achievement/", target: "_blank" }, messages.dxAchievement)))));
};
exports.OtherTools = OtherTools;
