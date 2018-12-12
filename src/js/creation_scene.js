'use strict';

var CreationScene = {
    // skins: null,
    // skinIndex: null,
    // params: null,
    // txt: null,
    // submenus: [],
    // menuIndex: 0,

    create: function () {
        this.skins = [];
        this.numSkins = 11;
        this.skinIndex = 1;
        this.params = {};
        this.submenus = ['name', 'skin', 'gender', 'create'];
        this.right = 1;
        this.left = -1;
        this.index = 1;
        this.moveCamera = false;
        this.positionMoved = 0;
        this.name = '';

        this.txtApperance = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 200, 'arcadeGreenFont', 'Choose your appearance', 40);
        this.txtApperance.anchor.setTo(0.5, 0.5);
        this.txtApperance.align = "center";

        var graySquare = this.game.add.image(
            0, this.game.world.centerY, 'paredTop');
        graySquare.anchor.setTo(0.5, 0.5);
        graySquare.scale.setTo(70, 5);

        for (var i = 1; i < this.numSkins; i++) {
            this.skins[i] = this.game.add.sprite(
                this.game.world.centerX + (i - 1) * 150, this.game.world.centerY, 'sim' + i);
            this.skins[i].anchor.setTo(0.5, 0.5);
            this.skins[i].scale.setTo(0.5, 0.5);
        }

        var arrow = this.game.add.image(
            this.game.world.centerX, this.game.world.centerY - 125, 'arrow');
        arrow.anchor.setTo(0.5, 0.5);
        arrow.scale.setTo(0.25, 0.25);

        this.game.world.setBounds(0, 0, 2000, 2000);

        var continueTxt = this.game.add.bitmapText(450, 550, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
        continueTxt.fixedToCamera = true;

        this.txtName = this.game.add.bitmapText(400, 800, 'arcadeGreenFont', 'Choose your name', 40);
        this.txtName.anchor.setTo(0.5, 0.5);
        this.txtName.align = "center";

        var nameTxt = this.game.add.bitmapText(400, 1000,'arcadeWhiteFont', '>'+'<', 40);
        nameTxt.anchor.setTo(0.5, 0.5);
        nameTxt.align = "center";
        return this.skins;
    },

    update: function () {
        this.checkInput(); // this.game, this.skins, this.skinIndex, this.params);
    },


    //Métodos
    moveCamera: function(){

    },

    checkInput: function () { // game, this.skins, this.skinIndex, params) {
        if(this.moveCamera && this.positionMoved < 600){
            this.game.camera.y+=6;
            this.positionMoved+=6;
            console.log(this.positionMoved);
            if(this.positionMoved >= 600){
                this.moveCamera = false;
                this.positionMoved = 0;
            }
        } else{

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.skinIndex < 10) {
                this.moveSkins(this.right);
                this.skinIndex++;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.skinIndex > 1) {
                this.moveSkins(this.left);
                this.skinIndex--;
            }    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                this.moveCamera = true;
                this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
            } 
            else {
                if(this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)){
                    name = name.substring(0, name.length -1);;
                    console.log(name);
                    this.game.input.keyboard.reset(true); //resetea el teclado para evitar borrar muchas de golpe
                    this.printText(name);
                }
                else{
                    this.game.input.keyboard.onPressCallback = function(e){
                        if (!this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){ //para eviar que se pongan espacios
                            name += e;
                            CreationScene.printText(name);
                        }
                    };
                }
            }
    }
        this.game.debug.cameraInfo(this.game.camera, 32, 32);            //this.skinSelected();
    },

    printText: function(name){
        this.game.world.removeAll();
        var continueTxt = this.game.add.bitmapText(450, 1150, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
        this.txtName = this.game.add.bitmapText(400, 800, 'arcadeGreenFont', 'Choose your name', 40);
        this.txtName.anchor.setTo(0.5, 0.5);
        this.txtName.align = "center";
        console.log(name);
        var nameTxt = this.game.add.bitmapText(400, 1000,'arcadeWhiteFont', '>' +  name +  '<', 40);
        nameTxt.anchor.setTo(0.5, 0.5);
        nameTxt.align = "center";
    },

    moveSkins: function (dir) {
        //dir: izq = -1, der = 1
        var scroll = this.game.add.audio('scroll');
        scroll.play();

        for (var i = 1; i < this.numSkins; i++) {
            this.skins[i].x -= 150 * dir;
        }

        this.index = this.index + (1 * dir);
        this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
    },

    skinSelected: function () {
        this.game.select.play();
        this.creationCompleted();
    },

    creationCompleted: function () {
        this.params.simIndex = this.index;

        var sound = this.game.add.audio('creationCompleted');
        sound.play();

        localStorage.setItem("playerData", JSON.stringify(this.params));

        this.game.state.start('play'); //Empieza playScene
    }

};

module.exports = CreationScene;