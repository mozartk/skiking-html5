//v0.0.1
define(["jquery", "underscore"],  function($, _){
    'use strict';
  var currentLayerLevel = 100;
  var storeLayer = [];

  //default layer option
  var layerOption = {
    "keyEvent": ["keyup", "keydown", "keypress", "click"],
    "visible": true
  }

  function asdfJSEngine(){
    eventInit();
    this.addLayer(layerOption);
  };

  asdfJSEngine.prototype.addLayer = function(newLayerOption){
    var layerOption = _.extend(layerOption, newLayerOption);

    _addLayer(layerOption);
  }

  function _addLayer(layerOption){
    console.log(layerOption);
  }

  function setVisible(visible){
    console.log(visible);
  }

  function delLayer(){

  }

  function changeLayer(){

  }

  function eventInit(){
    var gameDivE = document.getElementById('gameDiv').addEventListener;
    gameDivE("keydown", eventDistribute, false);
    gameDivE("keyup", eventDistribute, false);
    gameDivE("click", eventDistribute, false);
    gameDivE("keypress", eventDistribute, false);
  }

  function eventDistribute(){
    getCurrentLayer().sendEvent(arguments[e]);
  }

  return asdfJSEngine;
});