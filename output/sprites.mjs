import { BOARD_H, BOARD_W, S, COLORS } from '../constants.mjs';
import { createCanvas, RAD360 } from './render.mjs';

export function bg(m) {
    const W = S * BOARD_W;
    const H = S * BOARD_H;
    const el = createCanvas([W, H]);
    const ctx = el.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.5;
    m.positions().forEach(([x, y]) => {
        ctx.strokeRect(S * x + 0.5, S * y + 0.5, S -1, S - 1);
    });
    return el;
}

export function pillCell(colorIdx) {
    const el = createCanvas([S, S]);
    const R = 0.38;
    const s2 = S/2;
    const r = S * R;
    const xc = s2;
    const xf = S;
    const yc = s2;
    const yi = yc - r;
    const yf = yc + r;
    const ctx = el.getContext('2d');
    ctx.fillStyle = COLORS[colorIdx];
    ctx.beginPath();
    ctx.moveTo(xc, yi);
    ctx.lineTo(xf, yi);
    ctx.lineTo(xf, yf);
    ctx.lineTo(xc, yf);
    ctx.arc(xc, yc, r, 0, RAD360, false);
    ctx.fill();
    return el;
}

export function virusCell(colorIdx) {
    const el = createCanvas([S, S]);
    const R = 0.25;
    const d = S * R;
    const D = S * (1 - R);
    const ctx = el.getContext('2d');
    ctx.strokeStyle = COLORS[colorIdx];
    ctx.lineCap = 'round';
    ctx.lineWidth = S * 0.3;
    ctx.beginPath();
    ctx.moveTo(d, d);
    ctx.lineTo(D, D);
    ctx.moveTo(D, d);
    ctx.lineTo(d, D);
    ctx.stroke();
    return el;
}
