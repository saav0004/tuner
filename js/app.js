const APP = {
  audioContext: null,
  oscillator: null,
  isPlaying: false,
  startTime: 0,
  gainNode: 0,

  init: () => {
    APP.createAudioContext();
    APP.oscillator = APP.audioContext.createOscillator();

    // Create a gainNode instance
    APP.gainNode = APP.audioContext.createGain();
    APP.gainNode.gain.setValueAtTime(0, APP.audioContext.currentTime);

    // Set the oscillator frequency to 440Hz
    APP.oscillator.frequency.setValueAtTime(440, APP.audioContext.currentTime);

    // Connect oscillator to speakers
    APP.oscillator.connect(APP.gainNode);
    APP.gainNode.connect(APP.audioContext.destination);

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
    oscillator.connect(APP.gainNode);
    return oscillator;
  },

  CheckPlayOrPause: () => {
    const btn = document.getElementById("btnPlay");
    if (btn.innerHTML === "Play") {
      if (!APP.isPlaying) {
        // Start the oscillator
        APP.gainNode.gain.setValueAtTime(0, APP.startTime);

        setTimeout(() => {
          APP.gainNode.gain.linearRampToValueAtTime(
            1,
            APP.audioContext.currentTime + 0.5
          );
        }, 0);

        // APP.gainNode.gain.linearRampToValueAtTime(1, APP.startTime + 0.5);

        APP.oscillator = APP.createOscillator();
        APP.oscillator.start(0, APP.startTime % 1);
        APP.isPlaying = true;
      }
      btn.innerHTML = "Pause";
    } else {
      APP.gainNode.gain.setValueAtTime(1, APP.audioContext.currentTime);
      APP.gainNode.gain.linearRampToValueAtTime(
        0,
        APP.audioContext.currentTime + 0.5
      );

      // Stop the oscillator after the fade-out is complete
      APP.oscillator.stop(APP.audioContext.currentTime + 0.5);
      APP.isPlaying = false;
      btn.innerHTML = "Play";
    }
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
