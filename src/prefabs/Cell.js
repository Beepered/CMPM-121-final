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

        this.sunText = scene.add.text(x - 60, y - 60, this.sun.toString(), { fontSize: '18px', color:'yellow' })
        this.waterText = scene.add.text(x - 45, y - 60, this.water.toString(), { fontSize: '18px', color:'blue' })
    }

    NextTurn(){
        this.ChangeSun();
        this.ChangeWater();
        this.updateText();
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

    updateText(){
        this.sunText.text = this.sun.toString()
        this.waterText.text = this.water.toString()
    }

    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
    }
}