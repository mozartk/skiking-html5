define(["rawPCM"],
  function(rawPCM){
    'use strict';

    function soundFx(sound){
      this.sound = sound;
      this.soundLength = sound.length;
      this.cutPoint = [
        ["clap", 30000],
        ["oops", 60000],
        ["oops2", this.soundLength]
      ];
      this.soundObj = {};

      var rawpcm = new rawPCM();

      var idx = 0;
      for(var arrIdx in this.cutPoint){
        var array = this.cutPoint[arrIdx];
        this.soundObj[array[0]] = rawpcm.getWav(this.sound, idx, array[1]);
      }
    };

    soundFx.prototype.get = function(key){
      return this.soundObj[key];
    }

    return soundFx;
  })