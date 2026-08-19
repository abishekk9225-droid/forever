import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Sparkles, Clock, Heart, ArrowRight } from 'lucide-react';

export default function PromiseEntryGate({ onProceed }) {
  const [step, setStep] = useState(1); // 1: Rule, 2: Timer, 3: Final Acceptance
  const [timeLeft, setTimeLeft] = useState(60);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  // 60-Second Countdown logic
  useEffect(() => {
    if (step !== 2) return;
    if (timeLeft <= 0) {
      setStep(3);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const dodgeNoButton = () => {
    const randomX = (Math.random() - 0.5) * 260;
    const randomY = (Math.random() - 0.5) * 160;
    setNoPos({ x: randomX, y: randomY });
    setDodgeCount((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 z-30">
      <AnimatePresence mode="wait">
        {/* SCREEN 1: ENTRY PASS & PROMISE */}
        {step === 1 && (
          <motion.div
            key="screen-1"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Ticket className="w-8 h-8 animate-pulse"/>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">
              Hold on! Entry Pass theva... 🎟️
            </h2>
            <p className="text-rose-200/90 text-sm sm:text-base font-serif italic mb-8 leading-relaxed">
              "Naan kekkuradha accept pannuven nu oru promise panna thaan unlock aagum! 🤍"
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setStep(2)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>I Promise 🤞</span>
              <Sparkles className="w-4 h-4"/>
            </motion.button>
          </motion.div>
        )}

        {/* SCREEN 2: 1:00 MINUTE THINKING TIMER WITH MODERN PROMISE LINE */}
        {step === 2 && (
          <motion.div
            key="screen-2"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-rose-400">
              <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }}/>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300">
                Thinking Time
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-white mb-6">
              Take a breath & Think... 💭
            </h3>

            {/* Glowing Timer Circle */}
            <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border-2 border-rose-400/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(244,114,182,0.3)] mb-6">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-widest">
                00:{String(timeLeft).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono uppercase text-rose-300/70 mt-1">
                Seconds Left
              </span>
            </div>

            {/* Modernized Romantic Promise Quote */}
            <p className="text-rose-200/90 text-sm sm:text-base font-serif italic mb-6 leading-relaxed">
              "Yedhu nadandhalum, endha situation-la yum naan un kooda thaan iruppen... promise! 🤍✨"
            </p>

            <button
              onClick={() => setStep(3)}
              className="text-xs text-rose-300/70 hover:text-white underline underline-offset-4 transition cursor-pointer"
            >
              Skip timer & enter now ⚡
            </button>
          </motion.div>
        )}

        {/* SCREEN 3: FINAL DECISION GATE WITH RUNAWAY NO BUTTON */}
        {step === 3 && (
          <motion.div
            key="screen-3"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-8 h-8 fill-rose-400 animate-bounce"/>
            </div>

            <h3 className="text-2xl font-serif text-white mb-2">
              Ready to see our special world? ✨
            </h3>
            <p className="text-rose-200/80 text-xs sm:text-sm font-serif italic mb-8">
              "No backsies! You already made the promise 💍"
            </p>

            <div className="flex items-center justify-center gap-5 relative min-h-[90px] w-full">
              {/* YES BUTTON */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={onProceed}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.5)] transition cursor-pointer z-10"
              >
                Yes, Take Me In! 💖
              </motion.button>

              {/* RUNAWAY NO BUTTON */}
              <motion.button
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onMouseEnter={dodgeNoButton}
                onTouchStart={dodgeNoButton}
                onClick={dodgeNoButton}
                className="py-3 px-6 rounded-2xl bg-zinc-900/80 border border-white/20 text-white/50 text-xs hover:text-white/80 transition-colors select-none cursor-pointer"
              >
                No 😢
              </motion.button>
            </div>

            {dodgeCount > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-300/80 italic mt-3"
              >
                {dodgeCount > 2
                  ? "Indha button click aagathu! Only 'Yes' is allowed 😜❤️"
                  : "Oops! You can't touch this 🙈"}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
