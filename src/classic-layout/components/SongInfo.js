"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongInfo = void 0;
const react_1 = __importDefault(require("react"));
const wiki_link_1 = require("../../common/wiki-link");
const DifficultyInfo = react_1.default.memo((props) => {
    const { difficulty } = props;
    if (!difficulty) {
        return null;
    }
    const difficultyClass = difficulty.toLowerCase().replace(":", "");
    return (react_1.default.createElement("span", { className: "difficulty " + difficultyClass },
        "\u3010",
        react_1.default.createElement("span", { id: "difficulty" }, difficulty),
        "\u3011"));
});
class SongInfo extends react_1.default.PureComponent {
    render() {
        const { songTitle, track, difficulty } = this.props;
        return (react_1.default.createElement("div", { className: "songInfoContainer" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "track", id: "track" }, track),
                react_1.default.createElement(DifficultyInfo, { difficulty: difficulty })),
            react_1.default.createElement("h2", { className: "songTitle", id: "songTitle" },
                react_1.default.createElement("a", { className: "songWikiLink", href: (0, wiki_link_1.getZhWikiLink)(songTitle), target: "_blank" }, songTitle))));
    }
}
exports.SongInfo = SongInfo;
