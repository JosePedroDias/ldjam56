import { setSearchParamAndReload } from './search.mjs';

export function setupUI(actionFns, levelNames, levelName) {
    const uiEl = document.querySelector('.ui');

    Object.keys(actionFns).forEach((actionName) => {
        const buttonEl = document.createElement('button');
        buttonEl.appendChild(document.createTextNode(actionName));
        uiEl.appendChild(buttonEl);
    });
    
    const selectEl = document.createElement('select');
    levelNames.forEach((ln) => {
        const optionEl = document.createElement('option');
        if (ln == levelName) optionEl.selected = true;
        optionEl.appendChild(document.createTextNode(ln));
        selectEl.appendChild(optionEl);
    });
    uiEl.appendChild(selectEl);

    uiEl.addEventListener('click', (ev) => {
        const nodeName = ev.target.nodeName;
        const text = ev.target.innerHTML;

        if (nodeName === 'OPTION') {
            setSearchParamAndReload('level', text);
        } else if (nodeName === 'BUTTON') {
            const fn = actionFns[text];
            if (!fn) return;
            fn();
        } else {
            return;
        }
        
        ev.preventDefault();
        ev.stopPropagation();
    });
}
