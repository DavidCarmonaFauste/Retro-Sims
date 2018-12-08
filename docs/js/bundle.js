(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function Entity(dimX, dimY, sprite, game) {
    // this.dimX = dimX;
    // this.dimY = dimY;

    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, sprite);
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;



module.exports = Entity;
},{}],2:[function(require,module,exports){
'use strict';
function Map(ngame, nCols, nRows, width, height, nNeighbours) {
    this.game = ngame;
    this.nCols = nCols; //Num. de columnas de la matriz del mapa
    this.nRows = nRows; //Num. de filas de la matriz del mapa
    this.width = width; //Ancho del mapa
    this.height = height; //Alto del mapa
    this.nNeighbours = nNeighbours; //Num. de vecinos en el mapa
    this.house = []; //Matriz de muebles y paredes de la casa
    this.neighbours = []; //Array de vecinos
    this.tilemap = this.game.add.tilemap('mario'); //tilemap
    this.tilemap.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    this.layer = this.tilemap.createLayer('World1');
}

//MÉTODOS

//Inicializa el mapa creando el array de vecinos y la matriz de muebles
Map.prototype.initialize = function(){
    //Inicializa el array de vecinos aleatorios
    

    for(var i = 0; i < this.nNeighbours; i++){

    }

    //Inicializa la matriz de muebles
    for(var i = 0; i < this.nRows; i++){
        this.house[i] = [];
        for(var j = 0; j < this.nNeighbours; j++){
            //house[i][j] = ;
        }
    }
}


//Devuelve el furni que se encuentra en la posición (X, Y)
Map.prototype.getFurniAt = function(x, y){

}


//Crea el vecino neighbours[neighbourIndex] en la zona de spawn
Map.prototype.spawnNeighbour = function(neighbourIndex){

}


//Devuelve al vecino neighbours[neighbourIndex] al pool de vecinos
Map.prototype.killNeighbour = function(neighbourIndex){

}

module.exports = Map;
},{}],3:[function(require,module,exports){
var Entity = require('./Entity');

function Neighbour(friendship, sprite, game) {
  Entity.call(this, 1, 1, sprite, game);
  this.friendship = friendship;

}

Neighbour.prototype = Object.create(Entity.prototype);
Neighbour.prototype.constructor = Neighbour;

module.exports = Neighbour;
},{"./Entity":1}],4:[function(require,module,exports){
function Player(game, sprite, x, y, name, intelligence, fitness, charisma, money, job) {
  Phaser.Sprite.call(this, game, x, y, sprite);

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.25,0.25);


  this.needs = {
    pee: 10,
    hunger: 10,
    fatigue: 10
  };
  this.stats = {
    intelligence: intelligence,
    fitness: fitness,
    charisma: charisma
  };
  this.money = 10000;
  this.job = 'unemployed';
  this.sprite = sprite; //temporal
  this.name = name;

  this.active = true; //indica si el player se puede mover (no está en modo edición/conversación...)
  this.speed = 4; //velocidad de movimiento

  //Animaciones
  this.animations.add('idle',[0,1], 1, true);

  this.controls = {
    right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
    left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
    down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
  };


  game.add.existing(this); //añadir el sprite al game
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


//Métodos
Player.prototype.update = function() {
  if(this.active) //Comprueba que player no está en modo edición/conversación
    this.move();
};

Player.prototype.move = function() {
  if(this.controls.up.isDown){  //UP
    //this.animations.play('up');
    this.y -= this.speed;
  } else if(this.controls.down.isDown){ //DOWN
    //this.animations.play('down');
    this.y += this.speed;
  } else if (this.controls.left.isDown){ //LEFT
    //this.animations.play('left');
    this.x -= this.speed;
  } else if (this.controls.right.isDown){ //RIGHT
    //this.animations.play('right');
    this.x += this.speed;
  }
}

module.exports = Player;
},{}],5:[function(require,module,exports){
'use strict';

var CreationScene = {
    skins: null,
    skinIndex: null,
    params: null,
    right: 1,
    left: -1,
    txt: null,


    create: function () {
        this.skins = [];
        this.skinIndex = 1;
        this.params = {};

        this.txt = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 200, 'arcadeGreenFont', 'Choose your appearance', 40);
        this.txt.anchor.setTo(0.5, 0.5);
        this.txt.align = "center";

        var graySquare = this.game.add.image(
            0, this.game.world.centerY, 'paredTop');
        graySquare.anchor.setTo(0.5, 0.5);
        graySquare.scale.setTo(70, 5);

        for (var i = 1; i < 11; i++) {
            this.skins[i] = this.game.add.sprite(
                this.game.world.centerX + (i - 1) * 150, this.game.world.centerY, 'sim' + i);
            this.skins[i].anchor.setTo(0.5, 0.5);
            this.skins[i].scale.setTo(0.5, 0.5);
        }
        
        var arrow = this.game.add.image(
            this.game.world.centerX, this.game.world.centerY - 125, 'arrow');
        arrow.anchor.setTo(0.5, 0.5);
        arrow.scale.setTo(0.25, 0.25);



        return this.skins;
    },

    update: function () {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.skinIndex < 10) {
            move(this.game, this.skins, this.skinIndex, this.right);
            this.skinIndex++;
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.skinIndex > 1) {
            move(this.game, this.skins, this.skinIndex, this.left);
            this.skinIndex--;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            skinSelected(this.game, this.params, this.skinIndex);
        }
    },


};

//Métodos

function move(game, skins, index, dir) { //dir: izq = -1, der = 1
    var scroll = game.add.audio('scroll');
    scroll.play();

    for (var i = 1; i < 11; i++) {
        skins[i].x -= 150 * dir;
    }
    index = (index + 1) * dir;
    game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
}


function skinSelected(game, params, index) {
    game.select.play();
    creationCompleted(game, params, index);
}

function creationCompleted(game, params, index) {
    params.simIndex = index;

    var sound = game.add.audio('creationCompleted');
    sound.play();

    localStorage.setItem("playerData", JSON.stringify(params));

    game.state.start('play'); //Empieza playScene
}

module.exports = CreationScene;
},{}],6:[function(require,module,exports){
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

    // Carga tilemap
    this.game.load.tilemap('mario', 'js/super_mario.json', null, Phaser.Tilemap.TILED_JSON);

    // Carga de imágenes
    this.game.load.image('logo', 'images/logo_b.png'); //Logotipo del juego
    this.game.load.image('devLogo', 'images/AE.png'); //Logotipo del equipo de des.
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('paredTop', 'images/Pared0_Top.png');
    for (var i = 1; i <= 10; i++) //Los sprites de los sims
      this.game.load.image('sim' + i, 'images/sims/Sim' + i + '.png');
    this.game.load.spritesheet('simAnim', 'images/sims/Sim1spritesheet.png', 20, 32);
    this.game.load.image('arrow', 'images/SimsArrow.png'); //Flecha verde
    this.game.load.image('tiles', 'images/super_mario.png');

    // Fuentes
    this.game.load.bitmapFont('arcadeWhiteFont', 'fonts/arcadebmfWhite.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeBlackFont', 'fonts/arcadebmfBlack.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeGreenFont', 'fonts/arcadebmfGreenSpecial.png', 'fonts/arcadebmf.xml');

    // Audio
    this.game.load.audio('tap', 'audio/tap.wav');
    this.game.load.audio('scroll', 'audio/scroll.wav');
    this.game.load.audio('select', 'audio/selection.wav');
    this.game.load.audio('creationCompleted', 'audio/creationCompleted.wav');
    this.game.load.audio('mainTheme', 'audio/mainTheme.mp3');
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
},{"./creation_scene.js":5,"./menu_scene.js":7,"./play_scene.js":8}],7:[function(require,module,exports){
'use strict';

var MenuScene = {
    create: function () {
        //Reproducir el main theme
        this.game.theme.loop = true; //loop
        this.game.theme.volume = 0.075; //volumen
        this.game.theme.play();

        var logo = this.game.add.sprite(
            this.game.world.centerX, this.game.world.centerY - 90, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(0.75, 0.75);

        //botón para ir a crear personaje
        addButton(this.game, 'Create a character',
            this.game.world.centerX, this.game.world.centerY + 120,
            550, 70,
            function () {
                this.game.tap.play();
                this.game.state.start('characterCreation');
            }
        )

    },

    update: function () {

    }
};

function addButton(game, string, x, y, w, h, callback) {
    var button = game.add.button(x, y, 'paredTop', callback, this, 2, 1, 0);

    button.anchor.setTo(0.5, 0.5);
    button.width = w;
    button.height = h;

    var txt = game.add.bitmapText(button.x, button.y, 'arcadeBlackFont', string, 40);
    txt.anchor.setTo(0.5, 0.5);
    txt.align = "center";
}


module.exports = MenuScene;
},{}],8:[function(require,module,exports){
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
},{"./Map":2,"./Neighbour":3,"./Player":4}]},{},[6]);
