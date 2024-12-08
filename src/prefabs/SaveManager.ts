class SaveManager {
  static storageKey = "save_game";
  static initialized = false;
  static emitter = EventDispatcher.getInstance();

  constructor() {

    SaveManager.initializeSlots();

    // Set up listeners
    SaveManager.emitter.on("save-game", SaveManager.saveGame.bind(this));
    SaveManager.emitter.on("load-game", SaveManager.loadGame.bind(this));
    SaveManager.emitter.on("delete-save", SaveManager.deleteSave.bind(this));
  }

  static initializeSlots() {
    console.log("Initializing save slots...");
    const saves = localStorage.getItem(SaveManager.storageKey);

    if (saves) {
      const parsedSaves = JSON.parse(saves);

      for (let i = 1; i <= 3; i++) {
        const slotName = `Slot ${i}`;
        if (!parsedSaves[slotName]) {
          parsedSaves[slotName] = "Empty Slot";
        }
      }

      localStorage.setItem(SaveManager.storageKey, JSON.stringify(parsedSaves));
      console.log("Updated Save Slots:", parsedSaves);
    } else {
      const emptySlots = {
        "Slot 1": "Empty Slot",
        "Slot 2": "Empty Slot",
        "Slot 3": "Empty Slot",
      };
      localStorage.setItem(SaveManager.storageKey, JSON.stringify(emptySlots));
      console.log("Empty slots initialized:", emptySlots);
    }
    SaveManager.initialized = true;
  }

  static saveGame(slotName: string, gameState) {
    const saves = SaveManager.getallSaves();
    const fullyGrownCount = gameState.grid.flat().filter((cell) => {
      return cell.plant && cell.plant.growth >= 3;
    }).length;
    saves[slotName] = { gameState, fullyGrownCount };
    localStorage.setItem(SaveManager.storageKey, JSON.stringify(saves));
    console.log(`Game saved in ${slotName}`);
  }

  static loadGame(slotName) {
    const saves = SaveManager.getallSaves();
    if (saves[slotName] && saves[slotName] !== "Empty Slot") {
      const gameState = saves[slotName];

      // Re-emit fully-grown events if needed
      const fullyGrownCount = gameState.fullyGrownCount || 0;
      for (let i = 0; i < fullyGrownCount; i++) {
        SaveManager.emitter.emit("fully-grown");
      }

      SaveManager.emitter.emit("switch-state", gameState);
      console.log(`Game loaded from ${slotName}`);
      console.log("GameState after loading:", gameState);
      gameState.grid.forEach((row: Cell[], i:number) => {
        row.forEach((cell:Cell, j:number) => {
          if (cell.plant) {
            console.log(
              `Plant at ${i}, ${j}: Type=${cell.plant.type}, Growth=${cell.plant.growth}`
            );
          }
        });
      });
    } else {
      console.warn(`No save found for: ${slotName}`);
    }
  }

  static getallSaves() {
    if (!SaveManager.initialized) {
      SaveManager.initializeSlots(); // Ensure slots exist before proceeding
    }

    const saves = localStorage.getItem(SaveManager.storageKey);
    console.log("Fetching all saves:", saves);
    return saves ? JSON.parse(saves) : {};
  }

  static deleteSave(slotName: string) {
    const saves = SaveManager.getallSaves();
    if (saves[slotName] && saves[slotName] !== "Empty Slot") {
      saves[slotName] = "Empty Slot"; // Reset slot to empty
      localStorage.setItem(SaveManager.storageKey, JSON.stringify(saves));
      console.log(`Save slot: ${slotName} has been reset to empty`);
    }
  }
}
