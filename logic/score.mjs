
// original nintendo score (lo=1, med=2, hi=3)
function getScoreOriginal(numViruses, speedLevel) {
    return 100 * speedLevel * 2 ** (numViruses - 1);
}

export function getScore(numViruses, speedMultiplier) {
    return 100 * speedMultiplier * 2 ** (numViruses - 1);
}
