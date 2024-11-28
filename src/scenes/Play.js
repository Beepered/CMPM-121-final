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

        this.physics.add.overlap(this.player, this.cellGroup, (player, cell) => {
            if(this.canSwitchCells){
                if(!this.checkCellList.includes(cell)){
                    this.checkCellList.push(cell)
                }
            }
        })

        this.player.cell = this.CalculatePlayerCell(); // doesn't do anything since it starts with "null". should probably fix

        this.view = this.SetArrayBuffer()
    }

    update(time, delta){
        this.checkTime -= delta * 0.001
        if(this.checkTime <= 0){
            this.canSwitchCells = !this.canSwitchCells
            if(this.canSwitchCells == true){
                const newCell = this.CalculatePlayerCell()
                if(newCell != null && newCell != this.player.cell){
                    this.emitter.emit("next-turn")
                    this.player.cell = newCell
                    this.UpdateCellText()
                }
            }
            this.checkTime = this.checkCellTime
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // test button
            this.player.playersTurn = false;
            this.emitter.emit("end-game")
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyE)){ // test button
            //const view = this.SetArrayBuffer()
            this.GetArrayBuffer(this.view)
            this.UpdateCellText()
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

    CalculatePlayerCell(){
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

    SetArrayBuffer() {
        const buffer = new ArrayBuffer((this.XTiles * this.YTiles) * 8); // size of grid * (4*2) (4 = amount of things to save, 2 = bytes)
        const view = new DataView(buffer);
        let byteCount = 0
        for(let i = 0; i < this.grid.length ; i++){
            for(let j = 0; j < this.grid[i].length; j++){
                view.setInt16(byteCount, this.grid[i][j].sun);
                view.setInt16(byteCount + 2, this.grid[i][j].water);
                if(this.grid[i][j].plant != null){
                    view.setInt16(byteCount + 4, this.grid[i][j].plant.type);
                    view.setInt16(byteCount + 6, this.grid[i][j].plant.growth);
                }
                byteCount += 8
            }
        }
        return view
    }

    GetArrayBuffer(view) {
        //const view = JSON.parse(localStorage.getItem("test"))
        let byteCount = 0
        for(let i = 0; i < this.grid.length ; i++){
            for(let j = 0; j < this.grid[i].length; j++){
                this.grid[i][j].sun = view.getInt16(byteCount)
                this.grid[i][j].water = view.getInt16(byteCount + 2)
                if(this.grid[0].plant != null){
                    this.grid[i][j].plant.type = view.getInt16(byteCount + 4)
                    this.grid[i][j].plant.growth = view.getInt16(byteCount + 6)
                }
                byteCount += 8
                this.grid[i][j].updateText();
            }
        }
    }

    UpdateCellText() {
        for(let i = 0; i < this.grid.length ; i++){
            for(let j = 0; j < this.grid[i].length; j++){
                this.grid[i][j].updateText();
            }
        }
    }
}