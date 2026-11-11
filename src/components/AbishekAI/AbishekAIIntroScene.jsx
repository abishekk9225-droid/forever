import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Heart, Globe, ArrowRight } from 'lucide-react';
import { primeIntroAudioOnUserGesture } from '../../utils/introAudioManager';

/**
 * ABISHEK AI - Cinematic Introduction Scene
 * Introduces ABISHEK AI to Saranya before entering the Camera Presence & Privacy Protection scene.
 */
export default function AbishekAIIntroScene({ onContinue }) {
  // Support English and Tamil based on user selection or browser locale
  const [lang, setLang] = useState(() => {
    if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('ta')) {
      return 'ta';
    }
    return 'en';
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-[#040108] text-white overflow-hidden select-none font-sans">
      {/* 1. Cinematic Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-700/20 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-rose-600/20 blur-[150px] pointer-events-none animate-pulse [animation-delay:1.5s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 19) % 100}vw`,
              y: `${(i * 23) % 100}vh`,
              opacity: 0.2 + (i % 5) * 0.15,
              scale: 0.6 + (i % 4) * 0.2,
            }}
            animate={{
              y: ['0vh', '-10vh', '0vh'],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + (i % 4) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i % 3) * 0.8,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-rose-300 shadow-[0_0_8px_rgba(244,114,182,0.8)]"
          />
        ))}
      </div>

      {/* 2. Glassmorphic Introduction Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg p-7 sm:p-9 rounded-3xl bg-slate-950/85 border border-purple-500/35 shadow-[0_0_60px_rgba(168,85,247,0.35),0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-center space-y-6"
      >
        {/* Language Switcher Tabs */}
        <div className="flex justify-center items-center">
          <div className="inline-flex p-1 rounded-full bg-slate-900/90 border border-purple-500/25 text-xs">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('ta')}
              className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                lang === 'ta'
                  ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Glowing AI Icon with Heartbeat Pulse */}
        <div className="relative mx-auto w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-purple-900 via-rose-950 to-slate-950 border border-purple-400/50 flex items-center justify-center shadow-[0_0_35px_rgba(168,85,247,0.5)]">
          <span className="absolute inset-0 rounded-3xl bg-purple-500/20 animate-ping opacity-30 pointer-events-none" />
          <Bot className="w-10 h-10 sm:w-11 sm:h-11 text-purple-200 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
          <Heart className="w-4 h-4 text-rose-400 absolute -top-1.5 -right-1.5 fill-rose-400 animate-pulse drop-shadow-[0_0_8px_#f43f5e]" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -bottom-1 -left-1 animate-bounce drop-shadow-[0_0_8px_#f59e0b]" />
        </div>

        {/* Headings */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-mono text-purple-300 mb-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Companion · Created by Abishek</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-purple-100 to-amber-200 tracking-wide">
            ABISHEK AI ❤️
          </h1>
          <p className="text-xs sm:text-sm font-serif italic text-rose-300/90 tracking-wide">
            The Heart Behind This Journey.
          </p>
        </div>

        {/* Introduction Text Content */}
        <AnimatePresence mode="wait">
          {lang === 'en' ? (
            <motion.div
              key="en"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-purple-400/20 text-xs sm:text-[13px] text-slate-200/90 leading-relaxed font-sans space-y-2 text-left"
            >
              <p className="font-medium text-white">Hello! I'm ABISHEK AI.</p>
              <p>I'm here to help you discover more about Abishek.</p>
              <p>
                You can ask me anything about his personality, dreams, education, interests, projects, and the things he has shared.
              </p>
              <p className="text-rose-300 font-medium pt-1">
                Throughout this journey, I'll be your little companion. ❤️
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="ta"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-purple-400/20 text-xs sm:text-[13px] text-slate-200/90 leading-relaxed font-sans space-y-2 text-left"
            >
              <p className="font-semibold text-white">வணக்கம்! நான் ABISHEK AI. ❤️</p>
              <p>இந்தப் பயணத்தில் அபிஷேக்கைப் பற்றி உனக்குத் தெரிந்துகொள்ள வேண்டிய எந்தக் கேள்வியையும் என்னிடம் கேட்கலாம்.</p>
              <p>அவனுடைய கனவுகள், திறமைகள், நினைவுகள், அவனுடைய மனசு... என்னால் முடிந்தவரை உனக்குச் சொல்கிறேன்.</p>
              <p className="text-rose-300 font-medium pt-1">
                இந்தப் பயணத்தில் உனக்கு நான் ஒரு சிறிய துணையாக இருப்பேன். ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Action Button */}
        <motion.button
          type="button"
          onClick={() => {
            primeIntroAudioOnUserGesture();
            if (typeof onContinue === 'function') {
              onContinue();
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:via-rose-500 hover:to-amber-500 text-white font-serif font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-200 shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>MEET ABISHEK AI ❤️</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}
