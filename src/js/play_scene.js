'use strict';

//requires de las clases
var Neighbour = require('./Neighbour');
var Player = require('./Player');
var Map = require('./Map');


//Función principal
var PlayScene = {
    player: null,
    playerParams: null,
    arrow: null,

    init: function () {
      // var background = this.game.add.image(
      //  0, 0, 'background');

      //Recibe los datos del jugador guardados en localStorage
      this.playerData = localStorage.getItem("playerData");
      this.playerParams = JSON.parse(this.playerData);
      console.log(this.playerParams);
    },

    create: function () {
      this.debug = true; //Poner a true para activar los debugs de player y del tilemap
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //Tilemap
      this.map = new Map(this);

      this.map.objectsLayer.debug = this.debug; //debug del tilemap

      //Creación del jugador
      this.player = new Player(
        this.game, this.map, 'sim' + this.playerParams.simIndex,
        this.game.world.centerX, this.game.world.centerY - 64,
        'jugador', 10, 10, 10);

      this.camera.follow(this.player);


    },

    update: function () {
      //Colisiones
      this.game.physics.arcade.collide(this.player, this.map.groundWallLayer);
      this.game.physics.arcade.collide(this.player, this.map.objectsLayer);

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