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





   */

  var timeStamp, tempStamp;

  var field = [];

  var tile = {
    'snow':[0,1,2,3,8,9,16,17,24,25],
    'snowTrail':[0,1,2,3,8,9,16,17,24,25],
    'tree':[13],
    'sky':[52],
    'horizon':[60, 61],
    'endLine': [38,39], //두개를 위아래로 겹쳐서 4줄로 그려야 함(명암, 실제로는 2줄)
    'startfloor': [64, 65],
    'startbottom': [62, 63]
  }

  function stageMaker(){

  }

  stageMaker.prototype.seed = function(timeStamp){
    tempStamp = timeStamp = timeStamp;

    return this;
  }

  stageMaker.prototype.get = function(level){
    return makeProcess(3000);
  }

  //getProbability
  function getProbability(range){
    if(typeof range === "undefined") range = 100;
    return randResult = getRand(tempStamp++) % range;
  }

  function getRand(seed){
    return Math.floor(Math.abs(('0.'+Math.sin(seed).toString().substr(6)))*100);
  }

  function makeProcess(level){
    //field = [];
    var i = 0, k = 0;
    var _level = level;//지형 + 배경(하늘, 도착지점)

    var field = makeSky();
    var skyLen = (field.length-1);

    //우선 바닥에 눈을 깔아 놓습니다...
    //눈 타일이 10개이므로 10개 랜덤하게 깝니다.
    for(k=skyLen; k<=_level; k++){
      var arr = new Array();
      for(i=0; i<=31; i++){
        var result = getProbability(9);
        if(result > 9) console.log(result);
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

    return field;
  }

  function makeSky(){
    var sky = [];
    for(k=0; k<56; k++){
      var arr = new Array();
      for(i=0; i<=31; i++){
        if(k < 14){
          arr.push(30);
        } else if(k === 14) {
          arr.push(getProbability(2)+32);
        } else {
          arr.push(getProbability(9));
        }
      }
      sky.push(arr);
      arr = null;
    }

    //출발지점
    sky[27][14] = 36;

    return sky;
  }

  function makeEndLine(field){
    //sky 7, horizon 1
    //H 6, 8pixel

    var endline = field.length-30;
    var i = 0;

    var lineBuffer = document.createElement('canvas');
    lineBuffer.width = 10;
    lineBuffer.height = 20;

    for(i=0; i<=31; i++){
      field[endline][i] = 38;
    }

    return field;
  }



  return stageMaker;
});