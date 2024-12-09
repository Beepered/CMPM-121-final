"use strict";
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.emitter = EventDispatcher.getInstance();
        this.depth = 1;
        this.setScale(0.6);
        this.body.setSize(this.width * 0.5, this.height * 0.5);
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyLEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyDOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyRIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.SPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.moveSpeed = 300;
        this.cell = null;
        this.playersTurn = true;
        this.checkCellList = [];
        this.setListeners();
    }
    update() {
        if (this.playersTurn) {
            this.controls();
        }
        if (this.body.embedded && this.checkCellList.length > 0) {
            this.cell = this.CalculatePlayerCell();
        }
        else if (this.body.touching.none && !this.body.wasTouching.none) {
            this.cell = null;
        }
    }
    controls() {
        if (this.keyUP.isDown || this.keyW.isDown) {
            this.body.velocity.y = -this.moveSpeed;
        }
        else if (this.keyDOWN.isDown || this.keyS.isDown) {
            this.body.velocity.y = this.moveSpeed;
        }
        else {
            this.body.velocity.y = 0;
        }
        if (this.keyLEFT.isDown || this.keyA.isDown) {
            this.body.velocity.x = -this.moveSpeed;
        }
        else if (this.keyRIGHT.isDown || this.keyD.isDown) {
            this.body.velocity.x = this.moveSpeed;
        }
        else {
            this.body.velocity.x = 0;
        }
        if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
            this.Action();
        }
    }
    Action() {
        if (this.cell) {
            if (this.cell.plant == null && seeds > 0) {
                this.undoRedo();
                this.emitter.emit("plant");
                this.Plant();
            }
            else if (this.cell.plant != null && this.cell.plant.growth >= 3) {
                this.undoRedo();
                this.Reap();
                this.emitter.emit("reap");
            }
        }
    }
    Plant() {
        const typeArray = ["sunflower", "rose", "lavender"];
        const randSeed = Math.floor(Math.random() * 3);
        const typeName = typeArray[randSeed];
        this.cell.Plant(typeName);
    }
    Reap() {
        this.cell.plant.destroy();
        this.cell.plant = null;
    }
    // Check every cell the player is overlapping
    // IF one of the cells is the cell the player was already standing on just use that one
    CalculatePlayerCell() {
        let newCell = this.cell;
        this.checkCellList.every(cell => {
            if (cell == this.cell) {
                newCell = this.cell;
                return false;
            }
            newCell = cell;
            return true;
        });
        this.checkCellList = [];
        return newCell;
    }
    setListeners() {
        this.emitter.on("end-game", () => { this.playersTurn = false; });
    }
    undoRedo() {
        const playScene = this.scene.scene.get("playScene");
        const newBuffer = playScene.appendBuffer(playScene.GetArrayBufferFromGrid(), playScene.GetArrayBufferFromPlayer());
        const encode = playScene.arrayBufferToBase64(newBuffer);
        playScene.gameStateManager.gameStateChange(encode);
        playScene.UpdateCellText();
    }
}
