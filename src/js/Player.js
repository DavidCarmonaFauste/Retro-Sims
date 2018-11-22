function Player(game, sprite, x, y, name, intelligence, fitness, charisma, money, job) {
  Phaser.Sprite.call(this, game, x, y, sprite);

  this.anchor.setTo(0.5, 0.5);


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

Player.prototype.update = function() {
  this.move();
};

Player.prototype.move = function() {
  if(this.controls.up.isDown){
    //this.animations.play('run');
    this.y -= this.speed;
  } else if(this.controls.down.isDown){
    //this.animations.play('run');
    this.y += this.speed;
  } else if (this.controls.left.isDown){
    //this.animations.play('run');
    this.x -= this.speed;
  } else if (this.controls.right.isDown){
    //this.animations.play('run');
    this.x += this.speed;
  }
}

module.exports = Player;