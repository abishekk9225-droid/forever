import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen } from 'lucide-react';

export default function Letter3D({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  const letterText = `Dear Saranya,

Our first meeting started with a phone call.

At that time, I had no idea
that one call would eventually lead me here.

I slowly started noticing
the way you care.

And honestly...
that's what touched my heart the most.

I like the way you make me feel cared for.

I like the thought that
if something happened to me,
you'd actually worry.

Maybe that's why,
without realizing it,
you became someone very important to me.

I don't know what the future has planned.

But if I get to choose...

I want someone beside me
who won't leave when things get difficult.

Someone who cares.

Someone who stays.

And somewhere inside,
I started feeling that person could be you.

I promise I can't give you
a perfect life.

But if you choose me,
I'll give you something real.

My care.
My respect.
My loyalty.
My effort.

And I'll always try
to make you feel as important
as you actually are to me.

So Saranya...

there's one thing I've been wanting
to ask you for a long time.

Are you ready?`;

  const handleOpen = () => {
    // Play chime sound
    if (window.playRomanticChime) {
      window.playRomanticChime();
    }
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[440px] relative px-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Floating 3D Envelope Card */
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.95, rotateY: -15, rotateX: 10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateY: [0, 8, -8, 0], 
              rotateX: [0, -5, 5, 0],
              y: [0, -6, 0]
            }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 45, y: -30 }}
            transition={{
              animate: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
            onClick={handleOpen}
            className="w-full bg-gradient-to-br from-[#2b1028] to-[#12041b] border border-rose-500/20 p-8 rounded-3xl backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col items-center text-center cursor-pointer hover:border-rose-500/40 hover:shadow-rose-950/20 group relative overflow-hidden"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative mb-6">
              <div className="absolute inset-0 bg-rose-500/10 rounded-full filter blur-xl group-hover:bg-rose-500/20 transition-all duration-300" />
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:text-rose-300 transition-all duration-300 relative border border-rose-500/20">
                <Mail size={36} className="animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            
            <p className="text-gray-200 font-medium mb-3 text-sm md:text-base leading-relaxed font-playfair">
              "There's something I couldn't say properly..."
            </p>
            <p className="text-rose-300/80 font-playfair italic text-xs md:text-sm mb-6">
              "Open this."
            </p>
            
            <span className="text-xs font-semibold px-4 py-2 bg-rose-500/25 text-rose-200 border border-rose-500/20 rounded-full group-hover:bg-rose-500/35 transition-all">
              Tap to open envelope ✉️
            </span>
          </motion.div>
        ) : (
          /* Opened Letter sliding out */
          <motion.div
            key="opened"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, type: 'spring', damping: 20 }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full glass-card border border-rose-500/15 rounded-3xl p-1 relative shadow-2xl overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500" />
              
              {/* Header inside envelope */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-2 text-rose-300">
                  <MailOpen size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider font-sans">A message for you</span>
                </div>
                <span className="text-[10px] text-gray-500 font-sans">From Abishek</span>
              </div>

              {/* Scrollable Letter Body */}
              <div className="max-h-[340px] overflow-y-auto px-6 md:px-8 py-6 text-left scrollbar-thin">
                <div 
                  className="text-base md:text-lg text-rose-100/90 leading-relaxed font-light whitespace-pre-line antialiased italic"
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
