import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Sparkles, X, Heart } from 'lucide-react';
import { useScene } from '../../context/SceneProvider';
import ChatWindow from './ChatWindow';
import FloatingSuggestions from './FloatingSuggestions';
import './AbishekAI.css';

/**
 * ABISHEK AI - Global Floating Personal Assistant & Website Guide
 * Upgraded launcher button (25% larger, subtle heartbeat, crimson-purple glow)
 * with auto-rotating floating suggestion bubble above it.
 */
const AbishekAI = React.memo(function AbishekAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAutoSendQuery, setPendingAutoSendQuery] = useState(null);
  const sceneContext = useScene();
  const currentScene = sceneContext?.currentScene || 'INTRO';

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelectSuggestion = useCallback((query) => {
    setPendingAutoSendQuery(query);
    setIsOpen(true);
  }, []);

  const handleClearPendingAutoSend = useCallback(() => {
    setPendingAutoSendQuery(null);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-[9990] pointer-events-auto select-none">
      {/* 1. Floating Question Suggestion Bubble (Rotates every 6s above the button) */}
      <FloatingSuggestions
        onSelectSuggestion={handleSelectSuggestion}
        isChatOpen={isOpen}
      />

      {/* 2. Animated Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            isOpen={isOpen}
            onClose={handleClose}
            currentScene={currentScene}
            pendingAutoSendQuery={pendingAutoSendQuery}
            onClearPendingAutoSend={handleClearPendingAutoSend}
          />
        )}
      </AnimatePresence>

      {/* 3. Upgraded Floating AI Assistant Launcher Button (20-25% larger, heartbeat pulse) */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="abishek-ai-button-glow-upgraded relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-slate-950 via-purple-950/95 to-slate-900 border-2 border-purple-500/50 hover:border-rose-400 text-white transition-all duration-200 cursor-pointer shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md"
        title={isOpen ? 'Close ABISHEK AI' : 'Open ABISHEK AI · Your Personal Assistant'}
        aria-label="ABISHEK AI Assistant"
      >
        {/* Subtle heartbeat pulsation ring */}
        <span className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping opacity-35 pointer-events-none" />

        {/* Floating icon with subtle heartbeat effect */}
        <div className="relative flex items-center justify-center animate-ai-heartbeat">
          {isOpen ? (
            <X className="w-6 h-6 text-rose-300 transition-transform duration-200 rotate-90" />
          ) : (
            <>
              <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-purple-200 group-hover:text-rose-200 transition-colors duration-200 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              {/* Little golden sparkle */}
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse drop-shadow-[0_0_6px_#f59e0b]" />
              {/* Little floating heart */}
              <Heart className="w-2.5 h-2.5 text-rose-400 absolute -bottom-1 -left-1 fill-rose-400 animate-pulse drop-shadow-[0_0_6px_#f43f5e]" />
            </>
          )}
        </div>

        {/* Online Status Pill */}
        <span
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_10px_#34d399] animate-pulse"
          title="ABISHEK AI is active"
        />

        {/* Hover Tooltip Label */}
        <span className="absolute left-18 sm:left-20 px-3 py-1.5 rounded-2xl bg-slate-950/95 border border-purple-500/40 text-rose-100 text-xs font-serif whitespace-nowrap shadow-2xl backdrop-blur-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:inline-flex items-center gap-1.5">
          <span className="font-bold">ABISHEK AI ❤️</span>
          <span className="text-[11px] text-purple-300">· The Heart Behind This Journey</span>
        </span>
      </motion.button>
    </div>
  );
});

export default AbishekAI;
