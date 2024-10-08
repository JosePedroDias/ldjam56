import { GameState } from './logic.mjs';
import { deterministicWithSeed, rndI } from './random.mjs';

////

//import assert from 'node:assert/strict';
function assert(expr, message) { if (!Boolean(expr)) { throw new Error(message || 'unknown assertion error'); } }

if (globalThis.document) {
    window.onerror = function(msg, url, line, col, err) {
        window.alert(`${msg}
    ${err.stack}`);
        return false;
    };
}

////

function tBoard() {
    const st = new GameState(10);
    assert(st.board.w === 8);
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
    tRandom,
].forEach((fn) => {
    fn();
    console.log(`✅ ${fn.name}`);
});
