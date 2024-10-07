import { COLOR_NONE, KIND_EMPTY, KIND_PILL, KIND_VIRUS } from './constants.mjs';
import { rndI } from './random.mjs';

export class Cell {
    constructor(color, kind, rotation) {
        this.color = color;
        this.kind = kind;
        this.rotation = rotation; // only relevant for pills
        this.leaving = false;
        this.falling = false;
        this.counterpart = undefined;
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
}
