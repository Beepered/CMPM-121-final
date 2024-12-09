"use strict";
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.json('language', 'src/Utils/language.json');
    }
    create() {
        let titleConfig = {
            fontFamily: "Montserrat",
            fontSize: "60px",
            color: "#FF0000",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
        };
        let textConfig = {
            fontFamily: "Montserrat",
            fontSize: "22px",
            color: "#FFFFFF",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
        };
        const txt = this.cache.json.get('language');
        this.add.text(gameWidth / 2, gameHeight / 2.5, txt.Title[txt.lang], titleConfig).setOrigin(0.5);
        this.add.text(gameWidth / 2, gameHeight / 1.8, txt.startPlayTxt[txt.lang], textConfig).setOrigin(0.5);
        this.add.text(gameWidth / 2, gameHeight / 1.6, txt.creditsTxt[txt.lang], textConfig).setOrigin(0.5);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyUP)) {
            this.scene.switch("playScene");
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyDOWN)) {
            this.scene.switch("creditScene");
        }
    }
}
