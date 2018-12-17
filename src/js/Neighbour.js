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
  if (this.dialogtimer.ms >= 3000) {
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