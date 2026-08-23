import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeartbeatIntro({ onUnlock }) {
  const [loadingText, setLoadingText] = useState("Synchronizing heartbeats...");

  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingText("Measuring our moments..."), 1200);
    const timer2 = setTimeout(() => setLoadingText("Ready to feel my heartbeat? 💓"), 2400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleTap = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ffd700', '#ffffff', '#ff69b4']
    });
    onUnlock();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black/95 text-center select-none overflow-hidden z-30">
      
      {/* Background Floating Butterflies & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Floating Butterfly / Star Sparkles */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 15, -10], rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-16 left-12 text-rose-400/40 text-2xl"
        >
          🦋✨
        </motion.div>
        <motion.div
          animate={{ y: [20, -25, 20], x: [15, -20, 15], rotate: [0, -20, 20, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute bottom-20 right-16 text-amber-300/40 text-2xl"
        >
          🦋🧸
        </motion.div>
      </div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-zinc-950/90 border border-rose-500/30 shadow-[0_0_70px_rgba(244,63,94,0.25)] backdrop-blur-xl relative z-10 space-y-8"
      >
        
        {/* Pulsing Heart & ECG Icon Badge */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl"
          />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-[0_0_35px_rgba(244,63,94,0.6)] relative z-10">
            <Heart className="w-8 h-8 fill-white"/>
          </div>
        </div>

        {/* Title & ECG Graph Simulation */}
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Our Heartbeat Connection 💓
          </h1>
          
          {/* ECG Waveform Animation */}
          <div className="flex items-center justify-center gap-1 py-3 text-rose-400">
            <Activity className="w-6 h-6 animate-pulse"/>
            <div className="h-0.5 w-32 sm:w-44 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse"/>
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin"/>
          </div>

          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs sm:text-sm font-mono text-rose-200/80 italic tracking-wider"
          >
            {loadingText}
          </motion.p>
        </div>

        {/* TAP BUTTON */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={handleTap}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-zinc-950 font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(244,63,94,0.5)] flex items-center justify-center gap-3 cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-zinc-950"/>
            <span>Tap to Feel My Heartbeat 💓✨</span>
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
