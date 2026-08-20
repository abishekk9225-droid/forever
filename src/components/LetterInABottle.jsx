import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Sparkles, ArrowRight, Waves } from 'lucide-react';

export default function LetterInABottle({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-lg mx-auto px-4 min-h-[500px] flex flex-col items-center justify-center z-30 text-center animate-fade-in">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="bottle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* Floating Bottle with Wave Animation */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-cyan-500/25 via-blue-500/20 to-teal-400/30 border border-cyan-400/40 backdrop-blur-xl shadow-[0_0_50px_rgba(34,211,238,0.3)] flex items-center justify-center group-hover:scale-105 transition-transform my-6"
            >
              <Wine className="w-16 h-16 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"/>
            </motion.div>

            <h3 className="text-2xl font-serif text-white mb-2">
              A Bottle Drifting On Ocean Waves... 🌊✨
            </h3>
            <p className="text-cyan-200/80 text-xs sm:text-sm font-serif italic mb-6">
              "Tap the bottle to open a secret message written just for you, Saranya..."
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest animate-bounce">
              <Waves className="w-4 h-4"/>
              <span>Click to Open Bottle</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="scroll"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-amber-950/40 border-2 border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.3)] text-center relative overflow-hidden"
          >
            {/* Vintage Paper Texture Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-100/10 to-amber-900/20 pointer-events-none" />

            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-7 h-7 animate-spin" style={{ animationDuration: '8s' }}/>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-amber-200 mb-4">
              From My Heart to Yours 📜✨
            </h3>

            <div className="p-6 rounded-2xl bg-black/40 border border-amber-500/30 text-amber-100/90 text-sm sm:text-base font-serif italic leading-relaxed space-y-3 mb-8 shadow-inner">
              <p>"Saranya... kadal alai adikkira indha azhagu anaichu ninnu kooda un mela na vechurukka anbu adangathu.</p>
              <p>Endha janmam vandhalum unakku koodavae oru nizhal ah iruppen... This is my promise to you, forever! 🤍💍"</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Proceed to Our Final Certificate ✨</span>
              <ArrowRight className="w-4 h-4"/>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
