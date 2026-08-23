import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

// Securely reference private-safe image names
import photoI from '../assets/mem-01.jpg';
import photoLove from '../assets/mem-02.jpg';
import photoYou from '../assets/mem-03.jpg';

export default function ProposalConfession({ onNext, onAccept }) {
  const { playCelebrationTrack } = useSound();

  const handleYes = () => {
    if (typeof playCelebrationTrack === 'function') {
      playCelebrationTrack();
    }
    if (typeof onAccept === 'function') {
      onAccept();
    } else if (typeof onNext === 'function') {
      onNext();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black/95 text-center select-none overflow-hidden z-30">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* WIDE EXPANDED CONTAINER */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4 py-6 relative z-20 overflow-visible">

        {/* 3-COLUMN STAGGERED GRID FOR "I", "LOVE", "YOU" */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center justify-center w-full mb-8">
          
          {/* 1. "I" + MEM-01.JPG (Appears first) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl p-1 bg-gradient-to-tr from-amber-300 to-yellow-600 shadow-[0_0_35px_rgba(250,204,21,0.5)] overflow-hidden">
              <img src={photoI} alt="Memory 1" className="w-full h-full object-cover rounded-xl" />
            </div>
            <span className="text-6xl sm:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_40px_rgba(250,204,21,1)]">
              I
            </span>
          </motion.div>

          {/* 2. "LOVE" + MEM-02.JPG (Appears second) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl p-1 bg-gradient-to-tr from-rose-500 to-pink-500 shadow-[0_0_35px_rgba(244,63,94,0.5)] overflow-hidden">
              <img src={photoLove} alt="Memory 2" className="w-full h-full object-cover rounded-xl" />
            </div>
            <span className="text-5xl sm:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 drop-shadow-[0_0_40px_rgba(244,63,94,1)]">
              LOVE
            </span>
          </motion.div>

          {/* 3. "YOU" + MEM-03.JPG (Appears third) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 3.0, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl p-1 bg-gradient-to-tr from-amber-300 to-yellow-600 shadow-[0_0_35px_rgba(250,204,21,0.5)] overflow-hidden">
              <img src={photoYou} alt="Memory 3" className="w-full h-full object-cover rounded-xl" />
            </div>
            <span className="text-6xl sm:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_40px_rgba(250,204,21,1)]">
              YOU
            </span>
          </motion.div>

        </div>

        {/* SUBTITLE & ACTION BUTTON (Appears last after all words are visible) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 4.2 }}
          className="text-base sm:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_20px_rgba(244,63,94,0.7)] mb-6 px-4"
        >
          "Saranya, will you be mine forever and ever? 💍✨"
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 4.6 }}
        >
          <button
            onClick={handleYes}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-zinc-950 font-bold text-base shadow-[0_0_40px_rgba(251,191,36,0.6)] cursor-pointer"
          >
            Yes, Forever! 💖✨
          </button>
        </motion.div>

      </div>
    </div>
  );
}
