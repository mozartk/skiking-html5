//v0.0.1
define(["jquery", "underscore"],  function($, _){
    'use strict';
  var currentLayerLevel = 100;
  var storeLayer = [];

  //default layer option
  var layerOption = {
    "keyEvent": ["keyup", "keydown", "keypress", "click"],
    "visible": true
  }

  function asdfJSEngine(){
    eventInit();
    this.addLayer(layerOption);
  };

  asdfJSEngine.prototype.addLayer = function(newLayerOption){
    var layerOption = _.extend(layerOption, newLayerOption);

    _addLayer(layerOption);
  }

  function _addLayer(layerOption){
    require(["gameLayers/_basic"], function(basicLayer){
      storeLayer[currentLayerLevel] = new basicLayer(layerOption);
    });
  }

  function setVisible(visible){
    console.log(visible);
  }

  function delLayer(){

  }

  function changeLayer(){

  }

  function getLayer(){
    var layerIdx;
    if(typeof arguments[0] === "number"){
      layerIdx = arguments[0];
    } else {
      layerIdx = currentLayerLevel;
    }

    return storeLayer[layerIdx];
  }

  function defalutEventList(){
    return layerOption.keyEvent.join(" ");
  }

  function eventInit(){
    $("#gameDiv").on(defalutEventList(), eventDistribute);
  }

  //이벤트를 윗 레이어에서 아래 레이어로 분배함
  //true면 분배 중단함
  function eventDistribute(){

    //배열을 거꾸로 돌려서 체크해야 하는데 for in은 거꾸로 못돌림... 그래서 한번 더 돌려서 체크함;;
    var idxArr = [];
    for(var idx in storeLayer){
      idxArr.push(~~idx);
    }

    //높은 순서부터 이벤트 체크함
    var len = idxArr.length;
    while(len){
      var result = getLayer(idxArr[len-1]).event(arguments[0]);

      if(result) break; //true이면 이벤트 전파를 종료함

      len--;
    }

  }

  return asdfJSEngine;
});