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
    this.debug = false; //Poner a true para activar los debugs de player y del tilemap
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Tilemap
    this.map = this.game.add.tilemap('map', 64, 64);
    this.map.addTilesetImage('tileset');
    //layer
    this.layer = this.map.createLayer(0);
    this.layer.resizeWorld();
    //collision
    this.map.setCollisionByExclusion([], true, this.layer);

    this.layer.debug = this.debug; //debug del tilemap

    //Creación del jugador
    this.player = new Player(
      this.game, 'sim' + this.params.simIndex,
      this.game.world.centerX, this.game.world.centerY - 64,
      'jugador', 10, 10, 10);

    this.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();

  },

  update: function () {
    this.game.physics.arcade.collide(this.player, this.layer);

    /*if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.wallsLayer.kill();
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
      this.wallsLayer.revive();
    }*/
  },

  render: function () {

    //Debugs
    if (this.debug) {
      this.game.debug.spriteInfo(this.player, 32, );
      this.game.debug.body(this.player);
    }
  }
};
module.exports = PlayScene;