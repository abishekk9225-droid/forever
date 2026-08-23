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

        {/* CENTER HEART CONTAINER WITH "I LOVE YOU" TEXT REVOLVING / GLOWING AROUND */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-4">
          
          {/* Simulated Heart Orbit / Glowing Text Ring Effect */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-rose-500/30 border-dashed pointer-events-none"
          />

          {/* Glowing Outer Heart Aura */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-4 rounded-full bg-gradient-to-tr from-rose-600/40 via-pink-500/30 to-amber-400/30 blur-2xl"
          />

          {/* CENTER PHOTO FRAME INSIDE THE HEART */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-amber-300 via-rose-500 to-pink-500 shadow-[0_0_60px_rgba(244,63,94,0.8)] overflow-hidden z-10"
          >
            <img 
              src={photoHeart} 
              alt="Our Special Memory" 
              className="w-full h-full object-cover rounded-full" 
            />
          </motion.div>
        </div>

        {/* "I LOVE YOU" TEXT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-3 sm:gap-5 my-3 w-full"
        >
          <span className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]">
            I
          </span>
          <span className="text-3xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] tracking-widest">
            LOVE
          </span>
          <span className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]">
            YOU
          </span>
        </motion.div>

        {/* SUBTITLE & ACTION BUTTON */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-sm sm:text-xl font-serif italic text-rose-100 drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] mb-5 px-4"
        >
          "Saranya, will you be mine forever and ever? 💍✨"
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
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
