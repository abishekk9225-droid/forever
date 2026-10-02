import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';

const stanzas = [
  {
    tamil: `சில சந்திப்புகள்...
நினைவாக மட்டும் இருப்பதில்லை.

நம்மை அறியாமலே...
நம் வாழ்க்கையின் ஒரு பகுதியாக மாறிடும்.`,
    label: 'Some meetings...'
  },
  {
    tamil: `சில வார்த்தைகள்...
கேட்டவுடன் மறந்து போய்விடும்.

ஆனா சில குரல்கள்...
மனசுக்குள்ளே தங்கிடும்.`,
    label: 'Some voices...'
  },
  {
    tamil: `உன் அக்கறை...
என்னை நிறைத்தது.

உன் பேச்சு...
என் மனதில் தங்கியது.

இப்போது நான் என்ன சொல்ல விரும்புகிறேன்...
என்று கொஞ்சம் நேரம் கொடு.`,
    label: 'Your care...'
  }
];

export default function TamilPoetry({ onComplete }) {
  const [stanzaIndex, setStanzaIndex] = useState(0);

  useEffect(() => {
    try {
      if (window.setHeartbeatActive) window.setHeartbeatActive(true);
    } catch (e) {}
    return () => {
      try {
        if (window.setHeartbeatActive) window.setHeartbeatActive(false);
      } catch (e) {}
    };
  }, []);

  const handleNext = () => {
    try { if (window.playRomanticChime) window.playRomanticChime(); } catch (e) {}
    if (stanzaIndex < stanzas.length - 1) {
      setStanzaIndex(prev => prev + 1);
    } else {
      try { onComplete(); } catch (e) { console.error('[TamilPoetry] onComplete error:', e); }
    }
  };

  const current = stanzas[stanzaIndex];

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl glass-card border border-rose-500/10 shadow-2xl relative min-h-[400px] flex flex-col justify-between overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/5 rounded-full filter blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="text-[9px] uppercase tracking-widest text-rose-300 font-semibold font-sans flex items-center gap-1">
          <Heart size={10} fill="currentColor" className="text-rose-500 animate-pulse" />
          Poetry • {stanzaIndex + 1} of {stanzas.length}
        </span>
        <div className="flex gap-1.5">
          {stanzas.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === stanzaIndex ? 'w-5 bg-rose-500' : idx < stanzaIndex ? 'w-1.5 bg-rose-500/40' : 'w-1.5 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tamil verse */}
      <div className="flex-grow flex items-center justify-center relative z-10 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={stanzaIndex}
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(5px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.75 }}
            className="w-full text-center"
          >
            <p
              className="text-base md:text-lg text-rose-100 font-medium leading-loose whitespace-pre-line antialiased tracking-wide select-none"
              style={{
                fontFamily: "'Mukta Malar', 'Latha', 'Tamil', 'Noto Sans Tamil', sans-serif",
                textShadow: '0 0 12px rgba(214, 69, 119, 0.35)'
              }}
            >
              {current.tamil}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <div className="mt-6 flex justify-center relative z-10 border-t border-white/5 pt-4">
        <button
          id="btn-poetry-next"
          onClick={handleNext}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 hover:from-rose-500 hover:to-purple-600 text-rose-200 hover:text-white font-medium text-xs border border-rose-500/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1"
        >
          {stanzaIndex < stanzas.length - 1 ? (
            <>Stay with me <ChevronRight size={14} /></>
          ) : (
            'Continue ❤️'
          )}
        </button>
      </div>
    </div>
  );
}
