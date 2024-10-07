# LDJAM56

Inspired by Nintendo's Dr Mario.  
Implemented in vanilla js and rendered using canvas API.  


## controls

### keyboard

- left, right - move pill sideways
- down - move pill 1 cell down
- space bar - drop pill
- z, x - rotate

### gamepad

- press 1 to define which button/axis to use for each action (see console for feedback)
- config is stored on local storage and reused on subsequent games

## references

- Dr Mario
    - https://www.mariowiki.com/Dr._Mario
    - https://www.mariomayhem.com/downloads/mario_instruction_booklets/Dr_Mario-NES.pdf
    - https://www.youtube.com/watch?v=IHXdtKEHDNU
- JS APIs
    - https://simon.html5.org/dump/html5-canvas-cheat-sheet.html
    - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API , https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API

## TODO

- display next piece and viruses count
- new level once all viruses are cleared
- (infrequent but wrong) pills above moving pills should fall too
- twist from original game?
- falling could be faster?
- (nice to have) overlay buttons for mobile?
- (nice to have) broken pills should get to be round

- gamepad: show gamepad messages using a dom element instead of console
- keyboard: redefine keys
- actual sprites instead of geometric figures?
- port to go/nakama or use peerjs to do multiplayer
