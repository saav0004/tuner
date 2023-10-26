const APP = {
  audioContext: null,
  oscillator: null,
  isPlaying: false,
  startTime: 0,
  gainNode: null,

  init: () => {
    APP.createAudioContext();
    APP.gainNode = APP.audioContext.createGain();
    APP.gainNode.gain.setValueAtTime(0, APP.audioContext.currentTime);

    APP.addListeners();
  },
  addListeners: () => {
    document.getElementById("btnPlay").addEventListener("click", () => {
      if (APP.isPlaying) {
        APP.stopAudio();
      } else {
        APP.startAudio();
      }
    });
  },
  createAudioContext: () => {
    if (APP.audioContext) {
      APP.audioContext
        .close()
        .then(() => {
          APP.audioContext = null;
        })
        .catch((error) => {
          console.error("Error closing AudioContext: " + error);
        });
    }
    APP.audioContext = new AudioContext();
  },
  startAudio: () => {
    // Check if the AudioContext is in the suspended state and resume it within a user gesture
    if (APP.audioContext.state === "suspended") {
      document.documentElement.addEventListener(
        "mousedown",
        () => {
          APP.audioContext
            .resume()
            .then(() => {
              APP.playSound();
            })
            .catch((error) => {
              console.error("Error resuming audio context: " + error);
            });
        },
        { once: true }
      );
    } else {
      APP.playSound();
    }
  },
  playSound: () => {
    // Start the oscillator
    APP.oscillator = APP.audioContext.createOscillator();
    APP.oscillator.frequency.setValueAtTime(440, APP.audioContext.currentTime);
    APP.oscillator.connect(APP.gainNode);
    APP.oscillator.start();

    // Fade in
    APP.gainNode.gain.linearRampToValueAtTime(
      1,
      APP.audioContext.currentTime + 0.5
    );
    APP.isPlaying = true;
  },
  stopAudio: () => {
    if (APP.oscillator) {
      // Stop and release the oscillator
      APP.oscillator.stop();
      APP.oscillator.disconnect();
      APP.oscillator = null;
    }

    // Smoothly fade out the gain
    APP.gainNode.gain.linearRampToValueAtTime(
      0,
      APP.audioContext.currentTime + 0.5
    );
    APP.isPlaying = false;
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
