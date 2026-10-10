import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function CaringSequence({ onComplete, onStateChange }) {
  const [step, setStep] = useState(0);

  const handleNextStep = (nextStep, mascotState) => {
    setStep(nextStep);
    if (onStateChange) {
      onStateChange(mascotState);
    }
  };

  const textVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/5 shadow-2xl relative min-h-[360px] flex flex-col justify-between">
      
      <div className="text-center mb-4">
        <span className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold font-sans">
          A Quiet Thought
        </span>
      </div>

      <div className="flex-grow flex items-center justify-center py-4">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: Introduction Prompt */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={textVariants}
              className="text-center space-y-6"
            >
              <p className="text-lg md:text-xl font-playfair font-medium text-white leading-relaxed">
                "Do you know what I noticed about you?"
              </p>
              
              <button
                id="btn-caring-tell-me"
                onClick={() => handleNextStep(1, 'shy')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/10"
              >
                Tell me 👀
              </button>
            </motion.div>
          )}

          {/* STEP 1: First Reveal */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={textVariants}
              className="text-center space-y-6"
            >
              <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 glow-rose inline-block">
                <span className="text-2xl md:text-3xl font-playfair font-semibold text-rose-300 italic">
                  "You care."
                </span>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                It's in the way you talk, and how genuinely you listen.
              </p>

              <button
                id="btn-caring-anything-else"
                onClick={() => handleNextStep(2, 'laughing')}
                className="px-6 py-2.5 rounded-full border border-white/10 hover:border-rose-500/20 bg-white/2 text-rose-300 font-medium text-xs hover:scale-105 active:scale-95 transition-all"
              >
                Anything else? 🔍
              </button>
            </motion.div>
          )}

          {/* STEP 2: Second Reveal */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={textVariants}
              className="text-center space-y-6"
            >
              <div className="p-6 rounded-2xl glass-panel border border-purple-500/20 glow-purple space-y-2">
                <span className="text-lg md:text-xl font-playfair font-semibold text-purple-300 block">
                  "You actually notice little things."
                </span>
                <p className="text-xs text-gray-400">
                  Things most people would ignore, you pay attention to.
                </p>
              </div>

              <button
                id="btn-caring-one-more"
                onClick={() => handleNextStep(3, 'shy')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 text-white font-medium text-xs hover:scale-105 active:scale-95 transition-all"
              >
                One more... ✨
              </button>
            </motion.div>
          )}

          {/* STEP 3: Third Reveal */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={textVariants}
              className="text-center space-y-6"
            >
              <div className="p-6 rounded-3xl bg-gradient-to-tr from-rose-500/10 to-purple-600/10 border border-white/10 space-y-3">
                <Heart size={24} className="text-rose-500 mx-auto animate-pulse" fill="currentColor" />
                <p className="text-sm md:text-base text-gray-200 leading-relaxed italic">
                  "Somehow, talking to you makes me feel like someone is looking out for me."
                </p>
              </div>

              <button
                id="btn-caring-final"
                onClick={() => handleNextStep(4, 'excited')}
                className="px-6 py-2.5 rounded-full bg-white/10 border border-white/10 text-white font-semibold text-xs hover:scale-105 active:scale-95 transition-all"
              >
                Okay... ❤️
              </button>
            </motion.div>
          )}

          {/* STEP 4: Final Conclusion */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={textVariants}
              className="text-center space-y-6"
            >
              <h4 className="text-xl md:text-2xl font-playfair font-semibold text-rose-300 leading-relaxed italic">
                "That's what I like about you the most."
              </h4>
              
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                Finding someone who genuinely cares is rare, and it made you special to me before I even realized it.
              </p>

              <button
                id="btn-caring-sequence-continue"
                onClick={onComplete}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-500/20 flex items-center gap-1.5 mx-auto"
              >
                Continue →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
