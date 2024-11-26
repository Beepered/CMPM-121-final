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
### Overview
- Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
- Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (level 1-3).
- Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
- A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).

We first implemented a simple player character that has top down movement. We are thinking that the player can freely move, but once the player steps on a new cell it counts as the next-turn. The player can create plant using the spacebar if the cell isn't taken otherwise the cell's plant the player is standing on is destroyed. Each cell has its own sun and water levels. Everything else is unfinished.

### Reflection
Progress was slow because everyone was given other projects in other classes to start. Since Thanksgiving was near, we all went home at the same time and couldn't work on the weekends. Hopefully we should work faster now that no one is traveling. 
