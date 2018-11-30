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
    var background = this.game.add.image(
      0, 0, 'background');

    //Recibe los datos del jugador guardados en localStorage
    this.playerData = localStorage.getItem("playerData"); 
    this.params = JSON.parse(this.playerData);
    console.log(this.params);
  },

  create: function () {
    this.Map = new Map(this.game,
      20,10,800,600,0
    )
    this.player = new Player(
      this.game, 'sim' + this.params.simIndex,
      this.game.world.centerX, this.game.world.centerX,
      'jugador', 10, 10, 10);

    this.arrow = this.player.addChild(this.game.make.sprite(0, -250, 'arrow'));
    this.arrow.anchor.setTo(0.5,0.5);
    this.arrow.scale.setTo(0.5,0.5);


    this.physics.arcade.enable(this.player);
    this.camera.follow(this.player);
    this.player.body.collideWorldBounds = true;


    /*var map;
    var layer;
    map = this.game.add.tilemap('mario');
    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    layer = map.createLayer('World1');
*/
    

  }
};


module.exports = PlayScene;