class Play extends Phaser.Scene {
    preload(){
        this.load.image("player", "assets/player.png") // I want to find a way to move the preload into the player script
    }

    constructor(){
        console.log("start play")
        super("playScene")
    }

    create(){
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");

        this.gameObjects = [] // list of all game objects and loop over and call their update
        this.gameObjects.push(this.player)
    }

    update(){
        this.gameObjects.forEach((object) => {
            object.update();
        })
    }
}