import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

export default function EasterEggs() {
  const [clickCount, setClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const handleHeartClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    
    if (nextCount >= 5) {
      setShowSecret(true);
      setClickCount(0);
    }
  };

  return (
    <>
      {/* Tiny decorative heart in corner */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={handleHeartClick}
          className="p-2 rounded-full text-white/10 hover:text-rose-500/40 transition-colors duration-300 relative group"
          title="Secret"
          aria-label="Secret Heart"
        >
          <Heart size={14} fill="currentColor" className="animate-pulse" />
          
          {/* Subtle hint bubble on hover */}
          <span className="absolute bottom-full right-0 mb-1 scale-0 group-hover:scale-100 bg-black/60 text-[8px] text-white/50 px-1.5 py-0.5 rounded backdrop-blur-md transition-all duration-300 pointer-events-none whitespace-nowrap">
            {clickCount > 0 ? `${clickCount}/5` : '✨'}
          </span>
        </button>
      </div>

      {/* Secret Modal */}
      <AnimatePresence>
        {showSecret && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm glass-card border border-rose-500/20 p-6 md:p-8 rounded-3xl relative overflow-hidden"
            >
              {/* Decorative glows */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-rose-500/20 rounded-full filter blur-xl" />
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-500/20 rounded-full filter blur-xl" />
              
              <button
                onClick={() => setShowSecret(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Secret"
              >
                <X size={16} />
              </button>

              <div className="flex justify-center mb-4 text-rose-500">
                <Heart size={28} fill="currentColor" className="animate-bounce" />
              </div>

              <h4 className="text-lg font-playfair font-semibold text-white text-center mb-4">
                You found the secret! 👀
              </h4>

              <div className="space-y-4 text-sm text-gray-300 leading-relaxed text-center">
                <p>
                  "I made this entire website because I wanted you to know you're worth the effort."
                </p>
                <p className="text-rose-300 italic">
                  "PS: Yes, I was nervous making this. 😭❤️"
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setShowSecret(false)}
                  className="px-6 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-full text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95"
                >
                  Keep it safe 🔒
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
