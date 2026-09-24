import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { useScene, SCENES } from '../context/SceneProvider';

/**
 * CelebrationReveal handles both:
 * 1. The interactive envelope reveal and floating neon hearts celebration component
 *    (seamlessly displayed when 'Feelings' is clicked or configured)
 * 2. The preserved grand proposal celebration flow (SHE SAID YES! 💍💖)
 */
export default function CelebrationReveal({
  onComplete,
  isFeelings = false,
  title = "A Special Message For You ✨",
  message = "உன் கண்களில் நான் கண்ட உண்மையும், என் மீது உனக்கிருக்கும் அந்தச் சிறிய நிஜமான feelings-ம் தான் எனக்குப் போதும்... இனி எல்லாமே அழகுதான்!",
  tag = "Unlocked With Feelings",
  buttonText = "Continue Journey ❤️"
}) {
  let currentScene = null;
  try {
    const sceneContext = useScene();
    currentScene = sceneContext?.currentScene;
  } catch (e) {
    // Rendered outside SceneProvider fallback
  }

  // Preserve all existing proposal celebration flows when in SCENES.CELEBRATION and not specifically the feelings flow
  const isProposalCelebration = currentScene === SCENES.CELEBRATION && !isFeelings;

  if (isProposalCelebration) {
    return <ProposalCelebrationContent onComplete={onComplete} />;
  }

  return (
    <FeelingsEnvelopeContent
      onComplete={onComplete}
      title={title}
      message={message}
      tag={tag}
      buttonText={buttonText}
    />
  );
}

/**
 * Interactive Envelope Reveal & Floating Neon Hearts Celebration Component
 */
function FeelingsEnvelopeContent({ onComplete, title, message, tag, buttonText }) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  // Floating neon hearts positions & timings with stable memoized distribution
  const floatingHearts = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      left: `${(i * 17 + 5) % 94 + 3}%`,
      top: `${(i * 23 + 9) % 90 + 5}%`,
      fontSize: `${((i * 7) % 8) * 0.1 + 0.9}rem`,
      animationDuration: `${((i * 3) % 4) + 2.5}s`,
      animationDelay: `${((i * 5) % 5) * 0.5}s`,
    }));
  }, []);

  const handleOpenEnvelope = () => {
    if (!envelopeOpen) {
      setEnvelopeOpen(true);

      // Trigger celebratory confetti burst when envelope opens
      confetti({
        particleCount: 70,
        spread: 120,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#ff1493', '#ff69b4', '#ffd700', '#ff0055', '#a855f7'],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none">
      
      {/* Background Floating Neon Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingHearts.map((heart, i) => (
          <div
            key={i}
            className="absolute text-pink-500/40 animate-pulse"
            style={{
              left: heart.left,
              top: heart.top,
              fontSize: heart.fontSize,
              animationDuration: heart.animationDuration,
              animationDelay: heart.animationDelay,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Cyber Neon Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

      {/* Glassmorphic Envelope Container */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_50px_rgba(244,63,94,0.3)] relative z-10 space-y-6">
        
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-bounce">
            <Mail className="w-8 h-8 text-pink-300" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white tracking-wide">
          {title}
        </h2>

        {/* Interactive Envelope Box */}
        <div 
          onClick={handleOpenEnvelope}
          className={`cursor-pointer transition-all duration-500 p-6 rounded-2xl border ${
            envelopeOpen 
              ? 'bg-pink-950/40 border-pink-500/60 shadow-[0_0_30px_rgba(244,63,94,0.4)]' 
              : 'bg-slate-950/60 border-slate-800 hover:border-pink-500/40'
          }`}
        >
          {!envelopeOpen ? (
            <div className="py-4 space-y-2">
              <p className="text-pink-300/90 text-sm font-medium">Tap to open your letter 💌</p>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in text-left">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> {tag}
              </div>
              <p className="text-slate-200 text-sm md:text-base leading-relaxed italic">
                "{message}"
              </p>
            </div>
          )}
        </div>

        {/* Continue to Next Scenes Button */}
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all duration-300 cursor-pointer"
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
}

/**
 * Preserved Grand Proposal Celebration Flow (SHE SAID YES!)
 */
function ProposalCelebrationContent({ onComplete }) {
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
