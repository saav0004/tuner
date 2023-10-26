const APP = {
  audioContext: null,
  oscillator: null,
  gainNode: null,
  isPlaying: false,
  startTime: 0,

  init: () => {
    APP.addListeners();
  },
  addListeners: () => {
    document
      .getElementById("btnPlay")
      .addEventListener("click", APP.CheckPlayOrPause);
  },
  createAudioContext: () => {
    if (APP.audioContext) {
      APP.audioContext.close().then(function () {
        APP.audioContext = null;
      });
    }
    APP.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  },
  createOscillatorAndGainNode: () => {
    APP.oscillator = APP.audioContext.createOscillator();
    APP.gainNode = APP.audioContext.createGain();
    APP.oscillator.frequency.setValueAtTime(440, APP.audioContext.currentTime);
    APP.gainNode.gain.setValueAtTime(0, APP.audioContext.currentTime);
    APP.oscillator.connect(APP.gainNode);
    APP.gainNode.connect(APP.audioContext.destination);
  },

  fadeOutAndClose: () => {
    const currentTime = APP.audioContext.currentTime;
    const fadeOutDuration = 0.5; // Adjust the duration as needed

    APP.gainNode.gain.setValueAtTime(1, currentTime);
    APP.gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      currentTime + fadeOutDuration
    );

    // Schedule closing of the AudioContext after the fade-out
    setTimeout(() => {
      APP.audioContext.close().then(function () {
        APP.audioContext = null;
      });
    }, fadeOutDuration * 1000); // Convert fadeOutDuration to milliseconds
  },

  CheckPlayOrPause: () => {
    const btn = document.getElementById("btnPlay");
    if (btn.innerHTML === "Play") {
      if (!APP.isPlaying) {
        APP.createAudioContext();
        APP.createOscillatorAndGainNode();
        APP.gainNode.gain.setValueAtTime(0, APP.startTime);

        setTimeout(() => {
          APP.gainNode.gain.linearRampToValueAtTime(
            1,
            APP.audioContext.currentTime + 0.5
          );
        }, 0);

        APP.oscillator.start(0, APP.startTime % 1);
        APP.isPlaying = true;
      }
      btn.innerHTML = "Pause";
    } else {
      if (APP.isPlaying) {
        // Fade out and close the AudioContext
        APP.fadeOutAndClose();
        APP.isPlaying = false;
      }

      btn.innerHTML = "Play";
    }
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
