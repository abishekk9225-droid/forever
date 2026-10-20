import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Umbrella, Phone, ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { globalAudioEngine } from '../utils/audioEngine';

// ============================================================================
// CONFIGURATION CONSTANTS (Fill with your personal link/audio if desired)
// ============================================================================
export const TALK_LINK = ""; // Fill in your personal WhatsApp or tel: link (e.g. "https://wa.me/..." or "tel:...")
export const VOICE_CLIP = ""; // Fill in path to personal audio voice clip if available, or leave empty

export default function UmbrellaScene({ onComplete }) {
  const { isPlaying } = useSound();

  // Phase control: 0 = Black, 1 = Storm, 2 = Umbrella interactive, 3 = Climax, 4 = Question
  const [phase, setPhase] = useState(0);
  const [showTalkScreen, setShowTalkScreen] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [activeThoughtIndex, setActiveThoughtIndex] = useState(-1);
  const [activeShelterLineIndex, setActiveShelterLineIndex] = useState(-1);
  const [showInactivityHint, setShowInactivityHint] = useState(false);
  const [showEscapeButton, setShowEscapeButton] = useState(false);
  const [isHoldingUmbrella, setIsHoldingUmbrella] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Canvas & Audio refs
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const rainNoiseNodeRef = useRef(null);
  const rainFilterRef = useRef(null);
  const rainGainRef = useRef(null);
  const drumGainRef = useRef(null);
  const heartbeatTimerRef = useRef(null);
  const heartbeatGainRef = useRef(null);
  const windGainRef = useRef(null);
  const sunriseOscsRef = useRef([]);

  // Animation and physics refs
  const animFrameRef = useRef(null);
  const targetPosRef = useRef({ x: 0, y: 0 });
  const currPosRef = useRef({ x: 0, y: 0 });
  const windOffsetRef = useRef({ x: 0, y: 0 });
  const isCoveringRef = useRef(false);
  const isAcceptingRef = useRef(false);
  const sceneStartTimeRef = useRef(Date.now());
  const lastProgressTimeRef = useRef(Date.now());
  const thunderTimerRef = useRef(null);

  // Respect reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const handler = (e) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  // --------------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHESIZER (Single AudioContext, Zero External Assets)
  // --------------------------------------------------------------------------
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master gain for UmbrellaScene
      const masterGain = ctx.createGain();
      masterGainRef.current = masterGain;
      const isMuted = globalAudioEngine?.isMuted || !isPlaying;
      masterGain.gain.setValueAtTime(isMuted ? 0.0001 : 1.0, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // --- A. Heavy Rain Noise Generator ---
      const bufferSize = ctx.sampleRate * 2.5;
      const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const left = noiseBuffer.getChannelData(0);
      const right = noiseBuffer.getChannelData(1);
      for (let i = 0; i < bufferSize; i++) {
        const wL = Math.random() * 2 - 1;
        const wR = Math.random() * 2 - 1;
        left[i] = (left[i - 1] || 0) * 0.93 + wL * 0.07;
        right[i] = (right[i - 1] || 0) * 0.93 + wR * 0.07;
      }

      const rainSource = ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;
      rainNoiseNodeRef.current = rainSource;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(2600, ctx.currentTime);
      rainFilterRef.current = rainFilter;

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      rainGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.8);
      rainGainRef.current = rainGain;

      rainSource.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(masterGain);
      rainSource.start(0);

      // --- B. Umbrella Fabric Drumming Ticks (Under shelter layer) ---
      const drumGain = ctx.createGain();
      drumGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      drumGainRef.current = drumGain;
      rainFilter.connect(drumGain);
      drumGain.connect(masterGain);

      // --- C. Wind Swells ---
      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      windGainRef.current = windGain;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(380, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.8, ctx.currentTime);

      rainSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);

      // --- D. Heartbeat Synthesizer (Double-thump that calms with progress) ---
      const hbGain = ctx.createGain();
      hbGain.gain.setValueAtTime(0.16, ctx.currentTime);
      hbGain.connect(masterGain);
      heartbeatGainRef.current = hbGain;
    } catch (e) {
      console.warn('UmbrellaScene audio init deferred:', e);
    }
  }, [isPlaying]);

  // Sync mute state dynamically (Amendment 4)
  useEffect(() => {
    if (!masterGainRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const isMuted = globalAudioEngine?.isMuted || !isPlaying;
    const target = isMuted ? 0.0001 : 1.0;
    masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
    masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
    masterGainRef.current.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.2);
  }, [isPlaying]);

  // Play synthetic thunder crash
  const playThunderSound = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Low frequency thunder noise
      const bufferSize = ctx.sampleRate * 3.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 1.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(85, now);
      filter.frequency.exponentialRampToValueAtTime(42, now + 3.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current);
      noise.start(now);
      noise.stop(now + 3.6);

      // Subtle phone vibration pulse on thunder
      if (typeof navigator !== 'undefined' && navigator.vibrate && !prefersReducedMotion) {
        navigator.vibrate(45);
      }
    } catch {}
  }, [prefersReducedMotion]);

  // Soft line milestone chime
  const playChime = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.35); // E6

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(now);
      osc.stop(now + 1.25);
    } catch {}
  }, []);

  // Climax warm pad chord
  const playSunriseChords = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      // F# major / D# minor warm romantic pad frequencies (F#3, A#3, C#4, F4)
      const freqs = [185.0, 233.08, 277.18, 349.23, 440.0];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 1.5, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.065 / freqs.length, now + 2.5);

        osc.connect(gain);
        gain.connect(masterGainRef.current);
        osc.start(now);
        sunriseOscsRef.current.push({ osc, gain });
      });

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 80, 50, 100]);
      }
    } catch {}
  }, []);

  // Button click sound
  const playClickSound = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }, []);

  // --------------------------------------------------------------------------
  // 2. TIMELINE & PHASE PROGRESSION (Phases 0 -> 1 -> 2 -> 3 -> 4)
  // --------------------------------------------------------------------------
  useEffect(() => {
    initAudio();

    // Phase 0: Pure black (2s)
    const tPhase1 = setTimeout(() => {
      setPhase(1);
    }, 2400);

    // Phase 1 to Phase 2: Start umbrella interaction after thoughts
    const tThought1 = setTimeout(() => setActiveThoughtIndex(0), 3800);
    const tThought2 = setTimeout(() => setActiveThoughtIndex(1), 7400);
    const tPhase2 = setTimeout(() => {
      setPhase(2);
    }, 10500);

    // Initial thunder & lightning schedule (every 6-9s)
    const scheduleThunder = () => {
      const nextDelay = 6000 + Math.random() * 3000;
      thunderTimerRef.current = setTimeout(() => {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 240);
        setTimeout(() => playThunderSound(), 180);
        scheduleThunder();
      }, nextDelay);
    };
    scheduleThunder();

    // 25s Inactivity hint check
    const tHint = setTimeout(() => {
      if (holdProgress < 0.25) {
        setShowInactivityHint(true);
      }
    }, 25000);

    // 60s Unobtrusive escape button
    const tEscape = setTimeout(() => {
      setShowEscapeButton(true);
    }, 60000);

    return () => {
      clearTimeout(tPhase1);
      clearTimeout(tThought1);
      clearTimeout(tThought2);
      clearTimeout(tPhase2);
      clearTimeout(tHint);
      clearTimeout(tEscape);
      if (thunderTimerRef.current) clearTimeout(thunderTimerRef.current);
    };
  }, [initAudio, playThunderSound]);

  // Heartbeat loop: faster in storm (~74 BPM), slowing to calm (~52 BPM) as progress fills
  useEffect(() => {
    if (phase === 0 || phase >= 3) {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      return;
    }

    const currentBPM = 74 - holdProgress * 22; // 74 -> 52
    const intervalMs = (60 / currentBPM) * 1000;

    heartbeatTimerRef.current = setInterval(() => {
      if (!audioCtxRef.current || !heartbeatGainRef.current) return;
      try {
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;

        // LUB
        const osc1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(62, now);
        osc1.frequency.exponentialRampToValueAtTime(38, now + 0.1);
        g1.gain.setValueAtTime(0.09, now);
        g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc1.connect(g1);
        g1.connect(heartbeatGainRef.current);
        osc1.start(now);
        osc1.stop(now + 0.13);

        // DUB (140ms later)
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(54, now + 0.14);
        osc2.frequency.exponentialRampToValueAtTime(32, now + 0.25);
        g2.gain.setValueAtTime(0.12, now + 0.14);
        g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        osc2.connect(g2);
        g2.connect(heartbeatGainRef.current);
        osc2.start(now + 0.14);
        osc2.stop(now + 0.29);
      } catch {}
    }, intervalMs);

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    };
  }, [phase, holdProgress]);

  // Climax Trigger at 100% progress
  useEffect(() => {
    if (holdProgress >= 1 && phase === 2) {
      setPhase(3); // Phase 3: Climax

      // One final soft heartbeat
      if (audioCtxRef.current && heartbeatGainRef.current) {
        try {
          const ctx = audioCtxRef.current;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(48, now);
          osc.frequency.exponentialRampToValueAtTime(28, now + 0.18);
          g.gain.setValueAtTime(0.08, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          osc.connect(g);
          g.connect(heartbeatGainRef.current);
          osc.start(now);
          osc.stop(now + 0.23);
        } catch {}
      }

      // Smoothly quiet down rain to faint background
      if (rainGainRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        rainGainRef.current.gain.linearRampToValueAtTime(0.015, now + 1.2);
      }

      // Roll one last distant fading thunder
      setTimeout(() => playThunderSound(), 600);

      // Play warm sunrise chord swell
      setTimeout(() => playSunriseChords(), 1400);

      // Transition to Phase 4 (Question) after 6.5 seconds
      const tPhase4 = setTimeout(() => {
        setPhase(4);
      }, 7200);

      return () => clearTimeout(tPhase4);
    }
  }, [holdProgress, phase, playThunderSound, playSunriseChords]);

  // --------------------------------------------------------------------------
  // 3. CANVAS SIMULATION: RAIN, SPLASHES, GOLDEN DUST & UMBRELLA SHIELD
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initial umbrella starting position (slightly above center)
    targetPosRef.current = { x: width / 2, y: height * 0.45 };
    currPosRef.current = { x: width / 2, y: height * 0.45 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rain particles (optimized for 60fps on mobile)
    const isMobile = width < 640;
    const rainCount = isMobile ? 85 : 160;
    const rainDrops = Array.from({ length: rainCount }).map(() => ({
      x: Math.random() * (width + 120) - 60,
      y: Math.random() * height,
      speed: Math.random() * 9 + 15,
      length: Math.random() * 22 + 14,
      thickness: Math.random() * 1.2 + 0.6,
      opacity: Math.random() * 0.38 + 0.2,
      layer: Math.random() > 0.6 ? 'near' : 'mid',
    }));

    // Splashes around umbrella rim
    const splashes = [];
    const goldenDust = [];

    let windTime = 0;
    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.08);
      lastTime = time;
      windTime += dt * 1.2;

      ctx.clearRect(0, 0, width, height);

      // Silhouette center coordinate
      const silX = width / 2;
      const silY = height * 0.62;
      const umbrellaRadius = isMobile ? 95 : 115;

      // Wind physics: periodic gentle gust pushing umbrella sideways
      if (phase === 2) {
        const gust = Math.sin(windTime * 0.8) * Math.cos(windTime * 0.4);
        windOffsetRef.current = {
          x: gust * 28,
          y: Math.sin(windTime * 1.1) * 12,
        };
      } else {
        windOffsetRef.current = { x: 0, y: 0 };
      }

      // Spring inertia lerp for umbrella position
      const targetWithWind = {
        x: targetPosRef.current.x + (isHoldingUmbrella ? 0 : windOffsetRef.current.x),
        y: targetPosRef.current.y + (isHoldingUmbrella ? 0 : windOffsetRef.current.y),
      };
      currPosRef.current.x += (targetWithWind.x - currPosRef.current.x) * 0.16;
      currPosRef.current.y += (targetWithWind.y - currPosRef.current.y) * 0.16;

      const ux = currPosRef.current.x;
      const uy = currPosRef.current.y;

      // Check if umbrella covers the silhouette
      const distToSil = Math.hypot(ux - silX, uy - (silY - 70));
      const isCovering = distToSil < umbrellaRadius * 0.85 && phase >= 2;
      isCoveringRef.current = isCovering;

      // Update hold progress
      if (phase === 2) {
        if (isCovering) {
          setHoldProgress((p) => {
            const next = Math.min(1, p + dt * 0.125); // ~8 seconds to fill
            // Progress milestones
            if (next >= 0.2 && p < 0.2) {
              setActiveShelterLineIndex(0);
              playChime();
            } else if (next >= 0.45 && p < 0.45) {
              setActiveShelterLineIndex(1);
              playChime();
            } else if (next >= 0.7 && p < 0.7) {
              setActiveShelterLineIndex(2);
              playChime();
            } else if (next >= 0.92 && p < 0.92) {
              setActiveShelterLineIndex(3);
              playChime();
            }
            return next;
          });
        } else {
          // Slow forgiving drain
          setHoldProgress((p) => Math.max(0, p - dt * 0.04));
        }

        // Audio shelter effect: duck rain lowpass filter & raise drumming sound
        if (rainFilterRef.current && audioCtxRef.current && drumGainRef.current) {
          const now = audioCtxRef.current.currentTime;
          const targetFreq = isCovering ? 1100 : 2600;
          const drumTarget = isCovering ? 0.06 : 0.0001;
          rainFilterRef.current.frequency.setTargetAtTime(targetFreq, now, 0.1);
          drumGainRef.current.gain.setTargetAtTime(drumTarget, now, 0.1);
        }
      }

      // --- Draw Puddle & Reflection underneath Silhouette ---
      if (phase >= 1) {
        const puddleGrad = ctx.createRadialGradient(silX, silY + 80, 5, silX, silY + 80, 90);
        puddleGrad.addColorStop(0, phase >= 3 ? 'rgba(251, 191, 36, 0.25)' : 'rgba(200, 220, 255, 0.14)');
        puddleGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = puddleGrad;
        ctx.beginPath();
        ctx.ellipse(silX, silY + 80, 85, 20, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Warm Golden Light under Umbrella when covering ---
      if (phase >= 2 && isCovering) {
        const shelterGrad = ctx.createRadialGradient(ux, uy + 45, 10, ux, uy + 45, umbrellaRadius);
        shelterGrad.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
        shelterGrad.addColorStop(0.6, 'rgba(244, 114, 182, 0.12)');
        shelterGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = shelterGrad;
        ctx.beginPath();
        ctx.arc(ux, uy + 45, umbrellaRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Rain Simulation & Collision with Umbrella ---
      if (phase < 3) {
        ctx.lineCap = 'round';
        rainDrops.forEach((d) => {
          // Wind slant
          const slant = -d.length * 0.22;

          // Check collision with umbrella canopy
          const inUmbrellaX = Math.abs(d.x - ux) < umbrellaRadius * 0.95;
          const inUmbrellaY = d.y > uy - 20 && d.y < uy + 55;

          if (inUmbrellaX && inUmbrellaY && phase >= 2) {
            // Deflected by umbrella: spawn rim splash
            if (splashes.length < 35 && Math.random() > 0.4) {
              splashes.push({
                x: d.x + (Math.random() - 0.5) * 6,
                y: uy - 8,
                vx: (d.x - ux) * 0.04 + (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2.5 - 1.2,
                life: 1.0,
              });
            }
            d.y = -d.length;
            d.x = Math.random() * (width + 120) - 60;
          } else {
            // Draw rain streak
            ctx.lineWidth = d.thickness;
            ctx.strokeStyle = `rgba(200, 220, 255, ${d.opacity})`;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x + slant, d.y + d.length);
            ctx.stroke();

            d.y += d.speed;
            d.x += slant * 0.8;

            if (d.y > height) {
              d.y = -d.length;
              d.x = Math.random() * (width + 120) - 60;
            }
          }
        });
      }

      // --- Rim Splashes ---
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15; // gravity
        s.life -= dt * 2.8;

        if (s.life <= 0) {
          splashes.splice(i, 1);
        } else {
          ctx.fillStyle = `rgba(255, 230, 200, ${s.life * 0.55})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- Golden Floating Dust (Spawns as progress increases and in Climax) ---
      if ((phase === 2 && holdProgress > 0.25) || phase >= 3) {
        if (goldenDust.length < 45 && Math.random() > 0.3) {
          goldenDust.push({
            x: silX + (Math.random() - 0.5) * (width * 0.6),
            y: height * 0.75 + Math.random() * 40,
            vy: -Math.random() * 0.8 - 0.3,
            vx: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2.2 + 1.0,
            alpha: Math.random() * 0.7 + 0.3,
            pulse: Math.random() * Math.PI * 2,
          });
        }

        for (let i = goldenDust.length - 1; i >= 0; i--) {
          const g = goldenDust[i];
          g.y += g.vy;
          g.x += g.vx + Math.sin(g.pulse) * 0.2;
          g.pulse += 0.04;

          if (g.y < height * 0.25) {
            goldenDust.splice(i, 1);
          } else {
            ctx.fillStyle = `rgba(251, 191, 36, ${g.alpha * 0.7})`;
            ctx.beginPath();
            ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [phase, isHoldingUmbrella, playChime]);

  // Clean exit & teardown on unmount
  useEffect(() => {
    return () => {
      // Disconnect and stop all Web Audio nodes
      if (rainNoiseNodeRef.current) {
        try { rainNoiseNodeRef.current.stop(); } catch {}
      }
      sunriseOscsRef.current.forEach(({ osc }) => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch {}
      }
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (thunderTimerRef.current) clearTimeout(thunderTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 4. INTERACTION POINTER HANDLERS (Spring Drag & Touch Support)
  // --------------------------------------------------------------------------
  const handlePointerDown = (e) => {
    setIsHoldingUmbrella(true);
    targetPosRef.current = { x: e.clientX, y: e.clientY };
    if (showInactivityHint) setShowInactivityHint(false);
  };

  const handlePointerMove = (e) => {
    if (isHoldingUmbrella || phase === 2) {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    setIsHoldingUmbrella(false);
  };

  // --------------------------------------------------------------------------
  // 5. BUTTON ACTIONS: "ஆமாம் ❤️" & "நான் உன்கிட்ட கொஞ்சம் பேசணும்"
  // --------------------------------------------------------------------------
  const handleAcceptYes = () => {
    if (isAcceptingRef.current) return;
    isAcceptingRef.current = true;

    playClickSound();
    setIsExiting(true);

    // Smoothly fade out synth audio over 600ms
    if (masterGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    }

    // Call onComplete() while the overlay is still mounted (Amendment 1)
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  // --------------------------------------------------------------------------
  // TAMIL STORY LINES (Exact texts)
  // --------------------------------------------------------------------------
  const THOUGHT_LINES = [
    "யாரும் கேக்கல… நானும் சொல்லல.",
    "எல்லாத்தையும் தனியா தாங்கிக்கலாம்னு நினைச்சேன்.",
  ];

  const SHELTER_LINES = [
    "இத்தனை நாள் நான் மழையில நின்னதே தெரியல… நீ குடையா வந்த பிறகு தான் தெரிஞ்சுது.",
    "நான் யார்கிட்டயும் சொல்லாம மறைச்ச கவலைகளை, நீ கேக்காமலே புரிஞ்சுக்கிட்ட.",
    "நீ ஒண்ணுமே கேக்கல… ஆனா என் தலைக்கு மேல இருந்த மழை நின்னுடுச்சு.",
    "உன் கை நீண்டதும் மழை நின்னுச்சு.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[70] w-full h-full bg-[#030107] text-white select-none overflow-hidden font-sans"
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Lightning Flash Overlay */}
      <div
        className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 z-20"
        style={{ opacity: lightningFlash ? 0.85 : 0 }}
      />

      {/* Climax Sunrise Gradient Background (Parting Clouds) */}
      <motion.div
        animate={{
          opacity: phase >= 3 ? 1 : 0,
        }}
        transition={{ duration: 3.5, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-t from-[#2a0b18] via-[#1a0520] to-[#030107]"
      />

      {/* Canvas for Rain, Splashes, Golden Dust & Light Rays */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Far Background Parallax Silhouette: Storm City / Trees */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 bg-repeat-x opacity-25 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        }}
      />

      {/* ==================================================================== */}
      {/* PHASE 0: BLACK SCREEN INTRO LINE                                     */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-30 flex items-center justify-center p-6 text-center"
          >
            <p className="text-base sm:text-lg md:text-xl font-serif text-rose-100/90 leading-relaxed max-w-md drop-shadow-[0_2px_15px_rgba(244,63,94,0.4)]">
              “சில நேரம் மழை வெளிய இல்ல… நமக்குள்ளயும் பெய்யும்.”
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* THE SILHOUETTE (Center Stage, Articulated SVG)                       */}
      {/* ==================================================================== */}
      {phase >= 1 && (
        <div className="absolute inset-x-0 top-[52%] -translate-y-1/2 flex flex-col items-center pointer-events-none z-15">
          {/* Subtle Hold Progress Ring around the Silhouette */}
          {phase === 2 && (
            <div className="relative w-44 h-56 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="72"
                  fill="transparent"
                  stroke="rgba(244, 114, 182, 0.15)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="72"
                  fill="transparent"
                  stroke="url(#roseGoldGrad)"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={2 * Math.PI * 72 * (1 - holdProgress)}
                  strokeLinecap="round"
                  className="transition-all duration-150 ease-out"
                />
                <defs>
                  <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              {/* The Lone Silhouette */}
              <motion.div
                animate={{
                  y: phase >= 3 ? -10 : isHoldingUmbrella ? -4 : lightningFlash ? [-2, 2, 0] : 0,
                  filter:
                    phase >= 3
                      ? 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.7))'
                      : holdProgress > 0.3
                      ? 'drop-shadow(0 0 15px rgba(244, 114, 182, 0.4))'
                      : 'drop-shadow(0 0 10px rgba(0,0,0,0.9))',
                }}
                transition={{ duration: 0.6 }}
                className="relative flex flex-col items-center"
              >
                {/* Cold Breath Fog Wisp near Head */}
                {phase < 3 && (
                  <motion.div
                    animate={{
                      opacity: [0.15, 0.45, 0.1],
                      scale: [0.8, 1.25, 1.4],
                      x: [0, 8, 14],
                      y: [0, -6, -12],
                    }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute -top-3 right-3 w-5 h-5 rounded-full bg-slate-200/20 blur-[3px] pointer-events-none"
                  />
                )}

                {/* SVG Human Silhouette with Head & Shoulder Articulation */}
                <svg
                  width="70"
                  height="140"
                  viewBox="0 0 70 140"
                  fill="none"
                  className="transition-all duration-700"
                >
                  {/* Head: Bends down when drenched, slowly lifts as she shelters him */}
                  <g
                    style={{
                      transformOrigin: '35px 36px',
                      transform:
                        phase >= 3
                          ? 'rotate(0deg) translateY(-2px)'
                          : `rotate(${16 - holdProgress * 16}deg) translateY(${3 - holdProgress * 3}px)`,
                      transition: 'transform 0.6s ease-out',
                    }}
                  >
                    <ellipse
                      cx="35"
                      cy="22"
                      rx="12"
                      ry="14"
                      fill={phase >= 3 ? '#2e1524' : '#080812'}
                      stroke={phase >= 3 ? '#fbbf24' : '#1e1b2e'}
                      strokeWidth="1.5"
                    />
                    {/* Hair drip wisp */}
                    {phase < 3 && (
                      <line x1="33" y1="36" x2="33" y2="44" stroke="#60a5fa" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                    )}
                  </g>

                  {/* Body & Shoulders: Slumped when alone, straightens when she shelters him */}
                  <path
                    d={
                      phase >= 3
                        ? 'M 20 40 Q 35 38 50 40 L 46 95 L 24 95 Z'
                        : `M 22 ${44 - holdProgress * 4} Q 35 44 48 ${44 - holdProgress * 4} L 45 95 L 25 95 Z`
                    }
                    fill={phase >= 3 ? '#251020' : '#070610'}
                    stroke={phase >= 3 ? '#f43f5e' : '#151322'}
                    strokeWidth="1.5"
                  />

                  {/* Legs */}
                  <rect x="26" y="94" width="7" height="42" rx="3.5" fill="#05040a" />
                  <rect x="37" y="94" width="7" height="42" rx="3.5" fill="#05040a" />
                </svg>
              </motion.div>
            </div>
          )}

          {/* Fallback Silhouette rendering for Phase 1 & 3 */}
          {phase !== 2 && (
            <motion.div
              animate={{
                y: phase >= 3 ? -14 : 0,
                filter:
                  phase >= 3
                    ? 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))'
                    : 'drop-shadow(0 0 12px rgba(0,0,0,0.9))',
              }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col items-center"
            >
              <svg width="70" height="140" viewBox="0 0 70 140" fill="none">
                <ellipse
                  cx="35"
                  cy={phase >= 3 ? 20 : 25}
                  rx="12"
                  ry="14"
                  fill={phase >= 3 ? '#2e1524' : '#080812'}
                  stroke={phase >= 3 ? '#fbbf24' : '#1e1b2e'}
                  strokeWidth="1.5"
                />
                <path
                  d={phase >= 3 ? 'M 20 40 Q 35 38 50 40 L 46 95 L 24 95 Z' : 'M 22 45 Q 35 44 48 45 L 45 95 L 25 95 Z'}
                  fill={phase >= 3 ? '#251020' : '#070610'}
                  stroke={phase >= 3 ? '#f43f5e' : '#151322'}
                  strokeWidth="1.5"
                />
                <rect x="26" y="94" width="7" height="42" rx="3.5" fill="#05040a" />
                <rect x="37" y="94" width="7" height="42" rx="3.5" fill="#05040a" />
              </svg>
            </motion.div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* THE UMBRELLA ICON / SHELTER GRAPHIC (Follows touch with Inertia)      */}
      {/* ==================================================================== */}
      {phase === 2 && (
        <div
          className="absolute pointer-events-none z-25 transition-transform duration-75"
          style={{
            transform: `translate3d(${currPosRef.current.x - 36}px, ${currPosRef.current.y - 42}px, 0)`,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Ambient Warm Golden Halo around Umbrella */}
            <div className="absolute inset-0 -m-4 rounded-full bg-amber-400/25 blur-lg animate-pulse" />

            {/* Glowing Umbrella Icon */}
            <div className="relative p-3.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/60 shadow-[0_0_25px_rgba(251,191,36,0.55)]">
              <Umbrella size={38} className="text-amber-300 fill-amber-300/30 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* STORY TEXT & SUBTITLES OVERLAY                                       */}
      {/* ==================================================================== */}
      <div className="absolute inset-x-0 bottom-24 sm:bottom-28 z-30 flex flex-col items-center px-6 pointer-events-none text-center">
        {/* Phase 1: Rain Thought Lines */}
        <AnimatePresence mode="wait">
          {phase === 1 && activeThoughtIndex >= 0 && (
            <motion.p
              key={`thought-${activeThoughtIndex}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 0.85, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.9 }}
              className="text-sm sm:text-base font-serif italic text-slate-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-sm"
            >
              “{THOUGHT_LINES[activeThoughtIndex]}”
            </motion.p>
          )}
        </AnimatePresence>

        {/* Phase 2: Gentle Touch Instruction or Inactivity Hint */}
        {phase === 2 && holdProgress < 0.15 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="flex items-center gap-2 text-rose-300 font-serif text-xs sm:text-sm tracking-wider"
          >
            <Sparkles size={13} className="text-amber-300" />
            <span>{showInactivityHint ? 'அவன் நனைகிறான்… குடையை அவன் மேல் பிடி' : 'தொட்டு நகர்த்து…'}</span>
          </motion.div>
        )}

        {/* Phase 2: Progress Milestone Lines */}
        <AnimatePresence mode="wait">
          {phase === 2 && activeShelterLineIndex >= 0 && (
            <motion.p
              key={`shelter-${activeShelterLineIndex}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg font-serif font-medium text-amber-100 max-w-md leading-relaxed drop-shadow-[0_2px_18px_rgba(244,63,94,0.6)]"
            >
              “{SHELTER_LINES[activeShelterLineIndex]}”
            </motion.p>
          )}
        </AnimatePresence>

        {/* Phase 3: Climax Final Line */}
        <AnimatePresence>
          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1.4 }}
              className="space-y-2 max-w-lg"
            >
              <p className="text-lg sm:text-xl md:text-2xl font-serif font-semibold text-amber-200 leading-relaxed drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]">
                “இத்தனை நாள் தனியா நனைஞ்சது போதும்… இனிமே என் உலகம் உன் குடைக்குள்ள தான்.”
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================================================================== */}
      {/* PHASE 4: THE QUESTION MODAL (Two thumb-friendly buttons)              */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {phase === 4 && !showTalkScreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center font-serif pointer-events-auto bg-black/60 backdrop-blur-md"
          >
            <div className="max-w-md w-full p-8 rounded-3xl bg-black/75 backdrop-blur-2xl border border-amber-300/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(251,191,36,0.25)] flex flex-col items-center space-y-6">
              {/* Glowing Umbrella Badge */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400/20 to-rose-500/20 border border-amber-300/50 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.5)]">
                <Umbrella size={30} className="text-amber-300" />
              </div>

              {/* The Exact Question */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300/80">
                  என் இதயத்தின் கேள்வி
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed drop-shadow-[0_2px_20px_rgba(244,63,94,0.7)]">
                  “இனிமே நானும் உனக்கு குடையா இருக்கட்டுமா, சரண்யா?”
                </h3>
              </div>

              {/* Two Thumb-Friendly Buttons */}
              <div className="w-full flex flex-col gap-3.5 pt-2">
                {/* Primary Button: “ஆமாம் ❤️” */}
                <button
                  onClick={handleAcceptYes}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-base shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2.5 transition active:scale-96 cursor-pointer border border-rose-300/40"
                >
                  <Heart size={18} className="fill-white" />
                  <span>ஆமாம் ❤️</span>
                </button>

                {/* Secondary Button: “நான் உன்கிட்ட கொஞ்சம் பேசணும்” */}
                <button
                  onClick={() => {
                    playClickSound();
                    setShowTalkScreen(true);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-rose-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition active:scale-96 cursor-pointer"
                >
                  <MessageCircle size={16} className="text-amber-300" />
                  <span>நான் உன்கிட்ட கொஞ்சம் பேசணும்</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* TALK SUB-SCREEN (Gentle Dark Blue-Gold Calm)                         */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showTalkScreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-45 flex flex-col items-center justify-center p-6 text-center font-serif pointer-events-auto bg-[#040614]/90 backdrop-blur-xl"
          >
            <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950/85 border border-cyan-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.2)] flex flex-col items-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                <MessageCircle size={26} />
              </div>

              <div className="space-y-3">
                <h4 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  “சரி… உன் மனசுல இருக்கறத சொல்லு. நான் கேட்டுட்டே இருக்கேன்.”
                </h4>
                <p className="text-xs text-slate-300/80 font-sans leading-relaxed">
                  எந்த தயக்கமும் இல்லாமல் உன் உணர்வுகளை என்னிடம் பகிர்ந்து கொள்ளலாம்.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3 pt-2">
                {/* Contact Button (Renders ONLY if TALK_LINK is filled, never invents number) */}
                {TALK_LINK && (
                  <button
                    onClick={() => {
                      playClickSound();
                      window.open(TALK_LINK, '_blank');
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition active:scale-96 cursor-pointer"
                  >
                    <Phone size={15} />
                    <span>நேரடியாக தொடர்பு கொள்ள</span>
                  </button>
                )}

                {/* Back to Question Button */}
                <button
                  onClick={() => {
                    playClickSound();
                    setShowTalkScreen(false);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-rose-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition active:scale-96 cursor-pointer"
                >
                  <ArrowLeft size={15} />
                  <span>திரும்பிப் போகலாம்</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 60s UNOBTRUSIVE FALLBACK ESCAPE BUTTON (Never get stuck)            */}
      {/* ==================================================================== */}
      {showEscapeButton && phase < 4 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          whileHover={{ opacity: 1 }}
          onClick={() => setPhase(4)}
          className="absolute top-6 right-6 z-50 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-white/80 text-xs font-mono transition cursor-pointer"
        >
          தொடரலாம் →
        </motion.button>
      )}
    </motion.div>
  );
}
