import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import CinematicSceneAtmosphere from './CinematicSceneAtmosphere';

// Corner ornaments SVG
const CornerOrnament = ({ className }) => (
  <svg viewBox="0 0 120 120" className={`absolute w-16 h-16 sm:w-28 sm:h-28 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 110 10 L 10 10 L 10 110" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 100 15 L 15 15 L 15 100" stroke="#d4af37" strokeWidth="0.75" opacity="0.8" />
    <path d="M 15 45 C 15 35, 35 15, 45 15 C 55 15, 55 25, 45 25 C 38 25, 35 20, 38 18 C 40 16, 45 18, 42 22" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 15 70 C 15 50, 50 15, 70 15" stroke="#f43f5e" strokeWidth="1.2" opacity="0.75" strokeLinecap="round" />
    <path d="M 30 10 C 40 10, 50 15, 50 25 C 50 32, 42 35, 42 28 C 42 24, 48 24, 46 28" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 10 30 C 10 40, 15 50, 25 50 C 32 50, 35 42, 28 42 C 24 42, 24 48, 28 46" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M 22 22 Q 35 25 40 35" stroke="#d4af37" strokeWidth="0.75" />
    <circle cx="40" cy="35" r="1.5" fill="#d4af37" />
    <path d="M 22 22 Q 25 35 35 40" stroke="#d4af37" strokeWidth="0.75" />
    <circle cx="35" cy="40" r="1.5" fill="#d4af37" />
  </svg>
);

// Center swirl flourish
const CenterOrnament = ({ className }) => (
  <svg viewBox="0 0 200 30" className={`w-36 sm:w-56 h-8 text-[#d4af37] fill-none ${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M 100 15 C 90 7, 85 23, 75 15 C 65 7, 55 23, 45 15 C 35 7, 25 23, 5 15" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 100 15 C 110 7, 115 23, 125 15 C 135 7, 145 23, 155 15 C 165 7, 175 23, 195 15" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 92 15 C 92 8, 100 5, 100 12 C 100 5, 108 8, 108 15 C 108 22, 100 25, 100 28 C 100 25, 92 22, 92 15 Z" fill="#f43f5e" opacity="0.15" />
    <path d="M 92 15 C 92 8, 100 5, 100 12 C 100 5, 108 8, 108 15 C 108 22, 100 25, 100 28" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="100" cy="18" r="2.5" fill="#d4af37" />
    <circle cx="83" cy="15" r="1.5" fill="#d4af37" />
    <circle cx="117" cy="15" r="1.5" fill="#d4af37" />
  </svg>
);

// High-fidelity pleated Rosette Seal SVG
const RosetteSeal = () => (
  <div className="relative flex flex-col items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
    <svg viewBox="0 0 100 100" className="absolute top-10 sm:top-14 w-16 h-16 sm:w-24 sm:h-24 z-0">
      <path d="M 40 10 L 22 80 L 34 74 L 46 80 Z" fill="#881337" stroke="#4c0519" strokeWidth="1" />
      <path d="M 60 10 L 78 80 L 66 74 L 54 80 Z" fill="#881337" stroke="#4c0519" strokeWidth="1" />
    </svg>
    <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-24 sm:h-24 z-10 drop-shadow-md">
      <polygon
        points="50,8 53,17 61,12 62,21 71,17 68,26 77,24 73,33 81,35 76,43 82,48 76,53 81,59 73,63 76,71 68,71 70,80 61,78 59,87 52,83 50,89 47,83 40,87 38,78 29,80 31,71 23,71 26,63 18,59 23,53 17,48 23,43 18,35 26,33 22,24 31,26 28,17 37,21 38,12 46,17"
        fill="#9f1239"
        stroke="#4c0519"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="#d4af37" strokeWidth="0.75" />
      <circle cx="50" cy="50" r="25" fill="#4c0519" />
      <polygon points="50,36 60,42 60,54 50,60 40,54 40,42" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <path d="M 50 51 C 50 51 45 47 45 44.5 C 45 43 46.5 41.5 48 41.5 C 49 41.5 49.5 42 50 42.5 C 50.5 42 51 41.5 52 41.5 C 53.5 41.5 55 43 55 44.5 C 55 47 50 51 50 51 Z" fill="#d4af37" />
    </svg>
  </div>
);

export default function LoveCertificate({ onVisible }) {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // T = 0 sec: Start /oo.mp3 immediately with volume 0.85
    try {
      const audio = new Audio('/oo.mp3');
      audio.volume = 0.85;
      audio.loop = false;
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Certificate audio pending interaction/ready:', err);
        });
      }
    } catch (e) {
      console.warn('Certificate audio initialization error:', e);
    }

    // T = 0–3 sec: keep certificate hidden
    // T = EXACTLY 3.0 sec: allow Love Certificate page transition to appear normally
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      if (onVisible) onVisible();
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  const handleDownload = async () => {
    if (!certificateRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#fffefb',
        scale: 3,
        useCORS: true,
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'My-Forever-And-Always-Award-Abishek-Saranya.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 140,
        spread: 95,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f43f5e', '#ffffff']
      });
    } catch (error) {
      console.error('Certificate download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 text-center z-30 select-none relative animate-fade-in">
      {/* Cinematic Shared Atmosphere */}
      <CinematicSceneAtmosphere accentGlow="amber" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Great+Vibes&family=Montserrat:wght@400;500;600&display=swap');
        
        .font-vintage-title { font-family: 'Cinzel', serif; }
        .font-vintage-script { font-family: 'Great Vibes', cursive; }
        .font-vintage-sans { font-family: 'Montserrat', sans-serif; }

        @keyframes certificateSweep {
          0% { transform: translateX(-150%) skewX(-20deg); }
          50% { transform: translateX(200%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>

      {/* VINTAGE CERTIFICATE CANVAS WITH CINEMATIC LIGHT SWEEP (REVEALS AT T = 3.0s) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="certificate-card"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            <div
              ref={certificateRef}
              className="w-full max-w-2xl p-6 sm:p-12 rounded-sm bg-[#fffefb] border-[14px] border-double border-[#d4af37] text-zinc-900 shadow-[0_0_70px_rgba(212,175,55,0.45)] text-center relative overflow-hidden my-4 sm:my-6"
            >
              {/* Subtle Archival Paper Texture Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25 z-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 80%)',
                }}
              />

              {/* Cinematic Light Sweep Across the Certificate */}
              <div
                className="absolute inset-y-0 w-32 pointer-events-none z-[12] opacity-40"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                  animation: 'certificateSweep 7s ease-in-out infinite',
                }}
              />

              {/* NESTED INNER GOLD LINE */}
              <div className="absolute inset-2 border border-[#d4af37]/70 pointer-events-none z-[5]" />

              {/* CORNER ORNAMENTS */}
              <CornerOrnament className="top-3 left-3 z-[6]" />
              <CornerOrnament className="top-3 right-3 scale-x-[-1] z-[6]" />
              <CornerOrnament className="bottom-3 left-3 scale-y-[-1] z-[6]" />
              <CornerOrnament className="bottom-3 right-3 scale-x-[-1] scale-y-[-1] z-[6]" />

              {/* TOP ORNAMENT */}
              <div className="flex justify-center mt-2 mb-4 relative z-10">
                <CenterOrnament />
              </div>

              {/* AWARD TITLE */}
              <div className="my-2 sm:my-4 flex flex-col items-center relative z-10">
                <span className="font-vintage-title text-base sm:text-2xl font-bold tracking-[0.25em] text-amber-900 uppercase">
                  MY FOREVER &
                </span>
                <h1 className="font-vintage-title text-3xl sm:text-5xl font-black tracking-[0.05em] text-amber-950 uppercase mt-1">
                  ALWAYS AWARD
                </h1>
              </div>

              <p className="font-vintage-sans text-xs sm:text-sm font-medium text-zinc-500 tracking-widest uppercase mt-5 relative z-10">
                Presented to :
              </p>

              {/* RECIPIENT NAMES WITH PULSING HEART */}
              <div className="my-3 py-2 border-b border-zinc-300 max-w-md mx-auto relative z-10">
                <span className="font-vintage-script text-3xl sm:text-6xl text-rose-600 tracking-wide font-medium flex items-center justify-center gap-2">
                  Abishek <Heart className="w-6 h-6 sm:w-10 sm:h-10 fill-rose-500 text-rose-500 inline-block animate-pulse mx-1" /> Saranya
                </span>
              </div>

              <p className="font-vintage-sans text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto px-4 my-5 relative z-10">
                For being my peace, my happiness, and the most precious part of my life.
                Thank you for always being there for me and for turning ordinary moments into extraordinary memories.
              </p>

              {/* SEAL & ROMANTIC SIGNATURE FOOTER */}
              <div className="grid grid-cols-3 items-end mt-6 sm:mt-10 px-2 sm:px-6 relative z-10">
                {/* Left: Signature */}
                <div className="flex flex-col items-center">
                  <span className="font-vintage-script text-base sm:text-2xl text-rose-600 mb-1 select-none">
                    With All My Love ❤️
                  </span>
                  <div className="w-24 sm:w-36 border-b border-zinc-400" />
                  <span className="font-vintage-sans text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1">
                    Signature
                  </span>
                </div>

                {/* Center: Rosette Seal */}
                <div className="flex justify-center -mb-2">
                  <RosetteSeal />
                </div>

                {/* Right: Date */}
                <div className="flex flex-col items-center">
                  <span className="font-vintage-sans text-xs sm:text-base font-semibold text-zinc-800 mb-2">
                    23/08/2026
                  </span>
                  <div className="w-24 sm:w-36 border-b border-zinc-400" />
                  <span className="font-vintage-sans text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-1">
                    Date
                  </span>
                </div>
              </div>

              {/* BOTTOM ORNAMENT */}
              <div className="flex justify-center mt-5 relative z-10">
                <CenterOrnament className="rotate-180" />
              </div>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="flex items-center justify-center mt-2 relative z-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-rose-500 text-zinc-950 font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(251,191,36,0.5)] flex items-center gap-3 cursor-pointer transition"
              >
                <Download className="w-5 h-5"/>
                <span>{isDownloading ? 'Saving Your Certificate...' : 'Download Forever Award Certificate'}</span>
                <Sparkles className="w-4 h-4 text-amber-950" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
