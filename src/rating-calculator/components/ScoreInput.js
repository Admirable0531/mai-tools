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
exports.ScoreInput = void 0;
const react_1 = __importStar(require("react"));
const lang_react_1 = require("../../common/lang-react");
const common_messages_1 = require("../common-messages");
const MessagesByLang = {
    ["en-US" /* Language.en_US */]: {
        scoreInputHeading: 'Player Scores',
        scoreInputDescPrefix: 'Please use "Analyze Self DX Rating" or "Analyze Friend\'s DX Rating" from ',
        bookmarketLinkLabel: 'maimai bookmarklets',
        scoreInputDescSuffix: ' to import scores.',
        importFromFile: 'Import from JSON file',
        uploadFile: 'Select file',
    },
    ["zh-TW" /* Language.zh_TW */]: {
        scoreInputHeading: '玩家成績輸入',
        scoreInputDescPrefix: '請用 ',
        bookmarketLinkLabel: 'maimai 書籤小工具',
        scoreInputDescSuffix: ' 中的「分析自己 DX Rating」或「分析好友 DX Rating」帶入資料。',
        importFromFile: '匯入 JSON 檔案',
        uploadFile: '選取檔案',
    },
    // TODO: update Korean translation
    ["ko-KR" /* Language.ko_KR */]: {
        scoreInputHeading: '플레이 기록',
        scoreInputDescPrefix: '아래 칸은 "',
        bookmarketLinkLabel: 'maimai 북마크',
        scoreInputDescSuffix: '의 "내 디럭스 레이팅 분석하기" 또는 "친구 디럭스 레이팅 분석하기"를 사용해서 채워주세요.',
        importFromFile: 'JSON 파일에서 가져오기',
        uploadFile: '파일 선택',
    },
};
const ScoreInput = ({ setPlayerScores }) => {
    const lang = (0, lang_react_1.useLanguage)();
    const commonMessages = common_messages_1.CommonMessages[lang];
    const messages = MessagesByLang[lang];
    const [showInput, setShowInput] = (0, react_1.useState)(false);
    const handleRadioChange = (0, react_1.useCallback)((evt) => {
        setShowInput(evt.currentTarget.value === '1');
    }, []);
    const loadFromFile = (0, react_1.useCallback)(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (event) => {
            const element = event.target;
            if (!(element instanceof HTMLInputElement))
                return;
            const file = element.files ? element.files[0] : undefined;
            if (!file)
                return;
            const reader = new FileReader();
            reader.onload = (event) => {
                var _a;
                const data = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                if (!data)
                    return;
                if (typeof data !== 'string')
                    return;
                const records = JSON.parse(data);
                if (!Array.isArray(records)) {
                    console.error('ScoreInput error: file is not an array!');
                    return;
                }
                setPlayerScores(records);
            };
            reader.readAsText(file);
        };
        input.click();
    }, [setPlayerScores]);
    return (react_1.default.createElement("div", { className: "w90" },
        react_1.default.createElement("h2", { className: "scoreInputHeading" }, messages.scoreInputHeading),
        react_1.default.createElement("form", { className: "scoreInputSelector" },
            react_1.default.createElement("label", { className: "radioLabel" },
                react_1.default.createElement("input", { className: "radioInput", name: "showScoreInput", value: "0", type: "radio", checked: !showInput, onChange: handleRadioChange }),
                commonMessages.autofill),
            react_1.default.createElement("label", { className: "radioLabel" },
                react_1.default.createElement("input", { className: "radioInput", name: "showScoreInput", value: "1", type: "radio", checked: showInput, onChange: handleRadioChange }),
                messages.importFromFile)),
        react_1.default.createElement("div", { className: showInput ? 'hidden' : '' },
            messages.scoreInputDescPrefix,
            react_1.default.createElement("a", { href: "../#bookmarklets", target: "_blank" }, messages.bookmarketLinkLabel),
            messages.scoreInputDescSuffix),
        react_1.default.createElement("div", { className: showInput ? '' : 'hidden' },
            react_1.default.createElement("div", null,
                messages.scoreInputHeading,
                ":",
                ' ',
                react_1.default.createElement("a", { href: "https://gist.github.com/myjian/a978fda8821beca682ec3a726e17b780", target: "_blank" }, commonMessages.example)),
            react_1.default.createElement("button", { className: "selectFileBtn", onClick: loadFromFile },
                messages.uploadFile,
                "\u2026"))));
};
exports.ScoreInput = ScoreInput;
