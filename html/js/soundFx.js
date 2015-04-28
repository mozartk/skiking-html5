define(["rawPCM"],
  function(rawPCM){
    'use strict';

    function soundFx(sound){
      var self = this;
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

        ﻿this.context.decodeAudioData(soundData.buffer, function(buffer){
          self.decodeCallback(buffer, self);
        });
      }
    };

    soundFx.prototype.decodeCallback = function(buffer, self){
      var index = Object.keys(this.soundObj).length;
      var audioName = self.cutPoint[index][0];
      self.soundObj[audioName] = buffer;

      if(index >= self.soundCnt){
        if(self.loadComplete === "function"){
          self.loadComplete(self.soundLoadCnt);
        }
      }

      return function(){};
    };

    soundFx.prototype.get = function(audioName){
      if(self.soundLoadComplete) {
        return this.soundObj[audioName];
      } else {
        console.error("audio not loaded.");
        return false;
      }
    };

    soundFx.prototype.play = function(audioName){
      var source = this.context.createBufferSource();
      source.buffer = this.soundObj[audioName];
      source.connect(this.context.destination);
      source.start(0);
    };

    return soundFx;
  });



