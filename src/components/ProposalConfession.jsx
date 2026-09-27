import React, { useState, useEffect, useRef } from 'react';

export default function ProposalConfession({ onAccept, onReject, onNext }) {
  // Sequence phases: 'BLACKOUT' -> 'PHOTO' -> 'SARANYA' -> 'ILOVEYOU' -> 'BUTTONS'
  const [phase, setPhase] = useState('BLACKOUT');
  const audioCtxRef = useRef(null);

  // Web Audio API Heartbeat Generator
  const playHeartbeat = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const playThump = (time, freq, gainVal) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.15);
        gain.gain.setValueAtTime(gainVal, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.2);
      };

      const now = ctx.currentTime;
      playThump(now, 75, 0.4);
      playThump(now + 0.22, 55, 0.3);
    } catch (e) {
      // Audio autoplay fallback
    }
  };

  useEffect(() => {
    // Phase 1: Blackout + Initial Heartbeat
    playHeartbeat();

    // Phase 2 (2s): Photo Reveal
    const t1 = setTimeout(() => {
      setPhase('PHOTO');
      playHeartbeat();
    }, 2000);

    // Phase 3 (4.5s): SARANYA Converges
    const t2 = setTimeout(() => {
      setPhase('SARANYA');
    }, 4500);

    // Phase 4 (7.5s): Climax — I LOVE YOU
    const t3 = setTimeout(() => {
      setPhase('ILOVEYOU');
      playHeartbeat();
    }, 7500);

    // Phase 5 (10s): Buttons Reveal
    const t4 = setTimeout(() => {
      setPhase('BUTTONS');
    }, 10000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const handleYes = () => {
    if (typeof onAccept === 'function') {
      onAccept();
    } else if (typeof onNext === 'function') {
      onNext();
    }
  };

  const handleNo = () => {
    if (typeof onReject === 'function') {
      onReject();
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black text-slate-100 flex flex-col items-center justify-center overflow-hidden select-none z-50">
      
      {/* 1. PHOTO LAYER (Emerges smoothly from darkness) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          phase === 'BLACKOUT' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Ambient Blurred Background */}
        <img
          src="/as.jpg"
          alt="Ambient Memory"
          className="w-full h-full object-cover filter blur-3xl scale-125 opacity-30 pointer-events-none"
        />

        {/* Center Uncropped High-Clarity Portrait with Slow-Motion Zoom */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/as.jpg"
            alt="Saranya & Abishek"
            className="h-full w-auto max-w-none md:max-w-4xl object-contain object-top opacity-90 drop-shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-slow-zoom"
          />
        </div>

        {/* Pulsing Cinematic Dark Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/50 to-black pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
      </div>

      {/* 2. PHASE 1: BLACKOUT PULSE */}
      {phase === 'BLACKOUT' && (
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-pink-500/40 blur-xl animate-ping"></div>
        </div>
      )}

      {/* 3. PHASE 3: SARANYA NAME FORMATION */}
      {phase === 'SARANYA' && (
        <div className="relative z-30 flex flex-col items-center justify-center animate-in fade-in zoom-in-90 duration-700">
          <h2 className="text-4xl md:text-6xl font-serif font-black tracking-[0.3em] bg-gradient-to-r from-amber-200 via-rose-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] animate-pulse">
            SARANYA
          </h2>
          <div className="w-16 h-0.5 bg-pink-500/50 mt-4 rounded-full blur-xs animate-pulse"></div>
        </div>
      )}

      {/* 4. PHASE 4 & 5: GRAND CLIMAX — "I LOVE YOU" */}
      {(phase === 'ILOVEYOU' || phase === 'BUTTONS') && (
        <div className="relative z-30 flex flex-col items-center justify-center text-center px-4 space-y-4 animate-in fade-in zoom-in-95 duration-1000">
          
          {/* Subtle Flying Butterflies Surrounding the Word */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            {['🦋', '🦋', '🦋', '🦋', '🦋', '🦋'].map((b, i) => (
              <span
                key={i}
                className="absolute text-xl md:text-2xl animate-bounce drop-shadow-[0_0_15px_rgba(244,63,94,0.8)] opacity-70"
                style={{
                  top: `${15 + (i * 12)}%`,
                  left: `${10 + (i * 14)}%`,
                  animationDuration: `${2 + (i * 0.4)}s`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Master Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-wider bg-gradient-to-r from-amber-200 via-rose-300 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(244,63,94,0.9)] animate-pulse">
            I LOVE YOU
          </h1>

          {/* Proposal Subtitle */}
          <div className="space-y-1">
            <p className="text-pink-300 font-serif text-lg md:text-xl tracking-widest italic opacity-90">
              Saranya...
            </p>
            <p className="text-slate-200 font-serif text-xl md:text-2xl font-medium tracking-wide drop-shadow-md">
              Will you be mine forever? 💍✨
            </p>
          </div>

          {/* 5. PHASE 5: DELAYED BUTTONS REVEAL */}
          <div
            className={`pt-6 flex items-center justify-center gap-6 transition-all duration-1000 ${
              phase === 'BUTTONS'
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            <button
              onClick={handleYes}
              className="px-10 py-3.5 rounded-full font-bold text-white text-base md:text-lg bg-gradient-to-r from-amber-500 via-pink-600 to-rose-600 hover:opacity-95 shadow-[0_0_40px_rgba(244,63,94,0.7)] transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              YES, FOREVER 💍
            </button>

            <button
              onClick={handleNo}
              className="px-7 py-3 rounded-full font-medium text-slate-300 text-sm md:text-base bg-slate-900/60 border border-slate-700/80 hover:border-pink-500/40 backdrop-blur-md hover:text-white transition-all duration-300 cursor-pointer"
            >
              NO 🤍
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export { ProposalConfession as ProposalScene };
