import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Sparkles, X, MessageCircle } from 'lucide-react';
import { useScene } from '../../context/SceneProvider';
import ChatWindow from './ChatWindow';
import './AbishekAI.css';

/**
 * ABISHEK AI - Global Floating Personal Assistant & Website Guide
 * Stays mounted and persistent across all 23 scenes in the bottom-left corner.
 */
const AbishekAI = React.memo(function AbishekAI() {
  const [isOpen, setIsOpen] = useState(false);
  const sceneContext = useScene();
  const currentScene = sceneContext?.currentScene || 'INTRO';

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-[9990] pointer-events-auto select-none">
      {/* 1. Animated Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            isOpen={isOpen}
            onClose={handleClose}
            currentScene={currentScene}
          />
        )}
      </AnimatePresence>

      {/* 2. Floating AI Assistant Launcher Button */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="abishek-ai-button-glow relative group flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-slate-950 via-purple-950/90 to-slate-900 border border-purple-500/40 hover:border-rose-400/80 text-white transition-all duration-200 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
        title={isOpen ? 'Close ABISHEK AI' : 'Open ABISHEK AI · Your Personal Assistant'}
        aria-label="ABISHEK AI Assistant"
      >
        {/* Glowing pulse ring */}
        <span className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping opacity-40 pointer-events-none" />

        {/* Floating icon */}
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-rose-300 transition-transform duration-200 rotate-90" />
          ) : (
            <>
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-200 group-hover:text-rose-200 transition-colors duration-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
              {/* Little golden sparkle */}
              <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
            </>
          )}
        </div>

        {/* Online Status Pill */}
        <span
          className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_#34d399]"
          title="ABISHEK AI is active"
        />

        {/* Hover Tooltip Label */}
        <span className="absolute left-14 sm:left-16 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-purple-500/30 text-rose-100 text-[11px] font-serif whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:inline-block">
          ABISHEK AI <span className="text-[10px] text-purple-300">· Ask anything</span>
        </span>
      </motion.button>
    </div>
  );
});

export default AbishekAI;

