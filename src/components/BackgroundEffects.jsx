import React, { useEffect, useRef, useState } from 'react';
import { useScene, SCENES } from '../context/SceneProvider';

export default function BackgroundEffects() {
  const { currentScene, storyIntensity, isLowEnd, isMobile } = useScene();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [flowerClicks, setFlowerClicks] = useState([1.0, 1.0, 1.0, 1.0]);

  // Keep ref to current settings for RAF loop
  const settingsRef = useRef({ storyIntensity, isLowEnd, currentScene });
  useEffect(() => {
    settingsRef.current = { storyIntensity, isLowEnd, currentScene };
  }, [storyIntensity, isLowEnd, currentScene]);

  // Track mouse coordinates for firefly attraction and parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFlowerClick = (idx) => {
    setFlowerClicks(prev => {
      const next = [...prev];
      next[idx] = 1.35; // Grow flower on click
      return next;
    });
    // Trigger localized small heart burst on click
    if (window.triggerHeartBurst) {
      const xOffset = window.innerWidth * (0.15 + idx * 0.23);
      window.triggerHeartBurst(xOffset, window.innerHeight - 60, 8);
    }
    // Play chime feedback
    if (window.playRomanticChime) window.playRomanticChime();
  };

  // Shrink clicked flowers back over time
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowerClicks(prev => prev.map(val => Math.max(1.0, val - 0.02)));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic Star Object Definition
    class Star {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height * 0.75;
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.6;
        this.size = Math.random() * 1.5 + 0.4;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.015 + 0.005;
      }
      update() {
        this.phase += this.speed;
      }
      draw(parallaxX, parallaxY) {
        ctx.fillStyle = '#ffffff';
        const alpha = 0.15 + Math.abs(Math.sin(this.phase)) * 0.6;
        ctx.globalAlpha = alpha;

        // Apply low-amplitude parallax offset
        const drawX = (this.x + parallaxX * 12) % canvas.width;
        const drawY = (this.y + parallaxY * 8) % canvas.height;

        ctx.beginPath();
        ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Dynamic Firefly Object Definition
    class Firefly {
      constructor() {
        this.reset();
        this.y = canvas.height * 0.35 + Math.random() * canvas.height * 0.5;
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * 0.35 + Math.random() * canvas.height * 0.55;
        this.size = Math.random() * 2.2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.04 + 0.015;
      }
      update(targetX, targetY) {
        this.phase += this.speed;
        this.x += this.vx;
        this.y += this.vy;

        // Drift slowly toward mouse/touch coordinates if nearby
        if (targetX && targetY) {
          const dx = targetX - this.x;
          const dy = targetY - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            this.x += dx * 0.012;
            this.y += dy * 0.012;
          }
        }

        // Bound check
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < canvas.height * 0.25 || this.y > canvas.height - 30) this.vy *= -1;
      }
      draw() {
        const glow = 0.25 + Math.abs(Math.sin(this.phase)) * 0.65;
        ctx.fillStyle = '#ffea75';
        ctx.shadowColor = '#ffe74c';
        ctx.shadowBlur = this.size * 3.5;
        ctx.globalAlpha = glow;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize Pools
    const starsList = Array.from({ length: 120 }, () => new Star());
    const firefliesList = Array.from({ length: 60 }, () => new Firefly());

    const updateAndDrawFrame = () => {
      time += 0.02;
      const { storyIntensity: intensity, isLowEnd: low, currentScene: scene } = settingsRef.current;

      // Parallax offsets (scroll/mouse coordinate mappings)
      const pX = (mousePos.x / window.innerWidth - 0.5) * 0.25;
      const pY = (mousePos.y / window.innerHeight - 0.5) * 0.25;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Starfield (density driven by storyIntensity & lowEnd throttling)
      const targetStars = low ? 40 : 100;
      const starRatio = Math.max(0.12, intensity);
      const activeStarsCount = Math.floor(targetStars * starRatio);

      for (let i = 0; i < activeStarsCount; i++) {
        starsList[i].update();
        starsList[i].draw(pX, pY);
      }

      // 2. Draw Fireflies (only spawn after Scene 2, count scales with intensity)
      if (scene !== SCENES.INTRO && scene !== SCENES.GATECHECK) {
        const targetFireflies = low ? 16 : 38;
        // Spikes on YES celebration
        const celebrationMultiplier = scene === SCENES.YES ? 1.6 : 1.0;
        const activeFirefliesCount = Math.floor(targetFireflies * intensity * celebrationMultiplier);

        for (let i = 0; i < activeFirefliesCount; i++) {
          firefliesList[i].update(mousePos.x, mousePos.y);
          firefliesList[i].draw();
        }
      }

      // 3. Draw Water Reflection Strip at the bottom
      const waterHeight = 44;
      const waterY = canvas.height - waterHeight;

      // Water Base
      ctx.globalAlpha = 1.0;
      const waterGrad = ctx.createLinearGradient(0, waterY, 0, canvas.height);
      const waterOpacity = 0.12 + intensity * 0.32;
      waterGrad.addColorStop(0, `rgba(18, 12, 34, ${waterOpacity})`);
      waterGrad.addColorStop(1, `rgba(5, 3, 10, ${waterOpacity + 0.1})`);
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, waterY, canvas.width, waterHeight);

      // Ripple lines
      const rippleLinesCount = isMobile ? 3 : 5;
      ctx.lineWidth = 1.25;

      for (let i = 0; i < rippleLinesCount; i++) {
        const lineOffset = (i / rippleLinesCount) * waterHeight;
        const speedMultiplier = 1.0 + (i * 0.2);
        
        ctx.strokeStyle = `rgba(242, 133, 168, ${0.03 + intensity * 0.12})`;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 15) {
          const y = waterY + lineOffset + Math.sin(x * 0.015 + time * speedMultiplier) * (1.8 + intensity * 2.2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(updateAndDrawFrame);
    };

    animId = requestAnimationFrame(updateAndDrawFrame);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [mousePos]);

  // Adjust moon glow/drift based on intensity
  const moonX = 50 + storyIntensity * 12; // slowly drifts right
  const moonOpacity = 0.25 + storyIntensity * 0.55;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none transition-colors duration-1000"
      style={{
        background: `radial-gradient(circle at 50% 30%, 
          rgba(${Math.round(8 + storyIntensity * 28)}, ${Math.round(6 + storyIntensity * 12)}, ${Math.round(18 + storyIntensity * 36)}, 1) 0%, 
          #05020a 100%)`
      }}
    >
      {/* Background Canvas for stars, fireflies, and water */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Persistent Moon Overlay */}
      <div
        className="absolute top-10 rounded-full bg-white/90 filter transition-all duration-1000"
        style={{
          left: `${moonX}%`,
          width: isMobile ? '50px' : '75px',
          height: isMobile ? '50px' : '75px',
          opacity: moonOpacity,
          boxShadow: `0 0 ${isMobile ? '35px' : '65px'} rgba(255, 255, 255, ${0.35 + storyIntensity * 0.45})`
        }}
      />

      {/* Gentle Floating Fog/Mist Blobs */}
      <div
        className="absolute bottom-12 left-1/4 rounded-full w-[260px] h-[160px] bg-rose-500/5 filter blur-[60px] animate-glow-pulse pointer-events-none transition-all duration-[3000ms]"
        style={{ opacity: 0.15 - storyIntensity * 0.05 }} // thins as garden warms
      />
      <div
        className="absolute bottom-16 right-1/4 rounded-full w-[320px] h-[180px] bg-indigo-500/5 filter blur-[70px] animate-glow-pulse pointer-events-none transition-all duration-[3000ms]"
        style={{ animationDelay: '-1.5s', opacity: 0.15 - storyIntensity * 0.05 }}
      />

      {/* Persistent Ground-Level SVG Flowers */}
      <div className="absolute bottom-8 inset-x-0 flex justify-around px-8 pointer-events-auto z-20">
        {[0, 1, 2, 3].map((idx) => {
          // Bloom open scale linked to storyIntensity
          const bloomScale = 0.5 + storyIntensity * 0.5;
          const scale = bloomScale * flowerClicks[idx];
          // Sway angles
          const swayDelay = `${idx * 0.6}s`;

          return (
            <button
              key={idx}
              onClick={() => handleFlowerClick(idx)}
              className="group focus:outline-none transition-transform duration-300 active:scale-95 origin-bottom"
              style={{
                transform: `scale(${scale})`,
                animation: `flowerSway ${4 + idx}s ease-in-out infinite`,
                animationDelay: swayDelay
              }}
            >
              <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {/* Stem */}
                <path d="M50,90 Q48,65 50,45" fill="none" stroke="#2a4725" strokeWidth="4" strokeLinecap="round" />
                <path d="M50,70 Q62,60 58,52" fill="none" stroke="#2a4725" strokeWidth="2" strokeLinecap="round" />
                
                {/* Leaves */}
                <path d="M58,52 C60,45 52,40 50,45 C51,48 53,52 58,52 Z" fill="#2a4725" />

                {/* Petals */}
                <circle cx="50" cy="45" r="12" fill="#d64577" className="group-hover:fill-rose-500 transition-colors" />
                <circle cx="50" cy="28" r="11" fill="#f285a8" className="group-hover:fill-rose-400 transition-colors" />
                <circle cx="50" cy="62" r="11" fill="#f285a8" className="group-hover:fill-rose-400 transition-colors" />
                <circle cx="33" cy="45" r="11" fill="#f285a8" className="group-hover:fill-rose-400 transition-colors" />
                <circle cx="67" cy="45" r="11" fill="#f285a8" className="group-hover:fill-rose-400 transition-colors" />
                
                {/* Center Core */}
                <circle cx="50" cy="45" r="5" fill="#ffd43f" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
