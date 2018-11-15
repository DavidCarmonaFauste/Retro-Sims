'use strict';

var PlayScene = require('./play_scene.js');
var CreationScene = require('./creation_scene.js') //Escena de creación de personaje
var MenuScene = require('./menu_scene.js');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/logo_b.png'); //Logotipo del juego
    this.game.load.image('devLogo', 'images/AE.png'); //Logotipo del equipo de des.
      this.game.load.image('paredTop', 'images/Pared0_Top.png');
      for (var i = 11; i <= 10; i++)
          this.game.load.image('Sim' + i, 'images/Sim' + i +'.png');

    
  },

  create: function () {
    this.game.state.start('menu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('menu', MenuScene); //Main menu
  game.state.add('characterCreation', CreationScene); //Escena de creación de personaje

  game.state.start('boot');
};
