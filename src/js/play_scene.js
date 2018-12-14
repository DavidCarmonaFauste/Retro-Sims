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
    /*this.game.input.keyboard.onPressCallback = function (e) {
      if (!this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { //para eviar que se pongan espacios
          console.log('pues si');
      }
    }*/



    //Valores iniciales
    this.initialX = this.game.world.centerX + 910, this.initialY = 3500;


    this.debug = false; //Poner a true para activar los debugs de player y del tilemap
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Tilemap
    this.map = new Map(this);

    this.map.objectsLayer.debug = this.debug; //debug del tilemap

    //Creación del jugador
    this.player = new Player(
      this.game, this.map, 'sim' + this.playerParams.simIndex,
      this.initialX, this.initialY,
    this.playerParams.name, 10, 10, 10);
    this.map.createTopLayers(); //Crea las capas del tilemap que están sobre el jugador
    this.camera.follow(this.player);

    this.createHUD();

  },

  update: function () {
    //Colisiones
    this.game.physics.arcade.collide(this.player, this.map.groundWallLayer);
    this.game.physics.arcade.collide(this.player, this.map.objectsLayer);
    //Desactiva las paredes si el jugador está en la casa
    if (this.map.isInside(this.player.x, this.player.y)) {
      this.map.setWalls(false);
    }
    else
      this.map.setWalls(true);
  },

  render: function () {

    //Debugs
    if (this.debug) {
      this.game.debug.spriteInfo(this.player, 32, );
      this.game.debug.body(this.player);
    }
  },

  //Crea la interfaz del
  createHUD: function () {
    this.hud_playerBox = this.game.add.sprite(85, window.innerHeight - 20, 'hudBox');
    this.hud_playerBox.anchor.set(0.5,0.5);
    this.hud_playerBox.scale.set(4,5);
    this.hud_playerBox.fixedToCamera = true;
    this.hud_nameText = this.game.add.bitmapText(50, window.innerHeight - 50, 'arcadeBlackFont', this.player.name, 20);
    this.hud_nameText.fixedToCamera = true;
  }
};
module.exports = PlayScene;