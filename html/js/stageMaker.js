define(['seedRandom'], function(seedrandom){
  //seedRandom
  // https://github.com/davidbau/seedrandom
  /*
  0~50 바닥
    0~10 눈
    11~20 눈흔적
    20 나무
    30,31 하늘
    32,33 지평선
    34,35 목표지점

    36 집
    38 출발지점

    40,41,42 -> ski trail
    43,44 -> ski fail trail
    43,44,45 -> board trail
    43,44,45 -> board trail

   */

  var timeStamp, tempStamp;
  var rand;

  var stageConfig = {
    level: []
  };
  var k = 0;
  for(var i=0; i<=10; i++){
    stageConfig.level[i] = 9850-(i*50);
  }

  var self;

  function stageMaker(){
    this.seedrandom = seedrandom;
    self = this;
  }

  stageMaker.prototype.seed = function(_timeStamp){
    tempStamp = timeStamp = _timeStamp;
    rand = this.seedrandom;
    return this;
  }

  stageMaker.prototype.get = function(level){
    return makeProcess(level);
  }

  //getProbability
  stageMaker.prototype.getProbability = function(range){
    if(typeof range === "undefined") range = 100;
    return Math.floor(getRand(tempStamp++)*range);
  }

  function getRand(seed){
    // old version
    var result = Math.abs(('0.'+Math.sin(seed).toString().substr(6)));
    //var result = rand(seed)();

    return rand(seed)();
  }

  function makeProcess(level){
    var i = 0;
    var _level = level + 150; //150은 여유분. 스테이지가 끝나도 20칸은 달리기 때문에 여유있게 지정해둠


    var field = makeSky();
    var skyLen = (field.length-1);

    //우선 바닥에 눈을 깔아 놓습니다...
    //눈 타일이 10개이므로 10개 랜덤하게 깝니다.
    for(k=skyLen; k<=_level; k++){
      var arr = new Array();
      for(i=0; i<=31; i++){
        var result = self.getProbability(5);
        arr.push(result);
      }
      field.push(arr);
      arr = null;
    }

    //나무를 심습니다.
    //level에 따라서 심는 갯수가 달라짐
    for(k=skyLen; k<=_level; k++){
      for(i=0; i<=31; i++){

        //좌우 구석에는 특별히 나무가 더 많이 나와야 함.
        if(i<=3 || i>=28){
          var result = self.getProbability();
          if(result > 80){
            field[k][i] = 20;
          }
        } else {
          var result = self.getProbability(10000);
          if(result > stageConfig.level[3]){
            field[k][i] = 20;
          }
        }
      }
    }

    //마지막 결승선을 그립니다.
    field = makeEndLine(field);

    return field;
  }

  function makeSky(){
    var sky = [];
    for(k=0; k<23; k++){
      var arr = new Array();
      for(i=0; i<=31; i++){
        if(k < 7){
          arr.push(30);
        } else if(k === 7) {
          arr.push(32);
        } else {
          arr.push(self.getProbability(5));
        }
      }
      sky.push(arr);
      arr = null;
    }

    //집
    sky[10][19] = 36;
    sky[15][14] = 38;

    return sky;
  }

  function makeEndLine(field){
    //sky 7, horizon 1
    //H 6, 8pixel

    var endline = field.length-100-22-15;
    var i = 0;

    var lineBuffer = document.createElement('canvas');
    lineBuffer.width = 10;
    lineBuffer.height = 20;

    for(i=0; i<=31; i++){
      field[endline-1][i] = self.getProbability(5);
      field[endline][i] = 34;
      field[endline-1][i] = self.getProbability(5);
    }

    return field;
  }



  return stageMaker;
});