'use strict';

var MenuScene = {
    create: function () {
        //Reproducir el main theme
        this.game.theme.loop = true; //loop
        this.game.theme.volume = 0.075; //volumen
        this.game.theme.play();

        var logo = this.game.add.sprite(
            this.game.world.centerX, this.game.world.centerY - 90, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(0.75, 0.75);

        //botón para ir a crear personaje
        addButton(this.game, 'Create a character',
            this.game.world.centerX, this.game.world.centerY + 120,
            550, 70,
            function () {
                this.game.tap.volume = 0.1;
                this.game.tap.play();
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

    var txt = game.add.bitmapText(button.x, button.y, 'arcadeBlackFont', string, 40);
    txt.anchor.setTo(0.5, 0.5);
    txt.align = "center";
}


module.exports = MenuScene;