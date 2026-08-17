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
import StarGame from './components/StarGame';
import Letter3D from './components/Letter3D';
import CelebrationCanvas from './components/CelebrationCanvas';
import EasterEggs from './components/EasterEggs';
import ErrorBoundary from './components/ErrorBoundary';
import HeartBurst from './components/HeartBurst';

function MainApp() {
  const { currentScene, goToScene, storyIntensity, isMobile, isLowEnd } = useScene();

  // Awaken sequence states (Scene 1)
  const [awakenStep, setAwakenStep] = useState(0); // 0: initial, 1: quiets, 2: stars, 3: flowers, 4: fireflies, 5: water, 6: animals, 7: text
  const [isAwakening, setIsAwakening] = useState(false);

  // Qualities sequence states (Scene 7 emotional build)
  const [buildStep, setBuildStep] = useState(0);

  // Confession states (Scene 10)
  const [confessionStep, setConfessionStep] = useState(0); // 0: black screen / heartbeat, 1: Saranya, 2: I LOVE YOU, 3: Will you be mine / buttons
  const [confessionClicked, setConfessionClicked] = useState(false);

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

  // 4. Scene 11a YES Celebration transitions
  const [showCelebrationSkip, setShowCelebrationSkip] = useState(false);
  useEffect(() => {
    if (currentScene === SCENES.YES) {
      setShowCelebrationSkip(false);
      const skipTimer = setTimeout(() => setShowCelebrationSkip(true), 4000);
      const finalTimer = setTimeout(() => goToScene('scene11_final'), 12500);

      return () => {
        clearTimeout(skipTimer);
        clearTimeout(finalTimer);
      };
    }
  }, [currentScene]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!finalMsg.trim()) return;
    setMsgSubmitted(true);
    if (window.playRomanticChime) window.playRomanticChime();
  };

  return (
    <div className={`relative min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-1000 select-none ${
      currentScene === SCENES.SUSPENSE || currentScene === SCENES.CONFESSION ? 'bg-[#030005]' : 'bg-[#05020a]'
    }`}>
      {/* Reusable Canvas Heart Burst System */}
      <ErrorBoundary>
        <HeartBurst />
      </ErrorBoundary>

      {/* Persistent living GardenCanvas */}
      {currentScene !== SCENES.YES && (
        <ErrorBoundary>
          <BackgroundEffects />
        </ErrorBoundary>
      )}

      {/* Persistent YES Celebration Canvas */}
      {currentScene === SCENES.YES && (
        <ErrorBoundary>
          <CelebrationCanvas />
        </ErrorBoundary>
      )}

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
        <div className="w-full max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            
            {/* SCENE 1: Intro opening */}
            {currentScene === SCENES.INTRO && (
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
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-semibold tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/10 pointer-events-auto"
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
                      className="px-6 py-2.5 rounded-full border border-white/10 hover:border-rose-500/30 bg-white/2 hover:bg-rose-500/10 text-rose-300 font-medium text-xs transition-all duration-300 active:scale-95 flex-1"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        if (window.playRomanticChime) window.playRomanticChime();
                        goToScene(SCENES.CALL);
                      }}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex-1"
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
                    className="px-8 py-2 rounded-full border border-white/10 text-white/80 hover:text-white text-xs font-medium flex items-center gap-1.5 mx-auto active:scale-95 transition-all"
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

            {/* SCENE 6: Star Game */}
            {currentScene === SCENES.GAME && (
              <motion.div
                key="scene_game"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <StarGame onComplete={() => goToScene(SCENES.BUILD)} />
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
                      className="px-8 py-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-md pointer-events-auto"
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
                <Letter3D onComplete={() => goToScene(SCENES.SUSPENSE)} />
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
                    className="px-8 py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium hover:scale-105 active:scale-95 transition-all pointer-events-auto"
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
                      <motion.h2
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        className="text-4xl md:text-6xl font-playfair font-black text-rose-100 tracking-wider drop-shadow-lg"
                      >
                        I LOVE YOU.
                      </motion.h2>
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
                      <div className="flex gap-4 justify-center pointer-events-auto max-w-xs mx-auto">
                        <button
                          disabled={confessionClicked}
                          onClick={() => {
                            setConfessionClicked(true);
                            if (window.triggerNoSoundDesign) window.triggerNoSoundDesign();
                            goToScene(SCENES.LET_ME_THINK);
                          }}
                          className={`px-6 py-2.5 rounded-full border border-white/10 text-rose-300 text-xs font-semibold flex-1 transition-all active:scale-95 ${
                            confessionClicked ? 'opacity-40 cursor-not-allowed' : 'hover:border-rose-500/20 bg-white/2 hover:bg-rose-500/5'
                          }`}
                        >
                          LET ME THINK 💔
                        </button>
                        <button
                          disabled={confessionClicked}
                          onClick={() => {
                            setConfessionClicked(true);
                            if (window.triggerYesSoundDesign) window.triggerYesSoundDesign();
                            goToScene(SCENES.YES);
                          }}
                          className={`px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-semibold flex-1 transition-all shadow-md shadow-rose-500/10 ${
                            confessionClicked ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                          }`}
                        >
                          YES ❤️
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SCENE 11a: YES Celebration overlay buttons */}
            {currentScene === SCENES.YES && (
              <motion.div
                key="scene_yes"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center pointer-events-none"
              >
                {showCelebrationSkip && (
                  <div className="pointer-events-auto fixed bottom-6 inset-x-0 flex justify-center">
                    <button
                      onClick={() => goToScene('scene11_final')}
                      className="px-8 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white text-xs font-medium backdrop-blur-md transition-all active:scale-95"
                    >
                      Step Into Our Future →
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* SCENE 11a FINAL: Afterglow resting page */}
            {currentScene === 'scene11_final' && (
              <motion.div
                key="scene_yes_final"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-sm mx-auto p-6 md:p-8 rounded-3xl glass-panel border border-white/5 shadow-2xl relative text-center space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-playfair text-white">
                    Our Quiet Garden
                  </h3>
                  <p className="text-xs text-rose-300">This little place where my heart speaks.</p>
                </div>

                {!msgSubmitted ? (
                  <form onSubmit={handleMessageSubmit} className="space-y-4 pointer-events-auto">
                    <textarea
                      value={finalMsg}
                      onChange={(e) => setFinalMsg(e.target.value)}
                      placeholder="Write a message to Abishek... ❤️"
                      rows="3"
                      className="w-full p-3 rounded-2xl bg-black/30 border border-white/10 text-white text-xs font-sans placeholder-gray-500 focus:outline-none focus:border-rose-500/40 resize-none transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Send size={12} />
                      Send to Abishek
                    </button>
                  </form>
                ) : (
                  <div className="animate-fadeIn p-4 border border-rose-500/10 bg-rose-950/10 rounded-2xl space-y-2">
                    <p className="text-xs font-semibold text-rose-200">Message Saved!</p>
                    <p className="text-[11px] text-gray-400">
                      "I promise to keep choosing you, Saranya, every single day."
                    </p>
                  </div>
                )}
              </motion.div>
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
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-md"
                    >
                      Read it again ❤️
                    </button>
                    <button
                      onClick={() => goToScene(SCENES.NO)}
                      className="px-6 py-2.5 rounded-full border border-white/10 bg-white/2 text-rose-300 text-xs font-medium hover:bg-white/5 transition-all"
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
                    className="px-8 py-2 rounded-full border border-white/10 text-white/80 hover:text-white text-xs font-medium flex items-center gap-1.5 mx-auto active:scale-95 transition-all"
                  >
                    <RefreshCw size={12} />
                    Restart Journey
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
