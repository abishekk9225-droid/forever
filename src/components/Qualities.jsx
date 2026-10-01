import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Qualities({ onComplete }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (window.playRomanticChime) window.playRomanticChime();
    if (step < 2) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, filter: 'blur(3px)', transition: { duration: 0.4 } }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative min-h-[380px] flex flex-col justify-between overflow-hidden">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
        <span className="text-[10px] uppercase tracking-widest text-rose-300 font-bold font-sans">
          What Really Matters
        </span>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step ? 'w-5 bg-rose-500' : idx < step ? 'w-1.5 bg-rose-500/40' : 'w-1.5 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center py-6 min-h-[220px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="q-qualities"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4 text-center"
            >
              <div className="space-y-2 text-rose-100 font-playfair text-lg md:text-xl font-medium tracking-wide">
                <p>Caring.</p>
                <p>Listening.</p>
                <p>Respect.</p>
                <p>Trust.</p>
                <p>Being there.</p>
              </div>
              <p className="text-xs text-gray-500 font-sans mt-3">
                Choosing each other when things aren't easy.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="q-poetry-split"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full text-center px-2"
            >
              <p
                className="text-base md:text-lg text-rose-100 font-sans leading-loose select-none italic"
                style={{
                  fontFamily: "'Mukta Malar', 'Latha', 'Tamil', sans-serif"
                }}
              >
                "சில குரல்கள்...
                கேட்டவுடன் மறந்து போய்விடும்.
                
                ஆனால் சில குரல்கள்...
                மனதுக்குள் தங்கிவிடும்."
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="q-poetry-stanza"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full text-center px-2"
            >
              <p
                className="text-base md:text-lg text-rose-200 font-sans leading-loose select-none"
                style={{
                  fontFamily: "'Mukta Malar', 'Latha', 'Tamil', sans-serif"
                }}
              >
                "சில மனிதர்கள்...
                நம் வாழ்க்கைக்குள் வருவது
                ஒரு காரணத்திற்காக இல்லாமல் இருக்கலாம்.
                
                ஆனால் அவர்கள் வந்த பிறகு...
                சில விஷயங்கள் மட்டும்
                முன்பைப் போல இருக்காது."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-center">
        <button
          onClick={handleNext}
          className="px-8 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/10"
        >
          {step < 2 ? 'Continue' : 'Understand ❤️'}
        </button>
      </div>
    </div>
  );
}
