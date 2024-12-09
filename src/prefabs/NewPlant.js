class NewPlant extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, _internalPlantType) {
        super(scene, x, y);
        scene.add.existing(this);

        this.internalPlantType = _internalPlantType;
        this.setTexture(this.internalPlantType.texture)

        this.emitter = EventDispatcher.getInstance();
    }

    // need to work on getting the plant to change
}