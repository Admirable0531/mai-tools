"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherTools = void 0;
const react_1 = __importDefault(require("react"));
const arcade_songs_1 = require("../../common/arcade-songs");
const lang_react_1 = require("../../common/lang-react");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        otherToolsHeading: 'Other Tools',
        dxRatingNet: 'DXRating.net',
        ratingVisualizer: 'Rating Lookup Table & Visualization',
        bookmarketList: 'mai-tools homepage (Features & How to use)',
        arcadeSongs: 'arcade-songs (Song searching tool) by Raku Zeta',
        otohime: 'Otohime (Personal score tracking) by KOINU',
        mapDistanceCalc: 'Map Distance Calculator (How many credits to a character/collection item) by 魚丸◎蕾娜',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        otherToolsHeading: '其他工具',
        dxRatingNet: 'DXRating.net',
        ratingVisualizer: '單曲 R 值圖表',
        bookmarketList: 'maimai 小工具介紹與設定教學',
        arcadeSongs: '音樂遊戲歌曲搜尋工具 arcade-songs (由 Raku Zeta 製作)',
        otohime: 'Otohime - 音 Game 成績單網站 (由 KOINU 製作)',
        mapDistanceCalc: 'ちほー道數計算器 (旅伴 & 收藏品) (由 魚丸◎蕾娜 製作)',
    },
    ["ko-KR" /* Language.ko_KR */]: {
        otherToolsHeading: '다른 도구',
        dxRatingNet: 'DXRating.net',
        ratingVisualizer: '레이팅 상수 표 & 시각화',
        bookmarketList: 'maimai 북마크 (기능 & 사용법)',
        arcadeSongs: 'arcade-songs (노래 검색기) by Raku Zeta',
        otohime: 'Otohime - (개인 레이팅 추적기) by KOINU',
        mapDistanceCalc: '지방 거리 계산기 (특정 캐릭터, 아이템 소장을 위해서 몇 코인 더 부어야 하는지) by 魚丸◎蕾娜',
    },
};
const OtherTools = ({ gameVer }) => {
    const messages = MessagesByLang[(0, lang_react_1.useLanguage)()];
    const visualizerLink = `../rating-visualizer/?gameVer=${gameVer}`;
    return (react_1.default.createElement("div", { className: "otherToolsContainer" },
        react_1.default.createElement("hr", { className: "sectionSep" }),
        react_1.default.createElement("h2", { className: "otherToolsHeading" }, messages.otherToolsHeading),
        react_1.default.createElement("ul", null,
            react_1.default.createElement("li", { className: "toolItem" },
                react_1.default.createElement("a", { href: "https://dxrating.net/rating", target: "_blank" }, messages.dxRatingNet)),
            react_1.default.createElement("li", { className: "toolItem" },
                react_1.default.createElement("a", { href: visualizerLink, target: "_blank" }, messages.ratingVisualizer)),
            react_1.default.createElement("li", { className: "toolItem" },
                react_1.default.createElement("a", { href: "..", target: "_blank" }, messages.bookmarketList)),
            react_1.default.createElement("li", { className: "toolItem" },
                react_1.default.createElement("a", { href: arcade_songs_1.MAIMAI_SONGS_HOME, target: "_blank" }, messages.arcadeSongs)),
            react_1.default.createElement("li", { className: "toolItem" },
                react_1.default.createElement("a", { href: "https://otohi.me/", target: "_blank" }, messages.otohime)),
            react_1.default.createElement("li", { className: "toolItem" },
                react_1.default.createElement("a", { href: "https://renawevin.weebly.com/rw-maimaidxsplash-chiho-calculate.html", target: "_blank" }, messages.mapDistanceCalc)))));
};
exports.OtherTools = OtherTools;
