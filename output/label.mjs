import { createCanvas } from './render.mjs';

export class Label {
    constructor(text = "", dims = [128, 64], color = 'white', fontSize = 12, fontFamily = 'sans-serif') {
        this.text = text;
        this.dims = dims;
        this.color = color;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;

        this.posRatio = [0.5, 0.5];
        this.textAlign = 'center';
        this.textBaseline = 'middle';
        this.textWeight = '';
        this.canvas = createCanvas(dims);
        this.isDirty = true;

        //this.shadowColor = 'black';
        //this.shadowDelta = undefined;// = [1, 1];

        this.strokeColor = 'black';
        this.strokeWidth = 0;
    }

    setColor(color) {
        this.color = color;
        this.isDirty = true;
        return this;
    }

    setPosRatio(xy) {
        this.posRatio = xy;
        this.isDirty = true;
        return this;
    }

    setFontSize(fs) {
        this.fontSize = fs;
        this.isDirty = true;
        return this;
    }

    setText(text) {
        this.text = text;
        this.isDirty = true;
        return this;
    }

    setAlign(a) {
        this.textAlign = a;
        this.isDirty = true;
        return this;
    }

    setBaseline(bl) {
        this.textBaseline = bl;
        this.isDirty = true;
        return this;
    }

    setWeight(v) {
        this.textWeight = v === undefined ? 'bold' : v;
        this.isDirty = true;
        return this;
    }

    setStroke(width, optColor) {
        this.strokeWidth = width;
        if (optColor !== undefined) {
            this.strokeColor = optColor;
        }
        this.isDirty = true;
        return this;
    }

    update() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.dims[0], this.dims[1]);

        // ctx.strokeStyle = 'white'; ctx.strokeRect(0, 0, this.dims[0], this.dims[1]); // debug size

        ctx.font = `${this.textWeight ? this.textWeight + ' ' : ''}${this.fontSize}px ${this.fontFamily}`;
        ctx.textAlign = this.textAlign
        ctx.textBaseline = this.textBaseline;

        const x = this.posRatio[0] * this.dims[0];
        const y = this.posRatio[1] * this.dims[1];

        if (this.strokeWidth) {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeText(this.text, x, y);
        }

        ctx.fillStyle = this.color;
        ctx.fillText(this.text, x, y);
    }

    getCanvas() {
        if (this.isDirty) {
            this.update();
            this.isDirty = false;
        }
        return this.canvas;
    }

    getSize() {
        return this.dims;
    }

    getHalfSize() {
        return [
            this.dims[0]/2,
            this.dims[1]/2,
        ];
    }
}
