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
exports.PlateProgress = void 0;
const react_1 = __importStar(require("react"));
const removed_songs_1 = require("../common/removed-songs");
const script_host_1 = require("../common/script-host");
const PlateProgressDetail_1 = require("./PlateProgressDetail");
const BASE_URL = (0, script_host_1.getMaiToolsBaseUrl)() + '/data/plate-info';
function PlateProgress(props) {
    const { region, version, currentVersion } = props;
    const [versionInfo, setVersionInfo] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        fetch(`${BASE_URL}/${region}${version}.json`).then((res) => __awaiter(this, void 0, void 0, function* () {
            if (res.ok) {
                const info = yield res.json();
                console.log(info);
                setVersionInfo(sanitizeVersionInfo(info, region, currentVersion));
                setError('');
            }
            else {
                setVersionInfo(null);
                setError(res.statusText);
            }
        }));
    }, [region, version]);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "error" }, error),
        versionInfo && (react_1.default.createElement(PlateProgressDetail_1.PlateProgressDetail, { versionInfo: versionInfo, playerScores: props.playerScores }))));
}
exports.PlateProgress = PlateProgress;
function sanitizeVersionInfo(info, region, currentVersion) {
    if (!info.dx_remaster_songs) {
        info.dx_remaster_songs = [];
    }
    if (!info.dx_songs) {
        info.dx_songs = [];
    }
    if (!info.std_remaster_songs) {
        info.std_remaster_songs = [];
    }
    if (!info.std_songs) {
        info.std_songs = [];
    }
    const removedSongs = new Set((0, removed_songs_1.getRemovedSongs)(region, currentVersion));
    info.dx_songs = info.dx_songs.filter((s) => !removedSongs.has(s));
    info.std_songs = info.std_songs.filter((s) => !removedSongs.has(s));
    info.dx_remaster_songs = info.dx_remaster_songs.filter((s) => !removedSongs.has(s));
    info.std_remaster_songs = info.std_remaster_songs.filter((s) => !removedSongs.has(s));
    return info;
}
