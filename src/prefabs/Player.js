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

        if(this.grid){
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
        if(this.grid){
            const currentGrid = this.grid[Math.floor(this.y/this.gridY)][Math.floor(this.x/this.gridX)];
            if(currentGrid.Plant == null){
                this.emitter.emit("plant")
                this.Plant(currentGrid, "testplant");
            }
            else if(currentGrid.growth >= 3){
                //Need a visual indicator/safecheck to make sure the wrong plant isn't reaped
                currentGrid.reap();
            }
        }
        else{
            if(this.seeds > 0){
                this.emitter.emit("plant")
                this.PlantInCell(this.cell)
                this.seeds--;
            }
        }
        
    }

    Plant(selectedGrid, type) {
        if(this.seeds > 0){
            selectedGrid.Plant = new Plant(this.scene, selectedGrid.x, selectedGrid.y, type);
            this.seeds--;
        }
    }

    PlantInCell(cell){ // planting using cell pointer instead
        if(cell != null){
            const type = Math.floor(Math.random() * 2) + 1; // Random generation from 1 to 2
            cell.plant = new Plant(this.scene, cell.x, cell.y, type); // could honestly simplify to not having x and y
        }
        else{
            console.log("no cell for player")
        }
        
    }
}