define([], function(){
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





   */

  var timeStamp, tempStamp;

  function stageMaker(){

  }

  stageMaker.prototype.seed = function(_timeStamp){
    tempStamp = timeStamp = _timeStamp;

    return this;
  }

  stageMaker.prototype.get = function(level){
    return makeProcess(level);
  }

  //getProbability
  function getProbability(range){
    if(typeof range === "undefined") range = 100;
    return getRand(tempStamp++) % range;
  }

  function getRand(seed){
    return Math.floor(Math.abs(('0.'+Math.sin(seed).toString().substr(6)))*100);
  }

  function makeProcess(level){
    //field = [];
    var i = 0, k = 0;
    var _level = (level*2) + 250;//지형
    var _level = (level)+200;

    var field = makeSky();
    var skyLen = (field.length-1);

    //우선 바닥에 눈을 깔아 놓습니다...
    //눈 타일이 10개이므로 10개 랜덤하게 깝니다.
    for(k=skyLen; k<=_level; k++){
      var arr = new Array();
      for(i=0; i<=31; i++){
        var result = getProbability(5);
        arr.push(result);
      }
      field.push(arr);
      arr = null;
    }

    //나무를 심습니다.
    //level에 따라서 심는 갯수가 달라짐
    for(k=skyLen; k<=_level; k++){
      for(i=0; i<=31; i++){
        var result = getProbability(50);
        if(result % 50 === 0){
          field[k][i] = 20;
        }
      }
    }

    //마지막 결승선을 그립니다.
    field = makeEndLine(field);
    window.field = field;

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
          arr.push(getProbability(5));
        }
      }
      sky.push(arr);
      arr = null;
    }

    //집
    sky[9][19] = 36;
    sky[14][14] = 38;

    return sky;
  }

  function makeEndLine(field){
    //sky 7, horizon 1
    //H 6, 8pixel

    var endline = field.length-150;
    var i = 0;

    var lineBuffer = document.createElement('canvas');
    lineBuffer.width = 10;
    lineBuffer.height = 20;

    for(i=0; i<=31; i++){
      field[endline-1][i] = getProbability(5);
      field[endline][i] = 34;
      field[endline-1][i] = getProbability(5);
    }

    return field;
  }



  return stageMaker;
});