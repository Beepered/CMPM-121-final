class Plant{
    constructor(scene, x, y, type){
        this.x = x;
        this.y = y;
        this.type = type; //a number between 1 - 3
        this.growth = 0;
        scene.add.existing(this);
    }
    growPlant(lvl){
        this.growth += lvl;
    }
}