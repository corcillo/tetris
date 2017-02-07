var grid = function(width,height){
  var that = Object.create(grid.prototype);
  var myUtils = utils();
  var myShapeMaker = shapeMaker(width, myUtils);
  var centerX = Math.floor(width/2.0);
  var floorHeight = myUtils.initializeEmptyArray(width);
  var shapeList = myShapeMaker.shapeList();
  var shapeName = myUtils.getRandomFromList(shapeList);
  var color = myShapeMaker.getColor(shapeName);
  var pivot = myShapeMaker.getPivot(shapeName);
  var fallingShape = shape(width, height, myShapeMaker.getCoords(shapeName), that, color, pivot);
  var score = 0;
  var level = 1;
  var levelIncreased = false;
  var gameOver = false;
  that.resetFallingShape = function(){
    shapeName = myUtils.getRandomFromList(shapeList);
    color = myShapeMaker.getColor(shapeName);
    pivot = myShapeMaker.getPivot(shapeName);
    fallingShape = shape(width, height, myShapeMaker.getCoords(shapeName), that, color, pivot);
  }
  that.setLevelIncreased = function(bool){
    levelIncreased = bool;
  }
  that.getLevelIncreased = function(){
    return levelIncreased;
  }
  that.gameOver = function() {
    return gameOver;
  }
  that.getLevel = function(){
    return level;
  }
  that.resetLevel = function(){
    level = 1;
  }
  that.getScore = function(){
    return score;
  }  
  that.resetScore = function(){
    score = 0;
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
      shapeName = myUtils.getRandomFromList(shapeList);
      color = myShapeMaker.getColor(shapeName);
      pivot = myShapeMaker.getPivot(shapeName);
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
  //fulllChunks[{bottomRow: x, topRow: y, size: z},{...}]
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
    score += myUtils.calculatePoints(level, jumpRows);
    var newLevel = myUtils.calculateLevel(score);
    if (newLevel > level){
      level = newLevel;
      levelIncreased = true;
      $("#level").text("Level "+level);
    }
    console.log(score);
    $("#score").text("Score: "+score);
  }

  Object.freeze(that);
  return that;
}