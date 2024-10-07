import { BOARD_H, BOARD_W, COLOR_NONE, KIND_EMPTY, KIND_PILL, LEAVE_MS } from './constants.mjs';
import { setupLevel } from './levels.mjs';
import { Matrix } from './matrix.mjs';
import { Pill } from './pill.mjs';
import { Cell } from './cell.mjs';
import { randomColor } from './random.mjs';
import { PositionSet, posToString, posArrayToString, sortByYDescending } from './position.mjs';

function randomPill() {
    return new Pill(randomColor(), randomColor());
}

export function createGame() {
    const m = new Matrix(BOARD_W, BOARD_H);
    m.fill(([x, y]) => new Cell(COLOR_NONE, KIND_EMPTY, 0));
    m.nextP = randomPill();
    setupLevel(m, 5);
    const p = randomPill();
    console.log(`next: ${m.nextP.toString()}`);
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
    p.restore(m.nextP);
    m.nextP = randomPill();
    console.log(`next: ${m.nextP.toString()}`);

    return isPillColliding(m, p);
}

export function moveLeft(m, p) {
    p.pos[0] -= 1;
    const collided = isPillColliding(m, p);
    if (collided) p.pos[0] += 1;
    else canMoveDown(m, p);
    return collided;
}

export function moveRight(m, p) {
    p.pos[0] += 1;
    const collided = isPillColliding(m, p);
    if (collided) p.pos[0] -= 1;
    else canMoveDown(m, p);
    return collided;
}

function moveUp(m, p) {
    p.pos[1] -= 1;
    const collided = isPillColliding(m, p);
    if (collided) p.pos[1] += 1;
    return collided;
}

export function moveDown(m, p, isFake) {
    p.pos[1] += 1;
    const collided = isPillColliding(m, p);
    if (collided) p.pos[1] -= 1;
    else if (!isFake) canMoveDown(m, p);
    return collided;
}

function canMoveDown(m, p) {
    const cmd = !moveDown(m, p, true);
    if (cmd) moveUp(m, p);
    m.canMoveDown = cmd;
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

export function markCellsToDelete(m) {
    delete m.markCellsT;

    makeFreePillCellsFall(m, removeMarkedCells(m));

    const combos = [];

    {
        let prev, combo;

        const fnEnd = () => { 
            if (!combo || combo.length < 4) return;
            combos.push(combo);
        }

        const fn = ([x, y]) => {
            const c = m.getValue([x, y]).color;
            if (c === prev && combo) {
                combo.push([x, y]);
            } else {
                fnEnd();
                prev = c;
                combo = c ? [[x, y]] : undefined;
            }
        }
        
        for (let x = 0; x < m.w; ++x) { // vertical lines
            prev = COLOR_NONE;
            combo = undefined;
            for (let y = 0; y < m.h; ++y) fn([x, y]);
            fnEnd();
        }
        for (let y = 0; y < m.h; ++y) { // horizontal lines
            prev = COLOR_NONE;
            combo = undefined;
            for (let x = 0; x < m.w; ++x) fn([x, y]);
            fnEnd();
        }
    }

    if (combos.length > 0) {
        combos.forEach((combo) => {
            console.log(`combo: ${posArrayToString(combo)}`);
            combo.forEach((pos) => m.getValue(pos).toRemove());
        });
        m.markCellsT = Date.now() + LEAVE_MS;
    }

    return combos.length > 0;
}

export function removeMarkedCells(m) {
    const left = [];
    m.entries().forEach(([pos, v]) => {
        if (!v.leaving) return;
        console.log(`clear leaving: ${posToString(pos)}`);
        v.clearLeaving();
        left.push(pos);
    });
    return left;
}

export function makeFreePillCellsFall(m, left) {
    let candidates = new PositionSet();
    left.forEach(([x, y]) => {
        let pp;
        pp = [x-1, y  ]; if (m.positionExists(pp)) candidates.add(pp);
        pp = [x,   y-1]; if (m.positionExists(pp)) candidates.add(pp);
        pp = [x+1, y  ]; if (m.positionExists(pp)) candidates.add(pp);
    });
    left.forEach(p => candidates.remove(p));
    candidates = candidates.values();
    sortByYDescending(candidates);
    //if (candidates.length > 0) { console.log(`candidates: ${posArrayToString(candidates)}`); };
    candidates.forEach((pos) => {
        if (m.canFallDown(pos)) {
            console.log(`to fall: ${posToString(pos)}`);
            m.getValue(pos).falling = true;
        }
    });

    // TODO pills above moving pills can move too
}

export function moveFallingDown(m) {
    const fallingPositions = m.entries().filter((pair) => pair[1].falling).map(([pos, v]) => pos);
    sortByYDescending(fallingPositions);
    fallingPositions.length > 0 && console.log(`fallingPositions: ${posArrayToString(fallingPositions)}`);
    let stopFallingHappened = false;
    fallingPositions.forEach((pos) => {
        const posDown = [pos[0], pos[1]+1];
        console.log(`falling ${posToString(pos)} -> ${posToString(posDown)}`)
        m.swap(pos, posDown);

        if (!m.canFallDown(posDown)) {
            console.log(`stop falling: ${posToString(posDown)}`);
            m.getValue(posDown).falling = false;
            stopFallingHappened = true;
        }
    });

    if (stopFallingHappened) {
        console.log('stopFallingHappened');
        markCellsToDelete(m);
    }
}

export function countViruses(m) {
    return m.values().filter((v) => v.isVirus()).length;
}
