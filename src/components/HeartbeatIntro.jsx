import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import CinematicRainbowBorder from './CinematicRainbowBorder';
import { globalAudioEngine as globalHeartbeatEngine } from '../utils/audioEngine';

// ============================================================================
// THE FOUR CINEMATIC INTRO MOMENTS & ASSET PATHS (PRESERVED EXACTLY)
// ============================================================================
const MOMENTS = [
  {
    id: 1,
    name: 'Eternal Forest',
    subtitle: 'மாய வனத்தின் தொடக்கம்',
    image: '/eternal-forest.png',
    fallbackImage: '/eternal-forest.png.png',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    borderGradient: 'from-purple-500/60 via-pink-500/40 to-indigo-500/60',
    storyNote: 'A mystical realm where timeless memories begin',
  },
  {
    id: 2,
    name: 'Crystal Heart',
    subtitle: 'ஸ்படிக இதயத்தின் துடிப்பு',
    image: '/crystal-heart.png',
    fallbackImage: '/crysteternal-forest.png.png',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.55)',
    borderGradient: 'from-rose-500/70 via-pink-500/50 to-purple-600/70',
    storyNote: 'Every unspoken heartbeat pulses with true feeling',
  },
  {
    id: 3,
    name: 'SARANYA Reveal',
    subtitle: 'சரண்யாவின் பிரகாசம்',
    image: '/saranya-reveal.png',
    fallbackImage: '/saranya-reveal.png.png',
    accentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    borderGradient: 'from-amber-400/70 via-rose-400/50 to-pink-500/70',
    storyNote: 'The luminous name sculpted in celestial starlight',
  },
  {
    id: 4,
    name: 'Enter Our Story',
    subtitle: 'காதல் தோட்டத்தின் அழைப்பு',
    image: '/enter-our-story.png',
    fallbackImage: '/enter-our-story.png.png',
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.55)',
    borderGradient: 'from-rose-500/80 via-amber-300/60 to-purple-600/80',
    storyNote: 'The gateway into our eternal romantic journey',
  },
];

// ============================================================================
// ALL 13 EMOTIONAL TAMIL DIALOGUES PRESERVED IN EXACT GIVEN ORDER
// ============================================================================
const DIALOGUES = [
  // --------------------------------------------------------------------------
  // MOMENT A — ETERNAL FOREST (0–5 seconds)
  // --------------------------------------------------------------------------
  {
    id: 1,
    momentIndex: 0,
    text: 'சரண்யா…',
    duration: 3400,
    isName: true,
  },
  {
    id: 2,
    momentIndex: 0,
    text: 'என் மனசுக்குள்ள என்ன இருக்குன்னு உன்னால பார்க்க முடிஞ்சா…',
    duration: 4800,
  },

  // --------------------------------------------------------------------------
  // MOMENT B — CRYSTAL HEART (Feelings Reveal)
  // --------------------------------------------------------------------------
  {
    id: 3,
    momentIndex: 1,
    text: 'நான் எப்பவும் சொல்லுற வார்த்தைகளை விட…',
    duration: 4200,
  },
  {
    id: 4,
    momentIndex: 1,
    text: 'உன்கிட்ட சொல்ல முடியாம மறைச்சு வச்சிருக்கிற உணர்வுகள்தான் அதிகம்.',
    duration: 4800,
  },
  {
    id: 5,
    momentIndex: 1,
    text: 'நீ சிரிக்கும்போது எனக்கு வர்ற சந்தோஷம்…',
    duration: 4200,
  },
  {
    id: 6,
    momentIndex: 1,
    text: 'நீ அமைதியா இருக்கும்போது எனக்குள்ள வர்ற கவலை…',
    duration: 4400,
  },
  {
    id: 7,
    momentIndex: 1,
    text: 'இதெல்லாம் உனக்கு முழுசா புரியுதான்னு எனக்குத் தெரியல.',
    duration: 4600,
  },

  // --------------------------------------------------------------------------
  // MOMENT C — SARANYA REVEAL (Emotional Climax)
  // --------------------------------------------------------------------------
  {
    id: 8,
    momentIndex: 2,
    text: 'நீ என் வாழ்க்கையில வந்ததுக்குப் பிறகு…',
    duration: 4400,
  },
  {
    id: 9,
    momentIndex: 2,
    text: 'என்னோட நாள்களில் ஒரு பகுதி உன்னை நினைக்காம போனதே இல்லை.',
    duration: 5000,
  },
  {
    id: 10,
    momentIndex: 2,
    text: 'ஆனா, உன்னை நேசிக்கிறேன்னு சொல்றதை விட…',
    duration: 4400,
  },
  {
    id: 11,
    momentIndex: 2,
    text: 'உன்னைப் புரிஞ்சுக்கிற ஒருத்தனா இருக்கணும்னுதான் எனக்கு ஆசை.',
    duration: 5200,
  },

  // --------------------------------------------------------------------------
  // MOMENT D — ENTER OUR STORY (Final Heart Reveal)
  // --------------------------------------------------------------------------
  {
    id: 12,
    momentIndex: 3,
    text: 'சரண்யா…',
    duration: 3600,
    isName: true,
  },
  {
    id: 13,
    momentIndex: 3,
    text: 'என் மனசைப் பார்க்க உனக்கு ஒரு வாய்ப்பு கொடுக்கிறியா?',
    duration: 0, // Stays visible until user clicks the button!
    isFinal: true,
  },
];

// 3D Entrance choreography variants tailored for each of the 4 photos
const PHOTO_ENTRANCE_VARIANTS = {
  // Moment 1: Low-angle misty roll entrance emerging from enchanted forest depth
  1: {
    initial: {
      opacity: 0,
      scale: 0.78,
      rotateX: 24,
      rotateY: -18,
      y: 65,
      z: -160,
      filter: 'blur(14px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      y: 0,
      z: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.35,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 1.08,
      rotateX: -12,
      rotateY: 10,
      y: -25,
      z: 80,
      filter: 'blur(10px)',
      transition: {
        duration: 0.85,
        ease: [0.32, 0, 0.67, 0],
      },
    },
  },

  // Moment 2: Sweeping 3D helical spiral from left with crystalline refraction angle
  2: {
    initial: {
      opacity: 0,
      scale: 0.82,
      rotateX: -14,
      rotateY: 28,
      x: -80,
      z: -140,
      filter: 'blur(14px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      x: 0,
      z: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      rotateY: -24,
      z: -100,
      filter: 'blur(10px)',
      transition: {
        duration: 0.85,
        ease: [0.32, 0, 0.67, 0],
      },
    },
  },

  // Moment 3: Grand royal descending vantage with rose-gold light trails
  3: {
    initial: {
      opacity: 0,
      scale: 0.84,
      rotateX: -20,
      rotateY: -14,
      y: -55,
      z: -150,
      filter: 'blur(14px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      y: 0,
      z: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 1.12,
      rotateX: 14,
      z: 110,
      filter: 'blur(10px)',
      transition: {
        duration: 0.9,
        ease: [0.32, 0, 0.67, 0],
      },
    },
  },

  // Moment 4: Expansive floral portal zoom & forward perspective invitation
  4: {
    initial: {
      opacity: 0,
      scale: 1.2,
      rotateX: 16,
      z: 130,
      filter: 'blur(14px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      z: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.84,
      z: -160,
      filter: 'blur(12px)',
      transition: {
        duration: 0.85,
      },
    },
  },
};

export default function HeartbeatIntro({ onUnlock }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinalSceneReady, setIsFinalSceneReady] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [beatType, setBeatType] = useState('IDLE'); // 'IDLE' | 'LUB' | 'DUB'
  const [isMuted, setIsMuted] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const canvasRef = useRef(null);
  const advanceTimerRef = useRef(null);

  // Audio refs for clean single-instance management
  const introAudioRef = useRef(null);
  const rainAudioContextRef = useRef(null);
  const rainGainNodeRef = useRef(null);
  const thunderTimeoutRef = useRef(null);
  const isAudioCleanedUpRef = useRef(false);

  const currentDialogue = DIALOGUES[currentIndex] || DIALOGUES[0];
  const currentMoment = MOMENTS[currentDialogue.momentIndex] || MOMENTS[0];

  // Preload all 4 photos immediately for instant zero-lag transitions
  useEffect(() => {
    MOMENTS.forEach((m) => {
      const img1 = new Image();
      img1.src = m.image;
      if (m.fallbackImage) {
        const img2 = new Image();
        img2.src = m.fallbackImage;
      }
    });

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Show the “என் மனசுக்குள் வா” button immediately when the main intro entrance animation completes (~1.4s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinueButton(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // --------------------------------------------------------------------------
  // 1. SYNCHRONIZE WITH HEARTBEAT & INTRO AUDIO
  // --------------------------------------------------------------------------
  useEffect(() => {
    isAudioCleanedUpRef.current = false;

    // Start Web Audio synthetic heartbeat engine
    if (window.heartbeatEngine) {
      window.heartbeatEngine.start();
      window.heartbeatEngine.setTargetBPM(54, 0.24);
    }

    // Subscribe to real-time LUB-DUB beat events
    const unsubscribeHeartbeat = globalHeartbeatEngine.subscribeBeat((type) => {
      if (isAudioCleanedUpRef.current) return;
      if (type === 'LUB') {
        setBeatType('LUB');
        setPulseScale(1.028);
        setTimeout(() => setPulseScale(1.008), 120);
      } else if (type === 'DUB') {
        setBeatType('DUB');
        setPulseScale(1.045);
        setTimeout(() => setPulseScale(1.0), 160);
      }
    });

    // Play public/intro.mp3 at full volume (looping)
    const introAudio = new Audio('/intro.mp3');
    introAudio.loop = true;
    introAudio.volume = 1.0;
    introAudioRef.current = introAudio;

    const playIntroMusic = () => {
      if (isAudioCleanedUpRef.current) return;
      if (introAudioRef.current && introAudioRef.current.paused) {
        introAudioRef.current.play().catch(() => {});
      }
      if (rainAudioContextRef.current && rainAudioContextRef.current.state === 'suspended') {
        rainAudioContextRef.current.resume().catch(() => {});
      }
      if (window.heartbeatEngine && window.heartbeatEngine.audioCtx?.state === 'suspended') {
        window.heartbeatEngine.audioCtx.resume().catch(() => {});
      }
    };

    playIntroMusic();

    window.addEventListener('click', playIntroMusic, { once: true });
    window.addEventListener('touchstart', playIntroMusic, { once: true });
    window.addEventListener('keydown', playIntroMusic, { once: true });

    // Web Audio Synthesizer for soft Rain and Distant Rolling Thunder Ambience
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        rainAudioContextRef.current = ctx;

        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
        const leftChannel = noiseBuffer.getChannelData(0);
        const rightChannel = noiseBuffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
          const whiteL = Math.random() * 2 - 1;
          const whiteR = Math.random() * 2 - 1;
          leftChannel[i] = (leftChannel[i - 1] || 0) * 0.92 + whiteL * 0.08;
          rightChannel[i] = (rightChannel[i - 1] || 0) * 0.92 + whiteR * 0.08;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(1300, ctx.currentTime);
        bandpass.Q.setValueAtTime(0.7, ctx.currentTime);

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(2600, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGainNodeRef.current = rainGain;
        rainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        rainGain.gain.linearRampToValueAtTime(0.065, ctx.currentTime + 2.0);

        noiseNode.connect(bandpass);
        bandpass.connect(lowpass);
        lowpass.connect(rainGain);
        rainGain.connect(ctx.destination);
        noiseNode.start(0);

        // Distant subtle thunder every 26-34s
        const scheduleThunder = () => {
          if (isAudioCleanedUpRef.current) return;
          const delay = 26000 + Math.random() * 8000;
          thunderTimeoutRef.current = setTimeout(() => {
            try {
              if (
                isAudioCleanedUpRef.current ||
                !rainAudioContextRef.current ||
                rainAudioContextRef.current.state !== 'running'
              )
                return;
              const tCtx = rainAudioContextRef.current;
              const now = tCtx.currentTime;

              const tNoise = tCtx.createBufferSource();
              tNoise.buffer = noiseBuffer;
              const tFilter = tCtx.createBiquadFilter();
              tFilter.type = 'lowpass';
              tFilter.frequency.setValueAtTime(75, now);
              tFilter.frequency.exponentialRampToValueAtTime(36, now + 3.2);

              const tGain = tCtx.createGain();
              tGain.gain.setValueAtTime(0.0001, now);
              tGain.gain.linearRampToValueAtTime(0.045, now + 0.45);
              tGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

              tNoise.connect(tFilter);
              tFilter.connect(tGain);
              tGain.connect(tCtx.destination);
              tNoise.start(now);
              tNoise.stop(now + 3.8);
            } catch {}
            scheduleThunder();
          }, delay);
        };

        scheduleThunder();
      }
    } catch (e) {
      console.warn('Atmospheric audio init deferred:', e);
    }

    // Cleanup when component unmounts
    return () => {
      isAudioCleanedUpRef.current = true;
      unsubscribeHeartbeat();
      window.removeEventListener('click', playIntroMusic);
      window.removeEventListener('touchstart', playIntroMusic);
      window.removeEventListener('keydown', playIntroMusic);

      // Stop heartbeat engine immediately
      if (window.heartbeatEngine) {
        window.heartbeatEngine.pause();
      }

      // Stop intro music
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current.currentTime = 0;
        introAudioRef.current = null;
      }

      if (thunderTimeoutRef.current) {
        clearTimeout(thunderTimeoutRef.current);
        thunderTimeoutRef.current = null;
      }

      if (rainAudioContextRef.current && rainAudioContextRef.current.state !== 'closed') {
        try {
          rainAudioContextRef.current.close().catch(() => {});
        } catch {}
      }
    };
  }, []);

  // Duck rain audio during important emotional lines so Tamil dialogue is crystalline
  useEffect(() => {
    if (rainGainNodeRef.current && rainAudioContextRef.current && !isMuted) {
      try {
        const now = rainAudioContextRef.current.currentTime;
        const targetGain = currentDialogue.isName || currentDialogue.isFinal ? 0.035 : 0.065;
        rainGainNodeRef.current.gain.cancelScheduledValues(now);
        rainGainNodeRef.current.gain.setValueAtTime(rainGainNodeRef.current.gain.value, now);
        rainGainNodeRef.current.gain.linearRampToValueAtTime(targetGain, now + 0.5);
      } catch {}
    }
  }, [currentDialogue, isMuted]);

  // --------------------------------------------------------------------------
  // 2. SEQUENTIAL DIALOGUE TIMING
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (currentDialogue.isFinal) {
      setIsFinalSceneReady(true);
      return;
    }

    const duration = currentDialogue.duration || 4400;
    advanceTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next < DIALOGUES.length ? next : prev;
      });
    }, duration);

    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, [currentIndex, currentDialogue]);

  const handleNextDialogue = () => {
    if (currentIndex < DIALOGUES.length - 1) {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkipToFinal = () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setCurrentIndex(DIALOGUES.length - 1);
    setIsFinalSceneReady(true);
  };

  // --------------------------------------------------------------------------
  // 3. LAYERED 3D PARALLAX INTERACTION (Smooth mouse & touch coordinate map)
  // --------------------------------------------------------------------------
  const handleMouseMove = useCallback(
    (e) => {
      if (prefersReducedMotion) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    },
    [prefersReducedMotion]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (prefersReducedMotion || !e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const x = (touch.clientX / window.innerWidth - 0.5) * 2;
      const y = (touch.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    },
    [prefersReducedMotion]
  );

  // --------------------------------------------------------------------------
  // 4. ATMOSPHERIC CANVAS: 3D TUMBLING ROSE PETALS, GOD-RAYS, FIREFLIES, MIST
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Realistic 3D Tumbling Rose Petals with Euler/Quaternion projection
    const petals = Array.from({ length: 32 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 400 - 200, // Z-depth for stereoscopic perspective
      length: Math.random() * 12 + 10,
      width: Math.random() * 8 + 6,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      vRotX: (Math.random() - 0.5) * 0.04,
      vRotY: (Math.random() - 0.5) * 0.05,
      vRotZ: (Math.random() - 0.5) * 0.03,
      speedY: Math.random() * 0.85 + 0.65,
      speedX: (Math.random() - 0.5) * 0.45,
      driftPhase: Math.random() * Math.PI * 2,
      colorTop: Math.random() > 0.3 ? '#f43f5e' : '#fb7185',
      colorBottom: Math.random() > 0.4 ? '#881337' : '#9d174d',
      alpha: Math.random() * 0.55 + 0.35,
    }));

    // 2. Luminous Stardust Fireflies & Embers
    const fireflies = Array.from({ length: 42 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.6 + 1.2,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.5 ? '255, 215, 0' : '244, 114, 182',
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.035 + 0.02,
    }));

    // 3. Volumetric God-Rays parameters
    let rayPhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rayPhase += 0.008;

      // Draw Volumetric God-Rays streaming from top-left and top-right
      const ray1Grad = ctx.createLinearGradient(0, 0, width * 0.7, height);
      const ray1Alpha = 0.035 + 0.015 * Math.sin(rayPhase);
      ray1Grad.addColorStop(0, `rgba(251, 191, 36, ${ray1Alpha})`);
      ray1Grad.addColorStop(0.4, `rgba(244, 114, 182, ${ray1Alpha * 0.6})`);
      ray1Grad.addColorStop(1, 'transparent');
      ctx.fillStyle = ray1Grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width * 0.35, 0);
      ctx.lineTo(width * 0.85, height);
      ctx.lineTo(width * 0.25, height);
      ctx.closePath();
      ctx.fill();

      // Render 3D Tumbling Rose Petals
      petals.forEach((p) => {
        p.rotX += p.vRotX;
        p.rotY += p.vRotY;
        p.rotZ += p.vRotZ;
        p.driftPhase += 0.02;

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.driftPhase) * 0.5;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotZ);

        // 3D projection scaling based on rotX and rotY
        const scaleX = Math.cos(p.rotX);
        const scaleY = Math.sin(p.rotY);
        ctx.scale(scaleX !== 0 ? scaleX : 0.05, scaleY !== 0 ? scaleY : 0.05);

        // Petal curved silhouette
        ctx.beginPath();
        ctx.moveTo(0, -p.length / 2);
        ctx.bezierCurveTo(p.width / 2, -p.length / 3, p.width / 2, p.length / 3, 0, p.length / 2);
        ctx.bezierCurveTo(-p.width / 2, p.length / 3, -p.width / 2, -p.length / 3, 0, -p.length / 2);

        const grad = ctx.createLinearGradient(0, -p.length / 2, 0, p.length / 2);
        grad.addColorStop(0, p.colorTop);
        grad.addColorStop(1, p.colorBottom);
        ctx.fillStyle = grad;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      // Render Fireflies & Stardust Embers
      fireflies.forEach((f) => {
        f.pulse += f.pulseSpeed;
        const currentOpacity = f.opacity * (0.6 + 0.4 * Math.sin(f.pulse));

        // Core light mote
        ctx.fillStyle = `rgba(${f.color}, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();

        // Ambient glow halo
        ctx.fillStyle = `rgba(${f.color}, ${currentOpacity * 0.28})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 2.8, 0, Math.PI * 2);
        ctx.fill();

        f.y -= f.speedY;
        f.x += f.speedX + Math.sin(f.pulse * 0.6) * 0.25;

        if (f.y < -15) {
          f.y = height + 15;
          f.x = Math.random() * width;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 5. CLEAN EXIT & SCENE TRANSITION (Stops all audio cleanly & fires confetti)
  // --------------------------------------------------------------------------
  const handleFinalUnlock = () => {
    isAudioCleanedUpRef.current = true;

    // Immediately navigate to the next scene without delay
    if (typeof onUnlock === 'function') {
      onUnlock();
    }

    // Stop intro audio immediately
    if (introAudioRef.current) {
      try {
        introAudioRef.current.pause();
        introAudioRef.current.currentTime = 0;
        introAudioRef.current = null;
      } catch {}
    }

    // Stop synthetic heartbeat engine cleanly
    if (window.heartbeatEngine) {
      window.heartbeatEngine.pause();
    }

    // Stop rain & thunder
    if (thunderTimeoutRef.current) {
      clearTimeout(thunderTimeoutRef.current);
      thunderTimeoutRef.current = null;
    }
    if (rainGainNodeRef.current && rainAudioContextRef.current) {
      try {
        if (rainAudioContextRef.current.state !== 'closed') {
          rainAudioContextRef.current.close().catch(() => {});
        }
      } catch {}
    }

    // Celebration confetti
    try {
      confetti({
        particleCount: 140,
        spread: 95,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#ffd700', '#ffffff', '#ff69b4', '#c084fc', '#e11d48'],
      });
    } catch {}
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (introAudioRef.current) {
        introAudioRef.current.muted = next;
      }
      if (rainGainNodeRef.current && rainAudioContextRef.current) {
        const now = rainAudioContextRef.current.currentTime;
        rainGainNodeRef.current.gain.setValueAtTime(next ? 0.0001 : 0.065, now);
      }
      return next;
    });
  };

  // Active moment 3D tilt coordinates (safely dampened for mobile & comfort)
  const tiltX = prefersReducedMotion ? 0 : -parallax.y * 8;
  const tiltY = prefersReducedMotion ? 0 : parallax.x * 10;

  return (
    <div
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="fixed inset-0 w-full h-full bg-[#040107] text-white select-none overflow-hidden z-30 font-sans flex flex-col justify-between items-center [perspective:1400px]"
    >
      {/* 1. CINEMATIC CONTINUOUS TRAVELLING RAINBOW BORDER */}
      <CinematicRainbowBorder mode="screen" />

      {/* 2. ATMOSPHERIC 3D WORLD BACKGROUND (Deep depth-of-field blurred dreamscape) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMoment.id}
            initial={{ opacity: 0, scale: 1.12, filter: 'blur(28px)' }}
            animate={{
              opacity: 0.42,
              scale: currentMoment.id === 2 ? 1.04 * pulseScale : 1.05,
              filter: 'blur(22px)',
              x: prefersReducedMotion ? 0 : -parallax.x * 18,
              y: prefersReducedMotion ? 0 : -parallax.y * 14,
            }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(30px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${currentMoment.image}'), url('${currentMoment.fallbackImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

        {/* Cinematic Vignette & Deep Burgundy Shadow Frame */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#06010b]/55 to-[#040107]/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040107] via-transparent to-[#040107]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />
      </div>

      {/* 3. ATMOSPHERIC CANVAS OVERLAY (3D Petals, Fireflies, Light Rays) */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-10" />

      {/* 4. TOP CINEMATIC UTILITY BAR (Moment Tracker, Mute, Skip) */}
      <header className="relative z-40 w-full px-4 sm:px-8 pt-4 sm:pt-6 pb-2 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-rose-400/30 text-rose-300 text-xs font-mono shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          <span
            className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]"
            style={{
              transform: `scale(${pulseScale > 1.02 ? 1.4 : 1})`,
              transition: 'transform 0.15s ease-out',
            }}
          />
          <span className="font-semibold text-rose-200">Moment {currentMoment.id} of 4</span>
          <span className="text-white/30">|</span>
          <span className="text-white/90 font-serif italic">{currentMoment.name}</span>
          <span className="hidden sm:inline text-rose-300/80 font-sans text-[11px]">
            ({currentMoment.subtitle})
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/20 text-rose-200 hover:text-white transition active:scale-95 cursor-pointer shadow-lg"
            title={isMuted ? 'ஒலியை இயக்கு' : 'ஒலியை நிறுத்து'}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </header>

      {/* 5. HERO 3D FLOATING PHOTO GALLERY & CENTRAL STAGE */}
      <main className="relative z-30 w-full flex-1 flex flex-col items-center justify-between px-4 py-1 sm:py-2 pointer-events-auto overflow-hidden">
        {/* Upper photo gallery area (constrained above center line so photo is never covered) */}
        <div className="w-full flex-1 flex items-center justify-center max-h-[44vh] sm:max-h-[46vh] pointer-events-auto">
          <div className="relative w-full max-w-[88vw] sm:max-w-[480px] md:max-w-[540px] flex items-center justify-center [transform-style:preserve-3d]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMoment.id}
              variants={PHOTO_ENTRANCE_VARIANTS[currentMoment.id]}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full [transform-style:preserve-3d] flex items-center justify-center"
            >
              {/* Outer Interactive 3D Frame with Springy Tilt & Breathing Physics */}
              <motion.div
                animate={{
                  rotateX: tiltX,
                  rotateY: tiltY,
                  scale: pulseScale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 18,
                  mass: 0.8,
                }}
                className="relative w-full aspect-[16/10] sm:aspect-[16/9.8] rounded-3xl [transform-style:preserve-3d] will-change-transform group"
              >
                {/* 3D Layer -1: Deep Cast Shadow Plane onto Atmosphere */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-300"
                  style={{
                    transform: `translate3d(${-tiltY * 1.5}px, ${30 + tiltX * 1.5}px, -45px)`,
                    boxShadow: `0 45px 95px -10px rgba(0, 0, 0, 0.95), 0 0 70px ${currentMoment.glowColor}`,
                    background: 'rgba(0, 0, 0, 0.45)',
                    filter: 'blur(16px)',
                  }}
                />

                {/* 3D Layer 0: Royal Beveled Frame Base in Rose-Gold & Obsidian Lacquer */}
                <div
                  className="absolute -inset-[3px] sm:-inset-[4px] rounded-[28px] pointer-events-none [transform-style:preserve-3d]"
                  style={{
                    transform: 'translateZ(0px)',
                    background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(244,114,182,0.6) 25%, rgba(30,10,25,0.95) 50%, rgba(251,191,36,0.6) 75%, rgba(255,255,255,0.4) 100%)`,
                    boxShadow: `0 0 35px ${currentMoment.glowColor}, inset 0 1px 2px rgba(255,255,255,0.5)`,
                  }}
                />

                {/* 3D Layer 1: Chamfered Inner Obsidian Bezel */}
                <div
                  className="absolute inset-0 rounded-[25px] overflow-hidden bg-[#0c0410] border border-rose-400/40 shadow-[inset_0_0_40px_rgba(0,0,0,0.85)] [transform-style:preserve-3d]"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  {/* The Pristine Original Photo Asset (Untouched Content & Full Resolution) */}
                  <img
                    src={currentMoment.image}
                    alt={currentMoment.name}
                    className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-105"
                    onError={(e) => {
                      if (e.currentTarget.src !== currentMoment.fallbackImage) {
                        e.currentTarget.src = currentMoment.fallbackImage;
                      }
                    }}
                  />

                  {/* Inner Soft Vignette Edge for Luxury Cinema Blend */}
                  <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/60 pointer-events-none" />

                  {/* Dynamic Specular Glass Glare Layer (Shifts across photo as cursor/device tilts) */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out"
                    style={{
                      transform: `translate3d(${tiltY * 5}px, ${tiltX * 5}px, 15px)`,
                      background:
                        'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.04) 60%, transparent 80%)',
                      mixBlendMode: 'overlay',
                    }}
                  />
                </div>

                {/* 3D Layer 2: Real-time Heartbeat Shockwave Aura (Intensifies on Moment 2 & 4) */}
                <div
                  className="absolute -inset-4 sm:-inset-6 rounded-[34px] pointer-events-none transition-opacity duration-200"
                  style={{
                    transform: 'translateZ(18px)',
                    border: `1.5px solid ${currentMoment.accentColor}`,
                    opacity: pulseScale > 1.02 ? 0.75 : 0.15,
                    boxShadow: `0 0 45px ${currentMoment.glowColor}`,
                    transformStyle: 'preserve-3d',
                  }}
                />

                {/* 3D Layer 3: Floating Rose-Gold Corner Filigrees Hovering in True 3D */}
                <div
                  className="absolute inset-0 pointer-events-none [transform-style:preserve-3d]"
                  style={{ transform: 'translateZ(34px)' }}
                >
                  {/* Top-Left Filigree */}
                  <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-amber-300/80 rounded-tl-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
                  </div>
                  {/* Top-Right Filigree */}
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-amber-300/80 rounded-tr-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
                  </div>
                  {/* Bottom-Left Filigree */}
                  <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-amber-300/80 rounded-bl-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
                  </div>
                  {/* Bottom-Right Filigree */}
                  <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-amber-300/80 rounded-br-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
                  </div>

                  {/* Top Center Floating Romantic Jewel Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-amber-300/60 shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(244,63,94,0.6)] flex items-center gap-1.5 text-[11px] font-mono text-amber-200">
                    <Heart
                      size={11}
                      className="fill-rose-500 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,1)] animate-pulse"
                    />
                    <span className="tracking-widest uppercase font-semibold">Memory {currentMoment.id}</span>
                  </div>

                  {/* Bottom Floating Subtitle Pill */}
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 max-w-[88%] px-4 py-1 rounded-full bg-black/85 backdrop-blur-md border border-rose-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(168,85,247,0.5)] flex items-center gap-2 text-xs font-serif text-rose-100 whitespace-nowrap overflow-hidden text-ellipsis">
                    <Sparkles size={11} className="text-amber-300 shrink-0" />
                    <span className="italic">{currentMoment.subtitle}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

        {/* ==================================================================== */}
        {/* EXACT CENTER: “என் மனசுக்குள் வா” BUTTON                              */}
        {/* ==================================================================== */}
        <AnimatePresence>
          {showContinueButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.85, x: '-50%', y: '-50%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-1/2 left-1/2 z-50 pointer-events-auto"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 35px rgba(244,63,94,0.85), 0 0 15px rgba(251,191,36,0.6)' }}
                whileTap={{ scale: 0.94 }}
                onClick={handleFinalUnlock}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600/95 via-pink-600/95 to-purple-600/95 hover:from-rose-500 hover:to-purple-500 text-white font-semibold text-base sm:text-lg tracking-wide shadow-[0_0_30px_rgba(244,63,94,0.7),0_4px_25px_rgba(0,0,0,0.6)] border border-rose-300/50 backdrop-blur-xl flex items-center gap-3 transition-all cursor-pointer group select-none"
                title="என் மனசுக்குள் வா"
                aria-label="என் மனசுக்குள் வா"
              >
                <Heart className="w-4 h-4 fill-white text-rose-200 group-hover:scale-125 transition-transform duration-300" />
                <span className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] font-serif">என் மனசுக்குள் வா</span>
                <ArrowRight className="w-4 h-4 text-rose-100 group-hover:translate-x-1.5 transition-transform duration-200" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================================== */}
        {/* CINEMATIC LOWER DIALOGUE CONSOLE (Unobscured & Below Center Line)    */}
        {/* ================================================================== */}
        <div className="w-full max-w-xl flex-1 flex items-center justify-center max-h-[38vh] sm:max-h-[40vh] pointer-events-auto">
          <div className="relative z-40 w-full flex flex-col items-center text-center pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDialogue.id}
                initial={{ opacity: 0, y: 16, scale: 0.96, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, scale: 0.98, filter: 'blur(5px)' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <div className="w-full px-5 sm:px-7 py-4 sm:py-5 rounded-2xl bg-black/70 backdrop-blur-2xl border border-rose-400/35 shadow-[0_15px_45px_rgba(0,0,0,0.85),0_0_30px_rgba(244,63,94,0.18)] flex flex-col items-center space-y-2.5">
                  {currentDialogue.isName ? (
                    /* Dramatic Name Reveal: “சரண்யா…” */
                    <div className="space-y-1.5 py-1">
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-mono text-rose-300 font-semibold drop-shadow">
                        Dedicated To My One & Only
                      </span>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-wider drop-shadow-[0_0_35px_rgba(244,114,182,0.95)]">
                        {currentDialogue.text}
                      </h1>
                    </div>
                  ) : (
                    /* Emotional Tamil Dialogue Line */
                    <div className="space-y-2 py-0.5">
                      <p className="text-base sm:text-xl md:text-2xl font-serif font-medium text-white leading-relaxed drop-shadow-[0_2px_18px_rgba(244,63,94,0.65)]">
                        “{currentDialogue.text}”
                      </p>

                      {currentDialogue.isFinal && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.7 }}
                          className="text-xs sm:text-sm font-serif italic text-amber-200/90 tracking-wide drop-shadow"
                        >
                          ஒரு அழகான கதை… உன்னால்தான் ஆரம்பிக்குது. ✨
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Manual tap to continue button */}
                  {!currentDialogue.isFinal && (
                    <button
                      onClick={handleNextDialogue}
                      className="mt-1 px-4 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-rose-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                    >
                      <span>தொடர தட்டவும்</span>
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* 6. BOTTOM CARDIAC INDICATOR & DIALOGUE TIMELINE DOTS */}
      <footer className="relative z-40 w-full px-4 sm:px-6 py-3 sm:py-4 flex flex-col items-center gap-2 pointer-events-none">
        {/* Dialogue beat dots */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {DIALOGUES.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => {
                if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
                setCurrentIndex(idx);
                if (d.isFinal) setIsFinalSceneReady(true);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]'
                  : idx < currentIndex
                  ? 'w-2 bg-rose-400/50'
                  : 'w-1.5 bg-white/20'
              }`}
              title={`Dialogue ${idx + 1}`}
            />
          ))}
        </div>

        {/* Synchronized Heartbeat ECG Pulse Badge */}
        <div className="flex items-center gap-2 text-rose-300/70 text-[11px] font-mono">
          <span
            className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"
            style={{
              transform: `scale(${pulseScale > 1.02 ? 1.5 : 1})`,
              transition: 'transform 0.12s ease-out',
            }}
          />
          <span>Synchronized Heartbeat · The Eternal Romantic Garden</span>
        </div>
      </footer>
    </div>
  );
}
