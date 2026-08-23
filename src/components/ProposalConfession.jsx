import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

import photoI from '../assets/mem-01.jpg';
import photoHeart from '../assets/mem-02.jpg'; // mem-02 inside the heart/center
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
      
      {/* CINEMATIC GLOW & ROTATING HEART BACKGROUND AMBIANCE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-500/20 to-amber-400/25 blur-[100px]"
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4 py-4 relative z-25">

        {/* TOP ROW: I PHOTO AND YOU PHOTO WITH STAGGERED TIMING */}
        <div className="flex items-center justify-center gap-6 sm:gap-16 mb-4 w-full">
          
          {/* 1. I PHOTO (Appears first) */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl p-1 bg-gradient-to-tr from-amber-300 to-yellow-600 shadow-[0_0_30px_rgba(250,204,21,0.5)] overflow-hidden">
              <img src={photoI} alt="Memory I" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>

          {/* 2. CENTER HEART ANIMATION WITH mem-02.jpg INSIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Glowing Heart Frame for mem-02.jpg */}
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 shadow-[0_0_50px_rgba(244,63,94,0.7)] overflow-hidden animate-pulse">
              <img src={photoHeart} alt="Memory Heart" className="w-full h-full object-cover rounded-full" />
            </div>
          </motion.div>

          {/* 3. YOU PHOTO (Appears later with different timing) */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl p-1 bg-gradient-to-tr from-amber-300 to-yellow-600 shadow-[0_0_30px_rgba(250,204,21,0.5)] overflow-hidden">
              <img src={photoYou} alt="Memory You" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>

        </div>

        {/* TEXT SECTION: "I", "YOU" AND BELOW IT "LOVE" */}
        <div className="flex flex-col items-center justify-center w-full my-2 space-y-1">
          
          {/* I and YOU on sides */}
          <div className="flex items-center justify-center gap-24 sm:gap-40 w-full">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="text-5xl sm:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]"
            >
              I
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="text-5xl sm:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]"
            >
              YOU
            </motion.span>
          </div>

          {/* LOVE placed right below/between */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            className="-mt-6 sm:-mt-8"
          >
            <span className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 drop-shadow-[0_0_40px_rgba(244,63,94,1)] tracking-widest">
              LOVE
            </span>
          </motion.div>

        </div>

        {/* SUBTITLE & ACTION BUTTON */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 3.0 }}
          className="text-sm sm:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] mb-4 px-4 mt-2"
        >
          "Saranya, will you be mine forever and ever? 💍✨"
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.4 }}
        >
          <button
            onClick={handleYes}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-zinc-950 font-bold text-sm sm:text-base shadow-[0_0_40px_rgba(251,191,36,0.6)] cursor-pointer"
          >
            Yes, Forever! 💖✨
          </button>
        </motion.div>

      </div>
    </div>
  );
}
