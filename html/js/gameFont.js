define([],function(){


  var fontConf = {
    Name: "CGAlow.png",

    imageWidth: 518,
    imageHeight: 52,
    fontWidth:16,
    fontHeight: 16,
    printWidth:8,
    printHeight: 8
  }

  var fontBuffer = document.createElement('canvas');
  fontBuffer.width = fontConf.imageWidth;
  fontBuffer.height = fontConf.imageHeight;

  var _completeFunc;
  var fontData;

  function gameFont(data, completeFunc){
    _completeFunc = completeFunc;
    fontData = data;



    this.init();
  }


  gameFont.prototype.init = function(){
    loadFontImage();

    _completeFunc();
  }

  function loadFontImage(){
  }

  function parsingText(String){

  }

  function getImagePos(){

  }


  gameFont.prototype.drawText = function(){

  }



  return gameFont;
});