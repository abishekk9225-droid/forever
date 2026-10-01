import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function LoveMeter({ onComplete, onStateChange }) {
  const [value, setValue] = useState(20);
  const [isBroken, setIsBroken] = useState(false);
  const [hearts, setHearts] = useState([]);

  const getLabel = (val) => {
    if (val < 35) return "Just friends 😌";
    if (val < 75) return "Hmm... maybe 👀";
    if (val < 100) return "So close... 💓";
    return "Okay... I'm completely gone. ❤️";
  };

  const handleSliderChange = (e) => {
    const newVal = parseInt(e.target.value, 10);
    setValue(newVal);
    
    // Spawn floating heart particle
    if (newVal > value && Math.random() > 0.4) {
      spawnHeart();
    }

    // Set mascot state based on slider percentage
    if (onStateChange) {
      if (newVal < 25) onStateChange('curious');
      else if (newVal < 55) onStateChange('laughing');
      else if (newVal < 80) onStateChange('shy');
      else if (newVal < 100) onStateChange('excited');
    }

    if (newVal === 100) {
      setIsBroken(true);
      if (onStateChange) onStateChange('excited');
      // Spawn a burst of hearts
      for (let i = 0; i < 15; i++) {
        setTimeout(spawnHeart, i * 80);
      }
    } else {
      setIsBroken(false);
    }
  };

  const spawnHeart = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const size = Math.random() * 20 + 15;
    const startX = Math.random() * 80 + 10; // percentage
    const duration = Math.random() * 1.5 + 1;
    
    setHearts((prev) => [...prev, { id, size, startX, duration }]);
    
    // Clean up
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, duration * 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-2xl glass-card border border-white/5 relative overflow-hidden flex flex-col items-center">
      {/* Sparkles glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/10 rounded-full filter blur-xl pointer-events-none" />
      
      <h3 className="text-xl md:text-2xl font-playfair font-semibold text-white text-center mb-6">
        Love Meter
      </h3>
      
      <div className="w-full text-center min-h-[40px] flex items-center justify-center mb-8">
        <motion.p
          key={getLabel(value)}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium text-rose-300"
        >
          {getLabel(value)}
        </motion.p>
      </div>

      <div className="w-full relative flex items-center mb-10">
        <input
          id="love-slider"
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500 outline-none focus:ring-2 focus:ring-rose-500/20"
          style={{
            background: `linear-gradient(to right, #d64577 0%, #d64577 ${value}%, rgba(255,255,255,0.1) ${value}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
        
        {/* Glow indicator behind slider thumb */}
        <div 
          className="absolute h-4 w-4 bg-rose-400 rounded-full blur-md pointer-events-none -translate-y-1/2 top-1/2"
          style={{ left: `calc(${value}% - 8px)` }}
        />
      </div>

      {/* Floating Hearts Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: '100%', x: `${h.startX}%`, scale: 0.5 }}
              animate={{ opacity: [0, 0.8, 0], y: '-20%', scale: [0.5, 1.2, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: h.duration, ease: 'easeOut' }}
              className="absolute bottom-0 text-rose-400/70"
              style={{ width: h.size, height: h.size }}
            >
              <Heart fill="currentColor" className="w-full h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Broken Meter Confirmation */}
      <AnimatePresence>
        {isBroken && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center mt-2 flex flex-col items-center gap-4 w-full"
          >
            <div className="flex gap-1 mb-1">
              <Heart fill="#d64577" className="text-rose-500 animate-bounce w-6 h-6" />
              <Heart fill="#d64577" className="text-rose-500 animate-bounce w-6 h-6 delay-100" />
              <Heart fill="#d64577" className="text-rose-500 animate-bounce w-6 h-6 delay-200" />
            </div>
            
            <p className="text-sm md:text-base text-gray-300 px-4">
              "Yeah... you broke the meter. Happy now? 😭❤️"
            </p>

            <motion.button
              id="btn-love-meter-next"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onComplete}
              className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-sm hover:from-rose-600 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-500/20"
            >
              Okay, next! →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
