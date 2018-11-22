function Map(nCols, nRows, width, height, nNeighbours) {
    this.nCols = 10; //Num. de columnas de la matriz del mapa
    this.nRows = 10; //Num. de filas de la matriz del mapa
    this.width = width; //Ancho del mapa
    this.height = height; //Alto del mapa
    this.nNeighbours = nNeighbours; //Num. de vecinos en el mapa
    this.house = []; //Matriz de muebles y paredes de la casa
    this.neighbours = []; //Array de vecinos
}

//MÉTODOS

//Inicializa el mapa creando el array de vecinos y la matriz de muebles
Map.prototype.initialize = function(){
    //Inicializa el array de vecinos aleatorios
    for(var i = 0; i < this.nNeighbours; i++){

    }

    //Inicializa la matriz de muebles
    for(var i = 0; i < this.nRows; i++){
        this.house[i] = [];
        for(var j = 0; j < this.nCols; j++){
            this.house[i][j] = false;
        }
    }

    this.house[1,1] = true;

    for(var i = 0; i < this.nRows; i++){
        for(var j = 0; j < this.nCols; j++){
            if(this.house[i][j])
            this.game.add.sprite(i * 10, j*10, 'paredTop');
        }
    }
}


//Devuelve el furni que se encuentra en la posición (X, Y)
Map.prototype.getFurniAt = function(x, y){
    return house[x,y];
}


//Crea el vecino neighbours[neighbourIndex] en la zona de spawn
Map.prototype.spawnNeighbour = function(neighbourIndex){

}


//Devuelve al vecino neighbours[neighbourIndex] al pool de vecinos
Map.prototype.killNeighbour = function(neighbourIndex){

}

module.exports = Map;