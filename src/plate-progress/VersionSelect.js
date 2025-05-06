"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionSelect = void 0;
const react_1 = __importDefault(require("react"));
const game_version_1 = require("../common/game-version");
const VERSIONS = (function () {
    let a = ['0-1'];
    for (let i = 2; i <= 12 /* GameVersion.FiNALE */; i++) {
        a.push(i.toFixed(0));
    }
    a.push(`0-${12 /* GameVersion.FiNALE */}`);
    for (let i = 13 /* GameVersion.DX */; i < game_version_1.LATEST_VERSION; i++) {
        a.push(i.toFixed(0));
    }
    return a;
})();
function VersionSelect(props) {
    return (react_1.default.createElement("select", { onChange: props.onChange, value: props.version }, VERSIONS.map((ver, idx) => {
        const label = ver
            .split('-')
            .map((v) => (0, game_version_1.getVersionName)(parseInt(v)))
            .join(' ~ ');
        return (react_1.default.createElement("option", { key: idx, value: ver }, label));
    })));
}
exports.VersionSelect = VersionSelect;
