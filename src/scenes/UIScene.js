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
    
}