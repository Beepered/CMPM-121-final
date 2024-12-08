class Play extends Phaser.Scene {
    constructor(){
        super("playScene")
        this.emitter = EventDispatcher.getInstance();
        
        this.XTiles = 3;
        this.YTiles = 3;

        this.winCondition = 3;
        this.flowersGrown = 0;

        this.addAllButtons();
        this.setListeners();
    }

    preload(){
        this.load.image("player", "assets/PlayerCharacter.png")
        this.load.image("grass", "assets/GrassV1.png")

        // flowers
        this.load.image("testplant", "assets/testplant.png")
        this.load.image("pink", "assets/Pink_Flower.png")
        this.load.image("purple", "assets/Purple_Flower.png")
        this.load.image("red", "assets/Red_Flower.png")

        this.load.json('json', 'src/Utils/scenario.json')
    }

    create(){
        this.scene.launch("uiScene")
        
        this.gameObjects = this.add.group({
            runChildUpdate: true
        })
        this.player = new Player(this, gameWidth / 2, gameHeight / 2, "player");
        this.gameObjects.add(this.player);

        this.cellGroup = this.add.group()
        this.grid = this.MakeCellGrid(this.XTiles, this.YTiles);

        this.gameStateManager = new gameStateManager(this);
        
        this.physics.add.overlap(this.player, this.cellGroup, (player, cell) => {
            this.player.checkCellList.push(cell)
        })
        
        let autoConfirm = confirm("Attempt to load Autosave?");
        if(autoConfirm){
            this.Load("autosave");
        }

        this.setInfoFromData();

        this.UpdateCellText();
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

    UpdateCellText() {
        for(let i = 0; i < this.grid.length ; i++){
            for(let j = 0; j < this.grid[i].length; j++){
                this.grid[i][j].updateText();
            }
        }
    }

    *gridCells() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                yield this.grid[i][j];
            }
        }
    }

    GetArrayBufferFromGrid() {
        const buffer = new ArrayBuffer((this.XTiles * this.YTiles) * 8); // size of grid * (4*2) (4 = amount of things to save (sun,water,type,growth), 2 = bytes)
        const view = new DataView(buffer);
        let byteCount = 0
        for(const cell of this.gridCells()) {
            view.setInt16(byteCount, cell.sun);
            view.setInt16(byteCount + 2, cell.water);
            if(cell.plant != null){
                view.setInt16(byteCount + 4, cell.plant.breed);
                view.setInt16(byteCount + 6, cell.plant.growth);
            }
            byteCount += 8
        }
        return buffer
    } 

    FlowerGrown() {
        this.flowersGrown++;
        if(this.flowersGrown >= this.winCondition){
            this.emitter.emit("end-game");
        }
    }

    SetGridFromArrayBuffer(buffer) {
        const view = new DataView(buffer);
        let byteCount = 0
        this.flowersGrown = 0;
        for(const cell of this.gridCells()) {
            cell.sun = view.getInt16(byteCount);
            cell.water = view.getInt16(byteCount + 2);
            const plantType = view.getInt16(byteCount + 4);
            if (plantType !== 0) {
                // Ensure plant is re-initialized
                const plantGrowth = view.getInt16(byteCount + 6);
                cell.removePlant(); 
                cell.Plant(plantType);
                cell.plant.growth = plantGrowth;
                if(cell.plant.growth == 3){ //Could change to be dynamic
                    this.FlowerGrown();
                }
                cell.plant.updatePlant();
            } else {
                // Clear plant if no type
                cell.removePlant();
            }
            byteCount += 8; // Advance the data index
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

    ParseData(){
        FetchData()
    }

    addTurnButton(){
        const turnButton = document.createElement("button");
        turnButton.textContent = "Next Turn";
        turnButton.addEventListener("click", () => {
            this.Save("autosave")
            const newBuffer = this.appendBuffer(this.GetArrayBufferFromGrid(), this.GetArrayBufferFromPlayer())
            const encode = this.arrayBufferToBase64(newBuffer)
            this.gameStateManager.gameStateChange(encode);
            this.emitter.emit("next-turn");

            this.UpdateCellText()
        })
        document.body.append(turnButton);
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
        })
    }
    addAllButtons(){
        this.addTurnButton();
        this.addDoButtons();
    }

    //the undo parameter is supposed to be a boolean, if true it is undo, if false it is redo. 
    doFunction(button, undo){
        let state;
        let emitTxt;
        if(undo){
            state = this.gameStateManager.undo();
            emitTxt = "undo";
        }else{
            state = this.gameStateManager.redo();
            emitTxt = "redo";
        }
        if(state){
            this.Save("autosave")
            const buffer = this.base64ToArrayBuffer(state)
            const gridBuffer = new Uint8Array(buffer.slice(0, (this.XTiles * this.YTiles) * 8)).buffer;
            this.SetGridFromArrayBuffer(gridBuffer)
            const playerBuffer = new Uint8Array(buffer.slice((this.XTiles * this.YTiles) * 8)).buffer;
            this.SetPlayerFromArrayBuffer(playerBuffer)
            console.log(emitTxt);
            this.emitter.emit(emitTxt)
        }
        this.UpdateCellText();
    }

    NextTurn(){
        seeds = maxSeeds;

        //random weather value
        const values = Object.keys(WEATHER);
        const enumKey = values[Math.floor(Math.random() * values.length)];
        weather = WEATHER[enumKey];
    }

    setInfoFromData(){
        const data = this.cache.json.get('json')
        this.player.x = data.playerX;
        this.player.y = data.playerY;
        maxSeeds = data.maxSeeds;
        seeds = data.numSeeds;
        this.winCondition = data.winCondition;
        weather = data.weather;
        this.emitter.emit("update-ui");
    }

    setListeners(){
        this.emitter.on("fully-grown", this.FlowerGrown.bind(this));
        this.emitter.on("next-turn", this.NextTurn.bind(this));
    }
}