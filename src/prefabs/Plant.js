class Plant extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, cell = null, type = 0){
        let texture;
        switch(type) {
            case(0):
                texture = "pink";
                break;
            case(1):
                texture = "purple"
                break;
            case(2):
                texture = "red"
                break;
            default:
                texture = "testplant"
        }
        super(scene, x, y, texture);
        scene.add.existing(this);

        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.cell = cell;
        this.type = type

        this.alpha = 0.4;
        this.growth = 0;
    }

    growPlant(lvl){
        this.growth += lvl;
        if(this.growth == 1){
            this.alpha += 0.2
        }
        else if(this.growth == 2){
            this.alpha += 0.2
        }
        else if(this.growth == 3){
            this.alpha += 0.2
            this.emitter.emit("fully-grown");
        }
    }
    
    reap(){
        this.setActive(false);
        this.setVisible(false);
        this.isVisible = false;
        this.growth = 0;
    }

    setListeners(){
        this.emitter.on("next-turn", this.NextTurn.bind(this));
    }

    NextTurn(){
        if(this.cell){
            if(this.growth < 3){
                if(this.type == 0){ // pink
                    if(this.cell.sun >= 2 && this.cell.water >= 2){ // probably better way to do this (JSON file?)
                        this.growPlant(1)
                        this.cell.water -= 2;
                    }
                }
                else if (this.type == 1){ // purple
                    if(this.cell.sun >= 5 && this.cell.water >= 5){
                        this.growPlant(1)
                        this.cell.water -= 5;
                    }
                }
                else if (this.type == 2){ // red
                    if(this.cell.sun >= 1 && this.cell.water >= 3){
                        this.growPlant(1)
                        this.cell.water -= 3;
                    }
                }
            }
        }
        else{
            console.log("no cell for plant")
        }
    }
}