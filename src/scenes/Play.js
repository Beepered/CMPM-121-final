class Play extends Phaser.Scene {
    preload(){
        this.load.image("player", "assets/player.png")
        this.load.image("testplant", "assets/testplant.png")
        this.load.image("grass", "assets/GrassV1.png")

        // flowers
        this.load.image("pink", "assets/Pink_Flower.png")
        this.load.image("purple", "assets/Purple_Flower.png")
        this.load.image("red", "assets/Red_Flower.png")
    }

    constructor(){
        super("playScene")
        this.emitter = EventDispatcher.getInstance();
    }

    create(){
        this.scene.launch("uiScene")
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q) // testing

        this.gameObjects = this.add.group({
            runChildUpdate: true
        })
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");
        this.gameObjects.add(this.player);

        this.cellGroup = this.add.group()
        this.createCell(gameWidth / 4, gameHeight / 2)
        this.createCell(gameWidth / 2, gameHeight / 2)
        this.createCell(gameWidth / 1.3, gameHeight / 2)
        this.physics.add.overlap(this.player, this.cellGroup, (player, cell) => {
            if(player.cell != cell){
                this.emitter.emit("next-turn")
            }
            player.cell = cell;
        })
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // test button
            this.emitter.emit("next-turn")
        }
    }

    createCell(x, y){
        const cell = new Cell(this, x, y, "grass");
        this.cellGroup.add(cell);
        return cell;
    }
}