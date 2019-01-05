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
    //this.game.load.image('trigger', 'images/cross.png'); //Imagen usada para triggers invisibles
    this.game.load.image('censor', 'images/censorship.png'); //Imagen usada para censurar


    // Imágenes del HUD
    this.game.load.image('hudBox', 'images/hud/hudBox.png'); //caja básica de la interfaz
    this.game.load.image('friendsIcon', 'images/hud/friendsIcon.png'); //icono submenú 'friends'
    this.game.load.image('friendsIconSelected', 'images/hud/friendsIconSelected.png'); //icono submenú 'friends'
    this.game.load.image('needsIcon', 'images/hud/needsIcon.png'); //icono submenú 'needs'
    this.game.load.image('needsIconSelected', 'images/hud/needsIconSelected.png'); //icono submenú 'needs'
    this.game.load.image('youIcon', 'images/hud/youIcon.png'); //icono submenú 'you'
    this.game.load.image('youIconSelected', 'images/hud/youIconSelected.png'); //icono submenú 'you'
    this.game.load.image('hungerIcon', 'images/hud/hungerIcon.png'); //icono necesidad: HUNGER
    this.game.load.image('toiletIcon', 'images/hud/toiletIcon.png'); //icono necesidad: TOILET
    this.game.load.image('sleepIcon', 'images/hud/sleepIcon.png'); //icono necesidad: SLEEP
    this.game.load.image('moneyIcon', 'images/hud/coinIcon.png'); //icono del dinero
    this.game.load.image('greenBox', 'images/hud/greenBox.png'); //cuadrado verde usado para las barras de necesidad
    this.game.load.image('intelligenceIcon', 'images/hud/intelligenceIcon.png'); 
    this.game.load.image('fitnessIcon', 'images/hud/fitnessIcon.png'); 
    this.game.load.image('charismaIcon', 'images/hud/charismaIcon.png'); 
    this.game.load.image('dialogHappy', 'images/hud/dialogBubbleHappy.png'); 
    this.game.load.image('dialogAngry', 'images/hud/dialogBubbleAngry.png'); 
    this.game.load.image('dialogLove', 'images/hud/dialogBubbleLove.png'); 
    this.game.load.image('nextButton', 'images/hud/nextButton.png'); 
    this.game.load.image('prevButton', 'images/hud/prevButton.png'); 
    this.game.load.image('resetButton', 'images/hud/resetButton.png'); 

    // Tilemaps y tilesets
    this.game.load.tilemap('map', 'images/tiles/tilemaps/tilemap2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tileset', 'images/tiles/tilemaps/tileset64.png');

    //temporal
    this.game.load.image('furni', 'images/tiles/worktop.png');

    // Fuentes
    this.game.load.bitmapFont('arcadeWhiteFont', 'fonts/arcadebmfWhite.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeBlackFont', 'fonts/arcadebmfBlack.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeGreenFont', 'fonts/arcadebmfGreenSpecial.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeRedFont', 'fonts/arcadebmfRed.png', 'fonts/arcadebmf.xml');

    // Audio
    this.game.load.audio('tap', 'audio/tap.wav');
    this.game.load.audio('keyboard1', 'audio/keyboard1.wav');
    this.game.load.audio('keyboard2', 'audio/keyboard2.wav');
    this.game.load.audio('keyboardBackspace', 'audio/keyboardBackspace.wav');
    this.game.load.audio('scroll', 'audio/scroll.wav');
    this.game.load.audio('select', 'audio/selection.wav');
    this.game.load.audio('creationCompleted', 'audio/creationCompleted.wav');
    this.game.load.audio('mainTheme', 'audio/mainTheme.mp3'); //MAIN THEME
    this.game.load.audio('pee', 'audio/peeing.mp3');
    this.game.load.audio('flush', 'audio/flush.wav');
    this.game.load.audio('pay', 'audio/pay.wav');
    this.game.load.audio('eating', 'audio/eating.wav');
    this.game.load.audio('sleeping', 'audio/sleeping.wav');
  },

  create: function () {
    // Audios del juego (los necesarios para distintas escenas)
    this.game.tap = this.game.add.audio('tap');
    this.game.select = this.game.add.audio('select');
    this.game.theme = this.game.add.audio('mainTheme');

    //Hace que el navegador ignore algunos inputs (flechas y espacio) para evitar mover la ventana jugando
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.DOWN, 
      Phaser.Keyboard.UP, 
      Phaser.Keyboard.RIGHT, 
      Phaser.Keyboard.LEFT, 
      Phaser.Keyboard.SPACEBAR
    ]);

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