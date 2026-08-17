import React from 'react';
import { motion } from 'framer-motion';

export default function SpringCoilFinale() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center my-8 select-none"
    >
      <svg 
        className="w-32 h-32 animate-[jolt_3s_linear_infinite]" 
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 0 14px rgba(244, 114, 182, 0.75))' }}
      >
        <path
          d="M 50 90 L 50 40 M 50 40 Q 50 15 25 15 M 50 40 Q 50 15 75 15 M 50 60 Q 50 30 20 30 M 50 60 Q 50 30 80 30"
          fill="none"
          stroke="hsla(330, 85%, 65%, 0.95)"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-rose-200 font-serif italic text-lg sm:text-xl mt-4 tracking-widest text-center drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
        ...and make it count forever ❤️
      </p>
    </motion.div>
  );
}
