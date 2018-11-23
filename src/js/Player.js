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