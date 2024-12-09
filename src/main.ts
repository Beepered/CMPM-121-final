let config = {
    type: Phaser.CANVAS,
    physics:{
        default: "arcade",
        arcade:{
            debug:false
        }
    },
    width: 800,
    height: 500,
    backgroundColor: '#3f9b0b',
    scene: [Menu, Credits, Play, UIScene]
}

let game = new Phaser.Game(config);
let gameHeight:number = +game.config.height
let gameWidth:number = +game.config.width

let maxSeeds = 3;
let seeds:number = 3;
const WEATHER = {
    sunny: "sunny",
    cloudy: "cloudy",
    rainy: "rainy"
};
let weather = WEATHER.sunny