import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, X } from 'lucide-react';

export default function InteractiveLoveLetter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto my-8 px-4 z-30 flex flex-col items-center">
      {!isOpen ? (
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="w-full p-8 rounded-3xl backdrop-blur-2xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_40px_rgba(244,114,182,0.25)] text-center cursor-pointer relative group overflow-hidden"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-rose-700 via-rose-500 to-amber-500 p-0.5 shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-zinc-950 flex flex-col items-center justify-center">
              <Mail className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform"/>
            </div>
          </div>
          
          <h3 className="text-xl font-serif text-white mb-1">A Letter Sealed With Love</h3>
          <p className="text-xs text-rose-300/70">Tap the wax seal to unfold my heart 💌</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#180a1d] to-[#0a030d] border border-rose-400/40 shadow-[0_0_50px_rgba(244,114,182,0.3)] relative font-serif"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4"/>
            </button>

            <div className="flex items-center gap-2 mb-4 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-400 animate-pulse"/>
              <span className="text-xs font-mono tracking-widest uppercase">My Dearest Saranya</span>
            </div>

            <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed italic">
              "From the moment you entered my world, every ordinary day turned into an extraordinary memory. Your laughter is my favorite melody, and your presence brings peace to my restless soul. I don’t just love you for who you are; I love who I become whenever I am with you."
            </p>

            <div className="mt-6 pt-4 border-t border-rose-500/20 text-right">
              <span className="text-xs font-mono text-rose-300">Forever Yours,</span>
              <p className="text-lg font-serif font-bold text-white tracking-wide">Abishek</p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
