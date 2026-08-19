import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { SceneProvider, useScene, SCENES } from './context/SceneProvider';

// Visual canvases and companion components
import BackgroundEffects from './components/BackgroundEffects';
import LeftDecorations from './components/LeftDecorations';
import RightDecorations from './components/RightDecorations';
import EasterEggs from './components/EasterEggs';
import ErrorBoundary from './components/ErrorBoundary';
import HeartBurst from './components/HeartBurst';
import ButterflyExplosion from './components/ButterflyExplosion';

// Journey core components
import AdminSecurityGate from './components/AdminSecurityGate';
import LiveLoveClock from './components/LiveLoveClock';
import InteractiveLoveLetter from './components/InteractiveLoveLetter';
import MiniGame from './components/MiniGame';
import AudioPlayer from './components/AudioPlayer';

import PromiseEntryGate from './components/PromiseEntryGate';

// Climax components
import PostProposalQuiz from './components/PostProposalQuiz';
import CertificateOfForever from './components/CertificateOfForever';
import SecretMessageCard from './components/SecretMessageCard';
import MemorySnapshotCard from './components/MemorySnapshotCard';
import SpringCoilFinale from './components/SpringCoilFinale';

function MainApp() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { currentScene, goToScene: setCurrentScene } = useScene();

  // 1. Password Protection Gate
  if (!isUnlocked) {
    return <AdminSecurityGate onUnlocked={() => setIsUnlocked(true)} />;
  }

  const handleProposalYes = () => {
    if (typeof window.triggerClimaxAudio === 'function') {
      window.triggerClimaxAudio(); // Jump to 219s audio peak
    }
    setCurrentScene(SCENES.QUIZ);
  };

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-[#05020a] text-white select-none flex items-center justify-center font-sans">
      <AudioPlayer />
      
      {/* Reusable Canvas Heart Burst System */}
      <ErrorBoundary>
        <HeartBurst />
      </ErrorBoundary>

      {/* Persistent living GardenCanvas */}
      <ErrorBoundary>
        <BackgroundEffects />
      </ErrorBoundary>

      {/* Left Bird & Right Mascot Companions */}
      <ErrorBoundary>
        <LeftDecorations />
      </ErrorBoundary>
      <ErrorBoundary>
        <RightDecorations />
      </ErrorBoundary>

      {/* Easter Egg Overlay */}
      <ErrorBoundary>
        <EasterEggs />
      </ErrorBoundary>

      <div className="relative z-30 w-full max-w-xl px-4 py-8 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* 1. INTRO SCENE WITH BEAUTIFUL LINES */}
          {currentScene === SCENES.INTRO && (
            <PromiseEntryGate onProceed={() => setCurrentScene(SCENES.MEMORIES)} />
          )}

          {/* 2. MEMORIES & QUALITIES SCENE */}
          {currentScene === SCENES.MEMORIES && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full text-center p-8 rounded-3xl bg-zinc-950/80 backdrop-blur-2xl border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.2)] space-y-5"
            >
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-400">
                Our Beautiful Memories
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white">
                Why You Are So Special To Me 💖
              </h2>
              <div className="space-y-3 text-left">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-rose-400/20 text-rose-100 text-sm">
                  ✨ <strong>உன்னோட குழந்தைத் தனம்:</strong> என்னை எப்பவுமே சிரிக்க வச்சு ரசிக்க வைக்கிற ஒரு தனி அழகு! 🥰
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-rose-400/20 text-rose-100 text-sm">
                  🥰 <strong>உன் அன்பும் அக்கறையும்:</strong> எனக்குக் கிடைத்த மிக அழகான வரம்.
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-rose-400/20 text-rose-100 text-sm">
                  💫 <strong>உன் அமைதி:</strong> என் வாழ்க்கையின் மிக அழகான நிம்மதி.
                </div>
              </div>
              <button
                onClick={() => setCurrentScene(SCENES.GAME)}
                className="w-full mt-4 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:scale-105 active:scale-95 text-white font-medium text-sm shadow-lg transition cursor-pointer"
              >
                Let's Play Our Mini-Game ⚡
              </button>
            </motion.div>
          )}

          {/* 3. LOVE CHARGER 100% MINI-GAME */}
          {currentScene === SCENES.GAME && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <MiniGame onComplete={() => setCurrentScene(SCENES.LETTER)} />
            </motion.div>
          )}

          {/* 4. LIVE LOVE CLOCK & LOVE LETTER SCENE */}
          {currentScene === SCENES.LETTER && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-6 flex flex-col items-center"
            >
              <LiveLoveClock />
              <InteractiveLoveLetter />
              <button
                onClick={() => setCurrentScene(SCENES.CONFESSION)}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:scale-105 active:scale-95 text-white font-medium text-sm shadow-[0_0_25px_rgba(244,114,182,0.4)] transition cursor-pointer"
              >
                Read Abishek's Final Question 💖
              </button>
            </motion.div>
          )}

          {/* 5. CONFESSION ("WILL YOU BE MINE FOREVER?") */}
          {currentScene === SCENES.CONFESSION && (
            <motion.div
              key="confession"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full text-center p-8 sm:p-10 rounded-3xl bg-zinc-950/85 backdrop-blur-2xl border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)]"
            >
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto mb-4 animate-bounce"/>
              <h2 className="text-3xl sm:text-4xl font-serif text-white mb-3">
                Saranya, Will You Be Mine Forever? 💍
              </h2>
              <p className="text-rose-200/80 text-sm sm:text-base font-serif italic mb-8">
                "என் ஆயுள் முழுக்க உன் கரம் பிடித்து வாழ ஆசை... எனக்காக சம்மதமா? ❤️"
              </p>

              <div className="flex items-center justify-center gap-6 relative min-h-[90px] w-full">
                <button
                  onClick={handleProposalYes}
                  className="py-4 px-10 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:scale-110 active:scale-95 text-white font-bold text-lg tracking-wider shadow-[0_0_40px_rgba(244,114,182,0.6)] animate-pulse transition cursor-pointer z-10"
                >
                  YES, Forever! 💖
                </button>
                <RunawayNoButton />
              </div>
            </motion.div>
          )}

          {/* 6. POST-PROPOSAL 3 QUESTIONS */}
          {currentScene === SCENES.QUIZ && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <PostProposalQuiz onComplete={() => setCurrentScene(SCENES.CERTIFICATE)} />
            </motion.div>
          )}

          {/* 7. CERTIFICATE OF FOREVER */}
          {currentScene === SCENES.CERTIFICATE && (
            <motion.div
              key="certificate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center"
            >
              <ButterflyExplosion />
              <CertificateOfForever />
              <button
                onClick={() => setCurrentScene(SCENES.FINALE)}
                className="mt-4 mb-6 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-purple-500 via-rose-500 to-pink-500 hover:scale-105 active:scale-95 text-white font-medium text-sm shadow-lg transition cursor-pointer"
              >
                Leave a Note & Final Surprise 💌
              </button>
            </motion.div>
          )}

          {/* 8. FINALE SCENE */}
          {currentScene === SCENES.FINALE && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-6 flex flex-col items-center"
            >
              <SecretMessageCard />
              <MemorySnapshotCard />
              <SpringCoilFinale />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function RunawayNoButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dodge = () => {
    setPos({
      x: (Math.random() - 0.5) * 240,
      y: (Math.random() - 0.5) * 160,
    });
  };
  return (
    <button
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onMouseEnter={dodge}
      onTouchStart={dodge}
      onClick={dodge}
      className="py-3 px-6 rounded-2xl bg-zinc-900/80 border border-white/20 text-white/50 text-sm transition-transform duration-200 select-none cursor-pointer"
    >
      No 😢
    </button>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SceneProvider>
        <MainApp />
      </SceneProvider>
    </ErrorBoundary>
  );
}
