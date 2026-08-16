import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Send } from 'lucide-react';
import BackgroundEffects from './components/BackgroundEffects';
import AudioPlayer from './components/AudioPlayer';
import CelebrationCanvas from './components/CelebrationCanvas';
import LeftDecorations from './components/LeftDecorations';
import RightDecorations from './components/RightDecorations';
import PhoneCallScene from './components/PhoneCallScene';
import FeelingCards from './components/FeelingCards';
import GardenTransition from './components/GardenTransition';
import TamilPoetry from './components/TamilPoetry';
import LoveMeter from './components/LoveMeter';
import Letter3D from './components/Letter3D';
import EasterEggs from './components/EasterEggs';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  // Page states: 
  // scene1_mystery, scene2_check, scene2_stop, scene3_call, scene4_feelings, scene5_poetry, 
  // scene6_lovemeter, scene7_buildup, scene8_letter, scene9_suspense, scene10_proposal, 
  // scene11_yes, scene11_final, let_me_think
  const [scene, setScene] = useState('scene1_mystery');
  const goToScene = (nextScene) => {
    console.log(`[DEBUG] Navigating: ${scene} → ${nextScene}`);
    setScene(nextScene);
  };
  console.log(`[DEBUG] Render Scene: ${scene}`);
  const [mascotState, setMascotState] = useState('curious');
  const [mysteryStep, setMysteryStep] = useState(0);
  const [suspenseStep, setSuspenseStep] = useState(0);
  const [proposalReveal, setProposalReveal] = useState(0);
  const [showCelebrationSkip, setShowCelebrationSkip] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  
  // Custom Message Storage (local state only)
  const [saranyaMsg, setSaranyaMsg] = useState('');
  const [isMessageSubmitted, setIsMessageSubmitted] = useState(false);

  // Sync mascot state with scenes
  useEffect(() => {
    if (scene === 'scene1_mystery') {
      setMascotState('curious');
    } else if (scene === 'scene2_check') {
      setMascotState('curious');
    } else if (scene === 'scene2_stop') {
      setMascotState('idle');
    } else if (scene === 'scene3_call') {
      setMascotState('curious');
    } else if (scene === 'scene4_feelings') {
      setMascotState('idle');
    } else if (scene === 'scene4_transition') {
      setMascotState('shy');
    } else if (scene === 'scene5_poetry') {
      setMascotState('shy');
    } else if (scene === 'scene6_lovemeter') {
      setMascotState('curious');
    } else if (scene === 'scene7_buildup') {
      setMascotState('shy');
    } else if (scene === 'scene8_letter') {
      setMascotState('shy');
    } else if (scene === 'scene9_suspense') {
      setMascotState('nervous');
    } else if (scene === 'scene10_proposal') {
      setMascotState('excited');
    } else if (scene === 'scene11_yes') {
      setMascotState('celebrating');
    } else if (scene === 'scene11_final') {
      setMascotState('idle');
    } else if (scene === 'let_me_think') {
      setMascotState('sad');
    }
  }, [scene]);

  // Timers for proposal suspense sequence (Scene 9)
  useEffect(() => {
    if (scene === 'scene9_suspense') {
      setSuspenseStep(0);
      try { if (window.setHeartbeatActive) window.setHeartbeatActive(true); } catch(e) {}
      
      const timers = [
        setTimeout(() => setSuspenseStep(1), 2200),
        setTimeout(() => setSuspenseStep(2), 4800),
        setTimeout(() => setSuspenseStep(3), 7400),
        setTimeout(() => setSuspenseStep(4), 9800),
      ];
      return () => {
        timers.forEach(clearTimeout);
        try { if (window.setHeartbeatActive) window.setHeartbeatActive(false); } catch(e) {}
      };
    }
  }, [scene]);

  // Timers for cinematic I LOVE YOU proposal reveal (Scene 10)
  useEffect(() => {
    if (scene === 'scene10_proposal') {
      setProposalReveal(0);
      try { if (window.setHeartbeatActive) window.setHeartbeatActive(true); } catch(e) {}
      
      const timers = [
        setTimeout(() => setProposalReveal(1), 100), // Show "I LOVE YOU" immediately
        setTimeout(() => setProposalReveal(2), 2600), // Pause 2.5 seconds before question
        setTimeout(() => setProposalReveal(3), 4800), // Pause 2.2 seconds before buttons appear
      ];
      return () => {
        timers.forEach(clearTimeout);
        try { if (window.setHeartbeatActive) window.setHeartbeatActive(false); } catch(e) {}
      };
    }
  }, [scene]);

  // Delay transition from YES Celebration to Final Message card (Scene 11)
  useEffect(() => {
    if (scene === 'scene11_yes') {
      setShowCelebrationSkip(false);
      const skipTimer = setTimeout(() => {
        setShowCelebrationSkip(true);
      }, 4200);

      const timer = setTimeout(() => {
        goToScene('scene11_final');
      }, 13000); // Settle down celebration after 13 seconds
      return () => {
        clearTimeout(skipTimer);
        clearTimeout(timer);
      };
    }
  }, [scene]);

  const resetJourney = (startScene = 'scene3_call') => {
    goToScene(startScene);
    setMysteryStep(0);
    setSuspenseStep(0);
    setProposalReveal(0);
    setSaranyaMsg('');
    setIsMessageSubmitted(false);
    setMascotState('idle');
    setShowCelebrationSkip(false);
    setBuildStep(0);
  };

  // Framer Motion page variants
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.4, ease: "easeIn" } }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Map progress bar steps
  const progressSteps = [
    { key: 'scene1_mystery', label: 'Intro' },
    { key: 'scene3_call', label: 'Call' },
    { key: 'scene4_feelings', label: 'Feelings' },
    { key: 'scene5_poetry', label: 'Poetry' },
    { key: 'scene6_lovemeter', label: 'Meter' },
    { key: 'scene8_letter', label: 'Letter' },
    { key: 'scene10_proposal', label: 'Confess' }
  ];

  const getProgressIndex = () => {
    const idx = progressSteps.findIndex(s => s.key === scene);
    if (idx !== -1) return idx;
    if (scene === 'scene2_check') return 0;
    if (scene === 'scene7_buildup') return 4;
    if (scene === 'scene9_suspense') return 6;
    if (scene === 'scene11_yes' || scene === 'scene11_final') return progressSteps.length - 1;
    return 0;
  };

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-1000 select-none ${
      scene === 'scene9_suspense' || scene === 'scene10_proposal' ? 'bg-[#030005]' : 'bg-[#040107]'
    }`}>
      {/* Immersive background particles */}
      {scene !== 'scene11_yes' && (
        <ErrorBoundary>
          <BackgroundEffects scene={scene} />
        </ErrorBoundary>
      )}

      {/* Grand Double-Sided Celebration Canvas */}
      {scene === 'scene11_yes' && (
        <ErrorBoundary>
          <CelebrationCanvas />
        </ErrorBoundary>
      )}

      {/* Optional Sound Controller & Progress indicators */}
      {scene !== 'scene2_stop' && (
        <header className="fixed top-0 inset-x-0 z-50 p-4 md:p-6 flex items-center justify-between pointer-events-none">
          {/* Top-Left Title */}
          <div className="flex items-center gap-1">
            <Heart size={14} fill="currentColor" className="text-rose-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-rose-300 font-sans">
              For Saranya ❤️
            </span>
          </div>

          {/* Top-Right Sound & Progress */}
          <div className="flex items-center gap-6 pointer-events-auto">
            {scene !== 'scene1_mystery' && scene !== 'scene2_check' && (
              <div className="hidden md:flex gap-1.5 items-center bg-white/2 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                {progressSteps.map((step, idx) => (
                  <div
                    key={step.key}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx <= getProgressIndex() ? 'bg-rose-500 shadow-[0_0_6px_#ff0077]' : 'bg-white/10'
                    }`}
                    title={step.label}
                  />
                ))}
              </div>
            )}
            <AudioPlayer scene={scene} />
          </div>
        </header>
      )}

      {/* Environmental decorations */}
      {scene !== 'scene2_stop' && (
        <>
          <ErrorBoundary>
            <LeftDecorations celebrating={scene === 'scene11_yes'} scene={scene} />
          </ErrorBoundary>
          <ErrorBoundary>
            <RightDecorations state={mascotState} scene={scene} />
          </ErrorBoundary>
        </>
      )}

      {/* Hidden confessions Easter Eggs */}
      <ErrorBoundary>
        <EasterEggs />
      </ErrorBoundary>

      {/* MAIN VIEWPORT */}
      <main className="flex-grow flex items-center justify-center py-10 relative z-30 px-4">
        <div className="w-full max-w-lg mx-auto">
          <AnimatePresence mode="wait">

            {/* SCENE 1: Mystery Opening */}
            {scene === 'scene1_mystery' && (
              <motion.div
                key="mystery"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-playfair text-rose-200">
                    Hey Saranya...
                  </h2>
                  
                  {mysteryStep >= 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-sm md:text-base text-gray-400"
                    >
                      I made something for you.
                    </motion.p>
                  )}

                  {mysteryStep >= 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                      className="text-xs text-rose-300/80 italic font-playfair"
                    >
                      But first...
                    </motion.p>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.5 }}
                  className="pt-6"
                >
                  <button
                    id="btn-mystery-trigger"
                    onClick={() => goToScene('scene2_check')}
                    className="w-14 h-14 rounded-full bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-md shadow-rose-500/5 hover:scale-110 transition-all duration-300 mx-auto"
                    aria-label="Unlock Question"
                  >
                    <span className="text-xl font-bold font-playfair">?</span>
                  </button>
                  <p className="text-[10px] text-gray-500 mt-3 tracking-wider uppercase font-sans">
                    Can I ask you something?
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* SCENE 2: Secret Relationship Check */}
            {scene === 'scene2_check' && (
              <motion.div
                key="secret_check"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-6"
              >
                <h3 className="text-xl md:text-2xl font-playfair text-white">
                  Before you go any further...
                </h3>

                <div className="p-6 md:p-8 rounded-3xl glass-card border border-white/5 space-y-6 max-w-sm mx-auto shadow-2xl">
                  <p className="text-base md:text-lg font-medium text-rose-200">
                    Is there already someone special in your life?
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    <button
                      id="btn-relationship-yes"
                      onClick={() => goToScene('scene2_stop')}
                      className="px-6 py-2.5 rounded-full border border-white/10 hover:border-rose-500/30 bg-white/2 hover:bg-rose-500/10 text-rose-300 font-medium text-sm transition-all duration-300 active:scale-95 flex-1"
                    >
                      Yes
                    </button>
                    <button
                      id="btn-relationship-no"
                      onClick={() => {
                        // Play chime
                        if (window.playRomanticChime) window.playRomanticChime();
                        goToScene('scene3_call');
                      }}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm shadow-md shadow-rose-500/10 hover:scale-105 active:scale-95 transition-all duration-300 flex-1"
                    >
                      No
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCENE 2 EXIT: Someone Special Respectful Page */}
            {scene === 'scene2_stop' && (
              <motion.div
                key="yes_stop"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center max-w-md mx-auto p-8 rounded-3xl glass-card border border-white/5 shadow-2xl space-y-6"
              >
                <div className="text-rose-400 text-3xl font-sans">❤️</div>
                <h2 className="text-xl md:text-2xl font-playfair font-medium text-white">
                  Okay...
                </h2>
                <div className="space-y-4 text-sm md:text-base text-gray-400 leading-relaxed">
                  <p>I'll respect that.</p>
                  <p>I genuinely hope they keep you happy.</p>
                  <p className="text-xs text-gray-500 pt-4">
                    If you ever want to come back, this little place will still be here.
                  </p>
                </div>
                <button
                  id="btn-close-yes-stop"
                  onClick={() => goToScene('scene1_mystery')}
                  className="mt-6 px-6 py-2 rounded-full border border-white/10 text-xs font-semibold tracking-wider hover:bg-white/5 text-gray-400 hover:text-white transition-all duration-300 active:scale-95"
                >
                  Close ❤️
                </button>
              </motion.div>
            )}

            {/* SCENE 3: First Phone Call */}
            {scene === 'scene3_call' && (
              <motion.div
                key="phone_call"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <ErrorBoundary>
                  <PhoneCallScene onComplete={() => goToScene('scene4_feelings')} />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* SCENE 4: First Feeling Cards */}
            {scene === 'scene4_feelings' && (
              <motion.div
                key="feelings"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <ErrorBoundary>
                  <FeelingCards
                    onComplete={() => {
                      console.log("[DEBUG] ENTER OUR GARDEN CLICKED");
                      goToScene('scene4_transition');
                    }}
                    onStateChange={setMascotState}
                  />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* SCENE 4.5: Garden transition scene */}
            {scene === 'scene4_transition' && (
              <ErrorBoundary>
                <GardenTransition onComplete={() => goToScene('scene5_poetry')} />
              </ErrorBoundary>
            )}

            {/* SCENE 5: Tamil Heart-Touching Poetry */}
            {scene === 'scene5_poetry' && (
              <motion.div
                key="poetry"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <ErrorBoundary>
                  <TamilPoetry onComplete={() => goToScene('scene6_lovemeter')} />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* SCENE 6: Love Meter Game */}
            {scene === 'scene6_lovemeter' && (
              <motion.div
                key="love_meter"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <div className="text-center max-w-sm mx-auto space-y-2 mb-4">
                  <span className="text-rose-400 text-3xl font-sans">😂</span>
                  <h2 className="text-xl md:text-2xl font-playfair font-semibold text-white">
                    Okay okay... enough serious stuff.
                  </h2>
                  <p className="text-xs md:text-sm text-gray-400">
                    Let's see if you actually know how much I like you.
                  </p>
                </div>
                <ErrorBoundary>
                  <LoveMeter
                    onComplete={() => goToScene('scene7_buildup')}
                    onStateChange={setMascotState}
                  />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* SCENE 7: Emotional Build-up */}
            {scene === 'scene7_buildup' && (
              <motion.div
                key="buildup"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/5 shadow-2xl relative min-h-[350px] flex flex-col justify-between"
              >
                <div className="text-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold font-sans">
                    Reflections
                  </span>
                </div>

                <div className="flex-grow flex items-center justify-center py-4">
                  <AnimatePresence mode="wait">
                    {buildStep === 0 && (
                      <motion.div
                        key="b0"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6 text-center"
                      >
                        <p className="text-lg md:text-xl font-playfair font-medium text-white leading-relaxed">
                          "Have you ever noticed..."
                        </p>
                        <button
                          id="btn-buildup-0"
                          onClick={() => setBuildStep(1)}
                          className="px-6 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 hover:scale-105 active:scale-95 transition-all"
                        >
                          What? 👀
                        </button>
                      </motion.div>
                    )}

                    {buildStep === 1 && (
                      <motion.div
                        key="b1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6 text-center"
                      >
                        <p className="text-base text-gray-300 leading-relaxed italic">
                          "Some people enter our lives without making any noise."
                        </p>
                        <button
                          id="btn-buildup-1"
                          onClick={() => setBuildStep(2)}
                          className="px-6 py-2.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/25 hover:scale-105 active:scale-95 transition-all"
                        >
                          And then? 💓
                        </button>
                      </motion.div>
                    )}

                    {buildStep === 2 && (
                      <motion.div
                        key="b2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6 text-center"
                      >
                        <p className="text-base md:text-lg font-playfair font-semibold text-white leading-relaxed">
                          "And somehow... they become part of our everyday thoughts."
                        </p>
                        <button
                          id="btn-buildup-2"
                          onClick={() => setBuildStep(3)}
                          className="px-6 py-2.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/25 hover:scale-105 active:scale-95 transition-all"
                        >
                          Go on... ❤️
                        </button>
                      </motion.div>
                    )}

                    {buildStep === 3 && (
                      <motion.div
                        key="b3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6 text-center"
                      >
                        <p className="text-base text-gray-300 leading-relaxed italic">
                          "Not because they tried to... but because being around them simply feels... easy."
                        </p>
                        <button
                          id="btn-buildup-3"
                          onClick={() => setBuildStep(4)}
                          className="px-6 py-2.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/25 hover:scale-105 active:scale-95 transition-all"
                        >
                          True... ✨
                        </button>
                      </motion.div>
                    )}

                    {buildStep === 4 && (
                      <motion.div
                        key="b4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6 text-center"
                      >
                        <p className="text-base text-white font-medium italic leading-relaxed">
                          "That's what I wanted you to understand before I ask you something."
                        </p>
                        <button
                          id="btn-buildup-4"
                          onClick={() => {
                            setBuildStep(0);
                            goToScene('scene8_letter');
                          }}
                          className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/10 hover:scale-105 active:scale-95 transition-all mt-4"
                        >
                          Read my letter ✉️
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* SCENE 8: The 3D Envelope Letter */}
            {scene === 'scene8_letter' && (
              <motion.div
                key="letter"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <ErrorBoundary>
                  <Letter3D onComplete={() => goToScene('scene9_suspense')} />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* SCENE 9: Cinematic Suspense Pacing */}
            {scene === 'scene9_suspense' && (
              <motion.div
                key="suspense"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-8 max-w-md mx-auto px-4 min-h-[320px] flex flex-col justify-center"
              >
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    {suspenseStep === 0 && (
                      <motion.h3
                        key="s0"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={textVariants}
                        className="text-2xl md:text-3xl font-playfair font-semibold text-rose-300"
                      >
                        Saranya...
                      </motion.h3>
                    )}

                    {suspenseStep === 1 && (
                      <motion.p
                        key="s1"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={textVariants}
                        className="text-sm md:text-base text-gray-400 leading-relaxed"
                      >
                        I've been wanting to ask you something.
                      </motion.p>
                    )}

                    {suspenseStep === 2 && (
                      <motion.p
                        key="s2"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={textVariants}
                        className="text-xs text-rose-200/90 font-medium tracking-wide italic"
                      >
                        "Are you ready?"
                      </motion.p>
                    )}

                    {(suspenseStep === 3 || suspenseStep === 4) && (
                      <motion.div
                        key="s3"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: [1, 1.25, 1] }}
                        exit="exit"
                        variants={textVariants}
                        transition={{ repeat: Infinity, duration: 0.95, ease: 'easeInOut' }}
                        className="text-rose-600 flex justify-center py-2"
                      >
                        <Heart size={44} fill="currentColor" className="filter drop-shadow-[0_0_12px_#ff0055]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {suspenseStep >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4"
                    >
                      <button
                        id="btn-suspense-reveal"
                        onClick={() => goToScene('scene10_proposal')}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-500/20"
                      >
                        Tell me ❤️
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* SCENE 10: Proposal & Decisive Reveal */}
            {scene === 'scene10_proposal' && (
              <motion.div
                key="proposal"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-8 max-w-md mx-auto px-4"
              >
                {/* Glowing Heart */}
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-rose-500/25 rounded-full blur-2xl filter animate-glow-pulse" />
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                    className="text-rose-500 relative"
                  >
                    <Heart size={54} fill="currentColor" className="filter drop-shadow-[0_0_16px_#ff0055]" />
                  </motion.div>
                </div>

                {/* Proposal Text Progression */}
                <div className="min-h-[160px] flex flex-col justify-center gap-6">
                  <AnimatePresence>
                    {proposalReveal >= 1 && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        className="text-4xl md:text-5xl font-playfair font-black bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(214,69,119,0.55)] py-2"
                      >
                        I LOVE YOU. ❤️
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {proposalReveal >= 2 && (
                      <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                        className="text-lg font-medium text-white tracking-wide font-playfair italic"
                      >
                        Will you be mine?
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* YES / THINK Buttons */}
                <AnimatePresence>
                  {proposalReveal >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 justify-center max-w-xs mx-auto pt-4"
                    >
                      <button
                        id="btn-proposal-think"
                        onClick={() => {
                          goToScene('let_me_think');
                          if (window.triggerNoSoundDesign) window.triggerNoSoundDesign();
                        }}
                        className="px-6 py-3 rounded-full border border-white/10 hover:border-pink-500/20 bg-white/2 hover:bg-pink-500/5 text-pink-300 font-medium text-sm transition-all duration-300 active:scale-95 flex-1"
                      >
                        LET ME THINK 🌸
                      </button>
                      <button
                        id="btn-proposal-yes"
                        onClick={() => {
                          goToScene('scene11_yes');
                          if (window.triggerYesSoundDesign) window.triggerYesSoundDesign();
                        }}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex-1 animate-pulse"
                      >
                        YES ❤️
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* SCENE 11: YES Spectacular Celebration */}
            {scene === 'scene11_yes' && (
              <motion.div
                key="celebration"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-6 max-w-md mx-auto relative z-40"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-playfair font-black text-rose-300 animate-pulse tracking-wide drop-shadow-[0_0_10px_#ff0055]">
                    WAIT... 😭❤️
                  </h2>
                  <p className="text-lg text-white font-medium">
                    YOU SAID YES?!
                  </p>
                </div>

                <div className="py-6 px-6 glass-card border border-rose-500/10 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden bg-rose-950/5">
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white tracking-widest">
                    Saranya <span className="text-rose-500">❤️</span> Abishek
                  </h3>
                  
                  <p className="text-xs text-rose-300 font-medium pt-2 italic">
                    "From one phone call... to this moment."
                  </p>

                  <p className="text-sm font-sans font-semibold uppercase tracking-wider text-purple-300 animate-pulse">
                    Our story starts here. ❤️
                  </p>
                </div>

                {showCelebrationSkip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      id="btn-celebration-skip"
                      onClick={() => goToScene('scene11_final')}
                      className="px-6 py-2.5 rounded-full border border-rose-500/25 bg-rose-950/20 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold hover:text-white transition-all duration-300 active:scale-95 flex items-center gap-1.5 mx-auto pointer-events-auto shadow-lg"
                    >
                      Enter our garden →
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SCENE 11 FINAL: Settle Down, Personal Message & Quiet Garden */}
            {scene === 'scene11_final' && (
              <motion.div
                key="final_garden"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-6 max-w-md mx-auto"
              >
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white">
                    Our Garden ❤️
                  </h3>
                  <p className="text-xs text-gray-400">Where silence speaks and hearts stay. 🌸</p>
                </div>

                {/* Input Card/Form OR Submission display */}
                <AnimatePresence mode="wait">
                  {!isMessageSubmitted ? (
                    <motion.div
                      key="input-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6 rounded-3xl glass-card border border-white/5 space-y-5"
                    >
                      <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-rose-300 font-sans">
                        There's one more thing...
                      </p>
                      <p className="text-xs text-gray-400">If there's something you want to tell me...</p>
                      
                      <textarea
                        id="txt-personal-message"
                        value={saranyaMsg}
                        onChange={(e) => setSaranyaMsg(e.target.value)}
                        placeholder="Write it here... ❤️"
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-gray-200 placeholder-gray-500 focus:border-rose-500/40 focus:ring-1 focus:ring-rose-500/20 outline-none resize-none transition-all duration-300"
                        maxLength="150"
                      />

                      <button
                        id="btn-submit-personal-msg"
                        onClick={() => {
                          if (saranyaMsg.trim()) {
                            setIsMessageSubmitted(true);
                            if (window.playRomanticChime) window.playRomanticChime();
                          }
                        }}
                        disabled={!saranyaMsg.trim()}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-xs hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-1.5 mx-auto shadow-md"
                      >
                        Send <Send size={12} />
                      </button>
                    </motion.div>
                  ) : (
                    /* Display submitted message beautifully */
                    <motion.div
                      key="message-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-3xl bg-gradient-to-br from-[#210c20]/60 to-[#0e0414]/60 border border-rose-500/20 shadow-2xl relative overflow-hidden"
                    >
                      {/* Glow elements */}
                      <div className="absolute -top-10 -left-10 w-20 h-20 bg-rose-500/10 rounded-full filter blur-xl" />
                      
                      <p className="text-[10px] uppercase tracking-widest text-rose-300/80 font-bold font-sans mb-3">
                        Saranya's Response ❤️
                      </p>

                      <p 
                        className="text-base md:text-lg text-rose-100 font-playfair leading-relaxed italic py-2"
                        style={{ fontFamily: "'Mukta Malar', 'Latha', 'Tamil', 'Georgia', serif" }}
                      >
                        "{saranyaMsg}"
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                        <p className="text-xs text-rose-200 font-playfair font-semibold">
                          Saranya ❤️ Abishek
                        </p>
                        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-sans font-medium">
                          Some moments are meant to be remembered.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Settle Down / Replay Options */}
                <div className="pt-6">
                  <button
                    id="btn-celebration-replay"
                    onClick={() => resetJourney('scene3_call')}
                    className="px-6 py-2 rounded-full border border-white/10 text-xs font-semibold text-gray-500 hover:text-white hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw size={12} /> Replay our story
                  </button>
                </div>

              </motion.div>
            )}

            {/* LET ME THINK VIEW */}
            {scene === 'let_me_think' && (
              <motion.div
                key="think"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center space-y-6 max-w-md mx-auto p-8 rounded-3xl glass-card border border-white/5 shadow-2xl"
              >
                {/* Custom split-heart crack simulation */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ rotate: [-2, 2, -2], y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="flex text-rose-400/80"
                  >
                    <motion.div
                      animate={{ x: [0, -7], rotate: [0, -6] }}
                      transition={{ duration: 1.6, ease: 'easeOut', delay: 0.2 }}
                      style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                    >
                      <Heart size={44} fill="currentColor" />
                    </motion.div>
                    <motion.div
                      animate={{ x: [0, 7], rotate: [0, 6] }}
                      transition={{ duration: 1.6, ease: 'easeOut', delay: 0.2 }}
                      style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)', marginLeft: '-44px' }}
                    >
                      <Heart size={44} fill="currentColor" />
                    </motion.div>
                  </motion.div>
                </div>

                <h2 className="text-xl md:text-2xl font-playfair font-medium text-white">
                  That's okay. ❤️
                </h2>
                
                <div className="space-y-4 text-sm md:text-base text-gray-400 leading-relaxed">
                  <p>Take your time.</p>
                  <p>I'll respect whatever you feel.</p>
                </div>

                <div className="flex gap-4 justify-center pt-6 max-w-xs mx-auto">
                  <button
                    id="btn-think-read-again"
                    onClick={() => resetJourney('scene3_call')}
                    className="px-5 py-2.5 rounded-full border border-white/10 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 active:scale-95 flex-1"
                  >
                    Read again
                  </button>
                  <button
                    id="btn-think-close"
                    onClick={() => goToScene('scene1_mystery')}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all duration-300 active:scale-95 flex-1"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Footer copyright, only shown after check screens */}
      {scene !== 'scene1_mystery' && scene !== 'scene2_check' && scene !== 'scene2_stop' && (
        <footer className="text-center py-4 relative z-10 pointer-events-none">
          <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest">
            Created with ❤️ by Abishek for Saranya
          </p>
        </footer>
      )}
    </div>
  );
}
