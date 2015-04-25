define(["jquery", "underscore"],
  function($, _){
    'use strict';

    var imgData;

    function dataParse(){
      this.dataFileUrl = "//i.imgur.com/LawI0lC.png";
      this.config = {
        imgDataLen : 136
      };

      this.gameData = {};
    };

    /* 비동기로 게임 데이터 가져옴
    * 현재는 게임 파일 용량이 크기 때문에 Imgur에 게임 파일 올려두고 거기서 읽어옴    * */
    dataParse.prototype.getData = function(){
        var oReq = new XMLHttpRequest();
        var that = this;
        oReq.open("GET", this.dataFileUrl, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
          var arrayBuffer = oReq.response; // Note: not oReq.responseText
          imgData = new Uint8Array(arrayBuffer);
          that.fetching();
        };

        oReq.send(null);
    };

    dataParse.prototype.fetching = function(){
      var skidata = this.gameData['skiking.dat'] = imgData.subarray(this.config.imgDataLen);
      var addr = [];
      var k = 0;
      for(var i=20; i<=180; i = i+20){
        var addrBuf = new Uint8Array(4);
        addrBuf.set(skidata.subarray(i, i+4));
        addrBuf = addrBuf.buffer;
        var addrS = new Uint32Array(addrBuf);

        var addrBufe = new Uint8Array(4);
        addrBufe.set(skidata.subarray(i+20, i+24));
        addrBufe = addrBufe.buffer;
        var addrE = new Uint32Array(addrBufe);

        var j = i-16;
        var ii = i+20;
        var fileName = [];
        while(skidata[j] !=0 && typeof skidata[j] !== "undefined" ){
          var data = skidata[j];
          if(data != 0){
            fileName.push(String.fromCharCode(data));
          }
          j++;
        }

        var fileName = fileName.join("");
        if(fileName == "SKISEL.DAT"){
          addrE[0] = this.gameData['skiking.dat'].length;
        }
        this.gameData[fileName] = skidata.subarray(addrS[0], addrE[0]);
      }
    };

    return new dataParse;
})