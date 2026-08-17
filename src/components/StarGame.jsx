import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';

export default function StarGame({ onComplete }) {
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  // Generate 10 stars with randomized safe viewport coordinates
  useEffect(() => {
    const starList = Array.from({ length: 10 }, (_, idx) => ({
      id: idx,
      x: 10 + Math.random() * 80, // percentage 10% to 90%
      y: 15 + Math.random() * 55, // percentage 15% to 70%
      size: Math.random() * 14 + 16,
      clicked: false
    }));
    setStars(starList);
  }, []);

  const handleStarClick = (star, e) => {
    if (star.clicked) return;

    // Trigger HeartBurst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (window.triggerHeartBurst) {
      window.triggerHeartBurst(x, y, 14);
    }

    // Trigger spatial bird chirp based on star position
    if (window.triggerBirdChirp) {
      const pan = (star.x - 50) / 50; // pan left to right based on coordinates
      window.triggerBirdChirp(pan);
    }

    setStars(prev => prev.map(s => s.id === star.id ? { ...s, clicked: true } : s));
    setScore(prev => {
      const nextScore = prev + 1;
      if (nextScore === 10) {
        setTimeout(() => setGameFinished(true), 600);
      }
      return nextScore;
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative min-h-[380px] flex flex-col justify-between overflow-hidden select-none">
      
      {/* Header / Scoreboard */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
        <span className="text-[10px] uppercase tracking-widest text-rose-300 font-bold flex items-center gap-1.5">
          <Sparkles size={12} className="animate-spin text-yellow-300" style={{ animationDuration: '3s' }} />
          Star Catch Game
        </span>
        <span className="text-xs font-semibold text-rose-300">
          Caught: {score} / 10
        </span>
      </div>

      {/* Main Play Area */}
      <div className="relative flex-grow min-h-[220px] rounded-2xl bg-black/10 overflow-hidden border border-white/5">
        <AnimatePresence>
          {!gameFinished ? (
            stars.map((star) => (
              !star.clicked && (
                <motion.button
                  key={star.id}
                  onClick={(e) => handleStarClick(star, e)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.25 }}
                  className="absolute p-2 bg-yellow-300/10 hover:bg-yellow-300/25 border border-yellow-300/30 rounded-full flex items-center justify-center text-yellow-300 pointer-events-auto"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px rgba(253, 224, 71, 0.25)'
                  }}
                >
                  <Sparkles size={star.size * 0.55} className="animate-pulse" />
                </motion.button>
              )
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                <Trophy size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Test Passed!
                </h4>
                <p className="text-xs text-gray-400 max-w-[240px]">
                  You caught them all. But there is still one thing left...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-center">
        <button
          onClick={onComplete}
          disabled={!gameFinished}
          className={`px-8 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
            gameFinished
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-md shadow-rose-500/10'
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
