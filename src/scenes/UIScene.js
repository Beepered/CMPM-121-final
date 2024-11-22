class UIScene extends Phaser.Scene {
    constructor(){
        super("uiScene")
        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.seeds = 3;
    }

    create (){
        this.seedText = this.add.text(gameWidth / 12, gameHeight / 12, `Seeds: ${this.seeds}`, 35)
    }
    
    // absolutely terrible way to do this
    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
        this.emitter.on("plant", this.updateText.bind(this));
    }

    NextTurn(){
        this.seeds = 3;
    }

    updateText(){
        this.seeds--
        this.seedText.text = `Seeds: ${this.seeds}`
    }
}