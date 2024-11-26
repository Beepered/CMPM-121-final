class Plant extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, type){
        super(scene, x, y, type);
        //this.setOrigin(0, 0);
        scene.add.existing(this);

        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.growth = 0;
    }

    growPlant(lvl){ // have some parameters like if sun and water > 1 then growth++
        this.growth += lvl;
        if(this.growth == 1){ // only works if sprites were preloaded in scene
            this.setTexture("pink")
        }
        else if(this.growth == 2){
            this.setTexture("purple")
        }
        else if(this.growth == 3){
            this.setTexture("red")
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
        this.growPlant(1)
    }
}