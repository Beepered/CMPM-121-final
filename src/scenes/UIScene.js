class UIScene extends Phaser.Scene {
    constructor(){
        super("uiScene")
        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.seeds = 3;
    }

    create (){
        this.seedText = this.add.text(gameWidth / 12, gameHeight / 12, `Seeds: ${this.seeds}`, { fontSize: '20px' })
    }
    
    // absolutely terrible way to do this
    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
        this.emitter.on("plant", this.Plant.bind(this));
    }

    NextTurn(){
        this.seeds = 3;
        this.seedText.text = `Seeds: ${this.seeds}`
    }

    Plant(){
        this.seeds--;
        this.seedText.text = `Seeds: ${this.seeds}`
    }
}