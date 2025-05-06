"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJudgementsToArray = void 0;
function convertJudgementsToArray(jarr) {
    if (typeof jarr.cp === 'number' && jarr.cp !== 0) {
        return [jarr.cp, jarr.perfect, jarr.great, jarr.good, jarr.miss];
    }
    return [jarr.perfect, jarr.great, jarr.good, jarr.miss];
}
exports.convertJudgementsToArray = convertJudgementsToArray;
