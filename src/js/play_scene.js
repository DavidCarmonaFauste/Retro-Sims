'use strict';

//requires de las clases
var Neighbour = require('./Neighbour');
var Player = require('./Player');


//Función principal
var PlayScene = {
  player: null,

  init: function (data) {
    console.log(data.sprite);
    this.player = new Player(
      this.game, data.sprite,
      this.game.world.centerX, this.game.world.centerX,
      'jugador', 10, 10, 10);
  },

  create: function () {
    
    console.log('create');

    this.physics.arcade.enable(this.player);
    this.camera.follow(this.player);
    this.player.body.collideWorldBounds = true;
  }
};


module.exports = PlayScene;