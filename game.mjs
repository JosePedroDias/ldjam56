import { KEY_LEFT, KEY_RIGHT, KEY_DOWN, KEY_A, KEY_B, KEY_DROP, S } from './constants.mjs';
import { createGame, moveLeft, moveRight, moveDown, drop, rotateCW, rotateCCW, applyPill } from './logic.mjs';
import { setupRender } from './render.mjs';

let m, p;
let refresh;
let speedMs = 1500;
let lastMoveT = Date.now();

export async function play() {
    [m, p] = createGame();

    const [mainEl, _refresh] = setupRender(m, p);
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
        else if (key === KEY_DOWN)  moveDown(m, p);
        else if (key === KEY_DROP)  drop(m, p);
        else if (key === KEY_A)     rotateCW(m, p);
        else if (key === KEY_B)     rotateCCW(m, p);
        else return;
        ev.preventDefault();
        ev.stopPropagation();
        refresh();
    });

    refresh();


    const onTick = () => {
        requestAnimationFrame(onTick);
        const t = Date.now();
        if (t - lastMoveT >= speedMs) {
            if (moveDown(m, p)) applyPill(m, p);
            refresh();
            lastMoveT = t;
        }
    };

    onTick();
}
