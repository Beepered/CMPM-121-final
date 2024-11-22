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
        this.emitter = EventDispatcher.getInstance();
        // this.turnSystem = new TurnSystem(this); // not sure if needed

        this.gameObjects = this.add.group({
            runChildUpdate: true
        })
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");
        this.gameObjects.add(this.player);

        this.setListeners();

        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q) // testing
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // test button
            this.emitter.emit("next-turn")
            this.emitter.emit("param-test", 33)
        }
    }

    setListeners() {
        this.emitter.on("next-turn", this.test.bind(this));
    }

    test(){
        console.log("next turn received")
    }
}