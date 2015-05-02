define(["jquery", "underscore", "dataParse"],
  function($, _, dataParse){
    'use strict';

    var engine;

    function skiking(){
      init();
    }

    function init(){
      dataParse.loadData.call(dataParse).then(function(){
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