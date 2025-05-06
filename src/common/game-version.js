"use strict";
/**
 * Checklist when adding new game version:
 *   - Remove deleted songs from plate info
 *   - Add deleted songs to src/common/removed-songs.ts
 *   - Update default version in src/plate-progress/RootComponent.tsx
 *   - Update PLATE_PREFIX in src/scripts/build-plate-info.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionName = exports.validateGameVersion = exports.LATEST_VERSION = void 0;
const VERSION_NAMES = [
    'maimai',
    'maimai PLUS',
    'GreeN',
    'GreeN PLUS',
    'ORANGE',
    'ORANGE PLUS',
    'PiNK',
    'PiNK PLUS',
    'MURASAKi',
    'MURASAKi PLUS',
    'MiLK',
    'MiLK PLUS',
    'FiNALE',
    'maimaiでらっくす',
    'maimaiでらっくす PLUS',
    'Splash',
    'Splash PLUS',
    'UNiVERSE',
    'UNiVERSE PLUS',
    'FESTiVAL',
    'FESTiVAL PLUS',
    'BUDDiES',
    'BUDDiES PLUS',
    'PRiSM (beta)',
    'PRiSM PLUS (beta)',
];
exports.LATEST_VERSION = 24 /* GameVersion.PRiSM_PLUS */;
function validateGameVersion(ver, minVer, maxVer = exports.LATEST_VERSION) {
    const numVer = typeof ver === 'string' ? parseInt(ver) : ver;
    if (!ver || isNaN(numVer)) {
        return maxVer;
    }
    if (numVer >= minVer && numVer <= maxVer) {
        return numVer;
    }
    return maxVer;
}
exports.validateGameVersion = validateGameVersion;
function getVersionName(ver) {
    return VERSION_NAMES[ver];
}
exports.getVersionName = getVersionName;
