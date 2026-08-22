import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function WarmthMeltScene({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isHolding) {
      const startTime = Date.now();
      const duration = 5000; // 5 seconds

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(currentProgress);

        // Gentle pulse vibration if supported
        if (navigator.vibrate && currentProgress % 20 < 5) {
          navigator.vibrate(30);
        }

        if (currentProgress >= 100) {
          clearInterval(timerRef.current);
          if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
          setTimeout(() => {
            onComplete();
          }, 600);
        }
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHolding, onComplete]);

  const handleStart = () => setIsHolding(true);
  const handleEnd = () => setIsHolding(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black/95 px-4 select-none overflow-hidden z-30">
      
      {/* Background Heat Wave Glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none blur-3xl"
        animate={{
          backgroundColor: isHolding ? 'rgba(244,63,94,0.25)' : 'rgba(56,189,248,0.1)',
          scale: isHolding ? [1, 1.2, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />

      {/* Floating Sparkles during interaction */}
      {isHolding && (
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
              ? "You melted my whole world... ❤️" 
              : "Hold your thumb to melt the ice and awaken my heart ❄️"}
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

          {/* Touch & Hold Button */}
          <motion.div
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            whileTap={{ scale: 0.95 }}
            className="absolute inset-6 rounded-full flex flex-col items-center justify-center cursor-pointer border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500"
            style={{
              backgroundColor: isHolding ? 'rgba(244,63,94,0.2)' : 'rgba(15,23,42,0.6)',
              boxShadow: isHolding 
                ? '0 0 50px rgba(244,63,94,0.6)' 
                : '0 0 30px rgba(56,189,248,0.3)',
            }}
          >
            {/* Heart Icon morphing from Ice Blue to Flaming Ruby */}
            <motion.div
              animate={{
                scale: isHolding ? [1, 1.15, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Heart
                className="w-20 h-20 transition-all duration-700"
                fill={progress > 50 ? '#f43f5e' : progress > 20 ? '#a855f7' : '#38bdf8'}
                style={{
                  color: progress > 50 ? '#fda4af' : '#7dd3fc',
                  filter: `drop-shadow(0 0 ${10 + progress * 0.3}px ${progress > 50 ? '#f43f5e' : '#38bdf8'})`,
                }}
              />
            </motion.div>

            <span className="text-xs font-mono font-semibold text-rose-200 mt-2">
              {isHolding ? `${Math.round(progress)}% Melting...` : "Press & Hold 🖐️"}
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
