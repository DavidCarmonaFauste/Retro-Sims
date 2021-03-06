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