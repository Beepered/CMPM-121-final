class Plant extends Phaser.GameObjects.Sprite{
    typeName: string;
    emitter: EventDispatcher;
    growth: number;
    maxGrowth: number;

    constructor(scene: Phaser.Scene, x: number, y: number, typeName: string) {
        const plantType = PlantDSL.getPlantType(typeName)
        super(scene, x, y, plantType.texture)
        this.scene = scene
        this.typeName = typeName
        this.setScale(0.5)
        this.scene.add.existing(this)
        //super(scene, x, y, texture);
        //scene.add.existing(this);

        this.emitter = EventDispatcher.getInstance();

        this.growth = 0;
        this.maxGrowth = 3;

        this.alpha = 0.4

        this.updatePlant()
    }

    updatePlant(){
        if(this.growth == 1){
            this.alpha = 0.6
        }
        else if(this.growth == 2){
            this.alpha = 0.8
        }
        else if(this.growth == this.maxGrowth){
            this.alpha = 1
            this.emitter.emit("fully-grown");
        }
    }

    GiveNutrients(cell: Cell, sun: number, water: number, neighbors: any[]){
        if (this.growth < this.maxGrowth) {
            const plantType = PlantDSL.getPlantType(this.typeName)
            const canGrow = plantType.growthRule(cell, { sun, water, neighbors })
            if (canGrow) {
              this.growth += 1
              cell.water -= Math.min(2, cell.water) // Adjust depletion rules
              this.updatePlant()
            }
        }
    }
}