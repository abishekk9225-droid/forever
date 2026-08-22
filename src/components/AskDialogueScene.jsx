import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircleHeart, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AskDialogueScene({ onNext }) {
  const handleAskClick = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ffd700', '#ffffff']
    });
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 z-30 relative">
      
      {/* Background Glow */}
      <div className="absolute w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2" />

      {/* Main Glass Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full p-8 sm:p-10 rounded-3xl bg-zinc-950/90 border border-rose-500/30 shadow-[0_0_60px_rgba(244,63,94,0.2)] backdrop-blur-xl relative z-10 space-y-6"
      >
        
        {/* Top Icon Badge */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(244,63,94,0.5)]"
        >
          <MessageCircleHeart className="w-8 h-8"/>
        </motion.div>

        {/* Cinematic Heartfelt Message */}
        <div className="space-y-4 text-rose-100 font-serif leading-relaxed text-sm sm:text-base italic px-2">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            "First of all sorry, entha situation-la etha kekakudadhuthaan, but yenaku kekanum nu thonuchu..."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            "Ni thappa yethum yeduthukatha ok va?"
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            "Sollanum nu thonuchu, yenaku hope iruku un mela, atha solren..."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="text-amber-300 font-bold not-italic text-base sm:text-lg pt-1"
          >
            "Ni yethum nenachuka mattinu ok va, arambikalama? ✨"
          </motion.p>
        </div>

        {/* ASK BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          className="pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAskClick}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-zinc-950 font-bold text-base sm:text-lg shadow-[0_0_35px_rgba(244,63,94,0.5)] flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5"/>
            <span>Ask 💬✨</span>
            <ArrowRight className="w-5 h-5"/>
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}
