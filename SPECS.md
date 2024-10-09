# board

8 x 16


# colors

- blue
- yellow
- red


# pills

- red red
- red blue
- blue blue
- red yellow
- yellow yellow
- blue yellow

(ie all combinations)


# actions

- move pill to the side(left/right)
- drop pill (down)
- rotate pill around 1 of the cells (a/b for cw/ccw)


# mechanics

- objective is to eliminate all viruses from the board (count displayed in UI)
- 4 or more vertical/horizontal continous virus/pill parts of the same color get eliminated
- eliminated cells trigger pill cells above them to fall (at double speed, in isolation)
- (visual detail) if half of a pill is eliminated, the remaining half becomes round


# level setup

- only viruses and empty cells populate the board initially
- there are levels 0-20
- as levels progress, 3 variables increase:
    - density of viruses (1/10 to above 1/2?)
    - "water level" of viruses (last 4 to almost all rows)
    - game speed (low, med, high)


# visible information

- number of viruses left to destroy
- game speed
- score
- high score


# game over

when a pill no longer fits in the topmost board row, the game is over


# score system

TODO


# head to head variant

TODO
