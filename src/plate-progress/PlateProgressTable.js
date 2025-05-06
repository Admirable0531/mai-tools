"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlateProgressTable = void 0;
const react_1 = __importDefault(require("react"));
const difficulties_1 = require("../common/difficulties");
const PlateProgressTableCell_1 = require("./PlateProgressTableCell");
function PlateProgressTable(props) {
    const { activeDifficulties, songCount, plateNames, progressByPlate, selectPlateAndDifficulty } = props;
    return (react_1.default.createElement("table", null,
        react_1.default.createElement("thead", null,
            react_1.default.createElement("tr", null,
                react_1.default.createElement("th", null),
                activeDifficulties.map((d, idx) => (react_1.default.createElement(PlateProgressTableCell_1.PlateProgressTableCell, { key: idx, useTh: true, value: (0, difficulties_1.getDifficultyShortName)(d), d: d }))))),
        react_1.default.createElement("tbody", null,
            react_1.default.createElement("tr", null,
                react_1.default.createElement("th", null, "Total"),
                activeDifficulties.map((d, idx) => (react_1.default.createElement(PlateProgressTableCell_1.PlateProgressTableCell, { key: idx, value: songCount[d], d: d })))),
            Object.keys(progressByPlate).map((plateType) => {
                const plateName = plateNames[plateType];
                const progressByDifficulty = progressByPlate[plateType];
                return (react_1.default.createElement("tr", { key: plateType },
                    react_1.default.createElement("th", null, plateName),
                    activeDifficulties.map((d, idx) => (react_1.default.createElement(PlateProgressTableCell_1.PlateProgressTableCell, { key: idx, className: songCount[d] === progressByDifficulty[d][1].length ? 'done' : 'undone', plateType: plateType, value: progressByDifficulty[d][1].length, d: d, onClick: selectPlateAndDifficulty })))));
            }))));
}
exports.PlateProgressTable = PlateProgressTable;
