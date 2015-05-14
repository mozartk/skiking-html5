define(["jquery", "underscore", "dataParse"],
  function($, _, dataParse){
    'use strict';

    var engine;

    function skiking(){
      init();
    }

    function init(){

      //laod game data
      Promise.all(
        dataParse.config.dataFileList.map(function(arr){
          dataParse.loadData.apply(dataParse, arr);
        })
      ).then(function(){
        runGame();
      });
    }

    function runGame(){
      require(["asdfJSEngine"], function(asdfJSEngine){
        engine = window.engine = new asdfJSEngine(dataParse);
      });
    }

    return skiking;
});