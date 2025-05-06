"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMagicCache = exports.MagicApi = exports.RATING_CALCULATOR_SUPPORTED_VERSIONS = void 0;
const cache_1 = require("../cache");
const song_name_helper_1 = require("../song-name-helper");
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day
const CACHE_KEY_PREFIX = 'magicVer';
const OLD_KEYS_TO_CLEANUP = [
    'dxLv15',
    'dxLv16',
    'dxLv17',
    'dxLv18',
    'dxLv19',
    'dxLv20',
    'magicExpire',
];
const MagicSauceByVersion = new Map([
    [
        18 /* GameVersion.UNIVERSE_PLUS */,
        {
            format: 0 /* MagicFormat.MAI_TOOLS */,
            sauce: 'aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vZWU1NjlkNzRmNDIyZDRlMjU1MDY1ZDhiMDJlYTI5NGEvcmF3L21haWR4X2x2X3VuaXZlcnNlcGx1cy5qc29u',
        },
    ],
    [
        19 /* GameVersion.FESTiVAL */,
        {
            format: 0 /* MagicFormat.MAI_TOOLS */,
            sauce: 'aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vMDg1NWM4OTQ3YjU0N2Q3YjliODg4MTU4NTEyZGRlNjkvcmF3L21haWR4X2x2X2Zlc3RpdmFsLmpzb24=',
        },
    ],
    [
        20 /* GameVersion.FESTiVAL_PLUS */,
        {
            format: 0 /* MagicFormat.MAI_TOOLS */,
            sauce: 'aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vYWQyNjg1ODcyZmQ3ZjVjZDdhNDdlY2IzNDA1MTRlNmIvcmF3L21haWR4X2x2X2Zlc3RpdmFscGx1cy5qc29u',
        },
    ],
    [
        21 /* GameVersion.BUDDiES */,
        {
            format: 0 /* MagicFormat.MAI_TOOLS */,
            sauce: 'aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vZThkOGJiMjcyZjMyYzJjOGE2ODU0MTQzZGUxY2FhZDEvcmF3Lw==',
        },
    ],
    [
        22 /* GameVersion.BUDDiES_PLUS */,
        {
            format: 0 /* MagicFormat.MAI_TOOLS */,
            sauce: 'aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9teWppYW4vZjA1OTMzMWViOWRhZWZlYjBkYzU3Y2UxNWU2ZjczZTkvcmF3Lw==',
        },
    ],
    [
        23 /* GameVersion.PRiSM */,
        {
            format: 0 /* MagicFormat.MAI_TOOLS */,
            sauce: 'aHR0cHM6Ly9teWppYW4uZ2l0aHViLmlvL1RhaXdhbi1pbmRlcGVuZGVuY2UvZXh0ZXJuYWwvbWFnaWMtcHJpc20uanNvbg==',
        },
    ],
    [
        24 /* GameVersion.PRiSM_PLUS */,
        {
            format: 0 /* MagicFormat.MAI_TOOLS */,
            sauce: 'aHR0cHM6Ly9teWppYW4uZ2l0aHViLmlvL1RhaXdhbi1pbmRlcGVuZGVuY2UvZXh0ZXJuYWwvbWFnaWMuanNvbg==',
        },
    ],
]);
exports.RATING_CALCULATOR_SUPPORTED_VERSIONS = Array.from(MagicSauceByVersion.keys()).sort();
const FALLBACK_VERSION = 23 /* GameVersion.PRiSM */;
class MagicApi {
    fetchMagic(gameVer) {
        return __awaiter(this, void 0, void 0, function* () {
            const sauce = MagicSauceByVersion.get(gameVer);
            if (!sauce) {
                return this.fetchMagic(FALLBACK_VERSION);
            }
            const res = yield fetch(atob(sauce.sauce));
            if (!res.ok) {
                const error = new Error(`Failed to load magic ${gameVer}`);
                console.warn(error.message);
                return Promise.reject(error);
            }
            if (sauce.format === 0 /* MagicFormat.MAI_TOOLS */) {
                return res.json();
            }
            else {
                console.warn(`Unknown magic format: ${sauce.format}`);
                return [];
            }
        });
    }
    loadMagic(gameVer) {
        return __awaiter(this, void 0, void 0, function* () {
            const songs = yield (0, cache_1.cached)(CACHE_KEY_PREFIX + gameVer, CACHE_DURATION, (expiredValue) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const newValue = yield this.fetchMagic(gameVer);
                    (0, cache_1.addToCache)(CACHE_KEY_PREFIX + gameVer, newValue, CACHE_DURATION);
                    return newValue;
                }
                catch (err) {
                    console.warn(`Use expired cached magic ${gameVer}`);
                    return expiredValue;
                }
            }), () => this.fetchMagic(gameVer).catch(() => []));
            if (!songs.length) {
                (0, cache_1.expireCache)(CACHE_KEY_PREFIX + gameVer);
            }
            OLD_KEYS_TO_CLEANUP.map(cache_1.expireCache);
            songs.forEach((s) => {
                if (!s.genre) {
                    // Convert nickname to genre
                    s.genre = (0, song_name_helper_1.getGenreFromNickname)(s.nickname || s.name);
                }
            });
            return songs;
        });
    }
}
exports.MagicApi = MagicApi;
function clearMagicCache() {
    exports.RATING_CALCULATOR_SUPPORTED_VERSIONS.forEach((ver) => {
        const localStorageKey = `${CACHE_KEY_PREFIX}${ver}`;
        console.log(`Removing ${localStorageKey} from cache`);
        (0, cache_1.expireCache)(localStorageKey);
    });
}
exports.clearMagicCache = clearMagicCache;
