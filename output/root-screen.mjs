import { S, BOARD_W, BOARD_H } from '../constants.mjs';
import { createCanvas } from './render.mjs';
import { TitleScreen } from './title-screen.mjs';
import { GameScreen } from './game-screen.mjs';

export class RootScreen {
    constructor(st) {
        this.st = st;

        const W = S * BOARD_W;
        const H = S * BOARD_H;
        this.dims = [W, H];
        this.dims2 = [W/2, H/2];

        this.title = new TitleScreen(st);
        this.game = new GameScreen(st);

        this.showTitle = true;

        this.canvas = createCanvas([W, H], true);
    }

    update(r) {
        const [W, H] = this.dims;

        let screen;
        if (this.showTitle) {
            screen = this.title;
        } else {
            screen = this.game;
        }
        screen.update(r);

        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(screen.canvas, 0, 0);
    }

    toTitleScreen() {
        this.showTitle = true;
    }

    toGameScreen() {
        this.showTitle = false;
    }

    setStatsText(text) {
        this.game.setStatsText(text);
    }

    setAlertText(text) {
        this.game.setAlertText(text);
    }
}
