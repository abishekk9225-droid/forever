import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import CinematicRainbowBorder from './CinematicRainbowBorder';
import { globalAudioEngine as globalHeartbeatEngine } from '../utils/audioEngine';

// ============================================================================
// THE FOUR CINEMATIC INTRO MOMENTS & ASSET PATHS
// ============================================================================
const MOMENTS = [
  {
    id: 1,
    name: 'Eternal Forest',
    subtitle: 'மாய வனத்தின் தொடக்கம்',
    image: '/eternal-forest.png',
    fallbackImage: '/eternal-forest.png.png',
  },
  {
    id: 2,
    name: 'Crystal Heart',
    subtitle: 'ஸ்படிக இதயத்தின் துடிப்பு',
    image: '/crystal-heart.png',
    fallbackImage: '/crysteternal-forest.png.png',
  },
  {
    id: 3,
    name: 'SARANYA Reveal',
    subtitle: 'சரண்யாவின் பிரகாசம்',
    image: '/saranya-reveal.png',
    fallbackImage: '/saranya-reveal.png.png',
  },
  {
    id: 4,
    name: 'Enter Our Story',
    subtitle: 'காதல் தோட்டத்தின் அழைப்பு',
    image: '/enter-our-story.png',
    fallbackImage: '/enter-our-story.png.png',
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

export default function HeartbeatIntro({ onUnlock }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinalSceneReady, setIsFinalSceneReady] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const advanceTimerRef = useRef(null);

  // Audio refs
  const introAudioRef = useRef(null);
  const rainAudioContextRef = useRef(null);
  const rainGainNodeRef = useRef(null);
  const thunderTimeoutRef = useRef(null);

  const currentDialogue = DIALOGUES[currentIndex] || DIALOGUES[0];
  const currentMoment = MOMENTS[currentDialogue.momentIndex] || MOMENTS[0];

  // --------------------------------------------------------------------------
  // 1. AUDIO MANAGEMENT: intro.mp3 (Full Volume) + Web Audio Rain/Thunder
  // STRICTLY PRESERVES EXISTING HEARTBEAT
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Preserve existing heartbeat sound
    if (window.heartbeatEngine) {
      window.heartbeatEngine.start();
    }

    // Subscribe to pulse beats for crystal heart visual pulse
    const unsubscribeHeartbeat = globalHeartbeatEngine.subscribeBeat((type) => {
      if (type === 'LUB') {
        setPulseScale(1.08);
        setTimeout(() => setPulseScale(1.02), 120);
      } else if (type === 'DUB') {
        setPulseScale(1.14);
        setTimeout(() => setPulseScale(1.0), 160);
      }
    });

    // Background Music: public/intro.mp3 at full volume (volume: 1.0)
    const introAudio = new Audio('/intro.mp3');
    introAudio.loop = true;
    introAudio.volume = 1.0;
    introAudioRef.current = introAudio;

    const playIntroMusic = () => {
      if (introAudioRef.current && introAudioRef.current.paused) {
        introAudioRef.current.play().catch(() => {});
      }
      if (rainAudioContextRef.current && rainAudioContextRef.current.state === 'suspended') {
        rainAudioContextRef.current.resume().catch(() => {});
      }
    };

    playIntroMusic();

    window.addEventListener('click', playIntroMusic, { once: true });
    window.addEventListener('touchstart', playIntroMusic, { once: true });
    window.addEventListener('keydown', playIntroMusic, { once: true });

    // Web Audio Synthesizer for Rain and Distant Rolling Thunder
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

        // Distant subtle thunder every 24-32s
        const scheduleThunder = () => {
          const delay = 24000 + Math.random() * 8000;
          thunderTimeoutRef.current = setTimeout(() => {
            try {
              if (!rainAudioContextRef.current || rainAudioContextRef.current.state !== 'running') return;
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
      console.warn('Rain ambience init deferred:', e);
    }

    return () => {
      unsubscribeHeartbeat();
      window.removeEventListener('click', playIntroMusic);
      window.removeEventListener('touchstart', playIntroMusic);
      window.removeEventListener('keydown', playIntroMusic);

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

  // Soft ducking of rain during important lines so Tamil text is completely clear
  useEffect(() => {
    if (rainGainNodeRef.current && rainAudioContextRef.current) {
      try {
        const now = rainAudioContextRef.current.currentTime;
        const targetGain = currentDialogue.isName || currentDialogue.isFinal ? 0.04 : 0.065;
        rainGainNodeRef.current.gain.cancelScheduledValues(now);
        rainGainNodeRef.current.gain.setValueAtTime(rainGainNodeRef.current.gain.value, now);
        rainGainNodeRef.current.gain.linearRampToValueAtTime(targetGain, now + 0.5);
      } catch {}
    }
  }, [currentDialogue]);

  // --------------------------------------------------------------------------
  // 2. SEQUENTIAL DIALOGUE ADVANCE TIMING
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
  // 3. PARALLAX EFFECT FOR 3D DEPTH
  // --------------------------------------------------------------------------
  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setParallax({ x, y });
  }, []);

  // --------------------------------------------------------------------------
  // 4. FLOATING FIREFLIES & MAGIC DUST CANVAS OVERLAY
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

    const particles = Array.from({ length: 48 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1.2,
      speedY: Math.random() * 0.45 + 0.15,
      speedX: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.65 + 0.25,
      color: Math.random() > 0.45 ? 'rgba(255, 215, 0,' : 'rgba(244, 114, 182,',
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.pulse += 0.035;
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.fillStyle = `${p.color} ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow halo
        ctx.fillStyle = `${p.color} ${currentOpacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.pulse * 0.5) * 0.2;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
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
  // 5. CLEAN EXIT TO PASSCODE GATE (Stops audio & triggers confetti)
  // --------------------------------------------------------------------------
  const handleFinalUnlock = () => {
    // Smoothly fade out intro.mp3
    if (introAudioRef.current) {
      const audio = introAudioRef.current;
      let vol = audio.volume;
      const fadeStep = () => {
        vol = Math.max(0, vol - 0.16);
        audio.volume = vol;
        if (vol > 0) {
          setTimeout(fadeStep, 50);
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      };
      fadeStep();
    }

    // Stop rain & thunder
    if (thunderTimeoutRef.current) {
      clearTimeout(thunderTimeoutRef.current);
      thunderTimeoutRef.current = null;
    }
    if (rainGainNodeRef.current && rainAudioContextRef.current) {
      try {
        const now = rainAudioContextRef.current.currentTime;
        rainGainNodeRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.5);
        setTimeout(() => {
          if (rainAudioContextRef.current && rainAudioContextRef.current.state !== 'closed') {
            rainAudioContextRef.current.close().catch(() => {});
          }
        }, 600);
      } catch {}
    }

    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ffd700', '#ffffff', '#ff69b4', '#c084fc'],
    });

    setTimeout(() => {
      if (typeof onUnlock === 'function') {
        onUnlock();
      }
    }, 650);
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

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-full h-full bg-[#05010a] text-white select-none overflow-hidden z-30 font-sans flex flex-col items-center justify-between [perspective:1200px]"
    >
      {/* 1. CINEMATIC RAINBOW BORDER ACROSS SCREEN PERIMETER */}
      <CinematicRainbowBorder mode="screen" />

      {/* 2. LAYERED 3D BACKGROUND ARTWORK FOR THE FOUR MOMENTS */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMoment.id}
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            animate={{
              opacity: 1,
              scale: currentMoment.id === 2 ? pulseScale : 1.02,
              filter: 'blur(0px)',
              x: parallax.x * 12,
              y: parallax.y * 10,
              rotateX: -parallax.y * 2.5,
              rotateY: parallax.x * 2.5,
            }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 w-full h-full [transform-style:preserve-3d]"
          >
            {/* Background Image with Fallback and 3D Depth */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700"
              style={{
                backgroundImage: `url('${currentMoment.image}'), url('${currentMoment.fallbackImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: currentMoment.id === 2
                  ? 'brightness(1.08) contrast(1.08) drop-shadow(0 0 45px rgba(236,72,153,0.35))'
                  : currentMoment.id === 3
                  ? 'brightness(1.06) contrast(1.06)'
                  : 'brightness(0.98)',
              }}
            />

            {/* Moment-specific 3D lighting & bloom overlay */}
            {currentMoment.id === 2 && (
              /* Moment B: Crystal Heart Radial Light Pulse */
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at 50% 48%, rgba(244,63,94,0.28) 0%, rgba(168,85,247,0.18) 40%, transparent 75%)',
                  opacity: pulseScale > 1.05 ? 1 : 0.75,
                }}
              />
            )}

            {currentMoment.id === 3 && (
              /* Moment C: SARANYA Reveal Atmospheric Light Sweep */
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 50%, rgba(244,114,182,0.22) 0%, rgba(192,132,252,0.14) 45%, transparent 75%)',
                }}
              />
            )}

            {currentMoment.id === 4 && (
              /* Moment D: Enter Our Story Golden Magical Garden Glow */
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 65%, rgba(251,191,36,0.18) 0%, rgba(244,63,94,0.14) 45%, transparent 75%)',
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Vignette & Deep Violet Shadow Frame */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/55 pointer-events-none" />
      </div>

      {/* 3. FLOATING FIREFLIES & MAGIC DUST CANVAS */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 4. TOP UTILITY BAR (Scene indicator, Mute, Skip) */}
      <div className="relative z-40 w-full px-5 sm:px-8 py-5 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-rose-400/25 text-rose-300 text-xs font-mono shadow-lg">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
          <span className="font-semibold">Moment {currentMoment.id} of 4</span>
          <span className="text-gray-400">·</span>
          <span className="text-rose-200/90 font-serif italic">{currentMoment.name}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/15 text-rose-200 hover:text-white transition active:scale-95 cursor-pointer shadow-lg"
            title={isMuted ? 'ஒலியை இயக்கு' : 'ஒலியை நிறுத்து'}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {!isFinalSceneReady && (
            <button
              onClick={handleSkipToFinal}
              className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-rose-950/70 backdrop-blur-md border border-rose-400/35 text-rose-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-lg"
              title="நேரடியாக இறுதி அழைப்புக்கு செல்ல"
            >
              <Sparkles size={12} className="text-amber-300 animate-spin" />
              <span>நேரடியாக இறுதிக்கு →</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. CENTRAL 3D GLASS DIALOGUE CARD — ELEGANT TAMIL STORYTELLING */}
      <div className="relative z-40 w-full max-w-2xl px-6 py-4 flex-1 flex flex-col items-center justify-center text-center pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDialogue.id}
            initial={{ opacity: 0, y: 22, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.97, filter: 'blur(6px)' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center justify-center space-y-4"
          >
            {/* Elegant Translucent Scrim for 100% Text Readability against rich artwork */}
            <div className="w-full max-w-xl px-6 sm:px-8 py-6 rounded-3xl bg-black/55 backdrop-blur-xl border border-rose-400/30 shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_30px_rgba(244,114,182,0.18)] flex flex-col items-center space-y-4">
              {currentDialogue.isName ? (
                /* Dramatic Name Reveal: “சரண்யா…” */
                <div className="space-y-2 py-1">
                  <span className="text-[11px] uppercase tracking-[0.3em] font-mono text-rose-300 font-semibold drop-shadow">
                    Dedicated To My One & Only
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-wider drop-shadow-[0_0_30px_rgba(244,114,182,0.9)]">
                    {currentDialogue.text}
                  </h1>
                </div>
              ) : (
                /* Emotional Tamil Dialogue Line */
                <div className="space-y-3 py-1">
                  <p className="text-lg sm:text-2xl md:text-3xl font-serif font-medium text-white leading-relaxed drop-shadow-[0_2px_20px_rgba(244,63,94,0.55)]">
                    “{currentDialogue.text}”
                  </p>

                  {currentDialogue.isFinal && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="text-xs sm:text-sm font-serif italic text-amber-200/90 tracking-wide drop-shadow"
                    >
                      ஒரு அழகான கதை… உன்னால்தான் ஆரம்பிக்குது. ✨
                    </motion.p>
                  )}
                </div>
              )}

              {/* Tap to continue faster button */}
              {!currentDialogue.isFinal && (
                <button
                  onClick={handleNextDialogue}
                  className="mt-1 px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-rose-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                >
                  <span>தொடர தட்டவும்</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 6. MOMENT D: FINAL STORY BUTTON — “என் மனசுக்குள்ள வா ❤️” */}
        {isFinalSceneReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleFinalUnlock}
              className="w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-base sm:text-lg shadow-[0_0_45px_rgba(244,63,94,0.65),0_0_20px_rgba(168,85,247,0.45)] border border-rose-400/40 flex items-center justify-center gap-3 transition cursor-pointer group"
            >
              <Heart className="w-5 h-5 fill-white group-hover:scale-120 transition-transform duration-300" />
              <span>என் மனசுக்குள்ள வா ❤️</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* 7. BOTTOM PROGRESS DOTS & CARDIAC INDICATOR */}
      <div className="relative z-40 w-full px-6 py-5 flex flex-col items-center gap-2.5 pointer-events-none">
        {/* Dialogue beats indicator */}
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
                  ? 'w-6 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]'
                  : idx < currentIndex
                  ? 'w-2 bg-rose-400/45'
                  : 'w-1.5 bg-white/20'
              }`}
              title={`Dialogue ${idx + 1}`}
            />
          ))}
        </div>

        {/* Heartbeat connection badge */}
        <div className="flex items-center gap-2 text-rose-300/60 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          <span>Synchronized Heartbeat · The Eternal Romantic Garden</span>
        </div>
      </div>
    </div>
  );
}
