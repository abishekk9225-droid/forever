import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Fingerprint, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import CinematicSceneAtmosphere from './CinematicSceneAtmosphere';

const GOLDEN_COLORS = ['#FBBF24', '#F59E0B', '#D97706', '#B45309', '#FDE047', '#FEF08A', '#FFF59D', '#FFE082'];

function GoldenButterflyExplosion() {
  const butterflies = Array.from({ length: 36 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {butterflies.map((_, i) => {
        const color = GOLDEN_COLORS[i % GOLDEN_COLORS.length];
        const startX = 50 + (Math.random() * 16 - 8);
        const startY = 48 + (Math.random() * 16 - 8);
        const targetX = Math.random() * 100;
        const duration = 2.8 + Math.random() * 3.2;
        const delay = Math.random() * 0.7;
        const size = 14 + Math.random() * 16;

        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: `${startX}vw`, 
              y: `${startY}vh`,
              scale: 0.1,
              rotate: Math.random() * 360
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              x: [`${startX}vw`, `${(startX + targetX) / 2}vw`, `${targetX}vw`], 
              y: [`${startY}vh`, `${startY - 18}vh`, '-15vh'],
              scale: [0.1, 1.3, 1, 0.3],
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: duration, 
              delay: delay, 
              ease: "easeOut" 
            }}
            className="absolute"
            style={{
              filter: `drop-shadow(0 0 10px ${color})`
            }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M12 12 C8 4, 2 6, 2 12 C2 18, 8 20, 12 14 Z"
                fill={color}
                animate={{ scaleX: [1, 0.15, 1] }}
                transition={{ duration: 0.22 + Math.random() * 0.08, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 12px" }}
              />
              <motion.path
                d="M12 12 C16 4, 22 6, 22 12 C22 18, 16 20, 12 14 Z"
                fill={color}
                animate={{ scaleX: [1, 0.15, 1] }}
                transition={{ duration: 0.22 + Math.random() * 0.08, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 12px" }}
              />
              <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function FingerprintLock({ onComplete }) {
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'SCANNING' | 'SUCCESS'
  const [progress, setProgress] = useState(0);
  const [scanInterval, setScanInterval] = useState(null);
  const [successPhase, setSuccessPhase] = useState(0); // 0: initial, 1: heart form, 2: text reveal, 3: golden sweep
  const sweepTimerRef = useRef(null);

  const startScan = (e) => {
    if (e) e.preventDefault();
    if (status === 'SUCCESS' || status === 'SCANNING') return;

    setStatus('SCANNING');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setStatus('SUCCESS');
          triggerCelebration();
          return 100;
        }
        return next;
      });
    }, 150); // 3 seconds total as existing

    setScanInterval(interval);
  };

  const stopScan = () => {
    if (status === 'SUCCESS') return;
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
    setStatus('IDLE');
    setProgress(0);
  };

  const triggerCelebration = () => {
    // 1. Confetti burst
    confetti({
      particleCount: 180,
      spread: 140,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#ffffff', '#f43f5e'],
      shapes: ['circle'],
    });

    // Success staged emotional reveal
    setTimeout(() => setSuccessPhase(1), 600); // Particles form glowing heart
    setTimeout(() => setSuccessPhase(2), 1600); // Reveal memory text
    setTimeout(() => setSuccessPhase(3), 4200); // Golden light sweep across screen

    // Secondary burst
    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#f43f5e', '#fbbf24', '#ffffff'],
      });
    }, 500);

    // Complete and proceed (5s total as existing)
    setTimeout(onComplete, 5200);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanInterval) clearInterval(scanInterval);
      if (sweepTimerRef.current) clearTimeout(sweepTimerRef.current);
    };
  }, [scanInterval]);

  // Dynamic intensity factors based on progress
  const glowOpacity = progress < 30 ? 0.35 : progress < 60 ? 0.65 : progress < 90 ? 0.85 : 1.0;
  const brightnessBoost = progress >= 90 ? 'brightness(1.08)' : 'brightness(1)';

  return (
    <div 
      className="w-full min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none relative z-30 transition-all duration-700"
      style={{ filter: brightnessBoost }}
    >
      {/* Cinematic Shared Atmosphere */}
      <CinematicSceneAtmosphere accentGlow={status === 'SUCCESS' ? 'amber' : 'rose'} />

      {/* Golden Light Sweep across the screen before leaving scene */}
      {successPhase >= 3 && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '100%', opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-y-0 w-full pointer-events-none z-[60]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.35) 50%, transparent 100%)',
          }}
        />
      )}

      {status === 'SUCCESS' && <GoldenButterflyExplosion />}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-7 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-amber-400/30 shadow-[0_0_60px_rgba(244,63,94,0.25)] space-y-6 sm:space-y-8 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {status !== 'SUCCESS' ? (
            <motion.div
              key="scan-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 sm:space-y-8 flex flex-col items-center"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400/90 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Security Verification • Biometric
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Unlock Your Soulmate Match 🔒
                </h2>
              </div>

              {/* Scanning Circular Area with Multiple Fingerprint Rings */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Subtle Concentric Glowing Fingerprint Rings */}
                <div 
                  className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping pointer-events-none"
                  style={{ animationDuration: '3s', opacity: glowOpacity * 0.4 }}
                />
                <div 
                  className="absolute inset-3 rounded-full border border-rose-500/25 pointer-events-none"
                  style={{
                    boxShadow: status === 'SCANNING' ? `0 0 25px rgba(251,191,36,${glowOpacity * 0.4})` : 'none',
                  }}
                />

                {/* SVG Progress Circle Background and Progress */}
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="stroke-rose-950/40"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="stroke-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                    transition={{ ease: "easeOut" }}
                  />
                </svg>

                {/* Living Glowing Fingerprint Sensor Button */}
                <button
                  onMouseDown={startScan}
                  onMouseUp={stopScan}
                  onMouseLeave={stopScan}
                  onTouchStart={startScan}
                  onTouchEnd={stopScan}
                  className={`relative z-10 p-10 rounded-full transition-all duration-300 select-none cursor-pointer outline-none active:scale-95 ${
                    status === 'SCANNING' 
                      ? 'shadow-[0_0_45px_rgba(251,191,36,0.55)] border border-amber-400/70 bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-amber-500/20' 
                      : 'shadow-[0_0_30px_rgba(244,63,94,0.25)] border border-rose-500/35 bg-rose-500/10 hover:border-amber-400/50'
                  }`}
                >
                  <Fingerprint className={`w-18 h-18 transition-all duration-300 ${
                    status === 'SCANNING' 
                      ? 'text-amber-300 scale-105 filter drop-shadow-[0_0_14px_rgba(251,191,36,0.9)]' 
                      : 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                  }`} />
                  
                  {/* Golden Scanning Laser Line */}
                  {status === 'SCANNING' && (
                    <motion.div
                      initial={{ y: -34 }}
                      animate={{ y: 34 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.1, 
                        ease: "easeInOut" 
                      }}
                      className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#fbbf24]"
                    />
                  )}
                </button>
              </div>

              {/* Progress and Staged Message */}
              <div className="space-y-2">
                {status === 'SCANNING' ? (
                  <h3 className="text-xl text-amber-300 font-semibold tracking-wider font-serif animate-pulse drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]">
                    {progress}% Verifying Biometrics...
                  </h3>
                ) : (
                  <h3 className="text-lg text-rose-200 font-medium font-serif">
                    Hold to scan fingerprint
                  </h3>
                )}
                
                <p className="text-xs text-rose-200/70 max-w-[260px] mx-auto leading-relaxed font-serif italic">
                  {status === 'SCANNING' 
                    ? "Keep holding to verify biometric connection... ✨" 
                    : "Press and hold your finger on the sensor to initiate Match Analysis... ✨"}
                </p>
              </div>
            </motion.div>
          ) : (
            /* ================================================================= */
            /* SUCCESS STAGE: CINEMATIC HEART FORMATION & VERIFICATION           */
            /* ================================================================= */
            <motion.div
              key="success-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-4 flex flex-col items-center"
            >
              {/* Glowing Heart with Pulse */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.25, 1] }}
                  transition={{ duration: 0.7, type: 'spring' }}
                  className="p-6 rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-yellow-300/20 border border-amber-400/50 shadow-[0_0_45px_rgba(251,191,36,0.5)]"
                >
                  <Heart className="w-14 h-14 text-amber-300 fill-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.85)] animate-heartbeat" />
                </motion.div>
              </div>

              <div className="space-y-3.5">
                {/* Match Verified Text */}
                <motion.h1 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]"
                >
                  Match Verified ❤️
                </motion.h1>
                
                <motion.p 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl sm:text-3xl font-serif text-white tracking-wide"
                >
                  Abishek <span className="text-rose-500 animate-pulse inline-block">💖</span> Saranya
                </motion.p>

                {/* Staged Emotional Poetry Required */}
                {successPhase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="space-y-1.5 pt-2"
                  >
                    <p className="text-xs sm:text-sm font-serif italic text-slate-200/90 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                      "Some things are not verified by fingerprints..."
                    </p>
                    <p className="text-xs sm:text-sm font-serif font-medium text-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]">
                      "Some things are verified by memories. ❤️"
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
