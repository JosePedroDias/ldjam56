import { COLOR_NONE, KIND_EMPTY, KIND_VIRUS } from './constants.mjs';
import { rndF01, randomColor } from './random.mjs';
import { Cell } from './cell.mjs';

function clear(m) {
    m.values().forEach((v) => v.clear());
}

export function setupLevel(m, i) {
    clear(m);

    /*if (i === 0) {
        m.getValue([rndI(8),  8]).toVirus();
        m.getValue([rndI(8), 10]).toVirus();
        m.getValue([rndI(8), 12]).toVirus();
        m.getValue([rndI(8), 14]).toVirus();
    } else {*/
        const nonEmptyIndex = 13 - Math.floor(i/2);
        const probEmpty = 0.7 - 0.02 * i;
        //console.table({ nonEmptyIndex, probEmpty })

        m.fill(([x, y]) => {
            const isEmpty = y < nonEmptyIndex ? true : rndF01() < probEmpty;
            const color = isEmpty ? COLOR_NONE : randomColor();
            const kind = isEmpty ? KIND_EMPTY : KIND_VIRUS;
            return new Cell(color, kind, 0);
        });
    //}
}
