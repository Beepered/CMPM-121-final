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
        this.gameObjects = this.add.group({
            runChildUpdate: true
        })
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");
        this.gameObjects.add(this.player);

        // test
        this.player.addListener("win-event", ()=>{
            console.log("player received win event")
        })

        this.bus.dispatchEvent(new Event("win-event"))
    }

    update(){
    }
}