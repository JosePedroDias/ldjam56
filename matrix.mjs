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

    neighbors4([x, y]) {
        return [
            [[x-1, y]], // left
            [[x+1, y]], // right
            [[x, y-1]], // top
            [[x, y+1]], // bottom
        ];//.filter(this.positionExists);
    }

    clone() {
        const m = new Matrix(this.w, this.h);
        m.fill((pos) => structuredClone(this.getValue(pos)));
        return m;
    }

    // similar to clone but keeps the reference to this 
    restore(m) {
        this.fill((pos) => structuredClone(m.getValue(pos)));
    }
}
