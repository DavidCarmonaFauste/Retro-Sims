var Entity = require('./Entity');

function Neighbour(friendship, sprite, game) {
  Entity.call(this, 1, 1, sprite, game);
  this.friendship = friendship;

}

Neighbour.prototype = Object.create(Entity.prototype);
Neighbour.prototype.constructor = Neighbour;

module.exports = Neighbour;