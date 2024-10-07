export function rndI(n) {
    return Math.floor( n * Math.random() );
}

export function rndF01() {
    return Math.random();
}

export function randomColor() {
    return 1 + rndI(3);
}
