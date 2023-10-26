const APP = {
  audioContext: null,
  oscillator: null,
  gainNode: null,
  isPlaying: false,
  startTime: 0,
  fadeOutScheduled: false, // Added a flag to prevent multiple fade-outs
  cooldown: false, // Added a flag to manage cooldown

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
      APP.fadeOutAndClose();
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
    if (APP.audioContext && !APP.fadeOutScheduled) {
      APP.fadeOutScheduled = true;

      const currentTime = APP.audioContext.currentTime;
      const fadeOutDuration = 0.5; // Adjust the duration as needed

      APP.gainNode.gain.setValueAtTime(1, currentTime);
      APP.gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        currentTime + fadeOutDuration
      );

      setTimeout(() => {
        APP.audioContext.close().then(function () {
          APP.audioContext = null;
          APP.fadeOutScheduled = false; // Reset the flag
        });
      }, fadeOutDuration * 1000); // Convert fadeOutDuration to milliseconds
    }
  },

  CheckPlayOrPause: () => {
    if (APP.cooldown) return; // Exit if cooldown is active
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

      // Set a cooldown period (e.g., 1 second) during which button clicks are ignored
      APP.cooldown = true;
      setTimeout(() => {
        APP.cooldown = false;
      }, 1000); // Adjust the cooldown duration as needed
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
