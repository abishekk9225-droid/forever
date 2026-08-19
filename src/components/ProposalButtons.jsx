import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProposalButtons({ onAccept }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);

  const dodgeNoButton = () => {
    const randomX = (Math.random() - 0.5) * 260;
    const randomY = (Math.random() - 0.5) * 180;
    setNoPos({ x: randomX, y: randomY });
    setNoAttempts((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8 relative z-30">
      <div className="flex items-center justify-center gap-6 relative min-h-[90px] w-full">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAccept}
          className="py-4 px-10 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-lg tracking-wider shadow-[0_0_35px_rgba(244,114,182,0.6)] animate-pulse cursor-pointer z-10"
        >
          YES, Forever! 💖
        </motion.button>

        <motion.button
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          onMouseEnter={dodgeNoButton}
          onTouchStart={dodgeNoButton}
          onClick={dodgeNoButton}
          className="py-3 px-6 rounded-2xl bg-zinc-900/80 border border-white/20 text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer select-none"
        >
          No 😢
        </motion.button>
      </div>

      {noAttempts > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-rose-300/80 italic animate-bounce"
        >
          {noAttempts > 2 ? "No escapes! Only 'YES' is allowed 😜❤️" : "Oops! You can't touch this button 🙈"}
        </motion.p>
      )}
    </div>
  );
}
