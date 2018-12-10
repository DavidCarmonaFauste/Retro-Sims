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

    // Carga de imágenes
    this.game.load.image('logo', 'images/logo_b.png'); //Logotipo del juego
    this.game.load.image('devLogo', 'images/AE.png'); //Logotipo del equipo de des.
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('paredTop', 'images/Pared0_Top.png');
    for (var i = 1; i <= 10; i++) //Los sprites de los sims
      this.game.load.image('sim' + i, 'images/sims/Sim' + i + '.png');
    this.game.load.spritesheet('simAnim', 'images/sims/Sim1spritesheet.png', 20, 32);
    this.game.load.image('arrow', 'images/SimsArrow.png'); //Flecha verde
    this.game.load.image('trigger', 'images/cross.png'); //Imagen usada para triggers invisibles
    // Tilemaps y tilesets
    this.game.load.tilemap('map', 'images/tiles/tilemaps/tilemap2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tileset', 'images/tiles/tilemaps/tileset64.png');

    // Fuentes
    this.game.load.bitmapFont('arcadeWhiteFont', 'fonts/arcadebmfWhite.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeBlackFont', 'fonts/arcadebmfBlack.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeGreenFont', 'fonts/arcadebmfGreenSpecial.png', 'fonts/arcadebmf.xml');

    // Audio
    this.game.load.audio('tap', 'audio/tap.wav');
    this.game.load.audio('scroll', 'audio/scroll.wav');
    this.game.load.audio('select', 'audio/selection.wav');
    this.game.load.audio('creationCompleted', 'audio/creationCompleted.wav');
    //this.game.load.audio('mainTheme', 'audio/mainTheme.mp3')
  },

  create: function () {
    // Audios del juego (los necesarios para distintas escenas)
    this.game.tap = this.game.add.audio('tap');
    this.game.select = this.game.add.audio('select');
    this.game.theme = this.game.add.audio('mainTheme');

    // Inicia el menú
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