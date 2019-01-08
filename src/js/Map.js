function Map(game, player) {
    this.game = game;
    this.player = null;

    //tilemap
    this.map = game.add.tilemap('map'); //, 64, 64);
    this.map.addTilesetImage('tileset', 'tileset');
    //layers
    this.groundLayer = this.map.createLayer('groundLayer'); //suelo
    this.groundLayer.resizeWorld();
    this.groundWallLayer = this.map.createLayer('groundWallLayer'); //Paredes(altura 1)
    this.objectsLayer = this.map.createLayer('objectsLayer'); //Objetos
    this.wallLayer = this.map.createLayer('wallLayer'); //Paredes
    //collision
    this.map.setCollisionByExclusion([], true, this.groundWallLayer);
    this.map.setCollisionByExclusion([], true, this.objectsLayer);

    //tile indexes(clase MAP)
    this.sink = 51; //LAVABO
    this.sinkTop = 27;
    this.toilet = 52; //RETRETE
    this.toiletTop = 28;
    this.fridge = 73; //FRIGORÍFICO
    this.fridgeTop = 49;
    this.fridgeSide = 74; //FRIGORÍFICO DE LADO 
    this.fridgeSideTop = 50;
    this.mailbox = 53; //BUZÓN
    this.bed = 26; //CAMA
    this.bedFront = 25;
    this.worktop = 5; //ENCIMERA

    this.selectedTileIndex = -1;

    this.wallsAreActive = true; //true si las paredes del mapa están visibles
    //Límites de la casa
    this.house_x = 540;
    this.house_y = 2202;
    this.house_w = 2010;
    this.house_h = 3210;
    //game.physics.enable(this.doorTrigger, Phaser.Physics.ARCADE);


    this.marker = this.game.add.image(

        0, 0, 'hudBox'
    );
    this.marker.width = 64;
    this.marker.height = 64;

    this.buildSound = this.game.add.audio('build');
    this.errorSound = this.game.add.audio('error');
}

//MÉTODOS
Map.prototype.update = function () {
    var currentTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
        this.objectsLayer.getTileY(this.game.input.activePointer.worldY),
        this.objectsLayer, true);


    this.marker.x = roundFloorToInt(this.game.input.activePointer.worldX, 64);
    this.marker.y = roundFloorToInt(this.game.input.activePointer.worldY, 64);

    //console.log(this.marker.x + '->' + currentTile.x);
    console.log(currentTile.index);
    if (this.game.input.mousePointer.isDown && this.selectedTileIndex != -1) {
        this.placeTile(currentTile);
    }
}

Map.prototype.placeTile = function (tile) {
    var canBePlaced = tile.index == -1;

    if (canBePlaced) {
        var cost = 0;
        switch (this.selectedTileIndex) {
            case this.bed:
                var leftTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX - 64),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY),
                    this.objectsLayer, true);
                var canBePlaced = leftTile.index == -1;

                if (canBePlaced) {
                    leftTile.index = this.bedFront;
                    leftTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.bed;
                }
                break;

            case this.toilet:
                var upTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY - 64),
                    this.objectsLayer, true);
                var canBePlaced = upTile.index == -1;

                if (canBePlaced) {
                    upTile.index = this.toiletTop;
                    upTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.toilet;
                }
                break;

            case this.sink:
                var upTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY - 64),
                    this.objectsLayer, true);
                var canBePlaced = upTile.index == -1;

                if (canBePlaced) {
                    upTile.index = this.sinkTop;
                    upTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.sink;
                }
                break;

            case this.fridge:
                var upTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY - 64),
                    this.objectsLayer, true);
                var canBePlaced = upTile.index == -1;

                if (canBePlaced) {
                    upTile.index = this.fridgeTop;
                    upTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.fridge;
                }
                break;

            case this.fridgeSide:
                var upTile = this.map.getTile(this.objectsLayer.getTileX(this.game.input.activePointer.worldX),
                    this.objectsLayer.getTileY(this.game.input.activePointer.worldY - 64),
                    this.objectsLayer, true);
                var canBePlaced = upTile.index == -1;

                if (canBePlaced) {
                    upTile.index = this.fridgeSideTop;
                    upTile.setCollision(true, true, true, true);
                    cost = this.game.buildCost.fridge;
                }
                break;

            case this.worktop:
                cost = this.game.buildCost.worktop;
                break;
        }

        if (canBePlaced) {
            this.buildSound.play();
            tile.index = this.selectedTileIndex;
            tile.setCollision(true, true, true, true);
            this.player.money -= cost;
            this.player.showExchange(-cost);
        }
    }
}

//Comprueba si las coordenadas recibidas están dentro de los límites del mapa
Map.prototype.isInside = function (_x, _y) {
    return (_x >= this.house_x && _x <= this.house_w &&
        _y >= this.house_y && _y <= this.house_h);
}


//Crea las capas del tilemap que se ven por encima del jugador
Map.prototype.createTopLayers = function () {
    this.overPlayerObjects = this.map.createLayer('overPlayerObjects'); //Objetos sobre el jugador
    this.overPlayerWalls = this.map.createLayer('overPlayerWalls'); //Paredes sobre el jugador
}


//Devuelve el tipo de mueble que se encuentra en la posición (X, Y)
Map.prototype.getTileType = function (player) {
    var interactOffsetX = 32;
    var interactOffsetY = interactOffsetX;

    if (player.getDir().y > 0)
        interactOffsetY = interactOffsetY * 2; //Para las interacciones con tiles debajo del jugador es necesario aumentar el offset en la Y

    this.tile = this.map.getTile(this.objectsLayer.getTileX(player.x + (interactOffsetX * player.getDir().x)),
        this.objectsLayer.getTileY(player.y + (interactOffsetY * player.getDir().y)),
        this.objectsLayer);

    if (this.tile != null) {
        //console.log(player.x + ", " + player.y + ": " + this.tile.index);

        var type = "";

        switch (this.tile.index) {
            case this.sink:
                if (player.getDir().y < 0)
                    type = "sink";
                break;
            case this.toilet:
                if (player.getDir().y < 0)
                    type = "toilet";
                break;
            case this.fridge:
                if (player.getDir().y < 0)
                    type = "fridge";
                break;
            case this.fridgeSide:
            case this.fridgeSideTop:
                if (player.getDir().x < 0)
                    type = "fridge";
                break;
            case this.mailbox:
                if (player.getDir().y <= 0)
                    type = "mailbox";
                break;
            case this.bed:
            case this.bedFront:
                type = "bed";
                break;
            default:
                type = "";
                break;
        }

        return type;
    }
};


Map.prototype.hideMarker = function () {
    this.marker.kill();
}


Map.prototype.tileSelected = function (tileName) {

    switch (tileName) {
        case 'bed':
            this.selectedTileIndex = this.bed;

            break;
        case 'fridgeFront':
            this.selectedTileIndex = this.fridge;

            break;
        case 'fridgeSide':
            this.selectedTileIndex = this.fridgeSide;

            break;
        case 'sink':
            this.selectedTileIndex = this.sink;

            break;
        case 'toilet':
            this.selectedTileIndex = this.toilet;

            break;
        case 'worktop':
            this.selectedTileIndex = this.worktop;

            break;

    }

    this.marker.loadTexture(tileName);
    this.marker.width = 64;
    this.marker.height = 64;
    console.log(this.selectedTileIndex);

}


//Activa/Desactiva las paredes
Map.prototype.toggleWalls = function () {
    if (this.wallsAreActive) {
        this.wallLayer.kill();
        this.overPlayerWalls.kill();
    } else {
        this.wallLayer.revive();
        this.overPlayerWalls.revive();
    }
    this.wallsAreActive = !this.wallsAreActive;
};

Map.prototype.setWalls = function (active) {
    if (!active) {
        this.wallLayer.kill();
        this.overPlayerWalls.kill();
    } else {
        this.wallLayer.revive();
        this.overPlayerWalls.revive();
    }
    //this.wallsAreActive = !this.wallsAreActive;
};

Map.prototype.editMode = function () {
    this.marker.revive();
    console.log('Entered edit mode');
};

//FUNCIONES
function roundFloorToInt(n, multiple) {
    if (multiple == 0)
        return n;

    return Math.floor(n / multiple) * multiple;
}

module.exports = Map;