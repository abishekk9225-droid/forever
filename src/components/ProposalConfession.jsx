import React, { useMemo, useState } from 'react';

export default function ProposalConfession({ onAccept, onReject, onNext }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  // 60+ Massive Floating Hearts
  const hearts = useMemo(() => {
    return Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 98}%`,
      size: `${Math.random() * 1.5 + 1}rem`,
      duration: `${Math.random() * 4 + 4}s`,
      delay: `${Math.random() * 3}s`,
    }));
  }, []);

  const handleYes = () => {
    if (typeof onAccept === 'function') {
      onAccept();
    } else if (typeof onNext === 'function') {
      onNext();
    }
  };

  const moveNoButton = () => {
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 160;
    setNoPosition({ x: randomX, y: randomY });
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full bg-[#030712] flex flex-col items-center justify-end pb-12 md:pb-16 relative overflow-hidden select-none">
      
      {/* 1. Deep Blurred Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/as.jpg"
          alt="Ambient Background"
          className="w-full h-full object-cover filter blur-2xl scale-125 opacity-35"
        />
        <div className="absolute inset-0 bg-[#030712]/50"></div>
      </div>

      {/* 2. Uncropped Center Photo with Slow-Motion Zoom */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img
          src="/as.jpg"
          alt="Saranya & Abishek"
          className="h-full w-auto max-w-none md:max-w-4xl object-contain object-top opacity-95 drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-slow-zoom"
        />
        
        {/* Pulsing Vignette Effect */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/40 to-[#030712] animate-vignette-pulse pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent pointer-events-none"></div>
      </div>

      {/* 3. Massive Rising Neon Hearts Explosion */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        {hearts.map((h) => (
          <div
            key={h.id}
            className="absolute text-pink-500 animate-heart-rise drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]"
            style={{
              left: h.left,
              fontSize: h.size,
              animationDuration: h.duration,
              animationDelay: h.delay,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* 4. Center Title & Proposal Buttons */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center space-y-4 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-rose-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(244,63,94,0.7)] animate-fade-in">
          I LOVE YOU
        </h1>

        <p className="text-slate-100 text-base md:text-lg font-medium italic tracking-wide drop-shadow-md">
          "Saranya, will you be mine forever and ever? 💍✨"
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleYes}
            className="px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-amber-500 via-pink-600 to-rose-600 hover:opacity-95 shadow-[0_0_35px_rgba(244,63,94,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            Yes, Forever! 💍✨
          </button>

          <button
            style={{
              transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={moveNoButton}
            onTouchStart={moveNoButton}
            onClick={() => {
              moveNoButton();
              if (onReject) onReject();
            }}
            className="px-6 py-3 rounded-full font-medium text-slate-300 bg-slate-900/70 border border-slate-700 hover:border-pink-500/40 backdrop-blur-md transition-all duration-300 cursor-pointer select-none"
          >
            No 🙈
          </button>
        </div>
      </div>

    </div>
  );
}

export { ProposalConfession as ProposalScene };
