class UIScene extends Phaser.Scene {
    constructor(){
        super("uiScene")
        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.seeds = 3;
        this.winCon = 3;

        this.historyStack =[];
        this.redoStack = [];
    }

    create (){
        this.seedText = this.add.text(gameWidth / 12, gameHeight / 12, `Seeds: ${this.seeds}`, { fontSize: '20px' })

        this.endText = this.add.text(gameWidth / 2, gameHeight / 2, `GAME FINISHED`, { fontSize: '60px' }).setOrigin(0.5, 0.5)
        this.endText.visible = false
        this.historyStack.push({seeds: this.seeds, turnsTaken: this.turnsTaken});

        this.createDropdownMenu();
        this.slotWindow = this.add.container(0, 0);

        this.dropdownToggle = this.add.text(800, 10, "Menu", { fontSize: '16px', color: '#123456' }).setInteractive();
    this.dropdownToggle.on("pointerdown", () => this.toggleDropdownMenu());

    // Position the button dynamically
    this.dropdownToggle.setScrollFactor(0);
    this.dropdownToggle.setPosition(this.cameras.main.width - this.dropdownToggle.width - 10, 10);

    // Handle resizing
    this.scale.on('resize', (gameSize) => {
        const { width, height } = gameSize;
        this.cameras.main.setSize(width, height); // Resize the camera
        this.dropdownToggle.setPosition(width - this.dropdownToggle.width - 10, 10);
    });

    // Create the dropdown menu
    this.createDropdownMenu();

    }
    
    // absolutely terrible way to do this
    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
        this.emitter.on("plant", this.Plant.bind(this));
        this.emitter.on("reap", this.Reap.bind(this));
        this.emitter.on("end-game", this.endGame.bind(this));
        this.emitter.on("fully-grown", this.winCon.bind(this));
        this.emitter.on("undo", this.undo.bind(this));
        this.emitter.on("redo", this.redo.bind(this));
    }

    NextTurn(){
        this.historyStack.push({seeds: this.seeds, turnsTaken: this.turnsTaken});
        this.seeds = 3;
    
        this.updateUI();
    }

    Plant(){
       // this.historyStack.push({seeds: this.seeds, turnsTaken: this.turnsTaken});
        this.seeds--;
        this.redoStack = [];
        
        this.updateUI();
    }

    Reap(){
       // this.historyStack.push({seeds: this.seeds, turnsTaken: this.turnsTaken});
        this.redoStack = [];
    }

    undo(){
        if(this.historyStack.length > 0){
            this.redoStack.push({seeds: this.seeds, turnsTaken: this.turnsTaken});
            const prevState = this.historyStack.pop();
            this.seeds = prevState.seeds;
            this.turnsTaken = prevState.turnsTaken;

            this.updateUI();
        }
    }
    
    redo(){
        if (this.redoStack.length > 0) {
            this.historyStack.push({seeds: this.seeds, turnsTaken: this.turnsTaken});
            const nextState = this.redoStack.pop();
            this.seeds = nextState.seeds;
            this.turnsTaken = nextState.turnsTaken;

            this.updateUI();
        }
    }

    endGame() {
        this.endText.visible = true
    }

    winCon(){
        this.winCon--;
        if(this.winCon <= 0){
            this.emitter.emit("end-game");
        }
    }

    updateUI(){
        this.seedText.text = `Seeds: ${this.seeds}`
    }

    toggleDropdownMenu() {
        const menuButtonBounds = this.dropdownToggle.getBounds();

        // Set the position of the dropdown menu to open below the button
        this.dropdownMenu.setPosition(
            menuButtonBounds.x - 110,
            menuButtonBounds.y
        );

        // Toggle visibility
        this.dropdownMenu.visible = !this.dropdownMenu.visible;
    }


    createDropdownMenu() {

        this.dropdownMenu = this.add.container(0, 0);
        this.dropdownMenu.setDepth(10);
        const dropdownBg = this.add.rectangle(0, 0, 150, 100, 0x333333).setOrigin(0);
        dropdownBg.setDepth(2);
    
        const saveButton = this.add.text(55, 10, "Save").setInteractive();
        const loadButton = this.add.text(55, 40, "Load").setInteractive();
        const deleteButton = this.add.text(47, 70, "Delete").setInteractive();
    
        // Event handlers for each button
        saveButton.on("pointerdown", () => this.showSlotWindow("save"));
        loadButton.on("pointerdown", () => this.showSlotWindow("load"));
        deleteButton.on("pointerdown", () => this.showSlotWindow("delete"));
    
        this.dropdownMenu.add([dropdownBg, saveButton, loadButton, deleteButton]);
        this.dropdownMenu.visible = false;
    }

    showSlotWindow(action) {
        // Close the dropdown menu when the slot window is opened
        this.dropdownMenu.visible = false;
    
        // Clear previous slot buttons
        this.slotWindow.removeAll(true);
    
        // Centralize the Slot Window
        const x = this.cameras.main.width / 2;
        const y = this.cameras.main.height / 2;
    
        // Add background rectangle
        const bg = this.add.rectangle(0, 0, 300, 200, 0x222222).setOrigin(0.5);
        this.slotWindow.add(bg);
    
        // Add title text
        const titleText = this.add.text(0, -80, `${action.toUpperCase()} SLOTS`, {
            fontSize: "20px",
            color: "#fff",
        }).setOrigin(0.5);
        this.slotWindow.add(titleText);

        const slots = ["slot1", "slot2", "slot3"];
        slots.forEach((slot) => {
            if (!localStorage.getItem(slot)) {
                localStorage.setItem(slot, "Empty slot");
            }
        });
    
        // Retrieve slots from localStorage
        let yPos = -30;
    slots.forEach((slot, index) => {
        
        const slotText = this.add.text(0, yPos, slot, {
            fontSize: "18px",
            color: "#fff",
            backgroundColor: "#333",
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();

        // Add interaction for the slot
        slotText.on("pointerdown", () => this.handleSlotAction(action, slot, slotText));

        this.slotWindow.add(slotText);
        yPos += 40; // Move next button down
    });

    // Add a Close Button
    const closeButton = this.add.text(0, 80, "Close", {
        fontSize: "18px",
        backgroundColor: "#cc0000",
        color: "#fff",
        padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive();

    closeButton.on("pointerdown", () => this.slotWindow.removeAll(true));

    this.slotWindow.add(closeButton);

    // Position the slot window in the center of the screen
    this.slotWindow.setPosition(x, y);
    this.slotWindow.setVisible(true);
}

    handleSlotAction(action, slot) {
        const playScene = this.scene.get("playScene");
        switch (action) {
            case "save":
                console.log(`Attempting to save game slot: ${slot}`);
                playScene.Save(slot); // Calls Play.js `Save` method
                break;
            case "load":
                playScene.Load(slot); // Calls Play.js `Load` method
                break;
            case "delete":
                localStorage.removeItem(slot); // Remove from storage
                break;
        }
    }
    
}