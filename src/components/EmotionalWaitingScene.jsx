import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Heart, Sparkles, Volume2 } from 'lucide-react';
import { sendEmail } from '../utils/emailService';
import { useSound } from '../context/SoundContext';
import CinematicRainbowBorder from './CinematicRainbowBorder';

const ADMIN_PHONE = '6380404055';

// Emotional Tamil Lines (Subtitles / Handwritten Memories)
const EMOTIONAL_LINES = [
  "நான் காத்திருப்பேன்...",
  "ஒரு நாள் நீ திரும்பிப் பார்ப்பாய் என்று...",
  "எவ்வளவு காலம் ஆனாலும்...",
  "என் மனசு காத்திருக்க தெரியும்...",
  "உனக்காக...",
  "100 ஜென்மம் எடுத்தாலும்...",
  "நான் காத்திருப்பேன்."
];

// Pre-computed floating butterflies & heart motifs (24 particles)
const BUTTERFLY_PARTICLES = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  startX: (i * 15.3) % 92 + 4,
  startY: (i * 21.7) % 88 + 6,
  size: 14 + (i % 4) * 3,
  duration: 7 + (i % 5) * 1.6,
  delay: (i * 0.4) % 3.5,
  driftX: ((i % 2 === 0 ? 1 : -1) * (18 + (i % 4) * 12)),
}));

// Pre-computed golden / starlight micro light particles (26 particles)
const GLOW_PARTICLES = Array.from({ length: 26 }).map((_, i) => ({
  id: i,
  left: (i * 14.1) % 94 + 3,
  top: (i * 18.7) % 92 + 4,
  size: 2 + (i % 3) * 1.5,
  duration: 6 + (i % 4) * 1.8,
  delay: (i * 0.5) % 4,
}));

// Pre-computed soft falling light / tear droplets (14 particles)
const TEAR_DROPLETS = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  left: (i * 21.3) % 90 + 5,
  duration: 5.0 + (i % 4) * 1.4,
  delay: (i * 0.8) % 5,
  size: 2.5 + (i % 3) * 1.2,
}));

export default function EmotionalWaitingScene({ onComplete }) {
  const { playKaTrack, stopKaTrack } = useSound();
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [isClimaxReached, setIsClimaxReached] = useState(false);
  const [showCallPrompt, setShowCallPrompt] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  const hasSentEmailRef = useRef(false);
  const timersRef = useRef([]);
  const mmAudioRef = useRef(null);
  const audioTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  // 1. Scene Entry: EmailJS notification, Heartbeat progression, /mm.mp3 autoplay after 5 seconds
  useEffect(() => {
    isMountedRef.current = true;

    // A. Send EmailJS notification at most once per session
    if (!hasSentEmailRef.current) {
      hasSentEmailRef.current = true;
      sendEmail({
        title: 'She opened the emotional chapter ❤️',
        message: 'Saranya reached the final emotional waiting scene: "100 ஜென்மம் காத்திருப்பேன்...".',
      }).catch((err) => console.log('Scene notification skipped:', err));
    }

    // B. Start Heartbeat: Slow emotional pulse (~60 BPM, 20% volume)
    if (window.heartbeatEngine) {
      window.heartbeatEngine.start();
      window.heartbeatEngine.setTargetBPM(60, 0.20);
    }

    // B2. Start /ka.mp3 — the intended background song for this emotional scene.
    // playKaTrack() fades out any previous track smoothly then starts ka.mp3.
    if (typeof playKaTrack === 'function') {
      playKaTrack().catch(() => {});
    } else if (window.soundController?.playKaTrack) {
      window.soundController.playKaTrack().catch(() => {});
    }

    // Gradual heartbeat swelling as emotional depth increases
    const tHeartbeat1 = setTimeout(() => {
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(64, 0.22);
      }
    }, 7000);

    const tHeartbeat2 = setTimeout(() => {
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(68, 0.24);
      }
    }, 15000);

    const tHeartbeat3 = setTimeout(() => {
      if (window.heartbeatEngine) {
        window.heartbeatEngine.setTargetBPM(72, 0.26);
      }
    }, 23000);

    timersRef.current.push(tHeartbeat1, tHeartbeat2, tHeartbeat3);

    // C. Wait exactly 5.0 seconds before automatically playing /mm.mp3
    audioTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      try {
        if (!mmAudioRef.current) {
          const audio = new Audio('/mm.mp3');
          audio.preload = 'auto';
          audio.loop = true;
          audio.volume = 0.8;
          mmAudioRef.current = audio;
        }

        const playPromise = mmAudioRef.current.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch((err) => {
            console.warn('/mm.mp3 autoplay restricted by browser:', err);
            if (isMountedRef.current) {
              setIsAutoplayBlocked(true);
            }
          });
        }
      } catch (err) {
        console.warn('Failed to play /mm.mp3:', err);
      }
    }, 5000);

    // Cleanup when leaving Emotional Waiting Scene:
    // Clear 5s timer and stop /mm.mp3 playback cleanly
    return () => {
      isMountedRef.current = false;
      timersRef.current.forEach((t) => clearTimeout(t));

      if (audioTimerRef.current) {
        clearTimeout(audioTimerRef.current);
        audioTimerRef.current = null;
      }

      if (mmAudioRef.current) {
        mmAudioRef.current.pause();
        mmAudioRef.current.currentTime = 0;
        mmAudioRef.current = null;
      }

      if (typeof stopKaTrack === 'function') {
        stopKaTrack(0.5);
      }
    };
  }, [stopKaTrack]);

  // 2. User gesture fallback if browser autoplay policy blocked /mm.mp3
  const handleUnblockAudio = (e) => {
    if (e) e.stopPropagation();
    setIsAutoplayBlocked(false);
    if (!mmAudioRef.current) {
      const audio = new Audio('/mm.mp3');
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = 0.8;
      mmAudioRef.current = audio;
    }
    mmAudioRef.current.play().catch(() => {});
    if (window.heartbeatEngine) {
      window.heartbeatEngine.resumeContext();
    }
  };

  // 3. Sequential Tamil subtitle-like line transitions (3.8s per line)
  useEffect(() => {
    if (isClimaxReached) return;

    if (currentLineIdx < EMOTIONAL_LINES.length) {
      const lineDuration = 3800;
      const timer = setTimeout(() => {
        setCurrentLineIdx((prev) => prev + 1);
      }, lineDuration);
      return () => clearTimeout(timer);
    } else {
      // All lines shown -> transition to Grand Emotional Climax
      const climaxTimer = setTimeout(() => {
        setIsClimaxReached(true);
        if (window.heartbeatEngine) {
          window.heartbeatEngine.setTargetBPM(74, 0.28);
        }
      }, 1000);
      return () => clearTimeout(climaxTimer);
    }
  }, [currentLineIdx, isClimaxReached]);

  // 4. Climax timing: reveal Call Me & Continue buttons after climax lines sink in
  useEffect(() => {
    if (isClimaxReached) {
      const promptTimer = setTimeout(() => {
        setShowCallPrompt(true);
      }, 3500);
      return () => clearTimeout(promptTimer);
    }
  }, [isClimaxReached]);

  const handleCallClick = () => {
    setIsCalling(true);
    if (window.heartbeatEngine) {
      window.heartbeatEngine.setTargetBPM(88, 0.32);
    }

    setTimeout(() => {
      if (ADMIN_PHONE) {
        window.location.href = `tel:${ADMIN_PHONE}`;
      }
      setIsCalling(false);
    }, 600);
  };

  const handleContinue = () => {
    // Cleanly stop /mm.mp3 timer and audio before completing scene
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }
    if (mmAudioRef.current) {
      mmAudioRef.current.pause();
      mmAudioRef.current.currentTime = 0;
      mmAudioRef.current = null;
    }
    if (typeof stopKaTrack === 'function') {
      stopKaTrack(1.0);
    }
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div
      onClick={isAutoplayBlocked ? handleUnblockAudio : undefined}
      className="fixed inset-0 w-full h-full bg-[#050208] text-slate-100 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden select-none z-[120] animate-in fade-in duration-1000"
    >
      {/* SCREEN-LEVEL CONTINUOUS TRAVELLING RAINBOW BORDER */}
      <CinematicRainbowBorder mode="screen" />

      {/* INLINE CSS FOR KEN BURNS SLOW ZOOM, LIGHT RAYS & FILM GRAIN */}
      <style>{`
        @keyframes kenBurnsSlow {
          0% { transform: scale(1.0) translate(0%, 0%); }
          50% { transform: scale(1.055) translate(-0.8%, -0.5%); }
          100% { transform: scale(1.0) translate(0%, 0%); }
        }
        @keyframes goldenRayDrift {
          0%, 100% { opacity: 0.32; transform: rotate(-14deg) scale(1); }
          50% { opacity: 0.55; transform: rotate(-10deg) scale(1.08); }
        }
        @keyframes warmLeakDrift {
          0%, 100% { opacity: 0.35; transform: translate(0, 0); }
          50% { opacity: 0.60; transform: translate(18px, -14px); }
        }
        @keyframes softBreatheGlow {
          0%, 100% { opacity: 0.28; transform: scale(1); }
          50% { opacity: 0.52; transform: scale(1.1); }
        }
      `}</style>

      {/* =========================================================================
          LAYER 1: c.jpg (ORIGINAL PHOTO PRESERVED, ZERO DISTORTION, CLEAR SUBJECT)
          Full-screen background with gentle slow zoom (Ken Burns effect)
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <img
          src="/c.jpg"
          alt="100 ஜென்மம் காத்திருப்பேன்"
          className="w-full h-full object-cover object-[center_32%] transition-transform duration-1000 ease-out"
          style={{
            animation: 'kenBurnsSlow 24s ease-in-out infinite',
            filter: 'brightness(0.92) contrast(1.06) saturate(1.12)',
          }}
        />
      </div>

      {/* =========================================================================
          LAYER 2: SUBTLE DARK CINEMATIC OVERLAY & SOFT VIGNETTE
          Preserves photo visibility with pristine clarity while ensuring text readability
          ========================================================================= */}
      {/* Subtle radial cinematic gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6,3,10,0.22) 25%, rgba(6,3,10,0.60) 75%, rgba(4,1,8,0.85) 100%)',
        }}
      />
      {/* Vertical subtle contrast gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040108]/45 via-transparent to-[#040108]/75 pointer-events-none" />

      {/* Deep soft vignette around screen edges */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.7),inset_0_0_180px_rgba(8,2,12,0.55)] pointer-events-none" />

      {/* =========================================================================
          LAYER 3: WARM/LIGHT GLOW & SUBTLE LIGHT RAYS
          ========================================================================= */}
      {/* Soft center breathing warm glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-rose-600/15 via-pink-500/10 to-amber-500/10 rounded-full blur-[140px] pointer-events-none"
        style={{ animation: 'softBreatheGlow 10s ease-in-out infinite' }}
      />

      {/* Diagonal subtle golden/rose light beam from top-left */}
      <div
        className="absolute -top-32 -left-28 w-[800px] h-[550px] bg-gradient-to-br from-amber-200/22 via-rose-300/12 to-transparent blur-3xl pointer-events-none"
        style={{ animation: 'goldenRayDrift 14s ease-in-out infinite' }}
      />

      {/* Warm soft light leak from top-right corner */}
      <div
        className="absolute -top-20 -right-20 w-[600px] h-[500px] bg-gradient-to-bl from-rose-400/20 via-amber-400/10 to-transparent blur-3xl pointer-events-none"
        style={{ animation: 'warmLeakDrift 16s ease-in-out infinite' }}
      />

      {/* =========================================================================
          LAYER 4: SLIGHT FILM GRAIN (Authentic Romantic 35mm Movie Texture)
          ========================================================================= */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* =========================================================================
          LAYER 5: FLOATING PARTICLES (Starlight Sparkles & Falling Tears)
          ========================================================================= */}
      {/* A. Golden & Rose Micro Light Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {GLOW_PARTICLES.map((p) => (
          <motion.div
            key={`glow-${p.id}`}
            animate={{
              y: [0, -45, 0],
              opacity: [0.2, 0.75, 0.2],
              scale: [0.8, 1.25, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: p.duration,
              delay: p.delay,
              ease: 'easeInOut',
            }}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            className="absolute rounded-full bg-gradient-to-r from-amber-200 to-rose-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
          />
        ))}
      </div>

      {/* B. Glass-like Falling Tear Droplets (Longing & Emotional Depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {TEAR_DROPLETS.map((tear) => (
          <motion.div
            key={`tear-${tear.id}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: ['0vh', '105vh'],
              opacity: [0, 0.55, 0.65, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: tear.duration,
              delay: tear.delay,
              ease: 'easeInOut',
            }}
            style={{
              left: `${tear.left}%`,
              width: `${tear.size}px`,
              height: `${tear.size * 3.5}px`,
            }}
            className="absolute rounded-full bg-gradient-to-b from-white/70 via-rose-200/40 to-transparent blur-[0.5px] shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          />
        ))}
      </div>

      {/* C. Soft Heart & Butterfly Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {BUTTERFLY_PARTICLES.map((b) => (
          <motion.div
            key={`b-${b.id}`}
            initial={{ opacity: 0 }}
            animate={{
              x: [0, b.driftX, 0],
              y: [0, -35, 0],
              opacity: [0.18, 0.65, 0.18],
              rotate: [0, b.id % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: b.duration,
              delay: b.delay,
              ease: 'easeInOut',
            }}
            style={{
              left: `${b.startX}%`,
              top: `${b.startY}%`,
            }}
            className="absolute text-rose-200/50 text-sm md:text-base select-none filter drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]"
          >
            {b.id % 4 === 0 ? '🦋' : b.id % 4 === 1 ? '✨' : b.id % 4 === 2 ? '🤍' : '🌸'}
          </motion.div>
        ))}
      </div>

      {/* =========================================================================
          LAYER 6: AUTOPLAY BLOCKED USER FALLBACK BADGE (Graceful Non-Intrusive)
          ========================================================================= */}
      {isAutoplayBlocked && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onClick={handleUnblockAudio}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-zinc-950/80 hover:bg-rose-950/90 border border-rose-400/50 text-rose-200 text-xs font-serif tracking-wide shadow-[0_0_25px_rgba(244,63,94,0.4)] backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <Volume2 className="w-4 h-4 text-rose-300 animate-pulse" />
          <span>Tap anywhere to listen with music 🎵</span>
        </motion.button>
      )}

      {/* =========================================================================
          LAYER 7: MAIN EMOTIONAL DIALOGUE CONTAINER
          Soft white/rose-gold glow, smooth typewriter fade, cinematic line spacing
          ========================================================================= */}
      <div className="relative z-20 max-w-xl w-full mx-auto text-center flex flex-col items-center justify-center space-y-8 px-4">
        
        {/* Subtle Scene Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/60 border border-rose-500/35 text-rose-300 text-xs tracking-widest font-mono uppercase backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.25)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>100 ஜென்மம் காத்திருப்பேன்...</span>
        </motion.div>

        {/* Phase 1: Progressive Subtitle Tamil Lines */}
        {!isClimaxReached && (
          <div className="min-h-[140px] flex items-center justify-center px-4 py-3 rounded-2xl bg-zinc-950/35 backdrop-blur-[3px] border border-white/[0.04]">
            <AnimatePresence mode="wait">
              {currentLineIdx < EMOTIONAL_LINES.length && (
                <motion.p
                  key={currentLineIdx}
                  initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xl sm:text-2xl md:text-3xl font-serif text-white/95 leading-relaxed tracking-wide drop-shadow-[0_2px_18px_rgba(244,63,94,0.45)] drop-shadow-[0_0_30px_rgba(255,225,235,0.4)]"
                >
                  "{EMOTIONAL_LINES[currentLineIdx]}"
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Phase 2: Grand Climax Emotional Message */}
        {isClimaxReached && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="space-y-6 w-full"
          >
            {/* Climax Core Lines with soft rose-gold luminous glow */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/45 backdrop-blur-md border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.25)] space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 leading-snug drop-shadow-[0_0_30px_rgba(244,63,94,0.5)]"
              >
                "உனக்காக நான் 100 ஜென்மம் எடுத்தாலும்
                <br />
                காத்திருப்பேன்..."
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.6 }}
                className="text-lg sm:text-2xl font-serif text-rose-300 font-semibold italic flex items-center justify-center gap-2 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              >
                <span>"ஏன்னா... நீ என்னோடையவள்."</span>
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-bounce inline-block" />
              </motion.p>
            </div>

            {/* Optional Call Prompt & Action Buttons */}
            {showCallPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0 }}
                className="pt-2 space-y-4 flex flex-col items-center"
              >
                <div className="space-y-1 text-xs sm:text-sm font-serif italic text-slate-200/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                  <p className="text-pink-300 font-medium">இப்போ பேசணும்னு தோணுதா? 📞</p>
                  <p className="text-slate-300">"எப்போ வேண்டுமானாலும்... எனக்கு call பண்ணலாம்."</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm pt-2">
                  {/* Optional Call Button */}
                  {ADMIN_PHONE && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCallClick}
                      className={`w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white text-sm font-semibold shadow-[0_0_25px_rgba(244,63,94,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isCalling ? 'animate-pulse' : ''
                      }`}
                    >
                      <Phone className="w-4 h-4 fill-white animate-pulse" />
                      <span>Call Me ❤️</span>
                    </motion.button>
                  )}

                  {/* Continue Journey Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleContinue}
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-medium border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue Journey</span>
                    <ArrowRight className="w-4 h-4 text-rose-400" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
