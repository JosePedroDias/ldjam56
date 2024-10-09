const memoryFallback = new Map();

export function readData(key) {
    let value;
    try {
        value = localStorage.getItem(key);
        return JSON.parse(value);
    } catch (err) {
        return structuredClone(memoryFallback.get(key));
    }
}

export function writeData(key, value) {
    value = structuredClone(value);
    memoryFallback.set(key, value);
    try {
        value = JSON.stringify(value);
        localStorage.setItem(key, value);
    } catch (err) {}
}

export function deleteData(key) {
    memoryFallback.delete(key);
    localStorage.removeItem(key);
}
