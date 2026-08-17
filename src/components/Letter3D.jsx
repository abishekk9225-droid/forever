import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen } from 'lucide-react';

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
            {/* Inner atmospheric lines */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative mb-6">
              <div className="absolute inset-0 bg-rose-500/10 rounded-full filter blur-xl group-hover:bg-rose-500/20 transition-all duration-300" />
              <div className="w-18 h-18 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:text-rose-300 transition-all duration-300 relative border border-rose-500/20">
                <Mail size={32} className="animate-bounce" style={{ animationDuration: '3.5s' }} />
              </div>
            </div>
            
            <p className="text-gray-300 font-medium mb-2.5 text-sm md:text-base leading-relaxed font-playfair">
              "There's something I wanted to show you..."
            </p>
            <p className="text-rose-300/80 font-playfair italic text-xs md:text-sm mb-6">
              "Tap to open."
            </p>
            
            <span className="text-xs font-semibold px-4 py-2 bg-rose-500/15 text-rose-200 border border-rose-500/20 rounded-full group-hover:bg-rose-500/25 transition-all">
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
            <div className="w-full glass-panel border border-rose-500/15 rounded-3xl p-1 relative shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500" />
              
              {/* Envelope inside header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-2 text-rose-300">
                  <MailOpen size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider font-sans">A message for you</span>
                </div>
                <span className="text-[10px] text-gray-500 font-sans font-medium">From Abishek</span>
              </div>

              {/* Scrollable Letter Body */}
              <div className="max-h-[310px] overflow-y-auto px-6 md:px-8 py-5 text-left scrollbar-thin">
                <div 
                  className="text-sm md:text-base text-rose-100/90 leading-relaxed font-light whitespace-pre-line antialiased italic"
                  style={{
                    fontFamily: "'Mukta Malar', 'Latha', 'Tamil', 'Georgia', serif",
                    textShadow: '0 0 8px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {letterText}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 border-t border-white/5 bg-white/2 flex justify-center">
                <button
                  id="btn-letter-continue"
                  onClick={onComplete}
                  className="px-8 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-xs hover:scale-105 active:scale-95 transition-all duration-300 shadow-md shadow-rose-500/10 flex items-center gap-2"
                >
                  Continue ❤️
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
