define(['underscore'],function(_){
  'use strict'

  var self;
  var scoreCount = 10;
  var scoreName = 'skikingScore';

  function gameScore(completeFunc){
    self = this;
    if(getScoreObj() === null){
      self.initScore();
    }

    completeFunc();
  }

  gameScore.prototype.scoreArr = [];

  gameScore.prototype.isHiscore = function(score){
    //1위부터 10위까지의 숫자 중에서 기록에 해당하는 순위 리턴
    var scoreArr = getScoreObj();
    var result = _.sortedIndex(scoreArr, {'score':score}, function(v,k){
      return v.score * -1;
    }, 'score');

    if(result < 10){
      return true;
    } else {
      return false;
    }
  }

  gameScore.prototype.setScore = function(name, stage, score, skisel, distance){
    //점수 입력
    var scoreArr = getScoreObj();

    var result = _.sortedIndex(scoreArr, {'score':score}, function(v,k){
      return v.score * -1;
    }, 'score');

    scoreArr.splice(result,0, {
      skisel: skisel,
      totalDistance: distance,
      score: score,
      stage: stage,
      clear: false,
      userName: name
    });

    setScoreObj(scoreArr.splice(0, scoreCount));
  }

  gameScore.prototype.getScore = function(rank){
    var score = getScoreObj();

    if(typeof rank === "undefined"){
      return score;
    } else {
      return score[rank-1];
    }
  }

  gameScore.prototype.initScore = function(){
    //기록된 점수 초기화
    var i;
    for(i=0; i<scoreCount; i++){
      self.scoreArr[i] = {
        skisel: 0, // 0 == undefined(question mark), 1 ski 2 board ....
        totalDistance: 0,
        stage: 0,
        clear: false,
        score: 0,
        userName: "..."
      }
    }

    setScoreObj(self.scoreArr);
  }


  function setScoreObj(score){
    localStorage.setItem(scoreName, JSON.stringify(score));
  }

  function getScoreObj(){
    var result = localStorage.getItem(scoreName);

    if(result === null){
      return null;
    } else {
      return JSON.parse(result);
    }
  }

  return gameScore;
});