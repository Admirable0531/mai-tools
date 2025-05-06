"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobile = void 0;
function isMobile() {
    const ua = navigator.userAgent;
    return ua.includes("Android") || ua.includes("iPhone") || ua.includes("iPad");
}
exports.isMobile = isMobile;
