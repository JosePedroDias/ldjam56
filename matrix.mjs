export class Matrix {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this._rows = [];
        for (let y = 0; y < h; ++y) {
            const row = new Array(w);
            this._rows.push(row);
        }
    }

    getValue([x, y]) {
        return this._rows[y][x];
    }

    setValue([x, y], v) {
        this._rows[y][x] = v;
    }

    positions() {
        const res = [];
        for (let y = 0; y < this.h; ++y) {
            for (let x = 0; x < this.w; ++x) {
                res.push([x, y]);
            }
        }
        return res;
    }

    positionExists([x, y]) {
        return x >= 0 && x < this.w &&
            y >= 0 && y < this.h;
    }

    values() {
        return this.positions().map((pos) => {
            return this.getValue(pos);
        });
    }

    entries() {
        return this.positions().map((pos) => {
            return [pos, this.getValue(pos)];
        });
    }

    fill(fn) {
        this.positions().forEach((pos) => {
            this.setValue(pos, fn(pos));
        });
    }

    filter(fn) {
        return this.entries().filter(([pos, v]) => {
            return fn(pos, v);
        });
    }

    swap(p1, p2) {
        const v1 = this.getValue(p1);
        const v2 = this.getValue(p2);
        this.setValue(p1, v2);
        this.setValue(p2, v1);
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

    // similar to clone but keeps the reference to this 
    restore(m) {
        this.fill((pos) => m.getValue(pos).clone());
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
