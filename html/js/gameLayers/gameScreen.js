//v0.0.1
define(["jquery", "underscore", "stageMaker"],  function($, _, StageMaker){
  'use strict';

  var reDraw = false;
  var soundFx;

  var stage, stageLen, skiTile;
  var gameSpeed = 4;
  var gameTick = 5;

  var player = {
    run: false, //run state
    skisel: 0, //skisel
    skiselDirection:1, // 0left 1mid 2right
    currentPosX:16, //0~31
    currentPosY:0, //scroll pos
    alive: true, //true alive    false dead
    endLineStop: 20
  }

  var scrBuffer = document.createElement('canvas');
  scrBuffer.width = engine.screenConf.rw;
  scrBuffer.height = engine.screenConf.rh;

  var bufferCtx  = scrBuffer.getContext('2d');
  bufferCtx.imageSmoothingEnabled = false;

  //미리 준비해 놓는 합성 이미지
  var compImg = document.createElement('canvas');
  compImg.width = engine.screenConf.rw;
  compImg.height = engine.screenConf.rh;

  var compCtx  = compImg.getContext('2d');
  compCtx.imageSmoothingEnabled = false;

  var gameSprites = {
    'snow':[0,1,2,3,8,9,16,17,24,25],
    'snowTrail':[0,1,2,3,8,9,16,17,24,25],
    'tree':[13],
    'sky':[52],
    'horizon':[60,61],
    'endLine': [38,39] //두개를 위아래로 겹쳐서 4줄로 그려야 함(명암, 실제로는 2줄)
  };

  var keyCode;


  window.maker = StageMaker;

  function gameScreenLayer(layerOption, engine){
    this.layerOption = layerOption;
    this.engine = engine;
    keyCode = engine.keyCode;
    soundFx = engine.soundFx;
    skiTile  = engine.gameImage.getImage('ski');

    init();
  };

  function init(){
    makeStage();
    makeCompImage();
    playerInit();
    drawGameScreen();
  }

  function drawGameScreen(){
    reDraw = true;
    engine.painter.redraw();
  }

  function makeStage(){
    var stageMaker = new StageMaker();
    stage = stageMaker.seed(Date.now()).get(50);
    stageLen = stage.length;

    window.stage = stage;
  }

  function playerInit(){
    player = {
      skisel: 0, //skisel
      skiselDirection:1, // 0left 1mid 2right
      currentPosX:16, //0~31
      currentPosY:16, //scroll pos
      speedState: 0, //0~1
      distance: 0, //0~~
      endLineStop: 20, //통화 후 20칸 움직임
      alive: true, //0alive 1dead
      clear: false
    };
  }

  function makeCompImage(){
    //결승선
    compCtx.drawImage(skiTile, 145, 46, 10, 2, 5, 5, 10, 1);
    compCtx.drawImage(skiTile, 125, 47, 10, 2, 5, 6, 10, 1);
    compCtx.drawImage(skiTile, 145, 46, 10, 2, 5, 7, 10, 1);
    compCtx.drawImage(skiTile, 125, 47, 10, 2, 5, 8, 10, 1);

    //시작시점
    for(var i=10; i<=40; i=i+10){
      compCtx.drawImage(skiTile, 5, 85, 10, 5, i, 10, 10, 5);
      compCtx.drawImage(skiTile, 25, 85, 10, 5, i, 15, 10, 5);
      compCtx.drawImage(skiTile, 125, 75, 10, 1, i, 20, 10, 1);
      compCtx.drawImage(skiTile, 125, 76, 10, 4, i, 21, 10, 9);
      compCtx.drawImage(skiTile, 145, 75, 10, 9, i, 29, 10, 1);
    }

    //player 0 mid
    compCtx.drawImage(skiTile, 9, 100,  2, 1,  12, 35, 2, 1);
    compCtx.drawImage(skiTile, 27, 100, 6, 10, 10, 36, 6, 19);
  }

  function paintStage(){
    //stage.forEach(function(v,k){
    var k = 0;
    var i = player.currentPosY;
    var len = player.currentPosY+50;
    var tile = gameSprites.snow;
    for(i=player.currentPosY; i<=len; i++){
      var v = stage[i];
      v.forEach(function(vv, kk){
        if(vv>=0 && vv<=9 || vv == 20 || vv == 34) {
          if(vv === 20 || vv == 34) vv = 0;
          var row = Math.floor(tile[vv]/8);
          var column = ((tile[vv]/8) - row)*8;
          var r_row = row * 10;
          var r_column = column * 20;

          bufferCtx.drawImage(skiTile, r_column+5, r_row+5, 10, 5, kk* 10, k*5, 10, 5);
        }
      });
      k++;
    };
  };

  function paintMaterial(ctx){
    var k = 0, i, j = 0;
    var len = player.currentPosY+50; //플레이어로부터 30칸 밑으로 더그
    for(i=player.currentPosY; i<len; i++){
      var v = stage[i];
      v.forEach(function(vv, kk){
        if(vv == 20){
          //tree
          bufferCtx.drawImage(skiTile, 104, 10, 11, 10, kk*10, (k*5)-14, 11, 19);
        } else if(vv >= 30 && vv <= 33){
          //sky, horizon
          var _tile = getTile(vv);

          var row = Math.floor(_tile/8);
          var column = ((_tile/8) - row)*8;
          var r_row = row * 10;
          var r_column = column * 20;
          bufferCtx.drawImage(skiTile, r_column+5, r_row+5, 10, 5, kk* 10, k*5, 10, 10);
        } else if(vv == 34){
          //finish line
          bufferCtx.drawImage(compImg, 5, 5, 10, 4, kk* 10, k*5, 10, 4);
        } else if(vv == 36){
          if(j==0) {
            bufferCtx.drawImage(compImg, 10, 10, 40, 20, kk*10, k*5, 40, 20);
            j++;
          }
        }
      });
      k++;
    };
  }

  function playerPosInfo(){
    var spritePos = {};
    switch(player.skisel){
      case 0:
        spritePos = {
          x : 10,
          y : 35,
          w : 6,
          h : 20,
          cx: (player.currentPosX*10)+3,
          cy: 125,
          rw: 6,
          rh: 20
        }
        break;
    }

    return spritePos;
  }

  function paintPlayer(){
    var p = playerPosInfo();
    bufferCtx.drawImage(compImg, p.x, p.y, p.w, p.h, p.cx, p.cy, p.rw, p.rh);
  }

  //처리 후 한칸 전진
  function playerFF(){
    //앞에 장애물이 있는지 확인

    //없을 경우
    if(false){

      //이동하면 몸 흔들거리는 flag
      //스프라이트로 볼 때 이동하면 몸이 흔들거려야 하는데
      //스프라이트만 있고 실게임에서도 구현 안되어있음.
      //일단 소스만 남겨둠
      if(player.distance%4 <= 1){
        player.state = 1;
      } else {
        player.state = 0;
      }
    }

    //살아있으면 기록 +1점
    //결승전 통과하면 집계하지 않음.
    if(player.alive === true &&
      player.clear === false){
      player.distance++;
    }

    //결승전 통과하면 20칸 이동 후 이동 종료
    if(player.clear === true){
      player.endLineStop--;
      if(player.endLineStop){
        player.run = false;
      }
    }

    console.log(stage[player.currentPosY+2]);

    player.currentPosY += 2;
    if(player.skiselDirection === 0){
      if(player.currentPosX > 0) player.currentPosX--;
    } else if(player.skiselDirection === 2){
      if(player.currentPosX < 31) player.currentPosX++;
    }
  }

  function getTile(resourceId){
    switch(resourceId){
      case 30:
      case 31:
        return gameSprites.sky[0];
        break;
      case 32:
      case 33:
        return gameSprites.horizon[resourceId-32];
        break;
    }
  }



  function startRun(){
    player.run = true;
  }

  function finishRun(){
    player.clear = true;
  }


  //event 처리 부분
  //true를 리턴하면 키를 여기서 먹도록 처리
  //false를 리턴하면 여기서 키 이벤트를 다시 상위로 보냄, 이 경우에는 다른 레이어로 키 이벤트를 다시 보내도록 처리해야 함
  gameScreenLayer.prototype.event = function(e){
    if(e.type == 'keydown' || e.type == 'touchstart') {
      switch (e.keyCode) {
        case keyCode.VK_DOWN:
            player.skiselDirection = 1;
          break;
        case keyCode.VK_LEFT:
          player.skiselDirection = 0;
          break;
        case keyCode.VK_RIGHT:
          player.skiselDirection = 2;
          break;
      }

      if(player.run !== true){
        startRun();
        drawGameScreen();
      }


    }

    return true;
  };

  gameScreenLayer.prototype.paint = function(ctx){
    if(reDraw === true){
      paintStage();
      paintMaterial();
      paintPlayer();

      ctx.drawImage(scrBuffer, 0, 0);
    }

    drawGameScreen();

    if(player.run === true) {
      gameTick++;
      if (gameTick % gameSpeed === 0) {
        playerFF();
      }


    } else {
      reDraw = false;
    }


  }

  return gameScreenLayer;
});