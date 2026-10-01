import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function WarmthMeltScene({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const progressRef = useRef(0);
  const isHoldingRef = useRef(false);
  const isCompletedRef = useRef(false);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Robust requestAnimationFrame loop for continuous, uninterrupted charging
  const updateLoop = useCallback(
    (now) => {
      if (isCompletedRef.current) return;

      if (!lastTimeRef.current) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = now;

      if (isHoldingRef.current) {
        // Complete full charge in ~3.2 seconds (~31.25% per second)
        const fillSpeed = 31.25;
        progressRef.current = Math.min(100, progressRef.current + fillSpeed * delta);
        setProgress(progressRef.current);

        // Haptic pulse feedback while charging
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          const currentP = Math.floor(progressRef.current);
          if (currentP > 0 && currentP % 20 === 0) {
            try {
              navigator.vibrate(25);
            } catch {}
          }
        }

        // Completion trigger at 100%
        if (progressRef.current >= 100) {
          isCompletedRef.current = true;
          setIsCompleted(true);

          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate([80, 40, 160]);
            } catch {}
          }

          // Allow user to witness the fully melted awakened heart for ~750ms before proceeding
          setTimeout(() => {
            if (typeof onComplete === 'function') {
              onComplete();
            }
          }, 750);
          return;
        }
      } else {
        // Smoothly decay progress back to 0% if released prematurely
        if (progressRef.current > 0) {
          const decaySpeed = 45; // ~45% per second
          progressRef.current = Math.max(0, progressRef.current - decaySpeed * delta);
          setProgress(progressRef.current);
        }
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    },
    [onComplete]
  );

  const startHolding = (e) => {
    if (isCompletedRef.current) return;
    if (e && e.pointerId && e.currentTarget && e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
    isHoldingRef.current = true;
    setIsHolding(true);
    lastTimeRef.current = performance.now();
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updateLoop);
    }
  };

  const stopHolding = (e) => {
    if (isCompletedRef.current) return;
    if (e && e.pointerId && e.currentTarget && e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
    isHoldingRef.current = false;
    setIsHolding(false);
  };

  // Start continuous loop on mount and clean up on unmount
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [updateLoop]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black/95 px-4 select-none overflow-hidden z-30">
      {/* Background Heat Wave Glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none blur-3xl"
        animate={{
          backgroundColor:
            isHolding || isCompleted
              ? 'rgba(244,63,94,0.3)'
              : 'rgba(56,189,248,0.1)',
          scale: isHolding || isCompleted ? [1, 1.25, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />

      {/* Floating Sparkles during interaction */}
      {(isHolding || isCompleted) && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: [0, 1, 0], x: -30, y: -20, scale: [0.5, 1.2, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
            className="absolute pointer-events-none text-rose-300 z-20"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 60, y: -30 }}
            animate={{ opacity: [0, 1, 0], x: 40, y: -80, scale: [0.5, 1.3, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: 0.5 }}
            className="absolute pointer-events-none text-amber-300 z-20"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20, y: -80 }}
            animate={{ opacity: [0, 1, 0], x: -10, y: -130, scale: [0.4, 1.1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.8 }}
            className="absolute pointer-events-none text-pink-400 z-20"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </>
      )}

      <div className="relative z-10 flex flex-col items-center text-center max-w-md space-y-6">
        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <span className="text-xs font-mono tracking-widest uppercase text-pink-400">
            ✨ WARMTH OF MY HEART ✨
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white leading-relaxed">
            {progress >= 100
              ? 'You melted my whole world... ❤️'
              : 'Hold your thumb to melt the ice and awaken my heart ❄️'}
          </h2>
        </motion.div>

        {/* Interactive Melting Heart Container */}
        <div className="relative flex items-center justify-center w-64 h-64 my-6">
          {/* Circular Progress Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="105"
              stroke="currentColor"
              strokeWidth="6"
              className="text-zinc-800"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="105"
              stroke="url(#gradientMelt)"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 105}
              strokeDashoffset={2 * Math.PI * 105 * (1 - progress / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-75"
            />
            <defs>
              <linearGradient id="gradientMelt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Unified Touch & Pointer Hold Button */}
          <motion.div
            onPointerDown={(e) => {
              e.preventDefault();
              startHolding(e);
            }}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            onPointerCancel={stopHolding}
            onContextMenu={(e) => e.preventDefault()}
            whileTap={{ scale: 0.95 }}
            className="absolute inset-6 rounded-full flex flex-col items-center justify-center cursor-pointer border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-300"
            style={{
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              backgroundColor:
                isHolding || isCompleted
                  ? 'rgba(244,63,94,0.25)'
                  : 'rgba(15,23,42,0.6)',
              boxShadow:
                isHolding || isCompleted
                  ? '0 0 50px rgba(244,63,94,0.6)'
                  : '0 0 30px rgba(56,189,248,0.3)',
            }}
          >
            {/* Heart Icon morphing from Ice Blue to Flaming Ruby */}
            <motion.div
              animate={{
                scale: isHolding || isCompleted ? [1, 1.15, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Heart
                className="w-20 h-20 transition-all duration-700"
                fill={progress > 50 ? '#f43f5e' : progress > 20 ? '#a855f7' : '#38bdf8'}
                style={{
                  color: progress > 50 ? '#fda4af' : '#7dd3fc',
                  filter: `drop-shadow(0 0 ${10 + progress * 0.3}px ${
                    progress > 50 ? '#f43f5e' : '#38bdf8'
                  })`,
                }}
              />
            </motion.div>

            <span className="text-xs font-mono font-semibold text-rose-200 mt-2">
              {progress >= 100
                ? 'Awakened & Melted! ❤️'
                : isHolding
                ? `${Math.round(progress)}% Melting...`
                : 'Press & Hold 🖐️'}
            </span>
          </motion.div>
        </div>

        {/* Footnote */}
        <p className="text-xs text-zinc-400 font-serif italic">
          "Don't let go until the warmth completely takes over..."
        </p>
      </div>
    </div>
  );
}
