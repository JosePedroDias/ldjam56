//import assert from 'node:assert/strict';

import { resetToDefaultPRNG } from './random.mjs';

const DEF_ERR_MSG = 'unknown assertion error';

export function assert(expr, msg = DEF_ERR_MSG) {
    if (!Boolean(expr)) throw new Error(msg);
}

export function assertEqual(a, b, msg = DEF_ERR_MSG) {
    if (typeof a === 'object') a = JSON.stringify(a);
    if (typeof b === 'object') b = JSON.stringify(b);
    if (a != b) throw new Error(`${msg}\ngot: ${a}\nexpected: ${b}`);
}

export const log = (...args) => console.log(...args);

export function runTests(testsArr) {
    testsArr.forEach((fn) => {
        // before each
        resetToDefaultPRNG();
        
        fn();

        const name = fn.name;
        console.log(`✅ ${name}`);

        // after each
    });
}

if (globalThis.document) {
    window.onerror = function(msg, url, line, col, err) {
        window.alert(`${msg}
    ${err.stack}`);
        return false;
    };
}
