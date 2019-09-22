var tileInput = 0;
var mapWidthHeight = 0;
var maxTiles = 0;
var placedTiles = 0;
var grid = [];

const tileTypes = [
  {
    type:"A",
    neighbour: ["B"],
    variation: ["a", "b", "c"]
  },
  {
    type:"B",
    neighbour: ["A"]
  },
  {
    type:"C",
    neighbour: ["D"]
  },
  {
    type:"D",
    neighbour: ["C"]
  }
];

function initialiseGrid(size) {
  for (var i=0; i < size; i++){
    grid[i] = [];
    for (var j=0; j < size; j++){
      grid[i][j] = 0;
    }
  }
}

function setMaxTilesFromInput(){
  const inputValue = document.getElementById("gridInput").value;
  tileInput = inputValue;
  mapWidthHeight = Math.round(Math.sqrt(tileInput));
  maxTiles = mapWidthHeight * mapWidthHeight;
  initialiseGrid(mapWidthHeight);
  updateResult(mapWidthHeight);
}

function updateResult(result){
  //insert the result, map height, back into the DOM to be visible to user//
  const output = "<h2>" + result + "</h2>";
  document.getElementById("result").innerHTML = output;
}

function placeTile(location, currentTile) {
  console.log("current tile;", currentTile);
  //have I reached the max number of tiles? if so, STOP//
  if (placedTiles >= maxTiles) {
    console.log("final grid:", grid);
    return false;
  }
  //is the location empty? if not, STOP//
  if (grid[location.x][location.y] !== 0){
    return false;
  }
  //Have I reached the end of the row? if so, STOP//
  if (location.x >= mapWidthHeight){
    return false;
  }
  //Have I reached the end of the column? if so, STOP//
  if (location.y >= mapWidthHeight){
    return false;
  }
  //place tile in grid//
  grid[location.x][location.y] = currentTile;
  //update number of placed tiles//
  placedTiles = placedTiles + 1;
  //calculate array of allowed tiles based on current tile neighbours//
  const allowedTiles = tileTypes.filter(function(tile){
    const result = currentTile.neighbour.indexOf(tile.type) !== -1;
    //only include if tile.type is an element in currentTile.neighbour//
    return result;
  });
  //choose a random tile based on allowed tile array//
  const nextTile = allowedTiles[Math.floor(Math.random()*allowedTiles.length)];
  console.log("Next tile: ", nextTile);
  //repeat function with next tile and next location//
  const nextLocation = {
    x: location.x + 1,
    y: location.y
  }
  placeTile(nextLocation, nextTile);
}

document.getElementById("calculateButton").onclick = function(){
  placedTiles = 0;
  //choose a random tile to start with//
  const originTile = tileTypes[Math.floor(Math.random()*tileTypes.length)];
  console.log(originTile);
  const origin = {
    x: 0,
    y: 0
  };
  setMaxTilesFromInput();
  placeTile(origin, originTile);
};
