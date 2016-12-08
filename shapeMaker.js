var shapeMaker = function(width){
  var that = Object.create(shapeMaker.prototype);
  var centerX = Math.floor(-1+width/2.0);

  var coordDict = {"square": [[[centerX,-1],[centerX,0],[centerX+1,-1],[centerX+1,0]], "yellow"],
  "line": [[[centerX,-1], [centerX,0], [centerX,1], [centerX,2]], "aqua", 1],
  "T": [[[centerX-1,0],[centerX,0],[centerX+1,0],[centerX,-1]],"purple", 1],
  "leftZ": [[[centerX,-1],[centerX-1,0],[centerX+1,-1],[centerX,0]], "green", 3],
  "rightZ": [[[centerX,0],[centerX-1,-1],[centerX+1,0],[centerX,-1]], "red", 3],
  "rightL" : [[[centerX,-1], [centerX,0], [centerX,1], [centerX+1,1]],"blue",1],
  "leftL" :  [[[centerX,-1], [centerX,0], [centerX,1], [centerX-1,1]],"orange",1]
  }
  var cleanCoordCopy = function(coordList){
    var xyList = [];
    coordList.forEach(function(e){
      xyList.push(e.slice(0));
    });
    return xyList;
  }
  that.getCoords = function(name){
    return cleanCoordCopy(coordDict[name][0]);
  }
  that.getColor = function(name){
    return coordDict[name][1];
  }
  that.getPivot = function(name){
    return coordDict[name][2];
  }
  Object.freeze(that);
  return that;
}