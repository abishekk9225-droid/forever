import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Fingerprint, Heart } from 'lucide-react';

const GOLDEN_COLORS = ['#FBBF24', '#F59E0B', '#D97706', '#B45309', '#FDE047', '#FEF08A', '#FFF59D', '#FFE082'];

function GoldenButterflyExplosion() {
  const butterflies = Array.from({ length: 45 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {butterflies.map((_, i) => {
        const color = GOLDEN_COLORS[i % GOLDEN_COLORS.length];
        
        // Start from center area of screen
        const startX = 50 + (Math.random() * 16 - 8); // 42vw to 58vw
        const startY = 50 + (Math.random() * 16 - 8); // 42vh to 58vh
        
        // Target positions spread outwards and upwards
        const targetX = Math.random() * 100; // 0vw to 100vw
        const duration = 2.5 + Math.random() * 3.5;
        const delay = Math.random() * 0.6;
        const size = 12 + Math.random() * 18;

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
              y: [`${startY}vh`, `${startY - 20}vh`, '-15vh'],
              scale: [0.1, 1.3, 1, 0.3],
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: duration, 
              delay: delay, 
              ease: "easeOut" 
            }}
            className="absolute shadow-lg"
            style={{
              filter: `drop-shadow(0 0 10px ${color})`
            }}
          >
            {/* Flapping Wings SVG */}
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
              {/* Left Wing */}
              <motion.path
                d="M12 12 C8 4, 2 6, 2 12 C2 18, 8 20, 12 14 Z"
                fill={color}
                animate={{ scaleX: [1, 0.1, 1] }}
                transition={{ duration: 0.2 + Math.random() * 0.1, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 12px" }}
              />
              {/* Right Wing */}
              <motion.path
                d="M12 12 C16 4, 22 6, 22 12 C22 18, 16 20, 12 14 Z"
                fill={color}
                animate={{ scaleX: [1, 0.1, 1] }}
                transition={{ duration: 0.2 + Math.random() * 0.1, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 12px" }}
              />
              {/* Center Body */}
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
    }, 150); // 3 seconds total

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
      particleCount: 200,
      spread: 150,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#ffffff'],
      shapes: ['circle'],
    });

    // 2. Secondary burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#ffffff'],
      });
    }, 400);

    // 3. Complete and proceed
    setTimeout(onComplete, 5000);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [scanInterval]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      {status === 'SUCCESS' && <GoldenButterflyExplosion />}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.25)] space-y-6 sm:space-y-8 relative overflow-hidden animate-glow-pulse"
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
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-400">
                  Security Check
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                  Unlock Your Soulmate Match 🔒
                </h2>
              </div>

              {/* Scanning Circular Area */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Progress Circle Background and Progress */}
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="stroke-rose-950/40"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  {/* Glowing progress line */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="stroke-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                    strokeWidth="4.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
                    transition={{ ease: "easeOut" }}
                  />
                </svg>

                {/* Fingerprint Scanning Button */}
                <button
                  onMouseDown={startScan}
                  onMouseUp={stopScan}
                  onMouseLeave={stopScan}
                  onTouchStart={startScan}
                  onTouchEnd={stopScan}
                  className={`relative z-10 p-9 rounded-full bg-rose-500/10 border border-rose-500/30 transition-all duration-300 select-none cursor-pointer outline-none active:scale-95 ${
                    status === 'SCANNING' 
                      ? 'shadow-[0_0_40px_rgba(251,191,36,0.4)] border-amber-500/50 bg-amber-500/5' 
                      : 'shadow-[0_0_25px_rgba(244,63,94,0.2)] hover:border-rose-400/50'
                  }`}
                >
                  <Fingerprint className={`w-16 h-16 transition-colors duration-300 ${
                    status === 'SCANNING' ? 'text-amber-400' : 'text-rose-400'
                  }`} />
                  
                  {/* Scanning sweep laser line */}
                  {status === 'SCANNING' && (
                    <motion.div
                      initial={{ y: -30 }}
                      animate={{ y: 30 }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.2, 
                        ease: "easeInOut" 
                      }}
                      className="absolute left-4 right-4 h-0.5 bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                    />
                  )}
                </button>
              </div>

              {/* Progress and status message */}
              <div className="space-y-2">
                {status === 'SCANNING' ? (
                  <h3 className="text-xl text-amber-400 font-semibold tracking-wide animate-pulse">
                    {progress}% Scanning...
                  </h3>
                ) : (
                  <h3 className="text-lg text-rose-300 font-medium">
                    Hold to scan fingerprint
                  </h3>
                )}
                
                <p className="text-xs text-rose-200/60 max-w-[240px] mx-auto leading-relaxed">
                  {status === 'SCANNING' 
                    ? "Keep holding to verify biometric connection... ✨" 
                    : "Press and hold your finger on the sensor to initiate Match Analysis... ✨"}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-6"
            >
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="p-5 rounded-full bg-amber-500/10 border border-amber-400/30 shadow-[0_0_35px_rgba(251,191,36,0.35)]"
                >
                  <Heart className="w-12 h-12 text-amber-400 fill-amber-400 animate-heartbeat" />
                </motion.div>
              </div>

              <div className="space-y-3">
                <motion.h1 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                >
                  100% Soulmate Match Found!
                </motion.h1>
                
                <motion.p 
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-2xl sm:text-3xl font-serif text-white tracking-wide"
                >
                  Abishek <span className="text-rose-500">💖</span> Saranya
                </motion.p>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 1 }}
                  className="text-xs text-rose-300 italic tracking-wider uppercase font-mono mt-4"
                >
                  Match verified successfully. Entering Forever.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
