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

      {/* CSS STYLES FOR THE ROTATING TEXT HEART ANIMATION */}
      <style>{`
        @keyframes animateHeart {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(-110px) scale(0.8);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 15px #ea80b0, 0 0 30px #fff;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(-50px) scale(1.1);
          }
        }
        .love_word_ring {
          position: absolute;
          left: 50%;
          top: 50%;
          color: #ea80b0;
          font-size: 1rem;
          font-family: sans-serif;
          text-shadow: 0 0 10px #fff;
          letter-spacing: 2px;
          white-space: nowrap;
          transform-origin: center;
          animation: animateHeart 4s linear infinite;
          opacity: 0;
        }
      `}</style>

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

        {/* CONTAINER HOLDING THE ANIMATED TEXT HEART AND CENTERED PHOTO */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-2">
          
          {/* ROTATING TEXT HEART ANIMATION LAYER */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="love_word_ring" style={{ '--rot': '0deg', animationDelay: '0s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '30deg', animationDelay: '0.3s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '60deg', animationDelay: '0.6s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '90deg', animationDelay: '0.9s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '120deg', animationDelay: '1.2s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '150deg', animationDelay: '1.5s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '180deg', animationDelay: '1.8s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '210deg', animationDelay: '2.1s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '240deg', animationDelay: '2.4s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '270deg', animationDelay: '2.7s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '300deg', animationDelay: '3.0s' }}>I love you</div>
            <div className="love_word_ring" style={{ '--rot': '330deg', animationDelay: '3.3s' }}>I love you</div>
          </div>

          {/* CENTER PHOTO FRAME WITH HEART SHAPE MASK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center z-10 shadow-[0_0_50px_rgba(244,63,94,0.8)]"
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
        <div className="flex items-center justify-center gap-3 sm:gap-5 my-2 w-full relative z-30">
          
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
          className="text-sm sm:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] mb-4 px-4 relative z-30"
        >
          "Saranya, will you be mine forever and ever? 💍✨"
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5 }}
          className="relative z-30"
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
