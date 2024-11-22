class gridScene extends Phaser.Scene {
    constructor(){
        super("gridScene")

        this.XTiles = 8; // you can also do this so there aren't out-of-scoped variables
        this.YTiles = 8;
    }
    preload(){
        //TO-DO Preload Assets here
        this.load.image("testplant", "assets/testplant.png")
        this.load.image("playerCharacter", "assets/Player_Character.png")
    }
    create(){
       this.grid = this.MakeArray(this.XTiles, this.YTiles);
       this.FillGridWithCells(this.grid);
       this.player = new Player(this,0,0,"playerCharacter",this.grid)
    }

    update(){
        this.player.update();
    }

    MakeArray(x, y){
        var newArray = [];
        for(let i = 0; i < y; i++) {
            newArray.push(new Array(x));
        }
        return newArray;
    }

    nextTurn(){
        //Could change to parsing an array with indexes of the active plants. This is temp
        for(let i = 0; i < this.grid.length; i++){
            for(let j = 0; j < this.grid[0].length; j++){
                const currentGrid = grid[i][j]
                const currentPlant = currentGrid.plant;
                if(currentPlant.isVisible){
                    //Change these to const values instead of magic numbers. This is just temp growth condition.
                    if(currentGrid.sun >= 5 && currentGrid.water >= 5){
                        currentPlant.growth ++;
                    }
                }
            }
        }
    }

    FillGridWithCells(arr){
        const xIncrement = gameWidth / this.XTiles;
        const yIncrement = gameHeight / this.YTiles;
        for(let i = 0; i < arr.length; i++){ // y
            for(let j = 0; j < arr[i].length; j++){ // x
                arr[i][j] = new Cell(this, xIncrement * j, yIncrement * i, "testplant");
            }
        }
    }

}