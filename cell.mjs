import { COLOR_NONE, KIND_EMPTY } from './constants.mjs';

export class Cell {
    constructor(color, kind, rotation) {
        this.color = color;
        this.kind = kind;
        this.rotation = rotation; // only relevant for pills
        this.leaving = false;
    }

    clone() {
        const c = new Cell(this.color, this.kind, this.rotation);
        c.leaving = this.leaving;
        return c;
    }

    toRemove() {
        this.leaving = true;
    }

    clearLeaving() {
        if (!this.leaving) return;
        this.leaving = false;
        this.color = COLOR_NONE;
        this.kind = KIND_EMPTY;
    }
}
