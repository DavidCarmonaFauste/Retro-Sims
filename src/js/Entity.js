function Entity(dimX, dimY, sprite, game) {
    // this.dimX = dimX;
    // this.dimY = dimY;

    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, sprite);
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
Entity.prototype.constructor = Entity;



module.exports = Entity;