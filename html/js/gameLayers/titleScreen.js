//v0.0.1
define(["jquery", "underscore"],  function($, _){
  'use strict';

  var titleScreen;
  var reDraw = false;
  var soundFx;
  var engine;
  var scoreArr, scoreArrLen;

  var scrBuffer = document.createElement('canvas');

  var bufferCtx  = scrBuffer.getContext('2d');
  bufferCtx.imageSmoothingEnabled = false;

  function titleScreenLayer(layerOption, _engine){
    this.layerOption = layerOption;
    this.engine = engine = _engine;
    this.engine.setLayer(this);
    soundFx = engine.soundFx;
    titleScreen  = engine.gameImage.getImage('skititl');

    this.init();
  };

  titleScreenLayer.prototype.init = function(){
    scoreArr = engine.score.getScore();
    scoreArrLen = scoreArr.length;

    scrBuffer.width = engine.screenConf.rw;
    scrBuffer.height = engine.screenConf.rh;

    soundFx.play("titleskiking");
  }

  function drawTitleScreen(){
    bufferCtx.drawImage(titleScreen, 0, 0);
  }

  var printText = {
    rpad: function(str, limit){
      if(typeof str === "number"){
        str = str.toString();
      }

      while(str.length < limit){
        str += " ";
      }

      return str;
    },

    lpad: function(str, limit){
      if(typeof str === "number"){
        str = str.toString();
      }

      while(str.length < limit){
        str = " " + str;
      }

      return str;
    },

    scorePrint: function(ctx){
      var i = 0;
      var y_start = 129;
      var x_start = 1;
      var name_x = 24;
      var stage_x = 72;
      var clearFlag_x = 80;
      var skisel_x = 100;
      var score_x = 152;

      for(i=0; i<scoreArrLen; i++){
        var indexY = y_start + (i*11);
        engine.font.drawText(ctx, printText.lpad(i+1, 2), x_start, indexY);
        engine.font.drawText(ctx, scoreArr[i].userName, name_x, indexY);
        engine.font.drawText(ctx, i, stage_x, indexY);
        //engine.font.drawText(ctx, i, clearFlag_x, indexY);
        engine.font.drawText(ctx, "?", skisel_x, indexY);
        engine.font.drawText(ctx, printText.lpad(scoreArr[i].score, 6), score_x, indexY);
      }
    },

    print: function(ctx){
      printText.scorePrint(ctx);
    }
  }

  function drawGameScore(){
    printText.print(bufferCtx);
  }

  function goToGame(){
    engine.setVisible(100, false);
    engine.setVisible(101, true);
    engine.getLayer(101).init();
  }

  //event 처리 부분
  //true를 리턴하면 키를 여기서 먹도록 처리
  //false를 리턴하면 여기서 키 이벤트를 다시 상위로 보냄, 이 경우에는 다른 레이어로 키 이벤트를 다시 보내도록 처리해야 함
  titleScreenLayer.prototype.event = function(e){
    if(e.type === 'keydown'){
      goToGame();
    }
    return true;
  };

  titleScreenLayer.prototype.paint = function(ctx){
    drawTitleScreen();
    drawGameScore();

    ctx.drawImage(scrBuffer, 0, 0);
  }

  return titleScreenLayer;
});