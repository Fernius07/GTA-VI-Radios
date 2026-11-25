let sharedCtx: AudioContext | null = null;

/**
 * Generates a brief, realistic FM radio tuning burst (~150ms) when changing stations.
 * Pure Web Audio API — zero external asset needed.
 */
export function playFmTuningBurst(volume = 0.5): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!sharedCtx) {
      sharedCtx = new AudioCtx();
    }
    if (sharedCtx.state === 'suspended') {
      void sharedCtx.resume();
    }

    const duration = 0.16;
    const sampleRate = sharedCtx.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = sharedCtx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      // Soft crackly white noise with slight envelope
      const progress = i / frameCount;
      const env = Math.sin(progress * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.45;
    }

    const source = sharedCtx.createBufferSource();
    source.buffer = buffer;

    const filter = sharedCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, sharedCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2800, sharedCtx.currentTime + duration);
    filter.Q.value = 1.4;

    const gain = sharedCtx.createGain();
    const peak = Math.min(0.16, Math.max(0.02, volume * 0.14));
    gain.gain.setValueAtTime(0.001, sharedCtx.currentTime);
    gain.gain.linearRampToValueAtTime(peak, sharedCtx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, sharedCtx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(sharedCtx.destination);
    source.start();
  } catch {
    // Ignore autoplay / audio context errors
  }
}
