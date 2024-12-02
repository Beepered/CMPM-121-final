class stateInfo{
    constructor(){
        this.playerInfo = null;
        this.cellBuffer = null;
    }
    setPlayerInfo(posX, posY){
        this.playerInfo = {playerX: posX, playerY: posY};
    }
    setCellBuffer(buffer) {
        this.cellBuffer = buffer;
    }
}


class gameStateManager {
    constructor() {
        this.undoStack = [{}];
        this.redoStack = [];
    }

    gameStateChange(action) {
        this.undoStack.push(action);
        this.redoStack = []; 
       // action.redo(); 
    }

    undo() {
        if (this.undoStack.length > 0) {
            const prevState = this.undoStack.pop();
            this.redoStack.push(prevState);
            return prevState;
        }
        else return null;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const nextState = this.redoStack.pop();
            this.undoStack.push(nextState);
            return nextState;
        }
        else return null;
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