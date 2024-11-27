class Action {
    constructor(identifier, prevState, nextState) {
        this.identifier = identifier; // like reap plant and next turn
        this.prevState = prevState;
        this.nextState = nextState;   
    }

    undo() {
        game.switchState(this.prevState); //idk how to reference a function in play
    }

    redo() {
        game.switchState(this.nextState);
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
        action.redo(); 
    }

    undo() {
        if (this.undoStack.length > 0) {
            const action = this.undoStack.pop();
            this.redoStack.push(action);
            action.undo();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const action = this.redoStack.pop();
            this.undoStack.push(action);
            action.redo();
        }
    }
}