import { S, BOARD_W, BOARD_H, LEVEL_LS } from '../constants.mjs';
import { createCanvas } from './render.mjs';
import { Label } from './label.mjs';
import { readData, writeData } from './storage.mjs';

export class TitleScreen {
    constructor(st) {
        this.st = st;

        const W = S * BOARD_W;
        const H = S * BOARD_H;
        this.dims = [W, H];
        this.dims2 = [W/2, H/2];

        this.canvas = createCanvas([W, H]);

        this.level = readData(LEVEL_LS) || 0;

        this.labels = {
            title: new Label('P h a r m a\nF r e n z y', [W, 192], 'white', 36).setWeight(600).setStroke(6, 'rgba(255,0,255,0.5)').setLineHeight(60),
            level: new Label(`level: ${this.level}`, [W, 128], 'white', 24).setWeight(600),
            signature: new Label('2024, José Pedro Dias', [W, 128], 'white', 18),
        };
    }

    update() {
        const [W, H] = this.dims;
        const [W2, H2] = this.dims2;

        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);

        let [dx, dy] = this.labels.title.getHalfSize();
        ctx.drawImage(this.labels.title.getCanvas(), W2 - dx, H * 0.33 - dy);

        [dx, dy] = this.labels.level.getHalfSize();
        ctx.drawImage(this.labels.level.getCanvas(), W2 - dx, H * 0.66 - dy);

        [dx, dy] = this.labels.signature.getHalfSize();
        ctx.drawImage(this.labels.signature.getCanvas(), W2 - dx, H - dy*2);
    }

    _updateLevelLabel() {
        writeData(LEVEL_LS, this.level);
        this.st.setLevel(this.level);
        this.labels.level.setText(`level: ${this.level}`);
    }

    increaseLevel() {
        if (this.level < 20) {
            ++this.level;
            this._updateLevelLabel();
        }
    }

    decreaseLevel() {
        if (this.level > 0) {
            --this.level;
            this._updateLevelLabel();
        }
    }
}
