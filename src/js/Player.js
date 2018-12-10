function Player(game, map, sprite, x, y, name, intelligence, fitness, charisma, money, job) {
  //Mapa
  this.map = map;

  Phaser.Sprite.call(this, game, x, y, sprite);

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.3, 0.3);

  //Necesidades
  this.needs = {
    pee: 10,
    hunger: 10,
    fatigue: 10
  };
  //Atributos
  this.stats = {
    intelligence: intelligence,
    fitness: fitness,
    charisma: charisma
  };
  //Dinero
  this.money = 10000;
  //Trabajo
  this.job = 'unemployed';
  //Nombre
  this.name = name;
  //Activo
  this.active = true; //indica si el player se puede mover (no está en modo edición/conversación...)
  //Vel. de movimiento
  this.speed = 300; //velocidad de movimiento
  //Dirección de movimiento
  this.dir = new Phaser.Point(0, 1)
  //Animaciones
  this.animations.add('idle', [0, 1], 1, true);

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
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


//Métodos
Player.prototype.update = function () {
  if (this.active) //Comprueba que player no está en modo edición/conversación
    this.move();

  if (this.controls.space.isDown) {
    this.interact(this.map);
  }

  if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
    this.map.toggleWalls();
  }
};

Player.prototype.move = function () {
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;

  if (this.controls.up.isDown) { //UP
    //this.animations.play('up');
    this.body.velocity.y -= this.speed;
    this.dir.x = 0; this.dir.y = -1;
  } else if (this.controls.down.isDown) { //DOWN
    //this.animations.play('down');
    this.body.velocity.y += this.speed;
    this.dir.x = 0; this.dir.y = 1;
  } else if (this.controls.left.isDown) { //LEFT
    //this.animations.play('left');
    this.body.velocity.x -= this.speed;
    this.dir.x = -1; this.dir.y = 0;
  } else if (this.controls.right.isDown) { //RIGHT
    //this.animations.play('right');
    this.body.velocity.x += this.speed;
    this.dir.x = 1; this.dir.y = 0;
  }

  //console.log(this.dir.x + " " + this.dir.y);
}

Player.prototype.interactWithSink = function () {
  console.log("Washing my hands");
}

Player.prototype.interactWithToilet = function () {
  console.log("Peeing");
}

Player.prototype.interactWithFridge = function () {
  console.log("Getting something to eat");
}

Player.prototype.interactWithMailbox = function () {
  console.log("Checking my mails");
}

Player.prototype.interactWithBed = function () {
  console.log("Going to sleep, good night");
}

Player.prototype.interact = function (map) {
  var type = map.getTileType(this);

  switch (type) {
    case "sink":
      this.interactWithSink();
      break;
    case "toilet":
      this.interactWithToilet();
      break;
    case "fridge":
      this.interactWithFridge();
      break;
    case "mailbox":
      this.interactWithMailbox();
      break;
    case "bed":
      this.interactWithBed();
      break;
    default:
      type = "Not an object"
      break;
  }

  if (type != "Not an object")
    this.game.input.keyboard.reset(true);

}

Player.prototype.getDir = function () {
  return this.dir;
}

module.exports = Player;