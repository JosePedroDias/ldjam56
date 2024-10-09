function addButton(label) {
    const el = document.createElement('button');
    el.appendChild(document.createTextNode(label));
    return el;
}

function isMobileWithTouch() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile = true;///Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isTouchDevice && isMobile;
}

export function setupMobile(items) {
    if (!isMobileWithTouch()) return;

    for (let [label, fn] of items) {
        const el = addButton(label);
        el.classList.add('hud-btn');
        el.classList.add(`b-${label}`);
        el.addEventListener('mousedown', (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            fn();
        });
        document.body.appendChild(el);
    }
}
