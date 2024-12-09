class UIScene extends Phaser.Scene {
    emitter: EventDispatcher;
    historyStack: number[];
    redoStack: number[];
    seedText!: Phaser.GameObjects.Text;
    weatherText!: Phaser.GameObjects.Text;
    endText!: Phaser.GameObjects.Text;
    slotWindow!: Phaser.GameObjects.Container;
    dropdownToggle!: Phaser.GameObjects.Text;
    dropdownMenu!: Phaser.GameObjects.Container;

    constructor(){
        super("uiScene")
        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.historyStack =[];
        this.redoStack = [];
    }
    
    preload(){
        this.load.json('language', 'src/Utils/language.json')
    }

    create(){
        const txt = this.cache.json.get('language');

        this.seedText = this.add.text(20, 20, `${txt.Seeds[txt.lang]}: ${seeds}`, { fontSize: '20px' })
        this.weatherText = this.add.text(20, 35, `${txt.Weather[txt.lang]}: ${currentWeather}`, { fontSize: '20px' })

        this.endText = this.add.text(gameWidth / 2, gameHeight / 2, `${txt.GAMEFINISHED[txt.lang]}`, { fontSize: '60px' }).setOrigin(0.5, 0.5)
        this.endText.visible = false

        this.slotWindow = this.add.container(0, 0);

        const menuButton = this.add.rectangle(this.cameras.main.width - 90, 0, 90, 30, 0x404040).setOrigin(0).setInteractive()
        menuButton.on("pointerdown", () => this.toggleDropdownMenu());
        this.dropdownToggle = this.add.text(800, 10, txt.Menu[txt.lang], { fontSize: '16px', color: '#ffffff' })

        // Position the button dynamically
        this.dropdownToggle.setScrollFactor(0);
        this.dropdownToggle.setPosition(this.cameras.main.width - this.dropdownToggle.width - 25, 8);

        // Handle resizing
        this.scale.on('resize', (gameSize: { width: any; height: any; }) => {
            const { width, height } = gameSize;
            this.cameras.main.setSize(width, height); // Resize the camera
            this.dropdownToggle.setPosition(width - this.dropdownToggle.width - 10, 10);
        });

        // Create the dropdown menu
        this.createDropdownMenu();
    }

    resetAllTxt(){
        const txt = this.cache.json.get('language');
        
        this.seedText.text = txt.Seeds[txt.lang] + ": " + seeds;
        this.weatherText.text = txt.Weather[txt.lang] + currentWeather;

        this.endText.text = txt.GAMEFINISHED[txt.lang]
        this.endText.visible = false

        this.dropdownToggle.text = txt.Menu[txt.lang]
    }
    
    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
        this.emitter.on("plant", this.Plant.bind(this));
        // this.emitter.on("reap", this.Reap.bind(this));
        this.emitter.on("end-game", this.endGame.bind(this));
        this.emitter.on("undo", this.undo.bind(this));
        this.emitter.on("redo", this.redo.bind(this));
    }

    NextTurn(){
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
        console.log("UNDOCALLED")
        if(this.historyStack.length > 0){
            const tmp = seeds;
            this.redoStack.push(tmp);
            const prevState:number = this.historyStack.pop()!;
            seeds = prevState;
            console.log("Seeds: " + seeds);
            this.updateUI();
        }
    }
    
    redo(){
        if (this.redoStack.length > 0) {
            this.historyStack.push(seeds);
            const nextState: number = this.redoStack.pop()!;
            console.log(nextState)
            seeds = nextState;

            this.updateUI();
        }
    }

    endGame() {
        this.create();
        this.endText.visible = true
    }

    updateUI(){
        const txt = this.cache.json.get('language');
        // change to seeds
        this.seedText.text = `${txt.Seeds[txt.lang]}: ${seeds}`
        this.weatherText.text = `${txt.Weather[txt.lang]}: ${currentWeather}`
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
        const txt = this.cache.json.get('language');
        this.dropdownMenu = this.add.container(0, 0);
        this.dropdownMenu.setDepth(10);
        const dropdownBg = this.add.rectangle(0, 0, 150, 130, 0x333333).setOrigin(0);
        dropdownBg.setDepth(3);
    
        const saveButton = this.add.text(55, 10, txt.Save[txt.lang][0]).setInteractive();
        const loadButton = this.add.text(55, 40, txt.Load[txt.lang]).setInteractive();
        const deleteButton = this.add.text(47, 70, txt.Delete[txt.lang]).setInteractive();
        const languageButton = this.add.text(39, 100, "language").setInteractive();
    
        // Event handlers for each button
        saveButton.on("pointerdown", () => this.showSlotWindow("save"));
        loadButton.on("pointerdown", () => this.showSlotWindow("load"));
        deleteButton.on("pointerdown", () => this.showSlotWindow("delete"));
        languageButton.on("pointerdown", () => this.showSlotWindow("language"))
    
        this.dropdownMenu.add([dropdownBg, saveButton, loadButton, deleteButton, languageButton]);
        this.dropdownMenu.visible = false;
    }

    changeLanguage(){
        const txt = this.cache.json.get('language');
        const langChoices = ["English ", "中文 ", "日本語 ", "Français ", "Espagnole "];
        let yPos = -45; // Position for the first button
        langChoices.forEach((lang, i) => {
            // Create language button
            
            const langButton = this.add.text(0, yPos, lang, {
                fontSize: "18px",
                color: "#fff",
                backgroundColor: "black",
                padding: { x: 10, y: 5 },
            }).setOrigin(0.5).setInteractive();
            langButton.on("pointerdown", () => {
                txt.lang = i;
                this.resetAllTxt();
                this.slotWindow.removeAll(true)
            });
            this.slotWindow.add(langButton);
            yPos += 25; // Move the next button down
        })
    }

    showSlotWindow(action: string) {
        const txt = this.cache.json.get('language');
        // Close the dropdown menu
        this.dropdownMenu.visible = false;
    
        // Clear any existing slot buttons
        this.slotWindow.removeAll(true);
    
        // Centralize the slot window
        const x = this.cameras.main.width / 2;
        const y = this.cameras.main.height / 2;

        let windowHeight = 200;

        let actiontxt = "language"; //set to language because thre is no if statement for language until after it's used
        if(action == "save"){
            actiontxt = txt.Save[txt.lang][0]
        }else if(action == "load"){
            actiontxt = txt.Load[txt.lang]
        }else if(action == "delete"){
            actiontxt = txt.Delete[txt.lang]
            windowHeight += 40
        }
    
        // Add background
        const bg = this.add.rectangle(0, 0, 300, windowHeight, 0x222222).setOrigin(0.5);
        this.slotWindow.add(bg);
        
        // Add title text
        const titleText = this.add.text(0, -80, `${actiontxt} ${txt.Slot[txt.lang][1]}`, {
            fontSize: "20px",
            color: "#fff",
        }).setOrigin(0.5);
        this.slotWindow.add(titleText);

        // Position and display the slot window
        this.slotWindow.setPosition(x, y);
        this.slotWindow.setVisible(true);

        // Add Close Button
        const closeButton = this.add.text(0, 80, txt.Close[txt.lang], {
            fontSize: "18px",
            backgroundColor: "#cc0000",
            color: "#fff",
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();
    
        closeButton.on("pointerdown", () => this.slotWindow.removeAll(true));
        this.slotWindow.add(closeButton);

        //for the language option only
        if(action == "language"){
            this.changeLanguage();
            return;
        }
    
        // Define slots
        const slots = [txt.Slot[txt.lang][0] + "1", txt.Slot[txt.lang][0] + "2", txt.Slot[txt.lang][0] + "3"];
        let yPos = -30; // Position for the first button
    
        slots.forEach((slot) => {
            // Get data from localStorage
            const slotData = localStorage.getItem(slot);
    
            // Determine button text and color
            const isEmpty = !slotData || slotData === `${txt.Empty[txt.lang]} ${txt.Slot[txt.lang][0]}`;
            const slotText = isEmpty ? `${txt.Empty[txt.lang]} ${txt.Slot[txt.lang][0]}` : `${slot} - ${txt.Save[txt.lang][1]}`;
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
    
        
    }

    handleSlotAction(action: string, slot: string, slotButton: Phaser.GameObjects.Text) {
        const playScene = this.scene.get("playScene") as Play; // Get Play.js methods
        const txt = this.cache.json.get('language')
        switch (action) {
            case "save":
                console.log(`Saving to slot: ${slot}`);
                playScene.Save(slot); // Perform the save
                // Dynamically update button text and color
                slotButton.setText(`${slot} - ${txt.Save[txt.lang][1]}`);
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
                slotButton.setText(`${txt.Empty[txt.lang]} ${txt.Slot[txt.lang][0]}`);
                slotButton.setStyle({ backgroundColor: "#333" });
                break;
        }
    }
}