//v0.0.1
define(["jquery", "underscore"],  function($, _){
    'use strict';
  var currentLayerLevel = 100;
  var storeLayer = [];
  var gameDiv = $("#gameDiv");
  var gameCanvas = $("#gameCanvas");

  var screenSize = {
    w: 640,
    h: 480
  }

  function asdfJSEngine(){
    screenInit();

    event.init();
    this.addLayer(100, {title: "titleScreen"});
    this.addLayer(101, {title: "gameScreen", visible: false, enabled: false, "layer":"_basic"});
  };
  asdfJSEngine.prototype.screenContext = null;

  asdfJSEngine.prototype.addLayer = function(layerIdx, newLayerOption){
    var layerOption = _.extend(defaultLayerOption(), newLayerOption, {layerLevel: layerIdx});
    var that = this;

    require(["gameLayers/" + layerOption.layer], function(basicLayer){
      storeLayer[layerIdx] = new basicLayer(layerOption, that);
    });
  };

  asdfJSEngine.prototype.setVisible = function(visible){
    console.log(visible);
  }

  //레이어 삭제함
  asdfJSEngine.prototype.delLayer = function(layerIdx){

  }

  //레이어 우선순위를 변경함
  asdfJSEngine.prototype.changeLayer = function(){
    //enable, visible 적절히 변경함
  }


  //게임 화면 셋팅
  function screenInit(){
    if(gameDiv.length === 0){
      $("body").prepend("<div id='gameDiv'></div>");
      gameDiv = $("#gameDiv");
    }

    if(gameCanvas.length === 0){
      gameDiv.prepend("<canvas id='gameCanvas' tabindex='0'></canvas>");
      gameCanvas = $("#gameCanvas");
    }

    gameDiv.css({
      "width": screenSize.w + "px",
      "height": screenSize.h + "px",
      "border": "solid 1px black",
      "padding": "0",
      "margin": "0"
    });

    gameCanvas.css({
      "width": screenSize.w + "px",
      "height": screenSize.h + "px",
      "padding": "0",
      "margin": "0"
    });

    asdfJSEngine.prototype.screenContext = gameCanvas[0].getContext("2d");
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
      "keyEvent": ["click", "keyup", "keydown", "keypress"],
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



  asdfJSEngine.prototype.painter = {
      engine: undefined,
      init: function(scope){
        this.engine = scope
      },
      clear: function(){
        this.engine.screenContext.fillRect(0, 0, screenSize.w, screenSize.h);
      }
  };


  //event Controll part
  var event = {
    init: function(){
      console.log(event.list());
      //gameCanvas.on(event.list(), event.distribute);

      _.each(event.list().split(" "), function(v,k,o){
        gameCanvas[0].addEventListener(v, event.distribute, true);
      });
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