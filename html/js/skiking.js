define(["underscore", "dataParse"],
  function (_, dataParse) {
    "use strict";

    var engine;

    function skiking() {
      init();
    }

    function init() {
      //laod game data
      Promise.all(
        dataParse.config.dataFileList.map(dataParse.loadData)
      ).then(function () {
        runGame();
      });
    }

    function runGame() {
      require(["asdfJSEngine"], function (asdfJSEngine) {
        engine = new asdfJSEngine(dataParse);
      });
    }

    return skiking;
  });