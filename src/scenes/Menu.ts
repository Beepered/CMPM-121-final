class Menu extends Phaser.Scene {
    keyUP!: Phaser.Input.Keyboard.Key;
    keyDOWN!: Phaser.Input.Keyboard.Key;
    constructor(){
        super("menuScene")
    }

    preload(){
        this.load.json('language', 'src/Utils/language.json')
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
        const txt = this.cache.json.get('language');
        this.add.text(gameWidth / 2, gameHeight / 2.5, txt.Title[txt.lang], titleConfig).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 1.8, txt.startPlayTxt[txt.lang], textConfig).setOrigin(0.5)
        this.add.text(gameWidth / 2, gameHeight / 1.6, txt.creditsTxt[txt.lang], textConfig).setOrigin(0.5)
        
        this.keyUP = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
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