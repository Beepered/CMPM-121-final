"use strict";
class gameStateManager {
    constructor(scene) {
        this.undoStack = [];
        this.redoStack = [];
        this.scene = scene;
    }
    gameStateChange(state) {
        this.undoStack.push(state);
        this.redoStack = [];
    }
    undo() {
        if (this.undoStack.length > 0) {
            const playScene = this.scene.scene.get("playScene");
            const newBuffer = playScene.appendBuffer(playScene.GetArrayBufferFromGrid(), playScene.GetArrayBufferFromPlayer());
            const currentState = playScene.arrayBufferToBase64(newBuffer);
            this.redoStack.push(currentState);
            const prevState = this.undoStack.pop();
            return prevState;
        }
        else
            return null;
    }
    redo() {
        if (this.redoStack.length > 0) {
            const playScene = this.scene.scene.get("playScene");
            const newBuffer = playScene.appendBuffer(playScene.GetArrayBufferFromGrid(), playScene.GetArrayBufferFromPlayer());
            const currentState = playScene.arrayBufferToBase64(newBuffer);
            this.undoStack.push(currentState);
            const nextState = this.redoStack.pop();
            return nextState;
        }
        else
            return null;
    }
}
