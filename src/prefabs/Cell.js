class Cell extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.rectangle(x, y, this.displayWidth + 5, this.displayHeight + 5, 0x000000); // border

        scene.add.existing(this)
        
        scene.physics.add.existing(this)

        this.emitter = EventDispatcher.getInstance();
        this.setListeners();

        this.plant = null;

        this.sun = 3;
        this.water = 3;

        this.sunText = scene.add.text(x - 60, y - 60, this.sun.toString(), { fontSize: '18px', color:'yellow' })
        this.waterText = scene.add.text(x - 40, y - 60, this.water.toString(), { fontSize: '18px', color:'blue' })
    }

    NextTurn(){
        this.ChangeSun();
        this.ChangeWater();
        this.updateText();
        if(this.plant)
            this.plant.GiveNutrients(this, this.sun, this.water);
    }

    ChangeSun() {
        let minSun = 0;
        let maxSun = 0;
        switch(weather){
            case WEATHER.sunny:
                minSun = 6;
                maxSun = 10;
                break;
            case WEATHER.cloudy:
                minSun = 3;
                maxSun = 5;
                break;
            case WEATHER.rainy:
                minSun = 1;
                maxSun = 3;
                break;
        }
        this.sun = Math.floor(Math.random() * (maxSun - minSun + 1)) + minSun; // Immediate use of sun or it will be reset
    }

    ChangeWater() {
        let minWater = 0;
        let maxWater = 0;
        switch(weather){
            case WEATHER.sunny:
                minWater = 0;
                maxWater = 0;
                break;
            case WEATHER.cloudy:
                minWater = 1;
                maxWater = 2;
                break;
            case WEATHER.rainy:
                minWater = 2;
                maxWater = 3;
                break;
        }
        this.water += Math.floor(Math.random() * (maxWater - minWater + 1)) + minWater;
        if(this.water > 10){ // max water cell can hold is 10
            this.water = 10;
        }
    }

    Plant(seed) {
        this.plant = new Plant(this.scene, this.x, this.y, seed);
    }

    updateText() {
        this.sunText.text = this.sun.toString()
        this.waterText.text = this.water.toString()
    }

    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
    }
}