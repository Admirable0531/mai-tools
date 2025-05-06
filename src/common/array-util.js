"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = void 0;
function shuffleArray(o) {
    const arr = o.slice();
    const arrLen = arr.length;
    for (let i = 0; i < arrLen; i++) {
        const curElem = arr[i];
        const swapWith = Math.floor(Math.random() * arrLen);
        arr[i] = arr[swapWith];
        arr[swapWith] = curElem;
    }
    return arr;
}
exports.shuffleArray = shuffleArray;
