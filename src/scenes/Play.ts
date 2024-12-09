class Play extends Phaser.Scene {
    emitter: any;
    XTiles: number;
    YTiles: number;
    winCondition: number;
    flowersGrown: number;
    gameObjects!: Phaser.GameObjects.Group;
    player!: Player;
    cellGroup!: Phaser.GameObjects.Group;
    grid!: any[][];
    gameStateManager!: gameStateManager;

    
    constructor(){
        super("playScene")
        this.emitter = EventDispatcher.getInstance();
        
        this.XTiles = 3;
        this.YTiles = 3;

        this.winCondition = 3;
        this.flowersGrown = 0;

        
        this.setListeners();
    }

    preload(){
        this.load.image("player", "assets/PlayerCharacter.png")
        this.load.image("grass", "assets/GrassV1.png")

        // flowers
        this.load.image("pink", "assets/Pink_Flower.png")
        this.load.image("purple", "assets/Purple_Flower.png")
        this.load.image("red", "assets/Red_Flower.png")

        this.load.json('json', 'src/Utils/scenario.json')
        this.load.json('language', 'src/Utils/language.json')
    }

    create(){

        this.addAllButtons();
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
        const txt = this.cache.json.get('language');
        let autoConfirm = confirm(txt.autoConfirmtxt[txt.lang]);
        if(autoConfirm){
            this.Load("autosave");
        }
        
        this.setInfoFromData();

        this.UpdateCellText();
    }
    
    createCell(x: number, y: number) {
        const cell = new Cell(this, x, y, "grass");
        this.cellGroup.add(cell);
        return cell;
    }

    Make2DArray(x: number, y: number){
        var arr = []; // make 2d array
        for(let i = 0; i < y; i++) {
            arr.push(new Array(x));
        }
        return arr
    }

    MakeCellGrid(x: number, y: number){
        const minXPos = 100;
        const minYPos = 70;
        var cellGrid = this.Make2DArray(x, y);
        for(let i = 0; i < x ; i++){
            for(let j = 0; j < y; j++){
                const cell = this.createCell(
                    minXPos + gameWidth / this.XTiles * i,
                    minYPos + gameHeight / this.YTiles * j
                )
                cell.xIndex = i
                cell.yIndex = j // Set indices for each cell
                cellGrid[i][j] = cell
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
        const plantTypeArray: string[] = ['sunflower', 'lavender', 'rose'];
        for(const cell of this.gridCells()) {
            view.setInt16(byteCount, cell.sun);
            view.setInt16(byteCount + 2, cell.water);
            if(cell.plant != null){
                const plantType = plantTypeArray.indexOf(cell.plant.typeName) +1 || 0;
                view.setInt16(byteCount + 4, plantType);
                view.setInt16(byteCount + 6, cell.plant.growth);

                // Debugger code
                //console.log(`Saving Plant: Type=${cell.plant.typeName}, Growth=${cell.plant.growth} at Cell [${cell.xIndex}, ${cell.yIndex}]`)
                //console.log(`Saving Plant Type=${plantType} (${cell.plant.typeName}) at Cell [${cell.xIndex}, ${cell.yIndex}]`)
                console.log(`Saving Plant: TypeName=${cell.plant.typeName}, PlantType=${plantType}, Growth=${cell.plant.growth} at Cell [${cell.xIndex}, ${cell.yIndex}]`)
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

    SetGridFromArrayBuffer(buffer:any) {
        const view = new DataView(buffer);
        let byteCount = 0
        this.flowersGrown = 0;

        const plantTypeArray: string[] = ['sunflower', 'lavender', 'rose'];

        for(const cell of this.gridCells()) {
            cell.sun = view.getInt16(byteCount);
            cell.water = view.getInt16(byteCount + 2);
            const plantType = view.getInt16(byteCount + 4);
            const plantName = plantTypeArray[plantType-1] // Reverse mapping
            console.log(`Decoded PlantType=${plantType} -> PlantName=${plantName}`)
            console.log(`Decoded Plant Type=${plantType} at Cell [${cell.xIndex}, ${cell.yIndex}]`)
            if (plantType !== 0) {
                // Ensure plant is re-initialized
                const plantGrowth = view.getInt16(byteCount + 6);
                cell.removePlant(); 
            
                const plantName = plantTypeArray[plantType-1]
                if (!plantName) {
                    console.error(`Unknown plant type ${plantType} at [${cell.xIndex}, ${cell.yIndex}]`)
                    continue
                  }

                cell.Plant(plantName)
                cell.plant.growth = plantGrowth
                
                cell.plant.updatePlant();
                // Debugger code
                console.log(`Loaded Plant: Type=${plantTypeArray[plantType-1] || 'unknown'}, Growth=${plantGrowth} into Cell [${cell.xIndex}, ${cell.yIndex}]`)
            } else {
            // Debugging logs for empty cell
            console.log(`Loaded Empty Cell at [${cell.xIndex}, ${cell.yIndex}]`)
            cell.removePlant()
            }
            byteCount += 8; // Advance the data index
        }
    }

    GetArrayBufferFromPlayer() {
        const buffer = new ArrayBuffer(3 * 2); // (position x,y and num seeds) * 2
        const view = new DataView(buffer);
        view.setInt16(0, this.player.x);
        view.setInt16(2, this.player.y);
        view.setInt16(4, seeds);
        return buffer
    }

    SetPlayerFromArrayBuffer(buffer:any){
        const view = new DataView(buffer);
        this.player.x = view.getInt16(0);
        this.player.y = view.getInt16(2);
        seeds = view.getInt16(4);
    }

    appendBuffer = function(buffer1:any, buffer2:any) {
        //https://gist.github.com/72lions/4528834
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
    };

    arrayBufferToBase64(buffer: any){
        //https://stackoverflow.com/questions/75577296/which-is-the-fastest-method-to-convert-array-buffer-to-base64
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    base64ToArrayBuffer(base64: any) {
        //https://stackoverflow.com/questions/21797299/how-can-i-convert-a-base64-string-to-arraybuffer
        var binaryString = atob(base64);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    Save(fileName: string) {
        const newBuffer = this.appendBuffer(this.GetArrayBufferFromGrid(), this.GetArrayBufferFromPlayer())
        const encode = this.arrayBufferToBase64(newBuffer)
        const txt = this.cache.json.get('language');
        console.log(txt.savingtxt[txt.lang] + fileName);
        console.log(txt.encodedtxt[txt.lang] + encode);

        try {
            localStorage.setItem(fileName, encode);
            console.log(txt.saveSuccess[txt.lang]);
        } catch (error) {
            console.error(txt.saveFailed[txt.lang], error);
        }
    }

    Load(fileName: string) {
        const save = localStorage.getItem(fileName)
        if(save){
            const buffer = this.base64ToArrayBuffer(save)
            const gridBuffer = new Uint8Array(buffer.slice(0, (this.XTiles * this.YTiles) * 8)).buffer;
            this.SetGridFromArrayBuffer(gridBuffer)
            const playerBuffer = new Uint8Array(buffer.slice((this.XTiles * this.YTiles) * 8)).buffer;
            this.SetPlayerFromArrayBuffer(playerBuffer)

            console.log('Grid Buffer:', gridBuffer)
            console.log('Player Buffer:', playerBuffer)
        }
        else{
            const txt = this.cache.json.get('language');
            alert(txt.nullSavetxt[txt.lang]);
        }
    }

    addTurnButton(){
        const txt = this.cache.json.get('language');
        const turnButton = document.createElement("button");
        turnButton.textContent = txt.nextTurn[txt.lang];
        turnButton.addEventListener("click", () => {
            this.Save("autosave")
            const newBuffer = this.appendBuffer(this.GetArrayBufferFromGrid(), this.GetArrayBufferFromPlayer())
            const encode = this.arrayBufferToBase64(newBuffer)
            this.gameStateManager.gameStateChange(encode);
            this.emitter.emit("next-turn", this.grid)

            this.UpdateCellText()
        })
        document.body.append(turnButton);
    }
    addDoButtons(){
        const doButtons = Array.from(
            { length: 2 },
            () => document.createElement("button"),
        );
        const txt = this.cache.json.get('language');
        const buttonTxt = [txt.undoTxt[txt.lang], txt.redoTxt[txt.lang]];
        doButtons.forEach((button, i) => {
            button.innerHTML = `${buttonTxt[i]}`;
            button.addEventListener("click", () => {
                this.doFunction(buttonTxt[i], i == 0); //function needs to be filled
            })
            document.body.append(button);
        })
    }
    addAllButtons(){
        this.addTurnButton();
        this.addDoButtons();
    }

    //the undo parameter is supposed to be a boolean, if true it is undo, if false it is redo. 
    doFunction(buttonTxt: string, undo: boolean){
        let state;
        if(undo){
            state = this.gameStateManager.undo();
        }else{
            state = this.gameStateManager.redo();
        }
        if(state){
            this.Save("autosave")
            const buffer = this.base64ToArrayBuffer(state)
            const gridBuffer = new Uint8Array(buffer.slice(0, (this.XTiles * this.YTiles) * 8)).buffer;
            this.SetGridFromArrayBuffer(gridBuffer)
            const playerBuffer = new Uint8Array(buffer.slice((this.XTiles * this.YTiles) * 8)).buffer;
            this.SetPlayerFromArrayBuffer(playerBuffer)
            console.log("Button: " + buttonTxt);
            this.emitter.emit(buttonTxt)
        }
        this.UpdateCellText();
    }

    NextTurn(){
        seeds = maxSeeds;
        //random weather value
        const values = Object.keys(WEATHER);
        const enumKey = values[Math.floor(Math.random() * values.length)];

        weather = WEATHER[enumKey as keyof typeof WEATHER];
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
        this.emitter.on("next-turn", (grid: any) => {
            this.NextTurn()
          })
        }
}
