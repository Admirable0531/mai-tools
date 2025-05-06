"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartTypeNameForDxRatingNet = exports.getChartTypeName = exports.getChartType = void 0;
function getChartType(row) {
    if (row.id) {
        // for multi-ChartType songs in song list
        return row.id.includes('sta_') ? 0 /* ChartType.STANDARD */ : 1 /* ChartType.DX */;
    }
    if (row.querySelector('.playlog_music_kind_icon_utage')) {
        // for play record list
        return 2 /* ChartType.UTAGE */;
    }
    const chartTypeImg = row.querySelector('.playlog_music_kind_icon') || // for single and all play records
        row.querySelector('.music_kind_icon') || // for song list and friend vs
        row.querySelector('.f_l.h_20') || // for song detail page
        row.querySelector('img:nth-child(2)'); // ancient wisdom for song list
    if (!(chartTypeImg instanceof HTMLImageElement)) {
        return 1 /* ChartType.DX */;
    }
    return chartTypeImg.src.includes('_standard') ? 0 /* ChartType.STANDARD */ : 1 /* ChartType.DX */;
}
exports.getChartType = getChartType;
function getChartTypeName(ct) {
    switch (ct) {
        case 1 /* ChartType.DX */:
            return 'DX';
        case 0 /* ChartType.STANDARD */:
            return 'STD';
        default:
            return 'UTAGE';
    }
}
exports.getChartTypeName = getChartTypeName;
function getChartTypeNameForDxRatingNet(ct) {
    switch (ct) {
        case 1 /* ChartType.DX */:
            return 'dx';
        case 0 /* ChartType.STANDARD */:
            return 'std';
        default:
            return 'utage';
    }
}
exports.getChartTypeNameForDxRatingNet = getChartTypeNameForDxRatingNet;
