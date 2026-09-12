import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendEmail } from '../utils/emailService';

export default function EmotionalQuestionGate({ onFeelings, onNoFeelings, onAccept, onReset }) {
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
      title: 'Saranya Clicked: Feelings ❤️',
      message: 'Saranya unlocked the passcode "saranya" and accepted the emotional question by clicking: "Feelings"!',
    }).catch((err) => {
      console.warn('EmailJS notification error:', err);
    });

    // Smooth transition to next scenes
    setTimeout(() => {
      const callback = onFeelings || onAccept;
      if (typeof callback === 'function') {
        callback();
      }
    }, 600);
  };

  const handleNoFeelingsClick = () => {
    const callback = onNoFeelings || onReset;
    if (typeof callback === 'function') {
      callback();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-lg w-full bg-slate-900/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-pink-500/20 shadow-2xl space-y-8 relative z-10">
        
        {/* Top Icon Badge */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-inner animate-pulse">
            <Heart className="w-7 h-7 fill-pink-500/30 text-pink-400" />
          </div>
        </div>

        {/* Emotional Question */}
        <h2 className="text-lg md:text-xl font-normal text-pink-100/90 leading-relaxed tracking-wide">
          "உனக்குத்தான் என்னைப் பிடிக்கலை, எந்த feelings-ம் இல்லைனு சொல்ற, சரி... ஆனா உண்மைல உனக்கு என் மேல ஒரு துளி feelings இருந்தா மட்டும் உள்ள வா, இல்லன்னா எந்த அழுத்தமும் இல்லாம வெளியவே நில்லு..."
        </h2>

        {/* Action Buttons: Only "Feelings" and "No Feelings" */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          
          {/* Feelings Button */}
          <button 
            onClick={handleFeelingsClick}
            disabled={celebrating}
            className="flex-1 group relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3.5 px-6 rounded-2xl shadow-lg shadow-pink-500/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-80"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-base">
              {celebrating ? 'Feelings... ❤️' : 'Feelings'}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* No Feelings Button */}
          <button 
            onClick={handleNoFeelingsClick}
            disabled={celebrating}
            className="flex-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium py-3.5 px-6 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2 text-base">
              No Feelings
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}
