'use strict';

//requires
//var Neighbour = require('./Neighbour');


//Función principal
var PlayScene = {
  create: function (data) {
    //var logo = this.game.add.sprite(
    //this.game.world.centerX, this.game.world.centerY, 'logo');
    //logo.anchor.setTo(0.5, 0.5);

    var player = new Player(0, 0, 0, 2, 2, 2, 20000, 'desempleado', 1, 1, data.player, this.game)
    var vecino = new Neighbour(0, 'logo', this.game);
    console.log(vecino.x + ' ' + vecino.y);
  }
};


function Entity(dimX, dimY, sprite, game) {
  this.dimX = dimX;
  this.dimY = dimY;

  Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, sprite);
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;

function Neighbour(friendship, sprite, game) {
  this.friendship = friendship;
  Entity.call(this, 1, 1, sprite, game);
}

Neighbour.prototype = Object.create(Entity.prototype);
Neighbour.prototype.constructor = Neighbour;

function Needs(pee, hunger, fatigue) {
  this.pee = pee;
  this.hunger = hunger;
  this.fatigue = fatigue;
}

function Stats(intelligence, fitness, charisma) {
  this.intelligence = intelligence;
  this.fitness = fitness;
  this.charisma = charisma;
}

function Player(pee, hunger, fatigue, intelligence, fitness, charisma, money, job, dimX, dimY, sprite, game) {
  this.needs = new Needs(pee, hunger, fatigue);
  this.stats = new Stats(intelligence, fitness, charisma);
  this.money = money;
  this.job = job;

  Entity.call(this, 1, 1, sprite, game);
}

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

function Furniture(interactive, type, name, dimX, dimY, sprite, game) {
  this.interactive = interactive;
  this.type = type;
  this.name = name;

  Entity.call(this, dimX, dimY, sprite, game);
}


module.exports = PlayScene;