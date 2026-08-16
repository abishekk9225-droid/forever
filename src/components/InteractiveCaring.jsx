import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, BookOpen, Smile, Gift } from 'lucide-react';

export default function InteractiveCaring({ onComplete, onStateChange }) {
  const [clickedCards, setClickedCards] = useState({
    noticed: false,
    remember: false,
    neverTold: false
  });
  const [activeReveal, setActiveReveal] = useState(null); // noticed, remember, neverTold

  const handleCardClick = (cardKey, mascotState) => {
    setClickedCards((prev) => ({ ...prev, [cardKey]: true }));
    setActiveReveal(cardKey);
    if (onStateChange) {
      onStateChange(mascotState);
    }
  };

  const cardData = {
    noticed: {
      title: "Something I noticed about you",
      icon: <Smile className="text-yellow-400" size={24} />,
      gradient: "from-rose-500/20 to-orange-500/20",
      border: "border-rose-500/30",
      content: (
        <div className="space-y-4 text-left">
          <p className="text-rose-300 font-playfair font-semibold text-lg">How easy it is to talk to you.</p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Right from our first chat, there was no awkwardness, no forced conversation. It just felt completely natural and comfortable.
          </p>
          <p className="text-xs text-gray-400 italic">
            I slowly started looking forward to hearing from you more than I probably should have. 😅
          </p>
        </div>
      )
    },
    remember: {
      title: "Something I remember",
      icon: <BookOpen className="text-purple-400" size={24} />,
      gradient: "from-purple-500/20 to-indigo-500/20",
      border: "border-purple-500/30",
      content: (
        <div className="space-y-4 text-left">
          <p className="text-purple-300 font-playfair font-semibold text-lg">Our first long call.</p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            We started talking, and before I knew it, hours had flown by. I remember staring at the screen after we hung up, wishing we could keep talking.
          </p>
          <p className="text-xs text-gray-400">
            That ordinary call was the moment I realized you were someone I wanted in my life.
          </p>
        </div>
      )
    },
    neverTold: {
      title: "Something I never told you",
      icon: <Gift className="text-pink-400" size={24} />,
      gradient: "from-pink-500/20 to-rose-500/20",
      border: "border-pink-500/30",
      content: (
        <div className="space-y-4 text-left">
          <p className="text-pink-300 font-playfair font-semibold text-lg">I was actually smiling like an idiot.</p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Every time my phone lit up with your name, I couldn't help but smile. I even walked around my room smiling while talking to you on that first call.
          </p>
          <p className="text-xs text-rose-200/90 font-medium">
            Yes, I was nervous, but you had this warm vibe that made me feel safe and happy right away.
          </p>
        </div>
      )
    }
  };

  const allRead = clickedCards.noticed && clickedCards.remember && clickedCards.neverTold;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold font-sans">
          Discover Our Story
        </span>
        <h3 className="text-xl md:text-2xl font-playfair font-semibold text-white">
          Choose a card to unlock...
        </h3>
        <p className="text-xs text-gray-500">Click each mysterious card to read my thoughts.</p>
      </div>

      {/* THREE CARDS SELECTION */}
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(cardData).map(([key, data]) => {
          const isClicked = clickedCards[key];
          return (
            <motion.button
              key={key}
              id={`btn-caring-card-${key}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(key, key === 'noticed' ? 'laughing' : key === 'remember' ? 'curious' : 'shy')}
              className={`w-full text-left p-5 rounded-2xl glass-card border flex items-center justify-between gap-4 transition-all duration-300 ${
                isClicked 
                  ? 'border-white/5 opacity-60 bg-white/1' 
                  : 'border-rose-500/20 hover:border-rose-500/40 shadow-md shadow-rose-500/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5`}>
                  {data.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    {data.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {isClicked ? 'Read ✓' : 'Click to discover 🔍'}
                  </p>
                </div>
              </div>
              <Sparkles size={16} className={isClicked ? 'text-gray-600' : 'text-rose-400/80 animate-pulse'} />
            </motion.button>
          );
        })}
      </div>

      {/* POPUP REVEAL CONTAINER */}
      <AnimatePresence mode="wait">
        {activeReveal && (
          <motion.div
            key={activeReveal}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${cardData[activeReveal].gradient} border ${cardData[activeReveal].border} shadow-2xl relative mt-4`}
          >
            {/* Close / Minimize button */}
            <button
              onClick={() => {
                setActiveReveal(null);
                if (onStateChange) onStateChange('idle');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close message"
            >
              <X size={16} />
            </button>
            
            {cardData[activeReveal].content}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL CONTINUE BUTTON */}
      <AnimatePresence>
        {allRead && !activeReveal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-6"
          >
            <button
              id="btn-caring-complete"
              onClick={onComplete}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-sm hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-rose-500/20 flex items-center gap-1.5"
            >
              Continue our story <Sparkles size={14} className="text-yellow-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
