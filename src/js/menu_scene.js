'use strict';

var MenuScene = {
    create: function () {
        var logo = this.game.add.sprite(
            this.game.world.centerX, this.game.world.centerY - 90, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(0.75, 0.75);

        //botón para ir a crear personaje
        addButton(this.game, 'Create a character',
            this.game.world.centerX, this.game.world.centerY + 120,
            300, 70,
            function () {
                this.game.state.start('characterCreation');
            }
        )

    },

    update: function () {

    }
};

function addButton(game, string, x, y, w, h, callback) {
    var button = game.add.button(x, y, 'paredTop', callback, this, 2, 1, 0);

    button.anchor.setTo(0.5, 0.5);
    button.width = w;
    button.height = h;

    var txt = game.add.text(button.x, button.y, string, {
        font: '30px Arial',
        fill: '#000',
        align: 'center'
    });
    txt.anchor.setTo(0.5, 0.5);
}


module.exports = MenuScene;