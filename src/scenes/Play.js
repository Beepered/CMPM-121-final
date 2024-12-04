class Play extends Phaser.Scene {
    preload(){
        this.load.image("player", "assets/PlayerCharacter.png")
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

        this.addAllButtons();
    }

    create(){
        this.scene.launch("uiScene")
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q) // testing
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E) // save
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O) //load
        this.keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N) // Undo tmp button
        this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M) // Redo tmp button
        
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
        
        this.gameStateManager = new gameStateManager();
        //starting State
        const initialState = new stateInfo();
        initialState.setPlayerInfo(this.player.x, this.player.y);
        initialState.setCellBuffer(this.GetArrayBufferFromGrid());
        this.gameStateManager.gameStateChange(initialState);
        this.physics.add.overlap(this.player, this.cellGroup, (player, cell) => {
            if(this.canSwitchCells){
                this.checkCellList.push(cell)
            }
        })

        this.Load("save");
        this.UpdateCellText();
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
            const prevState = new stateInfo();
            prevState.setPlayerInfo(this.player.x, this.player.y)
            prevState.setCellBuffer(this.GetArrayBufferFromGrid());
            this.emitter.emit("next-turn");
            this.gameStateManager.gameStateChange(prevState);

            this.UpdateCellText()
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyE)){ // saving
            this.Save("save")
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyO)){ // loading
            this.Load("save")
            this.UpdateCellText();
        }

        if(Phaser.Input.Keyboard.JustDown(this.keyN)){ //Undo Btn
            const prevState = this.gameStateManager.undo();
            
            if([prevState]){
                if(prevState.playerInfo){
                    this.player.x = prevState.playerInfo.playerX;
                    this.player.y = prevState.playerInfo.playerY;
                }
                if(prevState.cellBuffer){
                    this.SetGridFromArrayBuffer(prevState.cellBuffer);
                }
                this.emitter.emit("undo"); //make later
            }
            this.UpdateCellText();
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyM)){ //Redo Btn
            const nextState = this.gameStateManager.redo();
            if(nextState){
                if(nextState.playerInfo){
                    this.player.x = nextState.playerInfo.playerX;
                    this.player.y = nextState.playerInfo.playerY;
                }
                if(nextState.cellBuffer){
                    this.SetGridFromArrayBuffer(nextState.cellBuffer);
                }
                this.emitter.emit("redo");//make later
            }
            this.UpdateCellText();
            
        }
    }
    
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
        if(this.checkCellList.length == 0){
            return null;
        }
        else{
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
    }

    UpdateCellText() {
        for(let i = 0; i < this.grid.length ; i++){
            for(let j = 0; j < this.grid[i].length; j++){
                this.grid[i][j].updateText();
            }
        }
    }

    GetArrayBufferFromGrid() {
        const buffer = new ArrayBuffer((this.XTiles * this.YTiles) * 8); // size of grid * (4*2) (4 = amount of things to save (sun,water,type,growth), 2 = bytes)
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
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j].sun = view.getInt16(byteCount);
                this.grid[i][j].water = view.getInt16(byteCount + 2);
                const plantType = view.getInt16(byteCount + 4);
                const plantGrowth = view.getInt16(byteCount + 6);
                if (plantType !== 0) {
                    // Ensure plant is re-initialized
                    if (!this.grid[i][j].plant || this.grid[i][j].plant.type !== plantType) {
                        this.grid[i][j].Plant(plantType); // Re-plant
                    }
                    this.grid[i][j].plant.growth = plantGrowth;
                    this.grid[i][j].plant.updatePlant();
                } else {
                    // Clear plant if no type
                    this.grid[i][j].removePlant?.();
                }
                byteCount += 8; // Advance the data index
            }
        }
    }

    GetArrayBufferFromPlayer() {
        const buffer = new ArrayBuffer(3 * 2); // (position x,y and num seeds) * 2
        const view = new DataView(buffer);
        view.setInt16(0, this.player.x);
        view.setInt16(2, this.player.y);
        view.setInt16(4, this.player.seeds);
        return buffer
    }

    SetPlayerFromArrayBuffer(buffer){
        const view = new DataView(buffer);
        this.player.x = view.getInt16(0);
        this.player.y = view.getInt16(2);
        this.player.seeds = view.getInt16(4);
        return buffer
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

    Save(fileName) {
        const newBuffer = this.appendBuffer(this.GetArrayBufferFromGrid(), this.GetArrayBufferFromPlayer())
        const encode = this.arrayBufferToBase64(newBuffer)
        console.log(`Saving data to slot: ${fileName}`);
        console.log(`Encoded data: ${encode}`);

        try {
            localStorage.setItem(fileName, encode);
            console.log("Save successful.");
        } catch (error) {
            console.error("Save failed:", error);
        }
    }

    Load(fileName) {
        const save = localStorage.getItem(fileName)
        if(save){
            const buffer = this.base64ToArrayBuffer(save)
            const gridBuffer = new Uint8Array(buffer.slice(0, (this.XTiles * this.YTiles) * 8)).buffer;
            this.SetGridFromArrayBuffer(gridBuffer)
            const playerBuffer = new Uint8Array(buffer.slice((this.XTiles * this.YTiles) * 8)).buffer;
            this.SetPlayerFromArrayBuffer(playerBuffer)
        }
        else{
            alert("null save")
        } 
    }

    addTurnButton(){
        const turnButton = document.createElement("button");
        turnButton.textContent = "Next Turn";
        turnButton.addEventListener("click", () => {
            const prevState = new stateInfo();
            prevState.setPlayerInfo(this.player.x, this.player.y)
            prevState.setCellBuffer(this.GetArrayBufferFromGrid());
            this.emitter.emit("next-turn");
            this.gameStateManager.gameStateChange(prevState);

            this.UpdateCellText()
        })
        document.body.append(turnButton);
        //this.buttons.push(turnButton);
    }
    addDoButtons(){
        const doButtons = Array.from(
            { length: 2 },
            () => document.createElement("button"),
        );
        const buttonTxt = ["undo", "redo"];
        doButtons.forEach((button, i) => {
            button.innerHTML = `${buttonTxt[i]}`;
            button.addEventListener("click", () => {
                this.doFunction(button, i == 0); //function needs to be filled
            })
            document.body.append(button);
            //this.buttons.push(button);
        })
    }
    addAllButtons(){
        this.addTurnButton();
        this.addDoButtons();
    }

    //the undo parameter is supposed to be a boolean, if true it is undo, if false it is redo. 
    doFunction(button, undo){
        if(undo){
            const prevState = this.gameStateManager.undo();
            
            if([prevState]){
                if(prevState.playerInfo){
                    this.player.x = prevState.playerInfo.playerX;
                    this.player.y = prevState.playerInfo.playerY;
                }
                if(prevState.cellBuffer){
                    this.SetGridFromArrayBuffer(prevState.cellBuffer);
                }
                this.emitter.emit("undo"); //make later
            }
            this.UpdateCellText();
            
        }else{
            const nextState = this.gameStateManager.redo();
            if(nextState){
                if(nextState.playerInfo){
                    this.player.x = nextState.playerInfo.playerX;
                    this.player.y = nextState.playerInfo.playerY;
                }
                if(nextState.cellBuffer){
                    this.SetGridFromArrayBuffer(nextState.cellBuffer);
                }
                this.emitter.emit("redo");//make later
            }
            this.UpdateCellText();
        }
    }
}