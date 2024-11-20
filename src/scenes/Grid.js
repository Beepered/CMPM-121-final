const NUMTILEX = 8;
const NUMTILESY = 8;

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

    getGridXCoordinate(x){
        return Math.floor(x/tileX);
    }

    getGridYCoordinate(y){
        return Math.floor(y/tileY);
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
        this.grid = new Grid(this.scale.width, this.scale.height, NUMTILEX, NUMTILESY);
        let playGrid = this.grid
        console.log(playGrid.gridMap[0][0]);
    }

    update(){

    }

}