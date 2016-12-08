var controllerFunction = function () {
  var width  = 10;
  var height = 20;
  var timestep = 500;
  var myGrid = grid(width, height);
  var hasReleasedDownForNewShape = false;
  var isHoldingDown = false;
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
  var sideSpeedFactor = 10;
  var downSpeedFactor = 20;
  var fallingShapeArr;
  var shapeJustChanged;
  initializeTable();
  var updateBoard = function(){
    var sideKeyDown;
    var didRotate;
    var fallingShape;
    var slide = false;
    initializeTable();
    var pause = setInterval(function(){
      if (myGrid.gameOver()){
        clearInterval(pause);
      }
      sideKeyDown = false;
      didRotate = false;
      fallingShapeArr = myGrid.getFallingShape();
      fallingShape = fallingShapeArr[0];
      shapeJustChanged = fallingShapeArr[1];
      if (shapeJustChanged == true && isHoldingDown == true){
        hasReleasedDownForNewShape = false;
        clearInterval(slide);
      }
      $(document).keydown(function(e) {
        if (e.keyCode == 27){
          clearInterval(pause); 
        }
        // clearInterval(slide);
        //right
        if (e.keyCode == 39 && !sideKeyDown){
          sideKeyDown = true;
          fallingShape.rightShape();
          if (slide == false){
            slide = setInterval(function(){
              fallingShape.rightShape();
            },timestep/sideSpeedFactor);
          }
        }
        //left
        else if (e.keyCode == 37 && !sideKeyDown){
          sideKeyDown = true;
          fallingShape.leftShape();
          if (slide == false){
            slide = setInterval(function(){
              fallingShape.leftShape();
            },timestep/sideSpeedFactor);
          }
        } else if (e.keyCode == 40 && hasReleasedDownForNewShape == true){
          isHoldingDown = true;
          if (slide == false){
            slide = setInterval(function(){
              fallingShape.fallShape(downSpeedFactor);
            },timestep/downSpeedFactor);
          }
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
    },timestep);
  }
  updateBoard();
}