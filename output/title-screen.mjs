import { S, BOARD_W, BOARD_H } from '../constants.mjs';
import { createCanvas } from './render.mjs';
import { Label } from './label.mjs';

export class TitleScreen {
    constructor(st) {
        this.st = st;

        const W = S * BOARD_W;
        const H = S * BOARD_H;
        this.dims = [W, H];
        this.dims2 = [W/2, H/2];

        this.canvas = createCanvas([W, H]);

        this.labels = {
            title: new Label('Pharma Frenzy', [W, 128], 'white', 24).setWeight(600).setStroke(3, 'rgba(255,0,255,0.5)').setLineHeight(32),
        };
    }

    update() {
        const [W, H] = this.dims;
        const [W2, H2] = this.dims2;

        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);

        let [dx, dy] = this.labels.title.getHalfSize();
        ctx.drawImage(this.labels.title.getCanvas(), W2 - dx, H2 - dy);
    }
}
