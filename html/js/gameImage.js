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

  function getTile(spriteData){
    //tile = 10x5
    //tile margin = x:5*2, y 5
    var floor = [0,1,2,3,8,9,16,17,24,25];
    tileResource['skitile'] = [];

    var margin_x = 5;
    var margin_y = 5;
    var size_x = 10;
    var size_y = 5;

    floor.forEach(function(v,k){
      tileResource.push([]);
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

  gameImage.prototype.getTitleImage = function(){
    return savedImage['skititl'];
  }

  return gameImage;
});