define(["bitmap"],function(Bitmap){
  var bitmap;

  var savedImage = {};
  savedImage['skititl'] = null;
  savedImage['ski'] = null;
  savedImage['skisel'] = null;

  var savedImageSize = {};
  savedImageSize['skititl'] = [8,6];
  savedImageSize['ski'] = [4,5]
  savedImageSize['skisel'] = [2,2];

  var tileIndex = {
    'snow' :       [0,1,2,3,8,9,16,17,24,25]
  };

  var tileResource = {};

  var _completeFunc;

  function gameImage(dataParse, completeFunc){
    window.bitmap = bitmap = new Bitmap(dataParse);
    _completeFunc = completeFunc;
    init();
  }

  function init(){
    for(var i in savedImage){
      var _canvasBuf = document.createElement('canvas');
      _canvasBuf.width = savedImageSize[i][0] * 40;
      _canvasBuf.height = savedImageSize[i][1] * 40;

      savedImage[i] = preDraw(i+".dat", _canvasBuf, savedImageSize[i]);
    }

    parseSprite(savedImage['ski.dat']);

    _completeFunc();
  }

  function parseSprite(spriteData){

    getTile(spriteData);
  }


  function getTile(idx){
    //tile = 10x5
    //tile margin = x:5*2, y 5
    var floor = tileIndex['snow'];
    tileResource['floor'] = [];

    floor.forEach(function(v,k){
      var row = Math.floor(v/8);
      var column = ((v/8) - row)*8;
      var r_row = row * 20;
      var r_column = column * 20;

      tileResource['floor'].push([r_row, r_column]);
    });
  }

  //먼저 버퍼로 가지고 있어야 할 이미지들을 미리 버퍼에 만들어 놓음
  function preDraw(imageName, canvas, size){
    var imageData = bitmap.get(imageName);
    var x_lim = size[0];
    var y_lim = size[1];
    var x = 0;
    var y = 0;

    var i, j, k;

    var bs = "";
    var style = "";

    var ctx = canvas.getContext('2d');


    for(j=0; j<48; j++){
      for(i=0; i<40; i++){
        for(k=0; k<40; k++) {
          //검은색 이미지는 투명한 이미지
          if(imageData[j][i][k] === "000000") {
            continue;
          }

          var style = "#"+imageData[j][i][k];
          if(bs != style) {
            ctx.fillStyle = style;
          }

          ctx.fillRect(k+(x*40), i+(y*40), 1, 1);
          bs = style;
        }
      }

      x++;
      if(x >= x_lim){
        x=0;
        y++;
        if(y >= y_lim) break;
      }
    }

    return canvas;
  }

  gameImage.prototype.getImage = function(imageName){
    return savedImage[imageName];
  }

  return gameImage;
});