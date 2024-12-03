# CMPM-121-final

## Log 1 - Nov 14 2024
### Team
- Brendan Trieu will be working under the name Beepered and be responsible for creating reusable functions and template code such as classes
- Ian Liu will be responsible for researching the primary and alternate engines. 
- Andrew Byi will be responsible for establishing standard of organizing the code. 
- Izaiah Lozano will be responsible for Game art and music/soundFX

### Tools and materials
We will be using Phaser because we are all familiar with it from CMPM 120. We will also be programming in Javascript because it is compatible with Phaser and we all know it from other CMPM classes. We will primarily be using Visual Studio code or whatever text editor people wish to work with, along with Git for version control. Our main designs will be created in PixelArt and any sound either borrowed from freesounds or created using FLStudio. We plan on switching javascript out with typescript to explore how strong typing along with interfaces interact with Phaser. 

### Outlook
We want to take on a different interpretation of the requirements. The hardest part is likely switching from Javascript to Typescript and making sure our code doesn’t change too much. Our code should be readable and adaptable especially since we are programming in a team. Our code should easily fit together if we are working on separate scripts.

## Log 2 - Nov 25 2024
### How we satisfied the software requirements

We first implemented a simple player character that has top down movement. The player has two available actions when standing on a grid that are both bound to spacebar. Using spacebar on an empty grid plants one of three plants, while using spacebar on an occupied grid removes the seed from the cell.  We currently allow the player to move freely, but once the player steps on a new cell time advances forward. If the cell meets a certain water/sun level requirement when a new turn occurs, the plant on that cell will grow. For now, players can win by completing 3 full plants. 

### Reflection
Progress was slow because everyone was given other projects in other classes to start. Since Thanksgiving was near, we all went home at the same time and couldn't work on the weekends. Hopefully we should work faster now that no one is traveling. We are still working with phaser and javascript along with Git for version control. But, we have started using more temporary assets created in MSPaint to make certain all of our game mechanics work.   

## Log 3 - Dec 3 2024
### How we satisfied the software requirements
- F0[a]. Player moves along a 3x3 grid of cells
- F0[b]. Pressing Q advances time
- F0[c]. Pressing space allows the player to plant/reap on cells
- F0[d]. Water is accumulated over turns while sunlight changes every turn
- F0[e]. Players randomly plant one of three plants which have threee levels of growth including freshly planted and fully grown
- F0[f]. Reaching certain water/sun levels allows the plant to grow in between turns
- F0[g]. The game is currently won when 3 plants are fully grown
- F1[a]. a
- F1[b]. a
- F1[c]. a
- F1[d]. Actions currently pushes copies of the game's state to an undo stack, and clears the redo stack. Pressing n pops a state off the stack and applies it. Undoing also pushes copies of the state onto the redostack which allow the player to redo actions. 
![pic](https://github.com/user-attachments/assets/034aaeb7-30a6-4674-a5a7-44c31485e6c8)

## Reflection
