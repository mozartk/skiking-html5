//v0.0.1
define(["jquery", "underscore", "gameImage", "soundFx", "keyCode"],  function($, _, gameImage, soundFx, keyCode){
    'use strict';
  var currentLayerLevel = 100;
  var storeLayer = [];
  var gameDiv = $("#gameDiv");
  var gameCanvas = $("#gameCanvas");
  var dataParse;

  var screenConf = {
    rw: 320, //rw, rh : 내부 구현 사이즈
    rh: 240,
    w: 640,  //css로 늘린 보이는 사이즈
    h: 480,
    frameRate: 30 // per sec
  };

  var libLoad = 0;
  var libLoadState = 2;
  var engine;

  function asdfJSEngine(inst_dataParse){
    engine = this;
    this.keyCode = keyCode
    dataParse = inst_dataParse;
    this.screenConf = screenConf;
    screenInit();
    this.screenContext.imageSmoothingEnabled = false;
    event.init();

    //this.addLayer(101, {title: "gameScreen", visible: false, enabled: false, "layer":"_basic"});//

    this.gameImage = new gameImage(dataParse, waitDependent.bind(this));
    this.soundFx   = new soundFx(dataParse.get("skisound.wad"), waitDependent.bind(this));
  };

  function waitDependent(engine){
    libLoad++;
    if(libLoadState >= libLoad){
      run();
    }
  }

  function run(){
    engine.addLayer(100, {title: "titleScreen", layer: "titleScreen"});
    engine.addLayer(101, {title: "gameScreen", visible: false, enabled: false, "layer":"gameScreen"});
    engine.painter.init(this);
    engine.painter.start();
  }

  asdfJSEngine.prototype.screenContext = null;
  asdfJSEngine.prototype.addLayer = function(layerIdx, newLayerOption){
    var layerOption = _.extend(defaultLayerOption(), newLayerOption, {layerLevel: layerIdx});
    var that = this;

    require(["gameLayers/" + layerOption.layer], function(basicLayer){
      storeLayer[layerIdx] = new basicLayer(layerOption, that);
    });
  };

  asdfJSEngine.prototype.setVisible = function(num, visible){
    var layer = getLayer(num);
    layer.layerOption['visible'] = visible;
    layer.layerOption['enabled'] = visible;
    console.log(layer);
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
      gameDiv.prepend("<canvas id='gameCanvas' width="+screenConf.rw+" height="+screenConf.rh+" tabindex='0'></canvas>");
      gameCanvas = $("#gameCanvas");
    }

    gameDiv.css({
      "width": screenConf.w + "px",
      "height": screenConf.h + "px",
      "border": "solid 1px black",
      "padding": "0",
      "margin": "0"
    });

    gameCanvas.css({
      "width": screenConf.w + "px",
      "height": screenConf.h + "px",
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
      "keyEvent": ["click", "keyup", "keydown", "keypress", "touchstart"],
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
        engine.painter.engine = scope;
      },
      clear: function(){
        engine.screenContext.fillRect(0, 0, screenConf.w, screenConf.h);
      },
      start: function(){
        engine.painter.draw();
      },
      drawHandler: null,
      _redraw: true,
      redraw: function(){
        engine.painter._redraw = true;
      },
      draw: function(){
        this.drawHandler = setInterval(function(){
          //배열을 거꾸로 돌려서 체크해야 하는데 for in은 거꾸로 못돌림... 그래서 한번 더 돌려서 체크함;;
          var idxArr = [];
          for(var idx in storeLayer){
            var layerOpt = getLayer(idx).layerOption;
            if(layerOpt.enabled === false) {
              continue;
            }

            if(layerOpt.visible === false) {
              continue;
            }

            idxArr.push(parseInt(idx));
          }

          //높은 순서부터 이벤트 체크함
          var len = idxArr.length;
          if(len > 0 && engine.painter._redraw === true){

            //engine.painter.clear.call(this);
            while(len){
              getLayer(idxArr[len-1]).paint(engine.screenContext);

              len--;
            }

            //engine.painter._redraw = false;
          }
        }, 1000/screenConf.frameRate);
      }
  };


  //event Controll part
  var event = {
    init: function(){
      gameCanvas.on(event.list(), event.distribute);
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
        var layer = getLayer(idxArr[len-1]);
        var result = layer.event.call(layer, arguments[0]);
        if(result) break; //true이면 이벤트 전파를 종료함

        len--;
      }
    }
  }

  return asdfJSEngine;
});