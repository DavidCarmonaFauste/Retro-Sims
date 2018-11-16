'use strict';

var CreationScene = {
    create: function () {
        console.log('You are in creation scene');
        for (var i = 1; i < 11; i++) {
            var character = this.game.add.sprite(
            this.game.world.centerX, this.game.world.centerY, 'Sim'+i);
            }
        character.anchor.setTo(0.5, 0.5);
        character.scale.setTo(0.75, 0.75);

    },

    update: function(){

    }
  };






module.exports = CreationScene;