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
- F0[a]. Player moves along a 3x3 grid of 2D cells
- F0[b]. Pressing "NewTurn" advances time
- F0[c]. Pressing "SPACE" allows the player to take an action when on a cell. Planting if there isn't a plant and reaping if there is a plant and the plant is fully grown.
- F0[d]. Water is accumulated over turns to a max of 10 while sunlight changes between 1 - 10 every turn.
- F0[e]. Players randomly plant one of three plants which have three levels of growth including freshly planted and fully grown
- F0[f]. Reaching certain water/sun levels allows the plant to grow in between turns
- F0[g]. The game is currently won when 3 plants are fully grown
- F1[a]. Saving and Loading:
![pic](https://github.com/user-attachments/assets/034aaeb7-30a6-4674-a5a7-44c31485e6c8)
  - We used an array-of-structures approach to saving the game state.
  - To save: A byte-array is created for the grid and a pointer is created. The pointer loops through the byte-array and adds each cell's water, sun, plant type, and plant growth. Another byte is created for the player and a pointer loops through it adding the player's x position, y position, and number of seeds. Then both byte-arrays are combined into 1, encoded, then saved in local storage.
  - To load: First checks if a save exists and if so, gets the encoded save. Decode the save into 1 byte-array and split it into 2 based on the amount of bytes for the grid and bytes for the player. For the grid byte-array, a pointer is created and loops through the byte-array and sets the cell's water, sun, plant type, and plant growth. For the player byte-array, a pointer is created and loops through the byte-array and sets the player's x position, y position, and number of seeds.
- F1[b]. By pressing the menu button in the top left with the mouse, users are able to save, load, and delete save states. 
- F1[c]. Game automatically saves between each turn. When starting the game, users are asked whether they would like to attempt to load the autosave. 
- F1[d]. Actions currently push copies of the game's state to an undo stack, and clears the redo stack. Pressing "Undo" pops a state off the stack and applies it. Undoing also pushes copies of the state onto the redo stack which allow the player to redo actions.  Pressing "redo" pops off the redo stack and also into the undostack.

## Reflection
  With various members traveling for Thanksgiving along with having other responsibilities come up, our F1 development came along very slowly. We have remained consistent in our use of Phaser alongside JavaScript. Our role structure hasn't stuck very much and we are just coding to try to meet deadlines. On top of the software requirements, we have implemented clickable buttons to replace keybinds for saving, loading, undoing, redoing, and progressing turns. After initially having them to random keys on the keyboard we switched to buttons to make the program usable for new users. Overall, progress has been really slow because of Thanksgiving and trying to manage another class' project at the same time.

## Log 4 - Dec 6 2024
### F0 + F1
- F0 changes:
  - F0[a]. The player using velocity instead of directly moving position. Changed cell creation to spawn cells based on cell size instead of game size.
  - F0[b]. no changes
  - F0[c]. Fixed function that determines which cell the player is standing in.
  - F0[d]. Implemented a weather system so now water and sun changes based on weather. The Forecast shows what will happen on the next turn so the player can plan ahead.
  - F0[e]. Created an internal DSL for plants (described later).
  - F0[f]. The internal plant DSL describes how the plants will grow.
  - F0[g]. With an external DSL (described later), the amount of plants required until the win condition is satisfied can be changed.
- F1 changes:
  - F1[a]. Various bug fixes.
  - F1[b]. Changed buttons so the player clicks on rectangles instead of text, making it easier to click on menu buttons.
  - F1[c]. no changes
  - F1[d]. Reworked undo/redo system to utilize the array buffer from F1.a. Also reworked the redo logic to function properly. Undo/redo now properly works for all actions including, new turns, reaping, and planting. 
### External DSL for Scenario Design
Created a JSON file that the play scene parses through on start that changes various values. For example, changing Forecast to ["rainy", "rainy", "cloudy", "sunny"] will change the weather to rainy for 2 turns, cloudy for 1 turn, and sunny for 1 turn. We had to change the seeds variable to be global so that the UI scene could take from a possibly different value instead of always assuming it will be 3.
```
{
    "playerX": 0,
    "playerY": 0,
    "maxSeeds": 3,
    "numSeeds": 3,
    "winCondition": 5,
    "Forecast": ["sunny", "sunny", "sunny"]
}
```
### Internal DSL for Plants and Growth Conditions
Created an Internal Domain Specific Language (DSL) to manage plant types and their growth conditions within a web application. The PlantDSL object contains a registry that stores plant types, each with a name, texture-image, and a growth rule. The growth rule is a function that takes environmental factors like sunlight, water, and neighboring plants to determine if the plant can grow. For example, sunflowers need at least 3 sunlight and 2 water with no more than one neighbor, while roses require high water and must be near another rose to grow. This DSL structure allows for easy addition of new plant types with unique growth conditions. It also ensures a clear separation of concerns and flexibility, making the system extensible and maintainable. The DSL simplifies the management of plant behaviors, allowing dynamic evaluation of growth conditions based on changing environmental factors.

### Switch to Alternate Platform
Our port from JavaScript to TypeScript started by installing node into our existing project. Using Node, we installed TypeScript, Phaser and ESLint. Because of the similarities between JavaScript and TypeScript, we didn't have to change too many things. The biggest changes came from having to strongly type all of our variables along with changing a bunch of syntax. Notable syntax changes included changing references in SaveManager to work properly with static typing. The cleanup process also allowed us to delete legacy code that no longer had functionality. 

## Reflection
We knew we couldn't finish the project because the save and load from F1 was constantly breaking and managing other projects. Eventually the roles didn't matter too much as everyone was just trying to do as much as they can. Brendan started focusing on making small user experience changes and implementing new ideas (player movement and cell checking, weather, JSON). Ian focused on fixing the save/load, undo/redo, and transitioning to TypeScript. Izaiah switched focus from reworking our code to being compatible with each others logic, as well as the UI he designed, to working on the internal DSL logic and ensuring it was implemented accordingly to all the previous logic done before. 

## Log 5 - Dec 8 2024
## How we satisfied the software requirements
### F0+F1+F2
No Major Changes to F0,F1, and F2 were made while implementing F3. This is in part because we worked on F3 at the same time as F2 so most changes are documented in the previous devlog. 

### Internationalization

The devlog should explain how your code has changed to distinguish between strings internal to the program and strings that will be shown to the player (needing localization). If you did something clever with your language's type system so that the compiler helps you catch incomplete translations or other missing messages, brag about that in this section.

This section should outline which code or data files need to get changed when adding support for a new language or adding a new translatable message to the game.

### Localization

For localization, we put 5 languages, English, Chinese, Japanese, French and Spanish. We chose these languages due to their widespread popularity. For the localization to work, we had a JSON file which is accessed by all scene files and stores all the language options. At the very beginning of the JSON, there is a number variable which chooses the language. 1 is for English, 2 Chinese, 3 Japanese, 4 French, 5 Spanish. Every text displayed on screen has it’s own array of strings where each index of the array is the different languages for that text. Due to different languages having varying subject and verb alignment for their grammar we stored whole sentences. 
For the translations, we used Google Translate. Some phrases with less words could be easily taken out of context by the translator so we would surround the words with other words to put it into context. For example “save” can be interpreted as saving a life instead of saving a game state for storage. So in google translate we would put “save file” and used the word in that context. 
The language can be selected in the drop down menu by clicking on menu -> 🌐 inside the game. The player does not have to do a special option launch to choose the language. 


### Mobile Installation
The game is able to be downloaded on the live server. We couldn't figure out how to get it "properly" downloaded in github pages, because on mobile the game claims that the github site does not exist.

### Mobile Play (Offline)
Mobile play was almost achieved. The game is downloadable on both computer and mobile, but only playable on computer. 

## Reflection
Andrew worked on the internationalization and localization. Brendan worked on porting to mobile. At this point, we were all tired and had other projects to take care of. We didn't finish everything, but did as much as we could. We met up in a discord call and got enough of F2 finished, but F3 was too difficult. Not much code had to be changed, though this is mostly because we were also working on F2 at the same time.
