class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, grid){
        super(scene, x, y, texture);
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setCollideWorldBounds(true) 

        this.depth = 1 // render ordering

        this.setScale(0.5); 
        this.body.setSize(this.width * 0.5, this.height * 0.5); 
        this.grid = grid;

        this.gridX = gameWidth/this.grid[0].length;
        this.gridY = gameHeight/this.grid.length;

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
    }

    update(){
        this.controls();
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
        if(this.seeds > 0){ // replace with the cell's x and y
            this.grid[Math.floor(this.y/this.gridY)][Math.floor(this.x/this.gridX)].setVisible(true); 
            this.seeds--;
            
        }
        
        /*
        check current cell
        if(cell is empty)
            plant
        else
            reap
        */

    }


    Plant(x, y) {
        new Plant(this.scene, x, y, "testplant")
    }
}