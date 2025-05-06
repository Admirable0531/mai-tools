"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongImg = void 0;
const react_1 = __importDefault(require("react"));
class SongImg extends react_1.default.PureComponent {
    render() {
        const { imgSrc } = this.props;
        return (react_1.default.createElement("div", { className: "songImgContainer" },
            (imgSrc
                ? react_1.default.createElement("img", { className: "songImg", src: imgSrc, alt: "" })
                : react_1.default.createElement("div", { className: "songImg songImgPlaceholder" })),
            react_1.default.createElement("div", { className: "songImgReflecContainer" }, this.getReflecElement(imgSrc))));
    }
    getReflecElement(imgSrc) {
        if (imgSrc) {
            const style = { backgroundImage: `url("${imgSrc}")` };
            return react_1.default.createElement("div", { className: "songImgReflec", style: style });
        }
        return react_1.default.createElement("div", { className: "songImgPlaceholder songImgReflecPlaceholder" });
    }
}
exports.SongImg = SongImg;
