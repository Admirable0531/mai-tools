"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecordMatchPlateCriteria = void 0;
function isRecordMatchPlateCriteria(record, plateType) {
    switch (plateType) {
        case 'CLEAR':
            return record.achievement >= 80;
        case 'SSS':
            return record.achievement >= 100;
        case 'FC':
            return ['FC', 'FC+', 'AP', 'AP+'].includes(record.fcap);
        case 'AP':
            return ['AP', 'AP+'].includes(record.fcap);
        case 'FSD':
            return ['FSD', 'FSD+'].includes(record.sync);
        default:
            throw new Error(`Unknown plateType ${plateType}`);
    }
}
exports.isRecordMatchPlateCriteria = isRecordMatchPlateCriteria;
