class Plant extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, type){ //type is a number between 0 - 2
        const texture = ["red", "pink", "purple"]; //names for texture
        super(scene, x, y, texture[type]);
        this.growth = 0;
        scene.add.existing(this);
    }
    growPlant(lvl){
        this.growth += lvl;
    }
}