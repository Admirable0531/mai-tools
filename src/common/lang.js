"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitialLanguage = exports.saveLanguage = exports.SUPPORTED_LANGUAGES = void 0;
const user_preference_1 = require("./user-preference");
exports.SUPPORTED_LANGUAGES = ["en-US" /* Language.en_US */, "zh-TW" /* Language.zh_TW */, "ko-KR" /* Language.ko_KR */];
function loadLanguage() {
    const raw = (0, user_preference_1.loadUserPreference)("MaiToolsLang" /* UserPreference.Language */);
    switch (raw) {
        case "en-US" /* Language.en_US */:
            return "en-US" /* Language.en_US */;
        case "zh-TW" /* Language.zh_TW */:
            return "zh-TW" /* Language.zh_TW */;
        case "ko-KR" /* Language.ko_KR */:
            return "ko-KR" /* Language.ko_KR */;
    }
    return null;
}
function saveLanguage(lang) {
    (0, user_preference_1.saveUserPreference)("MaiToolsLang" /* UserPreference.Language */, lang);
}
exports.saveLanguage = saveLanguage;
function getInitialLanguage() {
    const queryParamsHl = new URLSearchParams(location.search).get("hl" /* QueryParam.HostLanguage */);
    // URL query parameter
    if (queryParamsHl) {
        return queryParamsHl.startsWith('zh')
            ? "zh-TW" /* Language.zh_TW */
            : queryParamsHl.startsWith('ko')
                ? "ko-KR" /* Language.ko_KR */
                : "en-US" /* Language.en_US */;
    }
    // LocalStorage
    const langPreference = loadLanguage();
    if (langPreference) {
        return langPreference;
    }
    // Browser
    if (navigator.language.startsWith('zh')) {
        return "zh-TW" /* Language.zh_TW */;
    }
    if (navigator.language.startsWith('ko')) {
        return "ko-KR" /* Language.ko_KR */;
    }
    return "en-US" /* Language.en_US */;
}
exports.getInitialLanguage = getInitialLanguage;
