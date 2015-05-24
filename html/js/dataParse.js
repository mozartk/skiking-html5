define(["jquery", "underscore"],
  function($, _){
    'use strict';

    var imgData;
    var self;

    function dataParse(){
      self = this;
      //this.dataFileUrl = "//i.imgur.com/LawI0lC.png";
      //this.dataFileUrl = "skiking.dat.png";
      this.dataFileUrl = "skiking.dat";
      this.config = {
        //이미지 바이너리 뒤에 게임데이터를 붙였기 때문에 이미지만큼의 데이터는 제외시켜야 함.
        //imgDataLen : 136,
        imgDataLen : 0,

        //url, Name
        dataFileList:[
          [this.dataFileUrl, 'SKIKING.DAT'],
          ['CGALow.png','CGALOW.PNG']
        ]
      };

      this.gameData = {};
    };

    /* 비동기로 게임 데이터 가져옴
    * 현재는 게임 파일 용량이 크기 때문에 Imgur에 게임 파일 올려두고 거기서 읽어옴    * */
    dataParse.prototype.loadData = function(paramArr){
      var that = self;
      var url = paramArr[0];
      var name = paramArr[1];
      return new Promise(function(resolve, reject){
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("progress", function(e){
          loadState(e);
        });
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
          var arrayBuffer = oReq.response; // Note: not oReq.responseText
          var data = new Uint8Array(arrayBuffer);
          fetching(that, name, data);
          resolve(that.get);
        };

        oReq.onerror = function(oEvent){
          reject(Error('error'));
        }

        oReq.send(null);
      });
    };

    function loadState(e){
      $("#gameDiv").text(e.loaded + "/" + e.total);
    }

    //파일에 있는 주소를 알려줌
    function findAddr(idx, skiData){
      var addrBuf = new Uint8Array(4);
      addrBuf.set(skiData.subarray(idx, idx+4));
      addrBuf = addrBuf.buffer;
      return new Uint32Array(addrBuf);
    };


    //Object에 게임 데이터를 할당해둠
    function fetching(that, name, data){
      if(name === 'SKIKING.DAT') {
        var skiData = that.gameData[name] = data.subarray(that.config.imgDataLen);

        for (var i = 20; i <= 180; i = i + 20) {
          var addrS = findAddr(i, skiData);
          var addrE = findAddr(i + 20, skiData);

          //GET FILE NAME
          var j = i - 16;
          var fileName = [];
          while (skiData[j] != 0) {
            var data = skiData[j];
            if (data != 0) {
              fileName.push(String.fromCharCode(data));
            }
            j++;
          }
          var fileName = fileName.join("");

          //SKISEL.DAT is last file
          if (fileName === "SKISEL.DAT") {
            addrE[0] = skiData.length;//EOF
          }
          that.gameData[fileName] = skiData.subarray(addrS[0], addrE[0]);
        }
      } else {
        that.gameData[name] = data;
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
})