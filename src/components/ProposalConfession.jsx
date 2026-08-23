import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black text-center select-none overflow-hidden z-30">
      
      {/* BACKGROUND ROTATING HEART / GLOW EFFECT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-500/20 to-amber-400/30 blur-3xl"
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4 py-4 relative z-20">

        {/* 3 PHOTOS GRID (CENTER PHOTO IS 'YOU' AS REQUESTED) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-center justify-center w-full mb-6 max-w-2xl mx-auto">
          
          {/* 1. LEFT PHOTO (I) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl p-1 bg-gradient-to-tr from-amber-300 to-yellow-600 shadow-[0_0_25px_rgba(250,204,21,0.4)] overflow-hidden">
              <img src={photoI} alt="Memory 1" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>

          {/* 2. CENTER PHOTO (YOU - Highlighted as requested) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center space-y-2 -mt-4 sm:-mt-6"
          >
            <div className="w-28 h-28 sm:w-42 sm:h-42 rounded-2xl p-1.5 bg-gradient-to-tr from-amber-300 via-yellow-400 to-rose-500 shadow-[0_0_40px_rgba(251,191,36,0.6)] overflow-hidden">
              <img src={photoYou} alt="Memory You" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>

          {/* 3. RIGHT PHOTO (LOVE) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl p-1 bg-gradient-to-tr from-rose-500 to-pink-500 shadow-[0_0_25px_rgba(244,63,94,0.4)] overflow-hidden">
              <img src={photoLove} alt="Memory 2" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>

        </div>

        {/* PROPERLY SPACED "I   LOVE   YOU" TEXT */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6 w-full">
          {/* Golden I */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-4xl sm:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_30px_rgba(250,204,21,0.9)]"
          >
            I
          </motion.span>

          {/* Neon Rose LOVE */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="text-3xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 drop-shadow-[0_0_30px_rgba(244,63,94,0.9)]"
          >
            LOVE
          </motion.span>

          {/* Golden YOU */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
            className="text-4xl sm:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_30px_rgba(250,204,21,0.9)]"
          >
            YOU
          </motion.span>
        </div>

        {/* SUBTITLE & ACTION BUTTON */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.4 }}
          className="text-sm sm:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] mb-5 px-4"
        >
          "Saranya, will you be mine forever and ever? 💍✨"
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8 }}
        >
          <button
            onClick={handleYes}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-zinc-950 font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(251,191,36,0.5)] cursor-pointer"
          >
            Yes, Forever! 💖✨
          </button>
        </motion.div>

      </div>
    </div>
  );
}
