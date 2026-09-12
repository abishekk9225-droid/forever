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
      message: 'Saranya unlocked the passcode "saranya" and accepted the emotional question by clicking: "Feelings ❤️"!',
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
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none">
      
      {/* Background Cyber Glow & Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-600/20 via-rose-600/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Glassmorphism Card with Heavy Neon Border & Shadow */}
      <div className="max-w-xl w-full bg-slate-900/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_50px_rgba(244,63,94,0.15)] space-y-8 relative z-10">
        
        {/* Glowing Icon Badge */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/30 to-rose-600/30 border border-pink-400/50 flex items-center justify-center text-pink-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-bounce">
            <Heart className="w-8 h-8 fill-pink-500 text-pink-300" />
          </div>
        </div>

        {/* Question Text with High Contrast & Glow */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur-lg opacity-20"></div>
          <h2 className="relative text-xl md:text-2xl font-semibold text-white leading-relaxed tracking-wide drop-shadow-md">
            "உனக்குத்தான் என்னைப் பிடிக்கலை, எந்த feelings-ம் இல்லைனு சொல்ற, சரி... ஆனா உண்மைல உனக்கு என் மேல ஒரு துளி feelings இருந்தா மட்டும் உள்ள வா, இல்லன்னா வேண்டாம் ..."
          </h2>
        </div>

        {/* Clean Buttons: Only 'Feelings' and 'No Feelings' */}
        <div className="flex flex-col sm:flex-row gap-5 pt-4">
          
          {/* Feelings Button - Cyber Pink Neon Glow */}
          <button 
            onClick={handleFeelingsClick}
            disabled={celebrating}
            className="flex-1 group relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:shadow-[0_0_35px_rgba(244,63,94,0.8)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-pink-400/40 cursor-pointer disabled:opacity-80"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg tracking-wider">
              {celebrating ? 'Feelings... ❤️' : 'Feelings ❤️'}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* No Feelings Button - Sleek Dark Glass */}
          <button 
            onClick={handleNoFeelingsClick}
            disabled={celebrating}
            className="flex-1 group bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold py-4 px-8 rounded-2xl border border-slate-700/80 hover:border-slate-500 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2 text-lg tracking-wider">
              No Feelings 🍃
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}
