import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, VolumeX, RotateCcw, ArrowRight, Eye, Check, Compass, Star, Music, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import CinematicRainbowBorder from './CinematicRainbowBorder';
import { useCamera } from '../context/CameraContext';

// ============================================================================
// LEVEL CONFIGURATIONS & ASSET PATHS
// ============================================================================
const LEVEL_CONFIGS = [
  {
    level: 1,
    title: 'The Secret Garden',
    tamilTitle: 'மர்மப் பூந்தோட்டம்',
    bg: '/level1_secret_garden.jpg',
    fragmentName: 'The Spark of Beginning',
    message: 'Ellame oru chinna beginning-la irundhu dhaan start aagum… namma story-um appadithaan. ✨',
  },
  {
    level: 2,
    title: 'The Memory Puzzle',
    tamilTitle: 'நினைவுகளின் புதிர்',
    bg: '/lp.jpg',
    puzzleImage: '/lp.jpg',
    fragmentName: 'The Memory of Us',
    message: 'சில நினைவுகள் புகைப்படங்களில் மட்டுமல்ல… என் இதயத்தின் ஆழத்திலும் எப்போதும் மாறாமல் வாழும். ❤️',
  },
  {
    level: 3,
    title: 'Choose With Your Heart',
    tamilTitle: 'இதயத்தின் தேர்வு',
    bg: '/level3_choices_bridge.jpg',
    fragmentName: 'The True Connection',
    question: 'What makes someone truly special?',
    tamilQuestion: 'ஒருவரை உண்மையாகவே ஸ்பெஷலாக்குவது எது?',
    choices: [
      {
        id: 1,
        text: 'Someone who understands me.',
        tamilText: 'என்னை வார்த்தைகள் இல்லாமலே புரிஞ்சுப்பவர்',
        response: 'உன்னை வார்த்தைகள் இல்லாமலே புரிஞ்சுக்கிற அந்த ஒரு மனம்… அதுதான் உலகத்திலேயே மிக அழகான பொக்கிஷம். ✨',
      },
      {
        id: 2,
        text: 'Someone who makes me laugh.',
        tamilText: 'என்னை எப்போதுமே சிரிக்க வைப்பவர்',
        response: 'உன் முகத்துல வர்ற அந்த ஒற்றை சிரிப்புக்காக எதையும் செய்யத் தோணும்… அதுதான் என் நாளின் மிகப்பெரிய சந்தோஷம். 😊💖',
      },
      {
        id: 3,
        text: 'Someone who stays genuine with me.',
        tamilText: 'என்னிடம் எப்போதும் உண்மையா இருப்பவர்',
        response: 'எந்த ஒரு மாற்றமும் இல்லாம, எப்போவும் உண்மையா உன்கூட இருக்குற அன்பு… அது என்னைக்குமே அழியாது. 🤍✨',
      },
    ],
  },
  {
    level: 4,
    title: 'The Unspoken Words',
    tamilTitle: 'சொல்லப்படாத வார்த்தைகள்',
    bg: '/level4_unspoken_words.jpg',
    fragmentName: 'The Heartfelt Whispers',
    letters: [
      {
        id: 1,
        title: 'Letter #01',
        snippet: 'A small change...',
        text: 'Nee en life-la vandhadhukku apram dhaan, pala chinna vishayangal kooda romba azhagaa maari irukku... 🌸',
        pos: { top: '24%', left: '16%' },
      },
      {
        id: 2,
        title: 'Letter #02',
        snippet: 'Peace in silence...',
        text: 'Eppavume un kitta pesum podhu oru nimmadhi irukku... adha words-la express panna mudiyadhu. ✨',
        pos: { top: '32%', right: '18%' },
      },
      {
        id: 3,
        title: 'Letter #03',
        snippet: 'Everlasting respect...',
        text: 'Un mela irukra care-um respect-um, eppavum kurayaadhu... adhu en heart-la permanent. 💖',
        pos: { bottom: '38%', left: '22%' },
      },
      {
        id: 4,
        title: 'Letter #04',
        snippet: 'My only wish...',
        text: 'Nee eppavum un pola sandhoshama irukkanum... adhudhaan en biggest wish. 🕊️',
        pos: { bottom: '32%', right: '24%' },
      },
    ],
  },
  {
    level: 5,
    title: 'The Final Heart',
    tamilTitle: 'முழுமையான இதயம்',
    bg: '/level5_final_heart.jpg',
    fragmentName: 'The Eternal Bond',
    climaxMessage:
      'Saranya… indha game-la nee en heart-oda pieces-a kandupidicha. Aana nijathula, en manasula nee evlo special-nu oru game-la muzhuvadhum solla mudiyadhu.',
  },
];

export default function RomanticAdventureGame({ onComplete }) {
  const cameraContext = useCamera();
  // Current game state: 'INTRO' | 1 | 2 | 3 | 4 | 5
  const [currentLevel, setCurrentLevel] = useState('INTRO');
  // Collected heart fragment indices: [1, 2, 3, 4, 5]
  const [collectedFragments, setCollectedFragments] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // LEVEL 1 STATES
  const [isL1Collected, setIsL1Collected] = useState(false);

  // LEVEL 2 PUZZLE STATES (3x3 grid)
  const initialPuzzlePieces = [3, 7, 0, 8, 1, 5, 2, 6, 4];
  const [puzzlePieces, setPuzzlePieces] = useState(initialPuzzlePieces);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [showPuzzleHint, setShowPuzzleHint] = useState(false);

  // LEVEL 3 CHOICES STATES
  const [selectedChoice, setSelectedChoice] = useState(null);

  // LEVEL 4 LETTERS STATES
  const [readLetters, setReadLetters] = useState([]);
  const [activeLetterModal, setActiveLetterModal] = useState(null);

  // LEVEL 5 CLIMAX STATES
  const [isHeartAssembled, setIsHeartAssembled] = useState(false);

  // --------------------------------------------------------------------------
  // AUDIO ENGINE: NS.MP3 MANAGEMENT
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Start ns.mp3 when game begins, loop smoothly across all 5 levels
    const audio = new Audio('/ns.mp3');
    audio.loop = true;
    audio.volume = 0.52;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log('Autoplay deferred until user interaction:', err);
      });
    }

    const handleFirstUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('touchstart', handleFirstUserInteraction);

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      // Clean up audio resources immediately when game unmounts or ends
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
        } catch (e) {}
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  };

  // Play gentle melodic Web Audio chime when a fragment is unlocked
  const playFragmentChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.6);
      });
      setTimeout(() => ctx.close().catch(() => {}), 1500);
    } catch {}
  }, []);

  // --------------------------------------------------------------------------
  // LEVEL 1: COLLECT FRAGMENT 1
  // --------------------------------------------------------------------------
  const handleCollectLevel1 = () => {
    if (isL1Collected) return;
    setIsL1Collected(true);
    setCollectedFragments((prev) => (prev.includes(1) ? prev : [...prev, 1]));
    playFragmentChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#f43f5e', '#ec4899', '#ffffff'],
    });
  };

  // --------------------------------------------------------------------------
  // LEVEL 2: JIGSAW PUZZLE ENGINE (3x3 for lp.jpg)
  // --------------------------------------------------------------------------
  const handleTileClick = (clickedSlotIndex) => {
    if (isPuzzleSolved) return;

    if (selectedPieceIndex === null) {
      setSelectedPieceIndex(clickedSlotIndex);
    } else {
      // Swap tiles at selectedPieceIndex and clickedSlotIndex
      const newPieces = [...puzzlePieces];
      const temp = newPieces[selectedPieceIndex];
      newPieces[selectedPieceIndex] = newPieces[clickedSlotIndex];
      newPieces[clickedSlotIndex] = temp;

      setPuzzlePieces(newPieces);
      setSelectedPieceIndex(null);

      // Verify if solved: every piece must equal its slot index
      const solved = newPieces.every((pieceId, idx) => pieceId === idx);
      if (solved) {
        setIsPuzzleSolved(true);
        setCollectedFragments((prev) => (prev.includes(2) ? prev : [...prev, 2]));
        playFragmentChime();
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.55 },
          colors: ['#ffd700', '#f43f5e', '#a855f7', '#ffffff'],
        });
      }
    }
  };

  const handleShufflePuzzle = () => {
    setSelectedPieceIndex(null);
    setIsPuzzleSolved(false);
    // Deterministic pleasant shuffle guaranteed not already solved
    setPuzzlePieces([4, 2, 7, 0, 5, 8, 6, 1, 3]);
  };

  // --------------------------------------------------------------------------
  // LEVEL 3: CHOOSE WITH YOUR HEART
  // --------------------------------------------------------------------------
  const handleSelectChoice = (choice) => {
    setSelectedChoice(choice);
    setCollectedFragments((prev) => (prev.includes(3) ? prev : [...prev, 3]));
    playFragmentChime();
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#ffd700', '#c084fc'],
    });
  };

  // --------------------------------------------------------------------------
  // LEVEL 4: THE UNSPOKEN WORDS
  // --------------------------------------------------------------------------
  const handleOpenLetter = (letter) => {
    setActiveLetterModal(letter);
    if (!readLetters.includes(letter.id)) {
      const updated = [...readLetters, letter.id];
      setReadLetters(updated);
      if (updated.length === 4) {
        setCollectedFragments((prev) => (prev.includes(4) ? prev : [...prev, 4]));
        playFragmentChime();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#ffd700', '#ffffff'],
        });
      }
    }
  };

  // --------------------------------------------------------------------------
  // LEVEL 5: THE FINAL HEART (CLIMAX)
  // --------------------------------------------------------------------------
  const handleUniteFragments = () => {
    setIsHeartAssembled(true);
    setCollectedFragments([1, 2, 3, 4, 5]);
    playFragmentChime();
    confetti({
      particleCount: 130,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#f43f5e', '#ec4899', '#c084fc', '#ffffff'],
    });
  };

  const handleReplayGame = () => {
    setCurrentLevel(1);
    setCollectedFragments([]);
    setIsL1Collected(false);
    setPuzzlePieces([3, 7, 0, 8, 1, 5, 2, 6, 4]);
    setSelectedPieceIndex(null);
    setIsPuzzleSolved(false);
    setSelectedChoice(null);
    setReadLetters([]);
    setIsHeartAssembled(false);
  };

  const handleFinishAdventure = () => {
    // Stop audio immediately before moving to next scene
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
      } catch (e) {}
      audioRef.current = null;
    }
    // Milestone detection alert (rate-limited and respects user settings)
    if (cameraContext?.triggerAlert) {
      cameraContext.triggerAlert('Love Adventure Completed', { scene: 'Level 5 Climax' });
    }
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#05010a] text-white select-none overflow-hidden z-40 font-sans flex flex-col items-center justify-between">
      {/* 1. CINEMATIC RAINBOW BORDER ACROSS SCREEN */}
      <CinematicRainbowBorder mode="screen" />

      {/* 2. DYNAMIC BACKGROUND IMAGE LAYER */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentLevel === 'INTRO' ? (
            <motion.div
              key="intro-bg"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: "url('/level1_secret_garden.jpg'), url('/level1_secret_garden.jpg.png')",
                filter: 'brightness(0.4) saturate(1.2) blur(3px)',
              }}
            />
          ) : (
            <motion.div
              key={`bg-${currentLevel}`}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1.01 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('${LEVEL_CONFIGS[currentLevel - 1]?.bg}'), url('${LEVEL_CONFIGS[currentLevel - 1]?.bg}.png')`,
                backgroundPosition: 'center center',
              }}
            />
          )}
        </AnimatePresence>

        {/* Ambient Vignette & Romantic Midnight Atmospheric Fog */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06020c]/90 via-black/35 to-[#06020c]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#080214]/40 to-[#020006]/85 pointer-events-none" />
      </div>

      {/* 3. FLOATING FIREFLIES CANVAS OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[
          { top: '15%', left: '12%', size: '3px', delay: '0s' },
          { top: '22%', left: '85%', size: '2px', delay: '1.2s' },
          { top: '45%', left: '8%', size: '3px', delay: '2.5s' },
          { top: '65%', left: '92%', size: '2px', delay: '0.8s' },
          { top: '78%', left: '20%', size: '2.5px', delay: '1.8s' },
          { top: '88%', left: '76%', size: '3px', delay: '2.1s' },
        ].map((f, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300/60 blur-[0.5px] animate-pulse"
            style={{
              top: f.top,
              left: f.left,
              width: f.size,
              height: f.size,
              animationDuration: '3.5s',
              animationDelay: f.delay,
            }}
          />
        ))}
      </div>

      {/* 4. TOP HUD BAR: TITLE, PROGRESS INDICATOR, AND AUDIO TOGGLE */}
      <header className="relative z-30 w-full max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <Heart className="w-4 h-4 fill-rose-400" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-serif font-bold text-white tracking-wider">
              {currentLevel === 'INTRO'
                ? 'THE FIVE PIECES OF MY HEART'
                : `CHAPTER ${currentLevel}: ${LEVEL_CONFIGS[currentLevel - 1]?.title}`}
            </h1>
            <p className="text-[10px] sm:text-xs text-rose-300/80 font-mono">
              {currentLevel === 'INTRO'
                ? 'For Saranya · Romantic Adventure'
                : LEVEL_CONFIGS[currentLevel - 1]?.tamilTitle}
            </p>
          </div>
        </div>

        {/* 5 HEART FRAGMENTS PROGRESS TRACKER */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
            {[1, 2, 3, 4, 5].map((fragNum) => {
              const isCollected = collectedFragments.includes(fragNum);
              return (
                <div
                  key={fragNum}
                  title={`Fragment ${fragNum} of 5`}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all duration-500 ${
                    isCollected
                      ? 'bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.8)] scale-105'
                      : 'bg-white/10 text-white/40 border border-white/10'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${isCollected ? 'fill-white' : ''}`} />
                </div>
              );
            })}
          </div>

          {/* AUDIO MUTE TOGGLE */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/60 hover:bg-rose-950/70 backdrop-blur-md border border-rose-400/30 text-rose-200 hover:text-white transition active:scale-95 cursor-pointer shadow-lg"
            title={isMuted ? 'Unmute Romantic Music' : 'Mute Music'}
            aria-label="Toggle Adventure Music"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </header>

      {/* 5. MAIN LEVEL CONTENT AREA */}
      <main className="relative z-30 flex-1 w-full max-w-4xl px-4 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {/* -------------------------------------------------------------- */}
          {/* INTRODUCTION SCENE */}
          {/* -------------------------------------------------------------- */}
          {currentLevel === 'INTRO' && (
            <motion.div
              key="intro-card"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -20 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-[2.5rem] bg-[#140520]/80 backdrop-blur-2xl border border-rose-400/30 shadow-[0_0_60px_rgba(244,63,94,0.35)] space-y-6"
            >
              {/* Floating Golden Butterfly Animation */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 4, -4, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-0.5 shadow-[0_0_30px_rgba(244,63,94,0.6)] flex items-center justify-center text-2xl"
              >
                <div className="w-full h-full rounded-full bg-[#10031a] flex items-center justify-center">
                  🦋
                </div>
              </motion.div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-300 font-semibold">
                  A Romantic Cinematic Odyssey
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  THE FIVE PIECES OF MY HEART
                </h2>
                <p className="text-sm sm:text-base font-serif italic text-pink-200/90 leading-relaxed">
                  “A little adventure, made just for you, Saranya.”
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-rose-400/20 text-xs sm:text-sm text-slate-200 space-y-1.5 leading-relaxed font-sans text-left">
                <p className="flex items-center gap-2 text-rose-200 font-medium">
                  <Sparkles size={14} className="text-amber-300" />
                  <span>5 நிலைகள் கொண்ட ஒரு காதல் பயணம்.</span>
                </p>
                <p className="flex items-center gap-2 text-slate-300">
                  <Heart size={14} className="text-rose-400" />
                  <span>ஒவ்வொரு நிலையிலும் என் இதயத்தின் ஒரு துண்டு மறைந்திருக்கிறது.</span>
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (audioRef.current && audioRef.current.paused) {
                    audioRef.current.play().catch(() => {});
                  }
                  setCurrentLevel(1);
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-base sm:text-lg shadow-[0_0_35px_rgba(244,63,94,0.6)] border border-rose-400/40 flex items-center justify-center gap-3 transition cursor-pointer"
              >
                <Heart size={18} className="fill-white" />
                <span>Begin Our Story ✨</span>
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* LEVEL 1: THE SECRET GARDEN */}
          {/* -------------------------------------------------------------- */}
          {currentLevel === 1 && (
            <motion.div
              key="level-1"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-lg flex flex-col items-center space-y-5"
            >
              {!isL1Collected ? (
                <div className="w-full p-6 sm:p-8 rounded-[2.5rem] bg-[#140520]/80 backdrop-blur-2xl border border-rose-400/30 shadow-[0_0_60px_rgba(244,63,94,0.35)] space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                      Fragment 1 of 5
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      The Secret Garden 🌸
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Follow the golden butterfly trail and find the glowing heart fragment.
                    </p>
                  </div>

                  {/* INTERACTIVE BUTTERFLY TRAIL & COLLECTIBLE ARTIFACT */}
                  <div className="relative w-full h-44 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                    <motion.div
                      animate={{
                        x: [-60, 40, -20, 60],
                        y: [-25, 20, -35, 10],
                        rotate: [0, 10, -8, 0],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute text-2xl text-amber-300 pointer-events-none drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                    >
                      🦋✨
                    </motion.div>

                    {/* Glowing Heart Collectible Button */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCollectLevel1}
                      className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-1 flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.8)] cursor-pointer group"
                    >
                      <div className="w-full h-full rounded-full bg-[#180424] flex flex-col items-center justify-center group-hover:bg-[#250638] transition-colors">
                        <Heart className="w-8 h-8 text-rose-400 fill-rose-500 animate-pulse group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-mono text-amber-300 mt-0.5 uppercase tracking-wider">
                          Tap Me
                        </span>
                      </div>
                    </motion.button>
                  </div>

                  <p className="text-xs text-rose-300/80 italic font-serif">
                    “மாய வனத்தின் தொடக்கத்தில் முதல் வெளிச்சம் பிறக்கிறது…”
                  </p>
                </div>
              ) : (
                /* REVEAL CARD AFTER COLLECTION */
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full p-6 sm:p-8 rounded-[2.5rem] bg-[#140520]/85 backdrop-blur-2xl border border-rose-400/40 shadow-[0_0_60px_rgba(244,63,94,0.45)] space-y-5"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.7)]">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                      Fragment 1 of 5 Unlocked ✨
                    </span>
                    <p className="text-base sm:text-lg font-serif text-white font-medium leading-relaxed">
                      “{LEVEL_CONFIGS[0].message}”
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentLevel(2)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Proceed to Chapter 2 →</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* LEVEL 2: THE MEMORY PUZZLE (REAL PHOTO: LP.JPG) */}
          {/* -------------------------------------------------------------- */}
          {currentLevel === 2 && (
            <motion.div
              key="level-2"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-md flex flex-col items-center space-y-4"
            >
              <div className="w-full p-5 sm:p-7 rounded-[2.5rem] bg-[#140520]/85 backdrop-blur-2xl border border-rose-400/30 shadow-[0_0_60px_rgba(244,63,94,0.35)] space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                    Fragment 2 of 5 · Real Photo Puzzle
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    The Memory Puzzle 🧩
                  </h3>
                  <p className="text-xs text-slate-300">
                    {isPuzzleSolved
                      ? 'Memory Complete! All 9 pieces perfectly united.'
                      : 'Tap two pieces to swap them until the photograph is complete.'}
                  </p>
                </div>

                {/* 3x3 JIGSAW PUZZLE GRID (4:5 Aspect Ratio matching lp.jpg) */}
                <div
                  className={`relative mx-auto rounded-2xl overflow-hidden border-2 transition-all duration-700 ${
                    isPuzzleSolved
                      ? 'border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.6)]'
                      : 'border-rose-400/40 shadow-inner'
                  }`}
                  style={{
                    width: 'min(300px, 78vw)',
                    height: 'min(375px, 97.5vw)',
                  }}
                >
                  {/* If solved, show full original photo without grid borders */}
                  {isPuzzleSolved ? (
                    <motion.img
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      src="/lp.jpg"
                      alt="Abishek"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    /* The 3x3 interactive tile swap grid */
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-[2px] bg-slate-950 p-[2px]">
                      {puzzlePieces.map((pieceId, slotIndex) => {
                        const isSelected = selectedPieceIndex === slotIndex;
                        const isCorrect = pieceId === slotIndex;
                        const row = Math.floor(pieceId / 3);
                        const col = pieceId % 3;

                        return (
                          <motion.button
                            key={slotIndex}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleTileClick(slotIndex)}
                            className={`relative w-full h-full overflow-hidden transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-amber-300 z-20 scale-105 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                                : isCorrect
                                ? 'border border-emerald-400/40'
                                : 'border border-white/20'
                            }`}
                            style={{
                              backgroundImage: "url('/lp.jpg')",
                              backgroundSize: '300% 300%',
                              backgroundPosition: `${col * 50}% ${row * 50}%`,
                            }}
                          >
                            {/* Subtle correct-slot indicator */}
                            {isCorrect && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500/80 flex items-center justify-center text-white">
                                <Check size={9} strokeWidth={3} />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Optional translucent ghost peek preview if requested */}
                  {showPuzzleHint && !isPuzzleSolved && (
                    <div className="absolute inset-0 pointer-events-none bg-black/30 backdrop-blur-xs flex items-center justify-center">
                      <img
                        src="/lp.jpg"
                        alt="Hint Preview"
                        className="w-full h-full object-cover opacity-35"
                      />
                    </div>
                  )}
                </div>

                {/* PUZZLE UTILITY CONTROLS */}
                {!isPuzzleSolved ? (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPuzzleHint(!showPuzzleHint)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-pink-200 text-xs transition cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>{showPuzzleHint ? 'Hide Photo' : 'Peek Photo'}</span>
                    </button>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {puzzlePieces.filter((p, i) => p === i).length} / 9 In Place
                    </span>
                    <button
                      type="button"
                      onClick={handleShufflePuzzle}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-pink-200 text-xs transition cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                  </div>
                ) : (
                  /* WHEN PUZZLE IS COMPLETED */
                  <div className="space-y-3 pt-2">
                    <p className="text-xs sm:text-sm font-serif text-pink-100 italic leading-relaxed">
                      “{LEVEL_CONFIGS[1].message}”
                    </p>
                    <button
                      onClick={() => setCurrentLevel(3)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <span>Proceed to Chapter 3 →</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* LEVEL 3: CHOOSE WITH YOUR HEART */}
          {/* -------------------------------------------------------------- */}
          {currentLevel === 3 && (
            <motion.div
              key="level-3"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-lg flex flex-col items-center space-y-5"
            >
              <div className="w-full p-6 sm:p-8 rounded-[2.5rem] bg-[#140520]/85 backdrop-blur-2xl border border-rose-400/30 shadow-[0_0_60px_rgba(244,63,94,0.35)] space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                    Fragment 3 of 5 · Moonlit Bridge
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {LEVEL_CONFIGS[2].question}
                  </h3>
                  <p className="text-xs text-rose-300/80 font-serif">
                    {LEVEL_CONFIGS[2].tamilQuestion}
                  </p>
                </div>

                {/* THE 3 GLOWING CARDS */}
                <div className="space-y-3 pt-1">
                  {LEVEL_CONFIGS[2].choices.map((choice) => {
                    const isSelected = selectedChoice?.id === choice.id;
                    return (
                      <motion.button
                        key={choice.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectChoice(choice)}
                        className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500/25 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)]'
                            : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/15'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm sm:text-base font-serif font-medium text-white">
                            {choice.text}
                          </p>
                          <p className="text-xs text-pink-300/80 font-sans">
                            {choice.tamilText}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-amber-400 border-amber-300 text-black'
                              : 'border-white/20'
                          }`}
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* SELECTED RESPONSE & PROCEED BUTTON */}
                {selectedChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white/[0.06] border border-rose-400/25 space-y-3 pt-3"
                  >
                    <p className="text-xs sm:text-sm font-serif text-amber-200 italic leading-relaxed">
                      “{selectedChoice.response}”
                    </p>
                    <button
                      onClick={() => setCurrentLevel(4)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <span>Proceed to Chapter 4 →</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* LEVEL 4: THE UNSPOKEN WORDS */}
          {/* -------------------------------------------------------------- */}
          {currentLevel === 4 && (
            <motion.div
              key="level-4"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-lg flex flex-col items-center space-y-4"
            >
              <div className="w-full p-6 sm:p-8 rounded-[2.5rem] bg-[#140520]/85 backdrop-blur-2xl border border-rose-400/30 shadow-[0_0_60px_rgba(244,63,94,0.35)] space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                    Fragment 4 of 5 · Enchanted Forest
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    The Unspoken Words 💌
                  </h3>
                  <p className="text-xs text-slate-300">
                    Tap the floating glowing letters scattered throughout the forest ({readLetters.length} / 4 opened).
                  </p>
                </div>

                {/* SCATTERED GLOWING FLOATING LETTERS */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {LEVEL_CONFIGS[3].letters.map((letter) => {
                    const isRead = readLetters.includes(letter.id);
                    return (
                      <motion.button
                        key={letter.id}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleOpenLetter(letter)}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all cursor-pointer ${
                          isRead
                            ? 'bg-rose-500/20 border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                            : 'bg-white/[0.06] border-white/20 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">✉️</span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                            {isRead ? 'Read ✓' : 'Unopened'}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white font-serif">
                            {letter.title}
                          </p>
                          <p className="text-[11px] text-pink-200/80 truncate">
                            {letter.snippet}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* WHEN ALL 4 LETTERS HAVE BEEN OPENED */}
                {readLetters.length === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2 space-y-2"
                  >
                    <p className="text-xs text-amber-200 font-serif italic">
                      “அனைத்து சொல்லப்படாத வார்த்தைகளும் உன் அன்பால் ஒளிர்கின்றன…”
                    </p>
                    <button
                      onClick={() => setCurrentLevel(5)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <span>Proceed to Final Chapter 5 →</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* LEVEL 5: THE FINAL HEART (CLIMAX) */}
          {/* -------------------------------------------------------------- */}
          {currentLevel === 5 && (
            <motion.div
              key="level-5"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-lg flex flex-col items-center space-y-5"
            >
              {!isHeartAssembled ? (
                <div className="w-full p-6 sm:p-8 rounded-[2.5rem] bg-[#140520]/85 backdrop-blur-2xl border border-rose-400/30 shadow-[0_0_60px_rgba(244,63,94,0.45)] space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                      The Grand Climax · Chapter 5
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      The Final Heart 💖
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      All five fragments are ready to be united in the sacred altar.
                    </p>
                  </div>

                  {/* 5 FLOATING FRAGMENTS ORBITING */}
                  <div className="relative w-full h-44 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                    {[
                      { icon: '✨', label: 'Beginning', deg: 0 },
                      { icon: '🧩', label: 'Memory', deg: 72 },
                      { icon: '🌉', label: 'Choice', deg: 144 },
                      { icon: '💌', label: 'Whispers', deg: 216 },
                      { icon: '💖', label: 'Eternal', deg: 288 },
                    ].map((frag, idx) => {
                      const rad = (frag.deg * Math.PI) / 180;
                      const x = Math.cos(rad) * 65;
                      const y = Math.sin(rad) * 45;
                      return (
                        <motion.div
                          key={idx}
                          animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.8, 1, 0.8],
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: idx * 0.4 }}
                          className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(244,63,94,0.7)]"
                          style={{
                            transform: `translate(${x}px, ${y}px)`,
                          }}
                        >
                          {frag.icon}
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleUniteFragments}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-base sm:text-lg shadow-[0_0_40px_rgba(244,63,94,0.7)] border border-rose-300/50 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Heart size={20} className="fill-white animate-pulse" />
                    <span>Touch To Unite The Fragments ❤️</span>
                  </motion.button>
                </div>
              ) : (
                /* CLIMAX COMPLETE: 100% UNLOCKED */
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full p-6 sm:p-8 rounded-[2.5rem] bg-[#140520]/90 backdrop-blur-3xl border border-amber-400/60 shadow-[0_0_80px_rgba(251,191,36,0.45)] space-y-5"
                >
                  {/* Glowing United 3D Crystal Heart */}
                  <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-1 flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.9)]">
                    <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-300 font-bold flex items-center justify-center gap-1.5">
                      <Sparkles size={14} /> 100% COMPLETED · ALL 5 FRAGMENTS UNITED
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide">
                      YOU UNLOCKED MY HEART ❤️
                    </h3>
                  </div>

                  {/* Sincere original Climax Tamil text */}
                  <div className="p-4 rounded-2xl bg-white/[0.06] border border-rose-400/30 text-xs sm:text-sm font-serif text-slate-100 leading-relaxed space-y-2">
                    <p className="text-amber-200 italic font-medium">
                      “{LEVEL_CONFIGS[4].climaxMessage}”
                    </p>
                    <p className="text-[11px] text-pink-300 font-sans">
                      உன் அன்பினால் மட்டுமே முழுமையடையும் என் இதயம். ✨
                    </p>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleReplayGame}
                      className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={14} />
                      <span>Replay Adventure</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishAdventure}
                      className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_30px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <span>Continue Our Journey ❤️</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 6. BOTTOM STATUS BAR */}
      <footer className="relative z-30 w-full max-w-4xl px-4 py-3 flex items-center justify-between text-[11px] text-rose-300/60 font-mono">
        <span>The Eternal Romantic Garden · Chapter {currentLevel === 'INTRO' ? '0' : currentLevel}</span>
        <span>Soundtrack: ns.mp3 · Synchronized</span>
      </footer>

      {/* 7. LETTER MODAL POPUP FOR LEVEL 4 */}
      <AnimatePresence>
        {activeLetterModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setActiveLetterModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full p-6 sm:p-7 rounded-3xl bg-[#180526]/95 border border-rose-400/40 shadow-[0_0_50px_rgba(244,63,94,0.4)] text-center space-y-4"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-xl">
                💌
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                  {activeLetterModal.title}
                </span>
                <p className="text-sm sm:text-base font-serif text-white font-medium leading-relaxed">
                  “{activeLetterModal.text}”
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLetterModal(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-semibold text-xs transition cursor-pointer"
              >
                Close Letter ✨
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
