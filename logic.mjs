import {
    BOARD_W ,BOARD_H,
    COLOR_NONE,
    KIND_EMPTY, KIND_PILL,
    LEAVE_MS, FALL_MS,
} from './constants.mjs';
import { Matrix } from './matrix.mjs';
import { Cell } from './cell.mjs';
import { Pill } from './pill.mjs';
import { randomColor } from './random.mjs';
import { setupLevel } from './levels.mjs';
import { PositionSet, sortByYDescending, posToString, posArrayToString } from './position.mjs';

const log = () => {};
//const log = (...args) => console.log(...args);

function randomPill() {
    return new Pill(randomColor(), randomColor());
}

export class GameState {
    constructor(levelNo = 0) {
        this.level = levelNo;
        this.board = new Matrix(BOARD_W, BOARD_H);
        this.clearBoard();
        setupLevel(this.board, levelNo);
        this.updateVirusCount();
        this.score = 0;
        this.paused = false;
        this.isGameOver = false;
        this.speedMs = FALL_MS;
        this.lastMoveT = Date.now();
        this.alertText = '';
        //this.markCellsT;
    }

    increaseLevel() {
        ++this.level;
        this.clearBoard();
        setupLevel(this.board, this.level);
        this.updateVirusCount();
    }

    clearBoard() {
        this.board.fill(() => new Cell(COLOR_NONE, KIND_EMPTY, 0));
        this.nextPill = randomPill();
        this.currentPill = randomPill();
    }

    updateVirusCount() {
        this.virusCount = this.board.values().filter((v) => v.isVirus()).length;
        if (this.virusCount === 0) this.increaseLevel();
    }

    togglePause() {
        this.paused = !this.paused;
        this.alertText = this.paused ? 'paused' : '';
    }

    getPillCollisions() {
        const result = [];
        this.currentPill.m.entries().forEach(([[x_, y_], { kind }]) => {
            const x = (x_ + this.currentPill.pos[0]);
            const y = (y_ + this.currentPill.pos[1]);
            if (kind === KIND_PILL) {
                if (!this.board.positionExists([x, y])) {
                    result.push([x_, y_]); // out of bounds
                } else {
                    const v = this.board.getValue([x, y]);
                    if (v.kind !== KIND_EMPTY) result.push([x_, y_]); // collision
                }
            }
        });
        return result;
    }

    isPillColliding() {
        return this.getPillCollisions().length > 0;
    }

    applyPill() {
        // copy cells from pill to board
        this.currentPill.m.entries().forEach(([[x_, y_], { kind }]) => {
            const x = (x_ + this.currentPill.pos[0]);
            const y = (y_ + this.currentPill.pos[1]);
            if (kind === KIND_PILL) {
                this.board.setValue([x, y], this.currentPill.m.getValue([x_, y_]).clone());
            }
        });

        this.markCellsToDelete();

        this.currentPill = this.nextPill;
        this.nextPill = randomPill();
        return this.isPillColliding();
    }

    moveLeft() {
        this.currentPill.pos[0] -= 1;
        const collided = this.isPillColliding();
        if (collided) this.currentPill.pos[0] += 1;
        else this._canMoveDown();
        return collided;
    }

    moveRight() {
        this.currentPill.pos[0] += 1;
        const collided = this.isPillColliding();
        if (collided) this.currentPill.pos[0] -= 1;
        else this._canMoveDown();
        return collided;
    }

    moveUp() {
        this.currentPill.pos[1] -= 1;
        const collided = this.isPillColliding();
        if (collided) this.currentPill.pos[1] += 1;
        return collided;
    }

    moveDown(isFake) {
        this.currentPill.pos[1] += 1;
        const collided = this.isPillColliding();
        if (collided) this.currentPill.pos[1] -= 1;
        else if (!isFake) this._canMoveDown();
        return collided;
    }

    _canMoveDown() {
        const cmd = !this.moveDown(true);
        if (cmd) this.moveUp();
        this.canMoveDown = cmd;
    }

    drop() {
        do {
            this.currentPill.pos[1] += 1;
        } while (!this.isPillColliding());
        this.currentPill.pos[1] -= 1;
    }

    _rotate(isCW) {
        if (isCW) this.currentPill.rotateCW();
        else      this.currentPill.rotateCCW();
        const colls = this.getPillCollisions();
        const leftC   = colls.some((pos) => this.currentPill.isLeftmost(pos));
        const rightC  = colls.some((pos) => this.currentPill.isRightmost(pos));
        const bottomC = colls.some((pos) => this.currentPill.isBottommost(pos));
        if ( leftC && !rightC && !bottomC) this.moveRight();
        if (!leftC &&  rightC && !bottomC) this.moveLeft();
        if (!leftC && !rightC &&  bottomC) this.moveUp();
    }

    rotateCW() {
        this._rotate(true);
    }

    rotateCCW() {
        this._rotate(false);
    }

    markCellsToDelete() {
        delete this.markCellsT;

        this.makeFreePillCellsFall(this.removeMarkedCells());

        const combos = [];

        {
            let prev, combo;

            const fnEnd = () => { 
                if (!combo || combo.length < 4) return;
                combos.push(combo);
            }

            const fn = ([x, y]) => {
                const c = this.board.getValue([x, y]).color;
                if (c === prev && combo) {
                    combo.push([x, y]);
                } else {
                    fnEnd();
                    prev = c;
                    combo = c ? [[x, y]] : undefined;
                }
            }
            
            for (let x = 0; x < this.board.w; ++x) { // vertical lines
                prev = COLOR_NONE;
                combo = undefined;
                for (let y = 0; y < this.board.h; ++y) fn([x, y]);
                fnEnd();
            }
            for (let y = 0; y < this.board.h; ++y) { // horizontal lines
                prev = COLOR_NONE;
                combo = undefined;
                for (let x = 0; x < this.board.w; ++x) fn([x, y]);
                fnEnd();
            }
        }

        if (combos.length > 0) {
            combos.forEach((combo) => {
                log(`combo: ${posArrayToString(combo)}`);
                combo.forEach((pos) => {
                    this.board.getValue(pos).leaving = true;
                });
            });
            this.markCellsT = Date.now() + LEAVE_MS;
        }

        return combos.length > 0;
    }

    removeMarkedCells() {
        const left = [];
        this.board.entries().forEach(([pos, v]) => {
            if (!v.leaving) return;
            log(`clear leaving: ${posToString(pos)}`);
            v.toEmpty();
            left.push(pos);
        });
        return left;
    }

    makeFreePillCellsFall(left) {
        let candidates = new PositionSet();
        left.forEach(([x, y]) => {
            let pp;
            pp = [x-1, y  ]; if (this.board.positionExists(pp)) candidates.add(pp);
            pp = [x,   y-1]; if (this.board.positionExists(pp)) candidates.add(pp);
            pp = [x+1, y  ]; if (this.board.positionExists(pp)) candidates.add(pp);
        });
        left.forEach(p => candidates.remove(p));
        candidates = candidates.values();
        sortByYDescending(candidates);
        //if (candidates.length > 0) { log(`candidates: ${posArrayToString(candidates)}`); };
        candidates.forEach((pos) => {
            if (this.board.canFallDown(pos)) {
                log(`to fall: ${posToString(pos)}`);
                this.board.getValue(pos).falling = true;
            }
        });

        // TODO pills above moving pills can move too
    }

    moveFallingDown() {
        const fallingPositions = this.board.entries().filter((pair) => pair[1].falling).map(([pos, v]) => pos);
        sortByYDescending(fallingPositions);
        //fallingPositions.length > 0 && log(`fallingPositions: ${posArrayToString(fallingPositions)}`);
        let stopFallingHappened = false;
        fallingPositions.forEach((pos) => {
            const posDown = [pos[0], pos[1]+1];
            log(`falling ${posToString(pos)} -> ${posToString(posDown)}`)
            this.board.swap(pos, posDown);

            if (!this.board.canFallDown(posDown)) {
                log(`stop falling: ${posToString(posDown)}`);
                this.board.getValue(posDown).falling = false;
                stopFallingHappened = true;
            }
        });

        if (stopFallingHappened) this.markCellsToDelete();
    }
}
