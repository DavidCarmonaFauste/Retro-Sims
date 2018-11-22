'use strict';
var Player = require('./Player');

var CreationScene = {
    character: null,
    election: null,
    params: null,


    create: function () {
        this.character = [];
        this.election = 1;
        this.params = {};

        for (var i = 1; i < 11; i++) {
            this.character[i] = this.game.add.sprite(
                this.game.world.centerX + (i - 1) * 150, this.game.world.centerY, 'sim' + i);
            this.character[i].anchor.setTo(0.5, 0.5);
            this.character[i].scale.setTo(4, 4);
        }

        var arrow = this.game.add.image(
            this.game.world.centerX, this.game.world.centerY - 125, 'arrow');
        arrow.anchor.setTo(0.5,0.5);
        arrow.scale.setTo(0.25,0.25);

        return this.character;
    },

    update: function () {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.election < 10) {
            for (var i = 1; i < 11; i++) {
                this.character[i].x -= 150;
            }
            this.election ++;
            this.game.input.keyboard.reset(true);
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.election > 1) {
            for (var i = 1; i < 11; i++) {
                this.character[i].x += 150;
            }
            this.election--;
            this.game.input.keyboard.reset(true);
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            // var newPlayer = new Player(
            //     this.game, this.character[this.election].key,
            //     this.game.world.centerX, this.game.world.centerX,
            //     'jugador', 10, 10, 10);

            this.params.sprite = this.character[this.election].key;

            console.log(this.params);

            this.game.state.start('play', true, true, this.params);
        }
    }
};






module.exports = CreationScene;