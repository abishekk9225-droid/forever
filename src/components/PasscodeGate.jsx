import React, { useState, useRef, useEffect } from 'react';
import { Lock, Unlock, KeyRound, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function PasscodeGate({ onUnlock, onUnlocked }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Exact unlock sequence stages: IDLE -> UNLOCKED_ICON -> GLOW -> SWEEP -> BLACKOUT
  const [stage, setStage] = useState('IDLE');
  const [lockGlowEnhanced, setLockGlowEnhanced] = useState(false);
  const [rosePulse, setRosePulse] = useState(false);

  const timersRef = useRef([]);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const playHeartbeatAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === 'SARANYA26') {
      setError(false);

      // 0.0s: successful passcode detected, button gets stronger glow
      playHeartbeatAudio();
      if (typeof window.unlockAudio === 'function') {
        window.unlockAudio();
      }

      // 0.3s: lock ambient glow increases
      timersRef.current.push(
        setTimeout(() => {
          setLockGlowEnhanced(true);
        }, 300)
      );

      // 0.7s: stage = UNLOCKED_ICON (Lock changes into Unlock)
      timersRef.current.push(
        setTimeout(() => {
          setStage('UNLOCKED_ICON');
        }, 700)
      );

      // 1.0s: stage = GLOW (passcode text gets soft rose/gold glow)
      timersRef.current.push(
        setTimeout(() => {
          setStage('GLOW');
        }, 1000)
      );

      // 1.5s: stage = SWEEP (subtle cinematic light sweep passes across existing /sa.jpg and /sk.jpg)
      timersRef.current.push(
        setTimeout(() => {
          setStage('SWEEP');
        }, 1500)
      );

      // 1.7s: subtle rose light pulse spreads across the screen
      timersRef.current.push(
        setTimeout(() => {
          setRosePulse(true);
        }, 1700)
      );

      // 2.0s: stage = BLACKOUT (smooth cinematic blackout)
      timersRef.current.push(
        setTimeout(() => {
          setStage('BLACKOUT');
        }, 2000)
      );

      // 2.3s: call the EXISTING onUnlock/onSuccess callback
      timersRef.current.push(
        setTimeout(() => {
          const callback = onUnlock || onUnlocked;
          if (typeof callback === 'function') {
            callback();
          }
        }, 2300)
      );
    } else {
      setError(true);
    }
  };

  const isUnlocking = stage !== 'IDLE';

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      <style>{`
        @keyframes photoSweep {
          0% { transform: translateX(-100%); opacity: 0; }
          40% { opacity: 0.55; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes pulseSpread {
          0% { opacity: 0; transform: scale(0.85); }
          50% { opacity: 0.6; }
          100% { opacity: 0; transform: scale(1.35); }
        }
        @keyframes rgbRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes rgbBreathe {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.99);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.02);
          }
        }
        @keyframes rgbSweepFlash {
          0% { filter: brightness(1) drop-shadow(0 0 8px rgba(244,63,94,0.5)); }
          40% { filter: brightness(2.2) drop-shadow(0 0 35px rgba(255,255,255,0.9)); }
          100% { filter: brightness(1) drop-shadow(0 0 8px rgba(244,63,94,0.5)); }
        }

        .rgb-conic-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: max(300%, 160vh);
          height: max(300%, 160vh);
          background: conic-gradient(
            from 0deg,
            #f43f5e,
            #d946ef,
            #a855f7,
            #6366f1,
            #06b6d4,
            #f43f5e
          );
          transform-origin: center center;
          will-change: transform;
          pointer-events: none;
        }

        .rgb-spinner-left {
          animation: rgbRotate 8s linear infinite;
        }

        .rgb-spinner-right {
          animation: rgbRotate 8s linear infinite -2.5s;
        }

        /* Layer 2: Wide Ambient Aura */
        .rgb-aura-container {
          position: absolute;
          inset: -14px;
          border-radius: 2.25rem;
          overflow: hidden;
          filter: blur(28px);
          opacity: 0.45;
          z-index: 0;
          animation: rgbBreathe 3.5s ease-in-out infinite;
          transition: opacity 0.5s ease, filter 0.5s ease;
          will-change: opacity, transform;
        }

        .rgb-aura-right {
          animation-delay: -1.75s;
        }

        /* Hover states */
        .group:hover .rgb-aura-container {
          opacity: 0.85;
          filter: blur(34px);
        }

        .group:hover .rgb-border-wrapper {
          filter: drop-shadow(0 0 12px rgba(244,63,94,0.75)) drop-shadow(0 0 24px rgba(99,102,241,0.5));
        }

        /* Typing passcode state */
        .rgb-aura-typing {
          opacity: 0.75 !important;
          filter: blur(32px) !important;
        }

        /* Unlocking state */
        .rgb-aura-unlocking {
          opacity: 0.95 !important;
          filter: blur(36px) !important;
        }

        /* Sweep Stage Flash */
        .rgb-sweep-flash {
          animation: rgbSweepFlash 0.8s ease-in-out forwards !important;
        }

        /* Layer 1 + 2.5px LED Border Card */
        .rgb-border-wrapper {
          border-radius: 1.5rem;
          padding: 2.5px;
          overflow: hidden;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 0 8px rgba(244,63,94,0.5)) drop-shadow(0 0 16px rgba(168,85,247,0.35));
          transition: filter 0.5s ease, opacity 0.7s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .rgb-conic-spinner {
            animation: none !important;
          }
          .rgb-aura-container {
            animation: none !important;
          }
        }
      `}</style>

      {/* Background Atmosphere: Deep navy/black ambient glow & soft rose radial spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-pink-600/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50 pointer-events-none"></div>

      {/* Tiny floating dust/light specks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '15%', left: '22%', size: '3px', delay: '0s' },
          { top: '28%', left: '78%', size: '2px', delay: '1.2s' },
          { top: '65%', left: '18%', size: '3px', delay: '2.1s' },
          { top: '75%', left: '82%', size: '2px', delay: '0.7s' },
          { top: '40%', left: '12%', size: '2px', delay: '1.8s' },
          { top: '85%', left: '48%', size: '3px', delay: '2.5s' },
          { top: '12%', left: '60%', size: '2px', delay: '0.4s' },
        ].map((speck, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-pink-300/40 blur-[0.5px] animate-pulse"
            style={{
              top: speck.top,
              left: speck.left,
              width: speck.size,
              height: speck.size,
              animationDelay: speck.delay,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>

      <div className="w-full h-full flex items-center justify-between gap-4 md:gap-6 lg:gap-8 max-w-[1920px] mx-auto z-10">
        {/* Left Side Dynamic Full Photo (/sa.jpg) with RGB Lighting */}
        <div
          className={`hidden md:flex flex-1 h-[88vh] relative group animate-fade-in transition-opacity duration-700 ${
            stage === 'BLACKOUT' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Layer 2: Wide Ambient Neon Aura (28px - 34px blur, breathing pulse) */}
          <div
            className={`rgb-aura-container rgb-aura-left pointer-events-none ${
              passcode.length > 0 ? 'rgb-aura-typing' : ''
            } ${isUnlocking ? 'rgb-aura-unlocking' : ''} ${
              stage === 'SWEEP' ? 'rgb-sweep-flash' : ''
            }`}
          >
            <div className="rgb-conic-spinner rgb-spinner-left" />
          </div>

          {/* Layer 1: 2.5px Animated RGB Conic Border Container */}
          <div
            className={`rgb-border-wrapper rgb-border-left w-full h-full relative ${
              stage === 'SWEEP' ? 'rgb-sweep-flash' : ''
            }`}
          >
            <div className="rgb-conic-spinner rgb-spinner-left" />

            {/* Original Photo Container - 100% untouched dimensions & contents */}
            <div className="w-full h-full rounded-[calc(1.5rem-2.5px)] overflow-hidden relative z-10 bg-slate-950 backdrop-blur-md">
              <img
                src="/sa.jpg"
                alt="Saranya"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/80 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>

              {/* Cinematic Light Sweep Overlay during unlock */}
              {(stage === 'SWEEP' || stage === 'BLACKOUT') && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-10"
                  style={{
                    animation: 'photoSweep 0.8s ease-in-out forwards',
                  }}
                />
              )}

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="text-pink-300 text-xs font-medium tracking-wider uppercase text-center flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Forever In My Eyes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Elevated Glassmorphic Passcode Box */}
        <div className="relative z-20 w-full max-w-md shrink-0 bg-slate-900/85 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_60px_rgba(244,63,94,0.3)] text-center space-y-6 mx-auto animate-fade-in">
          {/* Lock Icon Container */}
          <div className="flex justify-center">
            <div
              className={`w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 transition-all duration-500 ${
                lockGlowEnhanced || isUnlocking
                  ? 'shadow-[0_0_35px_rgba(244,63,94,0.7)] border-pink-400 scale-105'
                  : passcode.length > 0
                  ? 'shadow-[0_0_25px_rgba(244,63,94,0.5)] border-pink-400/60 animate-pulse'
                  : 'shadow-[0_0_20px_rgba(244,63,94,0.35)]'
              }`}
            >
              {stage === 'UNLOCKED_ICON' || stage === 'GLOW' || stage === 'SWEEP' || stage === 'BLACKOUT' ? (
                <Unlock className="w-8 h-8 text-pink-200 transition-all duration-300 scale-105" />
              ) : (
                <Lock className="w-8 h-8 text-pink-300 transition-all duration-300" />
              )}
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
              A Little World Made For You <span className="text-pink-500">❤️</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Some memories are meant to be unlocked...
            </p>
          </div>

          {/* Passcode Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter secret word..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                disabled={isUnlocking}
                className={`w-full bg-slate-950/70 placeholder-slate-500 rounded-2xl py-3.5 pl-11 pr-11 text-center text-lg outline-none transition-all shadow-inner ${
                  stage === 'GLOW' || stage === 'SWEEP' || stage === 'BLACKOUT'
                    ? 'text-amber-200 border border-amber-400/70 shadow-[0_0_25px_rgba(251,191,36,0.4)] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] tracking-wider'
                    : passcode.length > 0
                    ? 'text-pink-100 border border-pink-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'text-pink-100 border border-pink-500/30 focus:border-pink-500 focus:shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                }`}
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-pink-400/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400/60 hover:text-pink-300 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide secret word' : 'Show secret word'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-rose-300 text-sm font-medium transition-opacity animate-in fade-in duration-300">
                Not this one... try again ❤️
              </p>
            )}

            <button
              type="submit"
              disabled={isUnlocking}
              className={`w-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-500 transform active:scale-95 cursor-pointer ${
                isUnlocking
                  ? 'shadow-[0_0_45px_rgba(244,63,94,0.8)] scale-[1.02] opacity-100'
                  : 'shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:opacity-95'
              }`}
            >
              Unlock Forever &gt;
            </button>

            {/* Need a Hint? trigger */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-pink-400/80 hover:text-pink-300 text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Need a Hint? 💡</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Dynamic Full Photo (/sk.jpg) with RGB Lighting */}
        <div
          className={`hidden md:flex flex-1 h-[88vh] relative group animate-fade-in transition-opacity duration-700 ${
            stage === 'BLACKOUT' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Layer 2: Wide Ambient Neon Aura (28px - 34px blur, breathing pulse) */}
          <div
            className={`rgb-aura-container rgb-aura-right pointer-events-none ${
              passcode.length > 0 ? 'rgb-aura-typing' : ''
            } ${isUnlocking ? 'rgb-aura-unlocking' : ''} ${
              stage === 'SWEEP' ? 'rgb-sweep-flash' : ''
            }`}
          >
            <div className="rgb-conic-spinner rgb-spinner-right" />
          </div>

          {/* Layer 1: 2.5px Animated RGB Conic Border Container */}
          <div
            className={`rgb-border-wrapper rgb-border-right w-full h-full relative ${
              stage === 'SWEEP' ? 'rgb-sweep-flash' : ''
            }`}
          >
            <div className="rgb-conic-spinner rgb-spinner-right" />

            {/* Original Photo Container - 100% untouched dimensions & contents */}
            <div className="w-full h-full rounded-[calc(1.5rem-2.5px)] overflow-hidden relative z-10 bg-slate-950 backdrop-blur-md">
              <img
                src="/sk.jpg"
                alt="Saranya & Abishek"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-950/20 via-transparent to-slate-950/80 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>

              {/* Cinematic Light Sweep Overlay during unlock */}
              {(stage === 'SWEEP' || stage === 'BLACKOUT') && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-10"
                  style={{
                    animation: 'photoSweep 0.8s ease-in-out forwards',
                  }}
                />
              )}

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="text-pink-300 text-xs font-medium tracking-wider uppercase text-center flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Always In My Heart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Rose Light Pulse at 1.7s */}
      {rosePulse && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background:
              'radial-gradient(circle at center, rgba(244,63,94,0.35) 0%, rgba(244,63,94,0.1) 45%, transparent 70%)',
            animation: 'pulseSpread 0.6s ease-out forwards',
          }}
        />
      )}

      {/* Smooth Cinematic Blackout Layer at 2.0s */}
      {stage === 'BLACKOUT' && (
        <div className="fixed inset-0 bg-black z-50 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-pink-500/30 blur-xl animate-ping"></div>
        </div>
      )}

      {/* Minimal Glassmorphic Cinematic Hint Modal */}
      {showHint && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowHint(false)}
        >
          <div
            className="max-w-sm w-full bg-slate-900/90 border border-pink-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.35)] backdrop-blur-xl relative text-center space-y-4 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 mx-auto shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <Lock className="w-6 h-6 text-pink-300" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Hint #01 🔐
              </h3>
              <p className="text-pink-300/90 text-sm font-medium">
                7 letters + 2 numbers...
              </p>
            </div>

            <div className="bg-pink-950/30 border border-pink-500/20 rounded-2xl p-4 text-xs text-slate-200 space-y-2 leading-relaxed text-left">
              <p className="flex items-center gap-2">
                <span>7 எழுத்துகள் ஒரு பெயர். ❤️</span>
              </p>
              <p className="flex items-center gap-2">
                <span>2 எண்கள் அவளுடைய பிறந்த தேதியிலிருந்து. 🎂</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-pink-500/20 text-xs font-semibold text-pink-200 transition-colors cursor-pointer"
            >
              Got it ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
