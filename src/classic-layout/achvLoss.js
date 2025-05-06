"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAchvLoss = void 0;
const number_helper_1 = require("../common/number-helper");
const constants_1 = require("./constants");
function createEmptyJudgementMap() {
    return Object.assign({ total: 0 }, constants_1.EMPTY_JUDGEMENT_OBJ);
}
function calculateAchvLoss(judgementsPerType, breakDistribution, scorePerPercentage) {
    const dxTotalLoss = createEmptyJudgementMap();
    const finaleTotalLoss = createEmptyJudgementMap();
    const achievementLossPerType = { dx: new Map(), finale: new Map() };
    const totalBreakCount = (0, number_helper_1.sum)(Object.values(judgementsPerType.get('break')));
    judgementsPerType.forEach((judgements, noteType) => {
        const baseScore = constants_1.BASE_SCORE_PER_TYPE[noteType];
        const finaleNoteLoss = createEmptyJudgementMap();
        const dxNoteLoss = createEmptyJudgementMap();
        if (noteType === 'break') {
            finaleNoteLoss.perfect = breakDistribution.get(2550) * 50 + breakDistribution.get(2500) * 100;
            finaleNoteLoss.great =
                breakDistribution.get(2000) * 600 +
                    breakDistribution.get(1500) * 1100 +
                    breakDistribution.get(1250) * 1350;
            finaleNoteLoss.good = breakDistribution.get(1000) * 1600;
            finaleNoteLoss.miss = breakDistribution.get(0) * 2600;
            finaleNoteLoss.total = Object.values(finaleNoteLoss).reduce((a, b) => a + b, 0);
            dxNoteLoss.perfect =
                (breakDistribution.get(2550) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(2550)) +
                    breakDistribution.get(2500) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(2500))) /
                    totalBreakCount;
            dxNoteLoss.great =
                ((breakDistribution.get(2000) * (1 - constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(2000)) +
                    breakDistribution.get(1500) * (1 - constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(1500)) +
                    breakDistribution.get(1250) * (1 - constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(1250))) *
                    baseScore) /
                    scorePerPercentage +
                    (breakDistribution.get(2000) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(2000)) +
                        breakDistribution.get(1500) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(1500)) +
                        breakDistribution.get(1250) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(1250))) /
                        totalBreakCount;
            dxNoteLoss.good =
                (breakDistribution.get(1000) * (1 - constants_1.BREAK_BASE_SCORE_MULTIPLIER.get(1000)) * baseScore) /
                    scorePerPercentage +
                    (breakDistribution.get(1000) * (1 - constants_1.BREAK_BONUS_MULTIPLIER.get(1000))) / totalBreakCount;
            dxNoteLoss.miss =
                (breakDistribution.get(0) * baseScore) / scorePerPercentage +
                    breakDistribution.get(0) / totalBreakCount;
            dxNoteLoss.total = Object.values(dxNoteLoss).reduce((a, b) => a + b, 0);
        }
        else {
            finaleNoteLoss.perfect = 0;
            finaleNoteLoss.great = Math.round(judgements.great * baseScore * (1 - constants_1.REGULAR_BASE_SCORE_MULTIPLIER.great));
            finaleNoteLoss.good = Math.round(judgements.good * baseScore * (1 - constants_1.REGULAR_BASE_SCORE_MULTIPLIER.good));
            finaleNoteLoss.miss = judgements.miss * baseScore;
            finaleNoteLoss.total = Object.values(finaleNoteLoss).reduce((a, b) => a + b, 0);
            for (const [j, loss] of Object.entries(finaleNoteLoss)) {
                dxNoteLoss[j] = loss / scorePerPercentage;
            }
        }
        for (const [j, loss] of Object.entries(finaleNoteLoss)) {
            finaleTotalLoss[j] += loss;
        }
        for (const [j, loss] of Object.entries(dxNoteLoss)) {
            dxTotalLoss[j] += loss;
        }
        achievementLossPerType.finale.set(noteType, finaleNoteLoss);
        achievementLossPerType.dx.set(noteType, dxNoteLoss);
    });
    achievementLossPerType.finale.set('total', finaleTotalLoss);
    achievementLossPerType.dx.set('total', dxTotalLoss);
    return achievementLossPerType;
}
exports.calculateAchvLoss = calculateAchvLoss;
