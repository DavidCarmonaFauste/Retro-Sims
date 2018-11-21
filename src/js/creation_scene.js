'use strict';

var character;
var election;

var CreationScene = {

    create: function () {
        election = 1;
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
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && election < 10) {
            for (var i = 1; i < 11; i++) {
                character[i].x -= 150;
            }
            election ++;
            this.game.input.keyboard.reset(true);
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && election > 1) {
            for (var i = 1; i < 11; i++) {
                character[i].x += 150;
            }
            election--;
            this.game.input.keyboard.reset(true);
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            console.log('sprite = ' + election);
            this.game.state.start('play',{player:character[election]});
        }
    }
};






module.exports = CreationScene;