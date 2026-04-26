import { useRef, useCallback } from "react";

/**
 * useAudio Hook
 *
 * Manages game audio using Web Audio API for synthesis.
 * Refined for cleaner, less intrusive soundscapes.
 */
export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Engine components
  const engineOscRef = useRef<OscillatorNode | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const engineFilterRef = useRef<BiquadFilterNode | null>(null);

  // Static components
  const staticSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const staticGainRef = useRef<GainNode | null>(null);

  const initContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Clean Engine Rumble (Sine + Low Pass)
  const startEngine = useCallback(() => {
    const ctx = initContext();
    if (engineOscRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Triangle is smoother than sawtooth
    osc.type = "triangle";
    osc.frequency.setValueAtTime(35, ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    engineOscRef.current = osc;
    engineGainRef.current = gain;
    engineFilterRef.current = filter;
  }, [initContext]);

  const updateEngine = useCallback((speed: number, boost: number) => {
    const ctx = audioContextRef.current;
    if (
      !ctx ||
      !engineOscRef.current ||
      !engineGainRef.current ||
      !engineFilterRef.current
    )
      return;

    const freq = 35 + speed * 0.5 + boost * 15;
    engineOscRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 0.2);

    // Filter opens up as you go faster
    const filterFreq = 120 + speed * 2;
    engineFilterRef.current.frequency.setTargetAtTime(
      filterFreq,
      ctx.currentTime,
      0.2,
    );

    const volume = 0.03 + (speed / 50) * 0.05;
    engineGainRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.2);
  }, []);

  const stopEngine = useCallback(() => {
    if (engineOscRef.current) {
      try {
        engineOscRef.current.stop();
        engineOscRef.current.disconnect();
      } catch (e) {}
      engineOscRef.current = null;
    }
    if (engineGainRef.current) {
      engineGainRef.current.disconnect();
      engineGainRef.current = null;
    }
  }, []);

  // Soft Laser Pulse
  const playLaser = useCallback(
    (isEnemy: boolean = false) => {
      const ctx = initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(isEnemy ? 180 : 320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    },
    [initContext],
  );

  // Filtered Radio Static
  const startStatic = useCallback(() => {
    const ctx = initContext();
    if (staticSourceRef.current) return;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.015, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    staticSourceRef.current = source;
    staticGainRef.current = gain;
  }, [initContext]);

  const stopStatic = useCallback(() => {
    if (staticSourceRef.current) {
      try {
        staticSourceRef.current.stop();
        staticSourceRef.current.disconnect();
      } catch (e) {}
      staticSourceRef.current = null;
    }
    if (staticGainRef.current) {
      staticGainRef.current.disconnect();
      staticGainRef.current = null;
    }
  }, []);

  // Deep Impact
  const playImpact = useCallback(() => {
    const ctx = initContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, [initContext]);

  return {
    startEngine,
    updateEngine,
    stopEngine,
    playLaser,
    startStatic,
    stopStatic,
    playImpact,
    initContext,
  };
}
