'use strict';

//requires de las clases
var Neighbour = require('./Neighbour');
var Player = require('./Player');
var Map = require('./Map');


//Función principal
var PlayScene = {
  player: null,
  params: null,

  init: function () {
    this.playerData = localStorage.getItem("playerData");
    this.params = JSON.parse(this.playerData);
    console.log(this.params);
  },

  create: function () {
    
    console.log('create: '+this.params);

    this.player = new Player(
      this.game, 'sim' + this.params.simIndex,
      this.game.world.centerX, this.game.world.centerX,
      'jugador', 10, 10, 10);

    this.physics.arcade.enable(this.player);
    this.camera.follow(this.player);
    this.player.body.collideWorldBounds = true;
  }
};


module.exports = PlayScene;