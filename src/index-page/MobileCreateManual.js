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
exports.MobileCreateManual = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../common/lang-react");
const all_bookmarklets_1 = require("./all-bookmarklets");
const MessagesByLang = {
    ["zh-TW" /* Language.zh_TW */]: {
        title: '在手機上怎麼新增書籤？',
        desc: '最簡單的方式，是先在電腦上新增書籤，再同步到手機上。如果不方便用電腦，請使用 Google Chrome 瀏覽器並執行以下步驟。',
        chrome1: '複製連結 (點我！)',
        chrome2: '打開瀏覽器右上角的選單，按星星把此頁加入書籤',
        chrome3: '畫面下方會顯示「已加入書籤」，點右邊「編輯」',
        chrome4: '把網址完全刪除，並貼上剛才複製的連結',
        chrome5: `把書籤的名稱設成「${all_bookmarklets_1.LinkNameByLang["zh-TW" /* Language.zh_TW */]}」（MMBL 是 MaiMai BookmarkLets 的縮寫，我們接下來會用到）`,
        chrome6: '返回上一頁，書籤即建立完成',
        chrome7: '書籤建立之後可以重複使用，不需要再回到這個網頁複製連結',
    },
    ["en-US" /* Language.en_US */]: {
        title: 'How to create bookmarklet on phone?',
        desc: 'Easiest way is to create the bookmarklet on PC and sync it to the phone. If it does not work, try the following steps for your browser.',
        chrome1: 'Copy the bookmarklet link (click me!)',
        chrome2: 'Tap the browser menu and tap the star to add current page to bookmarks.',
        chrome3: 'Screen bottom will show "Bookmarked". Tap the "Edit" link next to it.',
        chrome4: 'Replace the URL with what you copied earlier.',
        chrome5: `Set the bookmark name to "${all_bookmarklets_1.LinkNameByLang["en-US" /* Language.en_US */]}".`,
        chrome6: 'Go back to previous page and the bookmarklet should be ready to use.',
        chrome7: "Once you set up the bookmarklet, you can use it repeatedly. You don't need to come back to this page to copy links.",
    },
    ["ko-KR" /* Language.ko_KR */]: {
        title: '핸드폰에서 북마크를 어떻게 만드나요?',
        desc: '가장 쉬운 방법은 PC에서 만들고 핸드폰으로 싱크하는 것입니다. 그러나 만약 되지 않는다면, 아래 방법대로 따라해 보세요.',
        chrome1: '북마크 링크를 복사하세요 (클릭)',
        chrome2: '브라우저 메뉴를 누르고 별 아이콘을 클릭해 현제 페이지를 북마크에 추가하세요.',
        chrome3: '추가된 북마크의 수정 버튼을 누르세요.',
        chrome4: '북마크의 URL을 처음에 복사한 링크로 바꾸세요.',
        chrome5: `북마크 이름을 "${all_bookmarklets_1.LinkNameByLang["ko-KR" /* Language.ko_KR */]}"로 설정하세요.`,
        chrome6: '이전 페이지로 돌아가면 북마크를 사용할 준비가 끝났습니다.',
        chrome7: '북마크를 설정 해 두면 계속 쓸 수 있습니다. 다시 이 페이지로 돌아와서 북마크를 설정 할 필요도 없습니다.',
    },
};
const MobileCreateManual = () => {
    const inputRef = (0, react_1.useRef)();
    const lang = (0, lang_react_1.useLanguage)();
    const setPageTitle = (0, react_1.useCallback)(() => {
        document.title = all_bookmarklets_1.LinkNameByLang[lang];
    }, []);
    const copyLink = (0, react_1.useCallback)((evt) => {
        evt.preventDefault();
        if (inputRef.current) {
            setPageTitle();
            const t = inputRef.current;
            t.select();
            document.execCommand('copy');
        }
    }, []);
    const messages = MessagesByLang[lang];
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h3", null,
            "\u25CF ",
            messages.title),
        react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, messages.desc),
            react_1.default.createElement("ol", null,
                react_1.default.createElement("li", null,
                    react_1.default.createElement("a", { href: "#", onClick: copyLink, onTouchStart: setPageTitle, onContextMenu: setPageTitle }, messages.chrome1),
                    react_1.default.createElement("input", { className: "bookmarkletScript", ref: inputRef, value: all_bookmarklets_1.BOOKMARKLET_LINK, readOnly: true })),
                react_1.default.createElement("li", null, messages.chrome2),
                react_1.default.createElement("li", null, messages.chrome3),
                react_1.default.createElement("li", null, messages.chrome4),
                react_1.default.createElement("li", null, messages.chrome5),
                react_1.default.createElement("li", null, messages.chrome6),
                react_1.default.createElement("li", null, messages.chrome7)))));
};
exports.MobileCreateManual = MobileCreateManual;
