import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ============================================================================
// SINGLETON CINEMATIC HEARTBEAT ENGINE (Web Audio API)
// ============================================================================

class HeartbeatAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.filterNode = null;
    this.schedulerTimer = null;

    // Heartbeat BPM & Volume State
    this.currentBPM = 56;
    this.targetBPM = 56;
    this.currentVolume = 0.12;
    this.targetVolume = 0.12;

    this.isMuted = false;
    this.silenceUntil = 0;
    this.isPaused = false;
    this.nextBeatTime = 0;

    // Listeners for visual sync
    this.beatListeners = new Set();

    // Bind methods
    this.scheduleLoop = this.scheduleLoop.bind(this);
    this.handleUserInteraction = this.handleUserInteraction.bind(this);
  }

  init() {
    if (this.audioCtx) return;

    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.targetVolume, this.audioCtx.currentTime);

      // Low-pass Filter for deep, warm, chest-resonant heartbeat
      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(180, this.audioCtx.currentTime);
      this.filterNode.Q.setValueAtTime(2.0, this.audioCtx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.audioCtx.destination);

      this.nextBeatTime = this.audioCtx.currentTime + 0.1;

      // Start Scheduler loop
      if (!this.schedulerTimer) {
        this.schedulerTimer = setInterval(this.scheduleLoop, 35);
      }
    } catch (e) {
      console.warn('AudioContext initialization deferred:', e);
    }

    // Attach global user interaction listeners to resume audio if suspended
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.handleUserInteraction, { passive: true });
      window.addEventListener('touchstart', this.handleUserInteraction, { passive: true });
      window.addEventListener('keydown', this.handleUserInteraction, { passive: true });
    }
  }

  handleUserInteraction() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  start() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    this.isPaused = false;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.masterGain && this.audioCtx) {
      const target = this.isMuted ? 0 : this.currentVolume;
      this.masterGain.gain.setTargetAtTime(target, this.audioCtx.currentTime, 0.05);
    }
  }

  setTargetBPM(bpm, volume) {
    if (typeof bpm === 'number' && bpm > 0) {
      this.targetBPM = bpm;
    }
    if (typeof volume === 'number' && volume >= 0) {
      this.targetVolume = volume;
    }
    // Auto start if not initialized
    if (!this.audioCtx) {
      this.init();
    }
  }

  // Dramatic silence (e.g. 150-250ms silence immediately before "I LOVE YOU")
  silence(durationMs = 250) {
    if (!this.audioCtx) return;
    this.silenceUntil = this.audioCtx.currentTime + durationMs / 1000;
  }

  // Precision Web Audio Heartbeat Synthesizer: "LUB" followed by "DUB"
  playBeat(time, bpm, volume) {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;

    // Time gap between LUB and DUB shortens slightly as BPM accelerates
    const lubDubGap = Math.max(0.09, Math.min(0.15, 0.14 * (75 / Math.max(50, bpm))));

    // 1. "LUB" - Deep low-frequency pulse (55-75 Hz, short attack, exponential decay)
    try {
      const oscLub = this.audioCtx.createOscillator();
      const gainLub = this.audioCtx.createGain();
      oscLub.type = 'sine';
      oscLub.frequency.setValueAtTime(68, time);
      oscLub.frequency.exponentialRampToValueAtTime(40, time + 0.15);

      gainLub.gain.setValueAtTime(0.0001, time);
      gainLub.gain.linearRampToValueAtTime(volume, time + 0.024);
      gainLub.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

      // Deep sub-harmonic layer for chest resonance
      const subLub = this.audioCtx.createOscillator();
      const subGainLub = this.audioCtx.createGain();
      subLub.type = 'sine';
      subLub.frequency.setValueAtTime(38, time);
      subLub.frequency.exponentialRampToValueAtTime(26, time + 0.16);

      subGainLub.gain.setValueAtTime(0.0001, time);
      subGainLub.gain.linearRampToValueAtTime(volume * 0.35, time + 0.024);
      subGainLub.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

      oscLub.connect(gainLub);
      gainLub.connect(this.filterNode);
      subLub.connect(subGainLub);
      subGainLub.connect(this.filterNode);

      oscLub.start(time);
      oscLub.stop(time + 0.17);
      subLub.start(time);
      subLub.stop(time + 0.17);

      // 2. "DUB" - Slightly higher frequency (75-110 Hz, shorter and softer)
      const tDub = time + lubDubGap;
      const oscDub = this.audioCtx.createOscillator();
      const gainDub = this.audioCtx.createGain();
      oscDub.type = 'sine';
      oscDub.frequency.setValueAtTime(92, tDub);
      oscDub.frequency.exponentialRampToValueAtTime(54, tDub + 0.11);

      gainDub.gain.setValueAtTime(0.0001, tDub);
      gainDub.gain.linearRampToValueAtTime(volume * 0.7, tDub + 0.018);
      gainDub.gain.exponentialRampToValueAtTime(0.0001, tDub + 0.12);

      oscDub.connect(gainDub);
      gainDub.connect(this.filterNode);

      oscDub.start(tDub);
      oscDub.stop(tDub + 0.13);

      // Broadcast visual triggers
      this.notifyListeners('LUB', bpm, volume);
      setTimeout(() => {
        this.notifyListeners('DUB', bpm, volume);
      }, lubDubGap * 1000);
    } catch {}
  }

  // Lookahead Scheduler
  scheduleLoop() {
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;

    // Smooth BPM and Volume interpolation
    this.currentBPM += (this.targetBPM - this.currentBPM) * 0.07;
    this.currentVolume += (this.targetVolume - this.currentVolume) * 0.07;

    // Update master gain
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, now);
    }

    // Schedule beats within lookahead window (120ms)
    while (this.nextBeatTime < now + 0.12) {
      if (!this.isPaused && this.nextBeatTime > this.silenceUntil) {
        this.playBeat(this.nextBeatTime, this.currentBPM, this.currentVolume);
      }

      // Cardiac cycle period: 60 / BPM
      const beatInterval = 60 / Math.max(45, this.currentBPM);
      this.nextBeatTime += beatInterval;
    }
  }

  subscribe(callback) {
    this.beatListeners.add(callback);
    return () => this.beatListeners.delete(callback);
  }

  notifyListeners(type, bpm, volume) {
    this.beatListeners.forEach((cb) => {
      try {
        cb(type, bpm, volume);
      } catch {}
    });
  }

  destroy() {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', this.handleUserInteraction);
      window.removeEventListener('touchstart', this.handleUserInteraction);
      window.removeEventListener('keydown', this.handleUserInteraction);
    }
  }
}

// Single active heartbeat engine across the entire app
const globalHeartbeatEngine = new HeartbeatAudioEngine();

if (typeof window !== 'undefined') {
  window.heartbeatEngine = globalHeartbeatEngine;
}

// ============================================================================
// REACT CONTEXT & PROVIDER
// ============================================================================

const HeartbeatContext = createContext(null);

export function HeartbeatProvider({ children }) {
  const [currentBPM, setCurrentBPM] = useState(56);
  const [pulseState, setPulseState] = useState('IDLE'); // 'IDLE' | 'LUB' | 'DUB'
  const [intensity, setIntensity] = useState(0.12);

  useEffect(() => {
    // Auto-init on first mount
    globalHeartbeatEngine.init();

    // Listen to pulse beats for visual synchronization
    const unsubscribe = globalHeartbeatEngine.subscribe((type, bpm, vol) => {
      setCurrentBPM(Math.round(bpm));
      setIntensity(vol);
      setPulseState(type);
      setTimeout(() => {
        setPulseState('IDLE');
      }, 140);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const setTargetBPM = useCallback((bpm, volume) => {
    globalHeartbeatEngine.setTargetBPM(bpm, volume);
  }, []);

  const silence = useCallback((ms) => {
    globalHeartbeatEngine.silence(ms);
  }, []);

  const start = useCallback(() => {
    globalHeartbeatEngine.start();
  }, []);

  const pause = useCallback(() => {
    globalHeartbeatEngine.pause();
  }, []);

  const resume = useCallback(() => {
    globalHeartbeatEngine.resume();
  }, []);

  return (
    <HeartbeatContext.Provider
      value={{
        currentBPM,
        pulseState,
        intensity,
        setTargetBPM,
        silence,
        start,
        pause,
        resume,
        engine: globalHeartbeatEngine,
      }}
    >
      {children}
    </HeartbeatContext.Provider>
  );
}

export function useHeartbeat() {
  const context = useContext(HeartbeatContext);
  if (!context) {
    return {
      currentBPM: 56,
      pulseState: 'IDLE',
      intensity: 0.12,
      setTargetBPM: (bpm, vol) => globalHeartbeatEngine.setTargetBPM(bpm, vol),
      silence: (ms) => globalHeartbeatEngine.silence(ms),
      start: () => globalHeartbeatEngine.start(),
      pause: () => globalHeartbeatEngine.pause(),
      resume: () => globalHeartbeatEngine.resume(),
      engine: globalHeartbeatEngine,
    };
  }
  return context;
}

// ============================================================================
// VISUAL AUDIO SYNCHRONIZATION OVERLAY
// - Every LUB: background glow slightly expands, vignette gently pulses
// - Every DUB: subtle particles slightly brighten
// - As BPM increases: glow becomes stronger, visual tension increases
// - Elegant, subtle, non-intrusive (pointer-events-none)
// ============================================================================

export function HeartbeatVisualSync() {
  const { pulseState, currentBPM } = useHeartbeat();

  // Normalized intensity from 0.05 to 1.0 based on currentBPM (52 to 145)
  const normalizedScale = Math.min(1.0, Math.max(0.1, (currentBPM - 50) / 95));
  const isLub = pulseState === 'LUB';
  const isDub = pulseState === 'DUB';

  return (
    <div className="fixed inset-0 pointer-events-none z-[12] overflow-hidden select-none">
      {/* Subtle Screen-Edge Vignette Breathing on LUB */}
      <div
        className="absolute inset-0 transition-all duration-200 ease-out"
        style={{
          boxShadow: isLub
            ? `inset 0 0 ${80 + normalizedScale * 120}px rgba(244, 63, 94, ${0.12 + normalizedScale * 0.28})`
            : `inset 0 0 50px rgba(244, 63, 94, 0.04)`,
          transform: isLub ? `scale(${1 + normalizedScale * 0.02})` : 'scale(1)',
        }}
      />

      {/* Gentle Center Heart Ambient Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out pointer-events-none"
        style={{
          width: isLub ? `${350 + normalizedScale * 250}px` : `${280 + normalizedScale * 180}px`,
          height: isLub ? `${350 + normalizedScale * 250}px` : `${280 + normalizedScale * 180}px`,
          background: `radial-gradient(circle, rgba(244, 63, 94, ${
            isLub ? 0.08 + normalizedScale * 0.16 : 0.03
          }) 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Subtle Floating Sparkle Dots Brightening on DUB */}
      <div
        className="absolute inset-0 transition-opacity duration-150 ease-out pointer-events-none"
        style={{
          opacity: isDub ? 0.75 + normalizedScale * 0.25 : 0.2,
        }}
      >
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-pink-300 blur-[0.5px]" />
        <div className="absolute top-[35%] right-[18%] w-2 h-2 rounded-full bg-rose-400 blur-[0.5px]" />
        <div className="absolute bottom-[28%] left-[22%] w-1.5 h-1.5 rounded-full bg-pink-200 blur-[0.5px]" />
        <div className="absolute bottom-[20%] right-[25%] w-2 h-2 rounded-full bg-rose-300 blur-[0.5px]" />
      </div>
    </div>
  );
}
