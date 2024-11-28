class Play extends Phaser.Scene {
    preload(){
        this.load.image("player", "assets/Player_Character.png")
        this.load.image("grass", "assets/GrassV1.png")

        // flowers
        this.load.image("testplant", "assets/testplant.png")
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
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)//Undo tmp button
        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P) // Redo tmp button

        this.gameObjects = this.add.group({
            runChildUpdate: true
        })
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");
        this.gameObjects.add(this.player);

        this.cellGroup = this.add.group()
        this.grid = this.MakeCellGrid(this.XTiles, this.YTiles);

        this.canSwitchCells = true
        this.checkCellTime = 0.02;
        this.checkCellList = []
        
        this.physics.add.overlap(this.player, this.cellGroup, (player, cell) => {
            if(this.canSwitchCells){
                this.checkCellList.push(cell)
            }
        })

        // temp
        localStorage.clear()
        //this.buffer = this.GetArrayBufferFromGrid();
    }

    update(time, delta){
        this.checkCellTime -= delta
        if(this.checkCellTime <= 0){
            this.canSwitchCells = !this.canSwitchCells
            if(this.canSwitchCells == true){
                this.player.cell = this.CalculatePlayerCell();
            }
            this.checkCellTime = 0.02;
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyQ)){ // test button
            this.emitter.emit("next-turn");
            this.UpdateCellText()
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyE)){ // saving
            this.Test()
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyO)){ // loading
            this.PlayerLoad()
        }

        // if(Phaser.Input.Keyboard.JustDown(this.keyO)){ //Undo Btn
        //     this.player.gameStateManager.undo();
        //     this.emitter.emit("undo"); //make later
        // }
        // if(Phaser.Input.Keyboard.JustDown(this.keyP)){ //Redo Btn
        //     this.player.gameStateManager.redo();
        //     this.emitter.emit("redo");//make later
        // }
    }
    switchState(state) {
        //somehow load the whole save state to the current
    };
    
    createCell(x, y){
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
        this.checkCellList = []
        return newCell
    }

    GetArrayBufferFromGrid() {
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
        return buffer
    }

    SetGridFromArrayBuffer(buffer) {
        const view = new DataView(buffer);
        let byteCount = 0
        for(let i = 0; i < this.grid.length ; i++){
            for(let j = 0; j < this.grid[i].length; j++){
                this.grid[i][j].sun = view.getInt16(byteCount)
                this.grid[i][j].water = view.getInt16(byteCount + 2)
                if(this.grid[i][j].plant != null){
                    this.grid[i][j].plant.type = view.getInt16(byteCount + 4)
                    this.grid[i][j].plant.growth = view.getInt16(byteCount + 6)
                }
                byteCount += 8
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

    appendBuffer = function(buffer1, buffer2) {
        //https://gist.github.com/72lions/4528834
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
    };

    arrayBufferToBase64(buffer){
        //https://stackoverflow.com/questions/75577296/which-is-the-fastest-method-to-convert-array-buffer-to-base64
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    base64ToArrayBuffer(base64) {
        //https://stackoverflow.com/questions/21797299/how-can-i-convert-a-base64-string-to-arraybuffer
        var binaryString = atob(base64);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    

    PlayerSave() { // saves cell info. Now need to figure out how to save player info
        const buffer = this.GetArrayBufferFromGrid()
        const encode = this.arrayBufferToBase64(buffer)
        localStorage.setItem("save", encode)
    }

    PlayerLoad() {
        const save = localStorage.getItem("save")
        if(save){
            const buffer = this.base64ToArrayBuffer(save)
            this.SetGridFromArrayBuffer(buffer)
        }
        else
            alert("null save")
    }
}