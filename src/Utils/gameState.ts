class gameStateManager {
    undoStack: string[];
    redoStack: string[];
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.undoStack = [];
        this.redoStack = [];
        this.scene = scene;
    }

    gameStateChange(state: string) {
        this.undoStack.push(state);
        this.redoStack = []; 
    }

    undo() {
        if (this.undoStack.length > 0) {
            const playScene = this.scene.scene.get("playScene") as Play; 
            const newBuffer = playScene.appendBuffer(playScene.GetArrayBufferFromGrid(), playScene.GetArrayBufferFromPlayer())
            const currentState = playScene.arrayBufferToBase64(newBuffer)
            this.redoStack.push(currentState);
            const prevState = this.undoStack.pop();
            return prevState;
        }
        else return null;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const playScene = this.scene.scene.get("playScene") as Play; 
            const newBuffer = playScene.appendBuffer(playScene.GetArrayBufferFromGrid(), playScene.GetArrayBufferFromPlayer())
            const currentState = playScene.arrayBufferToBase64(newBuffer)
            this.undoStack.push(currentState);
            const nextState = this.redoStack.pop();
            return nextState;
        }
        else return null;
    }
}