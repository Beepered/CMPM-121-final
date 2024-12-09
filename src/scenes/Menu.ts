class Menu extends Phaser.Scene {
    keyUP!: Phaser.Input.Keyboard.Key;
    keyDOWN!: Phaser.Input.Keyboard.Key;
    slotWindow!: Phaser.GameObjects.Container;
    titleTxt!: Phaser.GameObjects.Text;
    startTxt!: Phaser.GameObjects.Text;
    creditTxt!: Phaser.GameObjects.Text;
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
        this.titleTxt = this.add.text(gameWidth / 2, gameHeight / 2.5, txt.Title[txt.lang], titleConfig).setOrigin(0.5)
        this.startTxt = this.add.text(gameWidth / 2, gameHeight / 1.8, txt.startPlayTxt[txt.lang], textConfig).setOrigin(0.5)
        this.creditTxt = this.add.text(gameWidth / 2, gameHeight / 1.6, txt.creditsTxt[txt.lang], textConfig).setOrigin(0.5)
        
        this.keyUP = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        //this.slotWindow = this.add.container(0, 0);
        //this.changeLanguage();
    }

    changeLanguage(){
        const txt = this.cache.json.get('language');
        const bg = this.add.rectangle(0, 0, 300, 200, 0x222222).setOrigin(0.5);
        this.slotWindow.add(bg);
        const closeButton = this.add.text(0, 80, txt.Close[txt.lang], {
            fontSize: "18px",
            backgroundColor: "#cc0000",
            color: "#fff",
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();
    
        closeButton.on("pointerdown", () => this.slotWindow.removeAll(true));
        this.slotWindow.add(closeButton);
        const langChoices = txt.format;
        let yPos = -45; // Position for the first button
        langChoices.forEach((lang:string, i:number) => {
            // Create language button
            
            const langButton = this.add.text(0, yPos, lang, {
                fontSize: "18px",
                color: "#fff",
                backgroundColor: "black",
                padding: { x: 10, y: 5 },
            }).setOrigin(0.5).setInteractive();
            langButton.on("pointerdown", () => {
                txt.lang = i;
                this.resetAllTxt(txt);
                this.slotWindow.removeAll(true)
            });
            this.slotWindow.add(langButton);
            yPos += 25; // Move the next button down
        })
    }

    resetAllTxt(txt: any){
        this.titleTxt.text = txt.Title[txt.lang];
        this.startTxt.text = txt.startPlayTxt[txt.lang];
        this.creditTxt.text = txt.creditsTxt[txt.lang];
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