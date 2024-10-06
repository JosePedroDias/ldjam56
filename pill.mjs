import { COLOR_NONE, KIND_EMPTY, KIND_PILL } from './constants.mjs';
import { Matrix } from './matrix.mjs';
import { Cell } from './cell.mjs';

function mod4(n, i) {
    return (n + 4000) % 4 === i;
}

export class Pill {
    constructor(colorTop, colorBottom) {
        this.m = new Matrix(3, 3);
        this.pos = [3, -1];
        this.rotation = 0;
        this.m.fill(([x, y]) => {
            const kind = (x !== 1 || y === 0) ? KIND_EMPTY : KIND_PILL;
            const color = kind === KIND_EMPTY ? COLOR_NONE : y === 1 ? colorTop : colorBottom;
            const rotation = (x === 1 && y === 2) ? 3 : 1;
            return new Cell(color, kind, rotation);
        });
        this.rotateCW();
    }

    _rotate(dir) {
        const v11 = this.m.getValue([1, 1]);
        const v10 = this.m.getValue([1, 0]);
        const v01 = this.m.getValue([0, 1]);
        const v12 = this.m.getValue([1, 2]);
        const v21 = this.m.getValue([2, 1]);
        
        [v10, v01, v11, v21, v12].forEach((v) => v.rotation += dir);

        this.m.setValue([1, 0], dir === 1 ? v01 : v21);
        this.m.setValue([0, 1], dir === 1 ? v12 : v10);
        this.m.setValue([1, 2], dir === 1 ? v21 : v01);
        this.m.setValue([2, 1], dir === 1 ? v10 : v12);

        const a = mod4(this.rotation, 2);
        const b = mod4(this.rotation, 3);
        this.rotation += dir;
        const a_ = mod4(this.rotation, 2);
        const b_ = mod4(this.rotation, 3);

        if      (!a &&  a_) this.pos[1] += 1;
        else if ( a && !a_) this.pos[1] -= 1;
        if      (!b &&  b_) this.pos[0] -= 1;
        else if ( b && !b_) this.pos[0] += 1;
    }

    rotateCW() {
        this._rotate(1);
    }

    rotateCCW() {
        this._rotate(-1);
    }

    isLeftmost([x, y]) {
        if (this.rotation % 2 === 0) return false; // odds are horizontal
        if (this.m.getValue([0, 1]).kind === KIND_EMPTY) return x === 1 && y === 1;
        return x === 0 && y === 1;
    }

    isRightmost([x, y]) {
        if (this.rotation % 2 === 0) return false; // odds are horizontal
        if (this.m.getValue([2, 1]).kind === KIND_EMPTY) return x === 1 && y === 1;
        return x === 2 && y === 1;
    }

    isBottommost([x, y]) {
        if (this.rotation % 2 !== 0) return false; // evens are vertical
        if (this.m.getValue([1, 2]).kind === KIND_EMPTY) return x === 1 && y === 1;
        return x === 1 && y === 2;
    }

    clone() {
        const c = new Pill(0, 0);
        c.rotation = this.rotation;
        c.pos[1] = this.pos[1];
        c.pos[0] = this.pos[0];
        c.m = this.m.clone();
        return c;
    }

    restore(c) {
        this.rotation = c.rotation;
        this.pos[1] = c.pos[1];
        this.pos[0] = c.pos[0];
        this.m.restore(c.m);
    }
}
