'use strict';

var character;

var CreationScene = {

    create: function () {
        character = [];
        for (var i = 1; i < 11; i++) {
            character[i] = this.game.add.sprite(
                this.game.world.centerX + (i - 1) * 150, this.game.world.centerY, 'Sim' + i);
            character[i].anchor.setTo(0.5, 0.5);
            character[i].scale.setTo(4, 4);
        }
        return character;
    },

    update: function () {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            for (var i = 1; i < 11; i++) {
                character[i].x -= 150;
            }
            this.game.input.keyboard.reset(true);
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            for (var i = 1; i < 11; i++) {
                character[i].x += 150;
            }
            this.game.input.keyboard.reset(true);
        }
    }
};






module.exports = CreationScene;