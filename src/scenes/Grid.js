const XTILES = 8;
const YTILES = 8;

/*
Grid is built by taking the config height/width and the x/y dimensions of the grid
Grid currently intializes all values to 0
*/
class Grid{
    constructor(width,height,x,y){
        this.tileX = width/x;
        this.tileY = height/y;
        this.gridMap = Array.from({ length: y }, () => Array(x).fill(0));
    }
}

class gridScene extends Phaser.Scene {
    constructor(){
        super("gridScene")
    }
    preload(){
        //TO-DO Preload Assets here
    }
    create(){
        this.grid = new Grid(this.scale.width, this.scale.height, XTILES,YTILES);
        let playGrid = this.grid.gridMap;
        console.log(playGrid[0][0]);
    }

    update(){

    }

}