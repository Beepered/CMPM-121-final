class SaveManager {
  static storageKey = "save_game";

  constructor() {
    this.emitter = EventDispatcher.getInstance();

    // Set up listeners
    this.emitter.on("save-game", this.saveGame.bind(this));
    this.emitter.on("load-game", this.loadGame.bind(this));
    this.emitter.on("delete-save", this.deleteSave.bind(this));
  }

  saveGame(slotName, gameState) {
    const saves = SaveManager.getallSaves();
    saves[slotName] = gameState;
    localStorage.setItem(SaveManager.storageKey, JSON.stringify(saves));
    console.log(`Game saved in ${slotName}`);
  }

  loadGame(slotName) {
    const saves = SaveManager.getallSaves();
    if (saves[slotName]) {
      this.emitter.emit("switch-state", saves[slotName]);
      console.log(`Game loaded: ${slotName}`);
    } else {
      console.warn(`No save found for: ${slotName}`);
    }
  }

  static getallSaves() {
    const saves = localStorage.getItem(SaveManager.storageKey);
    const savedSlots = saves ? JSON.parse(saves) : {};

    for (let i = 1; i <= 3; i++) { // Creates 3 empty slots
      const slotName = `Slot ${i}`;
      if (!savedSlots[slotName]) {
        savedSlots[slotName] = "Empty Slot"; // Mark empty slots
      }
    }
    return savedSlots;
  }

  deleteSave(slotName) {
    const saves = SaveManager.getallSaves();
    if (saves[slotName]) {
      delete saves[slotName];
      localStorage.setItem(SaveManager.storageKey, JSON.stringify(saves));
      console.log("Save slot: ${slotName} has been deleted");
    }
  }
}
