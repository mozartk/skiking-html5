//v0.0.1
define(["jquery", "underscore"],  function($, _){
    'use strict';
  var currentLayerLevel = 100;
  var storeLayer = [];

  function asdfJSEngine(){
    event.init();
    this.addLayer(100, {});
    this.addLayer(101, {visible: false, enabled: false, "layer":"_basic"});
  };

  asdfJSEngine.prototype.addLayer = function(layerIdx, newLayerOption){
    var layerOption = _.extend(defaultLayerOption(), newLayerOption, {layerLevel: layerIdx});
    var that = this;

    require(["gameLayers/" + layerOption.layer], function(basicLayer){
      storeLayer[layerIdx] = new basicLayer(layerOption, that);
    });
  };

  function setVisible(visible){
    console.log(visible);
  }

  function delLayer(){

  }

  function changeLayer(){

  }

  function getLayer(){
    var layerIdx;
    if(typeof parseInt(arguments[0]) === "number"){
      layerIdx = arguments[0];
    } else {
      layerIdx = currentLayerLevel;
    }

    return storeLayer[layerIdx];
  }



  //default layer option
  function defaultLayerOption(newOpt){
    var opt =  {
      "keyEvent": ["keyup", "keydown", "keypress", "click"],
      "layer": "_basic",
      "enabled": true,
      "visible": true
    }

    if(typeof newOpt !== "undefined"){
      return opt;
    } else {
      return _.extend(opt, newOpt);
    }
  }


  //event Controll part
  var event = {
    init: function(){
      $("#gameDiv").on(event.list(), event.distribute);
    },

    //각 레이어에 필요한 이벤트 정의함
    list: function(){
      var keyEvent = defaultLayerOption().keyEvent;
      if(typeof arguments[0] !== 'undefined'){
        keyEvent = arguments[0];
      }
      return keyEvent.join(" ");
    },

    //이벤트 각 레이어로 분배함
    distribute: function(){
      //배열을 거꾸로 돌려서 체크해야 하는데 for in은 거꾸로 못돌림... 그래서 한번 더 돌려서 체크함;;
      var idxArr = [];
      for(var idx in storeLayer){
        if(getLayer(idx).layerOption.enabled === false) {
          continue;
        }

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
  }

  return asdfJSEngine;
});