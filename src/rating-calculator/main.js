"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./css/footer-styles.css");
require("./css/input-styles.css");
require("./css/rank-distributon-styles.css");
require("./css/rec-lv-styles.css");
require("./css/styles.css");
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const RootComponent_1 = require("./components/RootComponent");
const root = client_1.default.createRoot(document.getElementById('root'));
root.render(react_1.default.createElement(RootComponent_1.RootComponent));
