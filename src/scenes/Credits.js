class Credits extends Phaser.Scene {
    constructor(){
        super("creditScene")
    }
    create(){
        this.add.text(gameWidth / 2, 80, "CREDITS", { fontSize: '40px', fontFamily: "Montserrat" }).setOrigin(0.5)
        this.add.text(gameWidth / 2, 120, "Press UP for MENU", { fontSize: '30px' }).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 2, 
            "Andrew Byi\n\n" +
            "Brendan Trieu\n\n" +
            "Ian Liu\n\n" +
            "Izaiah Lozano", { fontSize: '20px' }).setOrigin(0.5)
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyUP)){ 
            this.scene.switch("menuScene")
        }
    }
}