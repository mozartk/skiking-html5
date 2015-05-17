//v0.0.1
define(["jquery", "underscore", "stageMaker", "keyCode"],  function($, _, StageMaker, _keyCode){
  'use strict';

  var soundFx;
  var stage, stageLen, skiTile;
  
  //game flag
  var gameInputScore = false;
  var nextStageFlag = false;
  var gameOverFlag = false;


  var printText = {
    printFlag: false,
    printTime1 : 0,
    nextMsgTerm : 1500,
    scorePadding: 6,

    nameBuffer: "",

    gameText: {
      gameover: "How Short Fame Lasts...",
      hitkey: "Hit A Key!",
      entername: "Enter Some Initials",
      haveFreeguy: "You Have A Free Guy!",
      howFreeguy: "How About A Free Guy?",
      tryagain: "Try This Hill Again!",
      clear: "You Rocked That Hill!",
      real: "You Should Go Ski For Real!",
      Fiftyhill: "You Finished All 50 Hills!",
      hill: "Hill ",
      freeguys: "Free Guys ",
      score: "Score: "
    },

    init: function(){
      printText.printFlag = false;
      printText.nameBuffer = "";
      printText.printTime1 = 0;
    },


    rpad: function(str, limit){
      if(typeof str === "number"){
        str = str.toString();
      }

      while(str.length < limit){
        str += " ";
      }

      return str;
    },

    lpad: function(str, limit){
      if(typeof str === "number"){
        str = str.toString();
      }

      while(str.length < limit){
        str = " " + str;
      }

      return str;
    },

    hillText: function(){
      return printText.gameText.hill + "("+printText.lpad(player.stage, 2)+")";
    },

    freeGuysText: function(){
      return printText.gameText.freeguys + "("+printText.lpad(player.freeGuys, 2)+")";
    },

    scoreText: function(score){
      return printText.gameText.score + score.toString();
    },

    resultText: function(){
      if(player.clear === true){
        return printText.gameText.clear;
      } else if(player.alive !== true){
        return printText.gameText.gameover;
      }
    },

    inputText: function(){
      return printText.gameText.entername + "["+printText.getInputName()+"]";
    },

    inputName: function(keyEvent){
      var keyCode = keyEvent.keyCode;

      if(keyCode === _keyCode.VK_RETURN){
        //scoreInput
        //skip save score if when input is null
      }

      if(keyCode === _keyCode.VK_RETURN || keyCode === _keyCode.VK_ESCAPE){
        goToTitle();
      }

      //정해진 키코드 이외에 입력값 막음
      if((keyCode >= 32 && keyCode <= 126) || keyCode === _keyCode.VK_BACK_SPACE){

        //글자 삭제
        if(keyCode === _keyCode.VK_BACK_SPACE){
          keyEvent.preventDefault();
          var len = printText.nameBuffer.length;
          if(len > 0){
            printText.nameBuffer = printText.nameBuffer.substr(0, len-1);
          }
        } else {
          //글자 입력
          //대소문자 처리
          if(keyEvent.shiftKey === false){
            keyCode = keyCode + 32;
          }

          if(printText.nameBuffer.length < 3){
            printText.nameBuffer += String.fromCharCode(keyCode);
          }
        }
      }
    },

    getInputName: function(){
      var name = printText.nameBuffer;

      return printText.rpad(name, 3);
    },

    resultPrint: function(ctx){
      if(printText.printFlag === true) {
        if (printText.printTime1 === 0) {
          printText.printTime1 = Date.now();
        } else {
          var text = printText.gameText;
          engine.font.drawText(ctx, printText.scoreText(player.score), 65, 90);
          engine.font.drawText(ctx, printText.resultText(), 65, 100);

          if (printText.printTime1 + printText.nextMsgTerm < Date.now()) {
            if(gameInputScore) {
              engine.font.drawText(ctx, printText.inputText(), 65, 110);
            } else {
              engine.font.drawText(ctx, text.hitkey, 65, 120);
              if(player.clear === true) {
                nextStageFlag = true;
              }

              if(player.alive === false && player.clear === false){
                gameOverFlag = true;
              }
            }
          }
        }
      }
    },

    statusPrint: function(ctx){
      var status = printText.hillText() + " " + printText.freeGuysText();
      var distance = printText.lpad(player.distanceLeft,printText.scorePadding);
      var distancePos = engine.screenConf.rw - (printText.scorePadding*engine.font.fontConf.fontWidth);

      engine.font.drawText(ctx, status, 1, 1);
      engine.font.drawText(ctx, distance, distancePos, 1);
    },

    print: function(ctx){
      printText.statusPrint(ctx);
      printText.resultPrint(ctx);
    }
  }

  var player = {
    run: false,
    stage: 1,           //currentStage
    freeGuys: 0,          //freeGuys(live?)
    skisel: 0,          //skisel
    skiselDirection: 1, //0left 1mid 2right
    lastDirection: 1, //0left 1mid 2right
    speedState: 0,      //0~31
    currentPosX: 16,    //scroll pos
    currentPosY: 0,     //0~1
    alive: true,        //0alive 1dead
    distance: 0,        //0~~
    distanceLeft: 0,
    score: 0,        //0~~
    triggerStop: 20,    //통화 후 20칸 움직임
    clear: false        //
  };

  var gameConf = {
    x_min : 0,
    x_max : 31,
    y_min : 0,
    y_max : 23
  }


  var scrBuffer = document.createElement('canvas');
  scrBuffer.width = engine.screenConf.rw;
  scrBuffer.height = engine.screenConf.rh;

  var bufferCtx  = scrBuffer.getContext('2d');
  bufferCtx.imageSmoothingEnabled = false;

  var keyCode;

  function gameScreenLayer(layerOption, engine){
    this.layerOption = layerOption;
    this.engine = engine;
    this.engine.setLayer(this);
    this.player = player;
    keyCode = engine.keyCode;
    soundFx = engine.soundFx;
    skiTile  = engine.gameImage.getImage('ski');

    if(layerOption.enable === true){
      this.init();
    }
  };

  gameScreenLayer.prototype.init = function(){
    gameInit();
    playerInit();
    makeStage();

    printText.init();
  }

  function stageLength(stageNum){
    return 50 + ((stageNum-1)*25);
  }

  function makeStage(){
    var stageLen = stageLength(player.stage)
    var stageMaker = new StageMaker();
    stage = stageMaker.seed(Date.now()).get(stageLen);
    player.distanceLeft = stageLen;
  }
  
  function gameInit(){
    gameInputScore = false;
    gameOverFlag = false;

    //basic player settings;
    player['stage'] = 1;
    player['freeGuys'] = 0;
    player['alive'] = true;
    player['distance'] = 0;
    player['distanceLeft'] = 0;
    player['score'] = 0;
    player['skisel'] = 0;
  }

  function playerInit(){
    nextStageFlag = false;

    player['triggerStop'] = 20;
    player['run'] = false;
    player['skiselDirection'] = 1; //0left 1mid 2right
    player['lastDirection'] = 1; //0left 1mid 2right
    player['speedState'] = 0;//0~31
    player['currentPosX'] = 16;//scroll pos
    player['currentPosY'] = 0;//0~1
    player['alive'] = true; //0alive 1dead
    player['clear'] = false;
  }

  function scoreCanInput(){
    return true;
  }

  function paintStage(){
    var k = 0;
    var i = player.currentPosY;
    var len = player.currentPosY+50;
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

  function paintMaterial(){
    var y = player.currentPosY;
    var k=0, i;
    if(y > 0) {
      y-=1;
      k=-1;
    }

    var len = player.currentPosY+30; //플레이어로부터 30칸 밑으로 더그
    for(i=y; i<len; i++){
      var v = stage[i];
      v.forEach(function(vv, kk){
        if(vv == 20){
          //tree 나무는 세로로 10px더 길기 때문에 보정해줘야 함
          bufferCtx.drawImage(skiTile, -5, 20, 20, 20, (kk*10)-10, (k*10)-10, 20, 20);
        } else if(vv == 30){
          bufferCtx.drawImage(skiTile, 185, 10, 10, 10, kk*10, k*10, 10, 10);
        } else if(vv == 32){
          bufferCtx.drawImage(skiTile, 165, 10, 10, 10, kk*10, k*10, 10, 10);
        } else if(vv == 34){
          //finish line
          bufferCtx.drawImage(skiTile, 145, 10, 10, 10, kk*10, k*10, 10, 10);
        } else if(vv == 36){
            //집
            bufferCtx.drawImage(skiTile, 4, 40, 11, 20, (kk*10)-1, (k*10)-10, 11, 20);
            bufferCtx.drawImage(skiTile, 25, 40, 10, 20, (kk*10)+10, (k*10)-10, 10, 20);
            bufferCtx.drawImage(skiTile, 45, 40, 10, 20, (kk*10)+20, (k*10)-10, 10, 20);
            bufferCtx.drawImage(skiTile, 65, 40, 11, 20, (kk*10)+30, (k*10)-10, 11, 20);
        } else if(vv == 38){
          //출발 지점
          var i = 0;
          for(;i<=30; i=i+10){
            bufferCtx.drawImage(skiTile, 105, 50, 10, 10, (kk*10)+i, k*10-10, 10, 10);
            bufferCtx.drawImage(skiTile, 85, 50, 10, 10, (kk*10)+i, (k*10), 10, 10);
          }
        }

        if(vv >= 40 && vv <= 42) {
          var spPos = 145+(20*(vv-40)); //결과는  0,1,2
          bufferCtx.drawImage(skiTile, spPos, 70, 10, 10, kk*10, (k*10), 10, 10);
        } else if(vv >= 43 && vv <= 44) {
          var spPos = 105+(20*(vv-43)); //결과는  0,1
          bufferCtx.drawImage(skiTile, spPos, 0, 10, 20, kk*10, (k*10)-10, 10, 20);
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
          spritePos.x = 0;
          spritePos.y = 60;
          break;
        case 1:
          spritePos.x = 20;
          spritePos.y = 60;
          break;
        case 2:
          spritePos.x = 40;
          spritePos.y = 60;
          break;
      }

      if(player.triggerStop <= 0){
        spritePos.x = 120;
        spritePos.y = 60;
      }
    } else {
      //죽어서 뒹굴거리는게 끝나면
      if(player.triggerStop <= 0){
        spritePos.x = 100;
        spritePos.y = 60;
      } else {
        //죽었을 때.
        //스프라이트가 2개라 1/2확률로 각각의 이미지 출력함
        spritePos.x = 60;
        spritePos.y = 60;
        if(rand(2) === 1){
          spritePos.x += 20;
        }
      }
    }

    return spritePos;
  }

  function paintText(){
    printText.print(bufferCtx);
  }

  function currentfloorInfo(num){
    if(typeof num === "undefined") num = 0;
    return stage[player.currentPosY+14+(num)];
  }

  window.getCur = function(num){
    return currentfloorInfo(num);
  }

  function paintPlayer(){
    var p = playerPosInfo();
    bufferCtx.drawImage(skiTile, p.x, p.y, p.w, p.h, p.cx-(p.rw/2)+2, p.cy, p.rw, p.rh);
  }


  //방향을 고려한 현재 포지션
  function curDirPos(){
    var pos = player.currentPosX;

    return pos;
  }

  //한칸 전진 후 처리
  function playerFF() {
    if(player.run !== true) {
      return;
    }
    var lastX = player.currentPosX;
    var lastY = player.currentPosY;

    //한칸 전진 플로우
    player.currentPosY++;

    //방향을 틀어도 바로 움직이는게 아니라 두번째 이동부터 움직이기 때문에
    //이전 방향과 지금 방향을 비교해서 두번째 이동인지 체크하기 위해 사용
    var dirResult = player.lastDirection == player.skiselDirection;

    switch (player.skiselDirection) {
      case 0:
        if (player.currentPosX > gameConf.x_min && dirResult) {
          player.currentPosX--;
        }

        //맨 구석에 가면 방향을 정면으로 돌려야 함.
        if (player.currentPosX <= gameConf.x_min){
          player.skiselDirection = 1;
        }
        break;

      case 1:
        break;

      case 2:
        if (player.currentPosX < gameConf.x_max && dirResult) {
          player.currentPosX++;
        }

        //맨 구석에 가면 방향을 정면으로 돌려야 함.
        if (player.currentPosX >= gameConf.x_max){
          player.skiselDirection = 1;
        }
        break;
    }

    if (player.alive === true) {
      if (player.distance > 1 && stage[lastY+14][lastX] < 30) {
        stage[lastY+14][lastX] = 40 + player.lastDirection;
      }
    } else {
      stage[lastY+14][lastX] = 43 + rand(2);
    }
    player.lastDirection = player.skiselDirection;

    //현재 서 있는 라인 정보 얻음
    var line = currentfloorInfo();

    //종료지점 통과했을 때.
    if (line[0] == 34 && player.alive === true) {
      soundFx.play("clap");
      finishRun();
    }

    //나무 충돌 시 판정
    var Pos = curDirPos();
    if (line[Pos] === 20) {
      player.alive = false;
    }

    //죽은 상태일 때 사운드 출력
    if (player.alive === false) {
      var chance = rand(4);
      var failSound = ["oops", "oh", "ooch", "wow"];
      soundFx.play(failSound[chance]);
    }

    //게임 진행 시 처음에 항상 특정 코멘트가 나오는걸 구현
    if (player.distance === 1) {
      soundFx.play("youwillgo");
    }

    //살아있으면 기록 +1점
    //결승전 통과하면 집계하지 않음.
    if (player.alive === true &&
      player.clear === false) {
      player.distance++;
      player.distanceLeft--;
      player.score++;
    }

    //결승전 통과하거나 죽으면 20칸 이동 후 이동 종료
    if (player.clear === true || player.alive === false) {
      player.triggerStop--;
      if (player.triggerStop <= 0) {
        player.run = false;
        printText.printFlag = true;

        //클리어 못하고 죽으면 하이스코어 입력할 수 있는지 체크 후 입력
        if(player.alive === true && player.clear === false){
          gameInputScore = scoreCanInput();
        }
      }
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


  function goToNextStage(){
    nextStageFlag = false;
    player.stage++;

    playerInit();
    makeStage();
    printText.init();
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

  function setDirection(key){
    if(player.alive === true){
      switch(key){
        case keyCode.VK_DOWN:
          player.skiselDirection = 1;
          break;

        case keyCode.VK_LEFT:
          if(player.skiselDirection !== 0) {
            player.skiselDirection = 0;
            soundFx.play("whee");
          }
          break;

        case keyCode.VK_RIGHT:
          if(player.skiselDirection !== 2) {
            player.skiselDirection = 2;
            soundFx.play("whoo");
            break;
          }
      }
    }
  }


  //event 처리 부분
  //true를 리턴하면 키를 여기서 먹도록 처리
  //false를 리턴하면 여기서 키 이벤트를 다시 상위로 보냄, 이 경우에는 다른 레이어로 키 이벤트를 다시 보내도록 처리해야 함
  gameScreenLayer.prototype.event = function(e){
    if(e.type == 'keydown') {

      //점수 입력
      if(gameInputScore){
        printText.inputName(e);
        return;
      }

      if(nextStageFlag){
        goToNextStage();
        return;
      }

      if(gameOverFlag){
        goToTitle();
        return;
      }

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

      setDirection(e.keyCode);
      switch (e.keyCode) {
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
    playerFF(); //게임 정보 업데이트

    paintStage(); // 결과 처리
    paintMaterial();
    paintPlayer();

    paintText();

    ctx.drawImage(scrBuffer, 0, 0);
  }

  return gameScreenLayer;
});