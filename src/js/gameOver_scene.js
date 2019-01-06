'use strict';

var GameOverScene = {
    //CREATE
    create: function () {
        //tumba
        var grave = this.game.add.image(
            this.game.world.centerX - 100, this.game.world.centerY, 'grave');
        grave.anchor.setTo(0.5, 0.5);
        grave.scale.setTo(0.25, 0.25);


        this.camera.setPosition(grave.x - 280, grave.y - 300);


        //texto de la lápida
        var graveText = this.game.add.bitmapText(grave.x, grave.y + 20, 'arcadeBlackFont',
        this.game.gameOverData.name + '\n\nYour ' + this.game.gameOverData.numFriends 
        + ' friends\nwill not forget you.\n\n' + ((this.game.gameOverData.days%30)+1) + '/'+ (Math.max(1,this.game.gameOverData.days%30)%12) +'/19XX', 20);
        //La fecha de la lápida refleja el día en el que moriste
        graveText.anchor.setTo(0.5, 1);
        graveText.align = "center";

        //texto de la derecha
        var deathCauseString = '';
        switch (this.game.gameOverData.deathCause) {
            case 'pee':
                deathCauseString = "storing too much pee\nin your\nsim's body.";
                break;
            case 'hunger':
                deathCauseString = "starving.";
                break;
            case 'fatigue':
                deathCauseString = " exhaustion.\n\nSleeping at least\n8 hours per day\nis recommended unless\nyou are a\nvideogame developer.";
                break;
            case 'money':
                deathCauseString = "losing all your money,\nwhich in RetrosimCity means DEATH.";
                break;
        }

        var extraText = this.game.add.bitmapText(grave.x + 350, grave.y + 20, 'arcadeWhiteFont',
            'You died from\n' + deathCauseString +
            '\n\nYou lived for\n' + this.game.gameOverData.days + ' days' +
            '\n\nYou had\n' + this.game.gameOverData.money + ' EUROS', 20);
        extraText.anchor.setTo(0.5, 1);
        extraText.align = "center";

        //Botón para ir al menú
        var menuButton = this.addButton('nextButton', '',
            grave.x + 450, grave.y + 225,
            64, 64,
            function () {
                this.game.state.start('menu');
            });

    },

    /*render: function(){
        this.game.debug.spriteInfo(this.hud_mainBox, 32, 32);
    },*/


    addButton: function (sprite, string, x, y, w, h, callback) {
        var button = this.game.add.button(x, y, sprite, callback, this, 2, 1, 0);

        button.anchor.setTo(0.5, 0.5);
        button.width = w;
        button.height = h;

        var txt = this.game.add.bitmapText(button.x, button.y, 'arcadeBlackFont', string, 20);
        txt.anchor.setTo(0.5, 0.5);
        txt.align = "center";
        txt.fixedToCamera = true;

        return button;
    }
};

module.exports = GameOverScene;