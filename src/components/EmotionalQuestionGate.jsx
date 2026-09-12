import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { sendEmail } from '../utils/emailService';

export default function EmotionalQuestionGate({ onAccept, onReset }) {
  const [celebrating, setCelebrating] = useState(false);

  // Fireworks / Celebration effect
  const triggerCelebration = () => {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 75, zIndex: 99999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    // Instant central burst
    confetti({
      ...defaults,
      particleCount: 80,
      origin: { x: 0.5, y: 0.45 },
      colors: ['#ff1493', '#ff69b4', '#ffd700', '#ff0055', '#a855f7', '#ffffff'],
      shapes: ['circle', 'square'],
    });

    // Fireworks cannons from left and right
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 45 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.15, 0.35), y: Math.random() * 0.4 + 0.2 },
        colors: ['#ff1493', '#ff69b4', '#ffd700', '#ff0055', '#a855f7'],
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.65, 0.85), y: Math.random() * 0.4 + 0.2 },
        colors: ['#ff1493', '#ff69b4', '#ffd700', '#ff0055', '#a855f7'],
      });
    }, 250);
  };

  const handleFeelingsClick = () => {
    setCelebrating(true);
    triggerCelebration();

    // Trigger email notification via existing EmailJS
    sendEmail({
      title: 'Saranya Clicked: Feelings இருக்கு ❤️',
      message: 'Saranya unlocked the passcode "saranya" and accepted the emotional question by clicking: "Feelings இருக்கு ❤️"!',
    }).catch((err) => {
      console.warn('EmailJS notification error:', err);
    });

    // Smooth transition to next scenes
    setTimeout(() => {
      if (typeof onAccept === 'function') {
        onAccept();
      }
    }, 700);
  };

  const handleNoFeelingsClick = () => {
    if (typeof onReset === 'function') {
      onReset();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none">
      {/* Romantic ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating subtle ambient symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [-15, 15, -15], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute top-12 left-10 text-pink-400/30 text-2xl"
        >
          ✨❤️
        </motion.div>
        <motion.div
          animate={{ y: [15, -20, 15], rotate: [0, -15, 15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute bottom-16 right-10 text-rose-400/30 text-2xl"
        >
          🌸💖
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-pink-500/30 shadow-2xl space-y-6 relative z-10"
      >
        {/* Soft Heart Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.25)]">
          <Heart className="w-7 h-7 fill-pink-500/30 animate-pulse text-pink-400" />
        </div>

        {/* எமோஷனல் கேள்வி */}
        <h2 className="text-xl md:text-2xl font-medium text-pink-100 leading-relaxed">
          "உனக்குத்தான் என்னைப் பிடிக்கலை, எந்த feelings-ம் இல்லைனு சொல்ற, சரி... ஆனா உண்மைல உனக்கு என் மேல ஒரு துளி feelings இருந்தா மட்டும் உள்ள வா, இல்லன்னா எந்த அழுத்தமும் இல்லாம வெளியவே நில்லு..."
        </h2>

        {/* இரண்டு பட்டன்கள் */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* Feelings இருக்கு பட்டன் (Celebration trigger செய்யும்) */}
          <button
            onClick={handleFeelingsClick}
            disabled={celebrating}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-80"
          >
            {celebrating ? 'உண்மையான அன்புடன்... ❤️' : 'Feelings இருக்கு ❤️'}
          </button>

          {/* No Feelings பட்டன் (ஆரம்பப் பக்கத்திற்குத் திருப்பும்) */}
          <button
            onClick={handleNoFeelingsClick}
            disabled={celebrating}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 px-6 rounded-xl border border-slate-700 transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            No Feelings 🍃
          </button>
        </div>
      </motion.div>
    </div>
  );
}
