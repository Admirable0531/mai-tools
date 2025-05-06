"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDetailedDxStar = exports.getDxStarText = exports.determineDxStar = void 0;
const number_helper_1 = require("./number-helper");
/*
  ✦ - 85%
  ✦✦ - 90%
  ✦✦✦ - 93%
  ✦✦✦✦ - 95%
  ✦✦✦✦✦ - 97%
  ✦6 - 99%
  ✦7 - 100%
*/
const THRESHOLD = [0, 0.85, 0.9, 0.93, 0.95, 0.97, 0.99, 1];
function determineDxStar(dxScoreRatio) {
    for (let i = THRESHOLD.length - 1; i > 0; i--) {
        if (dxScoreRatio >= THRESHOLD[i]) {
            return i;
        }
    }
    return 0;
}
exports.determineDxStar = determineDxStar;
function getDxStarText(index, displayZero = false) {
    return displayZero ? `✦${index}` : index ? `✦${index}` : '';
}
exports.getDxStarText = getDxStarText;
// This function is only functional on recent play records page and single play record page!
function calculateDetailedDxStar(row) {
    const block = row.querySelector('.playlog_result_innerblock .playlog_score_block');
    if (!block) {
        return 0;
    }
    const dxScoreLabel = block.querySelector('.w_80');
    if (!dxScoreLabel) {
        // do nothing if this function is run more than once
        return;
    }
    dxScoreLabel.remove();
    const [playerDxScore, maxDxScore] = block.textContent
        .split('/')
        .map((t) => parseInt(t.replace(',', '').trim()));
    const dxScoreRatio = playerDxScore / maxDxScore;
    const dxStarIndex = determineDxStar(dxScoreRatio);
    const dxStar = `✦${dxStarIndex} (${(0, number_helper_1.roundFloat)(dxScoreRatio * 100, 'floor', 0.1).toFixed(1)}%)`;
    const dxStarBlock = document.createElement('div');
    dxStarBlock.className = 'white p_r_5 f_15 f_l';
    dxStarBlock.append(dxStar);
    block.prepend(dxStarBlock);
    return dxStarIndex;
}
exports.calculateDetailedDxStar = calculateDetailedDxStar;
