"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const RootComponent_1 = require("./RootComponent");
require("./quick-lookup.css");
require("./styles.css");
require("./rec-lv-styles.css");
const root = client_1.default.createRoot(document.getElementById("root"));
root.render(react_1.default.createElement(RootComponent_1.RootComponent, null));
