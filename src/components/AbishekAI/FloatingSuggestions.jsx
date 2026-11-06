import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X } from 'lucide-react';

const SUGGESTIONS = [
  // English
  { text: 'Who is Abishek?', lang: 'en' },
  { text: 'Is Abishek a good boy?', lang: 'en' },
  { text: 'Does Abishek really love me?', lang: 'en' },
  { text: 'What are his dreams?', lang: 'en' },
  { text: 'Tell me something about Abishek.', lang: 'en' },
  // Tamil
  { text: 'அபிஷேக் எப்படிப்பட்டவன்?', lang: 'ta' },
  { text: 'அவன் நல்லவனா?', lang: 'ta' },
  { text: 'அவன் என்னை உண்மையாக நேசிக்கிறானா?', lang: 'ta' },
  { text: 'அவனுடைய கனவுகள் என்ன?', lang: 'ta' },
  { text: 'அபிஷேக்கைப் பற்றி சொல்லு.', lang: 'ta' },
  // Tanglish
  { text: 'Abishek epdi patta person?', lang: 'tanglish' },
  { text: 'Avan nallavana?', lang: 'tanglish' },
  { text: 'Avan enna unmaiya love panrana?', lang: 'tanglish' },
  { text: 'Avanoda dreams enna?', lang: 'tanglish' },
];

const ROTATION_INTERVAL_MS = 6000; // Rotate every 6 seconds

const FloatingSuggestions = React.memo(function FloatingSuggestions({ onSelectSuggestion, isChatOpen }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // Rotate suggestions every 6s when not dismissed and chat is not open
  useEffect(() => {
    if (isDismissed || isChatOpen) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SUGGESTIONS.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isDismissed, isChatOpen]);

  const handleDismiss = useCallback((e) => {
    e.stopPropagation();
    setIsDismissed(true);
  }, []);

  // Do not show bubble if chat window is open or user dismissed it
  if (isDismissed || isChatOpen) return null;

  const current = SUGGESTIONS[currentIndex];

  return (
    <div className="absolute bottom-[72px] sm:bottom-[82px] left-0 pointer-events-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.92 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={() => onSelectSuggestion(current.text)}
          className="group relative flex items-center gap-2 max-w-[280px] sm:max-w-[320px] px-3.5 py-2 rounded-2xl bg-slate-950/92 hover:bg-slate-900 border border-purple-500/35 hover:border-rose-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-xl cursor-pointer transition-all duration-200 active:scale-95 select-none"
        >
          {/* Subtle speech bubble tail pointing down to AI button */}
          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-slate-950/95 border-b border-r border-purple-500/35 transform rotate-45 pointer-events-none" />

          {/* Glowing sparkle icon */}
          <div className="shrink-0 w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            <Sparkles className="w-3 h-3 text-amber-200" />
          </div>

          {/* Suggestion Text */}
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-[11px] sm:text-xs font-serif font-medium text-rose-100 group-hover:text-white truncate">
              "{current.text}"
            </p>
            <span className="text-[9px] font-mono text-purple-300/70 block">
              Tap to ask ABISHEK AI ✨
            </span>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss suggestions"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default FloatingSuggestions;
