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
            if(this.cell.plant == null){
                this.emitter.emit("plant")
                this.Plant(this.cell, "testplant");
            }
            else if(this.cell.plant.growth >= 3){
                //Need a visual indicator/safecheck to make sure the wrong plant isn't reaped
                // Brendan: maybe make a border around the cell. Could be code or just its own sprite
                this.Reap(this.cell);
            }
        }
        
    }

    Plant(selectedCell, type) { // we can use "type" later but right now just using a random seed
        const randSeed = Math.floor(Math.random() * 2) + 0;
        if(this.seeds > 0){
            selectedCell.plant = new Plant(this.scene, selectedCell.x, selectedCell.y, randSeed);
        }
    }

    Reap(cell){
        cell.plant.destroy();
        cell.plant = null;
    }
}