"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareLevels = exports.getDisplayLv = exports.getMaxConstant = exports.getMinConstant = exports.getOfficialLevel = exports.getMinMinorOfPlus = exports.getMaxMinorBeforePlus = exports.MAX_LEVEL = void 0;
exports.MAX_LEVEL = 15;
const MIN_LEVEL = 1;
function getMaxMinorBeforePlus(gameVer) {
    return gameVer > 21 /* GameVersion.BUDDiES */ ? 0.5 : 0.6;
}
exports.getMaxMinorBeforePlus = getMaxMinorBeforePlus;
function getMinMinorOfPlus(gameVer) {
    return gameVer > 21 /* GameVersion.BUDDiES */ ? 0.6 : 0.7;
}
exports.getMinMinorOfPlus = getMinMinorOfPlus;
function getOfficialLevel(gameVer, level) {
    const baseLevel = Math.floor(level);
    return level - baseLevel > getMaxMinorBeforePlus(gameVer)
        ? baseLevel + '+'
        : baseLevel.toString();
}
exports.getOfficialLevel = getOfficialLevel;
/**
 * Compute the default level based on the official level.
 * Since BUDDiES PLUS, + starts from x.6. For example,
 *   "10" contains 10.0 - 10.5, and "10+" contains 10.6 - 10.9
 * In BUDDiES or older versions, + starts from x.7.
 */
function getMinConstant(gameVer, officialLevel) {
    if (!officialLevel) {
        return MIN_LEVEL;
    }
    else if (officialLevel.endsWith('?')) {
        return getMinConstant(gameVer, officialLevel.substring(0, officialLevel.length - 1));
    }
    const baseLevel = parseInt(officialLevel);
    return officialLevel.endsWith('+') ? baseLevel + getMinMinorOfPlus(gameVer) : baseLevel;
}
exports.getMinConstant = getMinConstant;
function getMaxConstant(gameVer, officialLevel) {
    if (!officialLevel) {
        return MIN_LEVEL;
    }
    const baseLevel = parseInt(officialLevel);
    return officialLevel.endsWith('+') ? baseLevel + 0.9 : baseLevel + getMaxMinorBeforePlus(gameVer);
}
exports.getMaxConstant = getMaxConstant;
function getDisplayLv(internalLv, isUtage) {
    const absLv = Math.abs(internalLv);
    if (isUtage) {
        return getOfficialLevel(22 /* GameVersion.BUDDiES_PLUS */, absLv) + '?';
    }
    const lvIsPrecise = internalLv > 0;
    if (lvIsPrecise) {
        return absLv.toFixed(1);
    }
    else if (absLv === 0) {
        return '?';
    }
    return absLv.toFixed(1) + '~';
}
exports.getDisplayLv = getDisplayLv;
function compareLevels(lv1, lv2) {
    if (Math.abs(lv1) === Math.abs(lv2)) {
        return lv1 < 0 ? -1 : lv2 < 0 ? 1 : 0;
    }
    const absLv1 = Math.abs(lv1);
    const absLv2 = Math.abs(lv2);
    return absLv1 < absLv2 ? -1 : absLv2 < absLv1 ? 1 : 0;
}
exports.compareLevels = compareLevels;
