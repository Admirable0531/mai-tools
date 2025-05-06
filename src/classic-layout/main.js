"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A tool that takes DX score data, converts that to FiNALE score
 * (achievement rate, break distribution, etc.), and displays it
 * in old maimai-NET style.
 */
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const RootComponent_1 = require("./components/RootComponent");
require("./css/styles.css");
react_dom_1.default.render(react_1.default.createElement(RootComponent_1.RootComponent, null), document.getElementById("root"));
