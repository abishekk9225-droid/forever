import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Heart } from 'lucide-react';

export default function Letter3D({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  const letterText = `Dear Saranya,

Our connection started with a phone call. At that time, I had no idea that one ordinary conversation would eventually lead me here.

Over the days, I slowly started noticing the genuine way you care. Honestly, that's what touched my heart the most. I appreciate how you make those around you feel comfortable and looked after.

Maybe that's why, without realizing it, you became someone very important to me.

I don't know what the future has planned, but I know the value of having someone real by your side. Someone who listens, someone who respects, and someone who chooses to stay when things aren't easy. 

I started feeling that person could be you.

I can't promise a perfect life, but I can promise my complete honesty, my respect, and my care.

So Saranya... there's one thing I've been wanting to ask you.

Are you ready?`;

  const handleOpen = () => {
    if (window.playRomanticChime) window.playRomanticChime();
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[440px] relative px-4 select-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Floating 3D Envelope Card */
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateY: [0, 8, -8, 0], 
              rotateX: [0, -4, 4, 0],
              y: [0, -8, 0]
            }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 45, y: -20 }}
            transition={{
              animate: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
              opacity: { duration: 0.35 },
              scale: { duration: 0.35 }
            }}
            onClick={handleOpen}
            className="w-full bg-gradient-to-br from-[#1b0d26] to-[#0a0312] border border-rose-500/15 p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center text-center cursor-pointer hover:border-rose-500/35 hover:shadow-rose-500/5 group relative overflow-hidden pointer-events-auto"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            {/* Envelope visual flaps */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-[#251533]/40 border-b border-rose-500/10 pointer-events-none z-10" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />

            {/* Inner atmospheric lines */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative mb-3 z-20">
              <div className="absolute inset-0 bg-rose-500/10 rounded-full filter blur-xl group-hover:bg-rose-500/20 transition-all duration-300" />
              <div className="w-18 h-18 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:text-rose-300 transition-all duration-300 relative border border-rose-500/20">
                <Mail size={30} className="animate-bounce" style={{ animationDuration: '3.5s' }} />
              </div>
            </div>
            
            {/* Gold Wax-Seal Medallion */}
            <div className="relative my-4 z-20 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border border-amber-300 shadow-xl flex items-center justify-center text-amber-950 font-bold hover:scale-110 active:scale-95 transition-transform duration-300">
              <Heart size={18} fill="currentColor" className="text-amber-950/80 filter drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]" />
              {/* Inner wax ripples */}
              <div className="absolute inset-1 rounded-full border border-amber-300/35 pointer-events-none" />
            </div>
            
            <p className="text-gray-300 font-medium mb-2.5 text-sm md:text-base leading-relaxed font-playfair z-20">
              "There's something I wanted to show you..."
            </p>
            <p className="text-rose-300/80 font-playfair italic text-xs md:text-sm mb-6 z-20">
              "Tap the seal to open."
            </p>
            
            <span className="btn-primary z-20">
              Open Envelope ✉
            </span>
          </motion.div>
        ) : (
          /* Opened Letter sliding out */
          <motion.div
            key="opened"
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full bg-[#160d21] border border-rose-500/20 rounded-3xl p-1 relative shadow-paper overflow-hidden flex flex-col pointer-events-auto">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500" />
              
              {/* Envelope inside header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-2 text-rose-300">
                  <MailOpen size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider font-sans">A message for you</span>
                </div>
                <span className="text-[10px] text-gray-400 font-sans font-medium">From Abishek</span>
              </div>

              {/* Scrollable Letter Body */}
              <div className="max-h-[310px] overflow-y-auto px-6 md:px-8 py-6 text-left scrollbar-thin">
                <p 
                  className="text-xs md:text-sm text-[#fffbe6] whitespace-pre-line antialiased font-serif leading-loose tracking-wide select-none"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    textShadow: '0 0 10px rgba(255, 246, 230, 0.18)'
                  }}
                >
                  {letterText}
                </p>
              </div>

              {/* Action Button */}
              <div className="p-4 border-t border-white/5 bg-white/2 flex justify-center">
                <button
                  id="btn-letter-continue"
                  onClick={onComplete}
                  className="btn-primary"
                >
                  Continue →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
