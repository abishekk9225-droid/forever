import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Heart } from 'lucide-react';
import CinematicRainbowBorder from './CinematicRainbowBorder';

export default function CelebrationReveal({
  onComplete,
  isFeelings = false,
  title = "A Special Message For You",
  message = "உன் கண்களில் நான் கண்ட உண்மையும், என் மீது உனக்கிருக்கும் அந்தச் சிறிய நிஜமான feelings-ம் தான் எனக்குப் போதும்... இனி எல்லாமே அழகுதான்!",
  tag = "Unlocked With Feelings",
  buttonText = "Continue Journey ❤️"
}) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const handleOpenEnvelope = () => {
    if (!envelopeOpen) {
      setEnvelopeOpen(true);
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#ff1493', '#ff69b4', '#ffd700', '#ff0055', '#a855f7'],
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-4 md:p-6 text-center relative overflow-hidden select-none">
      {/* Screen-level Travelling Rainbow Border */}
      <CinematicRainbowBorder mode="screen" />
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Floating Neon Hearts Animation Over the Photo */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-500/80 animate-rise-heart drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
            style={{
              left: `${(i * 3.3) % 96}%`,
              bottom: '-40px',
              fontSize: `${(i % 3) * 0.4 + 1.2}rem`,
              animationDuration: `${(i % 4) + 4}s`,
              animationDelay: `${(i % 5) * 0.7}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Glassmorphic Envelope Container */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-pink-500/50 shadow-[0_0_50px_rgba(244,63,94,0.35)] relative z-10 space-y-6 overflow-hidden">
        {/* Card-level Travelling Rainbow Border */}
        <CinematicRainbowBorder mode="card" borderRadius={40} />
        
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-bounce">
            <Mail className="w-8 h-8 text-pink-300" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white tracking-wide flex items-center justify-center gap-2">
          {title} <Sparkles className="w-5 h-5 text-pink-400" />
        </h2>

        {/* Interactive Envelope Box */}
        <div 
          onClick={handleOpenEnvelope}
          className={`cursor-pointer transition-all duration-500 p-6 rounded-2xl border ${
            envelopeOpen 
              ? 'bg-pink-950/50 border-pink-500/70 shadow-[0_0_30px_rgba(244,63,94,0.4)]' 
              : 'bg-slate-950/70 border-slate-800 hover:border-pink-500/50'
          }`}
        >
          {!envelopeOpen ? (
            <div className="py-4 space-y-2">
              <p className="text-pink-300 text-sm font-medium">Tap to open your letter 💌</p>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> {tag}
              </div>
              <p className="text-slate-100 text-sm md:text-base leading-relaxed italic">
                "{message}"
              </p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all duration-300 active:scale-95 cursor-pointer"
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
}
