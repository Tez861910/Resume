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

  // Missile Launch
  const playMissile = useCallback(() => {
    const ctx = initContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const master = ensureMasterGain(ctx);

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, [ensureMasterGain, initContext]);

  const playDeath = useCallback(() => {
    const ctx = initContext();
    const master = ensureMasterGain(ctx);
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(80, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.8);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc1.connect(gain1);
    gain1.connect(master);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.8);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(40, ctx.currentTime + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.6);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(master);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.6);
  }, [ensureMasterGain, initContext]);

  const playRespawn = useCallback(() => {
    const ctx = initContext();
    const master = ensureMasterGain(ctx);
    const notes = [330, 440, 550];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.15;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }, [ensureMasterGain, initContext]);

  const playDriveCollect = useCallback(() => {
    const ctx = initContext();
    const master = ensureMasterGain(ctx);
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.12;
      osc.frequency.setValueAtTime(freq, t);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }, [ensureMasterGain, initContext]);

  const ambientNodesRef = useRef<{
    oscs: OscillatorNode[];
    gain: GainNode;
  } | null>(null);

  const startAmbient = useCallback(() => {
    const ctx = initContext();
    if (ambientNodesRef.current) return;
    const master = ensureMasterGain(ctx);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.connect(master);
    const oscs: OscillatorNode[] = [];
    const freqs = [42, 63, 84];
    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.connect(g);
      g.connect(gain);
      osc.start();
      oscs.push(osc);
    }
    ambientNodesRef.current = { oscs, gain };
  }, [ensureMasterGain, initContext]);

  const stopAmbient = useCallback(() => {
    if (!ambientNodesRef.current) return;
    for (const osc of ambientNodesRef.current.oscs) {
      try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
    }
    ambientNodesRef.current.gain.disconnect();
    ambientNodesRef.current = null;
  }, []);

  // Background ambient music / drone
  const musicNodesRef = useRef<{
    droneOscs: OscillatorNode[];
    droneGain: GainNode;
    arpInterval: ReturnType<typeof setInterval> | null;
  } | null>(null);

  const startMusic = useCallback(() => {
    const ctx = initContext();
    if (musicNodesRef.current) return;

    const master = ensureMasterGain(ctx);
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.08, ctx.currentTime);
    droneGain.connect(master);

    const droneOscs: OscillatorNode[] = [];
    const droneFreqs = [55, 82.5, 110, 165]; // Root + 5th + octave + 5th above
    const droneTypes: OscillatorType[] = ["sine", "triangle", "sine", "triangle"];

    for (let i = 0; i < droneFreqs.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = droneTypes[i];
      osc.frequency.setValueAtTime(droneFreqs[i], ctx.currentTime);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(g);
      g.connect(droneGain);
      osc.start();
      droneOscs.push(osc);
    }

    // Gentle arpeggiator
    const arpNotes = [110, 138.6, 165, 196, 220, 261.6, 330];
    let arpIndex = 0;
    const arpInterval = setInterval(() => {
      if (!audioContextRef.current) return;
      const note = arpNotes[arpIndex % arpNotes.length];
      arpIndex++;
      const osc = audioContextRef.current.createOscillator();
      const g = audioContextRef.current.createGain();
      const f = audioContextRef.current.createBiquadFilter();
      osc.type = "sine";
      osc.frequency.setValueAtTime(note, audioContextRef.current.currentTime);
      f.type = "lowpass";
      f.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      g.gain.setValueAtTime(0.025, audioContextRef.current.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1.2);
      osc.connect(f);
      f.connect(g);
      g.connect(master);
      osc.start();
      osc.stop(audioContextRef.current.currentTime + 1.2);
    }, 1800);

    musicNodesRef.current = { droneOscs, droneGain, arpInterval };
  }, [ensureMasterGain, initContext]);

  const stopMusic = useCallback(() => {
    if (!musicNodesRef.current) return;
    for (const osc of musicNodesRef.current.droneOscs) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    }
    musicNodesRef.current.droneGain.disconnect();
    if (musicNodesRef.current.arpInterval) {
      clearInterval(musicNodesRef.current.arpInterval);
    }
    musicNodesRef.current = null;
  }, []);

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
      playMissile,
      playDeath,
      playRespawn,
      playDriveCollect,
      startAmbient,
      stopAmbient,
      startMusic,
      stopMusic,
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
      playMissile,
      playDeath,
      playRespawn,
      playDriveCollect,
      startAmbient,
      stopAmbient,
      startMusic,
      stopMusic,
      initContext,
    ],
  );
}
