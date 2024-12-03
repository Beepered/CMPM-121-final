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
        const saves = Object.keys(localStorage); // Get all keys in localStorage
        let yPos = 10; // Initial position for buttons
        this.slotWindow.removeAll(); // Clear any previous slot buttons

        saves.forEach((slotName) => {
            const slotButton = this.add.text(10, yPos, slotName, { fontSize: '16px', color: '#ffffff' }).setInteractive();
            slotButton.on("pointerdown", () => this.handleSlotAction(action, slotName));
            this.slotWindow.add(slotButton);
            yPos += 40; // Position next button
        });
    }

    handleSlotAction(action, slot) {
        const playScene = this.scene.get("playScene");
        switch (action) {
            case "save":
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