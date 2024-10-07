import { rndF01, rndI } from './random.mjs';

function clear(m) {
    m.values().forEach((v) => v.clear());
}

export function setupLevel(m, i) {
    clear(m);

    if (i === 0) {
        m.getValue([rndI(8),  8]).toVirus();
        m.getValue([rndI(8), 10]).toVirus();
        m.getValue([rndI(8), 12]).toVirus();
        m.getValue([rndI(8), 14]).toVirus();
    } else {
        m.fill(([x, y]) => {
            const isEmpty = y < 6 ? true : rndF01() < 0.95;
            const color = isEmpty ? COLOR_NONE : randomColor();
            const kind = isEmpty ? KIND_EMPTY : KIND_VIRUS;
            return new Cell(color, kind, 0);
        });
    }
}
