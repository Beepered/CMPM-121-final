class Plant extends Phaser.GameObjects.Sprite{
    emitter: any;
    breed: number;
    growth: number;
    maxGrowth: number;

    constructor(scene: Phaser.Scene, x: number, y: number, breed = 0){
        let texture;
        switch(breed){
            case(1):
                texture = "pink"
                break;
            case(2):
                texture = "purple"
                break;
            case(3):
                texture = "red"
                break;
            default:
                texture = "testplant"
        }
        super(scene, x, y, texture);
        scene.add.existing(this);

        this.emitter = EventDispatcher.getInstance();

        this.breed = breed;

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

    GiveNutrients(cell: Cell, sun: number, water: number){
        if(this.growth < this.maxGrowth){
            switch(this.breed){
                case(0):
                    if(sun >= 2 && water >= 2){
                        this.growth += 1;
                        cell.water -= 2;
                    }
                    break;
                case(1):
                    if(sun >= 1 && water >= 5){
                        this.growth += 1;
                        cell.water -= 5;
                    }
                    break;
                case(2):
                    if(sun >= 4 && water >= 4){
                        this.growth += 1;
                        cell.water -= 4;
                    }
                    break;
                default:
                    this.growth += 1;
            }
            this.updatePlant()
        }
    }
}