define([],
  function(){
    'use strict';

    var imgData;

    function dataParse(){
      this.dataFileUrl = "//i.imgur.com/LawI0lC.png";
      this.config = {
        //이미지 바이너리 뒤에 게임데이터를 붙였기 때문에 이미지만큼의 데이터는 제외시켜야 함.
        imgDataLen : 136
      };

      this.gameData = {};
    };

    /* 비동기로 게임 데이터 가져옴
    * 현재는 게임 파일 용량이 크기 때문에 Imgur에 게임 파일 올려두고 거기서 읽어옴    * */
    dataParse.prototype.loadData = function(callback){
        var oReq = new XMLHttpRequest();
        var that = this;
        oReq.open("GET", this.dataFileUrl, true);
        oReq.responseType = "arraybuffer";

        //oReq.addEventListener("progress", function(a,b,c){
        //  console.log(a)
        //},false);

        oReq.onload = function (oEvent) {
          var arrayBuffer = oReq.response; // Note: not oReq.responseText
          imgData = new Uint8Array(arrayBuffer);
          that.fetching();

          callback();
        };

        oReq.send(null);
    };

    //파일에 있는 주소를 알려줌
    dataParse.prototype.findAddr = function(idx, skiData){
      var addrBuf = new Uint8Array(4);
      addrBuf.set(skiData.subarray(idx, idx+4));
      addrBuf = addrBuf.buffer;
      return new Uint32Array(addrBuf);
    };


    //Object에 게임 데이터를 할당해둠
    dataParse.prototype.fetching = function(){
      var skiData = this.gameData['SKIKING.DAT'] = imgData.subarray(this.config.imgDataLen);

      for(var i=20; i<=180; i = i+20){
        var addrS = this.findAddr(i, skiData);
        var addrE = this.findAddr(i+20, skiData);

        //GET FILE NAME
        var j = i-16;
        var fileName = [];
        while(skiData[j] !=0){
          var data = skiData[j];
          if(data != 0){
            fileName.push(String.fromCharCode(data));
          }
          j++;
        }
        var fileName = fileName.join("");

        //SKISEL.DAT is last file
        if(fileName === "SKISEL.DAT"){
          addrE[0] = skiData.length;//EOF
        }
        this.gameData[fileName] = skiData.subarray(addrS[0], addrE[0]);
      }
    };
    
    dataParse.prototype.get = function(fileName){
      var fileName = fileName.toUpperCase();

      if(typeof this.gameData[fileName] !== "undefined"){
        return this.gameData[fileName];
      } else {
        return false;
      }
    };

    return new dataParse;
});