import { assert, assertEqual, runTests } from './test-utils.mjs';
import { PositionSet } from './position.mjs';

////

function tPosition() {
    const ps = new PositionSet();
    assertEqual(ps.values().length, 0);
    assert(ps.values() instanceof Array);

    ps.add([1, 0]);
    assertEqual(ps.values().length, 1);

    assertEqual(ps.has([0, 0]), false);
    assertEqual(ps.has([1, 0]), true);

    ps.add([2, 3]);
    assertEqual(ps.values().length, 2);

    ps.add([2, 3]);
    assertEqual(ps.values().length, 2);

    assertEqual(ps.values(), [[1,0],[2,3]]);
}

////

runTests([
    tPosition,
]);