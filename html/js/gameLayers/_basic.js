//v0.0.1
define(["jquery", "underscore"],  function($, _){
  'use strict';

  function layerBasic(layerOption){
    this.layerOption = layerOption;
  };

  //event 처리 부분
  //true를 리턴하면 키를 여기서 먹도록 처리
  //false를 리턴하면 여기서 키 이벤트를 다시 상위로 보냄, 이 경우에는 다른 레이어로 키 이벤트를 다시 보내도록 처리해야 함
  layerBasic.prototype.event = function(e){
    console.log(e);

    return true;
  };






  return layerBasic;
});