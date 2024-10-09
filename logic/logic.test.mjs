import { assertEqual, runTests } from './test-utils.mjs';
import { deterministicWithSeed, rndI } from './random.mjs';
import { TO_STRING_FALLING, TO_STRING_LEAVING } from './cell.mjs';
import { GameState } from './logic.mjs';
import { setupRender } from '../output/render.mjs';

////

function countChars(str, ch) {
    return str.split('').reduce((prev, curr) => curr === ch ? prev + 1 : prev, 0);
}

////

function tRandom() {
    deterministicWithSeed(42);
    assertEqual(rndI(100), 60, 'deterministic PRNG works');
    assertEqual(rndI(100), 44);
    assertEqual(rndI(100), 85);
}

function tBoard() {
    deterministicWithSeed(46);
    const st = new GameState(10);
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
    const st = new GameState(3);
    const [canvasEl, refresh] = setupRender(st);
    refresh(0);
}

function tLines() {
    deterministicWithSeed(42);
    const st = new GameState(3);
    const [canvasEl, refresh] = setupRender(st);

    // horizontal line
    st.clearBoard();

    st.board.getValue([4, 13]).toPill(2, 1); // these 2 should fall
    st.board.getValue([4, 14]).toPill(3, 3);

    st.board.getValue([1, 14]).toVirus(3); // this one should stay in place

    st.board.getValue([1, 15]).toPill(1);
    st.board.getValue([3, 15]).toPill(1);
    st.board.getValue([4, 15]).toPill(1);

    st.rotateCCW();
    st.currentPill.pos = [1, 13];
    st.applyPill();

    const leavingShot = st.board.toString(TO_STRING_LEAVING);
    assertEqual( countChars(leavingShot, 'L'), 4, '4 cells should have been marked for leaving');
    //log(leavingShot);
    st.markCellsToDelete();
    const fallingShot = st.board.toString(TO_STRING_FALLING);
    assertEqual( countChars(fallingShot, 'F'), 3, '3 cells should have been marked for falling'); // TODO: FAILS
    //log(fallingShot); // WRONG! ONE CELL LEFT TO FALL!

    refresh(0);
}

function tGravity() {
    // TODO
}

////

runTests([
    tRandom,
    tBoard,
    tRender,
    tLines,
    tGravity,
]);
