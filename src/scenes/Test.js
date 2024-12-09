class Test extends Phaser.Scene {
    constructor(){
        super("test")
    }

    preload(){
        // flowers
        this.load.image("pink", "assets/Pink_Flower.png")
        this.load.image("purple", "assets/Purple_Flower.png")
        this.load.image("red", "assets/Red_Flower.png")

        this.load.image("grass", "assets/GrassV1.png")
    }

    create(){
        this.add.text(gameWidth / 2, 40, `TEST`, { fontSize: '30px', fontStyle: "bold" }).setOrigin(0.5).setDepth(2)

        const cellList = []

        let yPos = 120;
        allInternalPlantTypes.forEach(type => {
            const cell = new Cell(this, gameWidth/2, yPos, "grass");
            cell.plant = new NewPlant(this, gameWidth/2, yPos, type)
            cellList.push(cell)
            yPos += 140
        });

       
    }
}