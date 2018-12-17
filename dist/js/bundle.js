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

function Neighbour(game, sprite, x, y, name) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.3, 0.3);


  this.name = name;
  this.friendship = 0;
  this.speed = 5;

  this.game = game;
  this.timer = game.time.create(true);
  this.bubble = null; //burbuja de diálogo
  this.inConversation = false;


  this.states = ['walking', 'idle', 'talking', 'exit', 'dead'];
  this.actualState = 'walking';
  game.add.existing(this); //añadir el sprite al game
}

Neighbour.prototype = Object.create(Phaser.Sprite.prototype);
Neighbour.prototype.constructor = Neighbour;

//Métodos
Neighbour.prototype.update = function () {
  if (this.actualState == 'walking') {
    this.walkTowardsCenter();
  } else if (this.actualState == 'exit') {
    this.walkTowardsExit();
  } else if (this.actualState == 'talking') {
    this.talk();
  }
};

Neighbour.prototype.updateState = function () {
  if (this.bubble != null)
    this.bubble.kill();
  this.actualState = 'exit';
};

Neighbour.prototype.walkTowardsCenter = function () {
  if (this.x < this.game.initialX) {
    this.x += this.speed;
  } else {
    this.actualState = 'idle';
    this.timer.loop(1000, this.updateState, this);
    this.timer.start();

  }
};

Neighbour.prototype.walkTowardsExit = function () {
  this.x += this.speed;
  if (this.x > this.game.world.width && this.alive) {
    console.log('me piro');
    this.kill();
    console.log(this);
    this.actualState = 'dead';
  }
};

Neighbour.prototype.setTalking = function (b) {
  if (b) {
    this.actualState = 'talking';
  } else {
    this.actualState = 'walking';
  }
}

Neighbour.prototype.talk = function () {
  var min = 0;
  var max = 3;
  var rndValue = Math.floor(Math.random() * (max - min)) + min;



  //this.dialogtimer.loop(7000, this.updateState(), this);
  if (!this.inConversation) {
    this.generateDialog();
    this.dialogtimer = this.game.time.create(true);
    this.dialogtimer.start();
    this.inConversation = true;
  }
  if (this.dialogtimer.ms >= 6000) {
    console.log(this.dialogtimer.ms);
    this.dialogtimer.stop();
    this.dialogtimer.start();
    this.inConversation = false;
    this.updateState();
  }
}

Neighbour.prototype.generateDialog = function () {
  var min = 0;
  var max = 3;
  var rndValue = Math.floor(Math.random() * (max - min)) + min;

  switch (rndValue) {
    case 0:
      this.showDialogBubble('dialogHappy');
      this.friendship += 5;
      break;
    case 1:
      this.showDialogBubble('dialogAngry');
      this.friendship -= 5;
      break;
    case 2:
      this.showDialogBubble('dialogLove');
      this.friendship += 20;
      break;
  }

}

Neighbour.prototype.showDialogBubble = function (sprite) {
  if (this.bubble != null)
    this.bubble.revive();
  this.bubble = this.addChild(this.game.make.sprite(200, -280, sprite));
  this.bubble.anchor.setTo(0.5, 0.5);
  this.bubble.scale.setTo(0.5, 0.5);
}
module.exports = Neighbour;
},{"./Entity":1}],4:[function(require,module,exports){
var Neighbour = require('./Neighbour');

function Player(game, map, sprite, x, y, name, intelligence, fitness, charisma, money, job) {
  //Mapa
  this.map = map;

  Phaser.Sprite.call(this, game, x, y, sprite);

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.3, 0.3);

  //Necesidades
  this.maxNeed = 100;
  this.needs = {
    pee: this.maxNeed,
    hunger: this.maxNeed,
    fatigue: this.maxNeed
  };
  //Atributos
  this.maxStat = 10;
  this.stats = {
    intelligence: intelligence,
    fitness: fitness,
    charisma: charisma
  };
  //Lista de amigos
  this.friends = [];
  this.numFriends = 0;
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
    this.needs.fatigue--;
    console.log(this.needs.fatigue);
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.B)) {
    this.needs.fatigue++;
    console.log(this.needs.fatigue);
  }
  if (this.money > 0 && this.game.input.keyboard.isDown(Phaser.Keyboard.M)) {
    this.money-=100;
    
    console.log(this.money);
  }
}

  Player.prototype.move = function () {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (this.controls.up.isDown) { //UP
      //this.animations.play('up');
      this.body.velocity.y -= this.speed;
      this.dir.x = 0;
      this.dir.y = -1;
    }
    if (this.controls.down.isDown) { //DOWN
      //this.animations.play('down');
      this.body.velocity.y += this.speed;
      this.dir.x = 0;
      this.dir.y = 1;
    }
    if (this.controls.left.isDown) { //LEFT
      //this.animations.play('left');
      this.body.velocity.x -= this.speed;
      this.dir.x = -1;
      this.dir.y = 0;
    }
    if (this.controls.right.isDown) { //RIGHT
      //this.animations.play('right');
      this.body.velocity.x += this.speed;
      this.dir.x = 1;
      this.dir.y = 0;
    }

    //console.log(this.dir.x + " " + this.dir.y);
  }

  Player.prototype.interactWithSink = function () {
    console.log("Washing my hands");
  }

  Player.prototype.interactWithToilet = function () {
    console.log("Peeing");
    this.needs.pee = this.maxNeed;
  }

  Player.prototype.interactWithFridge = function () {
    console.log("Getting something to eat");
    this.needs.hunger = this.maxNeed;
  }

  Player.prototype.interactWithMailbox = function () {
    console.log("Checking my mails");
  }

  Player.prototype.interactWithBed = function () {
    this.needs.fatigue = this.maxNeed;
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

  Player.prototype.updateFriendship = function (neighbour) {
    var neighName = neighbour.name;
    var neighFriendship = neighbour.friendship;



    this.friends[this.numFriends] = {
      name: neighName,
      friendship: neighFriendship
    };

    //console.log(this.friends[0]);
  }

  Player.prototype.getFriend = function (index) {

    return this.friends[index];
  }

  Player.prototype.setFriend = function(neighbour, index){
    this.friends[index] = {
      name: neighbour.name,
      friendship: neighbour.friendship
    };
  }


module.exports = Player;
},{"./Neighbour":3}],5:[function(require,module,exports){
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
        this.cameraSpeed = 20;
        this.positionMoved = 0;
        this.name = '';
        this.state = this.submenus[1];
        this.intelligence = 0;
        this.fitness = 0;
        this.charisma = 0;
        this.maxpoints = 5; //puntos a repartir
        this.selectedStat = 'intelligence';
        this.remainingPoints = this.maxpoints; //puntos que quedan por repartir

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
        this.txt;
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
            this.game.camera.y += 20;
            this.positionMoved += 20;
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
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    this.moveCamera = true;
                    this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
                    this.state = this.submenus[0];
                }
            } else if (this.state == this.submenus[0]) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)) {
                    name = name.substring(0, name.length - 1);
                    var sound = this.game.add.audio('keyboardBackspace');
                    sound.volume = 0.2;
                    sound.play();
                    //console.log(name);
                    this.game.input.keyboard.reset(true); //resetea el teclado para evitar borrar muchas de golpe
                    this.printText(name);
                } else {
                    this.input.keyboard.onPressCallback = function (e) {
                        if (!(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) && name.length < 20) { //para eviar que se pongan espacios
                            name += e;
                            if (Math.random() > 0.5)
                                var sound = this.game.add.audio('keyboard1');
                            else
                                var sound = this.game.add.audio('keyboard2');
                            sound.volume = 0.2;
                            sound.play();
                            CreationScene.printText(name);
                        }
                    };
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) { //pasamos al submenú 3
                    this.game.world.removeAll();
                    var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + name + '<', 40);
                    this.centerSprite(nameTxt);
                    this.txt = this.game.add.bitmapText(450, 550, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
                    this.txt.fixedToCamera = true;
                    this.moveCamera = true;
                    this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
                    this.state = this.submenus[2];
                    this.game.input.keyboard.onPressCallback = function () {}; //quita el callback
                }
            } else if (this.state == this.submenus[2]) {
                //subir o bajar entre stats
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.selectedStat != 'intelligence') {
                    if (this.selectedStat == 'fitness') this.selectedStat = 'charisma';
                    else this.selectedStat = 'intelligence';
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.selectedStat != 'fitness') {
                    if (this.selectedStat == 'intelligence') this.selectedStat = 'charisma';
                    else this.selectedStat = 'fitness';
                } else
                    //sumar o restar uno a las stats
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.remainingPoints > 0) {
                        this.add1();
                    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.sub1();
                }

                this.printStats(this.remainingPoints); //pinta en pantalla

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {

                    this.creationCompleted();
                    this.game.input.keyboard.onPressCallback = function () {}; //quita el callback
                }
                this.game.input.keyboard.reset(true); //resetea el teclado
            }
        }
        //this.game.debug.cameraInfo(this.game.camera, 32, 32); //this.skinSelected();
    },

    add1: function () {
        console.log(this.selectedStat);
        if (this.selectedStat == 'fitness')
            this.fitness++;
        else if (this.selectedStat == 'charisma')
            this.charisma++;
        else if (this.selectedStat == 'intelligence')
            this.intelligence++;

        var sound = this.game.add.audio('select');
        sound.volume = 0.2;
        sound.play();
        this.remainingPoints--;

    },

    sub1: function () {
        console.log(this.selectedStat);
        var sound = this.game.add.audio('select');
        sound.volume = 0.2;

        if (this.selectedStat == 'fitness' && this.fitness > 0) {
            this.fitness--;
            this.remainingPoints++;
            sound.play();
        } else if (this.selectedStat == 'charisma' && this.charisma > 0) {
            this.charisma--;
            this.remainingPoints++;
            sound.play();
        } else if (this.selectedStat == 'intelligence' && this.intelligence > 0) {
            this.intelligence--;
            this.remainingPoints++;
            sound.play();
        }
    },
    centerSprite: function (s) {
        s.anchor.setTo(0.5, 0.5);
        s.align = "center";
    },

    printStats: function (remainingPoints) {
        this.game.world.removeAll();

        if (this.selectedStat == 'intelligence') var arrow = 1440;
        else if (this.selectedStat == 'charisma') var arrow = 1540;
        else if (this.selectedStat == 'fitness') var arrow = 1640;
        var selection = this.game.add.bitmapText(500, arrow, 'arcadeWhiteFont', '<', 40);
        selection.anchor.setTo(0, 1);
        this.centerSprite(selection);
        var remainingTxt = this.game.add.bitmapText(400, 1375, 'arcadeWhiteFont', 'Remaining points: ' + remainingPoints, 20);
        this.centerSprite(remainingTxt);
        var statsTxt = this.game.add.bitmapText(400, 1300, 'arcadeGreenFont', 'Choose your initial stats', 40);
        this.centerSprite(statsTxt);
        var intelligenceTxt = this.game.add.bitmapText(400, 1450, 'arcadeGreenFont', 'Intelligence: ', 30);
        intelligenceTxt.anchor.setTo(1, 1);
        var charismaTxt = this.game.add.bitmapText(400, 1550, 'arcadeGreenFont', 'Charisma: ', 30);
        charismaTxt.anchor.setTo(1, 1);
        var fitnessTxt = this.game.add.bitmapText(400, 1650, 'arcadeGreenFont', 'Fitness: ', 30);
        fitnessTxt.anchor.setTo(1, 1);
        var i = this.game.add.bitmapText(400, 1450, 'arcadeWhiteFont', '' + this.intelligence, 30);
        i.anchor.setTo(0, 1);
        var f = this.game.add.bitmapText(400, 1550, 'arcadeWhiteFont', '' + this.charisma, 30);
        f.anchor.setTo(0, 1);
        var c = this.game.add.bitmapText(400, 1650, 'arcadeWhiteFont', '' + this.fitness, 30);
        c.anchor.setTo(0, 1);
        var continueTxt = this.game.add.bitmapText(450, 1750, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
    },

    printText: function (name) {
        this.game.world.removeAll();
        var continueTxt = this.game.add.bitmapText(450, 1150, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
        this.txtName = this.game.add.bitmapText(400, 800, 'arcadeGreenFont', 'Choose your name', 40);
        this.centerSprite(this.txtName);
        //console.log(name);
        var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + name + '<', 40);
        this.centerSprite(nameTxt);

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
        this.params.intelligence = this.intelligence;
        this.params.charisma = this.charisma;
        this.params.fitness = this.fitness;

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
    this.game.load.image('greenBox', 'images/hud/greenBox.png'); //cuadrado verde usado para las barras de necesidad
    this.game.load.image('intelligenceIcon', 'images/hud/intelligenceIcon.png'); 
    this.game.load.image('fitnessIcon', 'images/hud/fitnessIcon.png'); 
    this.game.load.image('charismaIcon', 'images/hud/charismaIcon.png'); 
    this.game.load.image('dialogHappy', 'images/hud/dialogBubbleHappy.png'); 
    this.game.load.image('dialogAngry', 'images/hud/dialogBubbleAngry.png'); 
    this.game.load.image('dialogLove', 'images/hud/dialogBubbleLove.png'); 

    // Tilemaps y tilesets
    this.game.load.tilemap('map', 'images/tiles/tilemaps/tilemap2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tileset', 'images/tiles/tilemaps/tileset64.png');

    //temporal
    this.game.load.image('furni', 'images/tiles/worktop.png'); 

    // Fuentes
    this.game.load.bitmapFont('arcadeWhiteFont', 'fonts/arcadebmfWhite.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeBlackFont', 'fonts/arcadebmfBlack.png', 'fonts/arcadebmf.xml');
    this.game.load.bitmapFont('arcadeGreenFont', 'fonts/arcadebmfGreenSpecial.png', 'fonts/arcadebmf.xml');

    // Audio
    this.game.load.audio('tap', 'audio/tap.wav');
    this.game.load.audio('keyboard1', 'audio/keyboard1.wav');
    this.game.load.audio('keyboard2', 'audio/keyboard2.wav');
    this.game.load.audio('keyboardBackspace', 'audio/keyboardBackspace.wav');
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

  //CREATE
  create: function () {
    /*this.game.input.keyboard.onPressCallback = function (e) {
      if (!this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { //para eviar que se pongan espacios
          console.log('pues si');
      }
    }*/

    //Valores iniciales
    this.game.initialX = this.game.world.centerX + 910, this.game.initialY = 3500;
    //Información que se muestra en el hud:
    // 0: NEEDS
    // 1: YOU
    // 2: FRIENDS
    // Empieza con NEEDS
    this.selectedHUD = 0;

    this.debug = false; //Poner a true para activar los debugs de player y del tilemap
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.editMode = false;
    //Tilemap
    this.map = new Map(this);

    this.map.objectsLayer.debug = this.debug; //debug del tilemap

    //Creación del jugador
    this.player = new Player(
      this.game, this.map, 'sim' + this.playerParams.simIndex,
      this.game.initialX, this.game.initialY,
      this.playerParams.name, this.playerParams.intelligence, this.playerParams.fitness, this.playerParams.charisma);
    this.map.createTopLayers(); //Crea las capas del tilemap que están sobre el jugador
    this.camera.follow(this.player);


    this.neig = new Neighbour(this.game, 'sim5', 0, this.game.initialY, 'Eric Allen');


    this.createHUD();


    this.game.input.mouse.capture = true;
  },

  //UPDATE
  update: function () {
    //Colisiones
    this.game.physics.arcade.collide(this.player, this.map.groundWallLayer);
    this.game.physics.arcade.collide(this.player, this.map.objectsLayer);
    //Desactiva las paredes si el jugador está en la casa
    if (this.map.isInside(this.player.x, this.player.y)) {
      this.map.setWalls(false);
    } else
      this.map.setWalls(true);

    this.hungerBar.width = this.player.needs.hunger / this.player.maxNeed * this.barWidth;
    this.sleepBar.width = this.player.needs.fatigue / this.player.maxNeed * this.barWidth;
    this.toiletBar.width = this.player.needs.pee / this.player.maxNeed * this.barWidth;

    if (this.checkPlayerOverlap(this.player, this.neig)) {
      this.neig.setTalking(true);
      if (this.selectedHUD == 2)
        this.updateFriendsHUD();
    }
    if (this.neig2 != undefined && this.checkPlayerOverlap(this.player, this.neig2)) {
      this.neig2.setTalking(true);
      if (this.selectedHUD == 2)
        this.updateFriendsHUD();
    }

    this.player.updateFriendship(this.neig);
    if (this.neig2 != undefined)
      this.player.updateFriendship(this.neig2);

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      this.spawnSim(4);
      this.game.input.keyboard.reset(true);
      this.player.numFriends++;

    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
      this.editMode = true;

    }

    if (this.editMode && this.game.input.activePointer.leftButton.isDown) {
      this.furni = this.game.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, 'furni');
      console.log(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
      this.furni.fixedToCamera = true;
      this.furni.scale.setTo(0.25, 0.25);
      this.furni.anchor.setTo(0.5, 0.5);
      this.player.money -= 75;
    }



    this.hud_playerMoney.setText(this.player.money + " €");

  },

  spawnSim: function (index) {
    this.neig2 = new Neighbour(this.game, 'sim' + index, 0, this.game.initialY + 60, 'Clara Lawson');
    this.player.setFriend(this.neig2, 1);
  },

  //RENDER
  render: function () {
    //Debugs
    if (this.debug) {
      this.game.debug.spriteInfo(this.neig, 32, 32);
      this.game.debug.body(this.player);
    }
    //this.game.debug.spriteInfo(this.hud_mainBox, 32, 80);
    //this.game.debug.text("x: "+ this.intelligenceText /*+ "   \ny: " + this.intelligenceText.y*/, 32, 32);
  },

  checkPlayerOverlap: function (player, sim) {
    var playerBounds = player.getBounds();
    var simBounds = sim.getBounds();

    return Phaser.Rectangle.intersects(playerBounds, simBounds);
  },



  //Crea la interfaz del
  createHUD: function () {
    //main hud box
    this.hud_mainBox = this.game.add.sprite(window.innerWidth - 400, window.innerHeight + 120, 'hudBox');
    this.hud_mainBox.anchor.set(0.5, 0.5);
    this.hud_mainBox.scale.set(1, 0.5);
    this.hud_mainBox.fixedToCamera = true;

    //dimensiones y posiciones del HUD 
    this.hud_x = 150;
    this.hud_y = 485;
    this.hud_limitX = 600;
    this.hud_limitY = 550;
    this.hud_buttonW = 64;
    this.hud_buttonsX = this.hud_x * 4; // + this.hud_x/2;
    this.hud_buttonsY = this.hud_y + 80;
    this.hud_icons_x = this.hud_x - 40;
    this.hud_icons_offset = 50;
    this.barWidth = 85;
    //this.hud_barOffset = 

    //player's name
    this.hud_playerName = this.game.add.bitmapText(this.hud_x, this.hud_y, 'arcadeBlackFont', this.player.name, 20); //(this.hud_mainBox.x, this.hud_mainBox.y, 'arcadeBlackFont', this.player.name, 20);
    this.hud_playerName.align = "left";
    this.hud_playerName.fixedToCamera = true;

    //player's money
    this.hud_playerMoney = this.game.add.bitmapText(32, 32, 'arcadeBlackFont', this.player.money, 20); //(this.hud_mainBox.x, this.hud_mainBox.y, 'arcadeBlackFont', this.player.name, 20);
    this.hud_playerMoney.align = "left";
    this.hud_playerMoney.fixedToCamera = true;


    //SUBMENÚS:  NEEDS, YOU, FRIENDS
    //  NEEDS
    //group
    this.needsGroup = this.game.add.group();

    //iconos
    this.needsGroup.create(this.hud_icons_x, this.hud_buttonsY, 'hungerIcon');
    this.needsGroup.create(this.hud_icons_x * 2 + this.hud_icons_offset + 10, this.hud_buttonsY, 'sleepIcon');
    this.needsGroup.create(this.hud_icons_x * 3 + this.hud_icons_offset * 2, this.hud_buttonsY, 'toiletIcon');

    //barras de necesidad
    this.hungerBar = this.game.add.sprite(this.hud_icons_x + this.hud_icons_offset, this.hud_buttonsY, 'greenBox');
    this.sleepBar = this.game.add.sprite((this.hud_icons_x + this.hud_icons_offset) * 2 - 5, this.hud_buttonsY, 'greenBox');
    this.toiletBar = this.game.add.sprite((this.hud_icons_x + this.hud_icons_offset) * 3 - 15, this.hud_buttonsY, 'greenBox');

    //console.log('hunger: '+ this.player.needs.hunger + " :: " + this.hungerBar.width);

    this.needsGroup.add(this.hungerBar);
    this.needsGroup.add(this.sleepBar);
    this.needsGroup.add(this.toiletBar);

    this.needsGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      elem.scale.setTo(0.075, 0.075);
      elem.anchor.setTo(0.5, 0.5);
    });

    this.hungerBar.anchor.setTo(0, 0);
    this.sleepBar.anchor.setTo(0, 0);
    this.toiletBar.anchor.setTo(0, 0);

    //button
    this.needsButton = this.addButton('needsIconSelected', '', this.hud_buttonsX, this.hud_buttonsY, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 0) {
        this.changeMenu(this.needsGroup);
        this.resetHUD();
        this.needsButton.loadTexture('needsIconSelected');
        this.selectedHUD = 0;
      }
    });
    this.needsButton.fixedToCamera = true;


    //  YOU (ATRIBUTOS DEL JUGADOR)
    //group
    this.youGroup = this.game.add.group();
    //iconos
    this.youIconX = this.hud_x / 2;
    var youIconSeparation = 180;
    this.youTextOffset = 25;

    this.youGroup.create(this.youIconX, this.hud_buttonsY, 'intelligenceIcon');
    this.youGroup.create(this.youIconX + youIconSeparation, this.hud_buttonsY, 'fitnessIcon');
    this.youGroup.create(this.youIconX + 2 * youIconSeparation, this.hud_buttonsY, 'charismaIcon');

    //player's stats (texts)
    this.intelligenceText = this.game.add.bitmapText(this.youIconX + this.youTextOffset, this.hud_buttonsY, 'arcadeBlackFont', this.player.stats.intelligence + "/" + this.player.maxStat, 20);
    this.fitnessText = this.game.add.bitmapText(this.youIconX + youIconSeparation + this.youTextOffset + 10, this.hud_buttonsY, 'arcadeBlackFont', this.player.stats.fitness + "/" + this.player.maxStat, 20);
    this.charismaText = this.game.add.bitmapText(this.youIconX + 2 * youIconSeparation + this.youTextOffset, this.hud_buttonsY, 'arcadeBlackFont', this.player.stats.charisma + "/" + this.player.maxStat, 20);

    this.youGroup.add(this.intelligenceText);
    this.youGroup.add(this.fitnessText);
    this.youGroup.add(this.charismaText);
    this.youGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      if (elem.text == undefined) //si no es un texto, cambia la escala
        elem.scale.setTo(0.075, 0.075);
      elem.anchor.setTo(0.5, 0.5);
    });

    this.intelligenceText.align = "left";
    this.fitnessText.align = "left";
    this.charismaText.align = "left";


    this.intelligenceText.anchor.setTo(0, 0.5);
    this.fitnessText.anchor.setTo(0, 0.5);
    this.charismaText.anchor.setTo(0, 0.5);

    //button
    this.youButton = this.addButton('youIcon', '', this.hud_buttonsX + this.hud_buttonW, this.hud_buttonsY, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 1) {
        this.changeMenu(this.youGroup);
        this.resetHUD();
        this.youButton.loadTexture('youIconSelected');
        this.selectedHUD = 1;
      }
    });
    this.youButton.fixedToCamera = true;

    //  FRIENDS
    //group
    this.friendsGroup = this.game.add.group();


    //var friend = this.player.getFriend(0);
    /*this.friendText1 = this.game.add.bitmapText(this.youIconX + this.youTextOffset,
      this.hud_buttonsY, 'arcadeBlackFont',
      "AAAA", 20);*/

    this.friendsGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      elem.scale.setTo(0.075, 0.075);
      elem.anchor.setTo(0.5, 0.5);
    });




    //button
    this.friendsButton = this.addButton('friendsIcon', '', this.hud_buttonsX + 2 * this.hud_buttonW, this.hud_buttonsY, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 2) {
        this.changeMenu(this.friendsGroup);
        this.resetHUD();
        this.friendsButton.loadTexture('friendsIconSelected');
        this.selectedHUD = 2;


        //show friends
        this.updateFriendsHUD();
      }
    });
    this.friendsButton.fixedToCamera = true;

    this.hideGroup(this.needsGroup);
    this.hideGroup(this.youGroup);
    this.hideGroup(this.friendsGroup);
    this.showActualMenu();
  },

  //deselecciona el submenú actual del hud
  resetHUD: function () {
    switch (this.selectedHUD) {
      case 0:
        this.needsButton.loadTexture('needsIcon');
        break;
      case 1:
        this.youButton.loadTexture('youIcon');
        break;
      case 2:
        this.friendsButton.loadTexture('friendsIcon');
        break;
    }

  },

  updateFriendsHUD: function () {

    for (var i = 0; i < this.player.numFriends + 1; i++) {

      var friend = this.player.getFriend(i);

      this.friendsGroup.remove(this.friendText);

      this.friendText = this.game.add.bitmapText(this.youIconX + this.youTextOffset,
        this.hud_buttonsY, 'arcadeBlackFont', friend.name + "\n" + friend.friendship, 20);

      this.friendsGroup.add(this.friendText);
      //console.log(this.friendText._text);
      this.friendText.fixedToCamera = true;
      this.friendText.align = "left";

      this.friendText.anchor.setTo(0, 0.5);
    }
  },

  //TEMPORAL///////////////////////////
  updateFriendsHUD2: function () {



    var friend = this.player.getFriend(1);

    //this.friendsGroup.remove(this.friendText);

    this.friendText2 = this.game.add.bitmapText((this.youIconX + this.youTextOffset) * 2,
      this.hud_buttonsY, 'arcadeBlackFont', friend.name + "\n" + friend.friendship, 20);

    this.friendsGroup.add(this.friendText2);
    //console.log(this.friendText._text);
    this.friendText2.fixedToCamera = true;
    this.friendText2.align = "left";

    this.friendText2.anchor.setTo(0, 0.5);
  },

  //Muestra el submenú de NEEDS/YOU/FRIENDS
  showActualMenu: function () {
    var menu = this.getActualMenu();

    this.showGroup(menu);
  },

  //Hides actual menu and shows the new one
  changeMenu: function (newGroup) {
    var oldGroup;

    //encuentra el menú actual
    oldGroup = this.getActualMenu();

    this.hideGroup(oldGroup);
    this.showGroup(newGroup);
  },

  getActualMenu: function () {
    var menu = null;

    switch (this.selectedHUD) {
      case 0:
        menu = this.needsGroup;
        break;
      case 1:
        menu = this.youGroup;
        break;
      case 2:
        menu = this.friendsGroup;
        break;
    }

    return menu;
  },

  hideGroup: function (group) {
    group.forEach(function (elem) {
      elem.kill();
    });
  },

  showGroup: function (group) {
    group.forEach(function (elem) {
      elem.revive();
    });
  },

  //Crea un botón
  addButton: function (sprite, string, x, y, w, h, callback) {
    var button = this.game.add.button(x, y, sprite, callback, this, 2, 1, 0);

    button.anchor.setTo(0.5, 0.5);
    button.width = w;
    button.height = h;

    var txt = this.game.add.bitmapText(button.x, button.y, 'arcadeBlackFont', string, 20);
    txt.anchor.setTo(0.5, 0.5);
    txt.align = "center";
    txt.fixedToCamera = true;

    return button;
  }
};

module.exports = PlayScene;
},{"./Map":2,"./Neighbour":3,"./Player":4}]},{},[6]);
