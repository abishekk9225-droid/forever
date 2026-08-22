import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Sparkles, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const PROMISES = [
  { id: 1, text: "எப்போதும் உன் சிரிப்புக்குக் காரணமாய் இருப்பேன். 😊", icon: "✨" },
  { id: 2, text: "உன் எல்லா மனநிலைகளிலும் துணை நிற்பேன். 🫂", icon: "💖" },
  { id: 3, text: "வாழ்வின் எல்லாப் பயணங்களையும் உன்னோடு பகிர்வேன். 🌍", icon: "🚗" },
  { id: 4, text: "நீ சோர்வடையும்போது தோள் கொடுப்பேன். 🤍", icon: "🌸" },
  { id: 5, text: "என்றென்றும் உன்னை மட்டுமே நேசிப்பேன். 💍", icon: "👑" },
];

export default function PromiseVault({ onComplete }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleUnlock = () => {
    setIsUnlocked(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#f43f5e', '#ffffff']
    });
  };

  const handleNext = () => {
    if (currentIndex < PROMISES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black/95 text-center z-30 select-none">
      
      {!isUnlocked ? (
        /* LOCKED VAULT VIEW */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-amber-400/40 shadow-[0_0_50px_rgba(251,191,36,0.2)] space-y-6"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-zinc-950 shadow-[0_0_30px_rgba(251,191,36,0.5)] cursor-pointer"
            onClick={handleUnlock}
          >
            <KeyRound className="w-10 h-10"/>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold">
            Unlock My 5 Promises 🔐✨
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm font-serif italic">
            "5 eternal promises sealed exclusively for Saranya..."
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUnlock}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4"/>
            <span>Open Promise Vault</span>
          </motion.button>
        </motion.div>
      ) : (
        /* PROMISE REVEAL CARD VIEW */
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-rose-500/40 shadow-[0_0_60px_rgba(244,63,94,0.25)] space-y-6 text-center"
        >
          <div className="flex items-center justify-between text-xs font-mono text-rose-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400"/>
              Promise {currentIndex + 1} of 5
            </span>
            <span className="text-zinc-500">Locked in Heart 🔒</span>
          </div>

          <div className="text-5xl py-2">
            {PROMISES[currentIndex].icon}
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-rose-300 leading-relaxed px-2">
            "{PROMISES[currentIndex].text}"
          </h3>

          <div className="flex items-center justify-center gap-1 pt-2">
            {PROMISES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-rose-500' : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {currentIndex === PROMISES.length - 1
                ? "Claim Your Love Certificate 📜✨"
                : "Next Promise 💖"}
            </span>
            <ArrowRight className="w-4 h-4"/>
          </motion.button>
        </motion.div>
      )}

    </div>
  );
}
