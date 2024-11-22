class Plant extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, type){
        super(scene, x, y, type);
        this.growth = 0;
        scene.add.existing(this);
    }
    growPlant(lvl){
        this.growth += lvl;
    }
}