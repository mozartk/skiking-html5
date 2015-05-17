define([],function(){


  var fontConf = {
    Name: "CGALow.png",
    imageWidth: 518,
    imageHeight: 52,
    fontWidth:8,
    fontHeight: 8
  }

  var fontBuffer = document.createElement('canvas');
  fontBuffer.imageSmoothingEnabled = false;
  var fontBufCtx  = fontBuffer.getContext('2d');


  var fontImage = document.createElement('canvas');
  fontImage.width = fontConf.imageWidth;
  fontImage.height = fontConf.imageHeight;
  fontImage.imageSmoothingEnabled = false;
  var fontImgCtx = fontImage.getContext('2d');

  var _completeFunc;
  var fontData;
  var screenConf;

  function gameFont(data, completeFunc, config){
    _completeFunc = completeFunc;
    fontData = data;
    screenConf = config;

    this.init();
  }


  gameFont.prototype.init = function(){
    fontBuffer.width = screenConf.rw;
    fontBuffer.height = screenConf.rh;

    loadFontImage();
  }

  function loadFontImage(){
    var blob = new Blob([fontData], {'type': 'image/png'});
    var img = new Image();

    img.onload = function(){
      //폰트 이미지 1/2(실제 게임 사이즈)로 줄임
      fontImgCtx.drawImage(img, 0, 0, img.width/2, img.height/2);

      //색 반전시킴
      var imageData = fontImgCtx.getImageData(0, 0, fontConf.imageWidth, fontConf.imageHeight);
      var data = imageData.data;

      for(var i = 0; i < data.length; i += 4) {
        // red
        data[i] = 255 - data[i];
        // green
        data[i + 1] = 255 - data[i + 1];
        // blue
        data[i + 2] = 255 - data[i + 2];

        //transparent
        if(data[i] === 255 && data[i+1] === 255 && data[i+2] === 255){
          data[i+3] = 0;
        }
      }

      // overwrite original image
      fontImgCtx.putImageData(imageData, 0, 0);

      //load complete
      _completeFunc();
    }
    img.src = URL.createObjectURL(blob);
  }

  function parsingText(text){
    if(typeof text !== "string") {
      console.error('not text');
      return false;
    }

    return strToArr(text).map(getImagePos);
  }


  function strToArr(text){
    var strArr = [];
    var len = text.length;
    for(var i=0; i<len; i++){
      strArr.push(text.charCodeAt(i));
    }

    return strArr;
  }

  function getImagePos(asciiCode){
    var fontStart = 33;
    var fontXcount = 32;

    var resultCode = asciiCode - fontStart;

    // 정확함을 위해 1픽셀 보정함
    var fontPos = {
      x : ((asciiCode%32) * fontConf.fontWidth)-fontConf.fontWidth+1,
      y : ((Math.floor(resultCode/fontXcount) * fontConf.fontHeight))+1
    };

    return fontPos;
  }

  gameFont.prototype.drawText = function(ctx, text, x, y){
    var textArr = parsingText(text);

    fontBufCtx.clearRect(0,0,screenConf.w, screenConf.h);
    var len = textArr.length;
    for(var i=0; i<len; i++){
      fontBufCtx.drawImage(fontImage, textArr[i].x, textArr[i].y, 8, 8,
      x+(i*fontConf.fontWidth), y, 8, 8);
    }

    ctx.drawImage(fontBuffer, 0, 0, screenConf.rw, screenConf.rh);
  }

  return gameFont;
});