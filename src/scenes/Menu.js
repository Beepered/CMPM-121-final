class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene")
    }

    create(){
        //this.scene.switch("test")

        let titleConfig = {
            fontFamily: "Montserrat",
            fontSize: "80px",
            color: "#FF0000",
        }
        let textConfig = {
            fontFamily: "Montserrat",
            fontSize: "22px",
        }
        this.add.text(gameWidth / 2, gameHeight / 2.5, "We Plantin'", titleConfig).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 1.8, "press UP to PLAY", textConfig).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 1.6, "press DOWN for CREDITS", textConfig).setOrigin(0.5)

        this.add.text(gameWidth / 2, gameHeight / 1.25, "Instructions:", {fontSize: "18px", fontStyle: "bold"}).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 1.17, "Move with WASD or Arrow Keys", {fontSize: "16px"}).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 1.12, "Plant or Reap plants with SPACEBAR", {fontSize: "16px"}).setOrigin(0.5)
        
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyUP)){
            this.scene.switch("playScene")
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyDOWN)){
            this.scene.switch("creditScene")
        }
    }

}