'use strict';

var MenuScene = {
    create: function () {
        //Recoge los datos de jugador guardados en localstorage (si los hay)
        this.playerData = localStorage.getItem("playerData");
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
            }, 40);

        //Mostrar el botón de Continuar si encuentra datos guardados
        if (this.playerData != undefined) {
            this.playerParams = JSON.parse(this.playerData);

            addButton(this.game, 'Play again as ' + this.playerParams.name,
                this.game.world.centerX, this.game.world.centerY + 200,
                550, 70,
                function () {
                    this.game.tap.volume = 0.1;
                    this.game.tap.play();
                    this.game.state.start('play');
                }, 22);
        }

    },

    update: function () {

    }
};

function addButton(game, string, x, y, w, h, callback, fontSize) {
    var button = game.add.button(x, y, 'paredTop', callback, this);

    button.anchor.setTo(0.5, 0.5);
    button.width = w;
    button.height = h;

    var txt = game.add.bitmapText(button.x, button.y, 'arcadeBlackFont', string, fontSize);
    txt.anchor.setTo(0.5, 0.5);
    txt.align = "center";
}


module.exports = MenuScene;