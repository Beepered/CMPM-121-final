class SaveManager {
  static storageKey = "save_game";
  static initialized = false;

  constructor() {
    this.emitter = EventDispatcher.getInstance();

    this.initializeSlots();

    // Set up listeners
    this.emitter.on("save-game", this.saveGame.bind(this));
    this.emitter.on("load-game", this.loadGame.bind(this));
    this.emitter.on("delete-save", this.deleteSave.bind(this));
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

  static saveGame(slotName, gameState) {
    const saves = SaveManager.getallSaves();
    saves[slotName] = gameState;
    localStorage.setItem(SaveManager.storageKey, JSON.stringify(saves));
    console.log(`Game saved in ${slotName}`);
  }

  static loadGame(slotName) {
    const saves = SaveManager.getallSaves();
    if (saves[slotName] && saves[slotName] !== "Empty Slot") {
      this.emitter.emit("switch-state", saves[slotName]);
      console.log(`Game loaded from ${slotName}`);
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

  static deleteSave(slotName) {
    const saves = SaveManager.getallSaves();
    if (saves[slotName] && saves[slotName] !== "Empty Slot") {
      saves[slotName] = "Empty Slot"; // Reset slot to empty
      localStorage.setItem(SaveManager.storageKey, JSON.stringify(saves));
      console.log(`Save slot: ${slotName} has been reset to empty`);
    }
  }
}
