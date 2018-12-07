'use strict';

//requires de las clases
var Neighbour = require('./Neighbour');
var Player = require('./Player');
var Map = require('./Map');


//Función principal
var PlayScene = {
  player: null,
  params: null,
  arrow: null,

  init: function () {
    // var background = this.game.add.image(
    //  0, 0, 'background');

    //Recibe los datos del jugador guardados en localStorage
    this.playerData = localStorage.getItem("playerData");
    this.params = JSON.parse(this.playerData);
    console.log(this.params);
  },

  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Tilemap
    this.map = this.game.add.tilemap('tilemap', 64, 64);
    this.map.addTilesetImage('tileset64', 'tileset');
    //this.map.setCollision([15,16,10,9]);
    this.soilLayer = this.map.createLayer('suelo');
    //console.log(this.soilLayer);
    this.soilLayer.resizeWorld();

    this.objectsLayer = this.map.createLayer('objetos');
    this.map.setCollision([6,7,8,9,13,14,15,19], true, 'objetos');
    this.objectsLayer.resizeWorld();

    //this.objectsLayer.debug = true;
    this.wallsLayer = this.map.createLayer('walls');
    this.map.setCollision(true, 'walls');
    this.wallsLayer.resizeWorld();

    this.game.physics.arcade.enable(this.objectsLayer);

    this.player = new Player(
      this.game, 'sim' + this.params.simIndex,
      this.game.world.centerX, this.game.world.centerY - 64,
      'jugador', 10, 10, 10);

    this.arrow = this.player.addChild(this.game.make.sprite(0, -250, 'arrow'));
    this.arrow.anchor.setTo(0.5, 0.5);
    this.arrow.scale.setTo(0.5, 0.5);


    this.game.physics.arcade.enable(this.player);
    this.camera.follow(this.player);
    this.player.body.collideWorldBounds = true;

  },

  update: function () {
    this.game.physics.arcade.collide(this.arrow, this.objectsLayer, function(){ 
      console.log('colisión entre arrow y objetos');
    });

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.wallsLayer.kill();
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
      this.wallsLayer.revive();
    }
  }
};

//, function(){ 
//  console.log('colisión entre player y objetos');
//}
module.exports = PlayScene;