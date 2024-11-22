class Plant extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, type){
        super(scene, x, y, type);
        this.setOrigin(0, 0);
        this.growth = 0;
        scene.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
        this.isVisible = false;
    }
    growPlant(lvl){
        this.growth += lvl;
    }
    plant(){
        this.setActive(true);
        this.setVisible(true);
        this.isVisible = true;
        this.growth = 1;
    }
    reap(){
        this.setActive(false);
        this.setVisible(false);
        this.isVisible = false;
        this.growth = 0;
    }
}