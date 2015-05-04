//v0.0.1
define(["jquery", "underscore", "stageMaker"],  function($, _, StageMaker){
  'use strict';

  var gameScreen;
  var reDraw = false;
  var soundFx;

  var stage, skiTile;

  var player = {
    skisel: 0, //skisel
    skiselDirect:1, // 0left 1mid 2right
    currentPosX:16, //0~31
    currentPosY:0, //scroll pos
    dead: 0 //0alive 1dead
  }

  var scrBuffer = document.createElement('canvas');
  scrBuffer.width = engine.screenConf.rw;
  scrBuffer.height = engine.screenConf.rh;

  var bufferCtx  = scrBuffer.getContext('2d');
  bufferCtx.imageSmoothingEnabled = false;
  //bufferCtx.screenContext.fillRect(0, 0, screenConf.w, screenConf.h);


  window.maker = StageMaker;

  function gameScreenLayer(layerOption, engine){
    this.layerOption = layerOption;
    this.engine = engine;
    this.bufferCtx = bufferCtx;
    soundFx = engine.soundFx;
    skiTile  = engine.gameImage.getImage('ski');

    init();
  };

  function init(){
    makeStage();
    drawGameScreen();
  }

  function drawGameScreen(){
    reDraw = true;
  }

  function makeStage(){
    var skiTile  = engine.gameImage.getImage('ski');
    var i = 0;

    var stageMaker = new StageMaker();
    stage = stageMaker.seed(Date.now()).get(1);

    window.stage = stage;
  }

  function playerSettings(){

  }

  function paintStage(){
    //stage.forEach(function(v,k){
    var k = 0;
    var i = player.currentPosY;
    var len = player.currentPosY+50;
    for(i=player.currentPosY; i<=len; i++){
      var v = stage[i];
      v.forEach(function(vv, kk){
        if(vv>=0 && vv<=9 || vv == 13) {
          if(vv === 13) vv = 0;
          var tile = [0,1,2,3,8,9,16,17,24,25];
          var row = Math.floor(tile[vv]/8);
          var column = ((tile[vv]/8) - row)*8;
          var r_row = row * 10;
          var r_column = column * 20;

          bufferCtx.drawImage(skiTile, r_column+5, r_row+5, 10, 5, kk* 10, k*5, 10, 5);
        }
      });
      k++;
    };
  }

  function paintMaterial(ctx){
    var k = 0;
    var i = player.currentPosY;
    var len = player.currentPosY+50;
    for(i=player.currentPosY; i<=len; i++){
      var v = stage[i];
      v.forEach(function(vv, kk){
        //tree
        if(vv == 13){
          bufferCtx.drawImage(skiTile, 104, 10, 11, 10, kk*10, (k*5)-14, 11, 19);
        }
      });
      k++;
    };
  }

  //event 처리 부분
  //true를 리턴하면 키를 여기서 먹도록 처리
  //false를 리턴하면 여기서 키 이벤트를 다시 상위로 보냄, 이 경우에는 다른 레이어로 키 이벤트를 다시 보내도록 처리해야 함
  gameScreenLayer.prototype.event = function(e){
    if(e.type == 'keydown') {
      switch (e.keyCode) {
        case 40:
          player.currentPosY+=2;
          break;
        case 38:
          player.currentPosY-=2;
          break;
      }
      reDraw = true;
    }
    return true;
  };

  gameScreenLayer.prototype.paint = function(ctx){
    if(reDraw === true){
      paintStage();
      paintMaterial();
      var w = engine.screenConf.rw;
      var h = engine.screenConf.rh;

      ctx.drawImage(scrBuffer, 0, 0);
    }

    reDraw = false;
  }






  return gameScreenLayer;
});