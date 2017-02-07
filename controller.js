var controllerFunction = function () {
  var width  = 10;
  var height = 20;
  var baseTimestep = 500;
  var timestep = baseTimestep + 0;
  var myGrid = grid(width, height);
  var hasReleasedDownForNewShape = false;
  var isHoldingDown = false;
  var mySound = new Audio(['https://ia800504.us.archive.org/33/items/TetrisThemeMusic/Tetris.mp3']);
  mySound.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
  var initializeTable = function(){
    var table = $("#gridTable"); 
    table.empty();
    var rowNum;
    var colNum;
    for (rowNum = 0; rowNum < height; rowNum++){
      var rowEntry = $('<tr>'); 
      for (colNum = 0 ; colNum < width; colNum++){
        var entry;
        var name = ""+colNum+"x"+rowNum;
        entry = $('<td class="emptyCell">');
        entry.attr("name",name);
        rowEntry.append(entry);
      }
      table.append(rowEntry);
    }
  }
  var slide = false;
  var normalDropInterval;
  var sideSpeedFactor = 5;
  var downSpeedFactor = 20;
  var fallingShapeInfo;
  var shapeJustChanged;
  var sideKeyDown;
  var didRotate;
  var fallingShape;
  var intervalAction = function(){
    console.log(timestep);
    if (myGrid.gameOver()){
      clearInterval(normalDropInterval);
    }
    if (myGrid.getLevelIncreased()  === true){
      timestep = timestep - 100 > 0 ? timestep - 100 : timestep;
      changeSpeed(timestep);
      myGrid.setLevelIncreased(false);
    }
    sideKeyDown = false;
    didRotate = false;
    fallingShapeInfo = myGrid.getFallingShape();
    fallingShape = fallingShapeInfo[0];
    shapeJustChanged = fallingShapeInfo[1];
    if (shapeJustChanged == true && isHoldingDown == true){
      hasReleasedDownForNewShape = false;
      clearInterval(slide);
    }
    $(document).keydown(function(e) {
      if (e.keyCode == 39 && !sideKeyDown){
        sideKeyDown = true;
        fallingShape.rightShape();
        if (slide == false){
          slide = setInterval(function(){
            fallingShape.rightShape();
          },baseTimestep/sideSpeedFactor);
        }
      }
      // left
      else if (e.keyCode == 37 && !sideKeyDown){
        sideKeyDown = true;
        fallingShape.leftShape();
        if (slide == false){
          slide = setInterval(function(){
            fallingShape.leftShape();
          },baseTimestep/sideSpeedFactor);
        }
      } 
      // slam down
      else if (e.keyCode == 40 && hasReleasedDownForNewShape == true){
        isHoldingDown = true;
        if (slide == false){
          slide = setInterval(function(){
            fallingShape.fallShape(downSpeedFactor);
          },timestep/downSpeedFactor);
        }
      // up key / rotate
      } else if (e.keyCode == 38 && !didRotate){
        didRotate = true;
        fallingShape.rotateShape();
      }
    });
    $(document).keyup(function(e) {
      clearInterval(slide);
      slide = false;
      sideKeyDown = false;
      didRotate = false;
      hasReleasedDownForNewShape = true;
      isHoldingDown = false;
    });
    if (sideKeyDown == false){
      fallingShape.fallShape(1);
    }
  }
  var startOver = function(){
    myGrid.resetScore();
    myGrid.resetLevel();
    $("#level").text("Level 1");
    $("#score").text("Score: 0");
    clearInterval(normalDropInterval);
    myGrid.resetFallingShape();
    initializeTable();
    console.log("base : "+baseTimestep);
    timestep = baseTimestep + 0;
    normalDropInterval = setInterval(intervalAction, baseTimestep);
    mySound.load();
    if ($('#mute').attr("state") === "on"){
      mySound.play();
    }
  }
  startOver();
  $('#restart').click(function(){
    startOver();
  });
  var keyDown = false;
  var changeSpeed = function(newTimestep){
    clearInterval(normalDropInterval);
    normalDropInterval = setInterval(intervalAction, newTimestep);
    mySound.playbackRate = 1.1;
  }
  $('#mute').click(function(){
    console.log($('#mute').attr("state"));
    //turn on
    if ($('#mute').attr("state") === "off"){
      console.log("turning on");
      mySound.play();
      mySound.muted = false;
      $('#mute').attr("state","on");
      $("#mute").attr("src","https://upload.wikimedia.org/wikipedia/commons/3/3f/Mute_Icon.svg");
    } else {
      //turn off
      console.log("turning off");
      mySound.muted = true;
      $('#mute').attr("state","off");
      $("#mute").attr("src","https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/2000px-Speaker_Icon.svg.png");
    }
  });


  $(document).keydown(function(e) {
    if (e.keyCode == 27 && keyDown === false){
      console.log(normalDropInterval);
      if (normalDropInterval !== false){
        clearInterval(normalDropInterval); 
        normalDropInterval = false;
      } else if (normalDropInterval === false){
        changeSpeed(timestep);
      }
      keyDown = true;
    }
  });
  $(document).keyup(function(e) {
    // console.log("hi");
    if (e.keyCode == 27 && keyDown === true){
      keyDown = false;
    }
  });
}