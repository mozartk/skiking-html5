define(["bitmap"],function(Bitmap){
  var bitmap;

  var savedImage = {};
  savedImage['skititl'] = null;
  savedImage['ski'] = null;
  savedImage['skisel'] = null;

  var savedImageSize = {};
  savedImageSize['skititl'] = [8,6];
  savedImageSize['ski'] = [8,10]
  savedImageSize['skisel'] = [4,1];

  var _completeFunc;

  function gameImage(dataParse, completeFunc){
    bitmap = new Bitmap(dataParse);
    _completeFunc = completeFunc;
    init();
  }

  function init(){
    for(var i in savedImage){
      var _canvasBuf = document.createElement('canvas');
      _canvasBuf.width = savedImageSize[i][0] * 40;
      _canvasBuf.height = savedImageSize[i][1] * 40;

      if(i === "ski"){ //sprites... ski.dat
        savedImage[i] = preSprites(i+".dat", _canvasBuf, savedImageSize[i]);
      } else {
        savedImage[i] = preDraw(i+".dat", _canvasBuf, savedImageSize[i]);
      }
    }

    _completeFunc();
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
    var ctx = canvas.getContext('2d');

    for(j=0; j<48; j++){
      for(i=0; i<40; i++){
        for(k=0; k<40; k++) {
          //검은색 이미지는 투명한 이미지
          if(imageName !== "skisel.dat" && imageData[j][i][k] === "000000"){
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

  function preSprites(imageName, canvas){
    var imageData = bitmap.get(imageName);
    var x = 0;
    var y = 0;

    var i, j, k;

    var bs = "";
    var cut = [10,5,6,10,10,10,10,7];

    var ctx = canvas.getContext('2d');


    for(j=0; j<68; j++){
      for(i=0; i<20; i++){
        for(k=0; k<20; k++) {
          //var s = Date.now();
          //검은색 이미지는 투명한 이미지
          if(imageData[j][i][k] === "000000") {
            continue;
          }
          var style = "#"+imageData[j][i][k];
          if(bs != style) {
            ctx.fillStyle = style;
          }

          ctx.fillRect(k+(x*20), i+(y*20), 1, 1);
          bs = style;
        }
      }

      x++;
      if(cut[y] === x) {
        x=0;
        y++;
      }
    }

    return canvas;
  }

  gameImage.prototype.getImage = function(imageName){
    return savedImage[imageName];
  }

  return gameImage;
});