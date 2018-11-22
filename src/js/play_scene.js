'use strict';

//requires de las clases
var Neighbour = require('./Neighbour');
var Player = require('./Player');


//Función principal
var PlayScene = {

  create: function (player) {

    //this.game.add.Player(player);


    var player = new Player(
      this.game, 'sim1',
      this.game.world.centerX, this.game.world.centerX,
      'jugador', 10, 10, 10);

    this.physics.arcade.enable(player);
    this.camera.follow(player);
    player.body.collideWorldBounds = true;


    console.log(player.sprite);
  }
};


module.exports = PlayScene;