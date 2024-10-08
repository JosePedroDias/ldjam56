import { GameState } from './logic.mjs';
import { deterministicWithSeed, rndI } from './random.mjs';

////

//import assert from 'node:assert/strict';
function assert(expr, message) { if (!Boolean(expr)) { throw new Error(message || 'unknown assertion error'); } }
const log = (...args) => console.log(...args);

if (globalThis.document) {
    window.onerror = function(msg, url, line, col, err) {
        window.alert(`${msg}
    ${err.stack}`);
        return false;
    };
}

////

function tBoard() {
    deterministicWithSeed(42);
    const st = new GameState(10);
    assert(st.board.w === 8);
    assert(st.board.h === 16);

    assert(st.getPillCollisions().length === 0);

    //log(st.board.toString());
    st.currentPill.pos[1] = 7;
    //log(st.currentPill.toString());

    assert(st.getPillCollisions().length === 2);

    //st.applyPill();
    //log(st.board.toString());
}

function tRandom() {
    deterministicWithSeed(42);
    assert( rndI(100) === 60 );
    assert( rndI(100) === 44 );
    assert( rndI(100) === 85 );
}

////

[
    tBoard,
    //tRandom,
].forEach((fn) => {
    fn();
    console.log(`✅ ${fn.name}`);
});
