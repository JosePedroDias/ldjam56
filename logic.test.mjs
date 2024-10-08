import { TO_STRING_FALLING, TO_STRING_LEAVING } from './cell.mjs';
import { GameState } from './logic.mjs';
import { resetToDefaultPRNG, deterministicWithSeed, rndI } from './random.mjs';
import { setupRender } from './render.mjs';

////

//import assert from 'node:assert/strict';
const DEF_ERR_MSG = 'unknown assertion error';
function assert(expr, msg = DEF_ERR_MSG) { if (!Boolean(expr)) throw new Error(msg); }
function assertEqual(a, b, msg = DEF_ERR_MSG) { if (a != b) { throw new Error(`${msg} (${a} != ${b})`) } }
const log = (...args) => console.log(...args);

if (globalThis.document) {
    window.onerror = function(msg, url, line, col, err) {
        window.alert(`${msg}
    ${err.stack}`);
        return false;
    };
}

////

function removeCanvases() {
    Array.from(document.querySelectorAll('canvas')).forEach((el) => {
        el.parentNode.removeChild(el);
    });
}

function countChars(str, ch) {
    return str.split('').reduce((prev, curr) => curr === ch ? prev + 1 : prev, 0);
}

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

[
    tRandom,
    tBoard,
    tRender,
    tLines,
    tGravity,
].forEach((fn) => {
    resetToDefaultPRNG();
    fn();
    const name = fn.name;
    console.log(`✅ ${name}`);
    //removeCanvases();
});
