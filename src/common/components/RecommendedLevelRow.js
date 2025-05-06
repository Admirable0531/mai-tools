"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendedLevelRow = void 0;
const react_1 = __importDefault(require("react"));
const arcade_songs_1 = require("../arcade-songs");
const level_helper_1 = require("../level-helper");
class RecommendedLevelRow extends react_1.default.PureComponent {
    render() {
        const { gameRegion, gameVer, rankTitle, recLv, includeOldVersions } = this.props;
        const officialLv = (0, level_helper_1.getOfficialLevel)(gameVer, recLv.lv);
        const internalLv = recLv.lv.toFixed(1);
        const minGameVer = includeOldVersions ? 0 : gameVer;
        return (react_1.default.createElement("tr", null,
            react_1.default.createElement("td", { className: "recLvCell" },
                react_1.default.createElement("a", { href: (0, arcade_songs_1.getMaimaiSongsLink)(internalLv, true, gameRegion, minGameVer, gameVer), target: "_blank" }, internalLv),
                ' ',
                "(",
                react_1.default.createElement("a", { href: (0, arcade_songs_1.getMaimaiSongsLink)(officialLv, false, gameRegion, minGameVer, gameVer), target: "_blank" }, officialLv),
                ")"),
            react_1.default.createElement("td", null, rankTitle),
            react_1.default.createElement("td", null,
                recLv.minAchv.toFixed(4),
                "%"),
            react_1.default.createElement("td", null, recLv.rating)));
    }
}
exports.RecommendedLevelRow = RecommendedLevelRow;
