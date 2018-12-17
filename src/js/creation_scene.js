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
        this.state = this.submenus[1];
        this.intelligence = 0;
        this.fitness = 0;
        this.charisma = 0;
        this.maxpoints = 5;     //puntos a repartir
        this.selectedStat = 'intelligence';
        this.remainingPoints = this.maxpoints;  //puntos que quedan por repartir

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
        this.txt;
        this.txtName = this.game.add.bitmapText(400, 800, 'arcadeGreenFont', 'Choose your name', 40);
        this.txtName.anchor.setTo(0.5, 0.5);
        this.txtName.align = "center";

        var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + '<', 40);
        nameTxt.anchor.setTo(0.5, 0.5);
        nameTxt.align = "center";

        return this.skins;
    },

    update: function () {
        this.checkInput(); // this.game, this.skins, this.skinIndex, this.params);
    },


    //Métodos
    moveCamera: function () {

    },

    checkInput: function () { // game, this.skins, this.skinIndex, params) {
        if (this.moveCamera && this.positionMoved < 600) {
            this.game.camera.y += 20;
            this.positionMoved += 20;
           // console.log(this.positionMoved);
            if (this.positionMoved >= 600) {
                this.moveCamera = false;
                this.positionMoved = 0;
            }
        } else {

            if (this.state == this.submenus[1]) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.skinIndex < 10) {
                    this.moveSkins(this.right);
                    this.skinIndex++;
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.skinIndex > 1) {
                    this.moveSkins(this.left);
                    this.skinIndex--;
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    this.moveCamera = true;
                    this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
                    this.state = this.submenus[0];
                }
            } else if(this.state == this.submenus[0]){
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)) {
                    name = name.substring(0, name.length - 1);
                    var sound = this.game.add.audio('keyboardBackspace');
                    sound.volume = 0.2;
                    sound.play();
                    //console.log(name);
                    this.game.input.keyboard.reset(true); //resetea el teclado para evitar borrar muchas de golpe
                    this.printText(name);
                } else {
                    this.input.keyboard.onPressCallback = function (e) {
                        if (!(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) && name.length <20) { //para eviar que se pongan espacios
                            name += e;
                            if(Math.random() > 0.5)
                                var sound = this.game.add.audio('keyboard1');
                            else 
                                var sound = this.game.add.audio('keyboard2');
                                sound.volume = 0.2;
                            sound.play();
                            CreationScene.printText(name);
                        }
                    };
                } 

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) { //pasamos al submenú 3
                    this.game.world.removeAll();
                    var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + name + '<', 40);
                    this.centerSprite(nameTxt);
                    this.txt = this.game.add.bitmapText(450, 550, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
                    this.txt.fixedToCamera = true;
                    this.moveCamera = true;
                    this.game.input.keyboard.reset(true); //resetea el teclado para moverse de uno en uno
                    this.state = this.submenus[2];
                }
            } else if(this.state == this.submenus[2]){
                //subir o bajar entre stats
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.selectedStat != 'intelligence') {
                    if(this.selectedStat == 'fitness')  this.selectedStat = 'charisma'; else this.selectedStat = 'intelligence';
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.selectedStat != 'fitness') {
                    if(this.selectedStat == 'intelligence') this.selectedStat = 'charisma'; else this.selectedStat = 'fitness';
                }else 
                //sumar o restar uno a las stats
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.remainingPoints > 0) {
                    this.add1();
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.sub1();
                }

                this.printStats(this.remainingPoints);   //pinta en pantalla

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {

                    this.creationCompleted();
                }
                this.game.input.keyboard.reset(true); //resetea el teclado
            }
        }
        //this.game.debug.cameraInfo(this.game.camera, 32, 32); //this.skinSelected();
    },

    add1: function(){
        console.log(this.selectedStat);
        if(this.selectedStat == 'fitness')
            this.fitness++;
        else if(this.selectedStat == 'charisma')
            this.charisma++;
        else if(this.selectedStat == 'intelligence')
            this.intelligence++;

            var sound = this.game.add.audio('select');
        sound.volume = 0.2;
        sound.play();
        this.remainingPoints--;

    },

    sub1: function(){
        console.log(this.selectedStat);
        var sound = this.game.add.audio('select');
        sound.volume = 0.2;

        if(this.selectedStat == 'fitness' && this.fitness > 0){
            this.fitness--;
            this.remainingPoints++;
            sound.play();
        }
        else if(this.selectedStat == 'charisma' && this.charisma > 0){
            this.charisma--;
            this.remainingPoints++;
            sound.play();
        }
        else if(this.selectedStat == 'intelligence' && this.intelligence > 0){
            this.intelligence--;
            this.remainingPoints++;
            sound.play();
        }
    },
    centerSprite: function(s){
        s.anchor.setTo(0.5, 0.5);
        s.align = "center";
    },

    printStats: function(remainingPoints){
        this.game.world.removeAll();

        if(this.selectedStat == 'intelligence') var arrow  = 1440;
        else if(this.selectedStat == 'charisma') var arrow = 1540;
        else if(this.selectedStat == 'fitness')var arrow  = 1640;
        var selection = this.game.add.bitmapText(500, arrow, 'arcadeWhiteFont', '<', 40);
        selection.anchor.setTo(0, 1);
        this.centerSprite(selection);
        var remainingTxt = this.game.add.bitmapText(400, 1375, 'arcadeWhiteFont', 'Remaining points: ' + remainingPoints , 20);
        this.centerSprite(remainingTxt);
        var statsTxt = this.game.add.bitmapText(400, 1300, 'arcadeGreenFont', 'Choose your initial stats' , 40);
        this.centerSprite(statsTxt);
        var intelligenceTxt = this.game.add.bitmapText(400, 1450, 'arcadeGreenFont', 'Intelligence: ', 30);
        intelligenceTxt.anchor.setTo(1, 1);
        var charismaTxt = this.game.add.bitmapText(400, 1550, 'arcadeGreenFont', 'Charisma: ', 30);
        charismaTxt.anchor.setTo(1, 1);
        var fitnessTxt = this.game.add.bitmapText(400, 1650, 'arcadeGreenFont', 'Fitness: ', 30);
        fitnessTxt.anchor.setTo(1, 1);
        var i = this.game.add.bitmapText(400, 1450, 'arcadeWhiteFont', ''+this.intelligence, 30);
        i.anchor.setTo(0, 1);
        var f = this.game.add.bitmapText(400, 1550, 'arcadeWhiteFont', ''+this.charisma, 30);
        f.anchor.setTo(0, 1);
        var c = this.game.add.bitmapText(400, 1650, 'arcadeWhiteFont',''+ this.fitness, 30);
        c.anchor.setTo(0, 1);
        var continueTxt = this.game.add.bitmapText(450, 1750, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
    },

    printText: function (name) {
        this.game.world.removeAll();
        var continueTxt = this.game.add.bitmapText(450, 1150, 'arcadeGreenFont', 'Press \'Space\' to continue', 20);
        this.txtName = this.game.add.bitmapText(400, 800, 'arcadeGreenFont', 'Choose your name', 40);
        this.centerSprite(this.txtName);
        //console.log(name);
        var nameTxt = this.game.add.bitmapText(400, 1000, 'arcadeWhiteFont', '>' + name + '<', 40);
        this.centerSprite(nameTxt);

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
        this.params.name = name;
        this.params.intelligence = this.intelligence;
        this.params.charisma = this.charisma;
        this.params.fitness = this.fitness;

        var sound = this.game.add.audio('creationCompleted');
        sound.play();

        localStorage.setItem("playerData", JSON.stringify(this.params));

        this.game.state.start('play'); //Empieza playScene
    }

};

module.exports = CreationScene;