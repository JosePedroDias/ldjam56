import { COLOR_NONE, KIND_EMPTY, KIND_PILL } from './constants.mjs';
import { Matrix } from './matrix.mjs';
import { Cell } from './cell.mjs';

export class Pill {
    constructor(colorTop, colorBottom) {
        this.m = new Matrix(3, 3);
        this.pos = [3, -1];
        this.m.fill(([x, y]) => {
            const kind = (x !== 1 || y === 0) ? KIND_EMPTY : KIND_PILL;
            const color = kind === KIND_EMPTY ? COLOR_NONE : y === 1 ? colorTop : colorBottom;
            const rotation = (x === 1 && y === 2) ? 3 : 1;
            return new Cell(color, kind, rotation);
        });
    }

    rotateCW() {
        // TODO
    }

    rotateCCW() {
        // TODO
    }
}
