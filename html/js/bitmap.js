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
    imgData['ski.dat']     = imageInit(get("ski.dat"),     pal);
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

  return bitmap;
});