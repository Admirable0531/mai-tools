"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameRegionFromShortString = exports.getGameRegionFromOrigin = exports.isMaimaiNetOrigin = exports.MAIMAI_NET_ORIGINS = void 0;
const MaimaiNetOriginByRegion = {
    ["jp" /* GameRegion.Jp */]: 'https://maimaidx.jp',
    ["intl" /* GameRegion.Intl */]: 'https://maimaidx-eng.com',
};
const REGIONS = ["jp" /* GameRegion.Jp */, "intl" /* GameRegion.Intl */];
exports.MAIMAI_NET_ORIGINS = REGIONS.map((reg) => MaimaiNetOriginByRegion[reg]);
function isMaimaiNetOrigin(origin) {
    return exports.MAIMAI_NET_ORIGINS.includes(origin);
}
exports.isMaimaiNetOrigin = isMaimaiNetOrigin;
function getGameRegionFromOrigin(origin) {
    const region = REGIONS.find((reg) => MaimaiNetOriginByRegion[reg] === origin);
    return region || "jp" /* GameRegion.Jp */;
}
exports.getGameRegionFromOrigin = getGameRegionFromOrigin;
function getGameRegionFromShortString(region) {
    region = (region || '').toLowerCase();
    return region === "jp" /* GameRegion.Jp */ ? "jp" /* GameRegion.Jp */ : "intl" /* GameRegion.Intl */;
}
exports.getGameRegionFromShortString = getGameRegionFromShortString;
