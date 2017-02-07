var shape = function(gridWidth, gridHeight, xys, grid, color, pivot){
  var that = Object.create(shape.prototype);
  var xyList = [];
  xys.forEach(function(e){
    xyList.push(e.slice(0));
  });
  var isFalling = true;
  var shouldSettle = false;
  var cantFallCount = 0;
  var originalStopSpeedFactor;
  that.isFalling = function(){
    return isFalling;
  }
  that.getXyList = function(){
    return xyList;
  }
  that.getCellName = function(x, y){
    var newCellName = ""+x+"x"+y;
    return "[name="+newCellName+"]";
  }
  that.fillCell = function(x, y){
    var name = that.getCellName(x,y)
    $(name).attr("class","fullCell");
  }
  that.emptyCell = function(x, y){
    $(that.getCellName(x,y)).attr("class","emptyCell");
    $('.emptyCell').css({"background-color":"skyblue"});
  }
  var fallCell = function(x, y){
    var cell = $(that.getCellName(x,y));
    cell.attr("class","fallCell");
    cell.css("background-color",color);
  }
  that.checkCellFull = function(x, y){
    return ($(that.getCellName(x,y)).attr("class") == "fullCell");
  }

  that.fallShape = function(speedFactor){
    if (that.canFall(speedFactor)){
      that.emptyShape();
      xyList.forEach(function(xy){  
        xy[1]+=1;
        fallCell(xy[0], xy[1]);
      });
    } 
  }
  that.rightShape = function(){
    if (canMoveRight()){
      that.emptyShape();
      xyList.forEach(function(xy){
        xy[0]+=1;
        fallCell(xy[0], xy[1]);
      });
    }
  }
  that.leftShape = function(){
    if (canMoveLeft()){
      that.emptyShape();
      xyList.forEach(function(xy){
        xy[0]-=1;
        fallCell(xy[0], xy[1]);
      }); 
    }
  }
  that.rotateShape = function(){
    if (pivot == undefined){
      return;
    }
    var canRotateResult = canRotate();
    if (canRotateResult === false){
      return;
    } 
    bumpLeft = canRotateResult[0];
    bumpRight = canRotateResult[1];
    that.emptyShape();
    var pivotXY = xyList[pivot].slice(0);
    xyList.forEach(function(xy){
      xy[0] = xy[0] - pivotXY[0];
      xy[1] = xy[1] - pivotXY[1];
      //x,y = y,-x
      var newx = xy[1];
      var newy = -1*xy[0]
      xy[0] = newx;
      xy[1] = newy;
      xy[0] = xy[0] + pivotXY[0] - bumpLeft + bumpRight;
      xy[1] = xy[1] + pivotXY[1];
      fallCell(xy[0], xy[1]);
    }); 
  }
  that.emptyShape = function(){
    xyList.forEach(function(xy){
      that.emptyCell(xy[0],xy[1]);
    });
  }
  that.fillShape = function(){
    xyList.forEach(function(xy){
      that.fillCell(xy[0],xy[1]);
    });
  }
  that.canExist = function(){
    var bool = true;
    xyList.forEach(function(xy){
      if (that.checkCellFull(xy[0]+1,xy[1])){
        bool = false;
      }
    });
    return bool;
  }
  var canMoveRight = function(){
    var bool = true;
    xyList.forEach(function(xy){
      if (xy[0] + 1 >= gridWidth || that.checkCellFull(xy[0]+1,xy[1])){
        bool = false;
      }
    });
    return bool;
  }
  var canMoveLeft = function(){
    var bool = true;
    xyList.forEach(function(xy){
      if (xy[0] - 1 < 0 || that.checkCellFull(xy[0]-1,xy[1])){
        bool = false;
      }
    });
    return bool;
  }
  that.canFall = function(speedFactor){
    if (speedFactor > 1){
      speedFactor = 10;
    }
    var bool = true;
    xyList.forEach(function(xy){
      if (that.checkCellFull(xy[0],xy[1]+1) || xy[1] >= gridHeight - 1){
        bool = false;
      } 
    });
    cantFallCount = bool == false ? cantFallCount + 1 : 0;
    if (cantFallCount == 1){
      originalStopSpeedFactor = speedFactor;
    }
    if (cantFallCount>originalStopSpeedFactor){
      isFalling = false;
    } else {
      isFalling = true;
    }
    return bool;
  }
  var canRotate = function(){
    var bool = true;
    var pivotXY = xyList[pivot].slice(0);
    var maxBumpLeft = 0;
    var maxBumpRight = 0;
    var newXYList = [];
    var preX; var preY; var newX; var newY;
    xyList.forEach(function(xy){
      preX = xy[0] - pivotXY[0];
      preY = xy[1] - pivotXY[1];
      newX = preY;
      newY = -1*preX;
      newX = newX + pivotXY[0];
      newY = newY + pivotXY[1];
      newXYList.push([newX,newY]);
      //if its gonna hit other blocks or go above 
      if (newY >= gridHeight || that.checkCellFull(newX,newY)){
        bool = false;
      }
      //if x is too right, needs to move left
      else if (newX >= gridWidth){
        maxBumpLeft = Math.max(maxBumpLeft, newX - gridWidth + 1);
      }
      //if x is too left, needs to move right
      else if (newX < 0){
        maxBumpRight = Math.max(maxBumpRight, 0 - newX);
      }
    }); 

    if (maxBumpRight>0 || maxBumpLeft>0){
      newXYList.forEach(function(xy){
        if (that.checkCellFull(xy[0]+maxBumpRight-maxBumpLeft,xy[1]) == true){
          bool = false;
        }
      });
    }
    return bool == false ? bool : [maxBumpLeft, maxBumpRight];
  }

  Object.freeze(that);
  return that;
}