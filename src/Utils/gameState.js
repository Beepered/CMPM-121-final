class stateInfo{
    constructor(){
        this.playerInfo = null;
        this.cellArray = null;
    }
    setPlayerInfo(posX, posY){
        this.playerInfo = {playerX: posX, playerY: posY};
    }
}


class gameStateManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    gameStateChange(action) {
        this.undoStack.push(action);
        this.redoStack = []; 
       // action.redo(); 
    }

    undo() {
        if (this.undoStack.length > 0) {
            const action = this.undoStack.pop();
            this.redoStack.push(action);
            return action;
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const action = this.redoStack.pop();
            this.undoStack.push(action);
            return action;
        }
    }
}
/*
Game state objects need to contain
Cell array 
    Cell sun/water levels
    Cell plant type/growth

Player 
    turn count 
    player Seed count
    player position
 */