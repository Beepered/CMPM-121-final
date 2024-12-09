class Credits extends Phaser.Scene {
    SPACE!: Phaser.Input.Keyboard.Key;
    
    constructor(){
        super("creditScene")
    }
    create(){
        this.add.text(gameWidth / 2, 50, "CREDITS", { fontSize: '40px' }).setOrigin(0.5)
        this.add.text(gameWidth / 2, 90, "Press SPACEBAR for MENU", { fontSize: '30px' }).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 2, 
            "Andrew Byi\n\n" +
            "Brendan Trieu\n\n" +
            "Ian Liu\n\n" +
            "Izaiah Lozano", { fontSize: '20px' }).setOrigin(0.5)
        this.SPACE = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.SPACE)){ 
            this.scene.switch("menuScene")
        }
    }
}