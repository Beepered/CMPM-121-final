class Menu extends Phaser.Scene {
    constructor(){
        console.log("start menu")
        super("menuScene")
    }

    create(){
        let titleConfig = {
            fontFamily: "Montserrat",
            fontSize: "60px",
            color: "#FF0000",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
        }
        let textConfig = {
            fontFamily: "Montserrat",
            fontSize: "22px",
            color: "#FFFFFF",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
        }
        this.add.text(gameWidth / 2, gameHeight / 2.5, "TITLE", titleConfig).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 2, "press UP to PLAY", textConfig).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 1.8, "press DOWN for CREDITS", textConfig).setOrigin(0.5)
        
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyUP)){
            console.log("play")
            this.scene.start("gridScene")
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyDOWN)){
            console.log("credits")
            //this.scene.start("creditScene")
        }
    }

}