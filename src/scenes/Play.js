class Play extends Phaser.Scene {
    preload(){
        this.load.image("testPlayer", "assets/player.png")
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
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)//Undo tmp button
        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P) // Redo tmp button

        this.gameObjects = this.add.group({
            runChildUpdate: true
        })
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");
        this.gameObjects.add(this.player);

        /*
        Brendan Idea spouting:
        DONE: make 1d array of cells because when will we need to change a specific cell?
        1 byte array buffer for each cell?
            0000 0000
            it just stores the sun, water level, and plant
        
        */

        this.cellGroup = this.add.group()
        this.grid = this.MakeCellGrid(this.XTiles, this.YTiles);

        this.canSwitchCells = true
        this.checkCellTime = 0.02;
        this.checkCellList = []
        
        this.GameBehavior();
    }

    update(delta){
        this.checkCellTime -= delta
        if(this.checkCellTime <= 0){
            this.canSwitchCells = !this.canSwitchCells
            if(this.canSwitchCells == true){
                this.CalculateWhichCell();
            }
            this.checkCellTime = 0.02;
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // test button
            // this.player.playersTurn = false;
            // this.emitter.emit("end-game")
            this.emitter.emit("next-turn");
            this.player.NextTurn();
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyO)){ //Undo Btn
            this.player.gameStateManager.undo();
            this.emitter.emit("undo"); //make later
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyP)){ //Redo Btn
            this.player.gameStateManager.redo();
            this.emitter.emit("redo");//make later
        }
    }
    switchState(state) {
        
    };
    createCell(x, y){
        const cell = new Cell(this, x, y, "grass");
        this.cellGroup.add(cell);
        return cell;
    }

    MakeCellGrid(x, y){
        const minXPos = 100;
        const minYPos = 70;
        var cellArr = [];
        for(let i = 0; i < x ; i++){
            for(let j = 0; j < y; j++){
                cellArr.push(this.createCell(minXPos + gameWidth / this.XTiles * i, minYPos + gameHeight / this.YTiles * j));
            }
        }
        return cellArr;
    }

    GameBehavior(){ // only declared once, not in update()
        this.physics.add.overlap(this.player, this.cellGroup, (player, cell) => {
            if(this.canSwitchCells){
                this.checkCellList.push(cell)
            }
        })
    }

    CalculateWhichCell(){
        // checks all cells the player is colliding with
        // If cell contains original cell, just use that otherwise take the first cell
        let newCell = this.player.cell
        for(let i = 0; i < this.checkCellList.length; i++){
            if(i == 0){
                newCell = this.checkCellList[0]
            }
            else if(this.checkCellList[i] == this.player.cell){
                newCell = this.player.cell
                break;
            }
        }
       // this.emitter.emit("next-turn")
        this.player.cell = newCell;
        this.checkCellList = []
    }
}