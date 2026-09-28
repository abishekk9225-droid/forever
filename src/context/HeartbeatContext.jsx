import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { globalAudioEngine } from '../utils/audioEngine';

// Single active heartbeat engine across the entire app
export const globalHeartbeatEngine = globalAudioEngine;

if (typeof window !== 'undefined') {
  window.heartbeatEngine = globalHeartbeatEngine;
}

// ============================================================================
// REACT CONTEXT & PROVIDER
// ============================================================================

const HeartbeatContext = createContext(null);

export function HeartbeatProvider({ children }) {
  const [currentBPM, setCurrentBPM] = useState(54);
  const [pulseState, setPulseState] = useState('IDLE'); // 'IDLE' | 'LUB' | 'DUB'
  const [intensity, setIntensity] = useState(0.24);

  useEffect(() => {
    // Auto-init on first mount
    globalHeartbeatEngine.init();

    // Listen to pulse beats for visual synchronization
    const unsubscribe = globalHeartbeatEngine.subscribeBeat((type, bpm, vol) => {
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
      currentBPM: 54,
      pulseState: 'IDLE',
      intensity: 0.24,
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
