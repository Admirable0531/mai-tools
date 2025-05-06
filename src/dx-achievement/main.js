"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A tool that takes FiNALE score data and converts that to DX score
 * (achievement rate, break distribution, etc.)
 */
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const DxAchievementCalculator_1 = require("./DxAchievementCalculator");
require("./styles.css");
react_dom_1.default.render(react_1.default.createElement(DxAchievementCalculator_1.DxAchievementCalculator, null), document.getElementById('root'));
