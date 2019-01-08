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
function Map(game, player) {
    this.game = game;
    this.player = null;

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
    this.sinkTop = 27;
    this.toilet = 52; //RETRETE
    this.toiletTop = 28;
    this.fridge = 73; //FRIGORÍFICO
    this.fridgeTop = 49;
    this.fridgeSide = 74; //FRIGORÍFICO DE LADO 
    this.fridgeSideTop = 50;
    this.mailbox = 53; //BUZÓN
    this.bed = 26; //CAMA
    this.bedFront = 25;
    this.worktop = 5; //ENCIMERA

    this.selectedTileIndex = -1;

    this.wallsAreActive = true; //true si las paredes del mapa están visibles
    //Límites de la casa
    this.house_x = 540;
    this.house_y = 2202;
    this.house_w = 2010;
    this.house_h = 3210;
    //game.physics.enable(this.doorTrigger, Phaser.Physics.ARCADE);


    this.createMarker();

    this.buildSound = this.game.add.audio('build');
    this.errorSound = this.game.add.audio('error');
}

//MÉTODOS
Map.prototype.update = function () {
    var currentTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
        this.objectsLayer.getTileY(this.game.input.activePointer.worldY),
        this.objectsLayer, true);
    var currentWallTile = this.map.getTile(this.groundWallLayer.getTileX(this.game.input.activePointer.worldX),
        this.groundWallLayer.getTileY(this.game.input.activePointer.worldY),
        this.groundWallLayer, true);


    this.marker.x = roundFloorToInt(this.game.input.activePointer.worldX, 64);
    this.marker.y = roundFloorToInt(this.game.input.activePointer.worldY, 64);

    if (currentWallTile.index == -1 &&
         this.isInside(this.marker.x, this.marker.y) &&
     this.game.input.mousePointer.isDown &&
      this.selectedTileIndex != -1) {
        this.placeTile(currentTile);
    }
}

Map.prototype.placeTile = function (tile) {
    var canBePlaced = tile.index == -1;

    if (canBePlaced) {
        var cost = 0;
        switch (this.selectedTileIndex) {
            case this.bed:
                var leftTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX - 64),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY),
                    this.objectsLayer, true);
                var canBePlaced = leftTile.index == -1;

                if (canBePlaced) {
                    leftTile.index = this.bedFront;
                    leftTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.bed;
                }
                break;

            case this.toilet:
                var upTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY - 64),
                    this.objectsLayer, true);
                var canBePlaced = upTile.index == -1;

                if (canBePlaced) {
                    upTile.index = this.toiletTop;
                    upTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.toilet;
                }
                break;

            case this.sink:
                var upTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY - 64),
                    this.objectsLayer, true);
                var canBePlaced = upTile.index == -1;

                if (canBePlaced) {
                    upTile.index = this.sinkTop;
                    upTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.sink;
                }
                break;

            case this.fridge:
                var upTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY - 64),
                    this.objectsLayer, true);
                var canBePlaced = upTile.index == -1;

                if (canBePlaced) {
                    upTile.index = this.fridgeTop;
                    upTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.fridge;
                }
                break;

            case this.fridgeSide:
                var upTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY - 64),
                    this.objectsLayer, true);
                var canBePlaced = upTile.index == -1;

                if (canBePlaced) {
                    upTile.index = this.fridgeSideTop;
                    upTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.fridge;
                }
                break;

            case this.worktop:
                cost = this.game.buildCost.worktop;
                break;
        }

        if (canBePlaced) {
            this.buildSound.play();
            tile.index = this.selectedTileIndex;
            tile.setCollision(true, true, true, true);
            this.player.money -= cost;
            this.player.showExchange(-cost);

            this.selectedTileIndex = -1;
            this.quitBuilding();
            this.createMarker();
        }
    }
}

//Comprueba si las coordenadas recibidas están dentro de los límites del mapa
Map.prototype.isInside = function (_x, _y) {
    return (_x >= this.house_x && _x <= this.house_w &&
        _y >= this.house_y && _y <= this.house_h);
}


//Crea las capas del tilemap que se ven por encima del jugador
Map.prototype.createTopLayers = function () {
    this.overPlayerObjects = this.map.createLayer('overPlayerObjects'); //Objetos sobre el jugador
    this.overPlayerWalls = this.map.createLayer('overPlayerWalls'); //Paredes sobre el jugador
}


//Devuelve el tipo de mueble que se encuentra en la posición (X, Y)
Map.prototype.getTileType = function (player) {
    var interactOffsetX = 32;
    var interactOffsetY = interactOffsetX;

    if (player.getDir().y > 0)
        interactOffsetY = interactOffsetY * 2; //Para las interacciones con tiles debajo del jugador es necesario aumentar el offset en la Y

    this.tile = this.map.getTile(this.objectsLayer.getTileX(player.x + (interactOffsetX * player.getDir().x)),
        this.objectsLayer.getTileY(player.y + (interactOffsetY * player.getDir().y)),
        this.objectsLayer);

    if (this.tile != null) {

        var type = "";

        switch (this.tile.index) {
            case this.sink:
                if (player.getDir().y < 0)
                    type = "sink";
                break;
            case this.toilet:
                if (player.getDir().y < 0)
                    type = "toilet";
                break;
            case this.fridge:
                if (player.getDir().y < 0)
                    type = "fridge";
                break;
            case this.fridgeSide:
            case this.fridgeSideTop:
                if (player.getDir().x < 0)
                    type = "fridge";
                break;
            case this.mailbox:
                if (player.getDir().y <= 0)
                    type = "mailbox";
                break;
            case this.bed:
            case this.bedFront:
                type = "bed";
                break;
            default:
                type = "";
                break;
        }

        return type;
    }
};


Map.prototype.quitBuilding = function () {
    this.marker.kill();
    this.selectedTileIndex = -1;
}


Map.prototype.createMarker = function () {
    this.marker = this.game.add.image(

        0, 0, 'hudBox'
    );
    this.marker.width = 64;
    this.marker.height = 64;
}


Map.prototype.tileSelected = function (tileName) {

    switch (tileName) {
        case 'bed':
            this.selectedTileIndex = this.bed;

            break;
        case 'fridgeFront':
            this.selectedTileIndex = this.fridge;

            break;
        case 'fridgeSide':
            this.selectedTileIndex = this.fridgeSide;

            break;
        case 'sink':
            this.selectedTileIndex = this.sink;

            break;
        case 'toilet':
            this.selectedTileIndex = this.toilet;

            break;
        case 'worktop':
            this.selectedTileIndex = this.worktop;

            break;

    }

    this.marker.loadTexture(tileName);
    this.marker.width = 64;
    this.marker.height = 64;

}


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

Map.prototype.editMode = function () {
    this.marker.revive();
};

//FUNCIONES
function roundFloorToInt(n, multiple) {
    if (multiple == 0)
        return n;

    return Math.floor(n / multiple) * multiple;
}

module.exports = Map;
},{}],3:[function(require,module,exports){
var Entity = require('./Entity');

function Neighbour(game, player, sprite, x, y, name) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.3, 0.3);


  this.name = name;
  this.friendship = 0;
  this.speed = 2;

  this.game = game;
  this.player = player; //referencia a player para comprobar overlaps
  this.changeDirTimer = game.time.create(true); //Timer de cambio de dirección
  this.bubble = this.game.add.sprite(200, -280, sprite); //burbuja de diálogo
  this.bubble.kill();
  this.inConversation = false;
  this.wanderingTime = 5000;
  this.movingDirection = [1, 0];

  //Sonido de voz del sim (aleatorio entre dos opciones, una más grave y otra más aguda)
  if (Math.random() > 0.5)
    this.chatSound = this.game.add.audio('chat1');
  else
    this.chatSound = this.game.add.audio('chat2');

  this.chatSound.volume = 0.45;

  //this.states = ['walkingToCenter', 'talking', 'wandering'];
  this.actualState = 'walkingToCenter';
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.setSize(160, 144, 32, 112); //Establece el tamaño y la posición del collider (w,h,x,y)

  this.body.collideWorldBounds = true; //Establece la colisión con los límites del juego

  //Animaciones
  this.animations.add('down', [0, 1, 2, 3], 6, true);
  this.animations.add('up', [4, 5, 6, 7], 6, true);
  this.animations.add('idle', [0], 6, false);

  this.animations.play('down');

  game.add.existing(this); //añadir el sprite al game
}

Neighbour.prototype = Object.create(Phaser.Sprite.prototype);
Neighbour.prototype.constructor = Neighbour;

//Métodos
//UPDATE
Neighbour.prototype.update = function () {
  if (this.alive) {
    this.handleState(); //Comprueba el state del vecino y actúa en consecuencia

    if (this.y <= this.game.initialY) //Los vecinos no pueden pisar mi césped!
    {
      this.movingDirection[1] = 1;
      this.animations.play('down');
    }
    if (this.x > this.game.world.width - 100) { //Sale del juego
      console.log(this.name + ': BYE');
      this.kill();
    }

    if (this.actualState != 'talking') {
      if (this.movingDirection[1] > -1 && this.animations.currentAnim.name != 'down')
        this.animations.play('down');
      else if (this.movingDirection[1] < 0 && this.animations.currentAnim.name != 'up')
        this.animations.play('up');
    } else
      this.animations.play('idle');
  }
};


Neighbour.prototype.handleState = function () {
  if (this.actualState == 'walkingToCenter' && this.x >= this.game.initialX) {
    this.actualState = 'stopped';
    this.startWandering();
  }

  if (!this.bubble.alive) { //Si no está hablando
    if (this.checkPlayerOverlap()) { //Si le habla el jugador
      //console.log(neig.name + ': OUCH');

      if (this.actualState == 'walkingToCenter' || this.actualState == 'wandering') {
        this.talk();
      }
    } else if (this.actualState != 'wandering' && this.actualState != 'walkingToCenter') {
      this.startWandering();
    }
  }

  //si no está parado, se desplaza
  if (this.actualState != 'stopped' && this.actualState != 'talking')
    this.move();
};



Neighbour.prototype.checkPlayerOverlap = function () {
  var playerBounds = this.player.getBounds();
  var simBounds = this.getBounds();

  return Phaser.Rectangle.intersects(playerBounds, simBounds);
}


//Hace que el vecino 'deambule' unos segundos
Neighbour.prototype.startWandering = function () {
  this.actualState = 'wandering';

  this.changeDirTimer.loop(1000, function () {
    this.movingDirection = randomDir();

    var auxTimer = this.game.time.create(true);
    auxTimer.loop(this.wanderingTime, function () {
      //Después de unos segundos, deja de andar y se va (si no está hablando)
      this.changeDirTimer.stop();

      if (this.actualState != 'talking') {
        this.movingDirection = [1, 0];
      }
      //this.actualState = 'exiting';

      //this.actualState = 'walking';
      auxTimer.stop();
    }, this);
    auxTimer.start();
  }, this);
  this.changeDirTimer.start();
}


Neighbour.prototype.move = function () {
  this.x += this.movingDirection[0] * this.speed;
  this.y += this.movingDirection[1] * this.speed;
};


Neighbour.prototype.setTalking = function (b) {
  if (b) {
    this.actualState = 'startTalking';
  } else {
    this.actualState = 'walking';
  }
}


Neighbour.prototype.talk = function () {
  this.actualState = 'talking';

  //Habla (muestra un bocadillo de diálogo)
  this.generateDialogBubble();

  //Después de unos segundos, el bocadillo desaparece
  var auxTimer = this.game.time.create(true);
  auxTimer.loop(3000, function () {
    this.bubble.kill();
    //this.actualState = 'not talking';
    // console.log(this.actualState);

    if (!this.checkPlayerOverlap()) {
      //Si no está en contacto con player, deja de hablar
      auxTimer.stop();
      if (this.x <= this.game.initialX)
        this.actualState = 'walkingToCenter';
      else
        this.actualState = 'wandering';
    } else {
      this.generateDialogBubble();
    }
  }, this);
  auxTimer.start();


}


//Muestra una burbuja de diálogo aleatoria y actualiza la amistad dependiendo de la burbuja generada
// y reproduce el sonido de hablar
Neighbour.prototype.generateDialogBubble = function () {
  this.chatSound.play();

  var min = 0;
  var max = 3;
  var rndValue = Math.floor(Math.random() * (max - min)) + min;

  switch (rndValue) {
    case 0:
      this.showDialogBubble('dialogHappy');
      this.friendship += 1;
      break;
    case 1:
      this.showDialogBubble('dialogAngry');
      this.friendship -= 1;
      break;
    case 2:
      this.showDialogBubble('dialogLove');
      this.friendship += 5;
      break;
  }

  //Actualiza la amistad en la lista del jugador
  this.player.updateFriendship(this.name, this.friendship);

}


Neighbour.prototype.showDialogBubble = function (sprite) {
  this.bubble = this.addChild(this.game.make.sprite(200, -280, sprite));
  this.bubble.anchor.setTo(0.5, 0.5);
  this.bubble.scale.setTo(0.5, 0.5);


}


Neighbour.prototype.setPosition = function (x, y) {
  this.x = x;
  this.y = y;
}


Neighbour.prototype.setState = function (state) {
  this.actualState = state;
}


Neighbour.prototype.getState = function () {
  return this.actualState;
}


//devuelve un array [X,Y] con una dirección aleatoria
function randomDir() {
  //Dirección aleatoria
  //   1
  // 4   2
  //   3
  var rnd = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
  var direction = [0, 0]
  switch (rnd) {
    case 1: //UP
      direction[1] = -1;
      //this.animations.play('up');
      break;
    case 2: //RIGHT
      direction[0] = 1;
      break;
    case 3: //DOWN
      direction[1] = 1;
      //this.animations.play('down');
      break;
    case 4: //LEFT
      direction[0] = -1;
      break;

  }

  return direction;
};



module.exports = Neighbour;
},{"./Entity":1}],4:[function(require,module,exports){
var Neighbour = require('./Neighbour');

function Player(game, map, sprite, x, y, name, intelligence, fitness, charisma) {
  this.currentState = 'active'; //estado actual del jugador
  this.stateMachine = [this.currentState]; //máquina de estados
  //ESTADOS POSIBLES:
  /*
    peeing
    sleeping
    eating
  */

  //Mapa
  this.map = map;

  Phaser.Sprite.call(this, game, x, y, sprite);

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.3, 0.3);

  //Necesidades
  this.maxNeed = 10000;
  //cantidad que se reduce a las barras de necesidad
  this.fatigueReductionAmount = 10;
  this.hungerReductionAmount = 25;
  this.peeReductionAmount = 35;
  //Velocidad a la que se regeneran las necesidades
  this.needIncreaseAmount = 100;
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
  this.money = 5000;
  this.exchangeTimer = this.game.time.create(true); //Timer para hacer que desaparezca el texto informativo de los ingresos/gastos
  this.foodPrice = 10;
  //Trabajo
  this.job = {
    name: 'Unemployed',
    wage: 0
  };
  //Nombre
  this.name = name;
  //Activo
  //this.active = true; //indica si el player se puede mover (no está en modo edición/conversación...)
  //Vel. de movimiento
  this.speed = 300; //velocidad de movimiento
  //Dirección de movimiento
  this.dir = new Phaser.Point(0, 1)
  //Animaciones
  this.animations.add('down', [0, 1, 2, 3], 6, true);
  this.animations.add('up', [4, 5, 6, 7], 6, true);
  this.animations.add('idleDown', [0], 6, false);
  this.animations.add('idleUp', [4], 6, false);

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
  //Píxeles de censura(inicialmente invisibles)
  this.censor = this.addChild(this.game.make.sprite(0, 0, 'censor'));
  this.censor.anchor.setTo(0.5, 0.5);
  this.censor.scale.setTo(2, 2);
  this.censor.visible = false;



  //Sonidos
  this.peeSound = this.game.add.audio('pee'); //EN EL RETRETE
  this.peeSound.volume = 0.5;

  this.flushSound = this.game.add.audio('flush'); //TIRAR DE LA CADENA
  //this.flushSound.volume = 0.5;

  this.eatingSound = this.game.add.audio('eating'); //COMER
  this.eatingSound.volume = 0.5;

  this.sinkSound = this.game.add.audio('sink'); //LAVABO
  //this.sinkSound.volume = 0.5;

  this.paySound = this.game.add.audio('pay'); //PAGAR
  this.paySound.volume = 0.5;
  this.paySound.onStop.add(function () {
    this.eatingSound.play();
  }, this);

  this.sleepingSound = this.game.add.audio('sleeping'); //DORMIR
  this.sleepingSound.onStop.add(function () { //Cuando termina la canción 
    this.needs.fatigue = this.maxNeed;
    this.currentState = 'active';
    this.stateMachine.pop();
    this.game.camera.resetFX();
  }, this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


//Métodos
Player.prototype.update = function () {
  //Comprueba en qué state está el jugador
  switch (this.currentState) {
    case 'active': //ESTADO NORMAL
      this.move();

      if (this.controls.space.isDown) {
        this.interact(this.map);
      }
      break;

    case 'peeing': //PEEING
      this.peeingState();
      break;

    case 'eating': //EATING
      this.eatingState();
      break;
  }

  if (this.exchangeTimer.ms >= 750) {
    this.exchangeTimer.stop();
    //this.exchangeTimer.start();
    this.exchangeText.visible = false;
  }

  
  //console.log(this.body.velocity.x + ' ' + this.body.velocity.y +'\n'+this.dir.x +' '+this.dir.y);


  /*if (this.body.velocity.x == 0 && this.body.velocity.y == 0 && this.dir.y < 0){
    this.animations.play('idleUp');
  }
  else if (this.body.velocity.x == 0 && this.body.velocity.y == 0 && this.dir.y >= 0)
    this.animations.play('idleDown');*/

  /*if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) { //SOLO PARA DEBUG
     this.needs.fatigue=0;
  }*/
}

Player.prototype.peeingState = function () {
  //aumenta la necesidad pee hasta el máximo
  if (this.needs.pee < this.maxNeed) {
    if (this.needs.pee + this.needIncreaseAmount <= this.maxNeed)
      this.needs.pee += this.needIncreaseAmount;
    else
      this.needs.pee = this.maxNeed;

  } else {
    this.censor.visible = false;
    this.peeSound.stop();
    this.flushSound.play();
    this.currentState = 'active';
    this.stateMachine.pop();
  }
}

Player.prototype.eatingState = function () {
  //aumenta la necesidad hunger hasta el máximo
  if (this.needs.hunger < this.maxNeed) {
    if (this.needs.hunger + this.needIncreaseAmount <= this.maxNeed)
      this.needs.hunger += this.needIncreaseAmount;
    else
      this.needs.hunger = this.maxNeed;

  } else {
    this.eatingSound.loop = false;
    this.eatingSound.stop();
    this.currentState = 'active';
    this.stateMachine.pop();
  }
}

Player.prototype.resetPosition = function () {
  this.x = this.game.initialX;
  this.y = this.game.initialY;
}

Player.prototype.resetState = function () {
  this.currentState = 'active';
}

Player.prototype.resetState = function () {
  this.currentState = 'active';
}

Player.prototype.move = function () {
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;


  if (this.controls.up.isDown) { //UP
    this.animations.play('up');
    this.body.velocity.y -= this.speed;
    this.dir.x = 0;
    this.dir.y = -1;
  }
  if (this.controls.down.isDown) { //DOWN
    this.animations.play('down');
    this.body.velocity.y += this.speed;
    this.dir.x = 0;
    this.dir.y = 1;
  }
  if (this.controls.left.isDown) { //LEFT
    if (this.dir.y >= 0)
      this.animations.play('down');
    else
      this.animations.play('up');

    this.body.velocity.x -= this.speed;
    this.dir.x = -1;
    this.dir.y = 0;
  }
  if (this.controls.right.isDown) { //RIGHT
    if (this.dir.y >= 0)
      this.animations.play('down');
    else
      this.animations.play('up');

    this.body.velocity.x += this.speed;
    this.dir.x = 1;
    this.dir.y = 0;
  }
  
  if(this.body.velocity.x == 0 && this.body.velocity.y == 0){
    if (this.dir.y >= 0)
      this.animations.play('idleDown');
    else
      this.animations.play('idleUp');
  }

  //console.log(this.dir.x + " " + this.dir.y);
}

Player.prototype.interactWithSink = function () {
  this.sinkSound.play();
}

Player.prototype.interactWithToilet = function () {
  console.log("Peeing");

  this.censor.visible = true;
  this.peeSound.play();
  this.currentState = 'peeing';
  this.stateMachine.push(this.currentState);
  //this.needs.pee = this.maxNeed;
}

Player.prototype.interactWithFridge = function () {
  console.log("Getting something to eat");

  this.eatingSound.loop = true;

  this.showExchange(-this.foodPrice);
  this.money -= this.foodPrice;
  this.paySound.play();
  this.currentState = 'eating';
  this.stateMachine.push(this.currentState);
  //this.needs.hunger = this.maxNeed;
}

Player.prototype.interactWithMailbox = function () {
  this.currentState = "checkingMails";
}

Player.prototype.interactWithBed = function () {

  this.sleepingSound.play();
  this.game.camera.fade(0x000000, 5000);
  this.currentState = 'sleeping';

  //timer para poner spawningNeighbour a false y que se puedan spawnear más vecinos
  /*var timer = this.game.time.create(true);
  timer.loop(11000, function () {
    
    
    timer.stop();
  }, this);
  timer.start();*/

  console.log("Going to sleep, good night");
}

Player.prototype.interact = function (map) {
  var type = map.getTileType(this);

  switch (type) {
    case "sink":
      this.interactWithSink();
      break;
    case "toilet":
    if(this.needs.pee < this.maxNeed - this.peeReductionAmount * 10) //Para no realizar la interacción si la necesidad está casi al máximo 
      this.interactWithToilet();
      break;
    case "fridge":
    if(this.needs.hunger < this.maxNeed - this.hungerReductionAmount * 10) //Para no realizar la interacción si la necesidad está casi al máximo 
      this.interactWithFridge();
      break;
    case "mailbox":
      this.interactWithMailbox();
      break;
    case "bed":
    if(this.needs.fatigue < this.maxNeed - this.fatigueReductionAmount * 50) //Para no realizar la interacción si la necesidad está casi al máximo 
      this.interactWithBed();
      break;
    default:
      type = "Not an object"
      break;
  }

  if (type != "Not an object")
    this.game.input.keyboard.reset(true);

}



//Muestra por pantalla el ingreso/pérdida de dinero y actualiza hud_playerMoney
//Esta función solo actualiza la representación del dinero
Player.prototype.showExchange = function (value) {
  //Actualiza la posición del icono del dinero (por si cambia el número de dígitos)

  var x = 100 + 16 * this.money.toString().length;
  var y = 32;
  var exchangeText;

  if (value > 0) { //INGRESO
    exchangeText = this.game.add.bitmapText(x, y, 'arcadeGreenFont', '+ ' + value, 20);
  } else { //GASTO
    exchangeText = this.game.add.bitmapText(x, y, 'arcadeRedFont', '- ' + Math.abs(value), 20);
  }
  exchangeText.align = "left";
  exchangeText.fixedToCamera = true;


  var timer = this.game.time.create(false);
  timer.loop(2000, function () {
    exchangeText.visible = false;
    
    timer.stop();
  }, this);
  timer.start();


}

Player.prototype.getDir = function () {
  return this.dir;
}

Player.prototype.getNumFriends = function () {
  return this.numFriends;
}

//Busca al vecino en la lista de amigos y, si existe actualiza su amistad
//Si no estaba en la lista, lo añade
Player.prototype.updateFriendship = function (_name, _points) {
  var found = false;
  var i = 0;

  while (i < this.numFriends && !found) {
    if (this.friends[i].name == _name)
      found = true;
    else
      i++;
  }

  if (found) {
    this.friends[i].points = _points;
  } else {
    this.friends.push({
      name: _name,
      points: _points
    });
    this.numFriends++;
  }

}

//Devuelve true si existe un friend para el índice index
Player.prototype.searchFriendByIndex = function (index) {

  return this.friends[index] != undefined;
}

Player.prototype.setFriend = function (neighbour, index) {
  this.friends[index] = {
    name: neighbour.name,
    friendship: neighbour.friendship
  };
}

//Reduce los puntos de todas las necesidades
Player.prototype.updateNeeds = function () {
  //Solo actualiza las necesidades si el jugador está activo
  if (this.currentState == 'active') {
    this.needs.hunger -= this.hungerReductionAmount;
    this.needs.fatigue -= this.fatigueReductionAmount;
    this.needs.pee -= this.peeReductionAmount;
  }
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
        this.skinIndex = 1;
        this.params = {};
        this.submenus = ['skin', 'name', 'create'];
        this.right = 1;
        this.left = -1;
        this.index = 1;
        this.moveCamera = false;
        this.cameraSpeed = 20;
        this.positionMoved = 0;
        this.name = '';
        this.state = this.submenus[0];
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

        for (var i = 1; i < this.game.numSkins; i++) {
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

        var continueTxt = this.game.add.bitmapText(450, 550, 'arcadeGreenFont', 'Press \'ENTER\' to continue', 20);
        continueTxt.fixedToCamera = true;
        this.txt;
        this.txtName = this.game.add.bitmapText(400, 800, 'arcadeGreenFont', 'Choose your name', 40);
        this.txtName.anchor.setTo(0.5, 0.5);
        this.txtName.align = "center";

        var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + name + '<', 40);
        nameTxt.anchor.setTo(0.5, 0.5);
        nameTxt.align = "center";

        return this.skins;
    },

    update: function () {
        this.checkInput(); // this.game, this.skins, this.skinIndex, this.params);
    },


    //Métodos

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

            if (this.state == this.submenus[0]) { //SKIN
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.skinIndex < 10) {
                    this.moveSkins(this.right);
                    this.skinIndex++;
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.skinIndex > 1) {
                    this.moveSkins(this.left);
                    this.skinIndex--;
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
                    this.moveCamera = true;
                    this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
                    this.state = this.submenus[1];
                }
            } else if (this.state == this.submenus[1]) { //NAME
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)) {
                    name = name.substring(0, name.length - 1);
                    var sound = this.game.add.audio('keyboardBackspace');
                    sound.volume = 0.2;
                    sound.play();
                    //console.log(name);
                    this.game.input.keyboard.reset(true); //resetea el teclado para evitar borrar muchas de golpe
                    this.printText(name);
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && name.length < 20) {
                    name += " ";
                    var sound = this.game.add.audio('keyboardBackspace');
                    sound.volume = 0.2;
                    sound.play();
                    this.game.input.keyboard.reset(true); //resetea el teclado para evitar borrar muchas de golpe
                    this.printText(name);
                }
                else {
                    this.input.keyboard.onPressCallback = function (e) {
                        if (!(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) && name.length < 20) { //para evitar que se pongan espacios
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

                if (name != "" && this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) { //pasamos al submenú 2:STATS
                    this.game.world.removeAll();
                    var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + name + '<', 40);
                    this.centerSprite(nameTxt);
                    this.txt = this.game.add.bitmapText(450, 550, 'arcadeGreenFont', 'Press \'ENTER\' to continue', 20);
                    this.txt.fixedToCamera = true;
                    this.moveCamera = true;
                    this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
                    this.state = this.submenus[2];
                    this.game.input.keyboard.onPressCallback = function () {}; //quita el callback
                }
            } else if (this.state == this.submenus[2]) { //STATS
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
                        this.addStatPoint();
                    } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.subStatPoint();
                }

                this.printStats(this.remainingPoints); //pinta en pantalla

                if (this.remainingPoints == 0 && (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER))) {

                    this.creationCompleted();
                    this.game.input.keyboard.onPressCallback = function () {}; //quita el callback
                }
                this.game.input.keyboard.reset(true); //resetea el teclado
            }
        }
        //this.game.debug.cameraInfo(this.game.camera, 32, 32); //this.skinSelected();
    },

    addStatPoint: function () {
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

    subStatPoint: function () {
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
        var continueTxt = this.game.add.bitmapText(450, 1750, 'arcadeGreenFont', 'Press \'ENTER\' to continue', 20);
    },

    printText: function (name) {
        this.game.world.removeAll();
        var continueTxt = this.game.add.bitmapText(450, 1150, 'arcadeGreenFont', 'Press \'ENTER\' to continue', 20);
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

        for (var i = 1; i < this.game.numSkins; i++) {
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

var GameOverScene = {
        //CREATE
        create: function () {
            //tumba
            var grave = this.game.add.image(
                this.game.world.centerX - 100, this.game.world.centerY, 'grave');
            grave.anchor.setTo(0.5, 0.5);
            grave.scale.setTo(0.25, 0.25);


            this.camera.setPosition(grave.x - 280, grave.y - 300);


            //texto de la lápida
            var graveText = this.game.add.bitmapText(grave.x, grave.y + 20, 'arcadeBlackFont',
                    this.game.gameOverData.name + '\n\nYour ' + this.game.gameOverData.numFriends +
                    ' friends\nwill not forget you.\n\n' + ((this.game.gameOverData.days % 30) + 1) + '/' + (Math.max(1, Math.trunc(this.game.gameOverData.days / 30 + 1) % 12)) + '/19XX', 20);
                    //La fecha de la lápida refleja el día en el que moriste
                    graveText.anchor.setTo(0.5, 1); graveText.align = "center";

                    //texto de la derecha
                    var deathCauseString = '';
                    switch (this.game.gameOverData.deathCause) {
                        case 'pee':
                            deathCauseString = "storing too much pee\nin your\nsim's body.";
                            break;
                        case 'hunger':
                            deathCauseString = "starving.";
                            break;
                        case 'fatigue':
                            deathCauseString = " exhaustion.\n\nSleeping at least\n8 hours per day\nis recommended unless\nyou are a\nvideogame developer.";
                            break;
                        case 'money':
                            deathCauseString = "losing all your money,\nwhich in RetrosimCity\nmeans DEATH.";
                            break;
                    }

                    var extraText = this.game.add.bitmapText(grave.x + 350, grave.y + 20, 'arcadeWhiteFont',
                        'You died from\n' + deathCauseString +
                        '\n\nYou lived for\n' + this.game.gameOverData.days + ' days' +
                        '\n\nYou had\n' + this.game.gameOverData.money + ' EUROS', 20); extraText.anchor.setTo(0.5, 1); extraText.align = "center";

                    //Botón para ir al menú
                    var menuButton = this.addButton('nextButton', '',
                        grave.x + 450, grave.y + 225,
                        64, 64,
                        function () {
                            this.game.state.start('menu');
                        });

                },

                /*render: function(){
                    this.game.debug.spriteInfo(this.hud_mainBox, 32, 32);
                },*/


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

        module.exports = GameOverScene;
},{}],7:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var CreationScene = require('./creation_scene.js') //Escena de creación de personaje
var MenuScene = require('./menu_scene.js');
var GameOverScene = require('./gameOver_scene');

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

    //Sims
    this.game.numSkins = 11;
    for (var i = 1; i < this.game.numSkins; i++) //Los sprites de los sims
      this.game.load.spritesheet('sim' + i, 'images/sims/Sim' + i + '.png', 224, 256, 8);

    this.game.load.spritesheet('sim1anim', 'images/sims/Sim1.png', 224, 256, 8);
    //this.game.load.spritesheet('sim1up', 'images/sims/Sim1Up.png');

    this.game.load.image('arrow', 'images/SimsArrow.png'); //Flecha verde
    //this.game.load.image('trigger', 'images/cross.png'); //Imagen usada para triggers invisibles
    this.game.load.image('censor', 'images/censorship.png'); //Imagen usada para censurar    
    this.game.load.image('grave', 'images/GameOverScreen.png');


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
    this.game.load.image('musicButton', 'images/hud/musicButton.png');
    this.game.load.image('musicOffButton', 'images/hud/musicOffButton.png');
    this.game.load.image('buildButton', 'images/hud/buildButton.png');
    this.game.load.image('jobsButton', 'images/hud/jobsButton.png');
    this.game.load.image('basicButton', 'images/hud/basicButton.png');


    //TILES para el Build Mode
    this.game.load.image('bed', 'images/tiles/Bed.png');
    this.game.load.image('fridgeFront', 'images/tiles/FridgeFront.png');
    this.game.load.image('fridgeSide', 'images/tiles/FridgeSide.png');
    this.game.load.image('sink', 'images/tiles/Sink.png');
    this.game.load.image('toilet', 'images/tiles/Toilet.png');
    this.game.load.image('worktop', 'images/tiles/Worktop.png');
    this.game.load.image('cross', 'images/cross.png');



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
    this.game.load.audio('death', 'audio/death.wav');
    this.game.load.audio('job', 'audio/job.wav');
    this.game.load.audio('goToJob', 'audio/goToJob.wav');
    this.game.load.audio('money', 'audio/money.wav');
    this.game.load.audio('sink', 'audio/sink.wav');
    this.game.load.audio('chat1', 'audio/chat1.wav');
    this.game.load.audio('chat2', 'audio/chat2.wav');
    this.game.load.audio('build', 'audio/build.wav');
    this.game.load.audio('error', 'audio/error.wav');
    this.game.load.audio('playSceneMusic', 'audio/Silly Fun.mp3');
  },

  create: function () {
    // Audios del juego (los necesarios para distintas escenas)
    this.game.tap = this.game.add.audio('tap');
    this.game.select = this.game.add.audio('select');
    this.game.theme = this.game.add.audio('mainTheme');
    this.game.playSceneMusic = this.game.add.audio('playSceneMusic');

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
  game.state.add('gameOver', GameOverScene); //Escena de fin de juego

  game.state.start('boot');
};
},{"./creation_scene.js":5,"./gameOver_scene":6,"./menu_scene.js":8,"./play_scene.js":9}],8:[function(require,module,exports){
'use strict';

var MenuScene = {
    create: function () {
        //Recoge los datos de jugador guardados en localstorage (si los hay)
        this.playerData = localStorage.getItem("playerData");
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
            }, 40);

        //Mostrar el botón de Continuar si encuentra datos guardados
        if (this.playerData != undefined) {
            this.playerParams = JSON.parse(this.playerData);

            addButton(this.game, 'Play again as ' + this.playerParams.name,
                this.game.world.centerX, this.game.world.centerY + 200,
                550, 70,
                function () {
                    this.game.tap.volume = 0.1;
                    this.game.tap.play();
                    this.game.state.start('play');
                }, 22);
        }

    },

    update: function () {

    }
};

function addButton(game, string, x, y, w, h, callback, fontSize) {
    var button = game.add.button(x, y, 'paredTop', callback, this);

    button.anchor.setTo(0.5, 0.5);
    button.width = w;
    button.height = h;

    var txt = game.add.bitmapText(button.x, button.y, 'arcadeBlackFont', string, fontSize);
    txt.anchor.setTo(0.5, 0.5);
    txt.align = "center";
}


module.exports = MenuScene;
},{}],9:[function(require,module,exports){
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
    //console.log(this.playerParams);
    this.game.gameOverData = {};
  },

  //CREATE
  create: function () {
    this.game.theme.stop();

    this.game.playSceneMusic.play(); //Empieza la música de playScene
    this.game.playSceneMusic.loop = true; //loop
    this.game.playSceneMusic.volume = 0.055; //volumen

    this.jobSound = this.game.add.audio('job');
    this.goToJobSound = this.game.add.audio('goToJob');
    this.moneySound = this.game.add.audio('money');
    this.paySound = this.game.add.audio('pay'); //PAGAR
    this.paySound.volume = 0.5;

    //Valores iniciales
    this.atWork = false;
    this.game.initialX = this.game.world.centerX + 900, this.game.initialY = 3500;
    this.needsRate = 10; //tiempo que tiene que pasar para reducir todas las necesidades (en minutos del juego)
    this.sleepingHours = 6;
    this.neighbourSpawnRate = 15000; //tiempo entre spawn de vecinos en milisegundos
    this.spawningNeighbour = false; //Indica si se está "spawneando" un vecino para no spawnear otro
    var NUM_NEIGHBOURS = 10; //número total de vecinos
    this.maleNames = [ //Array de nombres masculinos
      'Troy James',
      'Kevin Hudson',
      'Liu Xun',
      'Ronan Barnes',
      'Alberto Ruiz',
      'Olly Davidson',
      'Sergio Castro',
      'Haris Parker',
      'Angus Porter',
      'Khalid Howard',
      'Dexter Lowe',
      'Lucas Correa',
      'Yao Zheng',
      'David Carmona',
      'Mario Tabasco'
    ];
    this.femaleNames = [ //Array de nombres femeninos
      'Cecilia Reyes',
      'Carmen Vega',
      'Yi Jie',
      'Teresa Villa',
      'Sofia Lewis',
      'Joanna White',
      'Rosie Collins',
      'Penelope Hicks',
      'Hollie Thompson',
      'Melody Schmidt',
      'Hannah Kennedy',
      'Kate Jackson',
      'Mei Ling'
    ];


    
    //Precios del modo deco.
    this.game.buildCost = {
      bed: 200,
      fridge: 500,
      sink: 50,
      toilet: 75,
      worktop: 50
    };



    this.timeSpeed = 50; //La velocidad a la que pasan los minutos del juego (1000 = 1 minuto por segundo)
    //Tiempo del juego
    this.timeCounter = {
      day: 0,
      hour: 12,
      minute: 0
    };

    //loop de tiempo
    this.game.time.events.loop(this.timeSpeed, this.updateTimeCounter, this);

    //Loop de spawneo de vecinos
    this.game.time.events.loop(this.neighbourSpawnRate, this.spawnSim, this);

    //Pago de facturas
    this.billsArePaid = false;
    this.billCost = 1000;
    this.billPaymentRate = 5 //días entre pago de facturas
      *
      (this.timeSpeed * 60 * 24); // (this.timeSpeed * 60 * 24) = 1 día de juego

    //Timer de pago de facturas
    this.billsTimer = this.game.time.create(true);
    this.billsTimer.start();

    //Trabajos posibles -> nombre, salario, habilidad necesaria, puntos de habilidad necesarios
    this.jobs = {
      waiter: {
        name: 'Bar Waiter/Waitress',
        wage: 100,
        skillName: 'none',
        skillPts: 0
      },
      scienceIntern: {
        name: 'Science Lab Intern',
        wage: 250,
        skillName: 'int',
        skillPts: 5
      },
      gymTrainer: {
        name: 'Gym Trainer',
        wage: 200,
        skillName: 'fit',
        skillPts: 5
      },
      hotelEntertainer: {
        name: 'Hotel Entertainer',
        wage: 180,
        skillName: 'cha',
        skillPts: 5
      },
      cernScientist: {
        name: 'CERN Scientist',
        wage: 400,
        skillName: 'int',
        skillPts: 10
      },
      proBodybuilder: {
        name: 'Professional Bodybuilder',
        wage: 450,
        skillName: 'fit',
        skillPts: 10
      },
      rockStar: {
        name: 'Rock Star',
        wage: 500,
        skillName: 'cha',
        skillPts: 10
      }
    };

    //Información que se muestra en el hud:
    // 0: NEEDS
    // 1: YOU
    // 2: FRIENDS
    // Empieza con NEEDS
    this.selectedHUD = 0;
    this.friendsWindowPage = 1;

    this.debug = false; //Poner a true para activar los debugs de player y del tilemap
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.editMode = false;
    this.inJobsMenu = false;

    //Tilemap
    this.map = new Map(this.game);

    this.map.objectsLayer.debug = this.debug; //debug del tilemap

    //Creación del jugador
    this.player = new Player(
      this.game, this.map, 'sim' + this.playerParams.simIndex,
      this.game.initialX, this.game.initialY,
      this.playerParams.name, this.playerParams.intelligence, this.playerParams.fitness, this.playerParams.charisma);
    this.map.createTopLayers(); //Crea las capas del tilemap que están sobre el jugador
    this.camera.follow(this.player);

    this.map.player = this.player;
    //  VECINOS
    this.neighboursGroup = this.game.add.group();

    for (var i = 0; i < NUM_NEIGHBOURS; i++) {
      var n = this.randomizeNeighbour();
      this.neighboursGroup.add(n);
    }
    this.neighboursGroup.callAll('kill');


    this.createHUD();

    this.spawnSim(); //aparece el primer vecino





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

    //Spawn de vecinos (AHORA SE ENCARGA UN LOOP)
    /*if (!this.spawningNeighbour && this.timeCounter.minute % this.neighbourSpawnRate == 0) {
      this.spawningNeighbour = true;
      this.spawnSim();
    }*/

    //Ir al trabajo
    if (this.timeCounter.hour == 8 && this.player.job.name != 'Unemployed' && !this.atWork) {
      this.goToWork();
    }

    //Pagar las facturas
    if (this.billsTimer.ms >= this.billPaymentRate) {
      this.billsTimer.stop();
      this.billsTimer.start();
      this.payBills();
    }

    if (this.editMode)
      this.map.update();

    this.updateNeeds();

    if (this.player.currentState == 'sleeping') { //Si el jugador está durmiendo, avanza el tiempo 8 horas
      if (this.timeCounter.hour + this.sleepingHours > 23) //si pasa de día al dormir, actualiza timecounter.day
        this.timeCounter.day++;

      this.timeCounter.hour = (this.timeCounter.hour + this.sleepingHours) % 23;
      this.player.currentState = 'waking up'; //para que no siga aumentando en cada update
    } else if (this.player.currentState == 'active')
      this.timeCounterText.setText(this.getTimeText()); //Actualiza el texto del tiempo
    else if (this.player.currentState == "checkingMails") {
      var daysUntilBill = Math.trunc((this.billPaymentRate - this.billsTimer.ms) / (this.timeSpeed * 60 * 24));
      var message = "Days until next bill\npayment:\n" +
        daysUntilBill;

      if (daysUntilBill == 0)
        message += "\n\nYou will pay you bills soon!"

      this.showMessage(message);
      this.player.resetState();
    }

    this.hud_playerMoney.setText(this.player.money); //Actualiza el texto del dinero

    //Comprueba si ha perdido
    this.checkGameOver();
  },

  checkGameOver: function () {
    if (this.player.needs.pee <= 0) {
      this.game.gameOverData.deathCause = 'pee';
      this.gameOver();
    } else if (this.player.needs.hunger <= 0) {
      this.game.gameOverData.deathCause = 'hunger';
      this.gameOver();
    } else if (this.player.needs.fatigue <= 0) {
      this.game.gameOverData.deathCause = 'fatigue';
      this.gameOver();
    } else if (this.player.money <= 0) {
      this.game.gameOverData.deathCause = 'money';
      this.gameOver();
    }

  },

  //Actualiza la longitud de las barras de necesidad del hud y reduce todas las necesidades cada X minutos(minutos del juego)
  updateNeeds: function () {
    //reduce los puntos de necesidad cada needsRate minutos del juego
    if (this.timeCounter.minute % this.needsRate == 0) {
      this.player.updateNeeds();
    }

    //Actualiza las barras del hud
    this.hungerBar.width = this.player.needs.hunger / this.player.maxNeed * this.barWidth;
    this.sleepBar.width = this.player.needs.fatigue / this.player.maxNeed * this.barWidth;
    this.toiletBar.width = this.player.needs.pee / this.player.maxNeed * this.barWidth;
  },

  //actualiza el contador de tiempo adecuadamente
  updateTimeCounter: function () {
    if (this.timeCounter.minute < 59)
      this.timeCounter.minute++;
    else {
      if (this.timeCounter.hour < 23)
        this.timeCounter.hour++;
      else {
        this.timeCounter.hour = 0;
        this.timeCounter.day++;
      }
      this.timeCounter.minute = 0;
    }

  },


  //RENDER
  render: function () {
    //Debugs
    if (this.debug) {
      this.game.debug.body(this.player);
    }
    //this.game.debug.spriteInfo(this.player, 32, 80);
    //this.game.debug.text("x: "+ this.intelligenceText /*+ "   \ny: " + this.intelligenceText.y*/, 32, 32);
  },

  //Devuelve un número aleatorio entre [min, max]
  randomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },


  //Genera un vecino con nombre y apariencia aleatoria
  randomizeNeighbour: function () {
    var n;
    var name;
    var skinIndex = this.randomNumber(1, this.game.numSkins - 1); //skin random

    if (Math.random() > 0.5)
      name = this.maleNames[this.randomNumber(0, this.maleNames.length - 1)]; //Nombre masculino
    else
      name = this.femaleNames[this.randomNumber(0, this.femaleNames.length - 1)]; //Nombre femenino


    n = new Neighbour(this.game, this.player, 'sim' + skinIndex,
      0, this.game.initialY, name);

    return n;
  },


  //Revive un vecino del grupo de vecinos y lo coloca en (0, rnd(initialY+1, initialY+150))
  spawnSim: function () {

    var i = 0;
    do {
      var sim = this.neighboursGroup.getRandom();
      i++;
    }
    while (i < 5 && sim.alive);


    if (!sim.alive) { //Si ha encontrado uno muerto
      sim.revive();
      sim.setPosition(0, this.game.initialY + Math.floor((Math.random() * 150) + 1));
      sim.setState('walkingToCenter');
      console.log(sim.name + ": HI!");
    } else //Si no, todos están ya en el juego
      console.log("Everyone is alive");

    //timer para poner spawningNeighbour a false y que se puedan spawnear más vecinos
    var timer = this.game.time.create(true);
    timer.loop(1000, function () {
      this.spawningNeighbour = false;
      timer.stop();
    }, this);
    timer.start();
  },

  payBills: function () {
    this.paySound.play();
    this.player.money -= this.billCost;
    this.player.showExchange(-this.billCost);
    this.showMessage("You paid your bills.\nYou lost " + this.billCost + " EUROS");
    this.billsArePaid = true;
  },

  goToWork: function () {
    this.goToJobSound.play();
    this.timeCounter.hour = 15;
    this.timeCounter.minute = 50;
    this.atWork = true;
    this.game.camera.fade(0x000000, 500);

    var auxTimer = this.game.time.create(true);
    auxTimer.loop(3000, function () {
      this.player.resetPosition();
      this.player.money += this.player.job.wage;
      this.showMessage("You went to work and\nearned " + this.player.job.wage + " EUROS!")

      this.game.camera.resetFX();
      this.moneySound.play();
      this.player.showExchange(this.player.job.wage);

      this.atWork = false;
      auxTimer.stop();
    }, this);
    auxTimer.start();


  },


  ////////////////////////////////////////////////////////////
  //                        INTERFAZ                       //
  //////////////////////////////////////////////////////////
  createHUD: function () {
    //main hud box
    this.hud_mainBox = this.game.add.sprite(window.innerWidth - 400, window.innerHeight + 125, 'hudBox');
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
    this.timeCounter_offset = 116;
    //this.hud_barOffset = 

    //player's name
    this.hud_playerName = this.game.add.bitmapText(this.hud_x / 2, this.hud_y + 10, 'arcadeBlackFont', this.player.name, 20); //(this.hud_mainBox.x, this.hud_mainBox.y, 'arcadeBlackFont', this.player.name, 20);
    this.hud_playerName.align = "left";
    this.hud_playerName.fixedToCamera = true;

    //player's money
    this.hud_playerMoney = this.game.add.bitmapText(32, 32, 'arcadeBlackFont', this.player.money, 20); //(this.hud_mainBox.x, this.hud_mainBox.y, 'arcadeBlackFont', this.player.name, 20);
    this.hud_playerMoney.align = "left";
    this.hud_playerMoney.fixedToCamera = true;

    this.moneyIcon = this.game.add.sprite(
      32 + 20 * this.player.money.toString().length, 40, 'moneyIcon');
    this.moneyIcon.fixedToCamera = true;
    this.moneyIcon.anchor.setTo(0, 0.5);
    this.moneyIcon.scale.setTo(0.07, 0.07);

    //time counter
    this.timeCounterText = this.game.add.bitmapText(
      window.innerWidth - this.timeCounter_offset, 32, 'arcadeBlackFont',
      this.getTimeText(), //muestra el tiempo con formato: 00:00
      20);
    this.timeCounterText.align = "left";
    this.timeCounterText.fixedToCamera = true;

    //MUSIC ON/OFF BUTTON
    var musicButton = this.addButton('musicButton', '', window.innerWidth - this.timeCounter_offset + 60, 120, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 2) {
        if (this.game.playSceneMusic.isPlaying) {
          this.game.playSceneMusic.stop();
          musicButton.loadTexture('musicOffButton');
        } else {
          this.game.playSceneMusic.play();
          musicButton.loadTexture('musicButton');
        }
      }
    });
    musicButton.fixedToCamera = true;
    musicButton.scale.setTo(0.075, 0.075);

    //BUILD MODE BUTTON
    var buildButton = this.addButton('buildButton', '', window.innerWidth - this.timeCounter_offset + 60, 170, this.hud_buttonW, this.hud_buttonW, function () {
      //this.showMessage("The Build Mode feature\nis currently a\nWORK IN PROGRESS");
      if (!this.editMode) {
        this.map.createMarker();
        this.editMode = true;
        this.showGroup(this.buildGroup);
      } else {
        this.editMode = false;
        this.hideGroup(this.buildGroup);
        this.map.quitBuilding();
      }
    });
    buildButton.fixedToCamera = true;
    buildButton.scale.setTo(0.075, 0.075);

    //JOBS BUTTON
    this.jobsGroup = this.game.add.group();
    var jobsButton = this.addButton('jobsButton', '', window.innerWidth - this.timeCounter_offset + 60, 220, this.hud_buttonW, this.hud_buttonW, function () {
      if (!this.inJobsMenu)
        this.showJobs();
      else
        this.hideJobs();
    });
    jobsButton.fixedToCamera = true;
    jobsButton.scale.setTo(0.075, 0.075);


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

        if (this.selectedHUD == 2) //friends menu
          this.hideGroup(this.friendsExtraGroup);
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

        if (this.selectedHUD == 2) //friends menu
          this.hideGroup(this.friendsExtraGroup);
        this.selectedHUD = 1;
      }
    });
    this.youButton.fixedToCamera = true;


    //  FRIENDS
    //group
    this.friendsGroup = this.game.add.group();

    //for(var i = 0; i < this.player.getNumFriends();i++)

    for (var i = 0; i < Math.min(3, this.player.numFriends); i++) {
      var txt = this.player.friends[i].name + '\n' + this.player.friends[i].points + 'friendship points';
      this.friendsGroup.add(this.game.add.bitmapText(this.youIconX + this.youTextOffset,
        this.hud_buttonsY, 'arcadeBlackFont',
        txt, 20));
    }
    /*this.friendText1 = this.game.add.bitmapText(this.youIconX + this.youTextOffset,
      this.hud_buttonsY, 'arcadeBlackFont',
      txt, 20);*/

    this.friendsGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      elem.scale.setTo(0.075, 0.075);
      elem.anchor.setTo(0.5, 0.5);
    });

    //extra group -> para los botones dentro del menú FRIENDS que no queremos que cambien al cambiar de página
    this.friendsExtraGroup = this.game.add.group();

    this.pageText = this.game.add.bitmapText(this.hud_buttonsX + this.hud_buttonW - 60, this.hud_buttonsY - 64, 'arcadeBlackFont',
      'Page ' + this.friendsWindowPage + "/" + (Math.round(this.player.numFriends / 3) + 1), 18);

    this.friendsExtraGroup.add(this.pageText);

    //botón Next Page
    var nextPageButton = this.addButton('nextButton', '',
      this.hud_buttonsX + this.hud_buttonW - 150, this.hud_buttonsY - 64,
      this.hud_buttonW, this.hud_buttonW,
      function () {
        this.friendsWindowPage = Math.max(1, Math.min(this.friendsWindowPage + 1,
          Math.round(this.player.numFriends / 3) + 1
        )); // página límite

        this.updateFriendsHUD();
      });

    nextPageButton.scale.setTo(0.075, 0.075);
    this.friendsExtraGroup.add(nextPageButton);


    //botón Prev Page
    var prevPageButton = this.addButton('prevButton', '',
      this.hud_buttonsX + this.hud_buttonW - 150 - 54, this.hud_buttonsY - 64,
      this.hud_buttonW, this.hud_buttonW,
      function () {
        this.friendsWindowPage = Math.max(1, this.friendsWindowPage - 1); // página límite

        this.updateFriendsHUD();
      });

    prevPageButton.scale.setTo(0.075, 0.075);
    this.friendsExtraGroup.add(prevPageButton);


    //botón de reset de la lista de amigos
    var resetButton = this.addButton('resetButton', '',
      this.hud_buttonsX + this.hud_buttonW - 150 - 128, this.hud_buttonsY - 64,
      this.hud_buttonW, this.hud_buttonW,
      function () {
        this.updateFriendsHUD();
      });

    resetButton.scale.setTo(0.075, 0.075);
    this.friendsExtraGroup.add(resetButton);

    this.friendsExtraGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      elem.anchor.setTo(0.5, 0.5);
    });

    //button
    this.friendsButton = this.addButton('friendsIcon', '', this.hud_buttonsX + 2 * this.hud_buttonW, this.hud_buttonsY, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 2) {
        this.changeMenu(this.friendsGroup);
        this.resetHUD();
        this.friendsButton.loadTexture('friendsIconSelected');
        this.selectedHUD = 2;

        this.showGroup(this.friendsExtraGroup);

        //show friends
        this.updateFriendsHUD();
      }
    });
    this.friendsButton.fixedToCamera = true;





    ///////////////////////////////////////
    ///            BUILD MODE          ///
    /////////////////////////////////////


    //group
    this.buildGroup = this.game.add.group();


    var panelW, panelH, panelX, panelY;
    panelW = window.innerWidth;
    panelX = 0;
    panelH = window.innerHeight / 4.75;
    panelY = window.innerHeight - panelH; //window.innerHeight / 2 - panelH / 2;

    var panel = this.game.add.image(
      panelX, panelY, 'paredTop');
    panel.anchor.setTo(0, 0);
    panel.width = panelW;
    panel.height = panelH;
    this.buildGroup.add(panel);



    var numTiles = 7;
    var tilesKeys = [
      'bed',
      'fridgeFront',
      'fridgeSide',
      'sink',
      'toilet',
      'worktop',
      'cross'
    ];

    var i = 0;

    this.buildGroup.add(this.addButton(tilesKeys[i], '',
      panelX + 70 + i * 84, panelY + 50, 64, 64,
      function () {
        this.map.tileSelected('bed');
      }, 10));
    this.buildGroup.add(this.game.add.bitmapText(panelX + 32 + i * 84,
      panelY + 50 + 43,
      'arcadeBlackFont',
      this.game.buildCost.bed + ' EUR', 14));
    i++;

    this.buildGroup.add(this.addButton(tilesKeys[i], '',
      panelX + 70 + i * 84, panelY + 50, 64, 64,
      function () {
        this.map.tileSelected('fridgeFront');
      }, 10));
      this.buildGroup.add(this.game.add.bitmapText(panelX + 32 + i * 84,
        panelY + 50 + 43,
        'arcadeBlackFont',
        this.game.buildCost.fridge + ' EUR', 14));
    i++;

    this.buildGroup.add(this.addButton(tilesKeys[i], '',
      panelX + 70 + i * 84, panelY + 50, 64, 64,
      function () {
        this.map.tileSelected('fridgeSide');
      }, 10));
      this.buildGroup.add(this.game.add.bitmapText(panelX + 32 + i * 84,
        panelY + 50 + 43,
        'arcadeBlackFont',
        this.game.buildCost.fridge + ' EUR', 14));
    i++;

    this.buildGroup.add(this.addButton(tilesKeys[i], '',
      panelX + 70 + i * 84, panelY + 50, 64, 64,
      function () {
        this.map.tileSelected('sink');
      }, 10));
      this.buildGroup.add(this.game.add.bitmapText(panelX + 32 + i * 84,
        panelY + 50 + 43,
        'arcadeBlackFont',
        this.game.buildCost.sink + ' EUR', 14));
    i++;

    this.buildGroup.add(this.addButton(tilesKeys[i], '',
      panelX + 70 + i * 84, panelY + 50, 64, 64,
      function () {
        this.map.tileSelected('toilet');
      }, 10));
      this.buildGroup.add(this.game.add.bitmapText(panelX + 32 + i * 84,
        panelY + 50 + 43,
        'arcadeBlackFont',
        this.game.buildCost.toilet + ' EUR', 14));
    i++;

    this.buildGroup.add(this.addButton(tilesKeys[i], '',
      panelX + 70 + i * 84, panelY + 50, 64, 64,
      function () {
        this.map.tileSelected('worktop');
      }, 10));
      this.buildGroup.add(this.game.add.bitmapText(panelX + 32 + i * 84,
        panelY + 50 + 43,
        'arcadeBlackFont',
        this.game.buildCost.worktop + ' EUR', 14));
    i++;


    this.buildGroup.add(this.addButton(tilesKeys[i], '',
      panelX + 70 + i * 84, panelY + 50, 64, 64,
      function () {
        this.editMode = false;
        this.hideGroup(this.buildGroup);
        this.map.quitBuilding();
      }, 10));
      i++;



      this.buildGroup.add(this.game.add.bitmapText(panelX + 32 + i * 84,
        panelY + 6,
        'arcadeBlackFont',
        'Click in the image,\nthen click in the\nground to place an\nobject.\nClick the red cross\nto quit.\nYou will have\nto move to see\nthe changes.'
        , 12));


    this.buildGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
    });


    this.hideGroup(this.needsGroup);
    this.hideGroup(this.youGroup);
    this.hideGroup(this.friendsGroup);
    this.hideGroup(this.friendsExtraGroup);
    this.hideGroup(this.buildGroup);
    this.showActualMenu();
  },

  getTimeText: function () {
    return "Day: " + (this.timeCounter.day + 1) + "\n" +
      ("0" + this.timeCounter.hour).slice(-2) + ':' + ("0" + this.timeCounter.minute).slice(-2);
  },

  applyForJob: function (job) {
    var enoughSkill = false;

    //Comprueba que el jugador tiene suficientes puntos de la habilidad requerida
    switch (job.skillName) {
      case 'int':
        if (this.player.stats.intelligence >= job.skillPts) enoughSkill = true;
        break;
      case 'fit':
        if (this.player.stats.fitness >= job.skillPts) enoughSkill = true;
        else var skill = 'FITNESS';
        break;
      case 'cha':
        if (this.player.stats.charisma >= job.skillPts) enoughSkill = true;
        break;
      default:
        enoughSkill = true;
        break;
    }

    if (enoughSkill) {
      this.player.job = job;
      this.hideJobs();
      this.jobSound.play();

      this.showMessage('You were chosen to\nstart working as a\n' + this.player.job.name + "!");
    } else {
      this.hideJobs();
      this.showMessage("You must improve your\n" + skill + "\n\n(Click in YOU to\ncheck your skills)");
    }
  },

  displayJobInfo: function (job, x, y) {
    var skillIconDim = 32;
    var skillIconKey = '';
    switch (job.skillName) {
      case 'int':
        skillIconKey = 'intelligenceIcon';
        break;
      case 'fit':
        skillIconKey = 'fitnessIcon';
        break;
      case 'cha':
        skillIconKey = 'charismaIcon';
        break;
    }

    var jobNameX = x + skillIconDim + 37;

    if (skillIconKey != '') {
      var skillIcon = this.game.add.image(
        x, y, skillIconKey);
      skillIcon.anchor.setTo(0, 0);
      skillIcon.width = skillIconDim;
      skillIcon.height = skillIconDim;
      this.jobsGroup.add(skillIcon);

      var skillPts = this.game.add.bitmapText(jobNameX - 32, y, 'arcadeBlackFont', job.skillPts, 16);
      this.jobsGroup.add(skillPts);
    }

    var jobName = this.game.add.bitmapText(jobNameX + 16, y, 'arcadeBlackFont', job.name + "\nWage: " + job.wage + " EUROS", 16);
    this.jobsGroup.add(jobName);

    var applyButton = this.addButton('basicButton', 'APPLY', jobNameX + 300, y + 20, skillIconDim + 20, skillIconDim, function () {
      this.applyForJob(job);
    }, 10, true);
    this.jobsGroup.add(applyButton[0]);
    this.jobsGroup.add(applyButton[1]);
  },

  //Abre el menú JOBS
  showJobs: function () {
    this.inJobsMenu = true;

    var panelW, panelH, panelX, panelY;
    panelW = window.innerWidth / 1.5;
    panelX = window.innerWidth / 2 - panelW / 2;
    panelH = window.innerHeight - window.innerHeight / 8;
    panelY = 16; //window.innerHeight / 2 - panelH / 2;

    var jobsPanel = this.game.add.image(
      panelX, panelY, 'hudBox');
    jobsPanel.anchor.setTo(0, 0);
    jobsPanel.width = panelW;
    jobsPanel.height = panelH;
    this.jobsGroup.add(jobsPanel);

    var yourJobsText = this.game.add.bitmapText(panelX + 16, panelY + 32, 'arcadeBlackFont', "Your job:\n" + this.player.job.name + "\nWage: " + this.player.job.wage + " EUROS", 16);
    this.jobsGroup.add(yourJobsText);

    var scheduleText = this.game.add.bitmapText(panelX + 300, panelY + 32, 'arcadeBlackFont', "Working hours:\n8:00 - 16:00", 16);
    this.jobsGroup.add(scheduleText);

    var availableJobsText = this.game.add.bitmapText(panelX + 16, panelY + 128, 'arcadeBlackFont', "Available jobs:", 16);
    this.jobsGroup.add(availableJobsText);

    var yJobOffset = 50;

    //Mostrar todos los trabajos disponibles
    var cont = 0;
    for (var key in this.jobs) {
      if (this.jobs.hasOwnProperty(key)) {
        if (this.jobs[key] != this.player.job) {
          this.displayJobInfo(this.jobs[key], panelX + 16, availableJobsText.y + 24 + yJobOffset * cont);
          cont++;
        }
      }
    }



    this.jobsGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
    });
  },

  //Cierra el menú JOBS
  hideJobs: function () {
    this.inJobsMenu = false;

    this.hideGroup(this.jobsGroup);
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
    this.friendsGroup.removeAll(true);

    this.pageText.setText('Page ' + this.friendsWindowPage + "/" + (Math.round(this.player.numFriends / 3) + 1));

    for (var i = 0; i < Math.min(3, this.player.numFriends); i++) {
      var index = i + (3 * (this.friendsWindowPage - 1));
      if (this.player.searchFriendByIndex(index)) { //Si existe un amigo con este índice
        var s = this.player.friends[index].name + '\n' + this.player.friends[index].points + ' friend points';
        var txt = this.game.add.bitmapText(i * 180 + this.youIconX - 80 + this.youTextOffset,
          this.hud_buttonsY, 'arcadeBlackFont',
          s, 15)


        txt.fixedToCamera = true;
        txt.align = "left";
        txt.anchor.setTo(0, 0.5);

        this.friendsGroup.add(txt);
      }
    }
  },

  showMessage: function (message) {
    //PANEL
    var panelW, panelH, panelX, panelY;
    panelW = window.innerWidth / 3;
    panelX = window.innerWidth / 2 - panelW / 2;
    panelH = window.innerHeight / 3;
    panelY = 16; //window.innerHeight / 2 - panelH / 2;

    var panel = this.game.add.image(
      panelX, panelY, 'hudBox');
    panel.anchor.setTo(0, 0);
    panel.width = panelW;
    panel.height = panelH;
    panel.fixedToCamera = true;

    //TEXT
    var text = this.game.add.bitmapText(panelX + 16, panelY + 32, 'arcadeBlackFont', message, 16);
    text.fixedToCamera = true;

    var quitText = this.game.add.bitmapText(panelX + panelW / 2, panelY + panelW - 90, 'arcadeBlackFont', '(Click inside to close)', 16);
    quitText.fixedToCamera = true;
    quitText.anchor.setTo(0.5, 0.5);
    quitText.align = "center";

    panel.inputEnabled = true;
    panel.events.onInputDown.add(function () {
      panel.destroy();
      text.destroy();
      quitText.destroy();
    });
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


  ///
  //  FIN DE INTERFAZ
  ///


  hideGroup: function (group) {
    /*group.forEach(function (elem) {
      elem.kill();
    });*/

    group.callAll('kill');
  },

  showGroup: function (group) {
    group.forEach(function (elem) {
      elem.revive();
    });
  },

  //Crea un botón
  addButton: function (sprite, string, x, y, w, h, callback, fontSize, returnText) {
    fontSize = fontSize || 20;
    returnText = returnText || false;
    var button = this.game.add.button(x, y, sprite, callback, this, 2, 1, 0);

    button.anchor.setTo(0.5, 0.5);
    button.width = w;
    button.height = h;

    var txt = this.game.add.bitmapText(button.x, button.y, 'arcadeBlackFont', string, fontSize);
    txt.anchor.setTo(0.5, 0.5);
    txt.align = "center";
    txt.fixedToCamera = true;

    if (returnText)
      return [button, txt];
    else
      return button;
  },




  ///////////////////////////////////////
  ///            GAME OVER           ///
  /////////////////////////////////////
  gameOver: function () {
    if (this.game.playSceneMusic.isPlaying)
      this.game.playSceneMusic.stop();
    var deathSound = this.game.add.audio('death');
    deathSound.volume = 0.5;
    deathSound.play();


    this.game.gameOverData.name = this.player.name;
    this.game.gameOverData.numFriends = this.player.numFriends;
    this.game.gameOverData.money = this.player.money;
    this.game.gameOverData.days = this.timeCounter.day;

    this.game.world.setBounds(0, 0, 800, 600); //Restaura las dimensiones del world(modificadas por el tilemap)

    this.game.state.start('gameOver'); //Empieza gameOverScene
  }

};

module.exports = PlayScene;
},{"./Map":2,"./Neighbour":3,"./Player":4}]},{},[7]);
