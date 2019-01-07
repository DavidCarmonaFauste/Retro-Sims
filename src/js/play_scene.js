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
    //console.log(this.playerParams);
    this.game.gameOverData = {};
  },

  //CREATE
  create: function () {
    this.game.theme.stop();

    this.game.playSceneMusic.play(); //Empieza la música de playScene
    this.game.playSceneMusic.loop = true; //loop
    this.game.playSceneMusic.volume = 0.055; //volumen

    //Valores iniciales
    this.game.initialX = this.game.world.centerX, this.game.initialY = 3500;
    this.needsRate = 10; //tiempo que tiene que pasar para reducir todas las necesidades (en minutos del juego)
    this.neighbourSpawnRate = 5;
    this.spawningNeighbour = false; //Indica si se está "spawneando" un vecino para no spawnear otro
    var NUM_NEIGHBOURS = 10; //número total de vecinos
    this.maleNames = [ //Array de nombres masculinos
      'Troy James',
      'Kevin Hudson',
      'Liu Xun',
      'Ronan Barnes',
      'Alberto Ruiz',
      'Olly Davidson',
      'Sergio Castro',
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
    //Tiempo del juego
    this.timeCounter = {
      day: 0,
      hour: 12,
      minute: 0
    };
    //loop de tiempo
    this.game.time.events.loop(this.timeSpeed, this.updateTimeCounter, this);

    //Información que se muestra en el hud:
    // 0: NEEDS
    // 1: YOU
    // 2: FRIENDS
    // Empieza con NEEDS
    this.selectedHUD = 0;
    this.friendsWindowPage = 1;

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

    //Spawn de vecinos
    if (!this.spawningNeighbour && this.timeCounter.minute % this.neighbourSpawnRate == 0) {
      this.spawningNeighbour = true;
      this.spawnSim();
    }

    /*if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      console.log(this.player.friends);
    }*/
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

    if (this.player.currentState == 'sleeping') { //Si el jugador está durmiendo, avanza el tiempo 8 horas
      if (this.timeCounter.hour + 8 > 23) //si pasa de día al dormir, actualiza timecounter.day
        this.timeCounter.day++;

      this.timeCounter.hour = (this.timeCounter.hour + 8) % 23;
      this.player.currentState = 'waking up'; //para que no siga aumentando en cada update
    } else if (this.player.currentState == 'active')
      this.timeCounterText.setText(this.getTimeText()); //Actualiza el texto del tiempo

    this.hud_playerMoney.setText(this.player.money); //Actualiza el texto del dinero

    //Comprueba si ha perdido
    this.checkGameOver();
  },

  checkGameOver: function () {
    if (this.player.needs.pee <= 0) {
      this.game.gameOverData.deathCause = 'pee';
      this.gameOver();
    } else if (this.player.needs.hunger <= 0) {
      this.game.gameOverData.deathCause = 'hunger';
      this.gameOver();
    } else if (this.player.needs.fatigue <= 0) {
      this.game.gameOverData.deathCause = 'fatigue';
      this.gameOver();
    } else if (this.player.money <= 0) {
      this.game.gameOverData.deathCause = 'money';
      this.gameOver();
    }

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
      else {
        this.timeCounter.hour = 0;
        this.timeCounter.day++;
      }
      this.timeCounter.minute = 0;
    }
  },


  //RENDER
  render: function () {
    //Debugs
    if (this.debug) {
      this.game.debug.body(this.player);
    }
    //this.game.debug.spriteInfo(this.hud_mainBox, 32, 80);
    //this.game.debug.text("x: "+ this.intelligenceText /*+ "   \ny: " + this.intelligenceText.y*/, 32, 32);
  },

  //Devuelve un número aleatorio entre [min, max]
  randomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },


  //Genera un vecino con nombre y apariencia aleatoria
  randomizeNeighbour: function () {
    var n;
    var name;
    var skinIndex = this.randomNumber(1, this.game.numSkins - 1); //skin random

    if (Math.random() > 0.5)
      name = this.maleNames[this.randomNumber(0, this.maleNames.length - 1)]; //Nombre masculino
    else
      name = this.femaleNames[this.randomNumber(0, this.femaleNames.length - 1)]; //Nombre femenino


    n = new Neighbour(this.game, this.player, 'sim' + skinIndex,
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
      sim.setPosition(0, this.game.initialY + Math.floor((Math.random() * 150) + 1));
      sim.setState('walkingToCenter');
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
  },


  ////////////////////////////////////////////////////////////
  //                        INTERFAZ                       //
  //////////////////////////////////////////////////////////
  createHUD: function () {
    //main hud box
    this.hud_mainBox = this.game.add.sprite(window.innerWidth - 400, window.innerHeight + 125, 'hudBox');
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
    this.hud_playerName = this.game.add.bitmapText(this.hud_x / 2, this.hud_y + 10, 'arcadeBlackFont', this.player.name, 20); //(this.hud_mainBox.x, this.hud_mainBox.y, 'arcadeBlackFont', this.player.name, 20);
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

    //MUSIC ON/OFF BUTTON
    var musicButton = this.addButton('musicButton', '', window.innerWidth - this.timeCounter_offset + 60, 120, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 2) {
        if (this.game.playSceneMusic.isPlaying) {
          this.game.playSceneMusic.stop();
          musicButton.loadTexture('musicOffButton');
          console.log('o');
        } else {
          this.game.playSceneMusic.play();
          musicButton.loadTexture('musicButton');
          console.log('A');
        }
      }
    });
    musicButton.fixedToCamera = true;

    musicButton.scale.setTo(0.075,0.075);

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

        if (this.selectedHUD == 2) //friends menu
          this.hideGroup(this.friendsExtraGroup);
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

        if (this.selectedHUD == 2) //friends menu
          this.hideGroup(this.friendsExtraGroup);
        this.selectedHUD = 1;
      }
    });
    this.youButton.fixedToCamera = true;


    //  FRIENDS
    //group
    this.friendsGroup = this.game.add.group();

    //for(var i = 0; i < this.player.getNumFriends();i++)

    for (var i = 0; i < Math.min(3, this.player.numFriends); i++) {
      var txt = this.player.friends[i].name + '\n' + this.player.friends[i].points + 'friendship points';
      this.friendsGroup.add(this.game.add.bitmapText(this.youIconX + this.youTextOffset,
        this.hud_buttonsY, 'arcadeBlackFont',
        txt, 20));
    }
    /*this.friendText1 = this.game.add.bitmapText(this.youIconX + this.youTextOffset,
      this.hud_buttonsY, 'arcadeBlackFont',
      txt, 20);*/

    this.friendsGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      elem.scale.setTo(0.075, 0.075);
      elem.anchor.setTo(0.5, 0.5);
    });

    //extra group -> para los botones dentro del menú FRIENDS que no queremos que cambien al cambiar de página
    this.friendsExtraGroup = this.game.add.group();

    this.pageText = this.game.add.bitmapText(this.hud_buttonsX + this.hud_buttonW - 60, this.hud_buttonsY - 64, 'arcadeBlackFont',
      'Page ' + this.friendsWindowPage + "/" + (Math.round(this.player.numFriends / 3) + 1), 18);

    this.friendsExtraGroup.add(this.pageText);

    //botón Next Page
    var nextPageButton = this.addButton('nextButton', '',
      this.hud_buttonsX + this.hud_buttonW - 150, this.hud_buttonsY - 64,
      this.hud_buttonW, this.hud_buttonW,
      function () {
        this.friendsWindowPage = Math.max(1, Math.min(this.friendsWindowPage + 1,
          Math.round(this.player.numFriends / 3) + 1
        )); // página límite

        this.updateFriendsHUD();
      });

    nextPageButton.scale.setTo(0.075, 0.075);
    this.friendsExtraGroup.add(nextPageButton);


    //botón Prev Page
    var prevPageButton = this.addButton('prevButton', '',
      this.hud_buttonsX + this.hud_buttonW - 150 - 54, this.hud_buttonsY - 64,
      this.hud_buttonW, this.hud_buttonW,
      function () {
        this.friendsWindowPage = Math.max(1, this.friendsWindowPage - 1); // página límite

        this.updateFriendsHUD();
      });

    prevPageButton.scale.setTo(0.075, 0.075);
    this.friendsExtraGroup.add(prevPageButton);


    //botón de reset de la lista de amigos
    var resetButton = this.addButton('resetButton', '',
      this.hud_buttonsX + this.hud_buttonW - 150 - 128, this.hud_buttonsY - 64,
      this.hud_buttonW, this.hud_buttonW,
      function () {
        this.updateFriendsHUD();
      });

    resetButton.scale.setTo(0.075, 0.075);
    this.friendsExtraGroup.add(resetButton);

    this.friendsExtraGroup.forEach(function (elem) {
      elem.fixedToCamera = true;
      elem.anchor.setTo(0.5, 0.5);
    });

    //button
    this.friendsButton = this.addButton('friendsIcon', '', this.hud_buttonsX + 2 * this.hud_buttonW, this.hud_buttonsY, this.hud_buttonW, this.hud_buttonW, function () {
      if (this.selectedHUD != 2) {
        this.changeMenu(this.friendsGroup);
        this.resetHUD();
        this.friendsButton.loadTexture('friendsIconSelected');
        this.selectedHUD = 2;

        this.showGroup(this.friendsExtraGroup);

        //show friends
        this.updateFriendsHUD();
      }
    });
    this.friendsButton.fixedToCamera = true;

    this.hideGroup(this.needsGroup);
    this.hideGroup(this.youGroup);
    this.hideGroup(this.friendsGroup);
    this.hideGroup(this.friendsExtraGroup);
    this.showActualMenu();
  },

  getTimeText: function () {
    return "Day: " + (this.timeCounter.day + 1) + "\n" +
      ("0" + this.timeCounter.hour).slice(-2) + ':' + ("0" + this.timeCounter.minute).slice(-2);
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
    this.friendsGroup.removeAll(true);

    this.pageText.setText('Page ' + this.friendsWindowPage + "/" + (Math.round(this.player.numFriends / 3) + 1));

    for (var i = 0; i < Math.min(3, this.player.numFriends); i++) {
      var index = i + (3 * (this.friendsWindowPage - 1));
      if (this.player.searchFriendByIndex(index)) { //Si existe un amigo con este índice
        var s = this.player.friends[index].name + '\n' + this.player.friends[index].points + ' friend points';
        var txt = this.game.add.bitmapText(i * 180 + this.youIconX - 80 + this.youTextOffset,
          this.hud_buttonsY, 'arcadeBlackFont',
          s, 15)


        txt.fixedToCamera = true;
        txt.align = "left";
        txt.anchor.setTo(0, 0.5);

        this.friendsGroup.add(txt);
      }
    }
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


  ///
  //  FIN DE INTERFAZ
  ///


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
  },

  ///////////////////////////////////////
  ///            GAME OVER           ///
  /////////////////////////////////////
  gameOver: function () {
    if (this.game.playSceneMusic.isPlaying)
      this.game.playSceneMusic.stop();
    var deathSound = this.game.add.audio('death');
    deathSound.play();


    this.game.gameOverData.name = this.player.name;
    this.game.gameOverData.numFriends = this.player.numFriends;
    this.game.gameOverData.money = this.player.money;
    this.game.gameOverData.days = this.timeCounter.day;

    this.game.world.setBounds(0, 0, 800, 600); //Restaura las dimensiones del world(modificadas por el tilemap)

    this.game.state.start('gameOver'); //Empieza gameOverScene
  }

};

module.exports = PlayScene;