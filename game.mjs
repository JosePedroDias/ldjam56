import { KEY_A, KEY_DOWN, KEY_LEFT, KEY_RIGHT, S } from './constants.mjs';
import { createGame } from './logic.mjs';
import { setupRender } from './render.mjs';

let m;
let p;
let refresh;

export async function play() {
    [m, p] = createGame();

    const [mainEl, _refresh] = setupRender(m);
    refresh = _refresh;
    
    mainEl.className = 'board';
    mainEl.style.marginLeft = `-${S/2 * m.w}px`;
    mainEl.style.marginTop  = `-${S/2 * m.h}px`;

    /*mainEl.addEventListener('click', (ev) => {
        const geo = mainEl.getBoundingClientRect();
        const x = Math.floor( (ev.clientX - geo.x) / S);
        const y = Math.floor( (ev.clientY - geo.y) / S);
        const pos = [x, y];
        changeCell(pos);
    });*/

    document.addEventListener('keydown', (ev) => {
        if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
        const key = ev.key;
        if      (key === KEY_LEFT)  moveLeft(m, p);
        else if (key === KEY_RIGHT) moveRight(m, p);
        else if (key === KEY_DOWN)  drop(m, p);
        else if (key === KEY_A)     rotateCW(m, p);
        else if (key === KEY_B)     rotateCCW(m, p);
        else return;
        ev.preventDefault();
        ev.stopPropagation();
    });

    refresh();
}
