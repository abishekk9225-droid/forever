import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { SceneProvider } from './context/SceneProvider';

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
import ProposalButtons from './components/ProposalButtons';
import AudioPlayer from './components/AudioPlayer';

// Climax components
import PostProposalQuiz from './components/PostProposalQuiz';
import CertificateOfForever from './components/CertificateOfForever';
import SecretMessageCard from './components/SecretMessageCard';
import MemorySnapshotCard from './components/MemorySnapshotCard';
import SpringCoilFinale from './components/SpringCoilFinale';

function MainApp() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accepted, setAccepted] = useState(false);

  if (!isUnlocked) {
    return <AdminSecurityGate onUnlocked={() => setIsUnlocked(true)} />;
  }

  const handleAcceptProposal = () => {
    if (typeof window.triggerClimaxAudio === 'function') {
      window.triggerClimaxAudio(); // Jumps to the 219s vocal peak
    }
    setAccepted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#05020a] text-white overflow-x-hidden selection:bg-rose-500/20 selection:text-white select-none">
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
      <main className="flex-grow flex items-center justify-center py-12 relative z-30 px-4">
        {!accepted ? (
          <div className="py-12 px-4 flex flex-col items-center space-y-12 max-w-4xl mx-auto w-full relative z-10">
            {/* 1. Live Relationship Timer */}
            <LiveLoveClock />

            {/* 2. Interactive Love Letter */}
            <InteractiveLoveLetter />

            {/* 3. Love Charger 100% Mini-Game */}
            <MiniGame onComplete={() => {}} />

            {/* 4. Proposal Climax Actions */}
            <ProposalButtons onAccept={handleAcceptProposal} />
          </div>
        ) : (
          <div className="fixed inset-0 overflow-y-auto z-40 bg-[#05020a]/85 backdrop-blur-3xl px-4 py-12 flex flex-col items-center space-y-10 scrollbar-thin pointer-events-auto">
            {/* Confetti & Butterflies Explosion */}
            <ButterflyExplosion />
            
            {/* Climax Cards */}
            <PostProposalQuiz />
            <CertificateOfForever />
            <SecretMessageCard />
            <MemorySnapshotCard />
            <SpringCoilFinale />
          </div>
        )}
      </main>
    </div>
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
