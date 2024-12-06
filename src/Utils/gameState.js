class gameStateManager {
    constructor(playScene) {
        this.undoStack = [];
        this.redoStack = [];
        this.playScene = playScene;
    }

    gameStateChange(state) {
        this.undoStack.push(state);
        this.redoStack = []; 
    }

    undo() {
        if (this.undoStack.length > 0) {
            const newBuffer = this.playScene.appendBuffer(this.playScene.GetArrayBufferFromGrid(), this.playScene.GetArrayBufferFromPlayer())
            const currentState = this.playScene.arrayBufferToBase64(newBuffer)
            this.redoStack.push(currentState);
            const prevState = this.undoStack.pop();
            return prevState;
        }
        else return null;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const newBuffer = this.playScene.appendBuffer(this.playScene.GetArrayBufferFromGrid(), this.playScene.GetArrayBufferFromPlayer())
            const currentState = this.playScene.arrayBufferToBase64(newBuffer)
            this.undoStack.push(currentState);
            const nextState = this.redoStack.pop();
            return nextState;
        }
        else return null;
    }
}