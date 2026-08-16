import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer({ scene = 'scene1_mystery' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  
  // Audio Gain Nodes
  const masterGainRef = useRef(null);
  const windGainRef = useRef(null);
  const waterGainRef = useRef(null);
  const heartbeatGainRef = useRef(null);
  const musicGainRef = useRef(null);
  const effectGainRef = useRef(null);
  
  // Loops & Timers
  const chordsTimerRef = useRef(null);
  const birdTimerRef = useRef(null);
  const heartbeatTimerRef = useRef(null);

  const activeOscillatorsRef = useRef([]);

  const chords = [
    [130.81, 196.00, 329.63, 493.88, 587.33], // Cmaj9
    [110.00, 164.81, 261.63, 392.00, 493.88], // Am9
    [87.31, 130.81, 220.00, 329.63, 392.00],   // Fmaj9
    [98.00, 146.83, 246.94, 392.00, 587.33]    // G6
  ];
  const currentChordIndexRef = useRef(0);

  // 1. Procedural Wind Noise
  const startWindNoise = (ctx, destination) => {
    try {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoiseSource = ctx.createBufferSource();
      whiteNoiseSource.buffer = noiseBuffer;
      whiteNoiseSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 160;
      windFilter.Q.value = 1.8;

      whiteNoiseSource.connect(windFilter);
      windFilter.connect(destination);

      whiteNoiseSource.start();

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.08;
      lfoGain.gain.value = 0.02;

      lfo.connect(lfoGain);
      lfoGain.connect(destination.gain);
      lfo.start();

      activeOscillatorsRef.current.push(whiteNoiseSource, lfo);
    } catch (e) {
      console.warn("Failed to synthesize wind", e);
    }
  };

  // 2. Procedural Water Flow Noise
  const startWaterNoise = (ctx, destination) => {
    try {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const waterSource = ctx.createBufferSource();
      waterSource.buffer = noiseBuffer;
      waterSource.loop = true;

      const waterFilter = ctx.createBiquadFilter();
      waterFilter.type = 'lowpass';
      waterFilter.frequency.value = 240;
      waterFilter.Q.value = 1.0;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.15; // Slow wave ripple
      lfoGain.gain.value = 40;

      lfo.connect(lfoGain);
      lfoGain.connect(waterFilter.frequency);

      waterSource.connect(waterFilter);
      waterFilter.connect(destination);

      waterSource.start();
      lfo.start();

      activeOscillatorsRef.current.push(waterSource, lfo);
    } catch (e) {
      console.warn("Failed to synthesize water", e);
    }
  };

  // 3. Spatialized Bird Chirps
  const triggerBirdChirp = (forcedPan) => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running' || !effectGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const parentGain = effectGainRef.current;
      const now = ctx.currentTime;

      const chirpsCount = Math.floor(Math.random() * 2) + 2; 
      let offset = 0;

      // Stereo panner for spatial birds chirping
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panner) {
        // Random pan left (-0.8) or right (0.8) if not forced
        panner.pan.value = forcedPan !== undefined ? forcedPan : (Math.random() > 0.5 ? 0.75 : -0.75);
        panner.connect(parentGain);
      }

      for (let i = 0; i < chirpsCount; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        const startFreq = 1400 + Math.random() * 300;
        const endFreq = 2200 + Math.random() * 200;
        osc.frequency.setValueAtTime(startFreq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + offset + 0.08);

        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(0.01, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.08);

        osc.connect(gain);
        if (panner) {
          gain.connect(panner);
        } else {
          gain.connect(parentGain);
        }

        osc.start(now + offset);
        osc.stop(now + offset + 0.09);
        
        offset += 0.12 + Math.random() * 0.08;
      }
    } catch (e) {
      console.warn("Failed to chirp bird", e);
    }
  };

  // 4. Procedural Heartbeat Double-Thump
  const triggerHeartbeatThump = (customVolume) => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running' || !heartbeatGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const parentGain = heartbeatGainRef.current;
      const now = ctx.currentTime;
      const vol = customVolume !== undefined ? customVolume : 0.32;

      const playThump = (time, volume) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, time);
        osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

        osc.connect(gain);
        gain.connect(parentGain);

        osc.start(time);
        osc.stop(time + 0.2);
      };

      playThump(now, vol);
      playThump(now + 0.24, vol * 0.7); // double thump
    } catch (e) {
      console.warn("Heartbeat thump failed", e);
    }
  };

  // 5. Procedural Magical Chimes
  const playChimeSequence = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running' || !effectGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const parentGain = effectGainRef.current;
      const now = ctx.currentTime;
      const notes = [659.25, 783.99, 987.77, 1318.51]; 

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const time = now + idx * 0.08;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.03, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);

        osc.connect(gain);
        gain.connect(parentGain);

        osc.start(time);
        osc.stop(time + 0.35);
      });
    } catch (e) {
      console.warn("Chime sequence failed", e);
    }
  };

  // 6. Play Ambient Chords Loop
  const playChord = (frequencies, ctx, parentGain) => {
    try {
      const now = ctx.currentTime;
      const duration = 5.8;

      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 650;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04 / frequencies.length, now + 1.6);
        gain.gain.setValueAtTime(0.04 / frequencies.length, now + duration - 1.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(parentGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn("Chord trigger failed", e);
    }
  };

  // Expose global YES sound timeline
  const triggerYesSoundDesign = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // 0.0s: Silence ambient loops
      if (musicGainRef.current) musicGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.1);
      if (windGainRef.current) windGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.1);
      if (waterGainRef.current) waterGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.1);
      if (heartbeatGainRef.current) heartbeatGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.1);

      // 0.3s: Deep heartbeat thump
      setTimeout(() => {
        triggerHeartbeatThump(0.45);
      }, 300);

      // 0.5s: Magical rising tone
      setTimeout(() => {
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, t); // C4
        osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.3); // C6
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.31);
      }, 500);

      // 0.8s: Heart impact (chimes)
      setTimeout(() => {
        playChimeSequence();
      }, 800);

      // 1.0s: Firework launch (whoosh)
      setTimeout(() => {
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.2);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.21);
      }, 1000);

      // 1.2s: Fireworks explosions (low boom + crackles)
      setTimeout(() => {
        const t = ctx.currentTime;
        // Boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(70, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.51);

        // Crackles
        for (let i = 0; i < 10; i++) {
          const cTime = t + 0.15 + i * 0.035;
          const cOsc = ctx.createOscillator();
          const cGain = ctx.createGain();
          cOsc.type = 'sine';
          cOsc.frequency.value = 1100 + Math.random() * 1500;
          cGain.gain.setValueAtTime(0, cTime);
          cGain.gain.linearRampToValueAtTime(0.008, cTime + 0.005);
          cGain.gain.exponentialRampToValueAtTime(0.0001, cTime + 0.03);
          cOsc.connect(cGain);
          cGain.connect(ctx.destination);
          cOsc.start(cTime);
          cOsc.stop(cTime + 0.031);
        }
      }, 1200);

      // 1.5s onwards: Beautiful emotional synth pad sweep
      setTimeout(() => {
        const t = ctx.currentTime;
        // Slowly recover background ambient levels
        if (windGainRef.current) windGainRef.current.gain.linearRampToValueAtTime(0.04, t + 2.0);
        if (waterGainRef.current) waterGainRef.current.gain.linearRampToValueAtTime(0.03, t + 2.0);

        const freqs = [261.63, 329.63, 392.00, 523.25, 587.33]; // Cmaj9 pad chords
        freqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc.type = 'sawtooth';
          osc.frequency.value = freq;
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(90, t);
          filter.frequency.exponentialRampToValueAtTime(1300, t + 2.5); // Filter sweep
          
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.08 / freqs.length, t + 1.5);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 5.0);
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(musicGainRef.current);
          
          osc.start(t);
          osc.stop(t + 5.1);
        });
      }, 1500);

    } catch (e) {
      console.warn("YES sound design failed", e);
    }
  };

  // Expose global glass crack sound for LET ME THINK
  const triggerNoSoundDesign = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      // High frequency sweeps mimicking crystal/glass crack
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(3200 - i * 650, now + i * 0.015);
        osc.frequency.exponentialRampToValueAtTime(200, now + i * 0.015 + 0.06);

        gain.gain.setValueAtTime(0, now + i * 0.015);
        gain.gain.linearRampToValueAtTime(0.015, now + i * 0.015 + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.015 + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.015);
        osc.stop(now + i * 0.015 + 0.07);
      }
    } catch (e) {
      console.warn("NO sound design failed", e);
    }
  };

  const startAllAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        
        // Master Volume Gain
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.5, audioCtxRef.current.currentTime + 0.6);
        masterGain.connect(audioCtxRef.current.destination);
        masterGainRef.current = masterGain;

        // Sub Gain Nodes
        musicGainRef.current = audioCtxRef.current.createGain();
        musicGainRef.current.gain.value = 0.3;
        musicGainRef.current.connect(masterGain);

        windGainRef.current = audioCtxRef.current.createGain();
        windGainRef.current.gain.value = 0.04;
        windGainRef.current.connect(masterGain);

        waterGainRef.current = audioCtxRef.current.createGain();
        waterGainRef.current.gain.value = 0.03;
        waterGainRef.current.connect(masterGain);

        heartbeatGainRef.current = audioCtxRef.current.createGain();
        heartbeatGainRef.current.gain.value = 0.55;
        heartbeatGainRef.current.connect(masterGain);

        effectGainRef.current = audioCtxRef.current.createGain();
        effectGainRef.current.gain.value = 0.35;
        effectGainRef.current.connect(masterGain);
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;

      // Start procedural ambient noises
      startWindNoise(ctx, windGainRef.current);
      startWaterNoise(ctx, waterGainRef.current);

      // Play first chord
      playChord(chords[currentChordIndexRef.current], ctx, musicGainRef.current);
      currentChordIndexRef.current = (currentChordIndexRef.current + 1) % chords.length;

      // Ambient chords loop
      if (chordsTimerRef.current) clearInterval(chordsTimerRef.current);
      chordsTimerRef.current = setInterval(() => {
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          playChord(chords[currentChordIndexRef.current], audioCtxRef.current, musicGainRef.current);
          currentChordIndexRef.current = (currentChordIndexRef.current + 1) % chords.length;
        }
      }, 6000);

      // Random bird chirps (spatial left/right)
      const queueBirdChirp = () => {
        const delay = 7000 + Math.random() * 8000;
        birdTimerRef.current = setTimeout(() => {
          triggerBirdChirp();
          queueBirdChirp();
        }, delay);
      };
      queueBirdChirp();
      
    } catch (e) {
      console.warn("Failed to start audio synthesizer", e);
    }
  };

  const stopAllAudio = () => {
    if (chordsTimerRef.current) { clearInterval(chordsTimerRef.current); chordsTimerRef.current = null; }
    if (birdTimerRef.current) { clearTimeout(birdTimerRef.current); birdTimerRef.current = null; }
    if (heartbeatTimerRef.current) { clearInterval(heartbeatTimerRef.current); heartbeatTimerRef.current = null; }

    if (masterGainRef.current && audioCtxRef.current) {
      try {
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
        masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.6);
        
        setTimeout(() => {
          activeOscillatorsRef.current.forEach(osc => {
            try { osc.stop(); } catch (err) {}
          });
          activeOscillatorsRef.current = [];
        }, 700);
      } catch (e) {
        console.warn("Error stopping audio", e);
      }
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      startAllAudio();
      setIsPlaying(true);
    }
  };

  // Sync ambient gains & details dynamically based on active scene prop
  useEffect(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running' || !isPlaying) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      if (scene === 'scene1_mystery') {
        // very faint water, almost unnoticeable wind, no birds
        if (windGainRef.current) windGainRef.current.gain.linearRampToValueAtTime(0.015, now + 1.2);
        if (waterGainRef.current) waterGainRef.current.gain.linearRampToValueAtTime(0.012, now + 1.2);
        if (musicGainRef.current) musicGainRef.current.gain.linearRampToValueAtTime(0.12, now + 1.2);
        if (effectGainRef.current) effectGainRef.current.gain.linearRampToValueAtTime(0.0, now + 1.2);
      } else if (scene === 'scene2_check') {
        // more stars, gentle bird chirp on one side
        if (windGainRef.current) windGainRef.current.gain.linearRampToValueAtTime(0.03, now + 1.2);
        if (waterGainRef.current) waterGainRef.current.gain.linearRampToValueAtTime(0.02, now + 1.2);
        if (musicGainRef.current) musicGainRef.current.gain.linearRampToValueAtTime(0.2, now + 1.2);
        if (effectGainRef.current) effectGainRef.current.gain.linearRampToValueAtTime(0.28, now + 1.2);
        // trigger left pan bird
        setTimeout(() => triggerBirdChirp(-0.75), 1200);
      } else if (scene === 'scene9_suspense') {
        // quiet, birds stop, water faint, wind fades
        if (windGainRef.current) windGainRef.current.gain.linearRampToValueAtTime(0.004, now + 1.8);
        if (waterGainRef.current) waterGainRef.current.gain.linearRampToValueAtTime(0.003, now + 1.8);
        if (musicGainRef.current) musicGainRef.current.gain.linearRampToValueAtTime(0.015, now + 1.8);
        if (effectGainRef.current) effectGainRef.current.gain.linearRampToValueAtTime(0.0, now + 1.8);
      } else if (scene === 'scene10_proposal') {
        // absolute quiet, only heartbeat
        if (windGainRef.current) windGainRef.current.gain.linearRampToValueAtTime(0.0, now + 1.0);
        if (waterGainRef.current) waterGainRef.current.gain.linearRampToValueAtTime(0.0, now + 1.0);
        if (musicGainRef.current) musicGainRef.current.gain.linearRampToValueAtTime(0.0, now + 1.0);
        if (effectGainRef.current) effectGainRef.current.gain.linearRampToValueAtTime(0.0, now + 1.0);
      } else if (scene === 'scene11_yes') {
        // YES Celebration: handled by triggerYesSoundDesign
      } else {
        // Normal scenes restore defaults
        if (windGainRef.current) windGainRef.current.gain.linearRampToValueAtTime(0.04, now + 1.0);
        if (waterGainRef.current) waterGainRef.current.gain.linearRampToValueAtTime(0.03, now + 1.0);
        if (musicGainRef.current) musicGainRef.current.gain.linearRampToValueAtTime(0.3, now + 1.0);
        if (effectGainRef.current) effectGainRef.current.gain.linearRampToValueAtTime(0.35, now + 1.0);
      }
    } catch (e) {
      console.warn("Error modulating scene gains", e);
    }
  }, [scene, isPlaying]);

  // Bind global hooks
  useEffect(() => {
    window.playRomanticChime = () => {
      if (isPlaying) playChimeSequence();
    };

    window.triggerYesSoundDesign = () => {
      if (isPlaying) triggerYesSoundDesign();
    };

    window.triggerNoSoundDesign = () => {
      if (isPlaying) triggerNoSoundDesign();
    };

    window.setHeartbeatActive = (active) => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
      
      if (active && isPlaying) {
        triggerHeartbeatThump();
        heartbeatTimerRef.current = setInterval(() => {
          triggerHeartbeatThump();
        }, 1100);
      }
    };

    return () => {
      window.playRomanticChime = null;
      window.triggerYesSoundDesign = null;
      window.triggerNoSoundDesign = null;
      window.setHeartbeatActive = null;
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className="p-2.5 rounded-full glass-card border border-white/10 text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg relative z-50 group pointer-events-auto"
      aria-label="Toggle Sound"
    >
      {isPlaying ? (
        <>
          <Volume2 size={16} className="animate-pulse text-rose-400" />
          <span className="text-[10px] uppercase tracking-wider font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-rose-300">
            Sound On
          </span>
        </>
      ) : (
        <>
          <VolumeX size={16} />
          <span className="text-[10px] uppercase tracking-wider font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
            Sound Muted
          </span>
        </>
      )}
    </button>
  );
}
