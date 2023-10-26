const APP = {
  audioContext: null,
  oscillator: null,
  isPlaying: false,
  startTime: 0,

  init: () => {
    APP.createAudioContext();
    APP.oscillator = APP.audioContext.createOscillator();

    // Set the oscillator frequency to 440Hz

    APP.gainNode = APP.audioContext.createGain();
    APP.gainNode.gain.setValueAtTime(0, APP.audioContext.currentTime);

    APP.oscillator.frequency.setValueAtTime(440, APP.audioContext.currentTime);

    // Connect oscillator to speakers
    APP.oscillator.connect(APP.audioContext.destination);

    APP.addListeners();
  },
  addListeners: () => {
    document
      .getElementById("btnPlay")
      .addEventListener("click", APP.CheckPlayOrPause);
  },
  createAudioContext: () => {
    if (APP.audioContext) {
      // Close and nullify the existing AudioContext if it exists
      APP.audioContext.close();
      APP.audioContext = null;
    }
    // Create a new AudioContext
    APP.audioContext = new AudioContext();
  },
  createOscillator: () => {
    // Create a new oscillator instance
    const oscillator = APP.audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(440, APP.audioContext.currentTime);
    oscillator.connect(APP.audioContext.destination);
    return oscillator;
  },

  CheckPlayOrPause: () => {
    const btn = document.getElementById("btnPlay");
    if (btn.innerHTML === "Play") {
      if (!APP.isPlaying) {
        // Start the oscillator
        APP.startTime = APP.audioContext.currentTime;
        APP.oscillator = APP.createOscillator();
        APP.oscillator.start(0, APP.startTime % 1);
        APP.isPlaying = true;
      }
      btn.innerHTML = "Pause";
    } else {
      APP.oscillator.stop();
      APP.isPlaying = false;
      btn.innerHTML = "Play";
    }
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
