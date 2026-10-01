import React from 'react';
import { motion } from 'framer-motion';

export default function SpringCoilFinale() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center my-8 select-none space-y-6 text-center max-w-lg px-4"
    >
      {/* Animated Spring Coil SVG */}
      <div className="relative">
        <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl animate-pulse" />
        <svg 
          className="w-32 h-32 relative z-10 animate-[jolt_3.2s_linear_infinite]" 
          viewBox="0 0 100 100"
          style={{ filter: 'drop-shadow(0 0 16px rgba(244, 114, 182, 0.85))' }}
        >
          <path
            d="M 50 90 L 50 40 M 50 40 Q 50 15 25 15 M 50 40 Q 50 15 75 15 M 50 60 Q 50 30 20 30 M 50 60 Q 50 30 80 30"
            fill="none"
            stroke="hsla(330, 85%, 65%, 0.95)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Progressive Storytelling Final Emotional Lines Required by Prompt */}
      <div className="space-y-4 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="space-y-1"
        >
          <p className="text-slate-200 font-serif italic text-lg sm:text-xl tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            "சில கதைகள் முடிவதில்லை..."
          </p>
          <p className="text-amber-200 font-serif font-medium text-xl sm:text-2xl tracking-wide drop-shadow-[0_0_18px_rgba(251,191,36,0.8)]">
            அவை நினைவுகளாக தொடர்ந்து வாழ்கின்றன. ❤️
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.2 }}
          className="space-y-1 pt-2 border-t border-rose-500/20"
        >
          <p className="text-rose-100 font-serif font-light text-sm sm:text-base tracking-wide drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
            "Forever isn't a promise of tomorrow..."
          </p>
          <p className="text-rose-300 font-serif font-medium text-base sm:text-lg tracking-wider drop-shadow-[0_0_15px_rgba(244,63,94,0.7)]">
            It is a memory worth keeping today. ❤️
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
