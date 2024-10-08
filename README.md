# LDJAM56 - Pharma Frenzy

Inspired by Nintendo's Dr Mario.  
Implemented in vanilla js and rendered using canvas API.  
No images, libraries or timers used.

[ludum dare game page](https://ldjam.com/events/ludum-dare/56/$402832)


## controls

### keyboard

- left, right - move pill sideways
- down - move pill 1 cell down
- space bar - drop pill
- z, x - rotate
- p - toggle pause


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

- title screen with level choice
- score and high scores
- piece going down and gravity being mutually exclusive modes
- (nice to have) as pills get split, the remaining halves become round
- keyboard: redefine keys, accept caps?
- fix lack of animation on first row
- basic animations (fade, scale), easing?
- actual sprites instead of geometric figures?
- twist from original game (??)
- port to go/nakama or use peerjs to do multiplayer (when doing head to head)
