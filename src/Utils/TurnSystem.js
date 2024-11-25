class TurnSystem extends Phaser.Scene {
    constructor(scene){
        super(scene)
        this.emitter = EventDispatcher.getInstance();
        this.setListeners();
    }

    setListeners() {
        this.emitter.on("next-turn", this.test.bind(this));
    }

    test(){
        console.log("TURN SYSTEM got next-turn event")
    }

}