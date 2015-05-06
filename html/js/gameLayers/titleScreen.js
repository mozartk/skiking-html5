//v0.0.1
define(["jquery", "underscore"],  function($, _){
  'use strict';

  var titleScreen;
  var reDraw = false;
  var soundFx;

  function titleScreenLayer(layerOption, engine){
    this.layerOption = layerOption;
    this.engine = engine;
    this.engine.setLayer(this);
    soundFx = engine.soundFx;
    titleScreen  = engine.gameImage.getImage('skititl');
    this.init();
  };

  titleScreenLayer.prototype.init = function(){
    drawTitleScreen();
  }

  function drawTitleScreen(){
    reDraw = true;
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
    if(reDraw === true){
      ctx.drawImage(titleScreen, 0, 0);
      soundFx.play("titleskiking");
    }

    reDraw = false;
  }

  return titleScreenLayer;
});