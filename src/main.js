let config = {
    type: Phaser.CANVAS,
    physics:{
        default: "arcade",
        arcade:{
            debug:true
        }
    },
    width: 800,
    height: 500,
    backgroundColor: '#3f9b0b',
    scene: [Menu, Credits, Play, UIScene]
}

let game = new Phaser.Game(config);
let gameHeight = game.config.height
let gameWidth = game.config.width

let OUI = new OuterUI();