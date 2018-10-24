var Entity = require('./Entity');

function Neighbour(friendship, sprite, game){
    this.friendship = friendship;
    Entity.call(this,1,1, sprite, game);
  }
  
  Neighbour.prototype = Object.create(Entity.prototype);
  Neighbour.prototype.constructor = Neighbour;

  module.exports = Neighbour;