class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, grid){
        super(scene, x, y, texture);
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setCollideWorldBounds(true) 

        this.emitter = EventDispatcher.getInstance();

        this.depth = 1 // render ordering

        this.setScale(0.5); 
        this.body.setSize(this.width * 0.5, this.height * 0.5); 
        this.grid = grid;
        console.log(this.grid);
        if(this.grid){
            this.gridX = gameWidth/this.grid[0].width;
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
        this.cell = null;

        this.playersTurn = true;
    }

    update(){
        if(this.playersTurn){
            this.controls();
        }
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

    Action(){
        if(this.cell){
            
            //const currentGrid = this.grid[Math.floor(this.y/this.gridY)][Math.floor(this.x/this.gridX)];
            //console.log("cell: " + JSON.stringify(this.cell));
            if(this.cell.Plant == null){
                
                this.emitter.emit("plant")
                this.Plant(this.cell, "testplant");
            }
            else if(this.cell.Plant.growth >= 3){
                //Need a visual indicator/safecheck to make sure the wrong plant isn't reaped
                console.log("reaping");
                this.Reap(this.cell);
            }
        }
        
    }

    Plant(selectedCell, type) {
        console.log("seed count: " + this.seeds);
        if(this.seeds > 0){
            console.log("planting");
            selectedCell.Plant = new Plant(this.scene, selectedCell.x, selectedCell.y, type);
        }
    }

    Reap(cell){
        cell.Plant.setVisible(false);
        delete cell.Plant;
        cell.Plant = null;
    }

    PlantInCell(cell){ // planting using cell pointer instead
        if(cell != null){
            new Plant(this.scene, cell.x, cell.y, "testplant");
        }
        else{
            console.log("no cell in player")
        }
        
    }
}