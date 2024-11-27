class Cell extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.rectangle(x, y, this.displayWidth + 5, this.displayHeight + 5, 0x000000); // border
        scene.add.existing(this)
        

        scene.physics.add.existing(this)

        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.plant = null;

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

    NextTurn(){
        this.ChangeSun();
        this.ChangeWater();
        if(this.plant)
            this.plant.GiveNutrients(this, this.sun, this.water);
    }

    ChangeSun() {
        const minSun = 1;
        const maxSun = 10;
        this.sun = Math.floor(Math.random() * maxSun) + minSun; // Immediate use of sun or it will be reset
    }

    ChangeWater() {
        const minWater = 1;
        const maxWater = 3;
        const WaterPower = Math.floor(Math.random() * maxWater) + minWater;
        this.water = this.water + WaterPower // Collect the water
        if(this.water > 10){ // max water cell can hold is 10
            this.water = 10;
        }
    }
    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
    }
}