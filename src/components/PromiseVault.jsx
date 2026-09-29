import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Sparkles, Heart, ArrowRight, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendEmail } from '../utils/emailService';
import CinematicSceneAtmosphere from './CinematicSceneAtmosphere';
import CinematicRainbowBorder from './CinematicRainbowBorder';

// EXACT 6 SINCERE & RESPECTFUL PROMISES (NO PRESSURE, NO GUILT)
const PROMISES = [
  {
    id: 1,
    lines: [
      "உனக்காக எதுவாக இருந்தாலும்,",
      "என்னால் முடிந்ததை செய்வேன். ❤️"
    ]
  },
  {
    id: 2,
    lines: [
      "உன்னை எப்போதும்",
      "மரியாதையோடு பார்த்துக்கொள்வேன். ❤️"
    ]
  },
  {
    id: 3,
    lines: [
      "எந்த சூழ்நிலையிலும்",
      "உன் மனதை காயப்படுத்தாமல் இருக்க முயற்சி செய்வேன். ❤️"
    ]
  },
  {
    id: 4,
    lines: [
      "உன் கனவுகளையும்,",
      "உன் விருப்பங்களையும் மதிப்பேன். ❤️"
    ]
  },
  {
    id: 5,
    lines: [
      "நீ அருகில் இருந்தாலும்,",
      "தொலைவில் இருந்தாலும்,",
      "உன் நினைவுகளுக்கு மதிப்பு இருக்கும். ❤️"
    ]
  },
  {
    id: 6,
    lines: [
      "உன் விருப்பம் எதுவாக இருந்தாலும்,",
      "அதை நான் மதிப்பேன். ❤️"
    ]
  }
];

// GPU-friendly constant configurations for background atmosphere
const PETAL_ITEMS = [
  { left: '7%', delay: '0s', duration: '12s', size: 16, rotate: 25 },
  { left: '22%', delay: '3.5s', duration: '14s', size: 14, rotate: -35 },
  { left: '38%', delay: '1.2s', duration: '11s', size: 18, rotate: 50 },
  { left: '55%', delay: '5s', duration: '13.5s', size: 15, rotate: -15 },
  { left: '72%', delay: '2.2s', duration: '12.5s', size: 17, rotate: 40 },
  { left: '87%', delay: '4.2s', duration: '13s', size: 14, rotate: -60 },
  { left: '16%', delay: '6.5s', duration: '11.5s', size: 15, rotate: 30 },
  { left: '64%', delay: '7.8s', duration: '14s', size: 16, rotate: -20 },
];

const GOLDEN_DUST_ITEMS = [
  { left: '12%', top: '22%', duration: '6.5s', delay: '0s', size: 3 },
  { left: '28%', top: '38%', duration: '7.2s', delay: '1.4s', size: 4 },
  { left: '46%', top: '28%', duration: '8s', delay: '2.8s', size: 3 },
  { left: '62%', top: '34%', duration: '6.8s', delay: '0.9s', size: 4 },
  { left: '80%', top: '52%', duration: '7.6s', delay: '3.3s', size: 3 },
  { left: '20%', top: '68%', duration: '8.8s', delay: '1.7s', size: 3 },
  { left: '74%', top: '72%', duration: '8.2s', delay: '2.1s', size: 4 },
  { left: '52%', top: '78%', duration: '6.4s', delay: '3.6s', size: 3 },
];

const BOKEH_ORBS = [
  { left: '15%', top: '25%', size: 190, color: 'rgba(251,191,36,0.08)', duration: '14s', delay: '0s' },
  { left: '75%', top: '35%', size: 230, color: 'rgba(244,63,94,0.09)', duration: '16s', delay: '2s' },
  { left: '30%', top: '65%', size: 210, color: 'rgba(139,92,246,0.08)', duration: '18s', delay: '1s' },
  { left: '70%', top: '70%', size: 170, color: 'rgba(251,191,36,0.07)', duration: '15s', delay: '3s' },
];

const FINAL_GATHERING_PARTICLES = [
  { startX: -145, startY: -85, targetX: -55, targetY: -45, isPetal: true },
  { startX: 135, startY: -80, targetX: 58, targetY: -40, isPetal: false },
  { startX: -150, startY: 80, targetX: -60, targetY: 45, isPetal: false },
  { startX: 140, startY: 85, targetX: 62, targetY: 48, isPetal: true },
  { startX: -115, startY: 0, targetX: -75, targetY: 0, isPetal: true },
  { startX: 120, startY: 10, targetX: 75, targetY: 10, isPetal: false },
  { startX: 0, startY: -115, targetX: 0, targetY: -65, isPetal: false },
  { startX: 0, startY: 115, targetX: 0, targetY: 65, isPetal: true },
];

export default function PromiseVault({ onComplete }) {
  // Exact 2-second pre-start timing and single-instance audio management
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const hasStartedRef = useRef(false);

  // Scene flow states
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeartFormation, setShowHeartFormation] = useState(false);
  const [showPersonalQuestion, setShowPersonalQuestion] = useState(false);

  // Personal message state
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showFinalTransition, setShowFinalTransition] = useState(false);

  const hasSubmittedRef = useRef(false);

  // ==========================================================================
  // SONG TIMING: START EXACTLY 2 SECONDS BEFORE PROMISE VAULT PAGE APPEARS
  // Timeline:
  // T = -2 sec -> Promise Vault song starts (/pr.mp3, volume 0.85)
  // T = -2 to 0 sec -> existing transition continues
  // T = 0 sec -> Promise Vault page becomes visible
  // ==========================================================================
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // T = -2 sec (Mount): Start Promise Vault song immediately
    try {
      const audio = new Audio('/pr.mp3');
      audio.volume = 0.85; // Clearly audible and cinematic (0.80 - 0.90)
      audio.loop = true;
      audio.preload = 'auto';
      audioRef.current = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Promise Vault audio autoplay deferred by browser:', err);
        });
      }
    } catch (e) {
      console.warn('Promise Vault audio initialization error:', e);
    }

    // User gesture fallback in case browser policy restricted unmuted autoplay
    const handleUserGesture = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('touchstart', handleUserGesture, { once: true });

    // T = -2 to 0 sec: transition continues
    // T = 0 sec: Exactly 2000ms after mount, Promise Vault page becomes visible
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);

      // Clean up audio on unmount to prevent duplicate playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      hasStartedRef.current = false;
    };
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#f43f5e', '#ffffff', '#fbbf24']
    });
  };

  const handleNextPromise = () => {
    if (currentIndex < PROMISES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Trigger final promise heart formation & sincere explanation
      setShowHeartFormation(true);
      setTimeout(() => {
        setShowPersonalQuestion(true);
      }, 3500);
    }
  };

  // Safe single-submission handler using existing EmailJS service
  const handleSubmitAnswer = async () => {
    if (hasSubmittedRef.current || isSubmitting) return;

    const trimmed = userAnswer.trim();

    hasSubmittedRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const emailBody = `
❤️ Promise Vault Response from Saranya:
----------------------------------------
Message:
"${trimmed || '(No written note provided - She proceeded silently)'}"

Time:
${formattedDate}

Source:
For Saranya Cinematic Experience
----------------------------------------
    `.trim();

    try {
      const isSent = await sendEmail({
        title: '❤️ A Message From The Promise Vault',
        message: emailBody,
      });

      if (isSent) {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        setTimeout(() => {
          setShowFinalTransition(true);
        }, 1800);

        setTimeout(() => {
          onComplete();
        }, 6500);
      } else {
        throw new Error('Email service returned false');
      }
    } catch (err) {
      console.error('Promise Vault submission error:', err);
      hasSubmittedRef.current = false;
      setIsSubmitting(false);
      setSubmitError('ஒரு சிறிய technical issue ஏற்பட்டது... மீண்டும் முயற்சி செய்யலாம் ❤️');
    }
  };

  const isFinalPromise = currentIndex === PROMISES.length - 1;

  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none z-30 relative overflow-hidden">
      {/* ==================================================================== */}
      {/* 1. CINEMATIC BACKGROUND ATMOSPHERE: DEEP NAVY/BLACK, RAYS & GLOWS     */}
      {/* ==================================================================== */}
      <style>{`
        @keyframes slowRaySway {
          0% { transform: translateX(-50%) rotate(-5deg); opacity: 0.16; }
          100% { transform: translateX(-50%) rotate(5deg); opacity: 0.26; }
        }
        @keyframes petalDrift {
          0% {
            transform: translate3d(0, -60px, 0) rotate(0deg) scale(0.85);
            opacity: 0;
          }
          15% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% {
            transform: translate3d(60px, 105vh, 0) rotate(360deg) scale(1);
            opacity: 0;
          }
        }
        @keyframes dustFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(0.85);
            opacity: 0.25;
          }
          50% {
            transform: translate3d(14px, -24px, 0) scale(1.35);
            opacity: 0.95;
            box-shadow: 0 0 12px rgba(251, 191, 36, 0.95);
          }
        }
        @keyframes bokehDrift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(20px, -20px, 0) scale(1.12); }
        }
        @keyframes butterflyFlap {
          0% { transform: scaleX(1) scaleY(1); }
          100% { transform: scaleX(0.28) scaleY(0.92); }
        }
        @keyframes butterflyPath {
          0% { transform: translate3d(0, 0, 0) rotate(12deg); opacity: 0; }
          10% { opacity: 0.8; }
          45% { transform: translate3d(40vw, -70px, 0) rotate(2deg); opacity: 0.85; }
          55% { transform: translate3d(52vw, -60px, 0) rotate(-8deg); opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate3d(96vw, -150px, 0) rotate(18deg); opacity: 0; }
        }
        @keyframes vaultGlowPulse {
          0%, 100% {
            box-shadow: 0 0 50px rgba(251, 191, 36, 0.25), inset 0 0 30px rgba(251, 191, 36, 0.08);
          }
          50% {
            box-shadow: 0 0 75px rgba(251, 191, 36, 0.42), 0 0 110px rgba(244, 63, 94, 0.25), inset 0 0 40px rgba(251, 191, 36, 0.15);
          }
        }
        @keyframes glowingHeartPulse {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(251,191,36,0.6)) drop-shadow(0 0 22px rgba(244,63,94,0.45));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(251,191,36,0.9)) drop-shadow(0 0 35px rgba(244,63,94,0.75));
            transform: scale(1.03);
          }
        }
      `}</style>

      {/* Deep Navy/Black Background Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, #0d122b 0%, #06091a 45%, #02030b 80%, #000000 100%)',
        }}
      />

      {/* Rose/Magenta Ambient Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 18% 75%, rgba(244, 63, 94, 0.16) 0%, transparent 55%)',
        }}
      />

      {/* Soft Violet Shadows */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 82% 25%, rgba(139, 92, 246, 0.14) 0%, transparent 50%)',
        }}
      />

      {/* Warm Gold Light Around The Vault (slightly intensified on final promise) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(251, 191, 36, ${isFinalPromise ? 0.28 : 0.18}) 0%, rgba(245, 158, 11, 0.08) 42%, transparent 70%)`,
        }}
      />

      {/* Slow Cinematic Light Rays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[850px] h-[650px]"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 0%, transparent 20%, rgba(251,191,36,0.14) 30%, transparent 40%, rgba(244,63,94,0.1) 50%, transparent 60%, rgba(251,191,36,0.12) 70%, transparent 80%)',
            filter: 'blur(35px)',
            animation: 'slowRaySway 14s ease-in-out infinite alternate',
            transformOrigin: '50% 0%',
          }}
        />
      </div>

      {/* Soft Bokeh Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {BOKEH_ORBS.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: orb.left,
              top: orb.top,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              filter: 'blur(45px)',
              animation: `bokehDrift ${orb.duration} ease-in-out infinite alternate ${orb.delay}`,
            }}
          />
        ))}
      </div>

      {/* Floating Flower Petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        {PETAL_ITEMS.map((petal, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: petal.left,
              top: '-40px',
              width: petal.size,
              height: petal.size,
              animation: `petalDrift ${petal.duration} linear infinite ${petal.delay}`,
              transform: `rotate(${petal.rotate}deg)`,
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full fill-rose-400/60 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]">
              <path d="M12 2C8 6 4 11 5 16a7 7 0 0 0 14 0c1-5-3-10-7-14z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Subtle Golden Dust Motes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        {GOLDEN_DUST_ITEMS.map((dust, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300 pointer-events-none"
            style={{
              left: dust.left,
              top: dust.top,
              width: dust.size,
              height: dust.size,
              animation: `dustFloat ${dust.duration} ease-in-out infinite ${dust.delay}`,
            }}
          />
        ))}
      </div>

      {/* Occasional Background Butterflies */}
      <div
        className="fixed pointer-events-none z-[2]"
        style={{
          animation: 'butterflyPath 18s ease-in-out infinite',
          left: '3%',
          top: '32%',
        }}
      >
        <div style={{ animation: 'butterflyFlap 0.34s ease-in-out infinite alternate' }}>
          <svg viewBox="0 0 32 32" className="w-6 h-6 fill-amber-300/75 text-rose-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.85)]">
            <path d="M16 13c-2-4-7-6-11-4-5 3-4 10 1 12 3 1 7-1 10-6 3 5 7 7 10 6 5-2 6-9 1-12-4-2-9 0-11 4z" />
          </svg>
        </div>
      </div>

      {/* Universal Screen Atmosphere */}
      <CinematicSceneAtmosphere accentGlow="amber" />

      {/* ==================================================================== */}
      {/* MAIN PROMISE VAULT UI: BECOMES VISIBLE AT T = 0 (2.0S AFTER SONG)    */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="promise-vault-ui-root"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-full flex flex-col items-center justify-center relative z-10"
          >
            {/* ==================================================================== */}
            {/* STAGE 1: LOCKED VAULT VIEW WITH MAGICAL KEY                         */}
            {/* ==================================================================== */}
            {!isUnlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-zinc-950/90 backdrop-blur-3xl border border-amber-400/40 space-y-6 relative overflow-hidden"
                style={{
                  animation: 'vaultGlowPulse 4s ease-in-out infinite',
                }}
              >
                {/* Moving Rainbow Border around Vault */}
                <CinematicRainbowBorder mode="card" borderRadius={28} />

                {/* Subtle Golden Radial Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-purple-600/15 pointer-events-none" />

                <motion.div
                  animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                  className="w-22 h-22 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.7)] cursor-pointer relative z-10"
                  onClick={handleUnlock}
                >
                  <KeyRound className="w-11 h-11" />
                </motion.div>

                <div className="space-y-2 relative z-10">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-300">
                    Sacred Promises • The Vault
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                    Unlock My 6 Promises 🔐✨
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm font-serif italic pt-1">
                    "6 eternal promises sealed exclusively for Saranya..."
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleUnlock}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 font-bold text-sm tracking-wider shadow-[0_0_35px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2 cursor-pointer transition relative z-10"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Promise Vault</span>
                </motion.button>
              </motion.div>
            )}

            {/* ==================================================================== */}
            {/* STAGE 2: PROMISE REVEAL CARD VIEW (ONE BY ONE)                       */}
            {/* CHOREOGRAPHED REVEAL:                                               */}
            {/* darkness -> 1 golden particle -> flower petal -> petal reaches       */}
            {/* center -> promise text fades in -> soft golden glow -> butterfly    */}
            {/* slowly crosses behind                                                */}
            {/* ==================================================================== */}
            {isUnlocked && !showPersonalQuestion && !showFinalTransition && (
              <motion.div
                key={`promise-card-${currentIndex}`}
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -25, scale: 0.94 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-zinc-950/90 backdrop-blur-3xl border border-rose-500/40 space-y-6 text-center relative overflow-hidden"
                style={{
                  animation: 'vaultGlowPulse 4s ease-in-out infinite',
                }}
              >
                {/* Moving Rainbow Border around Promise Card */}
                <CinematicRainbowBorder mode="card" borderRadius={28} />

                {/* 1. REVEAL: DARKNESS TRANSITION OVERLAY */}
                <motion.div
                  key={`darkness-${currentIndex}`}
                  initial={{ opacity: 0.92 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute inset-0 bg-[#03040c] rounded-3xl pointer-events-none z-30"
                />

                {/* 2. REVEAL: ONE GOLDEN PARTICLE APPEARING */}
                <motion.div
                  key={`particle-${currentIndex}`}
                  initial={{ scale: 0, opacity: 0, y: 25 }}
                  animate={{
                    scale: [0, 1.8, 1.2, 0],
                    opacity: [0, 1, 1, 0],
                    y: [25, 6, -6, -14],
                  }}
                  transition={{ duration: 1.1, times: [0, 0.35, 0.75, 1], ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_25px_rgba(251,191,36,1),0_0_50px_rgba(245,158,11,0.85)] pointer-events-none z-20"
                />

                {/* 3. REVEAL: PARTICLE BECOMES A FLOWER PETAL REACHING CENTER */}
                <motion.div
                  key={`petal-${currentIndex}`}
                  initial={{ scale: 0, opacity: 0, rotate: -40 }}
                  animate={{
                    scale: [0, 1.4, 1.05, 0.75, 0],
                    opacity: [0, 1, 1, 0.85, 0],
                    rotate: [-40, 16, -8, 4, 0],
                    y: [20, 0, -6, -2, 0],
                  }}
                  transition={{ duration: 1.5, delay: 0.55, times: [0, 0.4, 0.7, 0.88, 1], ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 pointer-events-none z-20"
                >
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-rose-400 drop-shadow-[0_0_18px_rgba(244,63,94,0.9)]">
                    <path d="M12 2C8 6 4 11 5 16a7 7 0 0 0 14 0c1-5-3-10-7-14z" />
                  </svg>
                </motion.div>

                {/* 4. REVEAL: SOFT GOLDEN GLOW BLOOMING BEHIND */}
                <motion.div
                  key={`text-glow-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: [0, 0.75, 0.55], scale: [0.7, 1.2, 1.0] }}
                  transition={{ duration: 1.2, delay: 1.4, ease: 'easeOut' }}
                  className="absolute inset-0 bg-radial from-amber-400/20 via-rose-500/10 to-transparent pointer-events-none z-0 rounded-3xl"
                />

                {/* 5. REVEAL: BUTTERFLY SLOWLY CROSSES BEHIND TEXT */}
                <motion.div
                  key={`cross-butterfly-${currentIndex}`}
                  initial={{ x: '-30%', y: '25%', opacity: 0, scale: 0.7 }}
                  animate={{
                    x: '125%',
                    y: '-25%',
                    opacity: [0, 0.85, 0.9, 0.7, 0],
                    scale: [0.7, 0.85, 0.8, 0.75],
                  }}
                  transition={{ duration: 5.5, delay: 1.2, ease: 'easeInOut' }}
                  className="absolute pointer-events-none z-[4]"
                >
                  <div style={{ animation: 'butterflyFlap 0.32s ease-in-out infinite alternate' }}>
                    <svg viewBox="0 0 32 32" className="w-8 h-8 fill-amber-300/85 text-rose-300 drop-shadow-[0_0_14px_rgba(251,191,36,0.9)]">
                      <path d="M16 13c-2-4-7-6-11-4-5 3-4 10 1 12 3 1 7-1 10-6 3 5 7 7 10 6 5-2 6-9 1-12-4-2-9 0-11 4z" />
                    </svg>
                  </div>
                </motion.div>

                {/* FINAL PROMISE MOMENT: SUBTLE GLOWING HEART FRAMING THE PROMISE */}
                {isFinalPromise && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="absolute inset-2 sm:inset-4 rounded-3xl pointer-events-none z-[5] flex items-center justify-center"
                    style={{ animation: 'glowingHeartPulse 3.5s ease-in-out infinite' }}
                  >
                    <svg
                      className="w-full h-full max-w-[340px] max-h-[230px] opacity-45"
                      viewBox="0 0 100 100"
                    >
                      <path
                        d="M50,85 C20,60 5,40 5,25 C5,10 18,3 30,3 C38,3 46,9 50,16 C54,9 62,3 70,3 C82,3 95,10 95,25 C95,40 80,60 50,85 Z"
                        fill="none"
                        stroke="url(#finalHeartGrad)"
                        strokeWidth="1.6"
                      />
                      <defs>
                        <linearGradient id="finalHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="50%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                )}

                {/* FINAL PROMISE MOMENT: PETALS & GOLDEN PARTICLES GATHERING AROUND TEXT */}
                {isFinalPromise && (
                  <div className="absolute inset-0 pointer-events-none z-[6] overflow-hidden">
                    {FINAL_GATHERING_PARTICLES.map((p, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: p.startX, y: p.startY, opacity: 0, scale: 0.5 }}
                        animate={{
                          x: [p.startX, p.targetX, p.targetX + (i % 2 === 0 ? 5 : -5), p.targetX],
                          y: [p.startY, p.targetY, p.targetY + (i % 2 === 0 ? -4 : 4), p.targetY],
                          opacity: [0, 0.85, 0.7, 0.85],
                          scale: [0.5, 1, 0.9, 1],
                        }}
                        transition={{
                          duration: 4.5,
                          delay: 0.3 + i * 0.15,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                        }}
                        className="absolute"
                        style={{ left: '50%', top: '50%' }}
                      >
                        {p.isPetal ? (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-rose-400/80 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                            <path d="M12 2C8 6 4 11 5 16a7 7 0 0 0 14 0c1-5-3-10-7-14z" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Header Progress Counter */}
                <div className="flex items-center justify-between text-xs font-mono text-rose-300 relative z-10">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Promise {currentIndex + 1} of {PROMISES.length}
                  </span>
                  <span className="text-amber-300/80">Sealed in Heart 🔒</span>
                </div>

                {/* Golden Heart Icon */}
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center z-10">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="p-4 rounded-full bg-gradient-to-tr from-amber-400/20 to-rose-500/20 border border-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.4)]"
                  >
                    <Heart className="w-8 h-8 fill-rose-500 text-amber-300" />
                  </motion.div>
                </div>

                {/* 6. REVEAL: PROMISE TEXT LINES FADING IN WITH SOFT GLOW */}
                <motion.div
                  key={`promise-lines-${currentIndex}`}
                  initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.85, delay: 1.35, ease: 'easeOut' }}
                  className="space-y-3 py-3 relative z-10"
                >
                  {PROMISES[currentIndex].lines.map((line, idx) => (
                    <p
                      key={idx}
                      className="text-lg sm:text-2xl font-serif text-slate-100 font-light leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
                    >
                      "{line}"
                    </p>
                  ))}
                </motion.div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-1.5 pt-1 relative z-10">
                  {PROMISES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex ? 'w-8 bg-gradient-to-r from-amber-400 to-rose-500' : 'w-2 bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>

                {/* Sincere disclaimer appearing on final promise */}
                {showHeartFormation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5 pt-3 border-t border-rose-400/20 text-xs sm:text-sm font-serif italic text-amber-200/90 leading-relaxed relative z-10"
                  >
                    <p>"இந்த வாக்குறுதிகள்... உன்னை கட்டுப்படுத்துவதற்காக அல்ல."</p>
                    <p className="font-medium text-rose-200">"என் மனதில் இருக்கும் உண்மையை சொல்லுவதற்காக. ❤️"</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNextPromise}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center justify-center gap-2 cursor-pointer transition relative z-10"
                >
                  <span>
                    {currentIndex === PROMISES.length - 1
                      ? "இறுதி கேள்விக்கு செல்வோம் 💌"
                      : "Next Promise 💖"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* ==================================================================== */}
            {/* STAGE 3: FINAL PERSONAL QUESTION + TEXT ANSWER + EMAIL SUBMISSION    */}
            {/* ==================================================================== */}
            {showPersonalQuestion && !showFinalTransition && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-zinc-950/90 backdrop-blur-3xl border border-amber-300/40 space-y-6 text-center relative overflow-hidden"
                style={{
                  animation: 'vaultGlowPulse 4s ease-in-out infinite',
                }}
              >
                {/* Moving Rainbow Border */}
                <CinematicRainbowBorder mode="card" borderRadius={28} />

                {/* Header Title Required by Prompt */}
                <div className="space-y-2 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-serif text-amber-100 font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    "இப்போ...
                    <br />
                    நீ என்னிடம் சொல்ல விரும்புவது ஏதாவது இருக்கிறதா? ❤️"
                  </h3>
                  <p className="text-xs sm:text-sm font-serif italic text-rose-200/80">
                    "உன் மனதில் இருப்பதை சுதந்திரமாக எழுதலாம்..."
                  </p>
                </div>

                {/* Beautiful Multiline Textarea */}
                <div className="space-y-2 text-left relative z-10">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="உன் மனதில் இருப்பதை இங்கே எழுதலாம்... ❤️"
                    rows={5}
                    disabled={isSubmitting || submitSuccess}
                    className="w-full px-5 py-4 rounded-2xl bg-black/60 border border-amber-400/35 text-white text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 transition-all duration-300 shadow-inner resize-none font-serif leading-relaxed"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-zinc-500 px-1">
                    <span>Free heartfelt expression (optional)</span>
                    <span>{userAnswer.length} chars</span>
                  </div>
                </div>

                {/* Technical Error Notice */}
                {submitError && (
                  <p className="text-xs font-serif italic text-rose-400 relative z-10">
                    {submitError}
                  </p>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.03 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || submitSuccess}
                  className={`w-full py-4 rounded-2xl font-serif text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 transition duration-300 cursor-pointer relative z-10 ${
                    submitSuccess
                      ? 'bg-emerald-600/90 text-white'
                      : 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                  }`}
                >
                  {isSubmitting ? (
                    <span>உன் வார்த்தைகளை பாதுகாத்துக்கொண்டிருக்கிறேன்... ❤️</span>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>உன் வார்த்தைகள் பாதுகாப்பாக சென்றுவிட்டது. ❤️</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-200" />
                      <span>என் பதிலை வைத்துக்கொள் ❤️</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* ==================================================================== */}
            {/* STAGE 4: AFTER ANSWER — EMOTIONAL TRANSITION TO CERTIFICATE          */}
            {/* ==================================================================== */}
            {showFinalTransition && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9 }}
                className="max-w-lg w-full p-8 sm:p-12 rounded-3xl bg-zinc-950/90 backdrop-blur-3xl border border-amber-300/40 text-center space-y-6 relative overflow-hidden"
                style={{
                  animation: 'vaultGlowPulse 4s ease-in-out infinite',
                }}
              >
                {/* Moving Rainbow Border */}
                <CinematicRainbowBorder mode="card" borderRadius={28} />

                {/* Handwritten Card Preview */}
                {userAnswer.trim() && (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-300/25 text-rose-200 text-xs sm:text-sm font-serif italic max-w-sm mx-auto shadow-inner relative z-10">
                    "{userAnswer.trim()}"
                  </div>
                )}

                <div className="space-y-3 relative z-10">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base sm:text-xl font-serif text-slate-200 font-light leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
                  >
                    "சில வார்த்தைகள்...
                    <br />
                    ஒரு screen-ல் எழுதப்படுவதில்லை."
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    className="text-lg sm:text-2xl font-serif text-amber-200 font-normal tracking-wide drop-shadow-[0_0_20px_rgba(251,191,36,0.85)]"
                  >
                    "அவை...
                    <br />
                    ஒரு நினைவாக மாறிவிடுகின்றன. ❤️"
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.8 }}
                  className="pt-2 text-xs font-mono text-zinc-400 uppercase tracking-widest relative z-10"
                >
                  Entering Certificate of Forever... ✨
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
