import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

// Secure memory photo for the center heart
import photoHeart from '../assets/mem-02.jpg';

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
      
      {/* Responsive SVG ClipPath Definition for Heart Shape */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5, 0.28 C 0.5, 0.28, 0.62, 0.05, 0.81, 0.05 C 0.93, 0.05, 1, 0.18, 1, 0.33 C 1, 0.55, 0.78, 0.78, 0.5, 0.95 C 0.22, 0.78, 0, 0.55, 0, 0.33 C 0, 0.18, 0.07, 0.05, 0.19, 0.05 C 0.38, 0.05, 0.5, 0.28, 0.5, 0.28 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* CINEMATIC GLOW BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-500/20 to-amber-400/20 blur-[120px]"
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4 py-4 relative z-25">

        {/* CENTER HEART SHAPE CONTAINER FOR mem-02.jpg */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center my-4">
          
          {/* Glowing Outer Heart Aura */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-tr from-rose-600/50 via-pink-500/40 to-amber-400/40 blur-2xl rounded-full"
          />

          {/* EXACT HEART SHAPE MASK FOR THE PHOTO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center z-10 filter drop-shadow-[0_0_25px_rgba(244,63,94,0.8)] overflow-hidden"
            style={{
              clipPath: "url(#heart-clip)"
            }}
          >
            <img 
              src={photoHeart} 
              alt="Our Special Memory" 
              className="w-full h-full object-cover" 
            />
          </motion.div>
        </div>

        {/* "I LOVE YOU" TEXT SECTION WITH STAGGERED TIMING */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 my-3 w-full">
          
          {/* 1. "I" appears first */}
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]"
          >
            I
          </motion.span>

          {/* 2. "LOVE" appears second */}
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-3xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] tracking-widest"
          >
            LOVE
          </motion.span>

          {/* 3. "YOU" appears third */}
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]"
          >
            YOU
          </motion.span>

        </div>

        {/* SUBTITLE & ACTION BUTTON */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="text-sm sm:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] mb-5 px-4"
        >
          "Saranya, will you be mine forever and ever? 💍✨"
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5 }}
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
