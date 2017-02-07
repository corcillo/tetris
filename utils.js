var utils = function(){
  var that = Object.create(utils.prototype);
  that.initializeEmptyArray = function(width){
    return Array(width).fill(0);
  }

  that.cleanCoordCopy = function(coordList){
    return coordList.map(function(coord){
      return coord.slice(0);
    });
  }

  that.getRandomFromList = function(list){
    return list[Math.floor(Math.random()*(list.length))];
  }

  that.calculatePoints = function(level, lines){
    var levelPts = [40, 100, 300, 1200];
    return levelPts[lines-1]*(level);
  }

  that.calculateLevel = function(score){
    if (score < 30){
      return 1;
    } else if (score >= 30 && score < 6000){
      return 2;
    } else if (score >= 6000 && score < 9000){
      return 3;
    }
  }

  Object.freeze(that);
  return that;
}
