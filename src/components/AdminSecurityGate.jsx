import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, KeyRound, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';

const SECRET_WORD = 'SARANYA';

export default function AdminSecurityGate({ onUnlocked }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === SECRET_WORD.toLowerCase()) {
      setError(false);
      if (typeof window.unlockAudio === 'function') {
        window.unlockAudio();
      }
      onUnlocked();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05020a]/95 backdrop-blur-3xl px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.2)] text-center relative overflow-hidden"
      >
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
          <Lock className="w-8 h-8 animate-pulse"/>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2 tracking-wide">
          A Secret For You ❤️
        </h2>
        <p className="text-xs sm:text-sm text-rose-200/70 mb-6 font-light">
          Enter the secret word to unlock our special world
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              placeholder="Enter secret word..."
              className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-rose-400/30 text-center text-white text-xl tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-white/20 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition shadow-inner"
              required
              autoFocus
            />
            <KeyRound className="absolute right-4 top-4 w-5 h-5 text-white/30"/>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-400 text-xs"
            >
              Incorrect secret word. Need a hint below? 😉
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,114,182,0.4)] transition duration-300 group cursor-pointer"
          >
            <span>Unlock Forever</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
          </button>
        </form>

        {/* Cute Hint Trigger */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-rose-300/80 hover:text-rose-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5"/>
            <span>{showHint ? "Hide Hint" : "Need a Hint? 💡"}</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200 text-xs italic"
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1 text-rose-400"/>
                "Your name? (7 Letters) ✨"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
