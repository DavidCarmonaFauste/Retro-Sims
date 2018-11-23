function Furniture(game, sprite, x, y, interactive, type, name) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.anchor.setTo(0.5,0.5);

    this.interactive = interactive;
    this.type = type;
    this.name = name;

    game.add.existing(this);
}

Furniture.prototype = Object.create(Phaser.Sprite.prototype);
Furniture.prototype.constructor = Furniture;


//Métodos