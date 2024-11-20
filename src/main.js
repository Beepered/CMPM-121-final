let config = {
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    physics:{
        default: "arcade",
        arcade:{
            debug:false
        }
    },
    backgroundColor: '#4488aa',
    width: 800,
    height: 500,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);
let gameHeight = game.config.height
let gameWidth = game.config.width