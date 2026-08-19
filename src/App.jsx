import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
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

// Qualities component for Memories
import Qualities from './components/Qualities';

// Climax components
import PostProposalQuiz from './components/PostProposalQuiz';
import CertificateOfForever from './components/CertificateOfForever';
import SecretMessageCard from './components/SecretMessageCard';
import MemorySnapshotCard from './components/MemorySnapshotCard';
import SpringCoilFinale from './components/SpringCoilFinale';

function MainApp() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { currentScene, goToScene: setCurrentScene } = useScene();

  // 1. Initial Passcode Check
  if (!isUnlocked) {
    return <AdminSecurityGate onUnlocked={() => setIsUnlocked(true)} />;
  }

  // 2. Climax Audio Trigger on YES
  const handleProposalYes = () => {
    if (typeof window.triggerClimaxAudio === 'function') {
      window.triggerClimaxAudio(); // Jumps directly to 219s
    }
    setCurrentScene(SCENES.QUIZ);
  };

  return (
    <div className="relative min-h-screen bg-[#05020a] text-white overflow-hidden selection:bg-rose-500/20 selection:text-white select-none">
      {/* Reusable Canvas Heart Burst System */}
      <ErrorBoundary>
        <HeartBurst />
      </ErrorBoundary>

      {/* Persistent living GardenCanvas */}
      <ErrorBoundary>
        <BackgroundEffects />
      </ErrorBoundary>

      {/* Global Mute Toggle and Header */}
      <header className="fixed top-0 inset-x-0 z-50 p-4 md:p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1">
          <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-rose-300 font-sans">
            For Saranya ❤️
          </span>
        </div>
        <div className="pointer-events-auto">
          <AudioPlayer />
        </div>
      </header>

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

      {/* MAIN VIEWPORT */}
      <main className="relative z-30 w-full min-h-screen flex items-center justify-center py-12 px-4">
        <AnimatePresence mode="wait">
          {/* SCENE 1: MEMORIES / QUALITIES */}
          {currentScene === SCENES.MEMORIES && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg px-4 flex flex-col items-center"
            >
              <Qualities onComplete={() => setCurrentScene(SCENES.GAME)} />
            </motion.div>
          )}

          {/* SCENE 2: LOVE CHARGER 100% MINI-GAME */}
          {currentScene === SCENES.GAME && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md px-4 flex flex-col items-center"
            >
              <MiniGame onComplete={() => setCurrentScene(SCENES.LETTER)} />
            </motion.div>
          )}

          {/* SCENE 3: LIVE LOVE CLOCK & LOVE LETTER */}
          {currentScene === SCENES.LETTER && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg px-4 flex flex-col items-center space-y-4"
            >
              <LiveLoveClock />
              <InteractiveLoveLetter />
              <button
                onClick={() => setCurrentScene(SCENES.CONFESSION)}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                Read Abishek's Final Question 💖
              </button>
            </motion.div>
          )}

          {/* SCENE 4: CONFESSION ("I LOVE YOU" + RUNAWAY NO BUTTON) */}
          {currentScene === SCENES.CONFESSION && (
            <motion.div
              key="confession"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg px-4 text-center flex flex-col items-center"
            >
              <h2 className="text-3xl sm:text-4xl font-serif text-white mb-3 drop-shadow-[0_0_20px_rgba(244,114,182,0.4)]">
                Saranya, Will You Be Mine Forever? 💍
              </h2>
              <p className="text-rose-200/80 text-sm mb-8 font-light italic">
                "Every beat of my heart belongs to you, today and for all tomorrows."
              </p>

              <div className="flex items-center justify-center gap-6 relative min-h-[90px] w-full">
                <button
                  onClick={handleProposalYes}
                  className="py-4 px-10 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-semibold text-lg tracking-wider shadow-[0_0_35px_rgba(244,114,182,0.6)] animate-pulse hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  YES, Forever! 💖
                </button>

                {/* Runaway No Button */}
                <RunawayNoButton />
              </div>
            </motion.div>
          )}

          {/* SCENE 5: POST-PROPOSAL 3 QUESTIONS */}
          {currentScene === SCENES.QUIZ && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl px-4 flex flex-col items-center"
            >
              <PostProposalQuiz onComplete={() => setCurrentScene(SCENES.CERTIFICATE)} />
            </motion.div>
          )}

          {/* SCENE 6: LUXURY CERTIFICATE OF FOREVER */}
          {currentScene === SCENES.CERTIFICATE && (
            <motion.div
              key="certificate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl px-4 flex flex-col items-center max-h-screen overflow-y-auto py-6 scrollbar-thin"
            >
              {/* Confetti & Butterflies Explosion overlay */}
              <ButterflyExplosion />
              <CertificateOfForever />
              <button
                onClick={() => setCurrentScene(SCENES.FINALE)}
                className="mt-4 mb-6 py-3 px-8 rounded-2xl bg-gradient-to-r from-purple-500 to-rose-500 text-white font-medium shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                Leave a Note for Abishek 💌
              </button>
            </motion.div>
          )}

          {/* SCENE 7: SECRET MESSAGE & SPRING COIL FINALE */}
          {currentScene === SCENES.FINALE && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md px-4 flex flex-col items-center max-h-screen overflow-y-auto py-6 scrollbar-thin"
            >
              <SecretMessageCard />
              <MemorySnapshotCard />
              <SpringCoilFinale />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
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
