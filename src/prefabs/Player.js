class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this)

        this.moveSpeed = 3
        
        // defining controls
        this.keyUP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.keyLEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.keyRIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.keyDOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        this.SPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update(){
        this.controls();
    }

    controls(){
        if(this.keyUP.isDown){
            this.y -= this.moveSpeed
        }
        if(this.keyLEFT.isDown){
            this.x -= this.moveSpeed
        }
        if(this.keyRIGHT.isDown){
            this.x += this.moveSpeed
        }
        if(this.keyDOWN.isDown){
            this.y += this.moveSpeed
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.SPACE)){
            this.Action();
        }
    }

    Action(){
        console.log("space")
        /*
        check current cell
        if(cell is empty)
            plant
        else
            reap
        */

    }
}