import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Award, Download, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoveCertificate() {
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#fffefb', // Clean vintage white/cream background
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
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f43f5e', '#ffffff']
      });
    } catch (error) {
      console.error('Certificate download failed:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black/95 text-center z-30 select-none">
      
      {/* VINTAGE CERTIFICATE CANVAS */}
      <motion.div
        ref={certificateRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl p-8 sm:p-12 rounded-xl bg-[#fffefb] border-8 border-double border-[#d4af37] text-zinc-900 shadow-[0_0_60px_rgba(212,175,55,0.3)] text-center relative overflow-hidden my-6"
      >
        {/* CORNER ORNAMENTS */}
        <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-[#d4af37] pointer-events-none" />
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-[#d4af37] pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-[#d4af37] pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-[#d4af37] pointer-events-none" />

        {/* AWARD TITLE */}
        <div className="pt-2">
          <h2 className="text-xs sm:text-sm font-mono tracking-[0.3em] text-amber-700 uppercase mb-2">
            ✦ SPECIAL RECOGNITION OF LOVE ✦
          </h2>
          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wider text-amber-800 uppercase">
            MY FOREVER & ALWAYS AWARD
          </h1>
        </div>

        <p className="text-xs sm:text-sm font-serif italic text-zinc-500 mt-4 tracking-wide uppercase">
          Presented with all my heart to :
        </p>

        {/* RECIPIENT NAMES WITH HEART */}
        <div className="my-4 py-2 border-b-2 border-zinc-300 max-w-md mx-auto">
          <span className="text-2xl sm:text-4xl font-serif font-bold text-rose-600 tracking-wide flex items-center justify-center gap-3">
            Abishek <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-rose-500 text-rose-500 inline-block animate-pulse"/> Saranya
          </span>
        </div>

        <p className="text-xs sm:text-sm font-serif text-zinc-600 leading-relaxed max-w-lg mx-auto px-4 my-4">
          For being my peace, my happiness, and the most precious part of my life. Thank you for walking this beautiful journey with me forever.
        </p>

        {/* SEAL & ROMANTIC SIGNATURE FOOTER */}
        <div className="flex items-end justify-between mt-8 pt-4 px-6 text-left">
          <div className="text-center">
            <span className="text-xs sm:text-sm font-serif font-bold text-rose-600 block mb-1 italic">With All My Love ❤️</span>
            <div className="w-32 border-b border-zinc-400 mb-1"></div>
            <span className="text-[10px] font-serif text-zinc-500 uppercase tracking-widest">Forever Bound</span>
          </div>

          {/* RED RIBBON MEDAL SEAL */}
          <div className="flex flex-col items-center justify-center relative -mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-700 to-rose-500 border-2 border-amber-300 flex items-center justify-center text-amber-200 shadow-md">
              <Award className="w-8 h-8"/>
            </div>
            <div className="w-8 h-6 bg-rose-800 -mt-1 clip-path-ribbon"></div>
          </div>

          <div className="text-center">
            <span className="text-xs sm:text-sm font-serif font-bold text-zinc-700 block mb-1">23/08/2026</span>
            <div className="w-28 border-b border-zinc-400 mb-1"></div>
            <span className="text-[10px] font-serif text-zinc-500 uppercase tracking-widest">Forever Yours 💍</span>
          </div>
        </div>

      </motion.div>

      {/* DOWNLOAD BUTTON */}
      <div className="flex items-center justify-center mt-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-rose-500 text-zinc-950 font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center gap-3 cursor-pointer"
        >
          <Download className="w-5 h-5"/>
          <span>Download Forever Award Certificate</span>
        </motion.button>
      </div>

    </div>
  );
}
