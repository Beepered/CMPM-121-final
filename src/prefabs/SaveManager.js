class SaveManager {
  constructor() {
    this.storageKey = "save_game";
    this.emitter = EventDispatcher.getInstance();

    // Set up listeners
    this.emitter.on("save-game", this.saveGame.bind(this));
    this.emitter.on("load-game", this.loadGame.bind(this));
    this.emitter.on("delete-save", this.deleteSave.bind(this));
  }

  // @param {string} slotName
  // @param {Object} gameState

  saveGame(slotName, gameState) {
    const saves = this.getallSaves()
    saves[slotName] = gameState
    localStorage.setItem(this.storageKey, JSON.stringify(saves))
    console.log(`Game saved in ${slotName}`)
  }
  

  loadGame(slotName) {
    const saves = this.getallSaves()
    if (saves[slotName]) {
      this.emitter.emit("switch-state", saves[slotName])
      console.log(`Game loaded: ${slotName}`)
    } else {
      console.warn(`No save found for: ${slotName}`)
    }
  }

  getallSaves() {
    const saves = localStorage.getItem(this.storageKey);
    return saves ? JSON.parse(saves) : {};
  }

  deleteSave(slotName) {
    const saves = this.getallSaves();
    if (saves[slotName]) {
      delete saves[slotName];
      localStorage.setItem(this.storageKey, JSON.stringify(saves));
      console.log("Save slot: ${slotName} has been deleted");
    }
  }
}
