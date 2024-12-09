"use strict";
//https://www.youtube.com/watch?v=vjlXPXLy5KU&ab_channel=WClarkson
let instance = null;
class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super();
        if (instance == null) {
            instance = this;
        }
    }
    static getInstance() {
        if (instance == null) {
            instance = new EventDispatcher();
        }
        return instance;
    }
}
