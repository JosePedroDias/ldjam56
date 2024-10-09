import {
    COLOR_BLUE, COLOR_YELLOW, COLOR_RED,
    KIND_PILL, KIND_VIRUS,
    S,
    COLORS,
} from '../constants.mjs';

const rad180 = Math.PI;
const rad90  = rad180 / 2;
const rad360 = rad180 * 2;

export function createCanvas([w, h], toAppend) {
    const el = document.createElement('canvas');
    el.setAttribute('width', S * w);
    el.setAttribute('height', S * h);
    if (toAppend) document.body.appendChild(el);
    return el;
}

export class Label {

}

function renderBg(el, m) {
    const ctx = el.getContext('2d');
    const W = S * m.w;
    const H = S * m.h;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0.5;
    m.entries().forEach(([[x, y], { i }]) => {
        ctx.strokeRect(S * x + 0.5, S * y + 0.5, S -1, S - 1);
    });
    return el;
}

function renderVirusCell(el, colorIdx) {
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

function renderPillCell(el, colorIdx) {
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
    ctx.arc(xc, yc, r, 0, rad360, false);
    ctx.fill();
    return el;
}

function drawRotated(ctx, sprite, [x, y], ninetyDegTimes) {
    if (ninetyDegTimes === 0) {
        ctx.drawImage(sprite, x, y);
        return;
    }
    ctx.save();
    ctx.translate(x + S/2, y + S/2)
    ctx.rotate(ninetyDegTimes * rad90);
    ctx.drawImage(sprite, -S/2, -S/2);
    ctx.restore();
}

const MINR = 0.2;
const DR = 1 - MINR;
function lin(st, r) {
    let rr = 0;
    if (r > MINR && st.canMoveDown) {
        rr = 1/DR * (r - MINR);
    }
    return rr;
}

function render(el, st, { bg, viruses, pills }, r) {
    const m = st.board;
    const p = st.currentPill;

    let rr = lin(st, r);

    const ctx = el.getContext('2d');
    ctx.clearRect(0, 0, S * m.w, S * m.h);
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

    // print positions
    /*ctx.font = '14px bold sans-serif';
    ctx.fillStyle = '#f7f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    m.positions().forEach(([x, y]) => {
        const xx = S * (x + 0.5);
        const yy = S * (y + 0.5);
        ctx.fillText(`${x},${y}`, xx, yy);
    });*/

    // hacky hud
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#f7f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    {
        const label = `next:         level: ${st.level}     viruses left: ${st.virusCount}`;
        const xt = S * m.w / 2;
        const yt = S * 0.5;
        ctx.fillStyle = '#000';
        ctx.fillText(label, xt+2, yt+2);
        ctx.fillStyle = '#7f7';
        ctx.fillText(label, xt, yt);

        if (st.alertText) {
            ctx.font = '15px sans-serif';
            ctx.fillText(st.alertText, xt, S * m.h / 2);
        }
    }
    
}

export function setupRender(st) {
    const m = st.board;

    // prepare static textures
    const sprites = {
        bg: renderBg(createCanvas([m.w, m.h]), m),
        viruses: [
            undefined,
            renderVirusCell(createCanvas([1, 1]), COLOR_BLUE),
            renderVirusCell(createCanvas([1, 1]), COLOR_YELLOW),
            renderVirusCell(createCanvas([1, 1]), COLOR_RED),
        ],
        pills: [
            undefined,
            renderPillCell(createCanvas([1, 1]), COLOR_BLUE),
            renderPillCell(createCanvas([1, 1]), COLOR_YELLOW),
            renderPillCell(createCanvas([1, 1]), COLOR_RED),
        ],
    };
    const mainEl = createCanvas([m.w, m.h], true);
    
    // setup refresh function
    const refresh = (ratio) => render(mainEl, st, sprites, ratio);

    return [mainEl, refresh];
}
