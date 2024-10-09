import {
    KEY_LEFT, KEY_RIGHT, KEY_DOWN, KEY_DROP, KEY_ROT_CW, KEY_ROT_CCW, KEY_ROT_GP_REBIND, KEY_PAUSE,
    GP_LEFT, GP_RIGHT, GP_DOWN, GP_DROP, GP_ROT_CW, GP_ROT_CCW,
    S,
} from './constants.mjs';
import { GameState } from './logic/logic.mjs';
import { GameScreen } from './output/game-screen.mjs';
import { setupMobile } from './input/mobile.mjs';
import {
    setupGamepad,
    rebindGamepad,
    getGamepadBindings,
    setGamepadBindings,
    subscribeToGamepadEvents,
    subscribeToGamepadBindingMessages,
} from './input/gamepad.mjs';
import { getSearchParam } from './input/search.mjs';

export async function play() {
    let levelNo = 0;
    try {
        const lv = getSearchParam('level');
        lv = parseInt(levelNo, 10);
        if (!isFinite(lv) || lv % 1 !== 0 || lv < 0 || lv > 20) return;
        levelNo = lv;
    } catch (err) {}

    function updateStats(st) {
        const text = `level: ${st.level}, viruses: ${st.virusCount}`;
        document.title = text;
        gs.setStatsText(text);
    }

    const st = new GameState(updateStats);
    const gs = new GameScreen(st);
    const refresh = (r) => gs.update(r);
    
    const mainEl = gs.canvas;
    mainEl.className = 'board';
    mainEl.style.marginLeft = `-${S/2 * st.board.w}px`;
    mainEl.style.marginTop  = `-${S/2 * st.board.h}px`;

    st.setLevel(levelNo);

    document.addEventListener('keydown', (ev) => {
        if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
        const key = ev.key.toLowerCase(); // to allow for caps/shift to be pressed
        if      (key === KEY_LEFT)    st.moveLeft();
        else if (key === KEY_RIGHT)   st.moveRight();
        else if (key === KEY_DOWN)    st.moveDown();
        else if (key === KEY_DROP) {
            st.drop();
            st.lastMoveT = Date.now() - st.speedMs; // force end of move tick
        }
        else if (key === KEY_ROT_CW)  st.rotateCW();
        else if (key === KEY_ROT_CCW) st.rotateCCW();
        else if (key === KEY_PAUSE) {
            st.togglePause();
            gs.setAlertText(st.paused ? 'game paused' : '');
        }
        else if (key === KEY_ROT_GP_REBIND) {
            rebindGamepad().then(() => {
                console.warn('bindings complete');
                gs.setAlertText('');
                try {
                    localStorage.setItem(GP_LS, JSON.stringify(getGamepadBindings()));
                } catch (err) {}
            });
        }
        //else if (key === 'd') { window.st = st; debugger } // TODO TEMP
        else return;
        ev.preventDefault();
        ev.stopPropagation();
    });

    const onTick = () => {
        if (st.isGameOver) {
            gs.setAlertText('game over!');
            refresh();
            return;
        }
        requestAnimationFrame(onTick);

        const t = Date.now();

        if (!st.paused) {
            if (st.markCellsT && st.markCellsT < t) { // effectively remove marked cells
                st.markCellsToDelete();
            }

            if (t - st.lastMoveT >= st.speedMs) { // end of move tick
                st.moveFallingDown(); // TODO: hide this logic under logic.mjs?
                if (st.moveDown()) {
                    st.isGameOver = st.applyPill();
                }
                st.updateVirusCount();
                st.lastMoveT = t;
            } 
            
            refresh( (t - st.lastMoveT) / st.speedMs );
        } else {
            refresh(0);
        }
        
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
        if      (action === GP_LEFT)    st.moveLeft();
        else if (action === GP_RIGHT)   st.moveRight();
        else if (action === GP_DOWN)    st.moveDown();
        else if (action === GP_DROP)    {
            this.drop();
            st.lastMoveT = Date.now() - speedMs; // force end of move tick
        }
        else if (action === GP_ROT_CW)  st.rotateCW();
        else if (action === GP_ROT_CCW) st.rotateCCW();
        else return;
    });
    subscribeToGamepadBindingMessages((msg) => {
        gs.setAlertText(msg);
    });

    setupMobile([
        ['left',  () => st.moveLeft()],
        ['right', () => st.moveRight()],
        ['down',  () => st.moveDown()],
        //['drop',  () => st.drop()],
        ['cw',    () => st.rotateCW()],
        //['ccw',   () => st.rotateCCW()],
    ]);
}

play();
