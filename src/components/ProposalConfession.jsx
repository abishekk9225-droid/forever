import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

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
          className="w-[400px] h-[400px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-500/20 to-amber-400/20 blur-[140px]"
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4 py-2 relative z-25">

        {/* CSS HEART ANIMATION CONTAINER WITH CENTERED MEM-02 PHOTO */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
          
          {/* Animated Glowing Text Heart Words */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-75 sm:scale-90">
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse" style={{ transform: 'translate(0px, -90px)', textShadow: '0 0 10px #fff' }}>I love you</div>
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse delay-100" style={{ transform: 'translate(60px, -70px)', textShadow: '0 0 10px #fff' }}>I love you</div>
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse delay-200" style={{ transform: 'translate(90px, -20px)', textShadow: '0 0 10px #fff' }}>I love you</div>
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse delay-300" style={{ transform: 'translate(70px, 40px)', textShadow: '0 0 10px #fff' }}>I love you</div>
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse delay-400" style={{ transform: 'translate(20px, 90px)', textShadow: '0 0 10px #fff' }}>I love you</div>
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse delay-500" style={{ transform: 'translate(-30px, 90px)', textShadow: '0 0 10px #fff' }}>I love you</div>
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse delay-600" style={{ transform: 'translate(-80px, 40px)', textShadow: '0 0 10px #fff' }}>I love you</div>
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse delay-700" style={{ transform: 'translate(-100px, -20px)', textShadow: '0 0 10px #fff' }}>I love you</div>
            <div className="absolute text-[#ea80b0] font-sans text-sm tracking-wider animate-pulse delay-800" style={{ transform: 'translate(-70px, -70px)', textShadow: '0 0 10px #fff' }}>I love you</div>
          </div>

          {/* CENTER PHOTO FRAME WITH HEART SHAPE MASK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center z-10 shadow-[0_0_50px_rgba(244,63,94,0.8)]"
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

        {/* "I LOVE YOU" TEXT SECTION WITH STAGRAMMED TIMING */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 my-2 w-full">
          
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]"
          >
            I
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-3xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] tracking-widest"
          >
            LOVE
          </motion.span>

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
          className="text-sm sm:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] mb-4 px-4"
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
