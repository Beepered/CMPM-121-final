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
        this.weatherText = this.add.text(gameWidth / 13, gameHeight / 9, `Forecast: ${weatherList[0]}`, { fontSize: '20px' })

        this.endText = this.add.text(gameWidth / 2, gameHeight / 2, `GAME FINISHED`, { fontSize: '60px' }).setOrigin(0.5, 0.5)
        this.endText.visible = false

        this.createDropdownMenu();
        this.slotWindow = this.add.container(0, 0);

        const menuButton = this.add.rectangle(this.cameras.main.width - 90, 0, 90, 30, 0x404040).setOrigin(0).setInteractive()
        menuButton.on("pointerdown", () => this.toggleDropdownMenu());
        this.dropdownToggle = this.add.text(800, 10, "Menu", { fontSize: '16px', color: '#ffffff' })

        // Position the button dynamically
        this.dropdownToggle.setScrollFactor(0);
        this.dropdownToggle.setPosition(this.cameras.main.width - this.dropdownToggle.width - 25, 8);

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
        // this.emitter.on("reap", this.Reap.bind(this));
        this.emitter.on("end-game", this.endGame.bind(this));
        this.emitter.on("undo", this.undo.bind(this)); // why is this commented?
        this.emitter.on("redo", this.redo.bind(this));
    }

    NextTurn(){
        // change to seeds
        const tmp = seeds;
        this.historyStack.push(tmp);
        seeds = 3;
    
        this.updateUI();
    }

    Plant(){
        const tmp = seeds;
        this.historyStack.push(tmp);
        this.redoStack = [];
        seeds--;

        this.updateUI();
    }

    Reap(){
        this.historyStack.push(seeds);
        this.redoStack = [];
    }

    undo(){
        if(this.historyStack.length > 0){
            const tmp = seeds;
            this.redoStack.push(tmp);
            const prevState = this.historyStack.pop();
            seeds = prevState;

            this.updateUI();
        }
    }
    
    redo(){
        if (this.redoStack.length > 0) {
            this.historyStack.push(seeds);
            const nextState = this.redoStack.pop();
            console.log(nextState)
            seeds = nextState;

            this.updateUI();
        }
    }

    endGame() {
        this.endText.visible = true
    }

    updateUI(){
        // change to seeds
        this.seedText.text = `Seeds: ${seeds}`
        this.weatherText.text = `Forecast: ${weatherList[0]}`
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
        const dropdownBg = this.add.rectangle(0, 0, 150, 110, 0x333333).setOrigin(0);
        dropdownBg.setDepth(2);
    
        const saveButton = this.add.rectangle(0, 0, 150, 100 / 3, 0x404040).setInteractive().setOrigin(0)
        const loadButton = this.add.rectangle(0, 40, 150, 100 / 3, 0x404040).setInteractive().setOrigin(0)
        const deleteButton = this.add.rectangle(0, 80, 150, 100 / 3, 0x404040).setInteractive().setOrigin(0)

        // Event handlers for each button
        saveButton.on("pointerdown", () => this.showSlotWindow("save"));
        loadButton.on("pointerdown", () => this.showSlotWindow("load"));
        deleteButton.on("pointerdown", () => this.showSlotWindow("delete"));

        const saveText = this.add.text(55, 10, "Save").setOrigin(0)
        const loadText = this.add.text(55, 50, "Load").setOrigin(0)
        const deleteText = this.add.text(47, 90, "Delete").setOrigin(0)
    
        this.dropdownMenu.add([dropdownBg, saveButton, saveText, loadButton, loadText, deleteButton, deleteText]);
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