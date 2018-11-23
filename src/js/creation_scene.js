'use strict';

var CreationScene = {
    skins: null,
    skinIndex: null,
    params: null,
    right: 1,
    left: -1,


    create: function () {
        this.skins = [];
        this.skinIndex = 1;
        this.params = {}; //JSON.parse(this.game.cache.getText('playerData'));


        for (var i = 1; i < 11; i++) {
            this.skins[i] = this.game.add.sprite(
                this.game.world.centerX + (i - 1) * 150, this.game.world.centerY, 'sim' + i);
            this.skins[i].anchor.setTo(0.5, 0.5);
            this.skins[i].scale.setTo(4, 4);
        }

        var arrow = this.game.add.image(
            this.game.world.centerX, this.game.world.centerY - 125, 'arrow');
        arrow.anchor.setTo(0.5, 0.5);
        arrow.scale.setTo(0.25, 0.25);

        return this.skins;
    },

    update: function () {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.skinIndex < 10) {
            move(this.game, this.skins, this.skinIndex, this.right);
            this.skinIndex++;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.skinIndex > 1) {
            move(this.game, this.skins, this.skinIndex, this.left);
            this.skinIndex--;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            selection(this.game, this.params, this.skinIndex);
        }
    },


};

//Métodos

function move(game, skins, index, dir) { //dir: izq = -1, der = 1
    for (var i = 1; i < 11; i++) {
        skins[i].x -= 150 * dir;
    }
    index = (index + 1) * dir;
    game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
}


function selection(game, params, index) {
    params.simIndex = index;

    localStorage.setItem("playerData", JSON.stringify(params));

    game.state.start('play'); //Empieza playScene
}

module.exports = CreationScene;