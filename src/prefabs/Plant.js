class Plant extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, typeName) {
        const plantType = PlantDSL.getPlantType(typeName)
        if (!plantType) {
          throw new Error(`Plant type '${typeName}' not found`)
        }
    
        super(scene, x, y, plantType.texture)
        scene.add.existing(this)
    
        this.emitter = EventDispatcher.getInstance()
    
        this.typeName = typeName
        this.growth = 0
        this.maxGrowth = 3
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

    GiveNutrients(cell, sun, water, neighbors){
        console.log("Nutrients Info:", { cell, sun, water, neighbors })
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