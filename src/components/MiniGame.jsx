import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

// Securely import memory photo
import photoMem1 from '../assets/mem-01.jpg';

const MILESTONES = [
  { percent: 25, msg: "Your smile lights up my entire world ✨" },
  { percent: 50, msg: "Every moment with you feels like pure magic 🥰" },
  { percent: 75, msg: "You make my heart beat faster every day 💖" },
  { percent: 100, msg: "100% Love Overload! You are my forever 💍" },
];

export default function MiniGame({ onComplete }) {
  const [charge, setCharge] = useState(0);
  const [activeMsg, setActiveMsg] = useState("Tap or hold the heart to charge our love!");
  const [isCompleted, setIsCompleted] = useState(false);
  const [particles, setParticles] = useState([]);
  
  const intervalRef = useRef(null);

  const spawnParticle = () => {
    const id = Math.random();
    const emojis = ['🦋', '🌸', '🌹', '🌺', '🌼', '✨'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const startX = Math.random() * 80 + 10; // start x percentage
    const duration = 2.5 + Math.random() * 1.5; // duration in seconds
    
    const newParticle = { id, emoji, startX, duration };
    setParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, duration * 1000);
  };

  const triggerChargingStep = () => {
    setCharge((prev) => {
      if (prev >= 100) {
        setIsCompleted(true);
        stopCharging();
        return 100;
      }
      const next = Math.min(prev + 5, 100);
      const unlocked = [...MILESTONES].reverse().find((m) => next >= m.percent);
      if (unlocked) {
        setActiveMsg(unlocked.msg);
      }
      if (next >= 100) {
        setIsCompleted(true);
        stopCharging();
      }
      spawnParticle();
      return next;
    });
  };

  const startCharging = (e) => {
    e.preventDefault();
    if (isCompleted) return;
    triggerChargingStep();
    intervalRef.current = setInterval(() => {
      triggerChargingStep();
    }, 150);
  };

  const stopCharging = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopCharging();
  }, [isCompleted]);

  return (
    <div className="w-full max-w-md mx-auto my-6 px-4 z-30 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full p-8 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative overflow-hidden"
      >
        {/* Floating Particles Area */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 180, x: `${p.startX}%`, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: -220, 
                  x: [`${p.startX}%`, `${p.startX + (Math.random() - 0.5) * 30}%`],
                  scale: [0.5, 1.2, 1.2, 0.7],
                  rotate: [0, (Math.random() - 0.5) * 90]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: p.duration, ease: "easeOut" }}
                className="absolute text-2xl"
              >
                {p.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div
          className="absolute inset-0 bg-rose-500/10 rounded-3xl blur-2xl transition-opacity duration-300 pointer-events-none z-0"
          style={{ opacity: charge / 100 }}
        />

        <div className="flex items-center justify-center gap-2 mb-2 text-rose-400 relative z-10">
          <Zap className="w-4 h-4 animate-bounce"/>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-300">
            Love Energy Charger
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif text-white mb-6 relative z-10">
          Charge Our Love to 100% 💖
        </h3>

        <div className="relative my-8 flex items-center justify-center relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.85 }}
            onMouseDown={startCharging}
            onMouseUp={stopCharging}
            onMouseLeave={stopCharging}
            onTouchStart={startCharging}
            onTouchEnd={stopCharging}
            disabled={isCompleted}
            className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 p-1 flex items-center justify-center shadow-[0_0_40px_rgba(244,114,182,0.6)] cursor-pointer select-none relative group overflow-hidden"
            style={{
              boxShadow: `0 0 ${20 + charge * 0.6}px rgba(244,114,182, ${0.4 + charge / 200})`,
            }}
          >
            <img 
              src={photoMem1} 
              alt="Love Charger Memory" 
              className="w-full h-full object-cover rounded-full transition-transform duration-200"
              style={{
                transform: `scale(${1 + charge / 300})`,
                filter: isCompleted ? 'drop-shadow(0 0 15px #ffffff) brightness(1.1)' : 'none'
              }}
            />
            {isCompleted && (
              <Sparkles className="absolute top-2 right-2 w-8 h-8 text-amber-300 animate-spin"/>
            )}
          </motion.button>
        </div>

        <div className="w-full bg-black/60 rounded-full h-4 p-0.5 border border-rose-500/30 mb-4 overflow-hidden relative z-10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(244,114,182,0.8)]"
            initial={{ width: '0%' }}
            animate={{ width: `${charge}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
        </div>

        <div className="text-right text-xs font-mono text-rose-300 font-bold mb-4 relative z-10">
          {charge}% CHARGED
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMsg}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-400/20 text-rose-200 text-xs sm:text-sm italic font-serif min-h-[50px] flex items-center justify-center relative z-10"
          >
            "{activeMsg}"
          </motion.div>
        </AnimatePresence>

        {isCompleted && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onComplete}
            className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,114,182,0.5)] cursor-pointer relative z-10"
          >
            <span>Proceed to Our Next Chapter ✨</span>
            <ArrowRight className="w-4 h-4"/>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
