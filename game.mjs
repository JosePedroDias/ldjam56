import {
    KEY_LEFT, KEY_RIGHT, KEY_DOWN, KEY_DROP, KEY_ROT_CW, KEY_ROT_CCW, KEY_ROT_GP_REBIND, KEY_PAUSE,
    GP_LEFT, GP_RIGHT, GP_DOWN, GP_DROP, GP_ROT_CW, GP_ROT_CCW,
    S,
} from './constants.mjs';
import { GameState } from './logic.mjs';
import { setupRender } from './render.mjs';
import {
    setupGamepad,
    rebindGamepad,
    getGamepadBindings,
    setGamepadBindings,
    subscribeToGamepadEvents,
    subscribeToGamepadBindingMessages,
} from './gamepad.mjs';
import { getSearchParam } from './search.mjs';

let refresh;
let st;

function updateTitle(st) {
    document.title = `level: ${st.level}, viruses: ${st.virusCount}`;
}

export async function play() {
    try {
        let levelNo = getSearchParam('level');
        levelNo = parseInt(levelNo, 10);
        if (!isFinite(levelNo) || levelNo % 1 !== 0 || levelNo < 1 || levelNo > 20) levelNo = 0;
        else --levelNo;
        st = new GameState(levelNo);
    } catch (err) {
        st = new GameState();
    }
    st.lastMoveT = Date.now();

    updateTitle(st);

    const [mainEl, _refresh] = setupRender(st);
    refresh = _refresh;
    
    mainEl.className = 'board';
    mainEl.style.marginLeft = `-${S/2 * st.board.w.w}px`;
    mainEl.style.marginTop  = `-${S/2 * st.board.h}px`;

    document.addEventListener('keydown', (ev) => {
        if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
        const key = ev.key;
        if      (key === KEY_LEFT)    st.moveLeft();
        else if (key === KEY_RIGHT)   st.moveRight();
        else if (key === KEY_DOWN)    st.moveDown();
        else if (key === KEY_DROP) {
            st.drop();
            st.lastMoveT = Date.now() - st.speedMs; // force end of move tick
        }
        else if (key === KEY_ROT_CW)  st.rotateCW();
        else if (key === KEY_ROT_CCW) st.rotateCCW();
        else if (key === KEY_PAUSE)   st.togglePause();
        else if (key === KEY_ROT_GP_REBIND) {
            rebindGamepad().then(() => {
                console.warn('bindings complete');
                st.alertText = undefined;
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
            st.alertText = 'game over!';
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
                st.moveFallingDown();
                if (st.moveDown()) {
                    st.isGameOver = st.applyPill();
                }
                updateTitle(st);
                st.lastMoveT = t;
            } 
            
            refresh( (t - st.lastMoveT) / st.speedMs );
        } else {
            refresh(0);
        }
        
    };

    onTick();

    /*
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
        //console.log(m);
        st.alertText = msg;
    });
    */
}
