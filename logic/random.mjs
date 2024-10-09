let rnd = () => Math.random();

////

function mulberry32(a) {
    return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function deterministicWithSeed(seed) {
    rnd = mulberry32(seed);

    /*const f = mulberry32(seed);
    rnd = () => {
        const v = f();
        console.log(`rnd() ~> ${v}`);
        return v;
    }*/
}

export function deterministicFromValues(values_) {
    const values = Array.from(values_);
    rnd = () => {
        const v = values[0];
        values.push(values.shift()); // rotate left
        return v;
    }
}

export function resetToDefaultPRNG() {
    rnd = () => Math.random();
}

////

export function rndF01() {
    return rnd();
}

export function rndI(n) {
    return Math.floor( n * rnd() );

    /*const v = Math.floor( n * rnd() );
    console.log(`rndI(${n}) ~> ${v}`);
    return v;*/
}

export function randomColor() {
    return 1 + rndI(3);
}
