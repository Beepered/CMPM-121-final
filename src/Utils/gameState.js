class gameStateManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    gameStateChange(state) {
        this.undoStack.push(state);
        this.redoStack = []; 
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