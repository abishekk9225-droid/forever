import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import CinematicRainbowBorder from './CinematicRainbowBorder';
import {
  generatePencilPortrait,
  AI_PIPELINE_STATUS,
  resetPortraitCache,
} from '../utils/aiPortraitService';
import { useHeartbeat } from '../context/HeartbeatContext';

// ============================================================================
// 1. GENTLE DRIFTING FLOWER PETALS CANVAS (FALLING NATURALLY FROM TOP)
// ============================================================================
function FallingPetalsCanvas({ active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // 22 soft rose pink and ivory cream flower petals
    const petals = Array.from({ length: 22 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 9 + 6,
      vx: (Math.random() - 0.45) * 0.7,
      vy: Math.random() * 0.9 + 0.6,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.025,
      swayAmp: Math.random() * 1.6 + 0.8,
      swaySpeed: Math.random() * 0.015 + 0.008,
      opacity: Math.random() * 0.45 + 0.35,
      colorType: Math.random() > 0.4 ? 'rose' : 'ivory',
    }));

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(frameCount * p.swaySpeed) * p.swayAmp;
        p.angle += p.vAngle;

        // Reset when reaching bottom
        if (p.y > height + 25) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) p.x = -20;
        if (p.x < -25) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.angle * 0.7), 1);

        // Draw delicate curved flower petal
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);

        if (p.colorType === 'rose') {
          ctx.fillStyle = `rgba(244, 114, 182, ${p.opacity})`;
          ctx.strokeStyle = `rgba(251, 191, 36, ${p.opacity * 0.3})`;
        } else {
          ctx.fillStyle = `rgba(255, 241, 242, ${p.opacity})`;
          ctx.strokeStyle = `rgba(244, 63, 94, ${p.opacity * 0.25})`;
        }
        ctx.lineWidth = 0.5;
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[12]"
      style={{ opacity: 0.9 }}
    />
  );
}

// ============================================================================
// 2. DELICATE FLYING BUTTERFLIES (CURVED FLIGHT PATHS & WING FLUTTER)
// ============================================================================
function NaturalFlyingButterfly({
  id = 1,
  colorScheme = 'rose', // 'rose' | 'gold' | 'ivory'
  flightAnimation = 'butterflyFlightPath1',
  duration = '14s',
  delay = '0s',
  scale = 0.85,
}) {
  const gradId = `butterflyGrad_${id}_${colorScheme}`;

  return (
    <div
      className="absolute pointer-events-none z-[35]"
      style={{
        animation: `${flightAnimation} ${duration} cubic-bezier(0.35, 0.1, 0.25, 1) ${delay} infinite`,
        transform: `scale(${scale})`,
      }}
    >
      <div className="relative">
        <svg
          width="34"
          height="30"
          viewBox="0 0 34 30"
          className="overflow-visible drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              {colorScheme === 'rose' && (
                <>
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#f472b6" />
                  <stop offset="85%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#c084fc" />
                </>
              )}
              {colorScheme === 'gold' && (
                <>
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fde047" />
                  <stop offset="75%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </>
              )}
              {colorScheme === 'ivory' && (
                <>
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#fbcfe8" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </>
              )}
            </linearGradient>
          </defs>

          {/* Left Wing with realistic flap animation */}
          <g
            style={{
              transformOrigin: '17px 15px',
              animation: 'wingFlutterLeft 0.22s ease-in-out infinite',
            }}
          >
            <path
              d="M 16,15 C 11,4 3,3 1,8 C -1,14 4,21 16,17 Z"
              fill={`url(#${gradId})`}
              opacity="0.94"
            />
            <path
              d="M 16,16 C 9,19 4,25 6,27 C 9,29 14,25 16,18 Z"
              fill={`url(#${gradId})`}
              opacity="0.84"
            />
            <path
              d="M 16,15 Q 8,9 3,9 M 16,16 Q 9,15 4,17"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.6"
              fill="none"
            />
          </g>

          {/* Slender Body */}
          <ellipse cx="17" cy="16" rx="1.1" ry="6.5" fill="#ffffff" />
          <circle cx="17" cy="9" r="1.3" fill="#fef08a" />
          <path
            d="M 17,8 Q 15,4 13,3 M 17,8 Q 19,4 21,3"
            stroke="#fef08a"
            strokeWidth="0.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Wing with realistic flap animation */}
          <g
            style={{
              transformOrigin: '17px 15px',
              animation: 'wingFlutterRight 0.22s ease-in-out infinite',
            }}
          >
            <path
              d="M 18,15 C 23,4 31,3 33,8 C 35,14 30,21 18,17 Z"
              fill={`url(#${gradId})`}
              opacity="0.94"
            />
            <path
              d="M 18,16 C 25,19 30,25 28,27 C 25,29 20,25 18,18 Z"
              fill={`url(#${gradId})`}
              opacity="0.84"
            />
            <path
              d="M 18,15 Q 26,9 31,9 M 18,16 Q 25,15 30,17"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.6"
              fill="none"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// 3. ELEGANT CORNER FLORAL ORNAMENTS (SOFT ROSES & WHITE BLOSSOMS)
// ============================================================================
function CornerFloralOrnament({ position = 'top-left' }) {
  const isLeft = position.includes('left');
  const isTop = position.includes('top');

  const rotation = isTop ? (isLeft ? '0deg' : '90deg') : isLeft ? '-90deg' : '180deg';

  return (
    <div
      className={`absolute pointer-events-none z-[18] ${
        isTop ? '-top-4 sm:-top-5' : '-bottom-4 sm:-bottom-5'
      } ${isLeft ? '-left-4 sm:-left-5' : '-right-4 sm:-right-5'}`}
      style={{
        transform: `rotate(${rotation})`,
        transformOrigin: 'center center',
      }}
    >
      <svg
        width="95"
        height="95"
        viewBox="0 0 100 100"
        className="filter drop-shadow-[0_4px_16px_rgba(244,63,94,0.4)]"
      >
        <defs>
          <radialGradient id="rosePetalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="60%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#9f1239" />
          </radialGradient>
          <radialGradient id="ivoryPetalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>

        {/* Stem & Leaves */}
        <path
          d="M 15,15 Q 35,28 65,30 Q 82,32 95,20"
          stroke="rgba(74, 222, 128, 0.65)"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M 38,26 Q 48,12 58,22 Q 48,32 38,26 Z"
          fill="rgba(34, 197, 94, 0.75)"
          stroke="rgba(187, 247, 208, 0.5)"
          strokeWidth="0.8"
        />
        <path
          d="M 60,30 Q 72,44 78,34 Q 68,26 60,30 Z"
          fill="rgba(22, 163, 74, 0.75)"
          stroke="rgba(187, 247, 208, 0.5)"
          strokeWidth="0.8"
        />

        {/* Center Main Rose Blossom */}
        <circle cx="28" cy="28" r="14" fill="url(#rosePetalGrad)" opacity="0.95" />
        <circle cx="28" cy="28" r="9" fill="#fda4af" opacity="0.9" />
        <path
          d="M 23,28 Q 28,21 33,28 Q 28,34 23,28"
          stroke="#fff1f2"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="28" cy="28" r="3.5" fill="#fde047" />

        {/* Smaller Ivory White Blossom */}
        <circle cx="58" cy="18" r="9" fill="url(#ivoryPetalGrad)" opacity="0.92" />
        <circle cx="58" cy="18" r="5" fill="#ffffff" opacity="0.85" />
        <circle cx="58" cy="18" r="2" fill="#d97706" />

        {/* Tiny Bud Accent */}
        <circle cx="16" cy="52" r="6" fill="url(#rosePetalGrad)" opacity="0.85" />
        <path d="M 12,50 Q 16,42 20,50" stroke="#fecdd3" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  );
}

// ==================================================
// ==========================
// 4. FLOATING GRAPHITE DUST & AMBIENT WARM SPOTLIGHT CANVAS
// ============================================================================
function AmbientGraphiteDustCanvas({ active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Delicate graphite & warm golden dust specks
    const particles = Array.from({ length: 36 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.48) * 0.4,
      vy: -(Math.random() * 0.35 + 0.12),
      opacity: Math.random() * 0.4 + 0.2,
      isGold: Math.random() > 0.65,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? `rgba(251, 191, 36, ${p.opacity})`
          : `rgba(215, 215, 222, ${p.opacity * 0.85})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[6]"
      style={{ opacity: 0.85 }}
    />
  );
}

// ============================================================================
// MAIN AIPencilDrawingScene COMPONENT
// ============================================================================
export default function AIPencilDrawingScene({ onComplete }) {
  // Generation & Pipeline state
  const [pipelineStatus, setPipelineStatus] = useState(AI_PIPELINE_STATUS.IDLE);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [artworkUrl, setArtworkUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Staged drawing reveal milestones (0..7)
  const [revealStage, setRevealStage] = useState(0);
  const [pencilCoord, setPencilCoord] = useState({ x: 0, y: 0, visible: false });
  const [isExiting, setIsExiting] = useState(false);

  // Dedicated Audio Refs for /ll.mp3 (3.0s start rule + leak prevention)
  const audioRef = useRef(null);
  const musicTimerRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  const canvasRef = useRef(null);
  const offscreenImgRef = useRef(null);
  const animFrameRef = useRef(null);
  const timersRef = useRef([]);
  const hasRequestedRef = useRef(false);

  // /km.mp3 — plays ONCE when drawing reaches completion (revealStage 7)
  const kmAudioRef = useRef(null);
  const kmPlayedRef = useRef(false);

  const { setTargetBPM } = useHeartbeat();

  // --------------------------------------------------------------------------
  // 1. AUDIO MANAGEMENT: Start /ll.mp3 at EXACTLY 3.0s after scene mounts
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Exact 3.0 second delay before playing /ll.mp3
    musicTimerRef.current = setTimeout(() => {
      try {
        const audio = new Audio('/ll.mp3');
        audio.loop = true;
        audio.volume = 0.22; // Initial volume 0.20-0.25 as requested
        audioRef.current = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Smoothly ramp volume from 0.22 to 0.38 over 3.5 seconds
              let currentVol = 0.22;
              const targetVol = 0.38;
              const stepTime = 120;
              const volStep = (targetVol - currentVol) / (3500 / stepTime);

              const rampInterval = setInterval(() => {
                if (!audioRef.current) {
                  clearInterval(rampInterval);
                  return;
                }
                currentVol = Math.min(targetVol, currentVol + volStep);
                audioRef.current.volume = currentVol;
                if (currentVol >= targetVol) {
                  clearInterval(rampInterval);
                }
              }, stepTime);
            })
            .catch((err) => {
              console.log('Audio autoplay prevented, user interaction will trigger:', err);
            });
        }
      } catch (e) {
        console.warn('Audio setup error:', e);
      }
    }, 3000); // 3000ms = 3.0 seconds

    // Scene cleanup: clear timer, stop & nullify audio immediately
    return () => {
      if (musicTimerRef.current) clearTimeout(musicTimerRef.current);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (kmAudioRef.current) {
        kmAudioRef.current.pause();
        kmAudioRef.current.src = '';
        kmAudioRef.current = null;
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // KM.MP3: Play ONCE at high cinematic volume when drawing completes (stage 7)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (revealStage !== 7) return;
    if (kmPlayedRef.current) return;
    kmPlayedRef.current = true;
    try {
      if (!kmAudioRef.current) {
        const kmAudio = new Audio('/km.mp3');
        kmAudio.loop = false;
        kmAudio.volume = 0.9; // High, clearly audible cinematic volume
        kmAudioRef.current = kmAudio;
      }
      kmAudioRef.current.play().catch(() => {});
    } catch {
      // Audio not supported — silently ignore
    }
  }, [revealStage]);

  // --------------------------------------------------------------------------
  // 2. AI GENERATION TRIGGER (Runs once, internally processes /ap.jpg)
  // --------------------------------------------------------------------------
  const startAIGeneration = () => {
    setErrorMsg(null);
    setPipelineStatus(AI_PIPELINE_STATUS.ANALYZING);

    generatePencilPortrait('/ap.jpg', (status, progress) => {
      setPipelineStatus(status);
      setPipelineProgress(progress);
    })
      .then((result) => {
        // Preload the AI generated pencil portrait artwork in memory (NEVER /ap.jpg in DOM)
        const img = new Image();
        // NOTE: crossOrigin is intentionally NOT set here.
        // /ai_pencil_sketch.jpg is a same-origin asset served by Vite.
        // Setting crossOrigin='anonymous' on a same-origin asset that lacks
        // explicit CORS headers causes the browser to reject the load entirely.
        // We only use drawImage() on canvas (never getImageData), so no
        // crossOrigin attribute is needed.
        img.onload = () => {
          offscreenImgRef.current = img;
          setArtworkUrl(result.artworkUrl);
          setPipelineStatus(AI_PIPELINE_STATUS.SUCCESS);
        };
        img.onerror = () => {
          setErrorMsg('ஓவியத்தை ஏற்றுவதில் சிறிய தாமதம். மீண்டும் முயற்சி செய் ❤️');
          setPipelineStatus(AI_PIPELINE_STATUS.ERROR);
        };
        img.src = result.artworkUrl;
      })
      .catch((err) => {
        console.error('AI Portrait Generation error:', err);
        setErrorMsg('ஓவியத்தை ஏற்றுவதில் சிறிய தாமதம். மீண்டும் முயற்சி செய் ❤️');
        setPipelineStatus(AI_PIPELINE_STATUS.ERROR);
      });
  };

  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    if (setTargetBPM) {
      setTargetBPM(68, 0.22);
    }

    startAIGeneration();

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // 3. CANVAS STAGED PENCIL REVEAL ANIMATION (Smooth 60 FPS GPU Loop)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (pipelineStatus !== AI_PIPELINE_STATUS.SUCCESS || !offscreenImgRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = offscreenImgRef.current;

    const width = 1200;
    const height = 800; // 3:2 aspect ratio
    canvas.width = width;
    canvas.height = height;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(img, 0, 0, width, height);

    // Natural drawing stroke waypoints across key portrait features
    const drawingWaypoints = [
      { x: 480, y: 490 }, // woman face center
      { x: 700, y: 310 }, // man face center
      { x: 505, y: 535 }, // woman gentle smile
      { x: 700, y: 280 }, // man sunglasses
      { x: 420, y: 460 }, // woman hair curve
      { x: 730, y: 650 }, // man shirt folds
      { x: 380, y: 780 }, // woman dress details
      { x: 300, y: 340 }, // background hills left
      { x: 920, y: 360 }, // background hills right
      { x: 600, y: 480 }, // convergence
    ];

    let startTime = null;
    const TOTAL_DURATION = 17500; // 17.5s authentic drawing duration
    let lastStage = 0;

    const renderDrawingFrame = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1.0);

      // Milestone stage checks for React UI (fires only on stage boundary transitions)
      // Phase 1 (0.12): Faint outline & Text 1
      // Phase 2 (0.28): Face contour
      // Phase 3 (0.45): Eyes & facial details & Text 2
      // Phase 4 (0.62): Hair & clothing
      // Phase 5 (0.78): Deep shading & Text 3 ("ஒரு நினைவு... ஒரு ஓவியமாக மாறும்போது...")
      // Phase 6 (0.90): Highlights & fine details
      // Phase 7 (1.0): Complete portrait & Final Text 4 & Continue button
      let currentStage = 0;
      if (progress > 0.12) currentStage = 1;
      if (progress > 0.28) currentStage = 2;
      if (progress > 0.45) currentStage = 3;
      if (progress > 0.62) currentStage = 4;
      if (progress > 0.78) currentStage = 5;
      if (progress > 0.90) currentStage = 6;
      if (progress >= 1.0) currentStage = 7;

      if (currentStage !== lastStage) {
        lastStage = currentStage;
        setRevealStage(currentStage);

        if (currentStage === 7 && setTargetBPM) {
          setTargetBPM(74, 0.28);
        }
      }

      // 1. Draw warm textured archival paper base
      ctx.fillStyle = '#f8f7f2';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle graphite texture grain & tooth
      ctx.fillStyle = 'rgba(40, 35, 30, 0.025)';
      for (let i = 0; i < 18; i++) {
        const rx = (i * 97) % width;
        const ry = (i * 131) % height;
        ctx.fillRect(rx, ry, 60, 40);
      }

      // 3. Staged graphite artwork reveal
      if (progress > 0.05) {
        ctx.save();

        if (progress < 0.35) {
          // Phase 1-2: Faint graphite outline & contour pass
          ctx.globalAlpha = Math.min(progress * 2.6, 0.45);
          ctx.drawImage(offCanvas, 0, 0, width, height);
        } else {
          // Phase 3-7: Full tonal range reveal
          ctx.globalAlpha = Math.min(1.0, 0.45 + (progress - 0.35) * 1.0);
          ctx.drawImage(offCanvas, 0, 0, width, height);
        }

        ctx.restore();
      }

      // 4. Animated pencil cross-hatch strokes in active drawing region
      if (progress > 0.08 && progress < 0.96) {
        ctx.save();
        ctx.strokeStyle = 'rgba(50, 48, 45, 0.22)';
        ctx.lineWidth = 1.1;

        const wpIdx = Math.floor(progress * (drawingWaypoints.length - 1));
        const nextWp = drawingWaypoints[wpIdx + 1] || drawingWaypoints[wpIdx];
        const curWp = drawingWaypoints[wpIdx];
        const segT = (progress * (drawingWaypoints.length - 1)) % 1;

        const curX = curWp.x + (nextWp.x - curWp.x) * segT + Math.sin(timestamp * 0.015) * 18;
        const curY = curWp.y + (nextWp.y - curWp.y) * segT + Math.cos(timestamp * 0.018) * 12;

        for (let s = -2; s <= 2; s++) {
          ctx.beginPath();
          ctx.moveTo(curX + s * 14 - 15, curY + s * 8 - 10);
          ctx.lineTo(curX + s * 14 + 15, curY + s * 8 + 10);
          ctx.stroke();
        }
        ctx.restore();

        // Update virtual 2B pencil tip position (relative %)
        setPencilCoord({
          x: (curX / width) * 100,
          y: (curY / height) * 100,
          visible: true,
        });
      } else if (progress >= 0.96) {
        setPencilCoord((prev) => ({ ...prev, visible: false }));
      }

      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(renderDrawingFrame);
      } else {
        // Complete pristine full display
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(offCanvas, 0, 0, width, height);
      }
    };

    animFrameRef.current = requestAnimationFrame(renderDrawingFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pipelineStatus]);

  // --------------------------------------------------------------------------
  // 4. CONTINUE HANDLER: Smoothly fade music & scene, navigate to FingerprintLock
  // --------------------------------------------------------------------------
  const handleContinue = () => {
    if (isExiting) return;
    setIsExiting(true);

    // Gently fade out /ll.mp3 over 800ms
    if (audioRef.current) {
      const fadeSteps = 10;
      const fadeStepTime = 80;
      const volDecrement = audioRef.current.volume / fadeSteps;

      fadeIntervalRef.current = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > volDecrement) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - volDecrement);
        } else {
          clearInterval(fadeIntervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
        }
      }, fadeStepTime);
    }

    const t = setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 900);
    timersRef.current.push(t);
  };

  // 5. Retry Handler for AI Generation
  const handleRetry = () => {
    resetPortraitCache();
    hasRequestedRef.current = false;
    startAIGeneration();
  };

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-[#030206] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden select-none z-[120] transition-opacity duration-700 ${
        isExiting ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Universal Screen-Perimeter Travelling Rainbow Border */}
      <CinematicRainbowBorder mode="screen" />

      {/* Floating Graphite Dust & Warm Golden Ambience */}
      <AmbientGraphiteDustCanvas active={pipelineStatus === AI_PIPELINE_STATUS.SUCCESS} />

      {/* Falling Flower Petals Canvas */}
      <FallingPetalsCanvas active={pipelineStatus === AI_PIPELINE_STATUS.SUCCESS} />

      {/* Atmospheric Overhead Warm Studio Spotlight */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[750px] pointer-events-none rounded-full blur-[120px] opacity-35"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.45) 0%, rgba(244, 114, 182, 0.18) 45%, transparent 75%)',
        }}
      />

      {/* Vignette Edge Shading */}
      <div
        className="absolute inset-0 pointer-events-none z-[10]"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(3, 2, 6, 0.75) 85%, rgba(3, 2, 6, 0.98) 100%)',
        }}
      />

      {/* Inline styles for natural butterfly flight curves & wing fluttering */}
      <style>{`
        /* Butterfly 1 Flight Path (Upper Right & Perimeter) */
        @keyframes butterflyFlightPath1 {
          0% { transform: translate(-20vw, 15vh) rotate(5deg) scale(0.85); }
          25% { transform: translate(15vw, -8vh) rotate(-12deg) scale(0.92); }
          50% { transform: translate(32vw, 12vh) rotate(15deg) scale(0.88); }
          75% { transform: translate(18vw, 35vh) rotate(-8deg) scale(0.82); }
          100% { transform: translate(-20vw, 15vh) rotate(5deg) scale(0.85); }
        }

        /* Butterfly 2 Flight Path (Left & Lower Garden Arc) */
        @keyframes butterflyFlightPath2 {
          0% { transform: translate(25vw, 40vh) rotate(-15deg) scale(0.8); }
          30% { transform: translate(-18vw, 22vh) rotate(10deg) scale(0.86); }
          60% { transform: translate(-28vw, -12vh) rotate(-5deg) scale(0.9); }
          85% { transform: translate(-5vw, 10vh) rotate(18deg) scale(0.82); }
          100% { transform: translate(25vw, 40vh) rotate(-15deg) scale(0.8); }
        }

        /* Butterfly 3 Flight Path (Gentle Horizon Drift) */
        @keyframes butterflyFlightPath3 {
          0% { transform: translate(-35vw, -18vh) rotate(8deg) scale(0.75); }
          50% { transform: translate(30vw, -25vh) rotate(-10deg) scale(0.82); }
          100% { transform: translate(-35vw, -18vh) rotate(8deg) scale(0.75); }
        }

        /* Wing Flap Animations */
        @keyframes wingFlutterLeft {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(65deg); }
        }
        @keyframes wingFlutterRight {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(-65deg); }
        }

        @keyframes subtlePaperGlow {
          0%, 100% {
            box-shadow: 0 10px 45px rgba(0,0,0,0.85), 0 0 35px rgba(251, 191, 36, 0.18);
          }
          50% {
            box-shadow: 0 12px 60px rgba(0,0,0,0.9), 0 0 55px rgba(244, 114, 182, 0.28), 0 0 85px rgba(251, 191, 36, 0.25);
          }
        }
        @keyframes pencilTipLeadSpark {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
      `}</style>

      {/* ==================================================================== */}
      {/* 1. INITIAL AI PROCESSING / WAITING STATE                             */}
      {/* ==================================================================== */}
      {pipelineStatus !== AI_PIPELINE_STATUS.SUCCESS && (
        <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-md px-6 py-10 rounded-3xl bg-zinc-950/75 border border-rose-500/25 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,114,182,0.18)]">
          {/* Animated Artist Pencil Icon */}
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-600/20 blur-xl animate-pulse" />
            <motion.div
              animate={{
                rotate: [0, -12, 12, -8, 0],
                x: [0, 4, -4, 2, 0],
                y: [0, -4, 4, -2, 0],
              }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="text-4xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
            >
              ✏️
            </motion.div>
          </div>

          {/* Bengali & Tamil Status Heading */}
          <h3 className="text-xl sm:text-2xl font-serif text-amber-100/95 font-medium tracking-wide mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            একটু অপেক্ষা செய்... ✏️
          </h3>

          <div className="space-y-1 mb-6 text-sm sm:text-base font-serif text-rose-200/90 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            <p>ஒரு நினைவு...</p>
            <p className="text-amber-200/95 font-medium">ஒரு ஓவியமாக மாறிக்கொண்டிருக்கிறது.</p>
          </div>

          {pipelineStatus !== AI_PIPELINE_STATUS.ERROR ? (
            <div className="w-full space-y-2">
              <div className="w-48 sm:w-56 h-1.5 mx-auto bg-white/10 rounded-full overflow-hidden p-0.5 border border-rose-400/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 rounded-full"
                  initial={{ width: '15%' }}
                  animate={{
                    width:
                      pipelineProgress > 0 ? `${pipelineProgress}%` : ['20%', '65%', '90%', '98%'],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <p className="text-[11px] font-mono tracking-widest text-slate-400/70 uppercase">
                {pipelineStatus === AI_PIPELINE_STATUS.ANALYZING && 'Analyzing Memory Contours...'}
                {pipelineStatus === AI_PIPELINE_STATUS.EXTRACTING && 'Extracting Graphite Values...'}
                {pipelineStatus === AI_PIPELINE_STATUS.RENDERING && 'Handcrafting Realistic Pencil Strokes...'}
                {pipelineStatus === AI_PIPELINE_STATUS.IDLE && 'Preparing Studio Paper...'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <p className="text-sm font-serif italic text-rose-300">
                {errorMsg || 'ஒரு சிறிய தடங்கல்... மீண்டும் முயற்சி செய் ❤️'}
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium text-xs tracking-wider shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>மீண்டும் முயற்சி செய் ❤️</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. CINEMATIC DRAWING REVEAL CONTAINER                                */}
      {/* ==================================================================== */}
      {pipelineStatus === AI_PIPELINE_STATUS.SUCCESS && (
        <div className="relative z-20 w-full max-w-2xl flex flex-col items-center justify-center space-y-3 sm:space-y-4 px-3">
          {/* ELEGANT BUTTERFLIES FLYING NATURALLY ACROSS THE SCENE */}
          {revealStage >= 2 && (
            <>
              <NaturalFlyingButterfly
                id={1}
                colorScheme="rose"
                flightAnimation="butterflyFlightPath1"
                duration="15s"
                delay="0s"
                scale={0.88}
              />
              <NaturalFlyingButterfly
                id={2}
                colorScheme="gold"
                flightAnimation="butterflyFlightPath2"
                duration="18s"
                delay="2.5s"
                scale={0.82}
              />
              <NaturalFlyingButterfly
                id={3}
                colorScheme="ivory"
                flightAnimation="butterflyFlightPath3"
                duration="21s"
                delay="5s"
                scale={0.76}
              />
            </>
          )}

          {/* EMOTIONAL POETRY (ABOVE ARTWORK - NEVER COVERS FACES) */}
          <div className="min-h-[52px] flex flex-col items-center justify-center text-center px-4">
            <AnimatePresence>
              {/* Text 1: "சில நினைவுகளை படம் பிடிக்க முடியாது..." */}
              {revealStage >= 1 && (
                <motion.p
                  key="line1"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="text-base sm:text-lg md:text-xl font-serif text-slate-100 font-light tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
                >
                  "சில நினைவுகளை படம் பிடிக்க முடியாது..."
                </motion.p>
              )}

              {/* Text 2: "அதை மனசுல வரையணும். ❤️" */}
              {revealStage >= 3 && (
                <motion.p
                  key="line2"
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="text-base sm:text-lg md:text-xl font-serif text-rose-300 font-normal tracking-wide drop-shadow-[0_0_16px_rgba(244,63,94,0.7)]"
                >
                  அதை மனசுல வரையணும். ❤️
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* THE ARTWORK FRAME ON TEXTURED DRAWING PAPER WITH CORNER FLOWERS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative w-full max-w-[560px] aspect-[3/2] rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 bg-gradient-to-b from-stone-800/80 via-stone-900/90 to-zinc-950 border border-amber-200/30 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)]"
            style={{
              animation: revealStage >= 7 ? 'subtlePaperGlow 5s ease-in-out infinite' : undefined,
            }}
          >
            {/* CORNER FLOWERS (AROUND OUTER EDGES, NEVER OVER FACES) */}
            {revealStage >= 2 && (
              <>
                <CornerFloralOrnament position="top-left" />
                <CornerFloralOrnament position="top-right" />
                <CornerFloralOrnament position="bottom-left" />
                <CornerFloralOrnament position="bottom-right" />
              </>
            )}

            {/* Moving Rainbow Border around the Portrait Frame */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none p-[1.5px] overflow-hidden">
              <div
                className="w-full h-full rounded-2xl sm:rounded-3xl opacity-60"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(244,63,94,0.4) 0%, rgba(217,70,239,0.3) 25%, rgba(59,130,246,0.3) 50%, rgba(245,158,11,0.4) 75%, rgba(244,63,94,0.4) 100%)',
                }}
              />
            </div>

            {/* Inner Paper Canvas Wrapper */}
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#f7f6f0] shadow-inner">
              {/* Paper Deckle Edge & Lighting Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-[15]"
                style={{
                  boxShadow:
                    'inset 0 0 35px rgba(0,0,0,0.12), inset 0 0 10px rgba(70,50,30,0.08)',
                }}
              />

              {/* The Live Pencil Drawing Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover block relative z-[10]"
              />

              {/* VIRTUAL ARTIST 2B PENCIL CURSOR (FOLLOWS DRAWING STROKES) */}
              {pencilCoord.visible && (
                <div
                  className="absolute pointer-events-none z-[25] transition-all duration-75 ease-out"
                  style={{
                    left: `${pencilCoord.x}%`,
                    top: `${pencilCoord.y}%`,
                    transform: 'translate(-8px, -92px)',
                  }}
                >
                  <div className="absolute left-[7px] top-[90px] w-2.5 h-2.5 rounded-full bg-amber-300/60 blur-[1px] animate-[pencilTipLeadSpark_0.3s_ease-in-out_infinite]" />

                  <svg
                    width="44"
                    height="100"
                    viewBox="0 0 44 100"
                    className="filter drop-shadow-[6px_8px_8px_rgba(0,0,0,0.45)]"
                    style={{ transform: 'rotate(-25deg)', transformOrigin: '8px 92px' }}
                  >
                    <defs>
                      <linearGradient id="pencilWoodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="45%" stopColor="#fef3c7" />
                        <stop offset="70%" stopColor="#b45309" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                      <linearGradient id="pencilHexGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="35%" stopColor="#38bdf8" />
                        <stop offset="75%" stopColor="#0369a1" />
                        <stop offset="100%" stopColor="#075985" />
                      </linearGradient>
                    </defs>

                    <path d="M 12,0 L 28,0 L 28,68 L 12,68 Z" fill="url(#pencilHexGrad)" />
                    <rect x="12" y="66" width="16" height="4" fill="#cbd5e1" />
                    <polygon points="12,68 28,68 20,88" fill="url(#pencilWoodGrad)" />
                    <polygon points="18,84 22,84 20,93" fill="#1e293b" />
                  </svg>
                </div>
              )}
            </div>
          </motion.div>

          {/* CLIMAX TEXT & CONTINUE BUTTON (BELOW ARTWORK - NEVER COVERS PORTRAIT) */}
          <div className="flex flex-col items-center justify-center text-center space-y-2.5 pt-1 min-h-[90px]">
            <AnimatePresence>
              {/* Text 3: "ஒரு நினைவு... ஒரு ஓவியமாக மாறும்போது..." */}
              {revealStage >= 5 && revealStage < 7 && (
                <motion.p
                  key="line3"
                  initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 1.2 }}
                  className="text-sm sm:text-base md:text-lg font-serif italic text-amber-200/90 tracking-wide drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]"
                >
                  "ஒரு நினைவு... ஒரு ஓவியமாக மாறும்போது..."
                </motion.p>
              )}

              {/* Final Text 4: "இந்த நினைவு... எப்போதும் அழியாது. ❤️" */}
              {revealStage >= 7 && (
                <motion.div
                  key="finalReveal"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="space-y-3.5 flex flex-col items-center"
                >
                  <div className="space-y-1">
                    <p className="text-base sm:text-lg md:text-xl font-serif text-slate-200 font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                      இந்த நினைவு...
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-serif text-amber-200 font-normal tracking-wide drop-shadow-[0_0_20px_rgba(251,191,36,0.85)]">
                      எப்போதும் அழியாது. ❤️
                    </p>
                  </div>

                  {/* Glass / Rose-Gold "Continue ❤️" Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleContinue}
                    className="mt-1 px-10 sm:px-14 py-3.5 sm:py-4 rounded-full font-serif text-base sm:text-lg font-medium text-white tracking-wider cursor-pointer shadow-[0_0_35px_rgba(244,63,94,0.55)] border border-amber-300/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2.5"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(244,63,94,0.85) 0%, rgba(236,72,153,0.75) 50%, rgba(168,85,247,0.7) 100%)',
                    }}
                  >
                    <span>Continue ❤️</span>
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
