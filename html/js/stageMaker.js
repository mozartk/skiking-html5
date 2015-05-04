define([], function(){
  /*
  0~50 바닥
    0~20 눈(나무 포함)
    20~ 눈 밟음




   */

  var timeStamp;

  var field = [];

  var tile = {
    'snow':[0,1,2,3,8,9,16,17,24,25],
    'tree':[4,5,9,10,11,12,13,18,19,26,27]
  }

  function stageMaker(){

  }

  stageMaker.prototype.seed = function(timeStamp){
    timeStamp = timeStamp;
    tempStamp = timeStamp;
    return this;
  }

  stageMaker.prototype.get = function(level){
    return makeProcess(300);
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
    field = [];
    var i = 0, k = 0;
    var _level = level;//지형 + 배경(하늘, 도착지점)

    //우선 바닥에 눈을 깔아 놓습니다...
    //눈 타일이 10개이므로 10개 랜덤하게 깝니다.
    for(k=0; k<=_level; k++){
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
    for(k=0; k<=_level; k++){
      for(i=0; i<=31; i++){
        var result = getProbability(50);
        if(result % 50 === 0){
          field[k][i] = 13;
        }
      }
    }

    return field;
  }

  //var i = 0;
  //var arr = new Uint8Array(100);
  //var seed = Date.now();
  //while(i<=1000000){
  //  //var result = Math.floor(Math.random() * 100) + 1;
  //  arr[result]++;
  //  i++;
  //}



  return stageMaker;
});