import {
    COLOR_BLUE, COLOR_YELLOW, COLOR_RED,
    KIND_PILL, KIND_VIRUS,
    S,
    BOARD_H,
    BOARD_W,
} from '../constants.mjs';

import { createCanvas, drawRotated } from './render.mjs';
import { bg, pillCell, virusCell } from './sprites.mjs';
import { Label } from './label.mjs';

const MINR = 0.2;
const DR = 1 - MINR;
function lin(st, r) {
    let rr = 0;
    if (r > MINR && st.canMoveDown) {
        rr = 1/DR * (r - MINR);
    }
    return rr;
}

export class GameScreen {
    constructor(st) {
        this.st = st;

        const W = S * BOARD_W;
        const H = S * BOARD_H;

        this.canvas = createCanvas([W, H], true);
        this.sprites = {
            bg: bg(st.board),
            viruses: [
                undefined,
                virusCell(COLOR_BLUE),
                virusCell(COLOR_YELLOW),
                virusCell(COLOR_RED),
            ],
            pills: [
                undefined,
                pillCell(COLOR_BLUE),
                pillCell(COLOR_YELLOW),
                pillCell(COLOR_RED),
            ],
        };

        this.labels = {
            stats: new Label('', [W, 48], '#5c5', 24),
            alert: new Label('', [W, 48], 'white', 20).setWeight(600).setStroke(4, 'rgba(0,0,0,0.5)'),
        };
    }

    update(r) {
        const st = this.st;

        const { bg, viruses, pills } = this.sprites;
        const { stats, alert } = this.labels;
        const m = st.board;
        const p = st.currentPill;
    
        let rr = lin(st, r);
    
        const W = S * m.w;
        const H = S * m.h;
        const W2 = W/2;
        const H2 = H/2;
    
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(bg, 0, 0);
    
        // draw board
        m.entries().forEach(([[x, y], { color, kind, rotation, leaving, falling }]) => {
            x *= S;
            y *= S;
            ctx.globalAlpha = leaving ? 0.5 : 1;
            ctx.save();
            ctx.translate(0, falling ? S * rr : 0);
            if (kind === KIND_VIRUS) {
                ctx.drawImage(viruses[color], x, y);
            } else if (kind === KIND_PILL) {
                drawRotated(ctx, pills[color], [x, y], rotation);
            }
            ctx.restore();
        });
        ctx.globalAlpha = 1;
    
        // draw current piece
        ctx.save();
        ctx.translate(0, S * rr);
        p.m.entries().forEach(([[x_, y_], { color, kind, rotation }]) => {
            const x = S * (x_ + p.pos[0]);
            const y = S * (y_ + p.pos[1]);
            if (kind === KIND_PILL) {
                drawRotated(ctx, pills[color], [x, y], rotation);
            }
        });
        ctx.restore();
    
        // draw next piece
        ctx.globalAlpha = 0.66;
        st.nextPill.m.entries().forEach(([[x_, y_], { color, kind, rotation }]) => {
            const x = S * x_;
            const y = S * y_;
            if (kind === KIND_PILL) {
                drawRotated(ctx, pills[color], [x, y], rotation);
            }
        });
        ctx.globalAlpha = 1;
    
        // labels
        let [dx, dy] = stats.getHalfSize();
        ctx.drawImage(stats.getCanvas(), W2 - dx, S * 0.5 - dy);

        [dx, dy] = alert.getHalfSize();
        ctx.drawImage(alert.getCanvas(), W2 - dx, H2 - dy);
    }

    setStatsText(text) {
        this.labels.stats.setText(text);
    }

    setAlertText(text) {
        this.labels.alert.setText(text);
    }
}
