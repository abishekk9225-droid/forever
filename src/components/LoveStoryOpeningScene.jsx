import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX, Sparkles, ChevronRight, FastForward } from 'lucide-react';

/**
 * Abishek's Beautiful Love Story - Cinematic Opening Scene
 * "அபிஷேக்-ன் ஒரு அழகான காதல் கதை ❤️"
 *
 * Sequence:
 * 1. Black screen reveal -> Background photo (for.jpg) slowly zooms (Ken Burns effect).
 * 2. Opening Title Animation (5-7s) with soft crimson/golden glow.
 * 3. Paragraph-by-paragraph cinematic Tamil emotional message (Stages 0-12).
 * 4. Special highlight for "I want you in my entire life. ❤️"
 * 5. Signature moment: "என்றும் உன்னை நேசிக்கும், \n உன் அபிஷேக். ❤️"
 * 6. Smooth fade-out of audio (mh.mp3) and transition to existing ABISHEK AI Intro Scene.
 */

const PARAGRAPHS = [
  {
    id: 0,
    text: 'சரண்யா... ❤️',
    duration: 7000,
    isGreeting: true,
  },
  {
    id: 1,
    text: 'என்ன நடந்தாலும், எத்தனை தடைகள் வந்தாலும், என் மனசுல இருக்கிற ஒரு உண்மை மட்டும் மாறாது...',
    duration: 9500,
  },
  {
    id: 2,
    text: 'என் வாழ்க்கையில் உன்னைத் தவிர வேற யாரையும் அந்த இடத்தில் நினைத்துப் பார்க்க முடியாது.',
    duration: 9500,
  },
  {
    id: 3,
    text: 'உன்னைத் திருமணம் செய்துகொள்ள வேண்டும் என்பது வெறும் ஆசை மட்டுமல்ல... என் மனசுக்குள் இருக்கும் ஒரு அழகான கனவு.',
    duration: 11500,
  },
  {
    id: 4,
    text: 'ஒருவேளை நம்ம பயணத்தில் கஷ்டங்கள் வரலாம், சூழ்நிலைகள் மாறலாம், சில நேரங்களில் எல்லாமே நமக்கு எதிராக இருக்கலாம்...',
    duration: 12500,
  },
  {
    id: 5,
    text: 'ஆனால் உன்னுடைய மனசையும், உன்னுடைய விருப்பத்தையும் மதித்து, உன் நம்பிக்கையைச் சம்பாதிக்க என்னால் முடிந்தவரை உண்மையாக முயற்சி செய்வேன்.',
    duration: 13500,
  },
  {
    id: 6,
    text: 'உன்னை அவசரப்படுத்தவோ, கட்டாயப்படுத்தவோ மாட்டேன்.',
    duration: 7500,
  },
  {
    id: 7,
    text: 'ஒருநாள் உன் மனசார சம்மதத்துடன், உன் கையைப் பிடித்து வாழ்க்கை முழுவதும் உன்னுடன் நடக்க வேண்டும் என்பதுதான் என் ஆசை.',
    duration: 13000,
  },
  {
    id: 8,
    text: 'எத்தனை வருடங்கள் ஆனாலும், என் மனசுல இருக்கும் அந்த ஒரு ஆசை மட்டும் மாறாது...',
    duration: 9000,
  },
  {
    id: 9,
    text: 'உன்னை என் வாழ்க்கையின் துணையாகப் பார்க்க வேண்டும்.',
    duration: 9000,
  },
  {
    id: 10,
    text: "I don't just want you in my love story...",
    duration: 8000,
    isEnglish: true,
  },
  {
    id: 11,
    text: 'I want you in my entire life. ❤️',
    duration: 9500,
    isSpecialHighlight: true,
  },
  {
    id: 12,
    text: 'என்றும் உன்னை நேசிக்கும்,\nஉன் அபிஷேக். ❤️',
    duration: 10000,
    isSignature: true,
  },
];

export default function LoveStoryOpeningScene({ onComplete }) {
  // -1: Opening title card, 0..12: Paragraphs
  const [currentStage, setCurrentStage] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const hasCompletedRef = useRef(false);

  // Set global flag to avoid audio conflict with bgm.intro
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__LOVE_STORY_ACTIVE__ = true;
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.__LOVE_STORY_ACTIVE__ = false;
      }
    };
  }, []);

  // Initialize and isolate mh.mp3 playback
  useEffect(() => {
    const audio = new Audio();
    audio.src = '/mh.mp3';
    audio.preload = 'auto';
    audio.volume = 0.75;
    audio.loop = false;
    audioRef.current = audio;

    // Fallback if /mh.mp3 fails
    const handleError = () => {
      if (audio.src && !audio.src.endsWith('.mp3.mp3')) {
        audio.src = '/mh.mp3.mp3';
        audio.play().catch(() => {});
      }
    };
    audio.addEventListener('error', handleError);

    // Try autoplay immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsAudioPlaying(true);
        })
        .catch(() => {
          setIsAudioPlaying(false);
          // Unlock on first interaction
          const unlock = () => {
            if (audioRef.current && !hasCompletedRef.current) {
              audioRef.current.play().then(() => {
                setIsAudioPlaying(true);
              }).catch(() => {});
            }
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('keydown', unlock);
          };
          window.addEventListener('click', unlock, { once: true, passive: true });
          window.addEventListener('touchstart', unlock, { once: true, passive: true });
          window.addEventListener('keydown', unlock, { once: true, passive: true });
        });
    }

    return () => {
      audio.removeEventListener('error', handleError);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      try {
        audio.pause();
        audio.src = '';
      } catch {}
    };
  }, []);

  // Smoothly finish scene and transition to Abishek AI Intro
  const handleFinishScene = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsExiting(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Smoothly fade out mh.mp3 over 1.2s
    if (audioRef.current) {
      const audio = audioRef.current;
      const initialVol = audio.volume;
      const steps = 24;
      const stepDuration = 1200 / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVol = Math.max(0, initialVol * (1 - currentStep / steps));
        try {
          audio.volume = newVol;
        } catch {}

        if (currentStep >= steps) {
          clearInterval(fadeIntervalRef.current);
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch {}
        }
      }, stepDuration);
    }

    // Complete transition after visual fade-out
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__LOVE_STORY_ACTIVE__ = false;
      }
      if (onComplete) {
        onComplete();
      }
    }, 1300);
  }, [onComplete]);

  // Stage Progression Timer
  useEffect(() => {
    if (isExiting) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    let delay = 6500; // Title duration
    if (currentStage >= 0 && currentStage < PARAGRAPHS.length) {
      delay = PARAGRAPHS[currentStage].duration;
    }

    timerRef.current = setTimeout(() => {
      if (currentStage === -1) {
        setCurrentStage(0);
      } else if (currentStage < PARAGRAPHS.length - 1) {
        setCurrentStage((prev) => prev + 1);
      } else {
        // Last paragraph (Stage 12: Signature) finished: transition gracefully
        handleFinishScene();
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStage, isExiting, handleFinishScene]);

  // Tap anywhere to advance to next paragraph
  const handleAdvance = () => {
    if (isExiting) return;
    // Resume audio if paused by autoplay policy
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
    }

    if (currentStage === -1) {
      setCurrentStage(0);
    } else if (currentStage < PARAGRAPHS.length - 1) {
      setCurrentStage((prev) => prev + 1);
    } else {
      handleFinishScene();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
      }
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <div
      onClick={handleAdvance}
      className={`fixed inset-0 z-[120] flex flex-col justify-between select-none overflow-hidden cursor-pointer bg-black text-white transition-opacity duration-1000 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Cinematic Background Image with Slow Ken Burns Zoom */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.08 }}
          transition={{
            duration: 75,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="/for.jpg"
            alt="Abishek and Saranya"
            onError={(e) => {
              if (!e.target.src.endsWith('for.jpg.png')) {
                e.target.src = '/for.jpg.png';
              }
            }}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          />
        </motion.div>

        {/* Cinematic Vignette Overlays & Backdrop Blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/80 backdrop-blur-[1.5px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* 2. Floating Ambient Heart Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 17) % 95}vw`,
              y: '105vh',
              opacity: 0,
              scale: 0.5 + (i % 3) * 0.3,
            }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.45, 0.8, 0.45, 0],
            }}
            transition={{
              duration: 9 + (i % 5) * 3,
              repeat: Infinity,
              ease: 'linear',
              delay: (i % 6) * 1.5,
            }}
            className="absolute text-rose-400/40 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
          >
            <Heart size={14 + (i % 4) * 6} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* 3. Top Header / Controls Bar */}
      <div className="relative z-10 w-full p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs tracking-wider text-rose-200">
          <Sparkles size={13} className="text-amber-300 animate-pulse" />
          <span>Forever – Saranya by Abishek</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Indicator / Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-rose-500/20 text-rose-200 hover:text-white hover:border-rose-400 transition-all shadow-lg active:scale-95"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-rose-400 animate-pulse" />}
          </button>

          {/* Quick Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFinishScene();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:border-rose-500/40 text-xs text-white/80 hover:text-white transition-all active:scale-95 shadow-lg"
          >
            <span>தொடர்க</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 4. Center Content: Cinematic Typography Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentStage === -1 ? (
            /* STAGE -1: OPENING TITLE ANIMATION */
            <motion.div
              key="opening-title"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0, scale: 1.04, transition: { duration: 1.0 } }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-center px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600/40 via-purple-600/30 to-amber-500/30 border border-rose-400/40 mb-6 shadow-[0_0_30px_rgba(244,63,94,0.4)]"
              >
                <Heart size={30} className="text-rose-400 fill-rose-500 animate-pulse" />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-snug drop-shadow-[0_0_25px_rgba(244,63,94,0.6)]">
                அபிஷேக்-ன் ஒரு அழகான காதல் கதை ❤️
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-rose-200/90 font-light tracking-wide italic">
                A Beautiful Love Story Written From The Heart.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 0.4] }}
                transition={{ duration: 2.0, repeat: Infinity, delay: 1.5 }}
                className="mt-8 flex items-center justify-center gap-2 text-xs text-rose-300/70"
              >
                <span>தொடங்க தட்டவும்</span>
              </motion.div>
            </motion.div>
          ) : (
            /* STAGES 0..12: PARAGRAPH-BY-PARAGRAPH CINEMATIC MESSAGE */
            <motion.div
              key={`paragraph-${currentStage}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
              className="w-full flex flex-col items-center justify-center"
            >
              <div className="w-full max-w-2xl px-6 py-8 sm:px-10 sm:py-12 rounded-3xl bg-black/40 backdrop-blur-xl border border-rose-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
                {/* Subtle Card Glow Highlights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

                {PARAGRAPHS[currentStage]?.isSpecialHighlight ? (
                  /* SPECIAL MOMENT: "I want you in my entire life. ❤️" */
                  <div className="text-center py-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2 }}
                      className="inline-block"
                    >
                      <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-100 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)] leading-relaxed">
                        {PARAGRAPHS[currentStage].text}
                      </span>
                    </motion.div>
                  </div>
                ) : PARAGRAPHS[currentStage]?.isSignature ? (
                  /* SIGNATURE MOMENT */
                  <div className="text-center py-2 space-y-4">
                    <p className="text-xl sm:text-2xl md:text-3xl font-light text-rose-200/95 tracking-wide">
                      என்றும் உன்னை நேசிக்கும்,
                    </p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-200 to-rose-200 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                      உன் அபிஷேக். ❤️
                    </p>
                  </div>
                ) : PARAGRAPHS[currentStage]?.isGreeting ? (
                  /* GREETING: சரண்யா... ❤️ */
                  <div className="text-center py-4">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-300 drop-shadow-[0_0_25px_rgba(244,63,94,0.5)]">
                      {PARAGRAPHS[currentStage].text}
                    </span>
                  </div>
                ) : (
                  /* REGULAR PARAGRAPHS */
                  <p
                    className={`text-lg sm:text-xl md:text-2xl text-center leading-relaxed md:leading-loose text-rose-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-normal ${
                      PARAGRAPHS[currentStage]?.isEnglish ? 'italic font-light text-rose-200' : ''
                    }`}
                  >
                    {PARAGRAPHS[currentStage]?.text}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Bottom Navigation / Progress Dots */}
      <div className="relative z-10 w-full p-4 sm:p-6 flex flex-col items-center gap-3">
        {/* Paragraph Dots Indicator */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
          {PARAGRAPHS.map((p, idx) => (
            <div
              key={p.id}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStage
                  ? 'w-6 bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                  : idx < currentStage
                  ? 'w-2 bg-rose-300/40'
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Gentle User Prompt */}
        <p className="text-[11px] sm:text-xs text-white/50 tracking-wider flex items-center gap-1.5">
          <span>தொடர திரையைத் தட்டவும்</span>
          <ChevronRight size={12} className="animate-pulse text-rose-300" />
        </p>
      </div>
    </div>
  );
}
