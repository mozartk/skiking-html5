define(["jquery", "underscore", "dataParse"],
  function($, _, dataParse){
    'use strict';

    var gameData;
    var sound;

    function skiking(){
      init();
    }

    function init(){
      function dataFetch(get) {
        return new Promise(function (resolve, reject) {
          var success = 0;
          function successCall() {
            success++;
            if (success == 2) {
              resolve("success");
            }
          }

          require(["soundFx"], function (soundFx) {
            sound = new soundFx(get.call(dataParse, 'skisound.wad'));
            successCall();
          });

          require(["soundFx"], function (soundFx) {
            sound = new soundFx(get.call(dataParse, 'skisound.wad'));
            successCall();
          });
        });
      }

      dataParse.loadData.call(dataParse).then(function(get){
        dataFetch(get);
      }).then(function(){
        runGame();
      });
    }

    function runGame(){
      require(["asdfJSEngine"], function(asdfJSEngine){
        var engine = window.engine = new asdfJSEngine(dataParse);
      });
    }

    return skiking;
});