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
    this.tile = null;

    //tile indexes(clase MAP)
    this.sink = 15;
    this.toilet = 16;
    this.fridge = 19;
    this.mailbox = 17;



    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Tilemap
    this.map = this.game.add.tilemap('map'); //, 64, 64);
    this.map.addTilesetImage('tileset', 'tileset');
    //layers
    this.groundLayer = this.map.createLayer('groundLayer');
    this.groundLayer.resizeWorld();
    this.groundWallLayer = this.map.createLayer('groundWallLayer');
    this.wallLayer = this.map.createLayer('wallLayer');
    this.objectsLayer = this.map.createLayer('objectsLayer');
    //collision
    this.map.setCollisionByExclusion([], true, this.groundWallLayer);
    this.map.setCollisionByExclusion([], true, this.objectsLayer);

    this.objectsLayer.debug = this.debug; //debug del tilemap

    //Creación del jugador
    this.player = new Player(
      this.game, 'sim' + this.params.simIndex,
      this.game.world.centerX, this.game.world.centerY - 64,
      'jugador', 10, 10, 10);

    this.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();

  },

  update: function () {
    this.game.physics.arcade.collide(this.player, this.groundWallLayer);
    //this.game.physics.arcade.collide(this.player, this.objectsLayer);

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.V)) {
      this.wallLayer.kill();
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
      this.wallLayer.revive();
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.tile = this.map.getTile(this.objectsLayer.getTileX(this.player.x), this.objectsLayer.getTileY(this.player.y), this.objectsLayer);
      if (this.tile != null) {
        console.log(this.player.x + " " + this.player.y + ": " + this.tile.index);
        this.checkTile();
      }
    }
  },

  render: function () {

    //Debugs
    if (this.debug) {
      this.game.debug.spriteInfo(this.player, 32, );
      this.game.debug.body(this.player);
    }
  },

  checkTile: function () {
    switch (this.tile.index) {
      case this.sink:
        console.log("Washing my hands");
        break;
      case this.toilet:
        console.log("I'm peeing");
        break;
      case this.fridge:
        console.log("Let's eat something");
        break;
      case this.mailbox:
        console.log("Checking my mail, nothing inside");
        break;
    }

  }
};
module.exports = PlayScene;