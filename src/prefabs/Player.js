class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, grid){
        super(scene, x, y, texture);
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setCollideWorldBounds(true) 

        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.depth = 1 // render ordering

        this.setScale(0.5); 
        this.body.setSize(this.width * 0.5, this.height * 0.5); 
        this.grid = grid;
        if(this.grid){ // Brendan: put if statement so it can work without a grid
            this.gridX = gameWidth/this.grid[0].length;
            this.gridY = gameHeight/this.grid.length;
        }

        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        
        this.keyUP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.keyLEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.keyDOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        this.keyRIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        this.SPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        this.moveSpeed = 3
        this.seeds = 3;

        this.playersTurn = false; //for turn base
    }

    update(){
        if(this.playersTurn){
            this.controls();
        }
        // if moved to next cell, then emit next turn
    }

    controls(){
        if(this.keyUP.isDown || this.keyW.isDown){
            this.y -= this.moveSpeed
        }
        if(this.keyLEFT.isDown || this.keyA.isDown){
            this.x -= this.moveSpeed
        }
        if(this.keyDOWN.isDown || this.keyS.isDown){
            this.y += this.moveSpeed
        }
        if(this.keyRIGHT.isDown || this.keyD.isDown){
            this.x += this.moveSpeed
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.SPACE)){
            this.Action();
        }
    }

    Action() {
        if(this.grid){ // sloppy change but does let the player plant if on a not-grid level
            //should change to currentCell
            const currentGrid = this.grid[Math.floor(this.y/this.gridY)][Math.floor(this.x/this.gridX)].plant;
            console.log(currentGrid.growth)
            if(!currentGrid.isVisible){
                if(this.seeds > 0){
                    currentGrid.plant();
                    this.seeds--;
                }
            }
            else if(currentGrid.growth >= 3){
                //Need a visual indicator/safecheck to make sure the wrong plant isn't reaped
                currentGrid.reap();
            }
        }
        else{
            if(this.seeds > 0){
                this.emitter.emit("plant")
                this.Plant(this.x, this.y)
                this.seeds--;
            }
        }
        
    }

    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
        this.emitter.on("param-test", this.ParamTest.bind(this));
    }
    NextTurn (){ // maybe it lets the player move again and gives seeds?
        console.log("PLAYER next-turn")
        this.playersTurn = true;
        this.seeds = 3;
    }
    ParamTest(param) {
        console.log("PLAYER param-test:", param)
    }
        

    // changeTurn(){
    //     if(this.playersTurn){
    //         this.playersTurn = false;
    //     }else{
    //         this.playersTurn = true;
    //     }
    // }


    Plant(x, y) {
        new TestPlant(this.scene, x, y, "testplant") // Brendan: temporarily changed to testplant
    }
}