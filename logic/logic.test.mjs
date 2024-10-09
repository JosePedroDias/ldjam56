import { assert, assertEqual, runTests, log } from './test-utils.mjs';
import { deterministicWithSeed, deterministicFromValues } from './random.mjs';
import { TO_STRING_FALLING, TO_STRING_LEAVING } from './cell.mjs';
import { GameState } from './logic.mjs';
import { GameScreen } from '../output/game-screen.mjs';

////

function countChars(str, ch) {
    return str.split('').reduce((prev, curr) => curr === ch ? prev + 1 : prev, 0);
}

////

function tBoard() {
    deterministicWithSeed(46);
    const st = new GameState();
    st.setLevel(10);
    assertEqual(st.board.w, 8, 'board width');
    assertEqual(st.board.h, 16, 'board height');

    assertEqual(st.getPillCollisions().length, 0, 'no collisions ocurred');

    //log(st.board.toString());
    st.currentPill.pos[1] = 7;
    //log(st.currentPill.toString());

    assertEqual(st.getPillCollisions().length, 1, '1 collision ocurred');

    st.applyPill();
    //log(st.board.toString());
}

function tRender() {
    deterministicWithSeed(42);
    const st = new GameState();
    st.setLevel(3);
    const gs = new GameScreen(st);
    gs.update(0);
}

function tLines() {
    //deterministicWithSeed(232);
    deterministicFromValues([0.1, 0.2, 0.3]);
    const st = new GameState();
    //st.setLevel(3);
    const gs = new GameScreen(st);

    // horizontal line
    st.board.getValue([4, 13]).toPill(2, 1); // these 2 should fall
    st.board.getValue([4, 14]).toPill(3, 3);

    st.board.getValue([1, 14]).toVirus(3); // this one should stay in place

    st.board.getValue([1, 15]).toPill(1);
    st.board.getValue([3, 15]).toPill(1);
    st.board.getValue([4, 15]).toPill(1);
    //log(st.board.toString());

    st.rotateCCW();
    st.currentPill.pos = [1, 13];
    //log(st.currentPill.toString());
    st.applyPill();

    //log(st.board.toString());

    const leavingShot = st.board.toString(TO_STRING_LEAVING);
    assertEqual( countChars(leavingShot, 'L'), 4, '4 cells should have been marked for leaving');
    //log(leavingShot);
    st.markCellsToDelete();
    const fallingShot = st.board.toString(TO_STRING_FALLING);
    assertEqual( countChars(fallingShot, 'F'), 3, '3 cells should have been marked for falling'); // TODO: FAILS
    //log(fallingShot); // WRONG! ONE CELL LEFT TO FALL!

    gs.update(0);
}

////

runTests([
    tBoard,
    tRender,
    tLines,
]);
