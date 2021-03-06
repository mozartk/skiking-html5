//v0.0.1
define(["underscore", "gameImage", "soundFx", "keyCode", "gameFont", "gameScore"], function (_, gameImage, soundFx, keyCode, gameFont, gameScore) {
  "use strict";
  var currentLayerLevel = 100;
  var storeLayer = [];
  var gameDiv = document.querySelector("#gameDiv");
  var gameCanvas = document.querySelector("#gameCanvas");
  var bufferCanvas = document.createElement("canvas");
  var dataParse;

  var screenConf = {
    rw: 320, //rw, rh : 내부 구현 사이즈
    rh: 240,
    w: 640,  //css로 늘린 보이는 사이즈
    h: 480,
    frameRate: 15 // per sec
  };

  var libLoad = 0;
  var maxLibLoad = 4;
  var engine;

  function asdfJSEngine(inst_dataParse) {
    engine = this;
    this.keyCode = keyCode
    dataParse = inst_dataParse;
    this.screenConf = screenConf;
    screenInit();
    this.screenContext.imageSmoothingEnabled = false;
    event.init();

    this.gameImage = new gameImage(dataParse, waitDependent.bind(this));
    this.soundFx = new soundFx(dataParse.get("skisound.wad"), waitDependent.bind(this));
    this.font = new gameFont(dataParse.get("CGALow.png"), waitDependent.bind(this), screenConf);
    this.score = new gameScore(waitDependent.bind(this));
  };

  function waitDependent() {
    libLoad++;
    if (maxLibLoad <= libLoad) {
      run();
    }
  }

  function run() {
    engine.addLayer(100, {title: "titleScreen", layer: "titleScreen"});
    engine.addLayer(101, {title: "gameScreen", visible: false, enabled: false, "layer": "gameScreen"});
    engine.painter.init(this);
    engine.painter.start();

    var gameCanvas = document.getElementById("gameCanvas");
    if (gameCanvas !== null) {
      gameCanvas.focus();
    }
  }

  asdfJSEngine.prototype.screenContext = null;
  asdfJSEngine.prototype.addLayer = function (layerIdx, newLayerOption) {
    var layerOption = _.extend(defaultLayerOption(), newLayerOption, {layerLevel: layerIdx});
    var that = this;

    require(["gameLayers/" + layerOption.layer], function (gameLayer) {
      new gameLayer(layerOption, that);
    });
  };

  asdfJSEngine.prototype.setVisible = function (num, visible) {
    var layer = engine.getLayer(num);
    layer.layerOption["visible"] = visible;
    layer.layerOption["enabled"] = visible;

    return layer;
  };

  //레이어 삭제함
  asdfJSEngine.prototype.delLayer = function (layerIdx) {

  };

  //레이어 우선순위를 변경함
  asdfJSEngine.prototype.changeLayer = function () {
    //enable, visible 적절히 변경함
  };


  //게임 화면 셋팅
  function screenInit() {
    if (gameDiv === null) {
      var template = document.createElement("template");
      template.innerHTML = "<div id='gameDiv'></div>";
      document.querySelector("body").appendChild(template.content.firstChild);

      gameDiv = document.querySelector("#gameDiv");
    }

    if (gameCanvas === null) {
      var template = document.createElement("template");
      template.innerHTML = "<canvas id='gameCanvas' width=" + screenConf.rw + " height=" + screenConf.rh + " tabindex='0'></canvas>";
      gameDiv.appendChild(template.content.firstChild);
      gameCanvas = document.querySelector("#gameCanvas");
    }

    bufferCanvas.width = screenConf.rw;
    bufferCanvas.height = screenConf.rh;
    bufferCanvas.imageSmoothingEnabled = false;

    gameDiv.style.width = screenConf.w + "px";
    gameDiv.style.height = screenConf.h + "px";
    gameDiv.style.border = "solid 1px black";
    gameDiv.style.padding = "0";
    gameDiv.style.margin = "0";

    gameCanvas.style.width = screenConf.w + "px";
    gameCanvas.style.height = screenConf.h + "px";
    gameCanvas.style.padding = "0";
    gameCanvas.style.margin = "0";

    asdfJSEngine.prototype.screenContext = gameCanvas.getContext("2d");
    asdfJSEngine.prototype.bufferContext = bufferCanvas.getContext("2d");
  }

  asdfJSEngine.prototype.getLayer = function () {
    var layerIdx;
    if (typeof parseInt(arguments[0]) === "number") {
      layerIdx = arguments[0];
    } else {
      layerIdx = currentLayerLevel;
    }

    return storeLayer[layerIdx];
  }

  asdfJSEngine.prototype.setLayer = function (layer) {
    storeLayer[layer.layerOption.layerLevel] = layer;
  }


  //default layer option
  function defaultLayerOption(newOpt) {
    var opt = {
      "keyEvent": ["click", "keyup", "keydown", "keypress", "touchstart"],
      "layer": "_basic",
      "enabled": true,
      "visible": true
    }

    if (typeof newOpt !== "undefined") {
      return opt;
    } else {
      return _.extend(opt, newOpt);
    }
  }


  //painter
  asdfJSEngine.prototype.painter = {
    engine: undefined,
    frame: {
      fps: screenConf.frameRate,
      now: undefined,
      then: Date.now(),
      interval: 1000 / screenConf.frameRate,
      delta: undefined
    },
    init: function (scope) {
      engine.painter.engine = scope;
    },
    clear: function () {
      engine.screenContext.fillRect(0, 0, screenConf.w, screenConf.h);
    },
    start: function () {
      engine.painter.draw();
    },
    drawHandler: null,
    _redraw: true,
    redraw: function () {
      engine.painter._redraw = true;
    },
    draw: function () {
      requestAnimationFrame(engine.painter.draw);
      var frame = engine.painter.frame;

      frame.now = Date.now();
      frame.delta = frame.now - frame.then;
      if (frame.delta > frame.interval) {
        frame.then = frame.now - (frame.delta % frame.interval);

        //배열을 거꾸로 돌려서 체크해야 하는데 for in은 거꾸로 못돌림... 그래서 한번 더 돌려서 체크함;;
        var idxArr = [];
        for (var idx in storeLayer) {
          var layerOpt = engine.getLayer(idx).layerOption;
          if (layerOpt.enabled === false) {
            continue;
          }

          if (layerOpt.visible === false) {
            continue;
          }

          idxArr.push(parseInt(idx));
        }

        //높은 순서부터 이벤트 체크함
        var len = idxArr.length;
        engine.bufferContext.clearRect(0, 0, 320, 240);
        if (true) {
          while (len) {
            engine.getLayer(idxArr[len - 1]).paint(engine.bufferContext);
            len--;
          }
        }
        engine.screenContext.drawImage(bufferCanvas, 0, 0, 320, 240);
      }
    }
  };

  //event Control part
  var event = {
    init: function () {
      var event_arr = event.list().split(" ");
      var len = event_arr.length;
      var i = 0;
      for (i = 0; i < len; i++) {
        gameCanvas.addEventListener(event_arr[i], event.distribute);
      }

    },

    //각 레이어에 필요한 이벤트 정의함
    list: function () {
      var keyEvent = defaultLayerOption().keyEvent;
      if (typeof arguments[0] !== "undefined") {
        keyEvent = arguments[0];
      }
      return keyEvent.join(" ");
    },

    //이벤트 각 레이어로 분배함
    distribute: function () {
      //배열을 거꾸로 돌려서 체크해야 하는데 for in은 거꾸로 못돌림... 그래서 한번 더 돌려서 체크함;;
      var idxArr = [];
      for (var idx in storeLayer) {
        if (engine.getLayer(idx).layerOption.enabled === false) {
          continue;
        }

        idxArr.push(~~idx);
      }

      //높은 순서부터 이벤트 체크함
      var len = idxArr.length;
      while (len) {
        var layer = engine.getLayer(idxArr[len - 1]);
        var result = layer.event.call(layer, arguments[0]);
        if (result) break; //true이면 이벤트 전파를 종료함

        len--;
      }
    }
  };

  asdfJSEngine.prototype.event = event;

  return asdfJSEngine;
});