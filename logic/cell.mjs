import { COLOR_NONE, KIND_EMPTY, KIND_PILL, KIND_VIRUS } from '../constants.mjs';
import { rndI } from './random.mjs';

const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_a = 'a'.charCodeAt(0);

export const TO_STRING_LEAVING = 'tsLeaving';
export const TO_STRING_FALLING = 'tsFalling';

export class Cell {
    constructor(color, kind, rotation = 0) {
        this.color = color;
        this.kind = kind;
        this.rotation = rotation; // only relevant for pills
        this.leaving = false;
        this.falling = false;
    }

    clone() {
        const c = new Cell(this.color, this.kind, this.rotation);
        c.leaving     = this.leaving;
        c.falling     = this.falling;
        return c;
    }

    ////

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

    ////

    toEmpty() {
        this.kind = KIND_EMPTY;
        this.color = COLOR_NONE;
        this.rotation = 0;
        this.leaving = false;
        this.falling = false;
    }

    toVirus(color) {
        this.kind = KIND_VIRUS;
        this.color = color || (1 + rndI(3));
        this.rotation = 0;
        this.leaving = false;
        this.falling = false;
    }

    toPill(color, rotation) {
        this.kind = KIND_PILL;
        this.color = color || (1 + rndI(3));
        this.rotation = rotation === undefined ? (1 + rndI(4)) : rotation;
        this.leaving = false;
        this.falling = false;
    }

    ////

    toString(mode) {
        if (mode === TO_STRING_LEAVING) return this.leaving ? 'L' : '.';
        if (mode === TO_STRING_FALLING) return this.falling ? 'F' : '.';

        if (this.kind === KIND_EMPTY) return '.';
        if (this.kind === KIND_PILL)  return String.fromCharCode(CHAR_CODE_a - 1 + this.color);
        if (this.kind === KIND_VIRUS) return String.fromCharCode(CHAR_CODE_A - 1 + this.color);
        return '?';
    }
}
