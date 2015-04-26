define([],
  function(){
    'use strict';

    function rawpcm(){
    };

    rawpcm.prototype.makeHeader = function(data){
      // http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html

      var sampleRate = 10800;
      var channel = 1;
      var bps = 8;

      var blockAlign = (channel * bps) >> 3;
      var byteRate = blockAlign * sampleRate;
      var subChunk2Size = data.length * (bps >> 3);
      var chunkSize = 36 + subChunk2Size;
      
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
      for (let n of bArr) {
        buf.push(n);
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

    rawpcm.prototype.getWav = function(data){
      var dataLen = data.length;
      var header = this.makeHeader(data);
      var headerLen = header.length;

      var dataWav = new Uint8Array(headerLen + dataLen);
      dataWav.set(header);
      dataWav.set(data, headerLen);

      return dataWav;
    }

    var rawPCM = rawpcm;
    return new rawPCM;
  });