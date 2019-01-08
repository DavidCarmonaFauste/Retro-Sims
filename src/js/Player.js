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