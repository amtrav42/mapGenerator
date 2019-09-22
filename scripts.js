var tileInput = 0;
var mapWidthHeight = 0;
var maxTiles = 0;
var placedTiles = 0;
var grid = [];

const tileTypes = [
  {
    type:"A",
    neighbour: ["B"],
    variations: ["a", "b", "c"]
  },
  {
    type:"B",
    neighbour: ["A"],
    variations: ["a", "b", "c"]
  },
  {
    type:"C",
    neighbour: ["D"],
    variations: ["a", "b", "c"]
  },
  {
    type:"D",
    neighbour: ["C"],
    variations: ["a", "b", "c"]
  }
];

//create the grid based on map width and height//
function initialiseGrid(size) {
  for (var i=0; i < size; i++){
    //initialising the row//
    grid[i] = [];
    //initialising the columns, one for each row//
    for (var j=0; j < size; j++){
      //filling the grid with zeros to check if tile is already placed or not//
      grid[i][j] = 0;
    }
  }
}

function setMaxTilesFromInput(){
  //collect input from DOM//
  const inputValue = document.getElementById("gridInput").value;
  tileInput = inputValue;
  //calculate map width and height, rounded squareroot of user input//
  mapWidthHeight = Math.round(Math.sqrt(tileInput));
  //total tiles equals map height squared//
  maxTiles = mapWidthHeight * mapWidthHeight;
  //feed map width and height into grid initilisation//
  initialiseGrid(mapWidthHeight);
  //output the calculation to the DOM//
  updateResult(mapWidthHeight);
}

function updateResult(result){
  //insert the result, map height, back into the DOM to be visible to user//
  const output = "<h2>" + result + "</h2>";
  document.getElementById("result").innerHTML = output;
}

//make the grid output accessable to HTML//
function outputGridToHTML(){
  var htmlOutput = "";
  var output = "";
  for (var i=0; i < grid.length; i++){
    //creating row tag for this row//
    htmlOutput += "<div class='row'>";
    //append current tile type to output//
    for (var j=0; j < grid.length; j++){
      const currentTile = grid[i][j];
      output += currentTile.type;
      const variation = currentTile.variations[Math.floor(Math.random()*currentTile.variations.length)];
      htmlOutput += "<div class='tile tile_type_" + currentTile.type + variation + "'></div>"
    }
    //new line for console log output for end of row//
    output += "\n";
    //closing row tag for this row//
    htmlOutput += "</div>";
  }
  console.log("output grid: ", output);
  document.getElementById("mapGrid").innerHTML = htmlOutput;
}

function placeTile(location, currentTile) {
  //have I reached the max number of tiles? if so, STOP//
  if (placedTiles >= maxTiles) {
    console.log("final grid:", grid);
    outputGridToHTML();
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
  //Are we moving to the next row?//
  const shouldGoToNewRow = location.x + 1 >= mapWidthHeight;
  //choose a random tile based on allowed tile array//
  const nextTile = shouldGoToNewRow ? tileTypes[Math.floor(Math.random()*tileTypes.length)] : allowedTiles[Math.floor(Math.random()*allowedTiles.length)];
  //repeat function with next tile and next location//
  const nextLocation = {
    x: shouldGoToNewRow ? 0 : location.x + 1,
    y: shouldGoToNewRow ? location.y + 1 : location.y
  }
  placeTile(nextLocation, nextTile);
}

document.getElementById("calculateButton").onclick = function(){
  placedTiles = 0;
  //choose a random tile to start with//
  const originTile = tileTypes[Math.floor(Math.random()*tileTypes.length)];
  const origin = {
    x: 0,
    y: 0
  };
  setMaxTilesFromInput();
  placeTile(origin, originTile);
};
