import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, ArrowRight } from 'lucide-react';

export default function CelebrationReveal({ onComplete }) {
  const [arrowHit, setArrowHit] = useState(false);

  useEffect(() => {
    // 1. Arrow hits heart after 1.2s
    const hitTimer = setTimeout(() => {
      setArrowHit(true);

      // 2. Trigger explosive multi-color confetti + heart blast
      const duration = 3.5 * 1000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 50,
          spread: 360,
          startVelocity: 35,
          origin: { x: 0.5, y: 0.45 },
          colors: ['#ff1493', '#ff69b4', '#ffd700', '#ff0055', '#a855f7'],
          shapes: ['circle', 'square']
        });
      }, 300);
    }, 1200);

    return () => clearTimeout(hitTimer);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black/95 px-4 z-30">
      
      {/* Background Floating Hearts & Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`float-${i}`}
            className="absolute text-rose-500/40"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 100}%`,
              fontSize: `${12 + (i % 4) * 8}px`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      {/* RIGHT SIDE ROMANTIC TREE WITH FALLING HEARTS */}
      <div className="absolute right-0 bottom-0 pointer-events-none w-48 sm:w-72 h-80 sm:h-96 z-10 flex flex-col items-center justify-end opacity-85">
        {/* Tree Canopy */}
        <div className="relative w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-gradient-to-t from-pink-600/40 via-rose-500/30 to-purple-600/20 blur-xl absolute top-0" />
        <span className="text-7xl sm:text-9xl filter drop-shadow-[0_0_25px_rgba(244,114,182,0.8)] select-none">
          🌸🌳
        </span>

        {/* Leaves / Hearts Falling From Tree */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`falling-heart-${i}`}
            className="absolute text-rose-400 text-sm sm:text-base select-none"
            initial={{ x: 20 + (i * 10) % 80, y: 10, opacity: 0 }}
            animate={{
              y: [10, 240 + (i % 4) * 20],
              x: [20 + (i * 10) % 80, ((i * 10) % 80) - 40, 20 + (i * 10) % 80],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "linear",
            }}
          >
            💖
          </motion.div>
        ))}
      </div>

      {/* MAIN CELEBRATION CONTAINER */}
      <div className="relative z-20 flex flex-col items-center justify-center max-w-xl text-center">

        {/* CUPID'S FLYING ARROW (Shoots in from top-left) */}
        {!arrowHit && (
          <motion.div
            initial={{ x: -350, y: -250, opacity: 0, rotate: 35 }}
            animate={{ x: 0, y: 0, opacity: 1, rotate: 35 }}
            transition={{ duration: 1.2, ease: "easeIn" }}
            className="absolute top-12 left-12 sm:top-16 sm:left-24 text-4xl sm:text-5xl text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,1)] z-40 pointer-events-none"
          >
            💘 ➔
          </motion.div>
        )}

        {/* CENTER POWERFUL GLOWING HEART */}
        <motion.div
          animate={
            arrowHit
              ? {
                  scale: [1, 1.35, 0.95, 1.15, 1],
                  rotate: [0, -12, 12, -8, 8, 0],
                }
              : {
                  scale: [1, 1.08, 1],
                }
          }
          transition={
            arrowHit
              ? { duration: 0.6, times: [0, 0.2, 0.4, 0.7, 1] }
              : { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
          }
          className="relative mb-6 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Heart
              className={`w-28 h-28 sm:h-36 sm:w-36 text-rose-400 fill-rose-500 transition-all duration-300 drop-shadow-[0_0_60px_rgba(244,63,94,0.9)] ${
                arrowHit ? 'brightness-125' : ''
              }`}
            />
            {arrowHit && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute text-3xl sm:text-4xl"
              >
                ✨🏹✨
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* DANCING TOY / MASCOT + BUTTERFLIES */}
        {arrowHit && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            {/* Dancing Toy Mascot */}
            <motion.div
              animate={{
                y: [0, -18, 0],
                rotate: [-15, 15, -15],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                ease: "easeInOut",
              }}
              className="text-5xl sm:text-6xl select-none filter drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
            >
              🧸💃
            </motion.div>

            {/* Flying Butterflies */}
            <motion.div
              animate={{
                x: [-10, 10, -10],
                y: [-5, 5, -5],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-3xl sm:text-4xl select-none"
            >
              🦋✨🦋
            </motion.div>
          </motion.div>
        )}

        {/* SHE SAID YES TYPOGRAPHY */}
        <AnimatePresence>
          {arrowHit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-500 drop-shadow-[0_0_35px_rgba(244,63,94,0.8)]">
                SHE SAID YES! 💍💖
              </h1>
              <p className="text-rose-200 text-sm sm:text-lg font-serif italic max-w-md mx-auto">
                "Two hearts connected forever under our magical love tree... 🥰✨"
              </p>

              {/* ACTION BUTTON TO PROCEED */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onComplete}
                className="mt-6 px-8 py-4 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 text-white font-medium text-sm sm:text-base tracking-wider shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <span>Proceed to Fingerprint Lock</span>
                <ArrowRight className="w-5 h-5"/>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
