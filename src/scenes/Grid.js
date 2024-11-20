const NUMTILEX = 8;
const NUMTILESY = 8;

/*
Grid is built by taking the config height/width and the x/y dimensions of the grid
Grid currently intializes all values to 0
*/
class Grid{
    constructor(width, height, x, y){
        this.cellWidth = width/x;
        this.cellHeight = height/y;
        this.gridMap = Array.from({ length: y }, () => Array(x).fill(0));
    }

    getGridXCoordinate(x) {
        return Math.floor(x / this.cellWidth);
    }

    getGridYCoordinate(y) {
        return Math.floor(y / this.cellHeight);
    }
}

class gridScene extends Phaser.Scene {
    constructor(){
        super("gridScene")

        this.XTiles = 8; // UNUSED: you can also do this so there aren't out-of-scoped variables
        this.YTiles = 8;
    }
    preload(){
        //TO-DO Preload Assets here
        
    }
    create(){
        this.grid = new Grid(this.scale.width, this.scale.height, NUMTILEX, NUMTILESY);
        let playGrid = this.grid
        console.log(playGrid.gridMap[0][0]);

        console.log(this.grid.getGridXCoordinate(2))
    }

    update(){

    }

}