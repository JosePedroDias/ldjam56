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
    - https://www.twitch.tv/leviticus00
- JS APIs
    - https://simon.html5.org/dump/html5-canvas-cheat-sheet.html
    - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API , https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API


## TODO

### features
- piece going down and gravity being mutually exclusive modes
- keyboard: redefine keys
- fix lack of animation on first row
- 2 player split screen
- twist from original game (??)
- port to go/nakama or use peerjs to do multiplayer (when doing head to head)

### visuals
- mobile layout (flip vertical)
- display next piece and stats outside of the board
- (nice to have) as pills get split, the remaining halves become round
- basic animations (fade, scale), easing?
- actual sprites instead of geometric figures?
