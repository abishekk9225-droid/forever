import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function GardenTransition({ onComplete }) {
  const [step, setStep] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const timersRef = useRef([]);
  const completedRef = useRef(false);

  const safeComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      try { onComplete(); } catch (e) { console.error('[GardenTransition] onComplete error:', e); }
    }
  };

  useEffect(() => {
    // Fallback: if still here after 12s, show a manual continue button
    const fallbackTimer = setTimeout(() => setShowFallback(true), 12000);
    timersRef.current.push(fallbackTimer);

    // Step progression
    const t1 = setTimeout(() => setStep(1), 2200);
    const t2 = setTimeout(() => setStep(2), 4800);
    const t3 = setTimeout(() => {
      // Auto-navigate after final step
      safeComplete();
    }, 7200);

    timersRef.current.push(t1, t2, t3);

    // Chime on step 1
    const chime1 = setTimeout(() => {
      try { if (window.playRomanticChime) window.playRomanticChime(); } catch (e) {}
    }, 2400);
    const chime2 = setTimeout(() => {
      try { if (window.playRomanticChime) window.playRomanticChime(); } catch (e) {}
    }, 5200);
    timersRef.current.push(chime1, chime2);

    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 8, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, filter: 'blur(3px)', transition: { duration: 0.5 } }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030007] overflow-hidden flex items-center justify-center select-none">

      {/* Deep night gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08020f] via-[#120422] to-[#040109]" />

      {/* Stars — fade in from step 1 */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(28)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 65}%`,
                  opacity: Math.random() * 0.6 + 0.2,
                  animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moon glow */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            key="moon"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.28, scale: 1 }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
            className="absolute top-8 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full bg-white pointer-events-none"
            style={{ filter: 'blur(45px)' }}
          />
        )}
      </AnimatePresence>

      {/* Fireflies — step 1+ */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            key="fireflies"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${30 + Math.random() * 60}%`,
                  boxShadow: '0 0 6px 2px rgba(253, 224, 71, 0.5)',
                }}
                animate={{
                  x: [0, Math.random() * 40 - 20, 0],
                  y: [0, Math.random() * 30 - 15, 0],
                  opacity: [0, 0.7, 0.2, 0.8, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blooming flowers bottom-left */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            key="flower-left"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 w-28 h-28 pointer-events-none text-rose-500"
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="14" />
              <circle cx="50" cy="24" r="13" /><circle cx="50" cy="76" r="13" />
              <circle cx="24" cy="50" r="13" /><circle cx="76" cy="50" r="13" />
              <circle cx="50" cy="50" r="6" fill="#ffd43f" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blooming flowers bottom-right */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            key="flower-right"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 0.85, opacity: 0.25 }}
            transition={{ duration: 2.5, ease: 'easeOut', delay: 0.6 }}
            className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none text-purple-400"
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="14" />
              <circle cx="50" cy="24" r="13" /><circle cx="50" cy="76" r="13" />
              <circle cx="24" cy="50" r="13" /><circle cx="76" cy="50" r="13" />
              <circle cx="50" cy="50" r="6" fill="#ffd43f" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warm glow behind final text */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            key="warm-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(214,69,119,0.35) 0%, transparent 65%)' }}
          />
        )}
      </AnimatePresence>

      {/* Central Text */}
      <div className="relative z-50 text-center max-w-sm px-6 space-y-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" variants={textVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <p className="text-2xl md:text-3xl font-playfair text-white font-semibold">
                Okay... one last little thing. ✨
              </p>
              <p className="text-sm text-gray-400 font-sans tracking-wide">
                Just stay here for a moment...
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" variants={textVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <p className="text-2xl md:text-3xl font-playfair text-white font-semibold">
                Look around. 🌙
              </p>
              <p className="text-xs text-gray-500 font-sans italic">
                Something beautiful is waking up...
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={textVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
              <p className="text-xl md:text-2xl font-playfair text-rose-200 font-medium italic leading-relaxed">
                "Beautiful things don't always need an explanation. ✨"
              </p>
              <p className="text-sm text-gray-400 font-sans">
                Sometimes... you just have to feel them.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fallback button — only shows if timers fail after 12s */}
        {showFallback && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={safeComplete}
            className="mt-6 px-8 py-3 rounded-full border border-rose-500/40 text-rose-300 text-xs font-semibold hover:bg-rose-500/10 transition-all active:scale-95"
          >
            Continue → 
          </motion.button>
        )}
      </div>
    </div>
  );
}
