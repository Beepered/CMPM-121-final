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
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E) // testing

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
        this.checkCellTime = 0.02; // how often to check for new cell
        this.checkTime = this.checkCellTime
        this.checkCellList = []

        this.GameBehavior();
        this.player.cell = this.CalculateWhichCell(); // doesn't do anything since it starts with "null"
    }

    update(time, delta){
        this.checkTime -= delta * 0.001
        if(this.checkTime <= 0){
            this.canSwitchCells = !this.canSwitchCells
            if(this.canSwitchCells == true){
                const newCell = this.CalculateWhichCell()
                if(newCell != null && newCell != this.player.cell){
                    this.emitter.emit("next-turn")
                    this.player.cell = newCell
                }
            }
            this.checkTime = this.checkCellTime
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // test button
            this.player.playersTurn = false;
            this.emitter.emit("end-game")
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyE)){ // test button
            this.ByteArrayStuff();
        }
    }

    createCell(x, y) {
        const cell = new Cell(this, x, y, "grass");
        this.cellGroup.add(cell);
        return cell;
    }

    Make2DArray(x, y){
        var arr = []; // make 2d array
        for(let i = 0; i < y; i++) {
            arr.push(new Array(x));
        }
        return arr
    }

    MakeCellGrid(x, y){
        const minXPos = 100;
        const minYPos = 70;
        var cellGrid = this.Make2DArray(x, y);
        for(let i = 0; i < x ; i++){
            for(let j = 0; j < y; j++){
                cellGrid[i][j] = this.createCell(minXPos + gameWidth / this.XTiles * i, minYPos + gameHeight / this.YTiles * j);
            }
        }
        return cellGrid;
    }

    GameBehavior(){ // only declared once, not in update()
        this.physics.add.overlap(this.player, this.cellGroup, (player, cell) => {
            if(this.canSwitchCells){
                if(!this.checkCellList.includes(cell)){
                    this.checkCellList.push(cell)
                }
            }
        })
    }

    CalculateWhichCell(){
        // checks all cells the player is colliding with
        // If cells contains original cell, just use that otherwise take the first cell
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
        this.checkCellList = []
        return newCell
    }

    ByteArrayStuff() {
        //(this.XTiles * this.YTiles) * 2 = num of cells * 2 bytes
        const buffer = new ArrayBuffer((this.XTiles * this.YTiles) * 2);
        const view = new DataView(buffer);
        view.setInt16(0, this.grid[0].sun);
        view.setInt16(2, this.grid[0].water);
        console.log(view.getInt16(0));
        console.log(view.getInt16(2));

        if(this.grid[0].plant != null){
            view.setInt16(4, this.grid[0].plant.type);
            view.setInt16(6, this.grid[0].plant.growth);
            console.log(view.getInt16(4));
            console.log(view.getInt16(6));
        }
    }
}