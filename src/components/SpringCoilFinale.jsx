import React from 'react';
import { motion } from 'framer-motion';

export default function SpringCoilFinale() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center mt-12 pb-12 pointer-events-none select-none z-30"
    >
      {/* Animated Glowing Tree Coil */}
      <div className="relative">
        <svg className="coil" viewBox="0 0 100 100">
          <path
            className="coil-track"
            d="M 50 90 L 50 40 M 50 40 Q 50 15 25 15 M 50 40 Q 50 15 75 15 M 50 60 Q 50 30 20 30 M 50 60 Q 50 30 80 30"
          />
        </svg>
        {/* Soft magical glow base */}
        <div className="absolute inset-0 bg-rose-500/20 blur-2xl -z-10 rounded-full" />
      </div>

      {/* Cinematic Final Phrase */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="text-rose-200/90 font-['Playfair_Display',serif] italic text-lg sm:text-xl md:text-2xl mt-5 tracking-widest text-center drop-shadow-[0_0_15px_rgba(244,114,182,0.7)]"
      >
        ...and make it count forever ❤️
      </motion.p>
    </motion.div>
  );
}
