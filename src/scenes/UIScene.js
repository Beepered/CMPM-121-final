class UIScene extends Phaser.Scene {
  constructor() {
    super("uiScene");
    this.emitter = EventDispatcher.getInstance();
    this.setListeners();

    this.seeds = 3;
    this.winCon = 3;

    this.turnsTaken = 0;
  }

  create() {
    this.seedText = this.add.text(
      gameWidth / 12,
      gameHeight / 12,
      `Seeds: ${this.seeds}`,
      { fontSize: "20px" }
    );
    this.turnsText = this.add.text(
      gameWidth / 12,
      gameHeight / 7,
      `Turns: ${this.turnsTaken}`,
      { fontSize: "20px" }
    );

    this.endText = this.add
      .text(gameWidth / 2, gameHeight / 2, `GAME FINISHED`, {
        fontSize: "60px",
      })
      .setOrigin(0.5, 0.5);
    this.endText.visible = false;

    this.mainButton = this.add
      .text(700, 10, "Menu", {
        fontSize: "16px",
        backgroundColor: "#555",
        color: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(-0.25, 0) // Align to the top-right corner
      .setInteractive();

    // Dropdown menu (hidden by default)
    this.dropdownMenu = this.add.container(670, 30).setVisible(false);
    this.createDropdownMenu();

    // Close dropdown if clicked outside
    this.input.on("pointerdown", (pointer) => {
      if (!this.mainButton.getBounds().contains(pointer.x, pointer.y)) {
        this.dropdownMenu.setVisible(false);
      }
    });

    this.mainButton.on("pointerdown", () => {
      this.dropdownMenu.setVisible(!this.dropdownMenu.visible);
    });
  }

  createDropdownMenu() {
    const dropdownBg = this.add
      .rectangle(0, 0, 150, 100, 0x0000ff)
      .setOrigin(0);

    const saveButton = this.add
      .text(45, 10, "Save", {
        fontSize: "16px",
        color: "#fff",
      })
      .setInteractive();

    const loadButton = this.add
      .text(45, 40, "Load", {
        fontSize: "16px",
        color: "#fff",
      })
      .setInteractive();

    const deleteButton = this.add
      .text(37, 70, "Delete", {
        fontSize: "16px",
        color: "#fff",
      })
      .setInteractive();

    saveButton.on("pointerdown", () => this.showSlotWindow("save"));
    loadButton.on("pointerdown", () => this.showSlotWindow("load"));
    deleteButton.on("pointerdown", () => this.showSlotWindow("delete"));

    this.dropdownMenu.add([dropdownBg, saveButton, loadButton, deleteButton]);
  }

  showSlotWindow(action) {
    console.log(`Action triggered: ${action}`);
    this.dropdownMenu.setVisible(false);

    // Remove any existing slot window
    if (this.slotWindow) {
      this.slotWindow.destroy();
      console.log("Existing slot window destroyed.");
    }

    // Create slot window container
    this.slotWindow = this.add.container(400, 200); // Center the save window
    const bg = this.add.rectangle(0, 0, 300, 200, 0x222222).setOrigin(0.5);
    bg.setDepth(0);
    this.slotWindow.add(bg);
    const title = this.add.text(0, -80, `${action.toUpperCase()} SLOTS`, {
        fontSize: "20px",
        color: "#fff",
      })
      .setOrigin(0.5)
      .setDepth(1);

    // Display slots based on action
    const saves = SaveManager.getallSaves(); // Retrieve save data
    console.log("All saves fetched for display:", saves);
    const slots = Object.keys(saves); // Extract slot names
    console.log("Slot names extracted:", slots);

    const filteredSlots = slots.filter((slot) => {
      if (action === "save") return true; // Show all slots for saving
      return saves[slot] !== "Empty Slot"; // Only show filled slots for load/delete
    });
    console.log("Filtered slots for display:", filteredSlots);

    if (filteredSlots.length === 0) {
      const emptyText = this.add.text(0, -30, "No save slots found.", {
          fontSize: "18px",
          color: "#fff",
        })
        .setOrigin(0.5);

      this.slotWindow.add([bg, title, emptyText]);
      console.log("No slots to display. Showing 'No save slots found.'");
    } else {
      // Display slots based on action
      let yOffset = -30;
      filteredSlots.forEach((slot) => {
        console.log(`Rendering slot: ${slot}, Data: ${saves[slot]}`);
        const slotText =
          saves[slot] === "Empty Slot" ? `${slot} (Empty)` : slot;

        const slotButton = this.add.text(0, yOffset, slotText, {
            fontSize: "18px",
            backgroundColor:
              saves[slot] === "Empty Slot" ? "#555555" : "#0077cc",
            color: "#fff",
            padding: { x: 10, y: 5 },
          })
          .setOrigin(0.5)
          .setInteractive()
          .setDepth(10);

        slotButton.on("pointerdown", () => this.handleSlotAction(action, slot));
        this.slotWindow.add(slotButton);
        yOffset += 40;
      });
      console.log("Rendered all slots successfully.");
    }

    const closeButton = this.add
      .text(0, 80, "Close", {
        fontSize: "18px",
        backgroundColor: "#cc0000",
        color: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    closeButton.on("pointerdown", () => this.slotWindow.destroy());

    this.slotWindow.add([bg, title, closeButton]);
  }

  handleSlotAction(action, slot) {
    const saves = SaveManager.getallSaves();

    switch (action) {
      case "save":
        if (
          saves[slot] === "Empty Slot" ||
          confirm("This slot already contains a save. Overwrite?")
        ) {
          const gameState = this.getCurrentGameState();
          SaveManager.saveGame(slot, gameState);
          console.log(`Game saved in ${slot}`);
        }
        break;
      case "load":
        if (saves[slot] !== "Empty Slot") {
          SaveManager.loadGame(slot);
          console.log(`Game loaded from ${slot}`);
        }
        break;
      case "delete":
        if (
          saves[slot] !== "Empty Slot" &&
          confirm("Are you sure you want to delete this save?")
        ) {
          SaveManager.deleteSave(slot);
          console.log(`Deleted save from ${slot}`);
        }
        break;
    }
    console.log(`${action} executed on ${slot}`);
    if (this.slotWindow) {
      this.slotWindow.destroy();
    }
  }

  getCurrentGameState() {
    return {
      player: this.scene.get("playScene").player.serialize(),
      grid: this.scene
        .get("playScene")
        .grid.map((row) => row.map((cell) => cell.serialize())),
      turnsTaken: this.turnsTaken,
      seeds: this.seeds,
    };
  }

  // absolutely terrible way to do this
  setListeners() {
    this.emitter.on("next-turn", this.NextTurn.bind(this));
    this.emitter.on("plant", this.Plant.bind(this));
    this.emitter.on("end-game", this.endGame.bind(this));
    this.emitter.on("fully-grown", this.winCon.bind(this));
  }

  NextTurn() {
    this.seeds = 3;
    this.turnsTaken++;
    this.seedText.text = `Seeds: ${this.seeds}`;
    this.turnsText.text = `Turns: ${this.turnsTaken}`;
  }

  Plant() {
    this.seeds--;
    this.seedText.text = `Seeds: ${this.seeds}`;
  }

  endGame() {
    this.endText.visible = true;
    /* // Brendan: not sure what this does but commented out
        const scenes = this.scene.manager.getScenes(true); 
        scenes.forEach(scene => {
            if (scene.scene.key !== "creditScene") {
                this.scene.stop(scene.scene.key); 
            }
        });
    
        this.scene.start("creditScene");
        */
  }

  winCon() {
    this.winCon--;
    if (this.winCon <= 0) {
      this.emitter.emit("end-game");
    }
  }
}
