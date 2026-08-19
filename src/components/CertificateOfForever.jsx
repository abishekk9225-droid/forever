import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Award, Heart, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export default function CertificateOfForever() {
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(certRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });
      const link = document.createElement('a');
      link.download = `Certificate-Of-Forever-Abishek-Saranya.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
    } catch (err) {
      console.error('Certificate generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-10 px-4 z-40 relative flex flex-col items-center">
      <div
        ref={certRef}
        className="w-full p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0e0716] via-[#05020a] to-[#120718] border-[3px] border-[#d4af37]/60 shadow-[0_0_60px_rgba(212,175,55,0.25)] relative text-center overflow-hidden select-none"
        style={{
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.2), inset 0 0 30px rgba(212, 175, 55, 0.1)',
        }}
      >
        <div className="absolute inset-3 rounded-2xl border border-[#d4af37]/40 pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-2 text-[#d4af37]">
          <Sparkles className="w-5 h-5 animate-pulse"/>
          <span className="text-xs font-mono uppercase tracking-[0.3em] font-semibold text-[#f3e5ab]">
            Official Registry of Eternal Love
          </span>
          <Sparkles className="w-5 h-5 animate-pulse"/>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffe082] via-[#ffd54f] to-[#ffb300] my-2 drop-shadow-[0_0_20px_rgba(255,213,79,0.4)]">
          CERTIFICATE OF FOREVER
        </h2>
        <p className="text-xs sm:text-sm font-serif italic text-rose-200/80 mb-6">
          "Two souls bound by love, destined to walk hand in hand for all eternity."
        </p>

        <div className="my-6 space-y-4 font-serif">
          <p className="text-xs sm:text-sm text-white/70 uppercase tracking-widest">
            This certifies that
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            <span className="text-2xl sm:text-4xl font-serif text-white tracking-wide border-b-2 border-[#d4af37]/60 pb-1 px-3">
              Abishek
            </span>
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse"/>
            <span className="text-2xl sm:text-4xl font-serif text-white tracking-wide border-b-2 border-[#d4af37]/60 pb-1 px-3">
              Saranya
            </span>
          </div>

          <p className="text-xs sm:text-sm text-rose-100/80 max-w-md mx-auto leading-relaxed pt-2">
            Are officially, unconditionally, and undeniably declared as{' '}
            <strong className="text-[#ffd54f]">Each Other’s Forever</strong> with an unbreakable promise of love, laughter, and lifelong togetherness.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-[#d4af37]/30 flex items-center justify-between px-2 sm:px-6">
          <div className="text-left font-mono text-[10px] sm:text-xs text-[#d4af37]/80">
            <p className="font-semibold text-white">COMMENCEMENT</p>
            <p>19 May 2026</p>
            <p className="text-[9px] text-white/40">Registered: 01:30 AM</p>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#8f1d1d] via-[#e11d48] to-[#991b1b] border-2 border-[#fef08a] shadow-[0_0_25px_rgba(225,29,72,0.6)] flex flex-col items-center justify-center text-white rotate-[-6deg]">
            <Award className="w-6 h-6 text-[#fef08a]"/>
            <span className="text-[8px] font-mono tracking-widest font-bold text-[#fef08a]">
              SEALED
            </span>
          </div>

          <div className="text-right font-mono text-[10px] sm:text-xs text-[#d4af37]/80">
            <p className="font-semibold text-white">VALIDITY</p>
            <p className="text-rose-400 font-bold">Infinite Lifetimes</p>
            <p className="text-[9px] text-white/40">Status: Verified ❤️</p>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleDownload}
        disabled={downloading}
        className="mt-6 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#b45309] text-black font-semibold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:brightness-110 transition cursor-pointer disabled:opacity-50"
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black"/>
            <span>Generating High-Res Certificate...</span>
          </>
        ) : downloaded ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-black"/>
            <span>Certificate Downloaded! ✨</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5 text-black"/>
            <span>Download Official Certificate (HD PNG) 📜</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
