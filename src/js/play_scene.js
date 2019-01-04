'use strict';

//requires de las clases
var Neighbour = require('./Neighbour');
var Player = require('./Player');
var Map = require('./Map');


//Función principal
var PlayScene = {
  player: null,
  playerParams: null,
  arrow: null,

  init: function () {
    // var background = this.game.add.image(
    //  0, 0, 'background');

    //Recibe los datos del jugador guardados en localStorage
    this.playerData = localStorage.getItem("playerData");
    this.playerParams = JSON.parse(this.playerData);
    console.log(this.playerParams);
  },

  //CREATE
  create: function () {
    /*this.game.input.keyboard.onPressCallback = function (e) {
      if (!this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { //para eviar que se pongan espacios
          console.log('pues si');
      }
    }*/

    //Valores iniciales
    this.game.initialX = this.game.world.centerX + 910, this.game.initialY = 3500;
    this.needsRate = 10; //tiempo que tiene que pasar para reducir todas las necesidades (en minutos del juego)
    this.neighbourSpawnRate = 5;
    this.spawningNeighbour = false; //Indica si se está "spawneando" un vecino para no spawnear otro
    var NUM_NEIGHBOURS = 10; //número total de vecinos
    this.maleNames = [ //Array de nombres masculinos
      'Troy James',
      'Kevin Hudson',
      'Liu Xun',
      'Ronan Barnes',
      'Adrián Rodríguez',
      'Olly Davidson',
      'Sergio Cicerón',
      'Haris Parker',
      'Angus Porter',
      'Khalid Howard',
      'Dexter Lowe',
      'Lucas Correa',
      'Yao Zheng',
      'David Carmona',
      'Mario Tabasco'
    ];
    this.femaleNames = [ //Array de nombres femeninos
      'Cecilia Reyes',
      'Carmen Vega',
      'Yi Jie',
      'Teresa Villa',
      'Sofia Lewis',
      'Joanna White',
      'Rosie Collins',
      'Penelope Hicks',
      'Hollie Thompson',
      'Melody Schmidt',
      'Hannah Kennedy',
      'Kate Jackson',
      'Mei Ling'
    ];
    this.timeSpeed = 500; //La velocidad a la que pasan los minutos del juego (1000 = 1 minuto por segundo)
    this.timeCounter = {
      hour: 12,
      minute: 0
    };
    this.game.time.events.loop(this.timeSpeed, this.updateTimeCounter, this);

    //Información que se muestra en el hud:
    // 0: NEEDS
    // 1: YOU
    // 2: FRIENDS
    // Empieza con NEEDS
    this.selectedHUD = 0;
    //Tiempo del juego


    this.debug = false; //Poner a true para activar los debugs de player y del tilemap
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.editMode = false;

    //Tilemap
    this.map = new Map(this);

    this.map.objectsLayer.debug = this.debug; //debug del tilemap

    //Creación del jugador
    this.player = new Player(
      this.game, this.map, 'sim' + this.playerParams.simIndex,
      this.game.initialX, this.game.initialY,
      this.playerParams.name, this.playerParams.intelligence, this.playerParams.fitness, this.playerParams.charisma);
    this.map.createTopLayers(); //Crea las capas del tilemap que están sobre el jugador
    this.camera.follow(this.player);

    //  VECINOS
    this.neighboursGroup = this.game.add.group();

    for (var i = 0; i < NUM_NEIGHBOURS; i++) {
      var n = this.randomizeNeighbour();
      this.neighboursGroup.add(n);
    }
    this.neighboursGroup.callAll('kill');


    /*this.neig = this.neighboursGroup.getRandom();
    this.neig.revive();*/

    this.createHUD();


    this.game.input.mouse.capture = true;
  },

  //UPDATE
  update: function () {
    //Colisiones
    this.game.physics.arcade.collide(this.player, this.map.groundWallLayer);
    this.game.physics.arcade.collide(this.player, this.map.objectsLayer);
    //Desactiva las paredes si el jugador está en la casa
    if (this.map.isInside(this.player.x, this.player.y)) {
      this.map.setWalls(false);
    } else
      this.map.setWalls(true);



    //INTERACCIÓN CON VECINOS
    /*if (this.checkPlayerOverlap(this.player, this.neig)) {
       this.neig.setTalking(true);
       if (this.selectedHUD == 2)
         this.updateFriendsHUD();
     }*/
    if (this.neig2 != undefined && this.checkPlayerOverlap(this.player, this.neig2)) {
      this.neig2.setTalking(true);
      if (this.selectedHUD == 2)
        this.updateFriendsHUD();
    }

    //this.player.updateFriendship(this.neig);
    if (this.neig2 != undefined)
      this.player.updateFriendship(this.neig2);


    //Spawn de vecinos
    if (!this.spawningNeighbour && this.timeCounter.minute % this.neighbourSpawnRate == 0) {
      this.spawningNeighbour = true;
      this.spawnSim();
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      /*this.spawnSim(4);
      this.game.input.keyboard.reset(true);
      this.player.numFriends++;*/
      this.spawnSim();
    }
    //////////////////////////////

    //Activar el modo edición
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
      this.editMode = true;

    }

    if (this.editMode && this.game.input.activePointer.leftButton.isDown) {
      /*this.furni = this.game.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, 'furni');
      console.log(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
      this.furni.fixedToCamera = true;
      this.furni.scale.setTo(0.25, 0.25);
      this.furni.anchor.setTo(0.5, 0.5);
      this.player.money -= 75;*/

    }

    this.updateNeeds();

    this.hud_playerMoney.setText(this.player.money);
    this.timeCounterText.setText(this.getTimeText());

  },

  //Actualiza la longitud de las barras de necesidad del hud y reduce todas las necesidades cada X minutos(minutos del juego)
  updateNeeds: function () {
    //reduce los puntos de necesidad cada needsRate minutos del juego
    if (this.timeCounter.minute % this.needsRate == 0) {
      this.player.updateNeeds();
    }

    //Actualiza las barras del hud
    this.hungerBar.width = this.player.needs.hunger / this.player.maxNeed * this.barWidth;
    this.sleepBar.width = this.player.needs.fatigue / this.player.maxNeed * this.barWidth;
    this.toiletBar.width = this.player.needs.pee / this.player.maxNeed * this.barWidth;
  },

  //actualiza el contador de tiempo adecuadamente
  updateTimeCounter: function () {
    if (this.timeCounter.minute < 59)
      this.timeCounter.minute++;
    else {
      if (this.timeCounter.hour < 23)
        this.timeCounter.hour++;
      else
        this.timeCounter.hour = 0;
      this.timeCounter.minute = 0;
    }
  },


  //RENDER
  render: function () {
    //Debugs
    if (this.debug) {
      this.game.debug.spriteInfo(this.neig, 32, 32);
      this.game.debug.body(this.player);
    }
    //this.game.debug.spriteInfo(this.hud_mainBox, 32, 80);
    //this.game.debug.text("x: "+ this.intelligenceText /*+ "   \ny: " + this.intelligenceText.y*/, 32, 32);
  },


  checkPlayerOverlap: function (player, sim) {
    var playerBounds = player.getBounds();
    var simBounds = sim.getBounds();

    return Phaser.Rectangle.intersects(playerBounds, simBounds);
  },

  //Devuelve un número aleatorio entre [min, max]
  randomNumber: function(min,max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  },


  //Genera un vecino con nombre y apariencia aleatoria
  randomizeNeighbour: function () {
    var n;
    var name;
    var skinIndex = this.randomNumber(1,this.game.numSkins - 1); //skin random

    if (Math.random() > 0.5)
      name = this.maleNames[this.randomNumber(0,this.maleNames.length)]; //Nombre masculino
    else
      name = this.femaleNames[this.randomNumber(0,this.femaleNames.length)]; //Nombre femenino


    n = new Neighbour(this.game, 'sim' + skinIndex,
      0, this.game.initialY, name);

    return n;
  },


  //Revive un vecino del grupo de vecinos y lo coloca en (0, rnd(initialY+1, initialY+150))
  spawnSim: function () {

    var i = 0;
    do {
      var sim = this.neighboursGroup.getRandom();
      i++;
    }
    while (i < 5 && sim.alive);


    if (!sim.alive) { //Si ha encontrado uno muerto
      sim.revive();
      sim.x = 0;
      sim.y = this.game.initialY + Math.floor((Math.random() * 150) + 1);
      console.log(sim.name + ": HI!");
    } else //Si no, todos están ya en el juego
      console.log("Everyone is alive");

    //timer para poner spawningNeighbour a false y que se puedan spawnear más vecinos
    var timer = this.game.time.create(true);
    timer.loop(1000, function () {
      this.spawningNeighbour = false;
      timer.stop();
    }, this);
    timer.start();

    /*
    this.neig2 = new Neighbour(this.game, 'sim' + index, 0, this.game.initialY + 60, 'Clara Lawson');
    this.player.setFriend(this.neig2, 1);
    */
  },


  ////////////////////////////////////////////////////////////
  //                        INTERFAZ                       //
  //////////////////////////////////////////////////////////
  createHUD: function () {
    //main hud box
    this.hud_mainBox = this.game.add.sprite(window.innerWidth - 400, window.innerHeight + 120, 'hudBox');
    this.hud_mainBox.anchor.set(0.5, 0.5);
    this.hud_mainBox.scale.set(1, 0.5);
    this.hud_mainBox.fixedToCamera = true;

    //dimensiones y posiciones del HUD 
    this.hud_x = 150;
    this.hud_y = 485;
    this.hud_limitX = 600;
    this.hud_limitY = 550;
    this.hud_buttonW = 64;
    this.hud_buttonsX = this.hud_x * 4; // + this.hud_x/2;
    this.hud_buttonsY = this.hud_y + 80;
    this.hud_icons_x = this.hud_x - 40;
    this.hud_icons_offset = 50;
    this.barWidth = 85;
    this.timeCounter_offset = 116;
    //this.hud_barOffset = 

    //player's name
    this.hud_playerName = this.game.add.bitmapText(this.hud_x, this.hud_y, 'arcadeBlackFont', this.player.name, 20); //(this.hud_mainBox.x, this.hud_mainBox.y, 'arcadeBlackFont', this.player.name, 20);
    this.hud_playerName.align = "left";
    this.hud_playerName.fixedToCamera = true;

    //player's money
    this.hud_playerMoney = this.game.add.bitmapText(32, 32, 'arcadeBlackFont', this.player.money, 20); //(this.hud_mainBox.x, this.hud_mainBox.y, 'arcadeBlackFont', this.player.name, 20);
    this.hud_playerMoney.align = "left";
    this.hud_playerMoney.fixedToCamera = true;

    this.moneyIcon = this.game.add.sprite(
      32 + 20 * this.player.money.toString().length, 40, 'moneyIcon');
    this.moneyIcon.fixedToCamera = true;
    this.moneyIcon.anchor.setTo(0, 0.5);
    this.moneyIcon.scale.setTo(0.07, 0.07);

    //time counter
    this.timeCounterText = this.game.add.bitmapText(
      window.innerWidth - this.timeCounter_offset, 32, 'arcadeBlackFont',
      this.getTimeText(), //muestra el tiempo con formato: 00:00
      20);
    this.timeCounterText.align = "left";
    this.timeCounterText.fixedToCamera = true;

    //SUBMENÚS:  NEEDS, YOU, FRIENDS
    //  NEEDS
    //group
    this.needsGroup = this.game.add.group();

    //iconos
    this.needsGroup.create(this.hud_icons_x, this.hud_buttonsY, 'hungerIcon');
    this.needsGroup.create(this.hud_icons_x * 2 + this.hud_icons_offset + 10, this.hud_buttonsY, 'sleepIcon');
    this.needsGroup.create(this.hud_icons_x * 3 + this.hud_icons_offset * 2, this.hud_buttonsY, 'toiletIcon');

    //barras de necesidad
    this.hungerBar = this.game.add.sprite(this.hud_icons_x + this.hud_icons_offset, this.hud_buttonsY, 'greenBox');
    this.sleepBar = this.game.add.sprite((this.hud_icons_x + this.hud_icons_offset) * 2 - 5, this.hud_buttonsY, 'greenBox');
    this.toiletBar = this.game.add.sprite((this.hud_icons_x + this.hud_icons_offset) * 3 - 15, this.hud_buttonsY, 'greenBox');

    //console.log('hunger: '+ this.player.needs.hunger + " :: " + this.hungerBar.width);

    this.needsGroup.add(this.hungerBar);
    this.needsGroup.add(this.sleepBar);
    this.needsGroup.add(this.toiletBar);

    this.needsGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      elem.scale.setTo(0.075, 0.075);
      elem.anchor.setTo(0.5, 0.5);
    });

    this.hungerBar.anchor.setTo(0, 0);
    this.sleepBar.anchor.setTo(0, 0);
    this.toiletBar.anchor.setTo(0, 0);

    //button
    this.needsButton = this.addButton('needsIconSelected', '', this.hud_buttonsX, this.hud_buttonsY, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 0) {
        this.changeMenu(this.needsGroup);
        this.resetHUD();
        this.needsButton.loadTexture('needsIconSelected');
        this.selectedHUD = 0;
      }
    });
    this.needsButton.fixedToCamera = true;


    //  YOU (ATRIBUTOS DEL JUGADOR)
    //group
    this.youGroup = this.game.add.group();
    //iconos
    this.youIconX = this.hud_x / 2;
    var youIconSeparation = 180;
    this.youTextOffset = 25;

    this.youGroup.create(this.youIconX, this.hud_buttonsY, 'intelligenceIcon');
    this.youGroup.create(this.youIconX + youIconSeparation, this.hud_buttonsY, 'fitnessIcon');
    this.youGroup.create(this.youIconX + 2 * youIconSeparation, this.hud_buttonsY, 'charismaIcon');

    //player's stats (texts)
    this.intelligenceText = this.game.add.bitmapText(this.youIconX + this.youTextOffset, this.hud_buttonsY, 'arcadeBlackFont', this.player.stats.intelligence + "/" + this.player.maxStat, 20);
    this.fitnessText = this.game.add.bitmapText(this.youIconX + youIconSeparation + this.youTextOffset + 10, this.hud_buttonsY, 'arcadeBlackFont', this.player.stats.fitness + "/" + this.player.maxStat, 20);
    this.charismaText = this.game.add.bitmapText(this.youIconX + 2 * youIconSeparation + this.youTextOffset, this.hud_buttonsY, 'arcadeBlackFont', this.player.stats.charisma + "/" + this.player.maxStat, 20);

    this.youGroup.add(this.intelligenceText);
    this.youGroup.add(this.fitnessText);
    this.youGroup.add(this.charismaText);
    this.youGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      if (elem.text == undefined) //si no es un texto, cambia la escala
        elem.scale.setTo(0.075, 0.075);
      elem.anchor.setTo(0.5, 0.5);
    });

    this.intelligenceText.align = "left";
    this.fitnessText.align = "left";
    this.charismaText.align = "left";


    this.intelligenceText.anchor.setTo(0, 0.5);
    this.fitnessText.anchor.setTo(0, 0.5);
    this.charismaText.anchor.setTo(0, 0.5);

    //button
    this.youButton = this.addButton('youIcon', '', this.hud_buttonsX + this.hud_buttonW, this.hud_buttonsY, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 1) {
        this.changeMenu(this.youGroup);
        this.resetHUD();
        this.youButton.loadTexture('youIconSelected');
        this.selectedHUD = 1;
      }
    });
    this.youButton.fixedToCamera = true;

    //  FRIENDS
    //group
    this.friendsGroup = this.game.add.group();


    //var friend = this.player.getFriend(0);
    /*this.friendText1 = this.game.add.bitmapText(this.youIconX + this.youTextOffset,
      this.hud_buttonsY, 'arcadeBlackFont',
      "AAAA", 20);*/

    this.friendsGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      elem.scale.setTo(0.075, 0.075);
      elem.anchor.setTo(0.5, 0.5);
    });
    ///
    //  FIN DE INTERFAZ
    ///



    //button
    this.friendsButton = this.addButton('friendsIcon', '', this.hud_buttonsX + 2 * this.hud_buttonW, this.hud_buttonsY, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 2) {
        this.changeMenu(this.friendsGroup);
        this.resetHUD();
        this.friendsButton.loadTexture('friendsIconSelected');
        this.selectedHUD = 2;


        //show friends
        this.updateFriendsHUD();
      }
    });
    this.friendsButton.fixedToCamera = true;

    this.hideGroup(this.needsGroup);
    this.hideGroup(this.youGroup);
    this.hideGroup(this.friendsGroup);
    this.showActualMenu();
  },

  getTimeText: function () {
    return ("0" + this.timeCounter.hour).slice(-2) + ':' + ("0" + this.timeCounter.minute).slice(-2);
  },

  //deselecciona el submenú actual del hud
  resetHUD: function () {
    switch (this.selectedHUD) {
      case 0:
        this.needsButton.loadTexture('needsIcon');
        break;
      case 1:
        this.youButton.loadTexture('youIcon');
        break;
      case 2:
        this.friendsButton.loadTexture('friendsIcon');
        break;
    }

  },

  updateFriendsHUD: function () {

    for (var i = 0; i < this.player.numFriends + 1; i++) {

      var friend = this.player.getFriend(i);

      this.friendsGroup.remove(this.friendText);

      this.friendText = this.game.add.bitmapText(this.youIconX + this.youTextOffset,
        this.hud_buttonsY, 'arcadeBlackFont', friend.name + "\n" + friend.friendship, 20);

      this.friendsGroup.add(this.friendText);
      //console.log(this.friendText._text);
      this.friendText.fixedToCamera = true;
      this.friendText.align = "left";

      this.friendText.anchor.setTo(0, 0.5);
    }
  },

  //TEMPORAL///////////////////////////
  updateFriendsHUD2: function () {



    var friend = this.player.getFriend(1);

    //this.friendsGroup.remove(this.friendText);

    this.friendText2 = this.game.add.bitmapText((this.youIconX + this.youTextOffset) * 2,
      this.hud_buttonsY, 'arcadeBlackFont', friend.name + "\n" + friend.friendship, 20);

    this.friendsGroup.add(this.friendText2);
    //console.log(this.friendText._text);
    this.friendText2.fixedToCamera = true;
    this.friendText2.align = "left";

    this.friendText2.anchor.setTo(0, 0.5);
  },

  //Muestra el submenú de NEEDS/YOU/FRIENDS
  showActualMenu: function () {
    var menu = this.getActualMenu();

    this.showGroup(menu);
  },

  //Hides actual menu and shows the new one
  changeMenu: function (newGroup) {
    var oldGroup;

    //encuentra el menú actual
    oldGroup = this.getActualMenu();

    this.hideGroup(oldGroup);
    this.showGroup(newGroup);
  },

  getActualMenu: function () {
    var menu = null;

    switch (this.selectedHUD) {
      case 0:
        menu = this.needsGroup;
        break;
      case 1:
        menu = this.youGroup;
        break;
      case 2:
        menu = this.friendsGroup;
        break;
    }

    return menu;
  },

  hideGroup: function (group) {
    group.forEach(function (elem) {
      elem.kill();
    });
  },

  showGroup: function (group) {
    group.forEach(function (elem) {
      elem.revive();
    });
  },

  //Crea un botón
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

module.exports = PlayScene;