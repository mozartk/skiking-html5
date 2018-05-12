define([],
  function(){
    "use strict";

    var HeaderObj = {
      "sampleRate" : 10800,
      "channel": 1,
      "bps": 8
    };

    function rawpcm(){
      if(typeof arguments[0] === "object" && arguments.length === 1){
        console.log(arguments[0]);
        for(var key in arguments[0]){
          HeaderObj[key] = arguments[0][key];
        }
      } else if(arguments > 0){
        HeaderObj["sampleRate"] = arguments[0];
        if(typeof arguments[1] !== "undefined") HeaderObj["channel"] = arguments[1];
        if(typeof arguments[2] !== "undefined") HeaderObj["bps"] = arguments[2];
      }
    };

    rawpcm.prototype.makeHeader = function(data){
      // http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html

      var sampleRate = HeaderObj["sampleRate"];
      var channel    = HeaderObj["channel"];
      var bps        = HeaderObj["bps"];

      var blockAlign    = (channel * bps) >> 3;
      var byteRate      = blockAlign * sampleRate;
      var subChunk2Size = data.length * (bps >> 3);
      var chunkSize     = 36 + subChunk2Size;

      var t = this;
      var arr = [];
      arr = arr.concat(t.g("RIFF"),
        t.g(chunkSize, 4),
        t.g("WAVE"),
        t.g("fmt "),
        t.g(16, 4),
        t.g(1, 2),
        t.g(1, 2),
        t.g(sampleRate, 4),
        t.g(byteRate, 4),  //byteRate
        t.g(blockAlign, 2),  //blockAlign
        t.g(8, 2),
        t.g("data"),
        t.g(subChunk2Size, 4)
      );

      return arr;
    };

    rawpcm.prototype.g = rawpcm.prototype.getArray = function(value, size){
      if(typeof value === "string"){
        return this.getStringToArray(value, size);
      } else if( typeof value === "number"){
        return this.getIntToArray(value, size);
      } else {
        console.error("type err");
        return false;
      }
    };

    rawpcm.prototype.getStringToArray = function(string, size){
      var len = string.length;
      var buf = [];

      for(var i = 0; i<len; i++){
        var arr = this.getIntToArray(string.charCodeAt(i));
        buf = buf.concat(arr);
      }

      if(typeof size === "number"){
        this.arrPadding(buf, size);
      }

      return buf;
    };

    rawpcm.prototype.getIntToArray = function(value, size){
      var int;
      var buf = [];
      if(value > 0xffff){
        int = new Uint32Array([value]);
      } else if(value > 0xff){
        int = new Uint16Array([value]);
      } else {
        int = new Uint8Array([value]);
      }

      var bArr = new Uint8Array(int.buffer);
      var n;

      var len = bArr.length;
      //for (let n of bArr) {
      for(var i=0; i<len; i++){
        buf.push(bArr[i]);
      }

      if(typeof size === "number"){
        this.arrPadding(buf, size);
      }
      return buf;
    };

    rawpcm.prototype.arrPadding = function(arr, size){
      while(arr.length < size){
        arr.push(0x00);
      }

      return arr;
    };


    //return header + body
    rawpcm.prototype.concat = function(header, body){
      var headerLen = header.length;
      var dataLen = body.length;

      var dataWav = new Uint8Array(headerLen + dataLen);
      dataWav.set(header);
      dataWav.set(body, headerLen);

      return dataWav;
    };

    //return header + body
    rawpcm.prototype.subarray = function(dataWav, startIdx, size){
      if(typeof size === "number"){
        dataWav = new Uint8Array(dataWav.subarray(startIdx, size));
      } else {
        dataWav = new Uint8Array(dataWav.subarray(startIdx));
      }

      return dataWav;
    };


    //getWav
    rawpcm.prototype.getWav = function(data, startIdx, endIdx){
      var dataWav;

      if(data instanceof ArrayBuffer === true) {
        dataWav = new Uint8Array(data);
      } else {
        dataWav = data;
      }

      if(typeof startIdx === "number"){
        dataWav = this.subarray(dataWav, startIdx, endIdx);
      }

      var header = this.makeHeader(dataWav);
      dataWav = this.concat(header, dataWav);

      return dataWav;
    }

    var rawPCM = rawpcm;
    return rawPCM;
  });