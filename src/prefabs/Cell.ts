class Cell extends Phaser.GameObjects.Sprite {
    emitter: EventDispatcher;
    plant: Plant | null;
    sun: number;
    water: number;
    sunText: Phaser.GameObjects.Text;
    waterText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, texture:string) {
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
        const neighbors = this.getNeighbors()
        if(this.plant)
            this.plant.GiveNutrients(this, this.sun, this.water, neighbors);
    }

    ChangeSun() {
        let minSun = 0;
        let maxSun = 0;
        switch(weather){
            case WEATHER.sunny:
                minSun = 6
                maxSun = 10
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
        this.sun = Math.floor(Math.random() * maxSun) + minSun; // Immediate use of sun or it will be reset
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
        const WaterPower = Math.floor(Math.random() * maxWater) + minWater;
        this.water = this.water + WaterPower;
        if(this.water > 10){ // max water cell can hold is 10
            this.water = 10;
        }
    }

    Plant(typename: string) {
        this.plant = new Plant(this.scene, this.x, this.y, typename);
        this.plant.typeName = typename
    }

    getNeighbors() {
        const neighbors:Cell[] = []
        const grid = this.scene.grid // Ensure the grid is correctly referenced

        if (!grid || this.xIndex == null || this.yIndex == null) {
            console.error("Grid or indices not found for cell:", this)
            return neighbors
        }

        const directions = [
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 },  // Right
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 }   // Down
        ]

        directions.forEach(dir => {
            const nx = this.xIndex + dir.x
            const ny = this.yIndex + dir.y

            // Ensure neighbor is within grid boundaries
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
            const neighbor = grid[nx][ny]
            if (neighbor.plant) {
                neighbors.push(neighbor)
            }
            }
        })

        //console.log("Flower neighbors for cell:", this, neighbors)
        return neighbors
        }

    updateText() {
        this.sunText.text = this.sun.toString()
        this.waterText.text = this.water.toString()
    }

    setListeners() {
        this.emitter.on("next-turn", this.NextTurn.bind(this));
    }
    removePlant(){
        if(this.plant){
            this.plant.destroy();
        }
        this.plant = null;
    }
}