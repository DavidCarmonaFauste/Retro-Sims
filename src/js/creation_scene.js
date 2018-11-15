'use strict';

var CreationScene = {
    create: function () {
        console.log('You are in creation scene');
        for (int i = 1; i < 11; i++) {
            var character = this.game.add.sprite(
            this.game.world.centerX, this.game.world.centerY, 'Sim'+i);
            }
        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(0.75, 0.75);

    },

    update: function(){

    }
  };






module.exports = CreationScene;