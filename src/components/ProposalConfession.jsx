import React, { useState, useEffect } from 'react';

export default function ProposalConfession({ onAccept, onReject, onNext }) {
  // Timeline Stages: 'BLACKOUT' -> 'PHOTO' -> 'SARANYA' -> 'ILOVEYOU' -> 'BUTTONS'
  const [stage, setStage] = useState('BLACKOUT');
  const [echoPhoto, setEchoPhoto] = useState(null);
  const [celebratingYes, setCelebratingYes] = useState(false);

  // Cinematic Heartbeat Integration with unified persistent engine
  const triggerHeartbeat = () => {
    if (window.heartbeatEngine) {
      window.heartbeatEngine.start();
    }
  };

  useEffect(() => {
    // Initial Climax Heartbeat (BPM: 138, Volume: 0.54)
    if (window.heartbeatEngine) {
      window.heartbeatEngine.setTargetBPM(138, 0.54);
    }
    triggerHeartbeat();

    // Phase 2 (1.8s - 2.5s): Memory Echo flashes
    const tEcho1 = setTimeout(() => {
      setEchoPhoto('/sa.jpg');
    }, 1800);
    const tEcho2 = setTimeout(() => {
      setEchoPhoto('/sk.jpg');
    }, 2200);

    // Phase 2 Climax (2.5s): Main Photo Focus (BPM: 142)
    const tPhoto = setTimeout(() => {
      setEchoPhoto(null);
      setStage('PHOTO');
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(142, 0.56);
      }
    }, 2500);

    // Phase 3 (4.5s): SARANYA text appears (BPM: 145)
    const tSaranya = setTimeout(() => {
      setStage('SARANYA');
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(145, 0.58);
      }
    }, 4500);

    // Brief 250ms silence immediately before "I LOVE YOU" (Emotional suspense)
    const tSilence = setTimeout(() => {
      if (window.heartbeatEngine) {
        window.heartbeatEngine.silence(250);
      }
    }, 6550);

    // Phase 4 (6.8s): Grand Climax "I LOVE YOU" + Lens Flare
    // Requirement 8: "I LOVE YOU" reaches its strongest cinematic point, without clipping
    const tClimax = setTimeout(() => {
      setStage('ILOVEYOU');
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(148, 0.60);
      }
    }, 6800);

    // Phase 5 (9.8s): Buttons Fade in
    const tButtons = setTimeout(() => {
      setStage('BUTTONS');
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(142, 0.52);
      }
    }, 9800);

    return () => {
      clearTimeout(tEcho1);
      clearTimeout(tEcho2);
      clearTimeout(tPhoto);
      clearTimeout(tSaranya);
      clearTimeout(tSilence);
      clearTimeout(tClimax);
      clearTimeout(tButtons);
    };
  }, []);

  const handleYesClick = (e) => {
    setCelebratingYes(true);
    if (window.heartbeatEngine) {
      window.heartbeatEngine.setTargetBPM(88, 0.35);
      window.heartbeatEngine.start();
    }
    setTimeout(() => {
      if (typeof onAccept === 'function') {
        onAccept(e);
      } else if (typeof onNext === 'function') {
        onNext(e);
      }
    }, 600);
  };

  const handleNoClick = (e) => {
    if (typeof onReject === 'function') {
      onReject(e);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#03050c] text-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none z-[100]">
      
      {/* INLINE CSS FOR MOVIE LIGHTING & EFFECTS */}
      <style>{`
        @keyframes edgeGlowCycle {
          0% { box-shadow: inset 0 0 90px rgba(244,63,94,0.32), inset 0 0 170px rgba(251,191,36,0.18); }
          33% { box-shadow: inset 0 0 90px rgba(168,85,247,0.32), inset 0 0 170px rgba(236,72,153,0.22); }
          66% { box-shadow: inset 0 0 90px rgba(6,182,212,0.28), inset 0 0 170px rgba(99,102,241,0.22); }
          100% { box-shadow: inset 0 0 90px rgba(244,63,94,0.32), inset 0 0 170px rgba(251,191,36,0.18); }
        }
        @keyframes cinematicBorderGlow {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(251, 191, 36, 0.4),
              0 0 18px rgba(244, 63, 94, 0.35),
              0 0 38px rgba(236, 72, 153, 0.28),
              0 0 70px rgba(168, 85, 247, 0.18),
              0 0 110px rgba(251, 191, 36, 0.14);
          }
          50% {
            box-shadow:
              0 0 0 1.5px rgba(251, 191, 36, 0.7),
              0 0 30px rgba(244, 63, 94, 0.65),
              0 0 60px rgba(236, 72, 153, 0.45),
              0 0 100px rgba(168, 85, 247, 0.3),
              0 0 145px rgba(251, 191, 36, 0.24);
          }
        }
        @keyframes cinematicBorderSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ambientBackdropPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.58; transform: scale(1.03); }
        }
        @keyframes lensFlareSweep {
          0% { transform: translateX(-150%) skewX(-25deg); opacity: 0; }
          40% { opacity: 0.9; }
          100% { transform: translateX(200%) skewX(-25deg); opacity: 0; }
        }
        @keyframes petalFall {
          0% { transform: translateY(-10vh) rotate(0deg) scale(0.8); opacity: 0; }
          20% { opacity: 0.75; }
          80% { opacity: 0.75; }
          100% { transform: translateY(110vh) rotate(360deg) scale(1.1); opacity: 0; }
        }
        @keyframes shimmerText {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lightRayDrift {
          0%, 100% { transform: rotate(14deg) translateY(0px) scale(1); opacity: 0.18; }
          50% { transform: rotate(18deg) translateY(-20px) scale(1.05); opacity: 0.28; }
        }
        @keyframes lightLeakDrift {
          0%, 100% { opacity: 0.22; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.38; transform: translate(25px, -15px) scale(1.1); }
        }
        @keyframes breathingAura {
          0%, 100% { box-shadow: 0 0 35px rgba(244,63,94,0.65), 0 0 70px rgba(251,191,36,0.35); transform: scale(1); }
          50% { box-shadow: 0 0 55px rgba(244,63,94,0.9), 0 0 90px rgba(251,191,36,0.55); transform: scale(1.03); }
        }
        .cinematic-edge {
          animation: edgeGlowCycle 10s ease-in-out infinite;
        }
        .hero-text-shimmer {
          background-size: 200% auto;
          animation: shimmerText 6s linear infinite;
        }
        .ray-drift {
          animation: lightRayDrift 12s ease-in-out infinite;
        }
        .light-leak-glow {
          animation: lightLeakDrift 9s ease-in-out infinite;
        }
        .breathing-yes {
          animation: breathingAura 3s ease-in-out infinite;
        }
      `}</style>

      {/* SVG NOISE FILTER FOR AUTHENTIC SUBTLE FILM GRAIN */}
      <svg className="hidden">
        <filter id="cinematic-film-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.035] mix-blend-overlay"
        style={{ filter: 'url(#cinematic-film-grain)' }}
      />

      {/* 1. CINEMATIC AMBIENT LIGHTING & SCREEN-EDGE VIGNETTE */}
      <div className="absolute inset-0 cinematic-edge pointer-events-none z-20" />
      
      {/* Radial Vignette outside the photo */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,5,12,0.6) 75%, rgba(3,5,12,0.98) 100%)',
        }}
      />
      
      {/* Warm Edge Light Leaks (Rose/Gold) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/20 to-transparent blur-3xl pointer-events-none z-20 light-leak-glow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-pink-500/20 via-purple-600/15 to-transparent blur-3xl pointer-events-none z-20 light-leak-glow" />

      {/* Diagonal Cinematic Lens Rays (3 layers for depth) */}
      <div className="absolute -inset-20 opacity-20 pointer-events-none z-20 mix-blend-screen bg-gradient-to-tr from-transparent via-rose-300/15 to-amber-200/25 blur-3xl ray-drift" />
      <div className="absolute -inset-10 opacity-15 pointer-events-none z-20 mix-blend-screen bg-gradient-to-bl from-transparent via-pink-400/10 to-indigo-300/15 blur-2xl ray-drift [animation-delay:4s]" />

      {/* Subtle Ambient Rose/Gold Light behind the Photo Frame */}
      <div
        className={`absolute w-full max-w-5xl lg:max-w-6xl h-[60vh] sm:h-[66vh] md:h-[72vh] rounded-[36px] bg-gradient-to-r from-rose-600/20 via-amber-500/15 to-pink-600/20 blur-3xl pointer-events-none transition-opacity duration-1000 -z-10 ${
          stage === 'BLACKOUT' ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ animation: 'ambientBackdropPulse 4s ease-in-out infinite' }}
      />

      {/* 2. WIDE LANDSCAPE CINEMATIC PHOTO FRAME WITH MULTI-LAYER BORDER LIGHTING */}
      <div
        className={`relative w-[96vw] max-w-5xl lg:max-w-6xl h-[60vh] sm:h-[66vh] md:h-[72vh] max-h-[720px] transition-all duration-1000 z-10 ${
          stage === 'BLACKOUT' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Animated Multi-Layer Cinematic Border Glow (Rose, Gold, Pink, Purple) */}
        <div
          className="relative w-full h-full rounded-2xl sm:rounded-3xl p-[2px] md:p-[2.5px] overflow-hidden"
          style={{
            animation: 'cinematicBorderGlow 4s ease-in-out infinite',
            background: 'linear-gradient(135deg, rgba(251,191,36,0.65), rgba(244,63,94,0.75), rgba(236,72,153,0.65), rgba(168,85,247,0.45), rgba(251,191,36,0.6))',
          }}
        >
          {/* Subtle Slow Light Sweep along the Border Perimeter */}
          <div
            className="absolute -inset-[150%] pointer-events-none opacity-45 mix-blend-screen"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(251,191,36,0.4) 60deg, rgba(244,63,94,0.8) 120deg, rgba(236,72,153,0.6) 180deg, rgba(168,85,247,0.4) 240deg, transparent 330deg)',
              animation: 'cinematicBorderSweep 10s linear infinite',
            }}
          />

          {/* Inner Photo Stage */}
          <div className="relative w-full h-full rounded-[14px] sm:rounded-[22px] overflow-hidden bg-[#04060e] flex items-center justify-center">
            
            {/* Ambient Blurred Base (Fills wide landscape aspect ratio with matching atmosphere) */}
            <img
              src="/as.jpg"
              alt="Ambient Landscape Fill"
              className="absolute inset-0 w-full h-full object-cover filter blur-2xl md:blur-3xl scale-110 opacity-35 select-none pointer-events-none"
            />

            {/* Memory Flash Echoes (/sa.jpg & /sk.jpg) */}
            {echoPhoto && (
              <img
                src={echoPhoto}
                alt="Echo Memory"
                className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-30 mix-blend-screen transition-opacity duration-300 animate-pulse pointer-events-none z-10"
              />
            )}

            {/* Crystal-Clear Sharp Foreground Photograph (Zero blur, both faces clearly visible & preserved) */}
            <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none p-1 sm:p-3">
              <img
                src="/as.jpg"
                alt="Saranya & Abishek"
                className="w-full h-full object-contain object-center select-none"
                style={{
                  filter: 'contrast(1.05) brightness(1.02) saturate(1.06)',
                  dropShadow: '0 0 40px rgba(0,0,0,0.85)',
                }}
              />
            </div>

            {/* Subtle Vignette at bottom edge of frame for text contrast without darkening faces */}
            <div
              className="absolute inset-x-0 bottom-0 h-40 sm:h-52 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(to top, rgba(3,5,12,0.88) 0%, rgba(3,5,12,0.45) 45%, transparent 100%)',
              }}
            />

            {/* SARANYA REVEAL (Phase 3) */}
            {stage === 'SARANYA' && (
              <div className="absolute inset-x-0 bottom-8 sm:bottom-12 z-30 flex flex-col items-center justify-center animate-in fade-in zoom-in-90 duration-700">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-[0.35em] bg-gradient-to-r from-amber-200 via-rose-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] animate-pulse">
                  SARANYA
                </h2>
                <div className="w-20 h-0.5 bg-rose-500/50 mt-3 rounded-full blur-xs animate-pulse" />
              </div>
            )}

            {/* "I LOVE YOU" + SUBTITLE + BUTTONS (Phase 4 & 5) */}
            {(stage === 'ILOVEYOU' || stage === 'BUTTONS') && (
              <div className="absolute inset-x-0 bottom-2 sm:bottom-4 md:bottom-6 z-30 flex flex-col items-center justify-center text-center px-4 space-y-1.5 sm:space-y-2.5 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
                
                {/* Hero "I LOVE YOU" with Lens Flare Sweep & Micro-Shimmer */}
                <div className="relative overflow-hidden px-4 py-1">
                  <h1 className="hero-text-shimmer text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-wider bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(244,63,94,0.75)]">
                    I LOVE YOU
                  </h1>
                  {/* Cinematic Lens Flare Streak */}
                  <div
                    className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                    style={{ animation: 'lensFlareSweep 1.8s ease-out' }}
                  />
                </div>

                {/* Proposal Subtitle */}
                <div className="space-y-0.5">
                  <p className="text-pink-300 font-serif text-base sm:text-lg md:text-xl tracking-widest italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    Saranya...
                  </p>
                  <p className="text-slate-100 font-serif text-base sm:text-xl md:text-2xl font-medium tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    "Saranya, will you be mine forever and ever? 💍✨"
                  </p>
                </div>

                {/* 7. DELAYED BUTTONS (Phase 5) */}
                <div
                  className={`pt-2 sm:pt-4 flex items-center justify-center gap-4 sm:gap-6 transition-all duration-1000 ${
                    stage === 'BUTTONS'
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-6 pointer-events-none'
                  }`}
                >
                  {/* YES BUTTON with Breathing Aura & Click Celebration */}
                  <button
                    onClick={handleYesClick}
                    disabled={celebratingYes}
                    className="breathing-yes px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-bold text-white text-sm sm:text-base md:text-lg bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:opacity-95 shadow-[0_0_40px_rgba(244,63,94,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-300 group flex items-center gap-2 cursor-pointer"
                  >
                    <span>Yes, Forever! 💍✨</span>
                  </button>

                  {/* NO BUTTON (Pure Choice, Functional & Clean) */}
                  <button
                    onClick={handleNoClick}
                    disabled={celebratingYes}
                    className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-medium text-slate-300 text-xs sm:text-sm md:text-base bg-slate-900/80 border border-slate-700/80 hover:border-pink-500/40 backdrop-blur-md hover:text-white transition-all duration-300 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                  >
                    No 🤍
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 3. FLOATING ROSE PETALS & GOLDEN MEMORY DUST */}
      {(stage === 'ILOVEYOU' || stage === 'BUTTONS') && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute text-rose-300/60 text-lg md:text-xl"
              style={{
                left: `${(i * 8.5) % 95}%`,
                animation: `petalFall ${7 + (i % 5)}s linear infinite`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              🌸
            </div>
          ))}
          {/* Golden Sparkle Dust */}
          {[...Array(18)].map((_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute rounded-full bg-amber-200/50 blur-[1px] animate-ping"
              style={{
                top: `${(i * 5.5) % 85}%`,
                left: `${(i * 6.2) % 90}%`,
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                animationDuration: `${2.5 + (i * 0.3)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 4. BLACKOUT PULSE (Phase 1) */}
      {stage === 'BLACKOUT' && (
        <div className="relative z-40 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-rose-500/35 blur-xl animate-ping" />
        </div>
      )}

      {/* 8. YES CELEBRATION BURST OVERLAY */}
      {celebratingYes && (
        <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-xs z-50 pointer-events-none flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-6xl animate-ping">💖</div>
        </div>
      )}

    </div>
  );
}

export { ProposalConfession as ProposalScene };
