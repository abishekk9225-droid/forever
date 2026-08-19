import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Zap, ArrowRight } from 'lucide-react';

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

  const handleHeartTap = () => {
    if (isCompleted) return;

    setCharge((prev) => {
      const next = Math.min(prev + 10, 100);
      const unlocked = [...MILESTONES].reverse().find((m) => next >= m.percent);
      if (unlocked) {
        setActiveMsg(unlocked.msg);
      }
      if (next >= 100) {
        setIsCompleted(true);
      }
      return next;
    });
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 px-4 z-30 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full p-8 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-rose-500/10 rounded-3xl blur-2xl transition-opacity duration-300 pointer-events-none"
          style={{ opacity: charge / 100 }}
        />

        <div className="flex items-center justify-center gap-2 mb-2 text-rose-400">
          <Zap className="w-4 h-4 animate-bounce"/>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-300">
            Love Energy Charger
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif text-white mb-6">
          Charge Our Love to 100% 💖
        </h3>

        <div className="relative my-8 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleHeartTap}
            disabled={isCompleted}
            className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 flex items-center justify-center shadow-[0_0_40px_rgba(244,114,182,0.6)] cursor-pointer select-none relative group"
            style={{
              boxShadow: `0 0 ${20 + charge * 0.6}px rgba(244,114,182, ${0.4 + charge / 200})`,
            }}
          >
            <Heart 
              className="w-20 h-20 text-white fill-white transition-transform duration-200" 
              style={{
                transform: `scale(${1 + charge / 300})`,
                filter: isCompleted ? 'drop-shadow(0 0 15px #ffffff)' : 'none'
              }}
            />
            {isCompleted && (
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-300 animate-spin"/>
            )}
          </motion.button>
        </div>

        <div className="w-full bg-black/60 rounded-full h-4 p-0.5 border border-rose-500/30 mb-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(244,114,182,0.8)]"
            initial={{ width: '0%' }}
            animate={{ width: `${charge}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
        </div>

        <div className="text-right text-xs font-mono text-rose-300 font-bold mb-4">
          {charge}% CHARGED
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMsg}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-400/20 text-rose-200 text-xs sm:text-sm italic font-serif min-h-[50px] flex items-center justify-center"
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
            className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,114,182,0.5)] cursor-pointer"
          >
            <span>Proceed to Our Next Chapter ✨</span>
            <ArrowRight className="w-4 h-4"/>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
