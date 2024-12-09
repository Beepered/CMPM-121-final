class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
        this.emitter = EventDispatcher.getInstance();
        this.langButtons = [];
    }

    preload(){
        this.load.json('language', 'src/Utils/language.json')
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
        const txt = this.cache.json.get('language');

        this.titleTxt = this.add.text(gameWidth / 2, gameHeight / 2.5, txt.Title[txt.lang], titleConfig).setOrigin(0.5)
        this.startTxt = this.add.text(gameWidth / 2, gameHeight / 1.8, txt.startPlayTxt[txt.lang], textConfig).setOrigin(0.5)
        this.creditTxt = this.add.text(gameWidth / 2, gameHeight / 1.6, txt.creditsTxt[txt.lang], textConfig).setOrigin(0.5)

        this.changeTxt(txt, titleConfig, textConfig);
        this.languageButtons(txt, titleConfig, textConfig);
        
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    languageButtons(txt, titleConfig, textConfig){
        const languages = txt.format;
        languages.forEach((lang, i) => {
            const langButton = document.createElement("button");
            langButton.innerHTML = lang;
            langButton.addEventListener("click", () => {
                txt.lang = i;
                this.changeTxt(txt, titleConfig, textConfig);
            })
            this.langButtons.push(langButton);
            document.body.append(langButton); 
        });
    }

    changeTxt(txt, titleConfig, textConfig){
        this.titleTxt.setText(txt.Title[txt.lang]);
        this.startTxt.setText(txt.startPlayTxt[txt.lang]);
        this.creditTxt.setText(txt.creditsTxt[txt.lang]);
        
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyUP)){
            this.scene.switch("playScene")
            for(let i = 0; i < this.langButtons.length; i++){
                this.langButtons[i].remove();
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.keyDOWN)){
            this.scene.switch("creditScene")
        }
    }

}