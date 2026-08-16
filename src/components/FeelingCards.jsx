import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function FeelingCards({ onComplete, onStateChange }) {
  const [visited, setVisited] = useState({
    voice: false,
    caring: false,
    talk: false,
    feel: false
  });
  
  const [activeCard, setActiveCard] = useState(null);

  const cards = [
    { 
      key: 'voice', 
      text: "Your voice", 
      desc: "Every time my phone screen lit up, my day got a little brighter. 😌" 
    },
    { 
      key: 'caring', 
      text: "Your caring", 
      desc: "Honestly... this is the one that touched my heart the most. ❤️" 
    },
    { 
      key: 'talk', 
      text: "The way you talk", 
      desc: "We could talk for hours, and it still felt like we just started." 
    },
    { 
      key: 'feel', 
      text: "The way you make me feel", 
      desc: "Like I'm talking to someone who genuinely cares about me." 
    }
  ];

  const handleCardClick = (key) => {
    // Play chime sound
    if (window.playRomanticChime) {
      window.playRomanticChime();
    }
    
    setVisited((prev) => ({ ...prev, [key]: true }));
    setActiveCard(key);
    
    // Trigger mascot reaction
    if (onStateChange) {
      const reactions = ['shy', 'laughing', 'excited'];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      onStateChange(randomReaction);
    }
  };

  const exploredCount = Object.values(visited).filter(Boolean).length;
  const allExplored = exploredCount === 4;
  const remaining = 4 - exploredCount;

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/5 shadow-2xl relative flex flex-col gap-6 select-none min-h-[460px] justify-between">
      
      {/* Card Header Prompt */}
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold font-sans">
          First Feeling
        </span>
        <h3 className="text-lg md:text-xl font-playfair font-semibold text-white">
          Explore my initial feelings...
        </h3>
      </div>

      {/* The 4 Grid Cards */}
      <div className="grid grid-cols-2 gap-3.5 my-2">
        {cards.map((card) => {
          const isVisited = visited[card.key];
          const isActive = activeCard === card.key;
          
          return (
            <motion.button
              key={card.key}
              id={`btn-feel-card-${card.key}`}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCardClick(card.key)}
              className={`p-4 h-24 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all duration-300 backdrop-blur-md relative overflow-hidden ${
                isActive
                  ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10'
                  : isVisited
                  ? 'bg-white/5 border-rose-500/20 opacity-90'
                  : 'bg-white/2 border-white/5 opacity-50 hover:opacity-80'
              }`}
            >
              <Heart 
                size={16} 
                className={`transition-all duration-300 ${isVisited ? 'text-rose-500 scale-110 filter drop-shadow-[0_0_4px_#ff0055]' : 'text-gray-500'}`} 
                fill={isVisited ? 'currentColor' : 'none'} 
              />
              <span className="text-xs font-semibold text-white tracking-wide leading-tight">
                {card.text}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Card Content Reveal Display Box */}
      <div className="min-h-[70px] flex items-center justify-center px-2">
        <AnimatePresence mode="wait">
          {activeCard && (
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <p className="text-xs md:text-sm text-rose-200/90 italic leading-relaxed font-sans">
                "{cards.find((c) => c.key === activeCard).desc}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress & Hints Container */}
      <div className="text-center space-y-2 py-2 border-t border-white/5">
        <motion.div
          key={exploredCount}
          initial={{ scale: 0.95, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-sm font-bold tracking-wide text-rose-300 font-sans"
        >
          {allExplored ? (
            <span className="flex items-center justify-center gap-1 text-green-400">
              4 / 4 discovered ❤️
            </span>
          ) : (
            <span>{exploredCount} / 4 discovered</span>
          )}
        </motion.div>

        <p className="text-[11px] text-gray-500 min-h-[16px]">
          {allExplored ? (
            "You found all the secrets! ✨"
          ) : remaining === 4 ? (
            "Tap each one... there's something I want you to know. ❤️"
          ) : (
            `There's still ${remaining} more little secret${remaining > 1 ? 's' : ''} to discover... 👀`
          )}
        </p>
      </div>

      {/* Next Scene Continuation Button */}
      <div className="min-h-[50px] flex items-center justify-center mt-2">
        <AnimatePresence>
          {allExplored && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full text-center"
            >
              <motion.button
                id="btn-feeling-cards-continue"
                onClick={onComplete}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(214,69,119,0.3)] hover:shadow-[0_0_25px_rgba(214,69,119,0.5)] flex items-center justify-center gap-2"
              >
                ENTER OUR GARDEN ❤️ <Sparkles size={14} className="text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
