var grid = function(width,height){
  var that = Object.create(grid.prototype);
  var initializeEmptyArray = function(){
    var heightArray = [];
    for (i = 0 ; i < width ; i++){
      heightArray.push(0);
    }
    return heightArray;
  }

  var myShapeMaker = shapeMaker(width);
  var centerX = Math.floor(width/2.0);
  var floorHeight = initializeEmptyArray();
  var shapeList = ["square","T","leftZ", "rightZ","leftL","rightL","line"];
  var currentIndex = 0;
  var shapeName = shapeList[currentIndex];
  var color = myShapeMaker.getColor(shapeName);
  var fallingShape = shape(width, height, myShapeMaker.getCoords(shapeName), that, color);
  var gameOver = false;
  that.gameOver = function() {
    return gameOver;
  }
  that.lose = function(){
    gameOver = true;
    $('.emptyCell').css({"background-color":"red"});
  }
  that.getFallingShape = function(){
    var hasChanged = false;
    if (!fallingShape.isFalling()){
      hasChanged = true;
      that.addShapeToFloor();
      currentIndex = (currentIndex+1)%shapeList.length;
      shapeName = shapeList[currentIndex];
      color = myShapeMaker.getColor(shapeName);
      var pivot = myShapeMaker.getPivot(shapeName);
      fallingShape = shape(width, height, myShapeMaker.getCoords(shapeName), that, color, pivot);
      if (!fallingShape.canExist()){
        that.lose();
      }
    }
    return [fallingShape, hasChanged];
  }
  that.addShapeToFloor = function(){
    fallingShape.fillShape();
    that.tryBreakRows();
    return;
  }
  that.tryBreakRows = function(){
    var fullChunks = []; //[{bottomRow: x, topRow: y, size: z},{...}]
    var cellName;
    var cellClass;
    var row;
    var col;
    var inChunk = false;
    var chunkSize = 0;
    var chunkBottomRow = 0;
    var chunkTopRow = 0;
    for (row = height - 1 ; row > 0 ; row--){
      var rowFull = true;
      for (col = 0 ; col < width ; col++){
        cellName = fallingShape.getCellName(col,row);
        cellClass = $(cellName).attr("class");
        if (cellClass == "emptyCell"){
          rowFull = false;
        }
      }
      if (rowFull == true){
        if (inChunk == true){
          chunkSize++;

        } else{ //inChunk==false
          inChunk = true;
          chunkBottomRow = row;
          chunkSize = 1;
        }
      } else { //rowFull == false;
        if (inChunk == true){
          inChunk = false;
          chunkTopRow = row+1;
          fullChunks.push({"bottomRow":chunkBottomRow,"topRow":chunkTopRow,"size":chunkSize});
          chunkSize = 0;
        }
      }
    }
    return fullChunks.length>0 ? that.dropRows(fullChunks) : false;
  }
  that.dropRows = function(fullChunks){
    var lowerIndex = 0;
    var lowerChunk = fullChunks[lowerIndex];
    var upperChunk = fullChunks[lowerIndex+1];
    var jumpRows = lowerChunk["size"];
    var hasJumped = false;
    for (row = lowerChunk["bottomRow"]; row > 0; row--){
      var copyFromRow = row - jumpRows;
      if (upperChunk!=undefined && copyFromRow <= upperChunk["bottomRow"]){ //at or above
        jumpRows+=upperChunk["size"];
        copyFromRow = row - jumpRows;
        lowerIndex++;
        lowerChunk = fullChunks[lowerIndex];
        upperChunk = fullChunks[lowerIndex + 1];
      }
      for (col = 0 ; col < width ; col++){
        var currentCell = $(fallingShape.getCellName(col,row));
        var currentColor = currentCell.css("background-color");
        var currentClass = currentCell.attr("class");
        var aboveCell = $(fallingShape.getCellName(col, copyFromRow));
        var aboveColor = aboveCell.css("background-color");
        aboveColor = aboveColor == undefined ? "skyblue" : aboveColor;
        var aboveClass = aboveCell.attr("class");
        currentCell.css("background-color",aboveColor);
        currentCell.attr("class", aboveCell.attr("class"));
      }
    }
  }

  Object.freeze(that);
  return that;
}