export function posToString([x, y]) {
    return `${x},${y}`;
}

export function posArrayToString(arr) {
    return arr.map(posToString).join(' ');
}

export function sortByYDescending(arr) {
    arr.sort((a, b) => b[1] - a[1]);
}

export class PositionSet {
    constructor() {
        this._map = new Map();
    }

    add(p) {
        const s = posToString(p);
        if (this._map.has(s)) return;
        this._map.set(s, p);
    }

    remove(p) {
        const s = posToString(p);
        this._map.delete(s);
    }

    has(p) {
        const s = posToString(p);
        return this._map.has(s);
    }

    values() {
        return Array.from(this._map.values());
    }
}
