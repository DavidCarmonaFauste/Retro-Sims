function Map(nCols, nRows, width, height, nNeighbours) {
    this.nCols = nCols; //Num. de columnas de la matriz del mapa
    this.nRows = nRows; //Num. de filas de la matriz del mapa
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
        house[i] = [];
        for(var j = 0; j < this.nNeighbours; j++){
            //house[i][j] = ;
        }
    }
}


//Devuelve el furni que se encuentra en la posición (X, Y)
Map.prototype.getFurniAt = function(x, y){

}


//Crea el vecino neighbours[neighbourIndex] en la zona de spawn
Map.prototype.spawnNeighbour = function(neighbourIndex){

}


//Devuelve al vecino neighbours[neighbourIndex] al pool de vecinos
Map.prototype.killNeighbour = function(neighbourIndex){

}

module.exports = Map;