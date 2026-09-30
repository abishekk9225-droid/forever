import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Check, X } from 'lucide-react';

export default function QuizScene({ onComplete, onStateChange }) {
  const [selectedOption, setSelectedOption] = useState(null); // null, A, B, C, D

  const options = [
    { key: 'A', text: "Smile" },
    { key: 'B', text: "Voice" },
    { key: 'C', text: "Caring nature" },
    { key: 'D', text: "Everything 😭" }
  ];

  const handleSelect = (key) => {
    setSelectedOption(key);
    if (onStateChange) {
      if (key === 'C') {
        onStateChange('excited');
      } else {
        onStateChange('laughing');
      }
    }
  };

  const getResponseText = () => {
    if (selectedOption === 'C') {
      return {
        isCorrect: true,
        title: "CORRECT! 😭❤️",
        desc: "From the very beginning, your caring nature was what stood out to me. It immediately felt so warm and special."
      };
    }
    
    // Incorrect / Playful responses
    let hintText = "It was actually your caring nature! ❤️";
    if (selectedOption === 'A') hintText = "Your smile is beautiful, but it was actually your caring nature! ❤️";
    if (selectedOption === 'B') hintText = "Your voice is sweet, but it was actually your caring nature! ❤️";
    if (selectedOption === 'D') hintText = "Everything is a great answer 😭 but it was actually your caring nature that captured me first! ❤️";

    return {
      isCorrect: false,
      title: "Nice try... but no. 👀",
      desc: hintText
    };
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/5 shadow-2xl relative flex flex-col justify-between min-h-[380px]">
      
      <div className="text-center space-y-1 mb-4">
        <span className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold font-sans">
          Playful Quiz
        </span>
        <h3 className="text-xl md:text-2xl font-playfair font-semibold text-white">
          How well do you know me? 😌
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {!selectedOption ? (
          /* Question View */
          <motion.div
            key="quiz-question"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            <p className="text-sm md:text-base text-gray-300 text-center font-medium">
              What do you think I noticed first about you?
            </p>

            <div className="grid grid-cols-1 gap-3">
              {options.map((opt) => (
                <motion.button
                  key={opt.key}
                  id={`btn-quiz-opt-${opt.key}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(opt.key)}
                  className="w-full text-left px-5 py-3 rounded-2xl border border-white/10 bg-white/2 hover:bg-rose-500/10 hover:border-rose-500/30 text-gray-200 text-sm font-medium transition-all duration-300 flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center">
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Answer Feedback View */
          <motion.div
            key="quiz-feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center space-y-4 py-4"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
              getResponseText().isCorrect 
                ? 'bg-green-500/15 border border-green-500/30 text-green-400' 
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
            }`}>
              {getResponseText().isCorrect ? <Check size={26} /> : <X size={26} />}
            </div>

            <h4 className="text-lg md:text-xl font-semibold text-white">
              {getResponseText().title}
            </h4>

            <p className="text-xs md:text-sm text-gray-300 max-w-xs mx-auto leading-relaxed">
              {getResponseText().desc}
            </p>

            <motion.button
              id="btn-quiz-continue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={onComplete}
              className="mt-6 px-8 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/10"
            >
              Okay, next! →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
