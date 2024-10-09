import { assert, assertEqual, runTests } from './test-utils.mjs';
import { deterministicWithSeed, resetToDefaultPRNG, rndI } from './random.mjs';

////

function tRandom() {
    deterministicWithSeed(42);
    assertEqual(rndI(1000), 601, 'deterministic PRNG works');
    assertEqual(rndI(1000), 448);
    assertEqual(rndI(1000), 852);
    resetToDefaultPRNG();
    assert(rndI(1000) !== 669, 'we do not receive the next deterministic value');
}

////

runTests([
    tRandom,
]);
