define(["underscore"],function(_){
  'use strict';

  var dataParse;
  var imgData = {}

  function bitmap(inst_dataParse){
    dataParse = inst_dataParse;

    init();
  }

  bitmap.prototype.get = function(imageName){
    return imgData[imageName];
  }

  function init(){
    var pal = imgData['ski.pal'] = palleteInit();
    var get = dataParse.get.bind(dataParse);

    imgData['skititl.dat'] = imageInit(get("skititl.dat"), pal);
    imgData['ski.dat']     = SpriteInit(get("ski.dat"),    pal);
    imgData['skisel.dat']  = imageInit(get("skisel.dat"),  pal);
  }


  //pallete init
  function palleteInit(){
    var pallete = dataParse.get("ski.pal");
    var i = 3, len = pallete.length, palArr = [];
    for(i=0;i<len;i=i+3){
      var hex = hxd(pallete[i]*4) +""+ hxd(pallete[i+1]*4) +""+ hxd(pallete[i+2]*4);
      palArr.push(hex);
    }

    return palArr;
  }

  //10진수->16진수
  function hxd(int){
    var hex = int.toString(16);
    if(hex.length == 1) hex = "0"+hex;
    return hex;
  }

  function imageInit(image, palData){
    var skipByte = 2;
    var i = 0, k = 0, j = 0;

    var imageTotal = [];
    var byte = skipByte;

    var imageArr = new Array();
    for(j=0; j<48; j++){
      for(i=0; i<40; i++){
        imageArr[i] = new Array();
        for(k=0; k<40; k++) {
          imageArr[i][k] = palData[image[byte++]];
        }
      }
      var arr = _.clone(imageArr);
      imageTotal.push(arr);

      imageArr = null;
      imageArr = new Array();
    }

    return imageTotal;
  }


  function SpriteInit(image, palData){
    var skipByte = 2;
    var i = 0, k = 0, j = 0;

    var imageTotal = [];
    var byte = skipByte;

    var imageArr = new Array();
    for(j=0; j<68; j++){
      for(i=0; i<20; i++){
        imageArr[i] = new Array();
        imageArr[i+1] = new Array();
        for(k=0; k<20; k++) {
          imageArr[i][k] = palData[image[byte++]];
          imageArr[i+1][k+1] = palData[image[byte+20]];
        }
      }
      var arr = _.clone(imageArr);
      imageTotal.push(arr);

      imageArr = new Array();
    }

    //게임 스프라이트 효율적으로 가져오기 위해서 파싱된 이미지 재배치
    //스키, 보드 등의 자국
    for(i=39;i<=60; i=i+7){
      for(k=0; k<3; k++){
        imageTotal.splice(i,0,imageTotal.splice(10, 1)[0]);
      }
    }

    //눈바닥 이미지 재정리
    for(i=14; i<=18; i++) {
      imageTotal.splice(5, 0, imageTotal.splice(i, 1)[0]);
    }

    return imageTotal;
  }

  return bitmap;
});