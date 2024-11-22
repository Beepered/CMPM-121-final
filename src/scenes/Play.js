class Play extends Phaser.Scene {
    preload(){
        this.load.image("player", "assets/player.png")
        this.load.image("testplant", "assets/testplant.png")
    }

    constructor(){
        super("playScene")
        this.bus = new EventTarget();
    }

    create(){
        this.emitter = EventDispatcher.getInstance(); //
        this.turnSystem = new TurnSystem(this);

        this.gameObjects = this.add.group({
            runChildUpdate: true
        })
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");
        this.gameObjects.add(this.player);

        this.setListeners();

        this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U) // testing
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyU)){ // test button
            this.emitter.emit("next-turn")
        }
    }

    setListeners() {
        this.emitter.on("next-turn", this.test.bind(this));
    }

    test(){
        console.log("next turn received")
    }
}