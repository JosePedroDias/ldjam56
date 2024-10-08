import { COLOR_NONE, KIND_EMPTY, KIND_PILL, KIND_VIRUS } from './constants.mjs';
import { rndI } from './random.mjs';

const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_a = 'a'.charCodeAt(0);

export class Cell {
    constructor(color, kind, rotation) {
        this.color = color;
        this.kind = kind;
        this.rotation = rotation; // only relevant for pills
        this.leaving = false;
        this.falling = false;
        this.counterpart = undefined; // only relevant for pills in the future
    }

    clone() {
        const c = new Cell(this.color, this.kind, this.rotation);
        c.leaving     = this.leaving;
        c.falling     = this.falling;
        c.counterpart = this.counterpart;
        return c;
    }

    isEmpty() {
        return this.kind === KIND_EMPTY;
    }

    isEmptyOrFalling() {
        return this.kind === KIND_EMPTY || this.falling;
    }

    isFilled() {
        return this.kind !== KIND_EMPTY;
    }

    isVirus() {
        return this.kind === KIND_VIRUS;
    }

    isPill() {
        return this.kind === KIND_PILL;
    }

    toVirus(color) {
        this.kind = KIND_VIRUS;
        this.color = color || (1 + rndI(3));
    }

    toRemove() {
        this.leaving = true;
    }

    clearLeaving() {
        if (!this.leaving) return;
        this.clear();
    }

    clear() {
        this.color = COLOR_NONE;
        this.kind = KIND_EMPTY;
        this.rotation = 0;
        this.leaving = false;
        this.falling = false;
        this.counterpart = undefined;
    }

    toString() {
        if (this.kind === KIND_EMPTY) return '.';
        if (this.kind === KIND_PILL)  return String.fromCharCode(CHAR_CODE_a - 1 + this.color);
        if (this.kind === KIND_VIRUS) return String.fromCharCode(CHAR_CODE_A - 1 + this.color);
        return '?';
    }
}
