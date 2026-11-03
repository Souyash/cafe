/**
 * Web Audio API synthesizer for Kitchen Display and Order alerts.
 * Generates an acoustic chime without needing external mp3 files.
 */
let audioCtx: AudioContext | null = null;

export function playOrderChime() {
  try {
    if (typeof window === "undefined") return;

    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Dual-harmonic chime (D5 -> A5)
    const tones = [587.33, 880.0];
    tones.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.25, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.55);
    });
  } catch (err) {
    console.warn("Audio chime playback blocked or not supported:", err);
  }
}

