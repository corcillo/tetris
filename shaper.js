var shaper = function(gridWidth, gridHeight, xys, grid){
  var that = Object.create(shaper.prototype);
  var xyList = [];
  xys.forEach(function(e){
    xyList.push(e.slice(0));
  });
  var isFalling = true;
  var shouldSettle = false;
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
    $(that.getCellName(x,y)).attr("class","fullCell");
  }
  that.emptyCell = function(x, y){
    $(that.getCellName(x,y)).attr("class","emptyCell");
  }
  that.fillFallCell = function(x, y){
    $(that.getCellName(x,y)).attr("class","fallCell");
  }
  that.checkCellFull = function(x, y){
    return ($(that.getCellName(x,y)).attr("class") == "fullCell");
  }

  that.fallShape = function(){
    if (canFall()){
      that.emptyShape();
      xyList.forEach(function(xy){  
        xy[1]+=1;
        that.fillFallCell(xy[0], xy[1]);
      });
    } else {
      xyList.forEach(function(xy){  
        that.fillFallCell(xy[0], xy[1]);
        if (shouldSettle == false){
          shouldSettle = true; 
        } else {
          isFalling = false;
          shouldSettle = false;
        }
      });
    }
  }
  that.rightShape = function(){
    if (canMoveRight()){
      that.emptyShape();
      xyList.forEach(function(xy){
        xy[0]+=1;
        that.fillFallCell(xy[0], xy[1]);
      });
    }
  }
  that.leftShape = function(){
    if (canMoveLeft()){
      that.emptyShape();
      xyList.forEach(function(xy){
        xy[0]-=1;
        that.fillFallCell(xy[0], xy[1]);
      }); 
    }
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
  that.fillFallShape = function(){
    xyList.forEach(function(xy){
      that.fillFallCell(xy[0],xy[1]);
    });
  }
  var bool = true;
  var canMoveRight = function(){
    bool = true;
    xyList.forEach(function(xy){
      if (xy[0] + 1 >= gridWidth || that.checkCellFull(xy[0]+1,xy[1])){
        bool = false;
      }
    });
    return bool;
  }
  var canMoveLeft = function(){
    bool = true;
    xyList.forEach(function(xy){
      if (xy[0] - 1 < 0 || that.checkCellFull(xy[0]-1,xy[1])){
        bool = false;
      }
    });
    return bool;
  }
  var canFall = function(){
    bool = true;
    var floorHeight = grid.getFloorHeight();
    xyList.forEach(function(xy){
      console.log(that.checkCellFull(xy[0],xy[1]+1));
      if (xy[1]  >= gridHeight - 1 || that.checkCellFull(xy[0],xy[1]+1)){
        console.log("STOP FALLING");
        bool = false;
      }
    });
    return bool;
  }
  Object.freeze(that);
  return that;
}