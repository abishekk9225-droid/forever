import React, { useState } from 'react';
import { lettersData, secretLetterData } from '../data/letters';
import { Mail, Lock, Unlock, Sparkles, X, ArrowRight } from 'lucide-react';
import CinematicRainbowBorder from './CinematicRainbowBorder';

export default function OpenWhenLetters({ onComplete }) {
  const [openedLetters, setOpenedLetters] = useState([]);
  const [activeLetter, setActiveLetter] = useState(null);

  const handleOpenLetter = (letter) => {
    setActiveLetter(letter);
    if (!openedLetters.includes(letter.id)) {
      setOpenedLetters((prev) => [...prev, letter.id]);
    }
  };

  const isSecretUnlocked = openedLetters.length >= 4;

  const handleProceed = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col justify-between p-6 md:p-10 relative overflow-hidden select-none animate-in fade-in duration-700">
      {/* Screen-level Travelling Rainbow Border */}
      <CinematicRainbowBorder mode="screen" />
      
      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[160px] pointer-events-none"></div>

      <header className="text-center space-y-2 relative z-10">
        <span className="inline-flex items-center gap-1.5 text-pink-400 text-xs font-semibold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Sealed Words
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-white">
          "Some words are meant to be opened at the right moment."
        </h1>
        <p className="text-slate-400 text-sm">Whenever you need them, they will be right here.</p>
      </header>

      {/* 4 Sealed Envelopes */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 max-w-5xl mx-auto my-auto w-full py-6">
        {lettersData.map((item) => {
          const isOpen = openedLetters.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleOpenLetter(item)}
              className="cursor-pointer group rounded-3xl p-6 bg-slate-900/80 border border-slate-800 hover:border-pink-500/60 shadow-lg hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-semibold text-white text-base group-hover:text-pink-300 transition-colors">
                {item.title}
              </h3>
              <span className="text-[11px] font-medium tracking-wide uppercase px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800 text-slate-400">
                {isOpen ? "Re-read 💌" : "Sealed With Wax 🕯️"}
              </span>
            </div>
          );
        })}
      </main>

      {/* Secret Letter Lock/Unlock Area */}
      <div className="relative z-10 flex flex-col items-center justify-center my-4">
        {isSecretUnlocked ? (
          <button
            onClick={() => setActiveLetter(secretLetterData)}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-bold text-sm shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center gap-2 animate-bounce cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>Open The Final Secret Letter 🔐</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950/70 border border-slate-800 text-slate-500 text-xs">
            <Lock className="w-4 h-4" />
            <span>Open all 4 letters to unlock the secret confession</span>
          </div>
        )}
      </div>

      {/* Navigation to Celebration & Proposal */}
      <footer className="relative z-10 flex justify-end border-t border-slate-800 pt-4">
        <button
          onClick={handleProceed}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:opacity-95 cursor-pointer active:scale-95 transition-all"
        >
          <span>Continue Journey ❤️</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* Realistic Handwritten Letter Viewer Modal */}
      {activeLetter && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#fdfbf7] text-[#2c221e] rounded-3xl p-8 md:p-10 shadow-[0_0_60px_rgba(255,255,255,0.2)] relative border-8 border-[#f4ede2] animate-in fade-in zoom-in-95 duration-500 space-y-6">
            <button
              onClick={() => setActiveLetter(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#e8decf] text-stone-700 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#e2d6c3] pb-3 text-center">
              <span className="text-xl">{activeLetter.icon}</span>
              <h2 className="text-xl font-serif font-bold text-stone-800 mt-1">{activeLetter.title}</h2>
            </div>

            <div className="whitespace-pre-line text-sm md:text-base leading-relaxed font-serif text-stone-700 max-h-[50vh] overflow-y-auto pr-2">
              {activeLetter.message}
            </div>

            <button
              onClick={() => setActiveLetter(null)}
              className="w-full py-3 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
            >
              Close Letter
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
