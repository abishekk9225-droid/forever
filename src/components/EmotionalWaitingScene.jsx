import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { sendEmail } from '../utils/emailService';
import { useSound } from '../context/SoundContext';

const ADMIN_PHONE = '6380404055';

// Emotional Tamil Lines (Subtitles / Handwritten Memories)
const EMOTIONAL_LINES = [
  "நான் காத்திருப்பேன்...",
  "ஒரு நாள் நீ திரும்பிப் பார்ப்பாய் என்று...",
  "எவ்வளவு காலம் ஆனாலும்...",
  "என் மனசு காத்திருக்க தெரியும்...",
  "உனக்காக...",
  "100 ஜென்மம் எடுத்தாலும்...",
  "நான் காத்திருப்பேன்."
];

// Pre-computed floating butterflies (28 particles)
const BUTTERFLY_PARTICLES = Array.from({ length: 28 }).map((_, i) => ({
  id: i,
  startX: (i * 13.7) % 94 + 3,
  startY: (i * 19.3) % 90 + 5,
  size: 14 + (i % 5) * 4,
  duration: 6 + (i % 6) * 1.8,
  delay: (i * 0.45) % 4,
  driftX: ((i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 15)),
}));

// Pre-computed glass-like falling tear droplets (18 particles)
const TEAR_DROPLETS = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  left: (i * 17.9) % 92 + 4,
  duration: 4.5 + (i % 4) * 1.5,
  delay: (i * 0.7) % 6,
  size: 3 + (i % 3) * 1.5,
}));

export default function EmotionalWaitingScene({ onComplete }) {
  const { playKaTrack } = useSound();
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [isClimaxReached, setIsClimaxReached] = useState(false);
  const [showCallPrompt, setShowCallPrompt] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  const hasSentEmailRef = useRef(false);
  const audioSwitchedRef = useRef(false);

  // 1. Scene Entry: Send EmailJS notification at most once per session
  useEffect(() => {
    if (!hasSentEmailRef.current) {
      hasSentEmailRef.current = true;
      sendEmail({
        title: 'She opened the emotional chapter ❤️',
        message: 'Saranya reached the final emotional waiting scene: "100 ஜென்மம் காத்திருப்பேன்...".',
      }).catch((err) => console.log('Scene notification skipped:', err));
    }

    // 2. Timeline Heartbeat Progression (lub... lub... lub-lub...)
    if (window.heartbeatEngine) {
      window.heartbeatEngine.start();
      window.heartbeatEngine.setTargetBPM(60, 0.28);
    }

    const tHeartbeat1 = setTimeout(() => {
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(68, 0.32);
      }
    }, 5000);

    const tHeartbeat2 = setTimeout(() => {
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(76, 0.35);
      }
    }, 12000);

    const tHeartbeat3 = setTimeout(() => {
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(84, 0.38);
      }
    }, 22000);

    // 3. Audio Sequence: Existing song continues softly, then crossfades into /ka.mpe
    const tCrossfade = setTimeout(() => {
      if (!audioSwitchedRef.current) {
        audioSwitchedRef.current = true;
        if (typeof playKaTrack === 'function') {
          playKaTrack();
        } else if (window.soundController?.playKaTrack) {
          window.soundController.playKaTrack();
        }
      }
    }, 8500);

    return () => {
      clearTimeout(tHeartbeat1);
      clearTimeout(tHeartbeat2);
      clearTimeout(tHeartbeat3);
      clearTimeout(tCrossfade);
    };
  }, [playKaTrack]);

  // 4. Sequential Tamil subtitle-like line transitions
  useEffect(() => {
    if (isClimaxReached) return;

    if (currentLineIdx < EMOTIONAL_LINES.length) {
      const lineDuration = 3800; // 3.8 seconds per line
      const timer = setTimeout(() => {
        setCurrentLineIdx((prev) => prev + 1);
      }, lineDuration);
      return () => clearTimeout(timer);
    } else {
      // All lines shown -> transition to Grand Emotional Climax
      const climaxTimer = setTimeout(() => {
        setIsClimaxReached(true);
      }, 1000);
      return () => clearTimeout(climaxTimer);
    }
  }, [currentLineIdx, isClimaxReached]);

  // 5. Climax timing: reveal Call Me & Continue buttons after climax lines sink in
  useEffect(() => {
    if (isClimaxReached) {
      const promptTimer = setTimeout(() => {
        setShowCallPrompt(true);
      }, 3500);
      return () => clearTimeout(promptTimer);
    }
  }, [isClimaxReached]);

  const handleCallClick = () => {
    setIsCalling(true);
    if (window.heartbeatEngine) {
      window.heartbeatEngine.setTargetBPM(92, 0.40);
    }

    setTimeout(() => {
      if (ADMIN_PHONE) {
        window.location.href = `tel:${ADMIN_PHONE}`;
      }
      setIsCalling(false);
    }, 600);
  };

  const handleContinue = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#02040a] text-slate-100 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden select-none z-[120] animate-in fade-in duration-1000">
      
      {/* 1. Deep Atmospheric Lighting: Soft Rose/Navy Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Center Breathing Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/15 rounded-full blur-[140px]" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-900/15 rounded-full blur-[130px]" />

        {/* Cinematic Screen-Edge Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(2,4,10,0.85)]" />
      </div>

      {/* 2. Glass-like Glowing Tear Droplets (Slow Falling longing effect) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {TEAR_DROPLETS.map((tear) => (
          <motion.div
            key={tear.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: ['0vh', '105vh'],
              opacity: [0, 0.6, 0.7, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: tear.duration,
              delay: tear.delay,
              ease: 'easeInOut',
            }}
            style={{
              left: `${tear.left}%`,
              width: `${tear.size}px`,
              height: `${tear.size * 3.5}px`,
            }}
            className="absolute rounded-full bg-gradient-to-b from-white/70 via-rose-300/40 to-transparent blur-[0.6px] shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          />
        ))}
      </div>

      {/* 3. Fluttering Butterflies & Heart Motifs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {BUTTERFLY_PARTICLES.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0 }}
            animate={{
              x: [0, b.driftX, 0],
              y: [0, -40, 0],
              opacity: [0.15, 0.65, 0.15],
              rotate: [0, b.id % 2 === 0 ? 12 : -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: b.duration,
              delay: b.delay,
              ease: 'easeInOut',
            }}
            style={{
              left: `${b.startX}%`,
              top: `${b.startY}%`,
            }}
            className="absolute text-rose-300/45 text-sm md:text-base select-none"
          >
            {b.id % 4 === 0 ? '🦋' : b.id % 4 === 1 ? '✨' : b.id % 4 === 2 ? '🤍' : '🌸'}
          </motion.div>
        ))}
      </div>

      {/* 4. Main Emotional Dialogue Container */}
      <div className="relative z-20 max-w-xl w-full mx-auto text-center flex flex-col items-center justify-center space-y-8 px-4">
        
        {/* Subtle Scene Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs tracking-widest font-mono uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>100 ஜென்மம் காத்திருப்பேன்...</span>
        </motion.div>

        {/* Phase 1: Progressive Subtitle Tamil Lines */}
        {!isClimaxReached && (
          <div className="min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentLineIdx < EMOTIONAL_LINES.length && (
                <motion.p
                  key={currentLineIdx}
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xl sm:text-2xl md:text-3xl font-serif text-white/95 leading-relaxed tracking-wide drop-shadow-[0_2px_15px_rgba(244,63,94,0.3)]"
                >
                  "{EMOTIONAL_LINES[currentLineIdx]}"
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Phase 2: Grand Climax Emotional Message */}
        {isClimaxReached && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Climax Core Lines */}
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-rose-300 leading-snug drop-shadow-[0_0_25px_rgba(244,63,94,0.4)]"
              >
                "உனக்காக நான் 100 ஜென்மம் எடுத்தாலும்
                <br />
                காத்திருப்பேன்..."
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.6 }}
                className="text-lg sm:text-2xl font-serif text-rose-300 font-semibold italic flex items-center justify-center gap-2"
              >
                <span>"ஏன்னா... நீ என்னோடையவள்."</span>
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-bounce inline-block" />
              </motion.p>
            </div>

            {/* Optional Call Prompt & Action Buttons */}
            {showCallPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0 }}
                className="pt-4 space-y-4 flex flex-col items-center"
              >
                <div className="space-y-1 text-xs sm:text-sm font-serif italic text-slate-300/85">
                  <p className="text-pink-300 font-medium">இப்போ பேசணும்னு தோணுதா? 📞</p>
                  <p className="text-slate-400">"எப்போ வேண்டுமானாலும்... எனக்கு call பண்ணலாம்."</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm pt-2">
                  {/* Optional Call Button */}
                  {ADMIN_PHONE && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCallClick}
                      className={`w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white text-sm font-semibold shadow-[0_0_25px_rgba(244,63,94,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isCalling ? 'animate-pulse' : ''
                      }`}
                    >
                      <Phone className="w-4 h-4 fill-white animate-pulse" />
                      <span>Call Me ❤️</span>
                    </motion.button>
                  )}

                  {/* Continue Journey Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleContinue}
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-medium border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue Journey</span>
                    <ArrowRight className="w-4 h-4 text-rose-400" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
