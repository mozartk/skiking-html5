define(["rawPCM"],
  function(rawPCM){
    'use strict';

    var dSelf; //global

    function soundFx(sound){
      var self = dSelf = this;
      this.context = new AudioContext();
      this.soundLoadComplete = false;
      this.sound = sound;
      this.soundLength = sound.length;
      this.cutPoint = [
        ['clap', 61450],
        ['oops', 64986],
        ['oh', 68561],
        ['ooch', 72723],
        ['wow', 78750],
        ['lookatmego', 88427],
        ['imlockinghouse', 101989],
        ['hitthatbaby', 113068],
        ['ohyeahlookatmego', 125690],
        ['titleskiking', 138349],
        ['whee', 141084],
        ['whoo', 143361],
        ['ohhoo', 146393],
        ['ahoh', 150454],
        ['50hills', 186300],
        ['sureis', 201005],
        ['youwillgo', 214063],
        ['freeguy', this.soundLength]
      ];
      this.soundObj = {};

      var rawpcm = new rawPCM();
      var idx = 0;

      this.soundCnt = this.cutPoint.length;
      this.soundLoadCnt = 0;

      for(var arrIdx in this.cutPoint){
        var array = this.cutPoint[arrIdx];
        var soundData = rawpcm.getWav(this.sound, idx, array[1]);
        idx = array[1];

        this.context.decodeAudioData(soundData.buffer, function(buffer){
          decodeCallback(buffer, self);
        });
      }
    };

    soundFx.prototype.play = function(audioName){
      var source = this.context.createBufferSource();
      source.buffer = get(audioName);
      source.connect(this.context.destination);
      source.start(0);
    };

    function decodeCallback(buffer, self){
      var index = Object.keys(self.soundObj).length;
      var audioName = self.cutPoint[index][0];
      self.soundObj[audioName] = buffer;

      if(index >= self.soundCnt-1){
        self.soundLoadComplete = true;
        if(typeof self.loadComplete === "function"){
          self.loadComplete(self.soundLoadCnt);
        }
      }

      return function(){};
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



