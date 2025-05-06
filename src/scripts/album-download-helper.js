"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_util_1 = require("../common/date-util");
(function (d) {
    const DIFF_REGEX = /music_(\w+)_score_back/;
    const DOWNLOAD_ICON = '💾';
    function getPlayDate(row) {
        const playDateText = row.getElementsByClassName('block_info')[0].innerText;
        const m = playDateText.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/);
        const japanDt = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]));
        return (0, date_util_1.fixTimezone)(japanDt);
    }
    function getFileName(row) {
        const playDate = getPlayDate(row);
        const songName = row.getElementsByClassName('black_block')[0].innerText.replace(/<>:"\/\\\|\?\*/g, '-');
        const difficulty = row.className.match(DIFF_REGEX);
        return difficulty
            ? `${(0, date_util_1.formatDate)(playDate, '-')} ${songName} ${difficulty[1].toUpperCase()}.jpg`
            : `${(0, date_util_1.formatDate)(playDate, '-')} ${songName}.jpg`;
    }
    function getPhotoLink(row) {
        return __awaiter(this, void 0, void 0, function* () {
            const img = row.querySelector('img.w_430');
            return fetch(img.src)
                .then((res) => res.blob())
                .then((b) => URL.createObjectURL(b));
        });
    }
    function addLinkToSongname(row, href, filename) {
        const songnameBlock = row.getElementsByClassName('black_block')[0];
        if (songnameBlock.getElementsByTagName('a').length) {
            return;
        }
        const link = d.createElement('a');
        link.download = filename;
        link.href = href;
        link.target = '_blank';
        songnameBlock.append(link);
        link.append(songnameBlock.childNodes[0], ' ', DOWNLOAD_ICON);
    }
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            // Enable right click
            d.body.oncontextmenu = null;
            const rows = Array.from(d.getElementsByClassName('black_block')).map((r) => r.parentElement);
            for (const row of rows) {
                const photoLink = yield getPhotoLink(row);
                const filename = getFileName(row);
                addLinkToSongname(row, photoLink, filename);
            }
        });
    }
    main();
})(document);
