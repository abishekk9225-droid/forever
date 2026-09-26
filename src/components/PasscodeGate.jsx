import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function PasscodeGate({ onUnlock, onUnlocked }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === 'SARANYA26') {
      setError(false);
      if (typeof window.unlockAudio === 'function') {
        window.unlockAudio();
      }
      const callback = onUnlock || onUnlocked;
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-pink-600/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="w-full h-full flex items-center justify-between gap-4 md:gap-6 lg:gap-8 max-w-[1920px] mx-auto z-10">
        {/* Left Side Dynamic Full Photo (/sa.jpg) */}
        <div className="hidden md:flex flex-1 h-[88vh] rounded-3xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_40px_rgba(244,63,94,0.35)] backdrop-blur-md relative group transition-all duration-500 animate-fade-in">
          <img
            src="/sa.jpg"
            alt="Saranya"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/80 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-pink-300 text-xs font-medium tracking-wider uppercase text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Forever In My Eyes
            </p>
          </div>
        </div>

        {/* Central Elevated Glassmorphic Passcode Box */}
        <div className="relative z-20 w-full max-w-md shrink-0 bg-slate-900/85 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_60px_rgba(244,63,94,0.3)] text-center space-y-6 mx-auto animate-fade-in">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 shadow-[0_0_25px_rgba(244,63,94,0.4)] animate-bounce">
              <Lock className="w-8 h-8 text-pink-300" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
              A Secret For You <span className="text-pink-500">❤️</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Enter the secret word to unlock our special world
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter secret word..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                className="w-full bg-slate-950/70 text-pink-100 placeholder-slate-500 border border-pink-500/30 focus:border-pink-500 rounded-2xl py-3.5 pl-11 pr-11 text-center text-lg outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-pink-400/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400/60 hover:text-pink-300 transition-colors p-1"
                aria-label={showPassword ? "Hide secret word" : "Show secret word"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-rose-400 text-sm font-medium animate-shake">
                Wrong secret code! Try again ❤️
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              Unlock Forever &gt;
            </button>
          </form>
        </div>

        {/* Right Side Dynamic Full Photo (/sk.jpg) */}
        <div className="hidden md:flex flex-1 h-[88vh] rounded-3xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_40px_rgba(244,63,94,0.35)] backdrop-blur-md relative group transition-all duration-500 animate-fade-in">
          <img
            src="/sk.jpg"
            alt="Saranya & Abishek"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/20 via-transparent to-slate-950/80 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-pink-300 text-xs font-medium tracking-wider uppercase text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Always In My Heart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
