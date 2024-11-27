/*
UNUSED: just used to see if we needed a turn system script, but there isn't much it needs to do
all the behavior is connected to the object's scripts
*/

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