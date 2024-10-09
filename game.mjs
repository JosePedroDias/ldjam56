import {
    KEY_LEFT, KEY_RIGHT, KEY_DOWN, KEY_DROP, KEY_ROT_CW, KEY_ROT_CCW, KEY_ROT_GP_REBIND, KEY_PAUSE,
    GP_LEFT, GP_RIGHT, GP_DOWN, GP_DROP, GP_ROT_CW, GP_ROT_CCW,
    S, GP_LS, SCORE_LS,
    KEY_ENTER,
} from './constants.mjs';
import { GameState } from './logic/logic.mjs';
import { RootScreen } from './output/root-screen.mjs';
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
import { readData, writeData } from './output/storage.mjs';

export async function play() {
    let levelNo = 0;
    try {
        const lv = getSearchParam('level');
        lv = parseInt(levelNo, 10);
        if (!isFinite(lv) || lv % 1 !== 0 || lv < 0 || lv > 20) return;
        levelNo = lv;
    } catch (err) {}

    function updateStats(st) {
        let high = readData(SCORE_LS) || 0;
        if (st.score > high) {
            high = st.score;
            writeData(SCORE_LS, high);
        }

        const text = `level:${st.level}    virus:${st.virusCount}\nscore:${st.score}    high:${high} `;
        document.title = text;
        screen.setStatsText(text);
    }

    const st = new GameState(updateStats);
    const screen = new RootScreen(st);
    screen.toTitleScreen();

    const refresh = (r) => screen.update(r);
    
    const mainEl = screen.canvas;
    mainEl.className = 'board';
    mainEl.style.marginLeft = `-${screen.dims2[0]}px`;
    mainEl.style.marginTop  = `-${screen.dims2[1]}px`;

    st.setLevel(levelNo);

    document.addEventListener('keydown', (ev) => {
        if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
        const key = ev.key.toLowerCase(); // to allow for caps/shift to be pressed

        if (screen.showingTitle) {
            switch (key) {
                case KEY_ENTER: {
                    screen.toGameScreen();
                    break;
                }
                case KEY_RIGHT:
                case KEY_DOWN: {
                    screen.increaseLevel();
                    break;
                }
                case KEY_LEFT:
                case KEY_UP: {
                    screen.decreaseLevel();
                    break;
                }
                default:
                    return;
            }
        } else {
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
                screen.setAlertText(st.paused ? 'game paused' : '');
            }
            else if (key === KEY_ROT_GP_REBIND) {
                rebindGamepad().then(() => {
                    console.warn('bindings complete');
                    screen.setAlertText('');
                    writeData(GP_LS, getGamepadBindings());
                });
            }
            //else if (key === 'd') { window.st = st; debugger } // TODO TEMP
            else return;
        }
        
        ev.preventDefault();
        ev.stopPropagation();
    });

    const onTick = () => {
        if (st.isGameOver) {
            screen.setAlertText('game over!');
            refresh();
            return;
        }
        requestAnimationFrame(onTick);

        const t = Date.now();

        if (!st.paused && !screen.showingTitle) {
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
    setupGamepad();

    try {
        let b = readData(GP_LS);
        b = JSON.parse(b);
        if (b) {
            setGamepadBindings(b);
            console.warn('gamepad bindings loaded');
        }
    } catch (err) {}

    subscribeToGamepadEvents((action) => {
        if (screen.showingTitle) {
            screen.toGameScreen();
            return;
        }

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
        screen.setAlertText(msg);
    });

    setupMobile([
        ['left', () => {
            if (screen.showingTitle) screen.decreaseLevel();
            else st.moveLeft();
        }],
        ['right', () => {
            if (screen.showingTitle) screen.increaseLevel();
            else st.moveRight();
        }],
        ['down', () => {
            if (screen.showingTitle) screen.toGameScreen();
            else st.moveDown();
        }],
        ['cw', () => {
            if (screen.showingTitle) screen.toGameScreen();
            else st.rotateCW();
        }],
    ]);
}

play();
