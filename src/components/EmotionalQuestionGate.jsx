import React, { useState, useEffect } from 'react';
import { Heart, Mail, Sparkles, Send } from 'lucide-react';

export default function EmotionalQuestionGate({ onFeelings, onNoFeelings }) {
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "நீ எப்போ இதை ஓபன் பண்ணுவனு எனக்குத் தெரியல... ஆனா உன்கிட்ட பேசணும்னு தோணினப்போ இது உருவானது...";

  // Typewriter Effect Logic
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none">

      {/* Background Cyber Neon Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-600/25 via-rose-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

      {/* Main Glassmorphic Container */}
      <div className="max-w-xl w-full bg-slate-900/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_60px_rgba(244,63,94,0.2)] space-y-8 relative z-10">

        {/* Floating Neon Heart Icon Badge */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/30 to-rose-600/30 border border-pink-400/50 flex items-center justify-center text-pink-400 shadow-[0_0_25px_rgba(244,63,94,0.5)] animate-bounce">
            <Heart className="w-8 h-8 fill-pink-500 text-pink-300" />
          </div>
        </div>

        {/* Main Question */}
        <h2 className="text-lg md:text-xl font-medium text-white leading-relaxed tracking-wide drop-shadow-md">
          "உனக்குத்தான் என்னைப் பிடிக்கலை, எந்த feelings-ம் இல்லைனு சொல்ற, சரி... ஆனா உண்மைல உனக்கு என் மேல ஒரு துளி feelings இருந்தா மட்டும் உள்ள வா, இல்லன்னா எந்த அழுத்தமும் இல்லாம வெளியவே நில்லு..."
        </h2>

        {/* Advanced Typewriter Hidden Memory Note */}
        <div className="bg-pink-950/30 border border-pink-500/20 rounded-2xl p-4 shadow-inner">
          <p className="text-pink-200/90 text-sm md:text-base font-light italic tracking-wide min-h-[3rem] flex items-center justify-center">
            "{typedText}
            <span className="animate-ping inline-block w-1.5 h-4 bg-pink-400 ml-1 rounded-full"></span>"
          </p>
        </div>

        {/* Modern Buttons: Feelings & No Feelings */}
        <div className="flex flex-col sm:flex-row gap-5 pt-2">

          {/* Feelings Button with Advanced Floating Neon Celebration Trigger */}
          <button
            onClick={onFeelings}
            className="flex-1 group relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:shadow-[0_0_40px_rgba(244,63,94,0.8)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-pink-400/40"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg tracking-wider">
              Feelings ❤️
            </span>
            <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* No Feelings Button */}
          <button
            onClick={onNoFeelings}
            className="flex-1 group bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold py-4 px-8 rounded-2xl border border-slate-700/80 hover:border-slate-500 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
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