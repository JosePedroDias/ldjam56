export class Cell {
    constructor(color, kind, rotation) {
        this.color = color;
        this.kind = kind;
        this.rotation = rotation; // only relevant for pills
    }

    clone() {
        return new Cell(this.color, this.kind, this.rotation);
    }
}
