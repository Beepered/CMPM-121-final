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

        this.XTiles = 8; // you can also do this so there aren't out-of-scoped variables
        this.YTiles = 8;
    }
    preload(){
        //TO-DO Preload Assets here
        this.load.image("testplant", "assets/testplant.png")
    }
    create(){
        /*
        this.grid = new Grid(this.scale.width, this.scale.height, NUMTILEX, NUMTILESY);
        let playGrid = this.grid
        console.log(playGrid.gridMap[0][0]);

        console.log(this.grid.getGridXCoordinate(2))
        */
       this.grid = this.MakeArray(this.XTiles, this.YTiles);
       this.FillGridWithCells(this.grid);
    }

    update(){

    }

    MakeArray(x, y){
        var newArray = [];
        for(let i = 0; i < y; i++) {
            newArray.push(new Array(x));
        }
        return newArray;
    }

    FillGridWithCells(arr){
        const xIncrement = gameWidth / this.XTiles;
        const yIncrement = gameHeight / this.YTiles;
        for(let i = 0; i < arr.length; i++){ // y
            let newI = i + 1;
            for(let j = 0; j < arr[i].length; j++){ // x
                let newJ = j + 1;
                arr[i][j] = new Cell(this, xIncrement * newJ, yIncrement * newI, "testplant");
            }
        }
    }

}