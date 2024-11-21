class Cell extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this)
        this.setOrigin(0, 0);

        this.sun = 5;
        this.water = 5;
    }
}