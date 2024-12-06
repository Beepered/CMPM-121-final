class UIScene extends Phaser.Scene {
    constructor(){
        super("uiScene")
        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.historyStack =[];
        this.redoStack = [];
    }

    create (){
        // use seeds not this.seeds
        this.seedText = this.add.text(gameWidth / 13, gameHeight / 12, `Seeds: ${seeds}`, { fontSize: '20px' })
        this.weatherText = this.add.text(gameWidth / 13, gameHeight / 9, `Weather: ${weather}`, { fontSize: '20px' })

        this.endText = this.add.text(gameWidth / 2, gameHeight / 2, `GAME FINISHED`, { fontSize: '60px' }).setOrigin(0.5, 0.5)
        this.endText.visible = false
        // this.historyStack.push({seeds: this.seeds, turnsTaken: this.turnsTaken});

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
    
    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
        this.emitter.on("plant", this.Plant.bind(this));
        this.emitter.on("reap", this.Reap.bind(this));
        this.emitter.on("end-game", this.endGame.bind(this));
        //this.emitter.on("undo", this.undo.bind(this)); // why is this commented?
        this.emitter.on("redo", this.redo.bind(this));
    }

    NextTurn(){
        // change to seeds
        this.historyStack.push(seeds);
    
        this.updateUI();
    }

    Plant(){
        // change to seeds
        this.historyStack.push(seeds);
        console.log(this.historyStack)
        seeds--;
        this.redoStack = [];
        
        this.updateUI();
    }

    Reap(){
        // change to seeds
        this.historyStack.push(seeds);
        this.redoStack = [];
    }

    undo(){
        if(this.historyStack.length > 0){
            // change to seeds. get rid of turnsTaken
            this.redoStack.push({seeds: seeds});
            const prevState = this.historyStack.pop();
            console.log(prevState)
            seeds = prevState.seeds;

            this.updateUI();
        }
    }
    
    redo(){
        if (this.redoStack.length > 0) {
            // change to seeds. get rid of turnsTaken
            this.historyStack.push({seeds: seeds});
            const nextState = this.redoStack.pop();
            seeds = nextState.seeds;

            this.updateUI();
        }
    }

    endGame() {
        this.create();
        this.endText.visible = true
    }

    updateUI(){
        // change to seeds
        this.seedText.text = `Seeds: ${seeds}`
        this.weatherText.text = `Weather: ${weather}`
    }

    toggleDropdownMenu() {
        const menuButtonBounds = this.dropdownToggle.getBounds();

        // Set the position of the dropdown menu to open below the button
        this.dropdownMenu.setPosition(
            menuButtonBounds.x - 110,
            menuButtonBounds.y + 15
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
        // Close the dropdown menu
        this.dropdownMenu.visible = false;
    
        // Clear any existing slot buttons
        this.slotWindow.removeAll(true);
    
        // Centralize the slot window
        const x = this.cameras.main.width / 2;
        const y = this.cameras.main.height / 2;
    
        // Add background
        const bg = this.add.rectangle(0, 0, 300, 200, 0x222222).setOrigin(0.5);
        this.slotWindow.add(bg);
    
        // Add title text
        const titleText = this.add.text(0, -80, `${action.toUpperCase()} SLOTS`, {
            fontSize: "20px",
            color: "#fff",
        }).setOrigin(0.5);
        this.slotWindow.add(titleText);
    
        // Define slots
        const slots = ["slot1", "slot2", "slot3"];
        let yPos = -30; // Position for the first button
    
        slots.forEach((slot) => {
            // Get data from localStorage
            const slotData = localStorage.getItem(slot);
    
            // Determine button text and color
            const isEmpty = !slotData || slotData === "Empty slot";
            const slotText = isEmpty ? "Empty slot" : `${slot} - Saved`;
            const slotColor = isEmpty ? "#333" : "#228B22";
    
            // Create slot button
            const slotButton = this.add.text(0, yPos, slotText, {
                fontSize: "18px",
                color: "#fff",
                backgroundColor: slotColor,
                padding: { x: 10, y: 5 },
            }).setOrigin(0.5).setInteractive();
    
            // Add click functionality
            slotButton.on("pointerdown", () => this.handleSlotAction(action, slot, slotButton));
            this.slotWindow.add(slotButton);
    
            yPos += 40; // Move the next button down
        });
    
        // Add Close Button
        const closeButton = this.add.text(0, 80, "Close", {
            fontSize: "18px",
            backgroundColor: "#cc0000",
            color: "#fff",
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();
    
        closeButton.on("pointerdown", () => this.slotWindow.removeAll(true));
        this.slotWindow.add(closeButton);
    
        // Position and display the slot window
        this.slotWindow.setPosition(x, y);
        this.slotWindow.setVisible(true);
    }

    handleSlotAction(action, slot, slotButton) {
        const playScene = this.scene.get("playScene"); // Get Play.js methods
        switch (action) {
            case "save":
                console.log(`Saving to slot: ${slot}`);
                playScene.Save(slot); // Perform the save
                // Dynamically update button text and color
                slotButton.setText(`${slot} - Saved`);
                slotButton.setStyle({ backgroundColor: "#228B22" });
                break;
    
            case "load":
                console.log(`Loading from slot: ${slot}`);
                playScene.Load(slot); // Perform the load
                playScene.UpdateCellText();
                break;
    
            case "delete":
                console.log(`Deleting slot: ${slot}`);
                localStorage.removeItem(slot); // Delete the slot
                // Reset button text and color
                slotButton.setText("Empty slot");
                slotButton.setStyle({ backgroundColor: "#333" });
                break;
        }
    }
}