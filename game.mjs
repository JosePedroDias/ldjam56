import {
    KEY_LEFT, KEY_RIGHT, KEY_DOWN, KEY_DROP, KEY_ROT_CW, KEY_ROT_CCW, KEY_ROT_GP_REBIND,
    GP_LEFT, GP_RIGHT, GP_DOWN, GP_DROP, GP_ROT_CW, GP_ROT_CCW,
    S,
} from './constants.mjs';
import { createGame, moveLeft, moveRight, moveDown, drop, rotateCW, rotateCCW, applyPill, markCellsToDelete, moveFallingDown, countViruses } from './logic.mjs';
import { setupRender } from './render.mjs';
import { setupGamepad, rebindGamepad, getGamepadBindings, setGamepadBindings, subscribeToGamepadEvents, subscribeToGamepadBindingMessages } from './gamepad.mjs';

let m, p, refresh;
let speedMs = 750;
let lastMoveT = Date.now();
let isGameOver = false;

export async function play() {
    [m, p] = createGame();
    const numViruses = countViruses(m);
    document.title = `viruses: ${numViruses}`;

    const [mainEl, _refresh] = setupRender(m, p);
    refresh = _refresh;
    
    mainEl.className = 'board';
    mainEl.style.marginLeft = `-${S/2 * m.w}px`;
    mainEl.style.marginTop  = `-${S/2 * m.h}px`;

    document.addEventListener('keydown', (ev) => {
        if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
        const key = ev.key;
        if      (key === KEY_LEFT)    moveLeft(m, p);
        else if (key === KEY_RIGHT)   moveRight(m, p);
        else if (key === KEY_DOWN)    moveDown(m, p);
        else if (key === KEY_DROP)    { drop(m, p); lastMoveT = Date.now() - speedMs; } // force end of move tick
        else if (key === KEY_ROT_CW)  rotateCW(m, p);
        else if (key === KEY_ROT_CCW) rotateCCW(m, p);
        else if (key === KEY_ROT_GP_REBIND) {
            rebindGamepad().then(() => {
                console.warn('bindings complete');
                try {
                    localStorage.setItem(GP_LS, JSON.stringify(getGamepadBindings()));
                } catch (err) {}
            });
        }
        else if (key === 'd') { // TODO TEMP
            window.m = m;
            debugger;
        }
        else return;
        ev.preventDefault();
        ev.stopPropagation();
    });

    const onTick = () => {
        if (isGameOver) {
            window.alert('game over');
            return;
        }
        requestAnimationFrame(onTick);
        const t = Date.now();

        if (m.markCellsT && m.markCellsT < t) { // effectively remove marked cells
            markCellsToDelete(m);
        }

        if (t - lastMoveT >= speedMs) { // end of move tick
            moveFallingDown(m);
            if (moveDown(m, p)) {
                //markCellsToDelete(m);
                isGameOver = applyPill(m, p);
            }
            const numViruses = countViruses(m);
            document.title = `viruses: ${numViruses}`;
            lastMoveT = t;
        } 
        
        const ratio = (t - lastMoveT) / speedMs;
        refresh(ratio);
    };

    onTick();

    // gamepad wiring
    const GP_LS = 'gamepad';
    setupGamepad();

    try {
        let b = localStorage.getItem(GP_LS);
        b = JSON.parse(b);
        if (b) {
            setGamepadBindings(b);
            console.warn('gamepad bindings loaded');
        }
    } catch (err) {}

    subscribeToGamepadEvents((action) => {
        if      (action === GP_LEFT)    moveLeft(m, p);
        else if (action === GP_RIGHT)   moveRight(m, p);
        else if (action === GP_DOWN)    moveDown(m, p);
        else if (action === GP_DROP)    { drop(m, p); lastMoveT = Date.now() - speedMs; }
        else if (action === GP_ROT_CW)  rotateCW(m, p);
        else if (action === GP_ROT_CCW) rotateCCW(m, p);
        else return;
    });
    subscribeToGamepadBindingMessages((m) => console.log(m));
}
