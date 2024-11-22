class Cell extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this)
        
        this.setOrigin(0, 0);
        
        this.setActive(false);
        this.setVisible(false);
        this.isVisible = false;

        this.growth = 0;
        this.sun = 5;
        this.water = 5;
    }

    // Method to randomly generate the incoming sun and water per turn
    generateSunandWater() {

        const SunPower = Math.floor(Math.random() * 10) + 1; // Random generation from 1 to 10
        const WaterPower = Math.floor(Math.random() * 10) + 1; // Random generation from 1 to 10

        this.sun = SunPower; // Immediate use of sun or it will be reset
        this.water = this.water + WaterPower // Collect the water
    }
    growPlant(lvl){
        this.growth += lvl;
    }
    sow(){
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