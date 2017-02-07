var shapeMaker = function(width, myUtils){
  var that = Object.create(shapeMaker.prototype);
  var centerX = Math.floor(-1+width/2.0);
  var coordDict = {
    "square": {"coords": [[centerX,-1],[centerX,0],[centerX+1,-1],[centerX+1,0]], "color": "yellow"},
    "line": {"coords": [[centerX,-1], [centerX,0], [centerX,1], [centerX,2]], "color":"aqua", "pivot":1},
    "T": {"coords": [[centerX-1,0],[centerX,0],[centerX+1,0],[centerX,-1]], "color":"purple", "pivot":1},
    "leftZ": {"coords": [[centerX,-1],[centerX-1,0],[centerX+1,-1],[centerX,0]], "color":"green", "pivot":3},
    "rightZ": {"coords": [[centerX,0],[centerX-1,-1],[centerX+1,0],[centerX,-1]], "color":"red", "pivot":3},
    "rightL" : {"coords": [[centerX,-1], [centerX,0], [centerX,1], [centerX+1,1]], "color":"blue","pivot":1},
    "leftL" :  {"coords": [[centerX,-1], [centerX,0], [centerX,1], [centerX-1,1]], "color":"orange","pivot":1}
  }
  
  that.shapeList = function(){
    return Object.keys(coordDict);
  }

  that.getCoords = function(name){
    return myUtils.cleanCoordCopy(coordDict[name]["coords"]);
  }

  that.getColor = function(name){
    return coordDict[name]["color"];
  }

  that.getPivot = function(name){
    return coordDict[name]["pivot"];
  }

  Object.freeze(that);
  return that;
}