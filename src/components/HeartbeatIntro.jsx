import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import * as THREE from 'three';
import CinematicRainbowBorder from './CinematicRainbowBorder';
import { globalAudioEngine as globalHeartbeatEngine } from '../utils/audioEngine';

// ============================================================================
// ALL 13 EMOTIONAL TAMIL DIALOGUES ACROSS THE 4 SCENES
// ============================================================================
const DIALOGUES = [
  // --------------------------------------------------------------------------
  // SCENE 1 — THE AWAKENING (0–5 seconds)
  // Dark screen, soft deep heartbeat, tiny crystal heart slowly appears.
  // --------------------------------------------------------------------------
  {
    id: 1,
    scene: 1,
    sceneName: 'The Awakening',
    text: 'சரண்யா…',
    duration: 3400,
    cameraZ: 8.2,
    heartScale: 0.65,
    starsIntensity: 0.15,
    isName: true,
  },
  {
    id: 2,
    scene: 1,
    sceneName: 'The Awakening',
    text: 'என் மனசுக்குள்ள என்ன இருக்குன்னு உன்னால பார்க்க முடிஞ்சா…',
    duration: 4800,
    cameraZ: 7.6,
    heartScale: 0.8,
    starsIntensity: 0.25,
  },

  // --------------------------------------------------------------------------
  // SCENE 2 — FEELINGS REVEAL (Next ~10-15 seconds)
  // Heart pulses with heartbeat. Individual sentences fade in with readable pauses.
  // --------------------------------------------------------------------------
  {
    id: 3,
    scene: 2,
    sceneName: 'Feelings Reveal',
    text: 'நான் எப்பவும் சொல்லுற வார்த்தைகளை விட…',
    duration: 4200,
    cameraZ: 7.0,
    heartScale: 0.95,
    starsIntensity: 0.35,
  },
  {
    id: 4,
    scene: 2,
    sceneName: 'Feelings Reveal',
    text: 'உன்கிட்ட சொல்ல முடியாம மறைச்சு வச்சிருக்கிற உணர்வுகள்தான் அதிகம்.',
    duration: 4800,
    cameraZ: 6.8,
    heartScale: 1.0,
    starsIntensity: 0.45,
  },
  {
    id: 5,
    scene: 2,
    sceneName: 'Feelings Reveal',
    text: 'நீ சிரிக்கும்போது எனக்கு வர்ற சந்தோஷம்…',
    duration: 4200,
    cameraZ: 6.6,
    heartScale: 1.05,
    starsIntensity: 0.55,
  },
  {
    id: 6,
    scene: 2,
    sceneName: 'Feelings Reveal',
    text: 'நீ அமைதியா இருக்கும்போது எனக்குள்ள வர்ற கவலை…',
    duration: 4400,
    cameraZ: 6.8,
    heartScale: 1.05,
    starsIntensity: 0.6,
  },
  {
    id: 7,
    scene: 2,
    sceneName: 'Feelings Reveal',
    text: 'இதெல்லாம் உனக்கு முழுசா புரியுதான்னு எனக்குத் தெரியல.',
    duration: 4600,
    cameraZ: 7.0,
    heartScale: 1.1,
    starsIntensity: 0.7,
  },

  // --------------------------------------------------------------------------
  // SCENE 3 — EMOTIONAL CLIMAX
  // Music rises to its peak. Thousands of glowing stars emerge around the heart.
  // --------------------------------------------------------------------------
  {
    id: 8,
    scene: 3,
    sceneName: 'Emotional Climax',
    text: 'நீ என் வாழ்க்கையில வந்ததுக்குப் பிறகு…',
    duration: 4400,
    cameraZ: 7.2,
    heartScale: 1.15,
    starsIntensity: 1.0,
  },
  {
    id: 9,
    scene: 3,
    sceneName: 'Emotional Climax',
    text: 'என்னோட நாள்களில் ஒரு பகுதி உன்னை நினைக்காம போனதே இல்லை.',
    duration: 5000,
    cameraZ: 6.9,
    heartScale: 1.2,
    starsIntensity: 1.0,
  },
  {
    id: 10,
    scene: 3,
    sceneName: 'Emotional Climax',
    text: 'ஆனா, உன்னை நேசிக்கிறேன்னு சொல்றதை விட…',
    duration: 4400,
    cameraZ: 7.1,
    heartScale: 1.2,
    starsIntensity: 1.0,
  },
  {
    id: 11,
    scene: 3,
    sceneName: 'Emotional Climax',
    text: 'உன்னைப் புரிஞ்சுக்கிற ஒருத்தனா இருக்கணும்னுதான் எனக்கு ஆசை.',
    duration: 5200,
    cameraZ: 7.3,
    heartScale: 1.25,
    starsIntensity: 1.0,
  },

  // --------------------------------------------------------------------------
  // SCENE 4 — FINAL HEART REVEAL
  // Music remains serene. Crystal heart settles in centre.
  // --------------------------------------------------------------------------
  {
    id: 12,
    scene: 4,
    sceneName: 'Final Reveal',
    text: 'சரண்யா…',
    duration: 3600,
    cameraZ: 7.2,
    heartScale: 1.15,
    starsIntensity: 0.6,
    isName: true,
  },
  {
    id: 13,
    scene: 4,
    sceneName: 'Final Reveal',
    text: 'என் மனசைப் பார்க்க உனக்கு ஒரு வாய்ப்பு கொடுக்கிறியா?',
    duration: 0, // Stays visible until user clicks the button!
    cameraZ: 7.0,
    heartScale: 1.1,
    starsIntensity: 0.5,
    isFinal: true,
  },
];

export default function HeartbeatIntro({ onUnlock }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinalSceneReady, setIsFinalSceneReady] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // 3D Canvas Refs
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const heartGroupRef = useRef(null);
  const heartLightRef = useRef(null);
  const particlesRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const targetCameraZRef = useRef(8.2);
  const targetHeartScaleRef = useRef(0.65);
  const targetStarsOpacityRef = useRef(0.15);
  const currentStarsOpacityRef = useRef(0.15);
  const advanceTimerRef = useRef(null);

  // Intro Scene Audio Refs (intro.mp3 at full volume + rain/thunder ambience)
  const introAudioRef = useRef(null);
  const rainAudioContextRef = useRef(null);
  const rainGainNodeRef = useRef(null);
  const thunderTimeoutRef = useRef(null);

  const currentDialogue = DIALOGUES[currentIndex] || DIALOGUES[0];

  // --------------------------------------------------------------------------
  // 1. INTRO SCENE AUDIO: intro.mp3 (Full Volume) + Rain & Thunder Ambience
  // STRICTLY PRESERVES EXISTING HEARTBEAT (Not touched or modified)
  // --------------------------------------------------------------------------
  useEffect(() => {
    // A. Start / maintain existing heartbeat without modifying its volume or logic
    if (window.heartbeatEngine) {
      window.heartbeatEngine.start();
    }

    // Subscribe to pulse beats for 3D crystal heart visual synchronization
    const unsubscribeHeartbeat = globalHeartbeatEngine.subscribeBeat((type) => {
      if (type === 'LUB') {
        setPulseScale(1.15);
        setTimeout(() => setPulseScale(1.02), 110);
      } else if (type === 'DUB') {
        setPulseScale(1.22);
        setTimeout(() => setPulseScale(1.0), 160);
      }
    });

    // B. Main Background Music: public/intro.mp3 (at full volume)
    const introAudio = new Audio('/intro.mp3');
    introAudio.loop = true;
    introAudio.volume = 1.0; // Full volume as requested
    introAudioRef.current = introAudio;

    const playIntroMusic = () => {
      if (introAudioRef.current && introAudioRef.current.paused) {
        introAudioRef.current.play().catch((e) => {
          console.warn('Autoplay waiting for interaction:', e);
        });
      }
      if (rainAudioContextRef.current && rainAudioContextRef.current.state === 'suspended') {
        rainAudioContextRef.current.resume().catch(() => {});
      }
    };

    // Attempt playback immediately
    playIntroMusic();

    // Browser autoplay unlock listeners
    window.addEventListener('click', playIntroMusic, { once: true });
    window.addEventListener('touchstart', playIntroMusic, { once: true });
    window.addEventListener('keydown', playIntroMusic, { once: true });

    // C. Realistic, Cinematic Rain Ambience and Occasional Distant Thunder (Web Audio API)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        rainAudioContextRef.current = ctx;

        // 3-second stereo brown-pink noise buffer for gentle rainfall
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
        // Keep rain at a subtle, comfortable background level so music & dialogue lead
        rainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        rainGain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2.0);

        noiseNode.connect(bandpass);
        bandpass.connect(lowpass);
        lowpass.connect(rainGain);
        rainGain.connect(ctx.destination);
        noiseNode.start(0);

        // Occasional distant subtle rolling thunder (every 24–32s)
        const scheduleThunder = () => {
          const delay = 22000 + Math.random() * 10000;
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
              tFilter.frequency.exponentialRampToValueAtTime(36, now + 3.4);

              const tGain = tCtx.createGain();
              tGain.gain.setValueAtTime(0.0001, now);
              tGain.gain.linearRampToValueAtTime(0.05, now + 0.45); // Soft, non-intrusive
              tGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

              tNoise.connect(tFilter);
              tFilter.connect(tGain);
              tGain.connect(tCtx.destination);
              tNoise.start(now);
              tNoise.stop(now + 4.0);
            } catch {}
            scheduleThunder();
          }, delay);
        };

        scheduleThunder();
      }
    } catch (e) {
      console.warn('Rain ambience initialization deferred:', e);
    }

    // Cleanup: Stop intro music and rain/thunder when scene unmounts
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

  // Softly dip rain volume during key dialogues so Tamil words are crisp and clear
  useEffect(() => {
    if (rainGainNodeRef.current && rainAudioContextRef.current) {
      try {
        const now = rainAudioContextRef.current.currentTime;
        const targetGain = currentDialogue.isName || currentDialogue.isFinal ? 0.045 : 0.07;
        rainGainNodeRef.current.gain.cancelScheduledValues(now);
        rainGainNodeRef.current.gain.setValueAtTime(rainGainNodeRef.current.gain.value, now);
        rainGainNodeRef.current.gain.linearRampToValueAtTime(targetGain, now + 0.6);
      } catch {}
    }
  }, [currentDialogue]);

  // --------------------------------------------------------------------------
  // 2. DIALOGUE PROGRESSION (DOES NOT RESTART MUSIC OR EFFECTS)
  // --------------------------------------------------------------------------
  useEffect(() => {
    targetCameraZRef.current = currentDialogue.cameraZ || 7.2;
    targetHeartScaleRef.current = currentDialogue.heartScale || 1.0;
    targetStarsOpacityRef.current = currentDialogue.starsIntensity || 0.3;

    if (currentDialogue.isFinal) {
      setIsFinalSceneReady(true);
      return; // Do not auto-advance on the final question
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
  // 3. THREE.JS 3D CRYSTAL HEART & GALAXY OF STARS
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, targetCameraZRef.current);
    cameraRef.current = camera;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x2a0836, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff6090, 2.2);
    dirLight1.position.set(5, 5, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 2.0);
    dirLight2.position.set(-5, -3, -4);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xf472b6, 2.5);
    rimLight.position.set(0, -6, 5);
    scene.add(rimLight);

    // Heart Group
    const heartGroup = new THREE.Group();
    heartGroupRef.current = heartGroup;
    scene.add(heartGroup);

    // Extruded 3D Heart Curve
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.5);
    shape.bezierCurveTo(0, 0.8, -0.6, 1.2, -1.2, 1.2);
    shape.bezierCurveTo(-1.8, 1.2, -2.1, 0.6, -2.1, 0.1);
    shape.bezierCurveTo(-2.1, -0.7, -1.2, -1.4, 0, -2.2);
    shape.bezierCurveTo(1.2, -1.4, 2.1, -0.7, 2.1, 0.1);
    shape.bezierCurveTo(2.1, 0.6, 1.8, 1.2, 1.2, 1.2);
    shape.bezierCurveTo(0.6, 1.2, 0, 0.8, 0, 0.5);

    const heartGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.85,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.32,
      bevelThickness: 0.35,
    });
    heartGeo.center();

    // Physical Crystal Glass Material
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ff2060'),
      emissive: new THREE.Color('#88002a'),
      emissiveIntensity: 0.45,
      roughness: 0.06,
      metalness: 0.12,
      transmission: 0.85,
      ior: 1.54,
      thickness: 1.4,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.92,
    });
    const heartMesh = new THREE.Mesh(heartGeo, crystalMat);
    heartGroup.add(heartMesh);

    // Inner Faceted Core Wireframe
    const innerGeo = heartGeo.clone();
    const innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff85a2'),
      emissive: new THREE.Color('#ff0055'),
      emissiveIntensity: 0.7,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.scale.set(0.86, 0.86, 0.86);
    heartGroup.add(innerMesh);

    // Internal Light
    const heartPointLight = new THREE.PointLight(0xff2266, 3.2, 8);
    heartGroup.add(heartPointLight);
    heartLightRef.current = heartPointLight;

    // ------------------------------------------------------------------------
    // Radiant Star Particle System (2,400 Stars)
    // ------------------------------------------------------------------------
    const particleCount = 2400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64;
    starCanvas.height = 64;
    const ctx = starCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 200, 230, 0.9)');
    grad.addColorStop(0.6, 'rgba(236, 72, 153, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffd700'),
      new THREE.Color('#f43f5e'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#fbcfe8'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      map: starTexture,
      transparent: true,
      opacity: 0.2,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (cameraRef.current) {
        cameraRef.current.position.z += (targetCameraZRef.current - cameraRef.current.position.z) * 0.04;
      }

      currentStarsOpacityRef.current += (targetStarsOpacityRef.current - currentStarsOpacityRef.current) * 0.035;
      if (particlesRef.current) {
        particlesRef.current.material.opacity = currentStarsOpacityRef.current;
        particlesRef.current.rotation.y = elapsedTime * 0.04;
        particlesRef.current.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;
      }

      if (heartGroupRef.current) {
        heartGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.28;
        heartGroupRef.current.rotation.x = Math.cos(elapsedTime * 0.4) * 0.08;
        heartGroupRef.current.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

        const baseTarget = targetHeartScaleRef.current;
        const currentScale = heartGroupRef.current.scale.x;
        const targetScale = baseTarget * pulseScale;
        const newScale = currentScale + (targetScale - currentScale) * 0.18;
        heartGroupRef.current.scale.set(newScale, newScale, newScale);
      }

      if (heartLightRef.current) {
        heartLightRef.current.intensity = 2.8 + (pulseScale - 1) * 6.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      heartGeo.dispose();
      crystalMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      starTexture.dispose();
    };
  }, [pulseScale]);

  // --------------------------------------------------------------------------
  // 4. CLEAN TRANSITION: STOPS intro.mp3 & RAIN/THUNDER, ADVANCES TO PASSCODE GATE
  // --------------------------------------------------------------------------
  const handleFinalUnlock = () => {
    // A. Smoothly fade out intro.mp3 over 600ms
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

    // B. Stop rain & thunder ambience cleanly
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

    // C. Confetti Celebration
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ffd700', '#ffffff', '#ff69b4', '#c084fc'],
    });

    // D. Transition to existing next scene (PasscodeGate)
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
        rainGainNodeRef.current.gain.setValueAtTime(next ? 0.0001 : 0.07, now);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#05010a] text-white select-none overflow-hidden z-30 font-sans flex flex-col items-center justify-between">
      {/* 1. CINEMATIC RAINBOW BORDER ACROSS SCREEN PERIMETER */}
      <CinematicRainbowBorder mode="screen" />

      {/* 2. THREE.JS 3D CRYSTAL HEART & STELLAR GALAXY CANVAS */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 3. ATMOSPHERIC VIOLET MIST & VIGNETTE OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Violet Core Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />
        
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/85 pointer-events-none" />
      </div>

      {/* 4. TOP CONTROLS BAR */}
      <div className="relative z-40 w-full px-6 py-6 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-rose-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
          <span>Scene {currentDialogue.scene} of 4</span>
          <span className="text-gray-400">·</span>
          <span className="text-rose-200/75 italic text-[11px]">{currentDialogue.sceneName}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-rose-200 hover:text-white transition active:scale-95 cursor-pointer shadow-lg"
            title={isMuted ? 'ஒலியை இயக்கு' : 'ஒலியை நிறுத்து'}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {!isFinalSceneReady && (
            <button
              onClick={handleSkipToFinal}
              className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-rose-950/60 backdrop-blur-md border border-rose-400/30 text-rose-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-lg"
              title="நேரடியாக இறுதி கேள்விக்கு செல்ல"
            >
              <Sparkles size={12} className="text-amber-300 animate-spin" />
              <span>நேரடியாக இறுதிக்கு →</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. CENTRAL EMOTIONAL DIALOGUE DISPLAY */}
      <div className="relative z-40 w-full max-w-2xl px-6 py-4 flex-1 flex flex-col items-center justify-center text-center pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDialogue.id}
            initial={{ opacity: 0, y: 18, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center justify-center space-y-5"
          >
            {currentDialogue.isName ? (
              /* Name highlight: “சரண்யா…” */
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.3em] font-mono text-rose-400/80 font-semibold">
                  Dedicated To My One & Only
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-wider drop-shadow-[0_0_25px_rgba(244,114,182,0.85)]">
                  {currentDialogue.text}
                </h1>
              </div>
            ) : (
              /* Emotional Sentence with Elegant Tamil Typography */
              <div className="space-y-3 px-4">
                <p className="text-lg sm:text-2xl md:text-3xl font-serif font-medium text-slate-100 leading-relaxed drop-shadow-[0_2px_20px_rgba(244,63,94,0.45)]">
                  “{currentDialogue.text}”
                </p>

                {currentDialogue.isFinal && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-xs sm:text-sm font-serif italic text-rose-300/80 tracking-wide"
                  >
                    ஒரு அழகான கதை… உன்னால்தான் ஆரம்பிக்குது. ✨
                  </motion.p>
                )}
              </div>
            )}

            {/* Optional gentle tap to read next sentence faster */}
            {!currentDialogue.isFinal && (
              <button
                onClick={handleNextDialogue}
                className="mt-4 px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-rose-200/60 hover:text-rose-200 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>தொடர தட்டவும்</span>
                <ArrowRight size={12} />
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 6. SCENE 4: FINAL REVEAL BUTTON — “என் மனசுக்குள்ள வா ❤️” */}
        {isFinalSceneReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm mt-8 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleFinalUnlock}
              className="w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-base sm:text-lg shadow-[0_0_40px_rgba(244,63,94,0.6),0_0_15px_rgba(168,85,247,0.4)] border border-rose-400/40 flex items-center justify-center gap-3 transition cursor-pointer group"
            >
              <Heart className="w-5 h-5 fill-white group-hover:scale-115 transition-transform duration-300" />
              <span>என் மனசுக்குள்ள வா ❤️</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* 7. BOTTOM SUBTLE CARDIAC WAVEFORM & PROGRESS DOTS */}
      <div className="relative z-40 w-full px-6 py-6 flex flex-col items-center gap-3 pointer-events-none">
        {/* Progress Dots through the 13 dialogue beats */}
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
                  ? 'w-2 bg-rose-400/40'
                  : 'w-1.5 bg-white/15'
              }`}
              title={`Dialogue ${idx + 1}`}
            />
          ))}
        </div>

        {/* Soft Heartbeat BPM Indicator */}
        <div className="flex items-center gap-2 text-rose-300/50 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          <span>Synchronized Heartbeat · Deep Emotional Connection</span>
        </div>
      </div>
    </div>
  );
}
