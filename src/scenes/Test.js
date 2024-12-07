class Test extends Phaser.Scene {
    constructor(){
        super("test")
    }

    preload(){
        // flowers
        this.load.image("pink", "assets/Pink_Flower.png")
        this.load.image("purple", "assets/Purple_Flower.png")
        this.load.image("red", "assets/Red_Flower.png")
    }

    create(){
        let yPos = 100;
        allInternalPlantTypes.forEach(type => {
            new NewPlant(this, gameWidth/2, yPos, type)
            yPos += 100
        });

        this.add.text(gameWidth / 2, 70, `TEST`, { fontSize: '30px' }).setOrigin(0.5)
    }
}