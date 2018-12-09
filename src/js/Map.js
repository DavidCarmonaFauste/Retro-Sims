function Map(game) {
    this.nNeighbours = 10; //Num. de vecinos en el mapa
    this.neighbours = []; //Array de vecinos

    //tilemap
    this.map = game.add.tilemap('map'); //, 64, 64);
    this.map.addTilesetImage('tileset', 'tileset');
    //layers
    this.groundLayer = this.map.createLayer('groundLayer'); //suelo
    this.groundLayer.resizeWorld();
    this.groundWallLayer = this.map.createLayer('groundWallLayer'); //Paredes(altura 1)
    this.wallLayer = this.map.createLayer('wallLayer'); //Paredes
    this.objectsLayer = this.map.createLayer('objectsLayer'); //Objetos
    //collision
    this.map.setCollisionByExclusion([], true, this.groundWallLayer);
    this.map.setCollisionByExclusion([], true, this.objectsLayer);

    //tile indexes(clase MAP)
    this.sink = 15; //LAVABO
    this.toilet = 16; //RETRETE
    this.fridge = 19; //FRIGORÍFICO
    this.mailbox = 17; //BUZÓN

    this.wallsAreActive = true; //true si las paredes del mapa están visibles
}

//MÉTODOS

//Inicializa el mapa creando el array de vecinos y la matriz de muebles
/*Map.prototype.initialize = function(){
    //Inicializa el array de vecinos aleatorios
    for(var i = 0; i < this.nNeighbours; i++){

    }

    //Inicializa la matriz de muebles
    for(var i = 0; i < this.nRows; i++){
        house[i] = [];
        for(var j = 0; j < this.nNeighbours; j++){
            //house[i][j] = ;
        }
    }
}*/


//Devuelve el furni que se encuentra en la posición (X, Y)
Map.prototype.getTileType = function (player) {
    this.tile = this.map.getTile(this.objectsLayer.getTileX(player.x + (32 * player.getDir().x)), this.objectsLayer.getTileY(player.y - (32 * player.getDir().y)), this.objectsLayer);
    if (this.tile != null) {
        console.log(player.x + " " + player.y + ": " + this.tile.index);

        var type = "";

        switch (this.tile.index) {
            case this.sink:
                type = "sink";
                break;
            case this.toilet:
                type = "toilet";
                break;
            case this.fridge:
                type = "fridge";
                break;
            case this.mailbox:
                type = "mailbox";
                break;
            default:
                type = "";
                break;
        }

        return type;
    }
};


//Activa/Desactiva las paredes
Map.prototype.toggleWalls = function () {
    if (this.wallsAreActive)
        this.wallLayer.kill();
    else
        this.wallLayer.revive();

    this.wallsAreActive = !this.wallsAreActive;
};


//Crea el vecino neighbours[neighbourIndex] en la zona de spawn
Map.prototype.spawnNeighbour = function (neighbourIndex) {

};


//Devuelve al vecino neighbours[neighbourIndex] al pool de vecinos
Map.prototype.killNeighbour = function (neighbourIndex) {

};

module.exports = Map;