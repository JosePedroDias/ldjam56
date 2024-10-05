import { BOARD_H, BOARD_W, COLOR_NONE, KIND_VIRUS, KIND_EMPTY, KIND_PILL } from './constants.mjs';
import { rndF01, rndI } from './random.mjs';
import { Matrix } from './matrix.mjs';
import { Cell } from './cell.mjs';
import { Pill } from './pill.mjs';

export function randomColor() {
    return 1 + rndI(3);
}

export function createGame() {
    const m = new Matrix(BOARD_W, BOARD_H);
    m.fill((pos) => {
        const isEmpty = rndF01() < 0.85;
        const color = isEmpty ? COLOR_NONE : randomColor();
        //const kind = isEmpty ? KIND_EMPTY : KIND_VIRUS;
        const kind = isEmpty ? KIND_EMPTY : rndF01() < 0.5 ? KIND_VIRUS : KIND_PILL; // TODO TEMP
        return new Cell(color, kind, rndF01() < 0.5 ? 1 : 0);
    });

    const p = new Pill(randomColor(), randomColor);

    return [m, p];
}
