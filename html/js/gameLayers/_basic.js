//v0.0.1
define(["jquery", "underscore"],  function($, _){
  'use strict';

  var titleScreen;
  var reDraw = false;

  function layerBasic(layerOption, engine){
    this.layerOption = layerOption;
    this.engine = engine;

    init();
  };

  function init(){
    drawTitleScreen();
  }

  function drawTitleScreen(){
    titleScreen  = engine.gameImage.getTitleImage('skititl');
    reDraw = true;
  }

  //event 처리 부분
  //true를 리턴하면 키를 여기서 먹도록 처리
  //false를 리턴하면 여기서 키 이벤트를 다시 상위로 보냄, 이 경우에는 다른 레이어로 키 이벤트를 다시 보내도록 처리해야 함
  layerBasic.prototype.event = function(e){

    return true;
  };

  layerBasic.prototype.paint = function(ctx){
    if(reDraw === true){
      ctx.drawImage(titleScreen, 0, 0);
    }

    reDraw = false;
  }






  return layerBasic;
});