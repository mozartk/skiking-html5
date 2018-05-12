define(["rawPCM"],
  function(rawPCM){
    "use strict";

    var dSelf; //global
    var _completeFunc;

    function soundFx(sound, completeFunc){
      dSelf = this;
      if(typeof AudioContext === "undefined"){
        this.context = new webkitAudioContext();
      } else {
        this.context = new AudioContext();
      }
      this.soundLoadComplete = false;
      this.sound = sound;
      this.soundLength = sound.length;
      _completeFunc = completeFunc;
      this.cutPoint = [
        ["clap", 0, 61450],
        ["oops", 61451, 64986],
        ["oh", 64987, 68561],
        ["ooch", 68562, 72723],
        ["wow", 72724, 78750],
        ["lookatmego", 78751, 88427],
        ["imlockinghouse", 88428, 101989],
        ["hitthatbaby", 101990, 113068],
        ["ohyeahlookatmego", 113069, 125690],
        ["titleskiking", 125691, 138349],
        ["whee", 138350, 141084],
        ["whoo", 141085, 143361],
        ["ohhoo", 143362, 146393],
        ["ahoh", 146394, 150454],
        ["50hills", 150455, 186300],
        ["sureis", 186301, 201005],
        ["youwillgo", 201006, 214063],
        ["freeguy", 214064,this.soundLength]
      ];
      this.soundObj = {};

      var rawpcm = new rawPCM();
      this.soundCnt = this.cutPoint.length;

      this.dataLoad(rawpcm, 0);
    }

    soundFx.prototype.dataLoad = function(rawpcm, idx){
      if(typeof idx === "undefined") return false;
      if(dSelf.cutPoint.length <= idx) return false;

      var array = dSelf.cutPoint[idx];
      var soundData = rawpcm.getWav(dSelf.sound, array[1], array[2]);

      var fileName = array[0];
      this.context.decodeAudioData(soundData.buffer, function(buffer){
        decodeCallback(buffer, dSelf, fileName);
        dSelf.dataLoad(rawpcm, ++idx);
      });
    }

    soundFx.prototype.play = function(audioName){
      var source = this.context.createBufferSource();
      source.buffer = get(audioName);
      source.connect(this.context.destination);
      source.start(0);
    };

    function decodeCallback(buffer, self, fileName){
      var index = Object.keys(self.soundObj).length;
      var audioName = self.cutPoint[index][0];
      self.soundObj[audioName] = buffer;

      if(index >= self.soundCnt-1){
        self.soundLoadComplete = true;
        if(typeof _completeFunc === "function"){
          _completeFunc.call();
        }
      }

      return;
    };

    function get(audioName){
      if(dSelf.soundLoadComplete) {
        return dSelf.soundObj[audioName];
      } else {
        console.error("audio not loaded.");
        return false;
      }
    }

    return soundFx;
  });



