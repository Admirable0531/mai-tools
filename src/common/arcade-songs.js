"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaimaiSongsLink = exports.MAIMAI_SONGS_HOME = void 0;
const game_version_1 = require("./game-version");
exports.MAIMAI_SONGS_HOME = 'https://arcade-songs.zetaraku.dev/maimai/';
function getMaimaiSongsLink(level, useInternalLevel, gameRegion, minGameVer, maxGameVer = game_version_1.LATEST_VERSION) {
    const q = new URLSearchParams();
    level = level.replace('+', maxGameVer > 21 /* GameVersion.BUDDiES */ ? '.6' : '.7');
    q.set('maxLevelValue', level);
    q.set('minLevelValue', level);
    if (useInternalLevel) {
        q.set('useInternalLevel', 'true');
    }
    if (gameRegion) {
        q.set('region', gameRegion);
    }
    if (minGameVer != null && minGameVer >= 0) {
        const versions = [];
        while (minGameVer <= maxGameVer) {
            versions.push((0, game_version_1.getVersionName)(minGameVer));
            minGameVer++;
        }
        q.set('versions', versions.join('|'));
    }
    return exports.MAIMAI_SONGS_HOME + '?' + q;
}
exports.getMaimaiSongsLink = getMaimaiSongsLink;
