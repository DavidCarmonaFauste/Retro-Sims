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
function Map(game) {
    this.nNeighbours = 10; //Num. de vecinos en el mapa
    this.neighbours = []; //Array de vecinos

    //tilemap
    this.map = game.add.tilemap('map'); //, 64, 64);
    this.map.addTilesetImage('tileset', 'tileset');
    //layers
    this.groundLayer = this.map.createLayer('groundLayer'); //suelo
    this.groundLayer.resizeWorld();
    this.groundWallLayer = this.map.createLayer('groundWallLayer'); //Paredes(altura 1)
    this.objectsLayer = this.map.createLayer('objectsLayer'); //Objetos
    this.wallLayer = this.map.createLayer('wallLayer'); //Paredes
    //collision
    this.map.setCollisionByExclusion([], true, this.groundWallLayer);
    this.map.setCollisionByExclusion([], true, this.objectsLayer);

    //tile indexes(clase MAP)
    this.sink = 51; //LAVABO
    this.toilet = 52; //RETRETE
    this.fridge = 73; //FRIGORÍFICO
    this.mailbox = 53; //BUZÓN
    this.bed = 26; //CAMA

    this.wallsAreActive = true; //true si las paredes del mapa están visibles
    //Límites de la casa
    this.x = 540;
    this.y = 2202;
    this.w = 2010;
    this.h = 3210;
    //game.physics.enable(this.doorTrigger, Phaser.Physics.ARCADE);
}

//MÉTODOS

//Inicializa el mapa creando el array de vecinos y la matriz de muebles
/*Map.prototype.initialize = function(){
    //Inicializa el array de vecinos aleatorios
    for(var i = 0; i < this.nNeighbours; i++){

    }

    //Inicializa la matriz de muebles
    for(var i = 0; i < this.nRows; i++){
        house[i] = [];
        for(var j = 0; j < this.nNeighbours; j++){
            //house[i][j] = ;
        }
    }
}*/


//Comprueba si las coordenadas recibidas están dentro de los límites del mapa
Map.prototype.isInside = function(_x, _y){
    return(_x >= this.x && _x <= this.w &&
        _y >= this.y && _y <= this.h);
}


//Crea las capas del tilemap que se ven por encima del jugador
Map.prototype.createTopLayers = function () {
    this.overPlayerObjects = this.map.createLayer('overPlayerObjects'); //Objetos sobre el jugador
    this.overPlayerWalls = this.map.createLayer('overPlayerWalls'); //Paredes sobre el jugador
}


//Devuelve el furni que se encuentra en la posición (X, Y)
Map.prototype.getTileType = function (player) {
    this.tile = this.map.getTile(this.objectsLayer.getTileX(player.x + (32 * player.getDir().x)), this.objectsLayer.getTileY(player.y + (32 * player.getDir().y)), this.objectsLayer);
    
    if (this.tile != null) {
        console.log(player.x + ", " + player.y + ": " + this.tile.index);

        var type = "";

        switch (this.tile.index) {
            case this.sink:
                type = "sink";
                break;
            case this.toilet:
                type = "toilet";
                break;
            case this.fridge:
                type = "fridge";
                break;
            case this.mailbox:
                type = "mailbox";
                break;
            case this.bed:
                type = "bed";
                break;
            default:
                type = "";
                break;
        }

        return type;
    }
};


//Activa/Desactiva las paredes
Map.prototype.toggleWalls = function () {
    if (this.wallsAreActive) {
        this.wallLayer.kill();
        this.overPlayerWalls.kill();
    } else {
        this.wallLayer.revive();
        this.overPlayerWalls.revive();
    }
    this.wallsAreActive = !this.wallsAreActive;
};

Map.prototype.setWalls = function (active) {
    if (!active) {
        this.wallLayer.kill();
        this.overPlayerWalls.kill();
    } else {
        this.wallLayer.revive();
        this.overPlayerWalls.revive();
    }
    //this.wallsAreActive = !this.wallsAreActive;
};


//Crea el vecino neighbours[neighbourIndex] en la zona de spawn
Map.prototype.spawnNeighbour = function (neighbourIndex) {

};


//Devuelve al vecino neighbours[neighbourIndex] al pool de vecinos
Map.prototype.killNeighbour = function (neighbourIndex) {

};

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
function Player(game, map, sprite, x, y, name, intelligence, fitness, charisma, money, job) {
  //Mapa
  this.map = map;

  Phaser.Sprite.call(this, game, x, y, sprite);

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.3, 0.3);

  //Necesidades
  this.needs = {
    pee: 10,
    hunger: 10,
    fatigue: 10
  };
  //Atributos
  this.stats = {
    intelligence: intelligence,
    fitness: fitness,
    charisma: charisma
  };
  //Dinero
  this.money = 10000;
  //Trabajo
  this.job = 'unemployed';
  //Nombre
  this.name = name;
  //Activo
  this.active = true; //indica si el player se puede mover (no está en modo edición/conversación...)
  //Vel. de movimiento
  this.speed = 300; //velocidad de movimiento
  //Dirección de movimiento
  this.dir = new Phaser.Point(0, 1)
  //Animaciones
  this.animations.add('idle', [0, 1], 1, true);

  this.controls = {
    right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
    left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
    down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
    space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  };

  game.physics.enable(this, Phaser.Physics.ARCADE);

  game.add.existing(this); //añadir el sprite al game
  this.body.setSize(160, 144, 32, 112); //Establece el tamaño y la posición del collider (w,h,x,y)

  this.body.collideWorldBounds = true; //Establece la colisión con los límites del juego

  //Crea la flecha del jugador
  this.arrow = this.addChild(this.game.make.sprite(0, -250, 'arrow'));
  this.arrow.anchor.setTo(0.5, 0.5);
  this.arrow.scale.setTo(0.5, 0.5);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


//Métodos
Player.prototype.update = function () {
  if (this.active) //Comprueba que player no está en modo edición/conversación
    this.move();

  if (this.controls.space.isDown) {
    this.interact(this.map);
  }

  if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
    this.map.toggleWalls();
  }
};

Player.prototype.move = function () {
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;

  if (this.controls.up.isDown) { //UP
    //this.animations.play('up');
    this.body.velocity.y -= this.speed;
    this.dir.x = 0; this.dir.y = -1;
  } else if (this.controls.down.isDown) { //DOWN
    //this.animations.play('down');
    this.body.velocity.y += this.speed;
    this.dir.x = 0; this.dir.y = 1;
  } else if (this.controls.left.isDown) { //LEFT
    //this.animations.play('left');
    this.body.velocity.x -= this.speed;
    this.dir.x = -1; this.dir.y = 0;
  } else if (this.controls.right.isDown) { //RIGHT
    //this.animations.play('right');
    this.body.velocity.x += this.speed;
    this.dir.x = 1; this.dir.y = 0;
  }

  //console.log(this.dir.x + " " + this.dir.y);
}

Player.prototype.interactWithSink = function () {
  console.log("Washing my hands");
}

Player.prototype.interactWithToilet = function () {
  console.log("Peeing");
}

Player.prototype.interactWithFridge = function () {
  console.log("Getting something to eat");
}

Player.prototype.interactWithMailbox = function () {
  console.log("Checking my mails");
}

Player.prototype.interactWithBed = function () {
  console.log("Going to sleep, good night");
}

Player.prototype.interact = function (map) {
  var type = map.getTileType(this);

  switch (type) {
    case "sink":
      this.interactWithSink();
      break;
    case "toilet":
      this.interactWithToilet();
      break;
    case "fridge":
      this.interactWithFridge();
      break;
    case "mailbox":
      this.interactWithMailbox();
      break;
    case "bed":
      this.interactWithBed();
      break;
    default:
      type = "Not an object"
      break;
  }

  if (type != "Not an object")
    this.game.input.keyboard.reset(true);

}

Player.prototype.getDir = function () {
  return this.dir;
}

module.exports = Player;
},{}],5:[function(require,module,exports){
'use strict';

var CreationScene = {
    // skins: null,
    // skinIndex: null,
    // params: null,
    // txt: null,
    // submenus: [],
    // menuIndex: 0,

    create: function () {
        this.skins = [];
        this.numSkins = 11;
        this.skinIndex = 1;
        this.params = {};
        this.submenus = ['name', 'skin', 'gender', 'create'];
        this.right = 1;
        this.left = -1;
        this.index = 1;
        this.moveCamera = false;
        this.positionMoved = 0;
        this.name = '';
        this.state = this.submenus[1];

        this.txtApperance = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 200, 'arcadeGreenFont', 'Choose your appearance', 40);
        this.txtApperance.anchor.setTo(0.5, 0.5);
        this.txtApperance.align = "center";

        var graySquare = this.game.add.image(
            0, this.game.world.centerY, 'paredTop');
        graySquare.anchor.setTo(0.5, 0.5);
        graySquare.scale.setTo(70, 5);

        for (var i = 1; i < this.numSkins; i++) {
            this.skins[i] = this.game.add.sprite(
                this.game.world.centerX + (i - 1) * 150, this.game.world.centerY, 'sim' + i);
            this.skins[i].anchor.setTo(0.5, 0.5);
            this.skins[i].scale.setTo(0.5, 0.5);
        }

        var arrow = this.game.add.image(
            this.game.world.centerX, this.game.world.centerY - 125, 'arrow');
        arrow.anchor.setTo(0.5, 0.5);
        arrow.scale.setTo(0.25, 0.25);

        this.game.world.setBounds(0, 0, 2000, 2000);

        var continueTxt = this.game.add.bitmapText(450, 550, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
        continueTxt.fixedToCamera = true;

        this.txtName = this.game.add.bitmapText(400, 800, 'arcadeGreenFont', 'Choose your name', 40);
        this.txtName.anchor.setTo(0.5, 0.5);
        this.txtName.align = "center";

        var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + '<', 40);
        nameTxt.anchor.setTo(0.5, 0.5);
        nameTxt.align = "center";
        return this.skins;
    },

    update: function () {
        this.checkInput(); // this.game, this.skins, this.skinIndex, this.params);
    },


    //Métodos
    moveCamera: function () {

    },

    checkInput: function () { // game, this.skins, this.skinIndex, params) {
        if (this.moveCamera && this.positionMoved < 600) {
            this.game.camera.y += 6;
            this.positionMoved += 6;
           // console.log(this.positionMoved);
            if (this.positionMoved >= 600) {
                this.moveCamera = false;
                this.positionMoved = 0;
            }
        } else {

            if (this.state == this.submenus[1]) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.skinIndex < 10) {
                    this.moveSkins(this.right);
                    this.skinIndex++;
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.skinIndex > 1) {
                    this.moveSkins(this.left);
                    this.skinIndex--;
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    this.moveCamera = true;
                    this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
                    this.state = this.submenus[0];
                }
            } else if(this.state == this.submenus[0]){
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)) {
                    name = name.substring(0, name.length - 1);;
                    //console.log(name);
                    this.game.input.keyboard.reset(true); //resetea el teclado para evitar borrar muchas de golpe
                    this.printText(name);
                } else {
                    this.game.input.keyboard.onPressCallback = function (e) {
                        if (!this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { //para eviar que se pongan espacios
                            name += e;
                            CreationScene.printText(name);
                        }
                    };
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    
                    this.creationCompleted();
                }
            }
        }
        this.game.debug.cameraInfo(this.game.camera, 32, 32); //this.skinSelected();
    },

    printText: function (name) {
        this.game.world.removeAll();
        var continueTxt = this.game.add.bitmapText(450, 1150, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
        this.txtName = this.game.add.bitmapText(400, 800, 'arcadeGreenFont', 'Choose your name', 40);
        this.txtName.anchor.setTo(0.5, 0.5);
        this.txtName.align = "center";
        //console.log(name);
        var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + name + '<', 40);
        nameTxt.anchor.setTo(0.5, 0.5);
        nameTxt.align = "center";
    },

    moveSkins: function (dir) {
        //dir: izq = -1, der = 1
        var scroll = this.game.add.audio('scroll');
        scroll.play();

        for (var i = 1; i < this.numSkins; i++) {
            this.skins[i].x -= 150 * dir;
        }

        this.index = this.index + (1 * dir);
        this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
    },

    skinSelected: function () {
        this.game.select.play();
        this.creationCompleted();
    },

    creationCompleted: function () {
        this.params.simIndex = this.index;
        this.params.name = name;

        var sound = this.game.add.audio('creationCompleted');
        sound.play();

        localStorage.setItem("playerData", JSON.stringify(this.params));

        this.game.state.start('play'); //Empieza playScene
    }

};

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
    this.game.load.audio('mainTheme', 'audio/mainTheme.mp3')
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
                this.game.tap.volume = 0.1;
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
      'jugador', 10, 10, 10);
    this.map.createTopLayers(); //Crea las capas del tilemap que están sobre el jugador
    this.camera.follow(this.player);


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
  }
};
module.exports = PlayScene;
},{"./Map":2,"./Neighbour":3,"./Player":4}]},{},[6]);
