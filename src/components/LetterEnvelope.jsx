import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen } from 'lucide-react';

export default function LetterEnvelope({ onComplete }) {
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

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[450px] relative px-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Closed Envelope Card */
          <motion.div
            key="closed-envelope"
            id="btn-open-envelope"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col items-center text-center cursor-pointer hover:border-rose-500/30 hover:shadow-rose-950/20 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="relative mb-6">
              {/* Pulsating glow behind envelope icon */}
              <div className="absolute inset-0 bg-rose-500/10 rounded-full filter blur-xl group-hover:bg-rose-500/20 transition-all duration-300" />
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:text-rose-300 transition-all duration-300 relative border border-rose-500/20">
                <Mail size={36} className="animate-float-medium" />
              </div>
            </div>
            
            <p className="text-gray-300 font-medium mb-3 text-sm md:text-base leading-relaxed">
              "There's something I couldn't properly say during a phone call..."
            </p>
            <p className="text-rose-300/80 font-playfair italic text-xs md:text-sm mb-6">
              "...so I wrote it here."
            </p>
            
            <span className="text-xs font-semibold px-4 py-2 bg-rose-500/20 text-rose-200 border border-rose-500/20 rounded-full group-hover:bg-rose-500/30 transition-all">
              Tap to open envelope ✉️
            </span>
          </motion.div>
        ) : (
          /* Open Letter Overlay / Sliding Card */
          <motion.div
            key="open-letter"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, type: 'spring', damping: 25 }}
            className="w-full flex flex-col items-center"
          >
            {/* The Envelope Background Wrapper */}
            <div className="w-full glass-card border border-white/10 rounded-3xl p-1 relative shadow-2xl overflow-hidden flex flex-col">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500" />
              
              {/* Letter Heading / Header inside envelope */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-2 text-rose-300">
                  <MailOpen size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider">A message for you</span>
                </div>
                <span className="text-[10px] text-gray-500">From Abishek</span>
              </div>

              {/* Scrollable Letter Body */}
              <div className="max-h-[380px] overflow-y-auto px-6 md:px-8 py-6 text-left scrollbar-thin">
                <div className="font-playfair text-base md:text-lg text-rose-100/90 leading-relaxed font-light whitespace-pre-line antialiased italic">
                  {letterText}
                </div>
              </div>

              {/* Action Button at bottom of card */}
              <div className="p-5 border-t border-white/5 bg-white/2 flex justify-center">
                <button
                  id="btn-letter-continue"
                  onClick={onComplete}
                  className="px-8 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm hover:scale-105 active:scale-95 transition-all duration-300 shadow-md shadow-rose-500/10 flex items-center gap-2"
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
