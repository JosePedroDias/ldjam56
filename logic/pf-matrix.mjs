import { Matrix } from './matrix.mjs';
import { Cell } from './cell.mjs';
import { COLOR_NONE, KIND_EMPTY } from '../constants.mjs';

export class PFMatrix extends Matrix {
    constructor(w, h) {
        super(w, h);
        this.fill(() => new Cell(COLOR_NONE, KIND_EMPTY, 0));
    }

    canFallDown([x, y]) {
        const v = this.getValue([x, y]);
        if (!v.isPill()) return false;
        const posDown = [x, y + 1];
        if (!this.positionExists(posDown)) return false;
        const vDown = this.getValue(posDown);
        return vDown.isEmptyOrFalling();
    }

    pillExists(pos) {
        if (!this.positionExists(pos)) return false;
        const v = this.getValue(pos);
        return v.isPill();
    }

    clone() {
        const m = new Matrix(this.w, this.h);
        m.fill((pos) => this.getValue(pos).clone());
        return m;
    }

    toString(mode) {
        const rows = [];
        for (let y = 0; y < this.h; ++y) {
            const row = [];
            for (let x = 0; x < this.w; ++x) {
                row.push( this.getValue([x, y]).toString(mode) );
            }
            rows.push( row.join('') );
        }
        return rows.join('\n');
    }
}
