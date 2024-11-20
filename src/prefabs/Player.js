class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.add.existing(this)
    }
    
    create(scene){
        this.keyUP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.keyLEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.keyRIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.keyDOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
    }

    update(){
        this.controls();
    }

    controls(){
        if(this.keyUP.isDown){
            console.log("player up")
        }
        if(this.keyLEFT.isDown){
            console.log("player left")
        }
        if(this.keyRIGHT.isDown){
            console.log("player right")
        }
        if(this.keyDOWN.isDown){
            console.log("player down")
        }
    }
}