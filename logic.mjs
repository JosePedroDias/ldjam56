import { BOARD_H, BOARD_W, COLOR_NONE, KIND_VIRUS, KIND_EMPTY, KIND_PILL } from './constants.mjs';
import { rndF01, rndI } from './random.mjs';
import { Matrix } from './matrix.mjs';
import { Cell } from './cell.mjs';
import { Pill } from './pill.mjs';

export function randomColor() {
    return 1 + rndI(3);
}

function randomPill() {
    return new Pill(randomColor(), randomColor());
}

export function createGame() {
    const m = new Matrix(BOARD_W, BOARD_H);
    m.fill(([x, y]) => {
        const isEmpty = y < 6 ? true : rndF01() < 0.95;
        const color = isEmpty ? COLOR_NONE : randomColor();
        const kind = isEmpty ? KIND_EMPTY : KIND_VIRUS;
        return new Cell(color, kind, 0);
    });

    const p = randomPill();

    return [m, p];
}

function getPillCollisions(m, p) {
    const result = [];
    p.m.entries().forEach(([[x_, y_], { kind }]) => {
        const x = (x_ + p.pos[0]);
        const y = (y_ + p.pos[1]);
        if (kind === KIND_PILL) {
            if (!m.positionExists([x, y])) {
                result.push([x_, y_]); // out of bounds
            } else {
                const v = m.getValue([x, y]);
                if (v.kind !== KIND_EMPTY) result.push([x_, y_]); // collision
            }
        }
    });
    return result;
}

function isPillColliding(m, p) {
    return getPillCollisions(m, p).length > 0;
}

export function applyPill(m, p) {
    // copy cells from pill to board
    p.m.entries().forEach(([[x_, y_], { kind }]) => {
        const x = (x_ + p.pos[0]);
        const y = (y_ + p.pos[1]);
        if (kind === KIND_PILL) {
            m.setValue([x, y], p.m.getValue([x_, y_]).clone());
        }
    });

    markCellsToDelete(m, p);

    // reset new pill
    p.restore(randomPill());

    return isPillColliding(m, p);
}

export function moveLeft(m, p) {
    p.pos[0] -= 1;
    const collided = isPillColliding(m, p);
    if (collided) p.pos[0] += 1;
    return collided;
}

export function moveRight(m, p) {
    p.pos[0] += 1;
    const collided = isPillColliding(m, p);
    if (collided) p.pos[0] -= 1;
    return collided;
}

function moveUp(m, p) {
    p.pos[1] -= 1;
    const collided = isPillColliding(m, p);
    if (collided) p.pos[1] += 1;
    return collided;
}

export function moveDown(m, p) {
    p.pos[1] += 1;
    const collided = isPillColliding(m, p);
    if (collided) p.pos[1] -= 1;
    return collided;
}

export function drop(m, p) {
    do {
        p.pos[1] += 1;
    } while (!isPillColliding(m, p));
    p.pos[1] -= 1;
}

function rotate(m, p, isCW) {
    if (isCW) p.rotateCW();
    else      p.rotateCCW();
    const colls = getPillCollisions(m, p);
    const leftC   = colls.some((pos) => p.isLeftmost(pos));
    const rightC  = colls.some((pos) => p.isRightmost(pos));
    const bottomC = colls.some((pos) => p.isBottommost(pos));
    if ( leftC && !rightC && !bottomC) { moveRight(m, p); }
    if (!leftC &&  rightC && !bottomC) { moveLeft(m, p);  }
    if (!leftC && !rightC &&  bottomC) { moveUp(m, p);    }
}

export function rotateCW(m, p) {
    rotate(m, p, true);
}

export function rotateCCW(m, p) {
    rotate(m, p, false);
}

export function markCellsToDelete(m, p) {
    const combos = [];

    for (let x = 0; x < m.w; ++x) {
        let prev = COLOR_NONE;
        let combo;
        for (let y = 0; y < m.h; ++y) {
            const c = m.getValue([x, y]).color;
            if (c && !combo || (c && combo && c !== prev)) {
                combo = [[x, y]];
                prev = c;
            } else if (combo && (!c || c !== prev)) {
                if (combo.length > 3) combos.push(combo);
                combo = undefined;
                prev = c;
            } else if (c === prev && combo) {
                combo.push([x, y]);
            }
        }
        if (combo && combo.length > 3) combos.push(combo);
    }

    for (let y = 0; y < m.h; ++y) {
        let prev = COLOR_NONE;
        let combo;
        for (let x = 0; x < m.w; ++x) {
            const c = m.getValue([x, y]).color;
            if (c && !combo || (c && combo && c !== prev)) {
                combo = [[x, y]];
                prev = c;
            } else if (combo && (!c || c !== prev)) {
                if (combo.length > 3) combos.push(combo);
                combo = undefined;
                prev = c;
            } else if (c === prev && combo) {
                combo.push([x, y]);
            }
        }
        if (combo && combo.length > 3) combos.push(combo);
    }

    if (combos.length > 0) {
        console.warn('combos', combos);
        combos.forEach((c) => {
            c.forEach((pos) => {
                const v = m.getValue(pos);
                v.toRemove();
            });
        });
        // TODO HACkY
        setTimeout(() => removeMarkedCells(m, p), 2000);
    }

    return combos.length > 0;
}

export function removeMarkedCells(m, p) {
    console.log('to remove...');
    m.values().forEach((v) => {
        //console.log('v', v);
        v.clearLeaving();
    });
}
