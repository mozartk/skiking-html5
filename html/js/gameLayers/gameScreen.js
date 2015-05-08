//v0.0.1
define(["jquery", "underscore", "stageMaker"],  function($, _, StageMaker){
  'use strict';

  var reDraw = false;
  var soundFx;

  var stage, stageLen, skiTile;
  var gameSpeed = 4;
  var gameTick = 5;

  var player = {
    run: false,
    stage: 1,           //currentStage
    skisel: 0,          //skisel
    skiselDirection: 1, //0left 1mid 2right
    speedState: 0,      //0~31
    currentPosX: 16,    //scroll pos
    currentPosY: 0,     //0~1
    alive: true,        //0alive 1dead
    distance: 0,        //0~~
    endLineStop: 20,    //통화 후 20칸 움직임
    clear: false        //
  };


  var scrBuffer = document.createElement('canvas');
  scrBuffer.width = engine.screenConf.rw;
  scrBuffer.height = engine.screenConf.rh;

  var bufferCtx  = scrBuffer.getContext('2d');
  bufferCtx.imageSmoothingEnabled = false;
  window.bufferCtx = bufferCtx;

  var gameSprites = {
    'snow':[0,1,2,3,4],
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
    this.engine.setLayer(this);
    this.player = player;
    keyCode = engine.keyCode;
    soundFx = engine.soundFx;
    skiTile  = engine.gameImage.getImage('ski');

    window.skiTile = skiTile;


    this.init();
  };

  gameScreenLayer.prototype.init = function(){
    makeStage();
    playerInit();
    drawGameScreen();
  }

  function drawGameScreen(){
    reDraw = true;
    engine.painter.redraw();
  }

  function makeStage(){
    var stageMaker = new StageMaker();
    stage = stageMaker.seed(Date.now()).get(10);
    window.stage = stage;
    stageLen = stage.length;

  }

  function playerInit(){
    player['run'] =  false;
    player['skisel'] =  0; //skisel
    player['skiselDirection'] =  1; //0left 1mid 2right
    player['speedState'] = 0;//0~31
    player['currentPosX'] =  16;//scroll pos
    player['currentPosY'] =  0;//0~1
    player['alive'] =  true; //0alive 1dead
    player['distance'] =  0; //0~~
    player['endLineStop'] =  20//통화 후 20칸 움직임
    player['clear'] =  false; //
  }

  function paintStage(){
    var k = 0;
    var i = player.currentPosY;
    var len = player.currentPosY+50;
    var tile = gameSprites.snow;
    for(i=player.currentPosY; i<=len; i++){
      var v = stage[i];
      v.forEach(function(vv, kk){
        if(vv>=0 && vv<=9 || vv == 20 || vv == 34) {
          if(vv === 20 || vv == 34) vv = 0;
          var row = 0;
          var column = vv;
          var r_row = row * 20;
          var r_column = column * 20;
          bufferCtx.drawImage(skiTile, r_column+5, r_row+10, 10, 10, kk*10, k*10, 10, 10);
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
          bufferCtx.drawImage(skiTile, 100-5, 0, 20, 20, kk*10, k*10, 20, 20);
        } else if(vv == 30){
          bufferCtx.drawImage(skiTile, 45, 70, 10, 10, kk* 10, k*10, 10, 10);
        } else if(vv == 32){
          bufferCtx.drawImage(skiTile, 65, 70, 10, 10, kk* 10, k*10, 10, 10);
        } else if(vv == 34){
          //finish line
          bufferCtx.drawImage(skiTile, 85, 70, 10, 10, kk* 10, k*10, 10, 10);
        } else if(vv == 36){
            //집
            bufferCtx.drawImage(skiTile, 124, 40, 11, 20, (kk*10)-1, k*10, 11, 20);
            bufferCtx.drawImage(skiTile, 145, 40, 10, 20, (kk*10)+10, k*10, 10, 20);
            bufferCtx.drawImage(skiTile, 5, 60, 10, 20, (kk*10)+20, k*10, 10, 20);
            bufferCtx.drawImage(skiTile, 25, 60, 11, 20, (kk*10)+30, k*10, 11, 20);
        } else if(vv == 38){
          //출발 지점
          bufferCtx.drawImage(skiTile, 5, 90, 10, 10, (kk*10), k*10, 10, 10);
          bufferCtx.drawImage(skiTile, 5, 90, 10, 10, (kk*10)+10, k*10, 10, 10);
          bufferCtx.drawImage(skiTile, 5, 90, 10, 10, (kk*10)+20, k*10, 10, 10);
          bufferCtx.drawImage(skiTile, 5, 90, 10, 10, (kk*10)+30, k*10, 10, 10);
          bufferCtx.drawImage(skiTile, 145, 70, 10, 10, (kk*10), (k*10)+10, 10, 10);
          bufferCtx.drawImage(skiTile, 145, 70, 10, 10, (kk*10)+10, (k*10)+10, 10, 10);
          bufferCtx.drawImage(skiTile, 145, 70, 10, 10, (kk*10)+20, (k*10)+10, 10, 10);
          bufferCtx.drawImage(skiTile, 145, 70, 10, 10, (kk*10)+30, (k*10)+10, 10, 10);
        }
      });
      k++;
    };
  }

  function playerPosInfo(){
    //162,130
    var spritePos = {
      x : 10,
      y : 35,
      w : 20,
      h : 20,
      cx: (player.currentPosX*10)+3,
      cy: 130,
      rw: 20,
      rh: 20
    };

    switch(player.skiselDirection){
      case 0:
        spritePos.x = 20;
        spritePos.y = 80;
        break;
      case 2:
        spritePos.x = 60;
        spritePos.y = 80;
        break;
      case 1:
        spritePos.x = 40;
        spritePos.y = 80;
        break;
    }

    return spritePos;
  }

  function currentfloorInfo(num){
    if(typeof num === "undefined") num = 0;
    return stage[player.currentPosY+30+(num)];
  }

  function paintPlayer(){
    var p = playerPosInfo();
    bufferCtx.drawImage(skiTile, p.x, p.y, p.w, p.h, p.cx-(p.rw/2)+2, p.cy, p.rw, p.rh);
  }

  //처리 후 한칸 전진
  function playerFF(){
    var line = currentfloorInfo();
    if(line[0] == 34){
      soundFx.play("clap");
      player.clear = true;
    }

    if(player.distance === 1){
      soundFx.play("youwillgo");
    }

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
      if(player.endLineStop <= 0){
        player.run = false;
      }
    }

    player.currentPosY++;
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

  function stopRun(){
    player.run = false;
  }



  function goToTitle(){
    engine.setVisible(100, true);
    engine.setVisible(101, false);
    engine.getLayer(100).init();
  }


  //event 처리 부분
  //true를 리턴하면 키를 여기서 먹도록 처리
  //false를 리턴하면 여기서 키 이벤트를 다시 상위로 보냄, 이 경우에는 다른 레이어로 키 이벤트를 다시 보내도록 처리해야 함
  gameScreenLayer.prototype.event = function(e){
    if(e.type == 'keydown' || e.type == 'touchstart') {
      //게임 클리어 / 게임 오버 시 방향키는 먹히지 말아야 함.
      switch (e.keyCode) {
        case keyCode.VK_DOWN:
        case keyCode.VK_LEFT:
        case keyCode.VK_RIGHT:
          if(this.player.endLineStop === 0){
            return false;
          }
          break;
      }



      switch (e.keyCode) {
        case keyCode.VK_DOWN:
            this.player.skiselDirection = 1;
          break;
        case keyCode.VK_LEFT:
          if(this.player.skiselDirection !== 0){
            soundFx.play("whee");
          }
          this.player.skiselDirection = 0;
          break;
        case keyCode.VK_RIGHT:
          if(this.player.skiselDirection !== 2){
            soundFx.play("whoo");
          }
          this.player.skiselDirection = 2;
          break;
        case keyCode.VK_SPACE:
          stopRun();
          break;
        case keyCode.VK_ESCAPE:
          goToTitle();
          break;
      }

      if(player.run !== true && player.clear !== true){
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

    if(this.player.run === true) {
      gameTick++;
      if (gameTick % gameSpeed === 0) {
        playerFF();
      }

      drawGameScreen();
    } else {
      reDraw = false;
    }





  }

  return gameScreenLayer;
});