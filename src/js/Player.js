var Entity = require('./Entity');

function Player (pee, hunger, fatigue, intelligence, fitness, charisma, money, job, dimX,  dimY, sprite, game){
    this.needs = new Needs(pee, hunger, fatigue);
    this.stats = new Stats(intelligence, fitness, charisma);
    this.money = money;
    this.job = job;
  
    Entity.call(this,1,1, sprite, game);
  }


  module.exports = Player;