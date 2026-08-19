import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, RefreshCw, Send } from 'lucide-react';
import { SceneProvider, useScene, SCENES } from './context/SceneProvider';
import BackgroundEffects from './components/BackgroundEffects';
import AudioPlayer from './components/AudioPlayer';
import LeftDecorations from './components/LeftDecorations';
import RightDecorations from './components/RightDecorations';
import PhoneCallScene from './components/PhoneCallScene';
import FeelingCards from './components/FeelingCards';
import Qualities from './components/Qualities';
import MiniGame from './components/MiniGame';
import SecretMessageCard from './components/SecretMessageCard';
import MemorySnapshotCard from './components/MemorySnapshotCard';
import Letter3D from './components/Letter3D';
import CelebrationCanvas from './components/CelebrationCanvas';
import EasterEggs from './components/EasterEggs';
import ErrorBoundary from './components/ErrorBoundary';
import HeartBurst from './components/HeartBurst';
import TextHeart3D from './components/TextHeart3D';
import SpringCoilFinale from './components/SpringCoilFinale';
import ButterflyExplosion from './components/ButterflyExplosion';
import AdminSecurityGate from './components/AdminSecurityGate';
import PostProposalQuiz from './components/PostProposalQuiz';

function DairyMilkBar() {
  return (
    <svg viewBox="0 0 80 140" className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
      <defs>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a1275" />
          <stop offset="50%" stopColor="#2c0054" />
          <stop offset="100%" stopColor="#1a0036" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe259" />
          <stop offset="100%" stopColor="#ffa751" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="76" height="136" rx="6" fill="url(#purpleGrad)" stroke="#ffd700" strokeWidth="1.5" />
      <path d="M2,2 L10,8 L18,2 L26,8 L34,2 L42,8 L50,2 L58,8 L66,2 L74,8 L78,2" fill="none" stroke="#ffd700" strokeWidth="1" />
      <path d="M2,138 L10,132 L18,138 L26,132 L34,138 L42,132 L50,138 L58,132 L66,138 L74,132 L78,138" fill="none" stroke="#ffd700" strokeWidth="1" />
      
      <text x="40" y="32" fill="#ffffff" fontSize="9" fontFamily="'Georgia', serif" fontStyle="italic" textAnchor="middle" fontWeight="bold">
        Cadbury
      </text>
      
      <text x="40" y="52" fill="url(#goldGrad)" fontSize="9" fontFamily="'Impact', 'Arial Black', sans-serif" letterSpacing="0.5" textAnchor="middle" fontWeight="black">
        Dairy Milk
      </text>
      
      <g transform="translate(28, 62) scale(0.65)" stroke="#ffffff" fill="none" strokeWidth="1.5">
        <path d="M5,5 L8,25 Q12,28 16,25 L19,5 Z" fill="#ffffff" opacity="0.8" />
        <path d="M12,2 C15,0 20,4 23,8" />
        <path d="M25,5 L28,25 Q32,28 36,25 L39,5 Z" fill="#ffffff" opacity="0.8" />
      </g>

      <g transform="translate(12, 85)" fill="#542c16" stroke="#33180b" strokeWidth="1">
        <rect x="0" y="0" width="25" height="18" rx="2" fill="#3a1b0d" />
        <rect x="31" y="0" width="25" height="18" rx="2" fill="#3a1b0d" />
        <rect x="0" y="24" width="25" height="18" rx="2" fill="#3a1b0d" />
        <rect x="31" y="24" width="25" height="18" rx="2" fill="#3a1b0d" />
        <path d="M2,2 L10,2" stroke="#6b3a1a" strokeWidth="1" />
        <path d="M33,2 L41,2" stroke="#6b3a1a" strokeWidth="1" />
      </g>
    </svg>
  );
}

function IndividualChocolate() {
  return (
    <svg viewBox="0 0 50 40" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
      <defs>
        <linearGradient id="wrapperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#63148a" />
          <stop offset="100%" stopColor="#2c004a" />
        </linearGradient>
      </defs>
      <path d="M5,20 C10,12 12,12 18,17 C15,20 15,20 18,23 C12,28 10,28 5,20 Z" fill="url(#wrapperGrad)" stroke="#ffd700" strokeWidth="0.75" />
      <path d="M45,20 C40,12 38,12 32,17 C35,20 35,20 32,23 C38,28 40,28 45,20 Z" fill="url(#wrapperGrad)" stroke="#ffd700" strokeWidth="0.75" />
      <ellipse cx="25" cy="20" rx="11" ry="8" fill="url(#wrapperGrad)" stroke="#ffd700" strokeWidth="1" />
      <rect x="17" y="15" width="2" height="10" fill="#ffd700" rx="0.5" />
      <rect x="31" y="15" width="2" height="10" fill="#ffd700" rx="0.5" />
    </svg>
  );
}

function MainApp() {
  const { currentScene, goToScene, storyIntensity, isMobile, isLowEnd } = useScene();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);

  // Disclaimer / Gate states
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [notReadyPos, setNotReadyPos] = useState({ x: 0, y: 0 });
  const [notReadyCount, setNotReadyCount] = useState(0);

  const handleEnterGarden = () => {
    setDisclaimerAccepted(true);
    if (window.playRomanticChime) window.playRomanticChime();
    if (window.unlockAudio) window.unlockAudio();
  };

  const handleNotReady = () => {
    setNotReadyCount((prev) => prev + 1);
    const maxRangeX = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.25, 100) : 80;
    const maxRangeY = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.15, 60) : 50;
    const randomX = (Math.random() - 0.5) * maxRangeX * 2;
    const randomY = (Math.random() - 0.5) * maxRangeY * 2;
    setNotReadyPos({ x: randomX, y: randomY });
  };

  const getNotReadyText = () => {
    const texts = [
      "NOT READY 🙈",
      "Are you sure? 🥺",
      "Think again! 🧐",
      "No exit! 🚪",
      "Okay, I'm ready! ❤️"
    ];
    return texts[Math.min(notReadyCount, texts.length - 1)];
  };

  // Awaken sequence states (Scene 1)
  const [awakenStep, setAwakenStep] = useState(0); // 0: initial, 1: quiets, 2: stars, 3: flowers, 4: fireflies, 5: water, 6: animals, 7: text
  const [isAwakening, setIsAwakening] = useState(false);

  // Qualities sequence states (Scene 7 emotional build)
  const [buildStep, setBuildStep] = useState(0);

  // Confession states (Scene 10)
  const [confessionStep, setConfessionStep] = useState(0); // 0: black screen / heartbeat, 1: Saranya, 2: I LOVE YOU, 3: Will you be mine / buttons
  const [confessionClicked, setConfessionClicked] = useState(false);
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [isEvading, setIsEvading] = useState(false);

  // Custom Message Box (Scene 11 final afterglow)
  const [finalMsg, setFinalMsg] = useState('');
  const [msgSubmitted, setMsgSubmitted] = useState(false);

  // Transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.4 } }
  };

  // 1. Scripted 7-second awaken sequence
  const startAwakenSequence = () => {
    setIsAwakening(true);
    setAwakenStep(1);

    // Audio unlock
    if (window.unlockAudio) window.unlockAudio();
    if (window.playRomanticChime) window.playRomanticChime();

    const timers = [
      setTimeout(() => { setAwakenStep(2); window.awakenStep = 2; }, 1000), // Stars brighten
      setTimeout(() => { setAwakenStep(3); window.awakenStep = 3; }, 2500), // Flowers bloom
      setTimeout(() => { setAwakenStep(4); window.awakenStep = 4; }, 4000), // Fireflies drift
      setTimeout(() => { setAwakenStep(5); window.awakenStep = 5; }, 5000), // Water brightens
      setTimeout(() => { setAwakenStep(6); window.awakenStep = 6; }, 6000), // Animals react
      setTimeout(() => { setAwakenStep(7); window.awakenStep = 7; }, 7000)  // Text reveal
    ];

    return () => timers.forEach(clearTimeout);
  };

  // 2. Scene 7 Emotional build sequential reveals
  useEffect(() => {
    if (currentScene === SCENES.BUILD) {
      setBuildStep(0);
      const timers = [
        setTimeout(() => setBuildStep(1), 1600),
        setTimeout(() => setBuildStep(2), 3200),
        setTimeout(() => setBuildStep(3), 4800),
        setTimeout(() => setBuildStep(4), 6400),
        setTimeout(() => setBuildStep(5), 8000),
        setTimeout(() => setBuildStep(6), 9600)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [currentScene]);

  // 3. Scene 10 Confession timers
  useEffect(() => {
    if (currentScene === SCENES.CONFESSION) {
      setConfessionStep(0);
      setConfessionClicked(false);
      setNoBtnPos({ x: 0, y: 0 });
      setIsEvading(false);
      if (window.setHeartbeatActive) window.setHeartbeatActive(true);

      const timers = [
        setTimeout(() => setConfessionStep(1), 1200), // Show "Saranya..."
        setTimeout(() => setConfessionStep(2), 2700), // Pause, show "I LOVE YOU."
        setTimeout(() => setConfessionStep(3), 4900)  // Hold, show "Will you be mine?" + buttons
      ];
      return () => {
        timers.forEach(clearTimeout);
        if (window.setHeartbeatActive) window.setHeartbeatActive(false);
      };
    }
  }, [currentScene]);

  // 4. Scene 11a YES Celebration timeline and orchestrator
  const [heartAnimate, setHeartAnimate] = useState({ scale: 0, opacity: 0 });
  const [arrowAnimate, setArrowAnimate] = useState({ x: '60vw', y: '-60vh', opacity: 0 });
  const [impactFlash, setImpactFlash] = useState(false);
  const [showGiftBox, setShowGiftBox] = useState(false);
  const [isLidShaking, setIsLidShaking] = useState(false);
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [chocolatesOut, setChocolatesOut] = useState(false);
  const [showILoveYou, setShowILoveYou] = useState(false);
  const [showRoseHeart, setShowRoseHeart] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [shimmerActive, setShimmerActive] = useState(false);

  useEffect(() => {
    if (currentScene === SCENES.YES) {
      setHeartAnimate({ scale: 0, opacity: 0 });
      setArrowAnimate({ x: '60vw', y: '-60vh', opacity: 0 });
      setImpactFlash(false);
      setShowGiftBox(false);
      setIsLidShaking(false);
      setIsLidOpen(false);
      setChocolatesOut(false);
      setShowILoveYou(false);
      setShowRoseHeart(false);
      setShowFinalMessage(false);
      setShimmerActive(false);

      const timers = [
        // 0.7s: Glowing classic heart fades in
        setTimeout(() => {
          setHeartAnimate({ scale: 1.0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } });
        }, 700),

        // 1.0s: Golden fletched arrow starts diagonal travel from top-right
        setTimeout(() => {
          setArrowAnimate({ 
            x: 0, 
            y: 0, 
            opacity: 1, 
            transition: { duration: 1.2, ease: 'linear' } 
          });
        }, 1000),

        // 1.5s: Heart gentle pre-impact pulse
        setTimeout(() => {
          setHeartAnimate({ scale: [1, 1.06, 1], transition: { duration: 0.7 } });
        }, 1500),

        // 2.2s: IMPACT! full screen flash, heart expansion, camera shake
        setTimeout(() => {
          setImpactFlash(true);
          setHeartAnimate({ scale: [1.4, 1.0, 1.06, 1.0], transition: { duration: 0.6, ease: 'easeOut' } });
          setArrowAnimate({ x: 0, y: 0, opacity: 1 }); // Embedded in the heart
        }, 2200),

        // 2.8s: Heart loop pulse
        setTimeout(() => {
          setHeartAnimate({ 
            scale: [1, 1.06, 1], 
            transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } 
          });
        }, 2800),

        // 3.5s: Closed gift box bottom + lid fades in and starts shaking
        setTimeout(() => {
          setShowGiftBox(true);
          setIsLidShaking(true);
        }, 3500),

        // 4.5s: Lid opens naturally
        setTimeout(() => {
          setIsLidShaking(false);
          setIsLidOpen(true);
        }, 4500),

        // 4.8s: Chocolates pop out and scatter
        setTimeout(() => {
          setChocolatesOut(true);
        }, 4800),

        // 7.0s: Cinematic 'I LOVE YOU' reveal starts
        setTimeout(() => {
          setShowILoveYou(true);
        }, 7000),

        // 9.1s: Trigger golden shimmer sweep across settled text
        setTimeout(() => {
          setShimmerActive(true);
        }, 9100),

        // 9.5s: Luminous rose heart fades in underneath 'I LOVE YOU'
        setTimeout(() => {
          setShowRoseHeart(true);
        }, 9500),

        // 11.0s: Final message area fades in
        setTimeout(() => {
          setShowFinalMessage(true);
        }, 11000)
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [currentScene]);

  const handleDodge = () => {
    setIsEvading(true);
    setNoAttempts((prev) => prev + 1);
    
    // Calculate safe boundary limits avoiding screen edges
    const maxRangeX = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.35, 160) : 120;
    const maxRangeY = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.25, 120) : 90;

    // Generate random displacement with alternate polarities
    const randomX = (Math.random() - 0.5) * maxRangeX * 2;
    const randomY = (Math.random() - 0.5) * maxRangeY * 2;

    setNoBtnPos({ x: randomX, y: randomY });
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!finalMsg.trim()) return;
    setMsgSubmitted(true);
    if (window.playRomanticChime) window.playRomanticChime();
  };

  if (!isAdminLoggedIn) {
    return <AdminSecurityGate onUnlocked={() => setIsAdminLoggedIn(true)} />;
  }

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-1000 select-none ${
      currentScene === SCENES.SUSPENSE || currentScene === SCENES.CONFESSION ? 'bg-[#030005]' : 'bg-[#05020a]'
    }`}>
      {/* Reusable Canvas Heart Burst System */}
      <ErrorBoundary>
        <HeartBurst />
      </ErrorBoundary>

      {/* Persistent living GardenCanvas (Always active across all scenes) */}
      <ErrorBoundary>
        <BackgroundEffects />
      </ErrorBoundary>

      {/* Persistent YES / NO Celebration Canvas */}
      {(currentScene === SCENES.YES || currentScene === SCENES.LET_ME_THINK) && (
        <ErrorBoundary>
          <div className="fixed inset-0 w-full h-full z-35 pointer-events-none">
            <CelebrationCanvas />
          </div>
        </ErrorBoundary>
      )}

      {/* Global Mute Toggle and Header */}
      {disclaimerAccepted && (
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
      )}

      {/* Left Bird & Right Mascot Companions */}
      {disclaimerAccepted && (
        <>
          <ErrorBoundary>
            <LeftDecorations />
          </ErrorBoundary>
          <ErrorBoundary>
            <RightDecorations />
          </ErrorBoundary>
        </>
      )}

      {/* Easter Egg Overlay */}
      {disclaimerAccepted && (
        <ErrorBoundary>
          <EasterEggs />
        </ErrorBoundary>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-grow flex items-center justify-center py-12 relative z-30 px-4">
        {/* Background 3D Rotating Typography Heart in Confession scene */}
        {disclaimerAccepted && currentScene === SCENES.CONFESSION && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <div className="scale-75 sm:scale-100">
              <TextHeart3D />
            </div>
          </div>
        )}

        <div className="w-full max-w-lg mx-auto relative z-10">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
            
            {/* INTRO Gate Disclaimer */}
            {!disclaimerAccepted && (
              <motion.div
                key="disclaimer"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/10 text-center shadow-2xl space-y-6 pointer-events-auto"
              >
                <p className="text-amber-200/90 text-sm font-semibold tracking-widest uppercase">
                  A Small Note Before Entering...
                </p>
                
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
                  "நான் சொல்ல போற விஷயத்த கேட்டு தப்பா எதுவும் நினைக்க கூடாது... எனக்கு சொல்லணும்னு தோணுச்சு. நீ என்ன நினைப்பன்னு தெரியல, அதான் இப்படி சொல்றேன். ஸ்டார்ட்டிங்ல அப்படி தோணல, பேச பேச தான் அதிகமாச்சு... நீ இத அக்செப்ட் பண்ணுவியா மாட்டியான்னு எனக்கு தெரியல, ஆனா உனக்கு கேக்கணும்னு தோணுச்சுன்னா உள்ள வா..."
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative min-h-[70px]">
                  {/* Hero "ENTER" Button */}
                  <button 
                    onClick={handleEnterGarden}
                    className="btn-primary !px-8 !py-3.5 !text-sm !font-bold tracking-wider uppercase bg-gradient-to-r from-rose-500/20 to-amber-500/20 border-amber-300/40 text-amber-200 hover:border-amber-300 shadow-[0_0_25px_rgba(253,224,139,0.3)] z-20"
                  >
                    கேக்கலாம் (ENTER) 💖
                  </button>

                  {/* Playful "NOT READY" Button */}
                  <motion.button 
                    type="button"
                    animate={{ x: notReadyPos.x, y: notReadyPos.y }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    onMouseEnter={notReadyCount < 4 ? handleNotReady : undefined}
                    onClick={notReadyCount < 4 ? handleNotReady : handleEnterGarden}
                    className="btn-secondary !px-6 !py-3 !text-xs !font-semibold uppercase tracking-wider text-slate-300 border-white/10 hover:border-white/20 z-10"
                  >
                    {getNotReadyText()}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* SCENE 1: Intro opening */}
            {disclaimerAccepted && currentScene === SCENES.INTRO && (
              <motion.div
                key="scene_intro"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-6"
              >
                {!isAwakening ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-playfair text-rose-200">
                      Hey Saranya...
                    </h2>
                    <p className="text-sm text-gray-400 font-medium">
                      I made something for you.
                    </p>
                    <p className="text-xs text-rose-300/80 italic font-playfair pt-2">
                      But before we start... I need to ask you one small question.
                    </p>
                    <div className="pt-6">
                      <button
                        onClick={startAwakenSequence}
                        className="btn-primary pointer-events-auto"
                      >
                        Enter Our Garden
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Staged 7s Awaken UI */
                  <div className="space-y-4">
                    {awakenStep < 7 ? (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold animate-pulse">
                          Awakening...
                        </span>
                        <p className="text-xs text-gray-500">
                          {awakenStep === 1 && 'Slowing the wind...'}
                          {awakenStep === 2 && 'Drawing the stars...'}
                          {awakenStep === 3 && 'Blooming the blossoms...'}
                          {awakenStep === 4 && 'Calling the fireflies...'}
                          {awakenStep === 5 && 'Brightening reflections...'}
                          {awakenStep === 6 && 'Rigging our companions...'}
                        </p>
                      </div>
                    ) : (
                      /* Final 7s Completed line */
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6 max-w-sm mx-auto"
                      >
                        <p
                          className="text-base md:text-lg text-rose-200 leading-loose italic"
                          style={{
                            fontFamily: "'Mukta Malar', 'Latha', 'Tamil', sans-serif"
                          }}
                        >
                          "சில தருணங்கள்...
                          நம்மை எங்கே அழைத்துச் செல்லும் என்று
                          அந்த நேரத்தில் நமக்கே தெரியாது."
                        </p>
                        <button
                          onClick={() => goToScene(SCENES.GATECHECK)}
                          className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 mx-auto hover:scale-110 pointer-events-auto transition-transform"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* SCENE 2: Gate Check */}
            {currentScene === SCENES.GATECHECK && (
              <motion.div
                key="scene_gate"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-6"
              >
                <h3 className="text-xl md:text-2xl font-playfair text-white">
                  One important question first...
                </h3>
                <div className="p-6 md:p-8 rounded-3xl glass-panel border border-white/5 space-y-6 max-w-sm mx-auto shadow-2xl">
                  <p className="text-base font-medium text-rose-200 leading-relaxed">
                    Is there already someone special in your life?
                  </p>
                  <div className="flex gap-4 justify-center pointer-events-auto">
                    <button
                      onClick={() => goToScene(SCENES.GATECHECK_STOP)}
                      className="btn-secondary flex-1"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        if (window.playRomanticChime) window.playRomanticChime();
                        goToScene(SCENES.CALL);
                      }}
                      className="btn-primary flex-1"
                    >
                      No
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 2 EXIT: Respectful Exit Stop */}
            {currentScene === SCENES.GATECHECK_STOP && (
              <motion.div
                key="scene_gate_stop"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-sm mx-auto p-6 md:p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative text-center space-y-6 select-none"
              >
                <div className="space-y-3">
                  <Heart size={20} className="text-gray-600 mx-auto" />
                  <h4 className="text-base font-semibold text-white uppercase tracking-wider">
                    Respectful Ending
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed px-4">
                    "Okay... I'll stop here. I genuinely hope you're happy."
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 pointer-events-auto">
                  <button
                    onClick={() => {
                      if (window.playRomanticChime) window.playRomanticChime();
                      goToScene(SCENES.INTRO);
                    }}
                    className="btn-secondary mx-auto"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCENE 3: First Call */}
            {currentScene === SCENES.CALL && (
              <motion.div
                key="scene_call"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <PhoneCallScene onComplete={() => goToScene(SCENES.MEMORIES)} />
              </motion.div>
            )}

            {/* SCENE 4: Memories */}
            {currentScene === SCENES.MEMORIES && (
              <motion.div
                key="scene_memories"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <FeelingCards onComplete={() => goToScene(SCENES.QUALITIES)} />
              </motion.div>
            )}

            {/* SCENE 5: Qualities */}
            {currentScene === SCENES.QUALITIES && (
              <motion.div
                key="scene_qualities"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Qualities onComplete={() => goToScene(SCENES.GAME)} />
              </motion.div>
            )}

            {/* SCENE 6: Love Charger Game */}
            {currentScene === SCENES.GAME && (
              <motion.div
                key="scene_game"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <MiniGame onComplete={() => goToScene(SCENES.BUILD)} />
              </motion.div>
            )}

            {/* SCENE 7: Emotional Build */}
            {currentScene === SCENES.BUILD && (
              <motion.div
                key="scene_build"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-sm mx-auto p-6 md:p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative min-h-[380px] flex flex-col justify-between overflow-hidden text-center select-none"
              >
                <div className="flex items-center justify-center flex-grow min-h-[220px]">
                  <div className="space-y-4">
                    {buildStep >= 0 && (
                      <p className="text-sm md:text-base text-gray-400 font-sans leading-relaxed">
                        Some things are difficult to say directly.
                      </p>
                    )}
                    {buildStep >= 1 && (
                      <p className="text-sm md:text-base text-rose-300 font-sans leading-relaxed">
                        So I decided to show you instead.
                      </p>
                    )}
                    <div className="space-y-1.5 text-xs text-rose-100/70 font-sans pt-4 border-t border-white/5">
                      {buildStep >= 2 && <p>That first call.</p>}
                      {buildStep >= 3 && <p>Your caring.</p>}
                      {buildStep >= 4 && <p>Our conversations.</p>}
                      {buildStep >= 5 && <p>The little things.</p>}
                      {buildStep >= 6 && (
                        <p className="text-rose-300 font-medium text-sm animate-pulse">
                          And somewhere along the way
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-center min-h-[44px]">
                  {buildStep >= 6 && (
                    <button
                      onClick={() => goToScene(SCENES.LETTER)}
                      className="btn-primary"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* SCENE 8: Letter */}
            {currentScene === SCENES.LETTER && (
              <motion.div
                key="scene_letter"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Letter3D onComplete={() => goToScene(SCENES.CONFESSION)} />
              </motion.div>
            )}

            {/* SCENE 9: Suspense */}
            {currentScene === SCENES.SUSPENSE && (
              <motion.div
                key="scene_suspense"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-8 select-none"
              >
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-playfair text-rose-200">
                    Saranya...
                  </h3>
                  <p className="text-xs text-gray-400 font-sans tracking-wide">
                    I've been nervous about this.
                  </p>
                  <p className="text-xs text-gray-400 font-sans tracking-wide">
                    Because once I say it... there's no taking it back.
                  </p>
                  <p className="text-sm font-playfair italic text-rose-300 pt-6 animate-pulse">
                    Ready?
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => goToScene(SCENES.CONFESSION)}
                    className="btn-secondary hover:border-rose-500/30 hover:bg-rose-500/10"
                  >
                    Yes...
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCENE 10: Confession */}
            {currentScene === SCENES.CONFESSION && (
              <motion.div
                key="scene_confess"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-12 select-none"
              >
                <div className="min-h-[140px] flex flex-col justify-center items-center">
                  <AnimatePresence>
                    {confessionStep >= 1 && (
                      <motion.h4
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-playfair text-rose-200 mb-4"
                      >
                        Saranya...
                      </motion.h4>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {confessionStep >= 2 && (
                      <div className="relative flex gap-3 sm:gap-4 md:gap-6 items-center justify-center my-6 select-none font-['Playfair_Display',serif]">
                        {/* "I" - Left Entrance */}
                        <motion.span
                          initial={{ opacity: 0, x: -80, filter: "blur(8px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-b from-[#FFFDF0] via-[#FDE08B] to-[#DFAC38] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(253,224,139,0.5)]"
                        >
                          I
                        </motion.span>

                        {/* "LOVE" - Top Entrance */}
                        <motion.span
                          initial={{ opacity: 0, y: -60, filter: "blur(8px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-b from-[#FFFDF0] via-[#FDE08B] to-[#DFAC38] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(253,224,139,0.5)]"
                        >
                          LOVE
                        </motion.span>

                        {/* "YOU" - Right Entrance */}
                        <motion.span
                          initial={{ opacity: 0, x: 80, filter: "blur(8px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-b from-[#FFFDF0] via-[#FDE08B] to-[#DFAC38] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(253,224,139,0.5)]"
                        >
                          YOU.
                        </motion.span>

                        {/* Star sparkles overlay */}
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 45, 90] }}
                          transition={{ duration: 1.8, delay: 2.1, repeat: Infinity, repeatDelay: 2 }}
                          className="absolute -top-3 left-4 text-amber-200 text-lg pointer-events-none"
                        >
                          ✦
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, -45, -90] }}
                          transition={{ duration: 1.8, delay: 2.6, repeat: Infinity, repeatDelay: 1.8 }}
                          className="absolute -bottom-2 right-6 text-amber-200 text-sm pointer-events-none"
                        >
                          ✦
                        </motion.span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="min-h-[110px] flex flex-col items-center">
                  {confessionStep >= 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.0 }}
                      className="space-y-6 w-full"
                    >
                      <p className="text-sm text-rose-300 italic font-playfair">
                        Will you be mine?
                      </p>
                      
                      <div className="relative flex items-center justify-center gap-6 mt-8 min-h-[100px] w-full max-w-md mx-auto pointer-events-auto">
                        {/* YES BUTTON */}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setConfessionClicked(true);
                            if (window.triggerYesSoundDesign) window.triggerYesSoundDesign();
                            if (typeof window.triggerClimaxAudio === 'function') {
                              window.triggerClimaxAudio();
                            }
                            goToScene(SCENES.YES);
                          }}
                          className="py-4 px-10 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-lg tracking-wider shadow-[0_0_35px_rgba(244,114,182,0.6)] animate-pulse cursor-pointer z-20 pointer-events-auto"
                        >
                          YES, Forever! 💖
                        </motion.button>

                        {/* RUNAWAY NO BUTTON */}
                        <motion.button
                          type="button"
                          animate={isEvading ? { x: noBtnPos.x, y: noBtnPos.y } : { x: 0, y: 0 }}
                          transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          onMouseEnter={handleDodge}
                          onTouchStart={handleDodge}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDodge();
                          }}
                          className="py-3 px-6 rounded-2xl bg-zinc-900/80 border border-white/20 text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer select-none z-10 pointer-events-auto"
                        >
                          No 😢
                        </motion.button>
                      </div>

                      {noAttempts > 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-rose-300/80 italic mt-4"
                        >
                          {noAttempts > 2 ? "No escapes! Only 'YES' is allowed 😜❤️" : "Oops! You can't touch this button 🙈"}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SCENE 11a: YES Celebration overlay with DOM Heart, Arrow, Flash, and Typography */}
            {currentScene === SCENES.YES && (
              <div className="fixed inset-0 overflow-y-auto z-40 bg-[#05020a]/90 backdrop-blur-3xl px-4 py-12 flex flex-col items-center space-y-8 scrollbar-thin pointer-events-auto">
                {/* RENDER BUTTERFLIES IMMEDIATELY WHEN YES IS CLICKED */}
                <ButterflyExplosion />

                {/* 1. THE 3 EMOTIONAL INTERACTIVE QUESTIONS */}
                <PostProposalQuiz />

                {/* 2. ELEGANT CELEBRATION TITLE (Top) */}
                <div className="text-center space-y-2 mt-4 z-45">
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.0, duration: 1.0, ease: 'easeOut' }}
                    className="text-3xl md:text-5xl font-playfair font-black text-rose-100 tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] flex items-center justify-center gap-2"
                  >
                    SHE SAID YES. <Heart size={22} className="text-rose-500 fill-rose-500 inline animate-pulse" />
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.0, duration: 1.2, ease: 'easeOut' }}
                    className="text-base md:text-xl text-rose-200 leading-loose italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                    style={{
                      fontFamily: "'Mukta Malar', 'Latha', 'Tamil', sans-serif"
                    }}
                  >
                    "இந்த நிமிடம்... நம்முடையது. ❤️"
                  </motion.p>
                </div>

                {/* 2. CENTER ZONE: HUGE GLOWING REAL HEART & ARROW AND "I LOVE YOU" REVEAL */}
                <div className="relative flex-grow flex items-center justify-center w-full min-h-[340px] max-w-4xl">
                  {/* Big Glowing Heart */}
                  <motion.div
                    animate={heartAnimate}
                    className="absolute flex items-center justify-center z-30"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-36 h-36 md:w-52 md:h-52 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_35px_rgba(244,63,94,0.7)] drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                    >
                      <path d="M 50, 90 C 25, 75 5, 55 5, 35 C 5, 17 18, 5 35, 5 C 44, 5 50, 10 50, 10 C 50, 10 56, 5 65, 5 C 82, 5 95, 17 95, 35 C 95, 55 75, 75 50, 90 Z" />
                    </svg>
                  </motion.div>

                  {/* Embedded Golden Arrow */}
                  <motion.div
                    animate={arrowAnimate}
                    className="absolute flex items-center justify-center z-35"
                  >
                    <svg viewBox="-20 -20 180 180" className="w-24 h-24 md:w-36 md:h-36 text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)]">
                      <line x1="120" y1="-120" x2="0" y2="0" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                      <polygon points="0,0 22,-5 5,-22" fill="currentColor" />
                      <path d="M120,-120 L135,-115 L140,-130 L125,-135 Z" fill="currentColor" />
                      <path d="M115,-115 L130,-110 L135,-125 L120,-130 Z" fill="currentColor" />
                    </svg>
                  </motion.div>

                  {/* cinematic "I LOVE YOU" text reveal block overlaying on center */}
                  {showILoveYou && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-45">
                      <motion.h1
                        animate={{
                          filter: [
                            "brightness(1) drop-shadow(0 0 0px rgba(240,139,152,0))",
                            "brightness(1) drop-shadow(0 0 0px rgba(240,139,152,0))",
                            "brightness(1.22) drop-shadow(0 0 20px rgba(253,224,139,0.5))",
                            "brightness(1) drop-shadow(0 0 0px rgba(240,139,152,0))"
                          ]
                        }}
                        transition={{
                          times: [0, 0.77, 0.88, 1.0],
                          delay: 2.1,
                          duration: 0.8,
                          ease: "easeOut"
                        }}
                        className={`relative flex gap-4 md:gap-6 items-center justify-center text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-center select-none font-['Playfair_Display',serif] ${
                          shimmerActive ? 'animate-breathing-glow' : ''
                        }`}
                      >
                        {/* Word "I" (moves left -> center at 7.0s) */}
                        <motion.span
                          initial={{ x: '-50vw', opacity: 0 }}
                          animate={{ 
                            x: 0, 
                            opacity: 1,
                            textShadow: "0 0 12px rgba(253,224,139,0.45)"
                          }}
                          transition={{ 
                            delay: 0, 
                            duration: 0.7, 
                            ease: [0.25, 0.1, 0.25, 1.0]
                          }}
                          className={`text-gold-luxury inline-block ${shimmerActive ? 'shimmer-sweep' : ''}`}
                        >
                          I
                        </motion.span>

                        {/* Word "LOVE" (descends above -> center at 7.7s) */}
                        <motion.span
                          initial={{ y: '-30vh', opacity: 0 }}
                          animate={{ 
                            y: 0, 
                            opacity: 1,
                            textShadow: "0 0 16px rgba(240,139,152,0.45)"
                          }}
                          transition={{ 
                            delay: 0.7, 
                            duration: 0.7, 
                            ease: [0.25, 0.1, 0.25, 1.0]
                          }}
                          className="text-[#f08b98] font-serif italic inline-block"
                        >
                          LOVE
                        </motion.span>

                        {/* Word "YOU" (moves right -> center at 8.4s) */}
                        <motion.span
                          initial={{ x: '50vw', opacity: 0 }}
                          animate={{ 
                            x: 0, 
                            opacity: 1,
                            textShadow: "0 0 12px rgba(253,224,139,0.45)"
                          }}
                          transition={{ 
                            delay: 1.4, 
                            duration: 0.7, 
                            ease: [0.25, 0.1, 0.25, 1.0]
                          }}
                          className={`text-gold-luxury inline-block ${shimmerActive ? 'shimmer-sweep' : ''}`}
                        >
                          YOU
                        </motion.span>

                        {/* Twinkling fine jewelry stars overlay at key apexes */}
                        {shimmerActive && (
                          <div className="absolute inset-0 pointer-events-none z-10 overflow-visible select-none">
                            {/* Sparkle 1: Top-Left of I */}
                            <span className="absolute left-[8%] top-[15%] text-yellow-300 font-bold text-xs md:text-sm animate-sparkle-twinkle" style={{ animationDelay: '0s' }}>✦</span>
                            {/* Sparkle 2: Apex of V */}
                            <span className="absolute left-[45%] top-[72%] text-rose-300 font-bold text-sm md:text-base animate-sparkle-twinkle" style={{ animationDelay: '0.4s' }}>✦</span>
                            {/* Sparkle 3: Top-Right of E */}
                            <span className="absolute left-[58%] top-[20%] text-yellow-200 font-bold text-xs md:text-sm animate-sparkle-twinkle" style={{ animationDelay: '0.8s' }}>✦</span>
                            {/* Sparkle 4: Left tip of Y */}
                            <span className="absolute left-[70%] top-[25%] text-yellow-300 font-bold text-sm md:text-base animate-sparkle-twinkle" style={{ animationDelay: '0.2s' }}>✦</span>
                            {/* Sparkle 5: Right tip of U */}
                            <span className="absolute right-[6%] top-[25%] text-rose-200 font-bold text-xs md:text-sm animate-sparkle-twinkle" style={{ animationDelay: '0.6s' }}>✦</span>
                          </div>
                        )}
                      </motion.h1>

                      {/* Small elegant classic ROSE/PINK heart directly underneath (fades in at 9.5s) */}
                      {showRoseHeart && (
                        <motion.div
                          initial={{ scale: 0.65, opacity: 0 }}
                          animate={{ 
                            scale: [0.65, 1.0], 
                            opacity: 1
                          }}
                          transition={{ 
                            duration: 0.5, 
                            ease: 'easeOut'
                          }}
                          className="mt-6 flex justify-center items-center"
                        >
                          <motion.svg
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: 0.5 }}
                            viewBox="0 0 100 100"
                            className="w-8 h-8 text-rose-400 fill-rose-400 filter drop-shadow-[0_0_10px_rgba(244,63,94,0.65)]"
                          >
                            <path d="M 50, 90 C 25, 75 5, 55 5, 35 C 5, 17 18, 5 35, 5 C 44, 5 50, 10 50, 10 C 50, 10 56, 5 65, 5 C 82, 5 95, 17 95, 35 C 95, 55 75, 75 50, 90 Z" />
                          </motion.svg>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. IMPACT FLASH (Z-50) */}
                {impactFlash && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0] }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="fixed inset-0 bg-white/95 z-50 pointer-events-none"
                  />
                )}

                {/* 4. OPEN PURPLE GIFT BOX WITH CADBURY DAIRY MILK CHOCOLATES (Bottom-Center) */}
                <div className="h-[120px] flex items-end justify-center w-full z-45 relative mt-4 select-none pointer-events-auto">
                  <AnimatePresence>
                    {showGiftBox && (
                      <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 150, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 70, damping: 14 }}
                        className="relative w-48 h-24 flex justify-center items-end"
                      >
                        {/* Golden light glow from box when open */}
                        {isLidOpen && (
                          <div className="absolute bottom-4 w-32 h-32 rounded-full bg-yellow-400/25 filter blur-[35px] animate-pulse z-15" />
                        )}

                        {/* Chocolates wrapper (behind front face, in front of background) */}
                        <div className="absolute bottom-6 w-full h-24 flex items-center justify-center overflow-visible z-15">
                          {/* Chocolate Bar 1 */}
                          <motion.div
                            initial={{ y: 40, scale: 0.1, opacity: 0 }}
                            animate={chocolatesOut ? { y: -75, x: -70, scale: 0.78, opacity: 1, rotate: -22 } : {}}
                            transition={{ type: 'spring', stiffness: 80, damping: 11 }}
                            className="absolute w-16 h-28"
                          >
                            <DairyMilkBar />
                          </motion.div>

                          {/* Chocolate Bar 2 */}
                          <motion.div
                            initial={{ y: 40, scale: 0.1, opacity: 0 }}
                            animate={chocolatesOut ? { y: -105, x: -26, scale: 0.85, opacity: 1, rotate: -8 } : {}}
                            transition={{ type: 'spring', stiffness: 80, damping: 11 }}
                            className="absolute w-16 h-28"
                          >
                            <DairyMilkBar />
                          </motion.div>

                          {/* Chocolate Bar 3 */}
                          <motion.div
                            initial={{ y: 40, scale: 0.1, opacity: 0 }}
                            animate={chocolatesOut ? { y: -105, x: 26, scale: 0.85, opacity: 1, rotate: 8 } : {}}
                            transition={{ type: 'spring', stiffness: 80, damping: 11 }}
                            className="absolute w-16 h-28"
                          >
                            <DairyMilkBar />
                          </motion.div>

                          {/* Chocolate Bar 4 */}
                          <motion.div
                            initial={{ y: 40, scale: 0.1, opacity: 0 }}
                            animate={chocolatesOut ? { y: -75, x: 70, scale: 0.78, opacity: 1, rotate: 22 } : {}}
                            transition={{ type: 'spring', stiffness: 80, damping: 11 }}
                            className="absolute w-16 h-28"
                          >
                            <DairyMilkBar />
                          </motion.div>

                          {/* Bonbon 1 */}
                          <motion.div
                            initial={{ y: 40, scale: 0.1, opacity: 0 }}
                            animate={chocolatesOut ? { y: -45, x: -105, scale: 0.9, opacity: 1, rotate: -40 } : {}}
                            transition={{ type: 'spring', stiffness: 90 }}
                            className="absolute w-10 h-8"
                          >
                            <IndividualChocolate />
                          </motion.div>

                          {/* Bonbon 2 */}
                          <motion.div
                            initial={{ y: 40, scale: 0.1, opacity: 0 }}
                            animate={chocolatesOut ? { y: -45, x: 105, scale: 0.9, opacity: 1, rotate: 40 } : {}}
                            transition={{ type: 'spring', stiffness: 90 }}
                            className="absolute w-10 h-8"
                          >
                            <IndividualChocolate />
                          </motion.div>
                        </div>

                        {/* Floor reflection/shadow under the box */}
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-40 h-3 bg-black/60 rounded-full filter blur-md z-10 pointer-events-none" />

                        {/* Box Lid */}
                        <motion.div
                          animate={isLidOpen ? { y: -110, x: -70, rotate: -32, opacity: 0.25 } : (isLidShaking ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] } : {})}
                          transition={isLidOpen ? { duration: 0.8, ease: 'easeOut' } : { repeat: Infinity, duration: 0.4 }}
                          className="absolute bottom-[36px] w-[172px] h-6 z-25 origin-bottom-left"
                        >
                          <svg viewBox="0 0 170 24" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                            <defs>
                              <radialGradient id="boxVelvet" cx="50%" cy="40%" r="60%">
                                <stop offset="0%" stopColor="#4a156e" />
                                <stop offset="75%" stopColor="#220138" />
                                <stop offset="100%" stopColor="#0f001b" />
                              </radialGradient>
                              <linearGradient id="goldSpec" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffe699" />
                                <stop offset="35%" stopColor="#dca838" />
                                <stop offset="50%" stopColor="#ffffff" />
                                <stop offset="65%" stopColor="#dca838" />
                                <stop offset="100%" stopColor="#8d6411" />
                              </linearGradient>
                            </defs>
                            <rect x="0" y="0" width="170" height="20" rx="3" fill="url(#boxVelvet)" stroke="url(#goldSpec)" strokeWidth="1.5" />
                            <rect x="75" y="0" width="20" height="20" fill="url(#goldSpec)" />
                            <rect x="0" y="20" width="170" height="4" fill="#140024" />
                          </svg>
                        </motion.div>

                        {/* Box Body (Front Face) */}
                        <div className="absolute bottom-0 w-36 h-18 z-20">
                          <svg viewBox="0 0 140 80" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                            <rect x="0" y="0" width="140" height="80" rx="5" fill="url(#boxVelvet)" stroke="url(#goldSpec)" strokeWidth="2" />
                            <rect x="60" y="0" width="20" height="80" fill="url(#goldSpec)" />
                            <rect x="0" y="30" width="140" height="20" fill="url(#goldSpec)" />
                            <circle cx="70" cy="40" r="12" fill="#fff5cc" stroke="url(#goldSpec)" strokeWidth="1.5" />
                            <path d="M66,40 L74,40 M70,36 L70,44" stroke="#25023d" strokeWidth="2.0" strokeLinecap="round" />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. ELEGANT MESSAGE AREA (Bottom) & KEEPSAKE */}
                <div className="w-full flex flex-col items-center z-45 pointer-events-auto">
                  <AnimatePresence>
                    {showFinalMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, ease: 'easeOut' }}
                        className="w-full flex flex-col items-center space-y-6 text-center"
                      >
                        <SecretMessageCard />
                        <MemorySnapshotCard />
                        
                        {/* RENDER THE SPRING-COIL TREE AT THE BOTTOM OF THE CELEBRATION */}
                        <div className="w-full flex justify-center py-8 z-30">
                          <SpringCoilFinale />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* SCENE 11b: NO response card */}
            {currentScene === SCENES.LET_ME_THINK && (
              <motion.div
                key="scene_no"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-sm mx-auto p-6 md:p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative text-center"
              >
                {/* Cracked heart canvas placeholder / SVG */}
                <div className="flex justify-center my-6">
                  <svg viewBox="0 0 100 100" className="w-18 h-18 text-rose-400 animate-pulse">
                    {/* Cracked Left Path */}
                    <path
                      d="M50,30 C30,10 10,25 35,55 C42,62 48,72 50,75 L45,55 L52,48 L46,38 Z"
                      fill="currentColor"
                      opacity="0.8"
                    />
                    {/* Cracked Right Path */}
                    <path
                      d="M50,30 C70,10 90,25 65,55 C58,62 52,72 50,75 L45,55 L52,48 L46,38 Z"
                      fill="currentColor"
                      opacity="0.8"
                      transform="translate(100,0) scale(-1,1) translate(-100,0)"
                    />
                  </svg>
                </div>

                <div className="space-y-4">
                  <p
                    className="text-base text-rose-100 font-sans italic"
                    style={{
                      fontFamily: "'Mukta Malar', 'Latha', 'Tamil', sans-serif"
                    }}
                  >
                    "ஒரு நிமிஷம்...<br />இன்னும் ஒரு முறை யோசிக்கலாமா?"
                  </p>

                  <div className="flex flex-col gap-3 justify-center pt-4 pointer-events-auto max-w-[200px] mx-auto">
                    <button
                      onClick={() => goToScene(SCENES.LETTER)}
                      className="btn-primary"
                    >
                      Read it again ❤️
                    </button>
                    <button
                      onClick={() => goToScene(SCENES.NO)}
                      className="btn-secondary"
                    >
                      Give me some time
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 11b EXIT: Give me time respectful ending */}
            {currentScene === SCENES.NO && (
              <motion.div
                key="scene_time_ending"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-sm mx-auto p-6 md:p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative text-center space-y-6 select-none"
              >
                <div className="space-y-3">
                  <Heart size={20} className="text-gray-600 mx-auto" />
                  <h4 className="text-base font-semibold text-white uppercase tracking-wider">
                    Take your time
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed px-4">
                    "Take all the time you need. I'll always be here, respecting whatever choice makes you happy."
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 pointer-events-auto">
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="btn-secondary mx-auto flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} />
                    Restart Journey
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </ErrorBoundary>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-4 text-center border-t border-white/2 pointer-events-none select-none z-10">
        <p className="text-[9px] text-gray-500 uppercase tracking-widest">
          Forever • Abishek & Saranya
        </p>
      </footer>
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
