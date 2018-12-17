var Entity = require('./Entity');

function Neighbour(game, sprite, x, y) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.3, 0.3);

  this.friendship = 0;
  this.speed = 5;

  this.game = game;

  this.states = ['walking', 'idle', 'talking', 'exit'];
  this.actualState = 'walking';
  game.add.existing(this); //añadir el sprite al game
}

Neighbour.prototype = Object.create(Phaser.Sprite.prototype);
Neighbour.prototype.constructor = Neighbour;

//Métodos
Neighbour.prototype.update = function () {
  if (this.actualState == 'walking') {
    this.walkTowardsCenter();
  }
};

Neighbour.prototype.walkTowardsCenter = function () {
  if (this.x < this.game.initialX) {
    this.x += this.speed;
  }
  else
    this.actualState = 'idle';
}

module.exports = Neighbour;