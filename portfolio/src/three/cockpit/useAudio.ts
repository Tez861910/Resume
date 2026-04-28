import { useRef, useCallback, useMemo, useState, useEffect } from "react";

export type AudioOutputLevel = "mute" | "low" | "high";

const OUTPUT_GAIN: Record<AudioOutputLevel, number> = {
  mute: 0,
  low: 0.48,
  high: 1,
};

/**
 * useAudio Hook
 *
 * Manages game audio using Web Audio API for synthesis.
 * Refined for cleaner, less intrusive soundscapes.
 */
export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [outputLevel, setOutputLevel] = useState<AudioOutputLevel>("high");

  const ensureMasterGain = useCallback((ctx: AudioContext) => {
    if (!masterGainRef.current) {
      const master = ctx.createGain();
      master.gain.setValueAtTime(OUTPUT_GAIN[outputLevel], ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;
    }

    return masterGainRef.current;
  }, [outputLevel]);

  // Engine components
  const engineOscRef = useRef<OscillatorNode | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const engineFilterRef = useRef<BiquadFilterNode | null>(null);

  // Static components
  const staticSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const staticGainRef = useRef<GainNode | null>(null);

  const initContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = (window.AudioContext || ((window as unknown) as Record<string, unknown>).webkitAudioContext) as typeof AudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    ensureMasterGain(audioContextRef.current);
    return audioContextRef.current;
  }, [ensureMasterGain]);

  useEffect(() => {
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    master.gain.setTargetAtTime(OUTPUT_GAIN[outputLevel], ctx.currentTime, 0.08);
  }, [outputLevel]);

  // Clean Engine Rumble (Sine + Low Pass)
  const startEngine = useCallback(() => {
    const ctx = initContext();
    if (engineOscRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const master = ensureMasterGain(ctx);

    // Triangle is smoother than sawtooth
    osc.type = "triangle";
    osc.frequency.setValueAtTime(35, ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start();
    engineOscRef.current = osc;
    engineGainRef.current = gain;
    engineFilterRef.current = filter;
  }, [ensureMasterGain, initContext]);

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

    const volume = 0.05 + (speed / 45) * 0.11 + boost * 0.02;
    engineGainRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.2);
  }, []);

  const stopEngine = useCallback(() => {
    if (engineOscRef.current) {
      try {
        engineOscRef.current.stop();
        engineOscRef.current.disconnect();
      } catch {
        // Ignore errors when stopping engine
      }
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
      const master = ensureMasterGain(ctx);

      osc.type = "sine";
      osc.frequency.setValueAtTime(isEnemy ? 180 : 320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    },
    [ensureMasterGain, initContext],
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
    const master = ensureMasterGain(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.035, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    source.start();
    staticSourceRef.current = source;
    staticGainRef.current = gain;
  }, [ensureMasterGain, initContext]);

  const stopStatic = useCallback(() => {
    if (staticSourceRef.current) {
      try {
        staticSourceRef.current.stop();
        staticSourceRef.current.disconnect();
      } catch {
        // Ignore errors when stopping static
      }
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
    const master = ensureMasterGain(ctx);

    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.34, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, [ensureMasterGain, initContext]);

  return useMemo(
    () => ({
      outputLevel,
      setOutputLevel,
      startEngine,
      updateEngine,
      stopEngine,
      playLaser,
      startStatic,
      stopStatic,
      playImpact,
      initContext,
    }),
    [
      outputLevel,
      setOutputLevel,
      startEngine,
      updateEngine,
      stopEngine,
      playLaser,
      startStatic,
      stopStatic,
      playImpact,
      initContext,
    ],
  );
}
