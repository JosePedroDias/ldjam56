import { S } from '../constants.mjs';

export const RAD180 = Math.PI;
export const RAD90  = RAD180 / 2;
export const RAD360 = RAD180 * 2;

export function createCanvas([w, h], toAppend) {
    const el = document.createElement('canvas');
    el.setAttribute('width', w);
    el.setAttribute('height', h);
    if (toAppend) document.body.appendChild(el);
    return el;
}

export function drawRotated(ctx, sprite, [x, y], ninetyDegTimes) {
    if (ninetyDegTimes === 0) {
        ctx.drawImage(sprite, x, y);
        return;
    }
    ctx.save();
    ctx.translate(x + S/2, y + S/2)
    ctx.rotate(ninetyDegTimes * RAD90);
    ctx.drawImage(sprite, -S/2, -S/2);
    ctx.restore();
}
