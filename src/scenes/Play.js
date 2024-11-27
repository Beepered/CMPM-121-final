class Play extends Phaser.Scene {
    preload(){
        this.load.image("player", "assets/Player_Character.png")
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

        this.XTiles = 3;
        this.YTiles = 3;
    }

    create(){
        this.scene.launch("uiScene")
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q) // testing

        this.gameObjects = this.add.group({
            runChildUpdate: true
        })
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");
        this.gameObjects.add(this.player);

        /*
        Brendan Idea spouting:
        make 1d array of cells because when will we need to change a specific cell?
        1 byte array buffer for each cell?
        0000 0000
        it just stores the sun, water level, and plant
        const buffer = new ArrayBuffer()
        new DataView(buffer)
        */

        this.cellGroup = this.add.group()
        this.grid = this.MakeCellGrid(this.XTiles, this.YTiles);
        this.GameBehavior();
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // test button
            this.player.playersTurn = false;
            this.emitter.emit("end-game")
        }
    }

    createCell(x, y){
        const cell = new Cell(this, x, y, "grass");
        this.cellGroup.add(cell);
        return cell;
    }

    MakeCellGrid(x, y){
        var cellArr = [];
        for(let i = 1; i < x + 1 ; i++){
            console.log((gameWidth / 128))
            for(let j = 1; j < y + 1; j++){
                
                cellArr.push(this.createCell(gameWidth / i, gameHeight / j));
            }
        }
        return cellArr;
    }

    GameBehavior(){
        this.physics.add.overlap(this.player, this.cellGroup, (player, cell) => {
            if(player.cell != cell){
                this.emitter.emit("next-turn")
            }
            player.cell = cell;
        })
    }
}