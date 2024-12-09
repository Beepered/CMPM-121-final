class Credits extends Phaser.Scene {
    constructor(){
        super("creditScene")
    }

    preload(){
        this.load.json('language', 'src/Utils/language.json')
    }

    create(){
        const txt = this.cache.json.get('language');

        this.add.text(gameWidth / 2, 50, txt.credits[txt.lang], { fontSize: '40px' }).setOrigin(0.5)
        this.add.text(gameWidth / 2, 90, txt.LeaveCreditTxt[txt.lang], { fontSize: '30px' }).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 2, 
            "Andrew Byi\n\n" +
            "Brendan Trieu\n\n" +
            "Ian Liu\n\n" +
            "Izaiah Lozano", { fontSize: '20px' }).setOrigin(0.5)
        this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.SPACE)){ 
            this.scene.switch("menuScene")
        }
    }
}