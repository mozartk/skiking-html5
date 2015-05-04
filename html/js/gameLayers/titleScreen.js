//v0.0.1
define(["jquery", "underscore", "stageMaker"],  function($, _, StageMaker){
  'use strict';

  var titleScreen;
  var reDraw = false;
  var soundFx;

  var stage, skiTile;

  window.maker = StageMaker;

  function titleScreenLayer(layerOption, engine){
    this.layerOption = layerOption;
    this.engine = engine;
    soundFx = engine.soundFx;
    skiTile  = engine.gameImage.getImage('ski');
    init();
  };

  function init(){
    drawTitleScreen();
  }

  function drawTitleScreen(){
    titleScreen  = engine.gameImage.getImage('skititl');
    reDraw = true;
  }

  function makeStage(){
    var skiTile  = engine.gameImage.getImage('ski');
    var i = 0;

    var stageMaker = new StageMaker();
    stage = stageMaker.seed(Date.now()).get(1);

    window.stage = stage;
  }

  function paintStage(){
    stage.forEach(function(v,k){
      v.forEach(function(vv, kk){
        if(vv>=0 && vv<=9 || vv == 13) {
          if(vv === 13) vv = 0;
          var tile = [0,1,2,3,8,9,16,17,24,25];
          var row = Math.floor(tile[vv]/8);
          var column = ((tile[vv]/8) - row)*8;
          var r_row = row * 10;
          var r_column = column * 20;

          engine.screenContext.drawImage(skiTile, r_column+5, r_row+5, 10, 5, kk* 10, k*5, 10, 5);
        }
      });
    });
  }

  function paintMaterial(){
    stage.forEach(function(v,k){
      v.forEach(function(vv, kk){
        //tree
        if(vv == 13){
          engine.screenContext.drawImage(skiTile, 104, 10, 11, 10, kk*10, (k*5)-14, 11, 19);
        }
      });
    });
  }

  //event 처리 부분
  //true를 리턴하면 키를 여기서 먹도록 처리
  //false를 리턴하면 여기서 키 이벤트를 다시 상위로 보냄, 이 경우에는 다른 레이어로 키 이벤트를 다시 보내도록 처리해야 함
  titleScreenLayer.prototype.event = function(e){
    makeStage();
    paintStage();
    paintMaterial();

    return true;
  };

  titleScreenLayer.prototype.paint = function(ctx){
    if(reDraw === true){
      ctx.drawImage(titleScreen, 0, 0);
    }


    reDraw = false;
  }






  return titleScreenLayer;
});