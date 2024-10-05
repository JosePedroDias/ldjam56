import {
    COLOR_BLUE, COLOR_YELLOW, COLOR_RED,
    KIND_PILL, KIND_VIRUS,
    S,
    COLORS,
} from './constants.mjs';

function createCanvas([w, h], toAppend) {
    const el = document.createElement('canvas');
    el.setAttribute('width', S * w);
    el.setAttribute('height', S * h);
    if (toAppend) {
        document.body.appendChild(el);
    }
    return el;
}

function renderBg(el, m) {
    const ctx = el.getContext('2d');
    const W = S * m.w;
    const H = S * m.h;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;
    m.entries().forEach(([[x, y], { i }]) => {
        ctx.strokeRect(S * x + 0.5, S * y + 0.5, S -1, S - 1);
    });
    return el;
}

function renderVirusCell(el, colorIdx) {
    const R = 0.3;
    const d = S * R;
    const D = S * (1 - R);
    const ctx = el.getContext('2d');
    ctx.strokeStyle = COLORS[colorIdx];
    ctx.lineCap = 'round';
    ctx.lineWidth = S * 0.25;
    ctx.beginPath();
    ctx.moveTo(d, d);
    ctx.lineTo(D, D);
    ctx.moveTo(D, d);
    ctx.lineTo(d, D);
    ctx.stroke();
    return el;
}

function renderPillCell(el, colorIdx) {
    const R = 0.3;
    const ctx = el.getContext('2d');
    ctx.fillStyle = COLORS[colorIdx];
    ctx.beginPath();
    ctx.arc(S/2, S/2, S * R, 0, 2 * Math.PI, false);
    ctx.fill();
    return el;
}

function render(el, m, p, { bg, viruses, pills }) {
    const ctx = el.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    //ctx.globalAlpha = 0.2;
    m.entries().forEach(([[x, y], { color, kind, rotation }]) => {
        x *= S;
        y *= S;
        try {
            if (kind === KIND_VIRUS) {
                ctx.drawImage(viruses[color], x, y);
            } else if (kind === KIND_PILL) {
                // TODO rotation
                ctx.drawImage(  pills[color], x, y);
            }
        } catch (err) {
            debugger;
        }
    });
    //ctx.globalAlpha = 1;
    p.m.entries().forEach(([[x_, y_], { color, kind, rotation }]) => {
        const x = S * (x_ + p.pos[0]);
        const y = S * (y_ + p.pos[1]);
        try {
            if (kind === KIND_PILL) {
                // TODO rotation
                ctx.drawImage(  pills[color], x, y);
            }
        } catch (err) {
            debugger;
        }
    });
}

export function setupRender(m, p) {
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
    const refresh = () => render(mainEl, m, p, sprites);

    return [mainEl, refresh];
}
