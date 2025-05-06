"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaiToolsBaseUrl = exports.getScriptHost = exports.FALLBACK_MAI_TOOLS_BASE_URL = void 0;
const game_region_1 = require("./game-region");
exports.FALLBACK_MAI_TOOLS_BASE_URL = 'https://myjian.github.io/mai-tools';
// const fallbackMaiToolsBaseUrl = "http://localhost:8080";
/**
 * Find where the scripts are loaded from. This function is usually used
 * by scripts running on maimai NET.
 */
function getScriptHost(scriptName) {
    const scripts = Array.from(document.querySelectorAll('script'));
    while (scripts.length) {
        const script = scripts.pop();
        if (script.src.includes(scriptName) || script.src.includes('all-in-one')) {
            const url = new URL(script.src);
            const path = url.pathname;
            return url.origin + path.substring(0, path.lastIndexOf('/scripts'));
        }
    }
    return exports.FALLBACK_MAI_TOOLS_BASE_URL;
}
exports.getScriptHost = getScriptHost;
/**
 * Find the root url of mai-tools (this website).
 * Can be used by scripts running on maimai NET or scripts on mai-tools itself.
 */
function getMaiToolsBaseUrl() {
    if ((0, game_region_1.isMaimaiNetOrigin)(window.location.origin)) {
        return exports.FALLBACK_MAI_TOOLS_BASE_URL;
    }
    if (window.location.pathname.startsWith('/mai-tools')) {
        return window.location.origin + '/mai-tools';
    }
    return window.location.origin;
}
exports.getMaiToolsBaseUrl = getMaiToolsBaseUrl;
