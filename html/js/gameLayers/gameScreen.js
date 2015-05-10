//v0.0.1
define(["jquery", "underscore", "stageMaker"],  function($, _, StageMaker){
  'use strict';

  var reDraw = false;
  var soundFx;

  var stage, stageLen, skiTile;
  var gameSpeed = 1;
  var gameTick = 1;

  var player = {
    run: false,
    stage: 1,           //currentStage
    skisel: 0,          //skisel
    skiselDirection: 1, //0left 1mid 2right
    lastDirection: 1, //0left 1mid 2right
    speedState: 0,      //0~31
    currentPosX: 16,    //scroll pos
    currentPosY: 0,     //0~1
    alive: true,        //0alive 1dead
    distance: 0,        //0~~
    triggerStop: 20,    //통화 후 20칸 움직임
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
    player['lastDirection'] =  1; //0left 1mid 2right
    player['speedState'] = 0;//0~31
    player['currentPosX'] =  16;//scroll pos
    player['currentPosY'] =  0;//0~1
    player['alive'] =  true; //0alive 1dead
    player['distance'] =  0; //0~~
    player['triggerStop'] =  20//이벤트 후 20칸 움직임
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
        if(vv>=0 && vv<=9 || vv == 20 || vv == 34 || vv == 36 || vv == 38) {
          if(vv === 20 || vv == 34|| vv == 36 || vv == 38) vv = 0;
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
    var k = 0, i;
    var len = player.currentPosY+50; //플레이어로부터 30칸 밑으로 더그
    for(i=player.currentPosY; i<len; i++){
      var v = stage[i];
      v.forEach(function(vv, kk){
        if(vv == 20){
          //tree 나무는 세로로 10px더 길기 때문에 보정해줘야 함
          bufferCtx.drawImage(skiTile, 100-5, 0, 20, 20, (kk*10)-10, (k*10)-10, 20, 20);
        } else if(vv == 30){
          bufferCtx.drawImage(skiTile, 45, 70, 10, 10, kk*10, k*10, 10, 10);
        } else if(vv == 32){
          bufferCtx.drawImage(skiTile, 65, 70, 10, 10, kk*10, k*10, 10, 10);
        } else if(vv == 34){
          //finish line
          bufferCtx.drawImage(skiTile, 85, 70, 10, 10, kk*10, k*10, 10, 10);
        } else if(vv == 36){
            //집
            bufferCtx.drawImage(skiTile, 124, 40, 11, 20, (kk*10)-1, k*10, 11, 20);
            bufferCtx.drawImage(skiTile, 145, 40, 10, 20, (kk*10)+10, k*10, 10, 20);
            bufferCtx.drawImage(skiTile, 5, 60, 10, 20, (kk*10)+20, k*10, 10, 20);
            bufferCtx.drawImage(skiTile, 25, 60, 11, 20, (kk*10)+30, k*10, 11, 20);
        } else if(vv == 38){
          //출발 지점
          var i = 0;
          for(;i<=30; i=i+10){
            bufferCtx.drawImage(skiTile, 5, 90, 10, 10, (kk*10)+i, k*10, 10, 10);
            bufferCtx.drawImage(skiTile, 145, 70, 10, 10, (kk*10)+i, (k*10)+10, 10, 10);
          }
        } else if(vv >= 40 && vv <= 42) {
          var spPos = 45+(20*(vv-40)); //결과는  0,1,2
          bufferCtx.drawImage(skiTile, spPos, 30, 10, 10, kk*10, k * 10, 10, 10);
        } else if(vv >= 43 && vv <= 44) {
          var spPos = 105+(20*(vv-43)); //결과는  0,1
          bufferCtx.drawImage(skiTile, spPos, 68, 10, 12, kk*10, (k*10)-2, 10, 12);
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

    if(player.alive === true){
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

      if(player.triggerStop <= 0){
        spritePos.x = 140;
        spritePos.y = 80;
      }
    } else {
      //죽어서 뒹굴거리는게 끝나면
      if(player.triggerStop <= 0){
        spritePos.x = 120;
        spritePos.y = 80;
      } else {
        //죽었을 때.
        //스프라이트가 2개라 1/2확률로 각각의 이미지 출력함
        spritePos.x = 80;
        spritePos.y = 80;
        if(rand(2) === 1){
          spritePos.x += 20;
        }
      }
    }

    return spritePos;
  }

  function currentfloorInfo(num){
    if(typeof num === "undefined") num = 0;
    return stage[player.currentPosY+15+(num)];
  }

  function paintPlayer(){
    var p = playerPosInfo();
    bufferCtx.drawImage(skiTile, p.x, p.y, p.w, p.h, p.cx-(p.rw/2)+2, p.cy, p.rw, p.rh);
  }

  //처리 후 한칸 전진
  function playerFF() {
    var line = currentfloorInfo();
    if (line[0] == 34) {
      soundFx.play("clap");
      player.clear = true;
    }

    //나무 충돌
    if (line[player.currentPosX] === 20) {
      player.alive = false;
    }

    //죽은 상태일 때 사운드 출력
    if (player.alive === false) {
      var chance = rand(4);
      var failSound = ["oops", "oh", "ooch", "wow"];
      soundFx.play(failSound[chance]);
    }

    if (player.distance === 1) {
      soundFx.play("youwillgo");
    }

    //살아있으면 기록 +1점
    //결승전 통과하면 집계하지 않음.
    if (player.alive === true &&
      player.clear === false) {
      player.distance++;
    }

    //결승전 통과하면 20칸 이동 후 이동 종료
    if (player.clear === true || player.alive === false) {
      player.triggerStop--;
      if (player.triggerStop <= 0) {
        player.run = false;
      }
    }


    //한칸 전진 플로우
    player.currentPosY++

    //방향을 틀어도 바로 움직이는게 아니라 두번째 이동부터 움직이기 때문에
    //이전 방향과 지금 방향을 비교해서 두번째 이동인지 체크하기 위해 사용
    var dirResult = player.lastDirection == player.skiselDirection;
    if (player.alive === true) {
      switch(player.skiselDirection){
        case 0:
          if (player.currentPosX > 0 && dirResult) {
            player.currentPosX--;
          }
          break;

        case 1:
          break;

        case 2:
          if (player.currentPosX < 31 && dirResult) {
            player.currentPosX++;
          }
          break;
      }

      if(player.distance > 2 && stage[player.currentPosY+13][player.currentPosX] < 30){
        stage[player.currentPosY+13][player.currentPosX] = 40+player.skiselDirection;
      }
    } else {
      if(player.distance > 2 && stage[player.currentPosY+13][player.currentPosX] < 30){
        stage[player.currentPosY+13][player.currentPosX] = 43+rand(2);
        console.log(stage[player.currentPosY+13])
      }
    }


    player.lastDirection = player.skiselDirection;
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


  //시드없이 랜덤
  function rand(max){
    return Math.floor(((Math.random() * max)))
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
          if(this.player.triggerStop === 0){
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
      }
    }

    return true;
  };

  gameScreenLayer.prototype.paint = function(ctx){
    if(player.run === true) {
      playerFF(); //게임 정보 업데이트

      paintStage(); // 결과 처리
      paintMaterial();
      paintPlayer();
    }

    ctx.drawImage(scrBuffer, 0, 0);
  }

  return gameScreenLayer;
});