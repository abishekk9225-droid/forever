import React, { useEffect, useRef, useState } from 'react';
import { useScene, SCENES } from '../context/SceneProvider';

const isAccepted = (s) => s === SCENES.QUIZ || s === SCENES.PROMISE_VAULT || s === SCENES.CERTIFICATE || s === SCENES.FINALE;

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

    // Dynamic Firefly Object Definition (Optimized as softly pulsating bioluminescent embers)
    class Firefly {
      constructor() {
        this.reset();
        this.y = canvas.height * 0.35 + Math.random() * canvas.height * 0.5;
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * 0.35 + Math.random() * canvas.height * 0.55;
        this.size = Math.random() * 1.5 + 0.6; // Smaller, softer embers
        this.vx = (Math.random() - 0.5) * 0.45; // Slower horizontal drift
        this.vy = (Math.random() - 0.5) * 0.35; // Slower vertical drift
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.02 + 0.01; // Slower pulsation frequency
      }
      update(targetX, targetY) {
        this.phase += this.speed;
        this.x += this.vx;
        this.y += this.vy;

        // Ethereal slow attraction when cursor is within proximity
        if (targetX && targetY) {
          const dx = targetX - this.x;
          const dy = targetY - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            this.x += dx * 0.008;
            this.y += dy * 0.008;
          }
        }

        // Bound collision checks
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < canvas.height * 0.25 || this.y > canvas.height - 30) this.vy *= -1;
      }
      draw() {
        const glow = 0.2 + Math.abs(Math.sin(this.phase)) * 0.7;
        ctx.fillStyle = '#ffdf6d';
        ctx.shadowColor = '#ffd338';
        ctx.shadowBlur = this.size * 5.0; // Ethereal emission halo
        ctx.globalAlpha = glow;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Dynamic Butterfly Class
    class Butterfly {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        const { currentScene: scene } = settingsRef.current;
        if (isAccepted(scene)) {
          this.x = canvas.width / 2 + (Math.random() - 0.5) * 60;
          this.y = canvas.height / 2 + (Math.random() - 0.5) * 60;
          this.size = Math.random() * 0.45 + 0.35; // slightly smaller for higher density
          this.speed = Math.random() * 2.8 + 1.6; // faster flight for explosion outward
          this.angle = Math.random() * Math.PI * 2;
        } else {
          this.x = init ? Math.random() * canvas.width : (Math.random() < 0.5 ? -30 : canvas.width + 30);
          this.y = Math.random() * canvas.height * 0.8;
          this.size = Math.random() * 0.5 + 0.5; // Scale factor
          this.speed = Math.random() * 0.8 + 0.6; // Speed of travel
          
          if (!init) {
            if (this.x < 0) {
              this.angle = (Math.random() - 0.5) * 0.5; // moving right
            } else {
              this.angle = Math.PI + (Math.random() - 0.5) * 0.5; // moving left
            }
          } else {
            this.angle = Math.random() * Math.PI * 2;
          }
        }
        
        const colors = ['#F472B6', '#38BDF8', '#A78BFA', '#FBBF24', '#34D399', '#FB7185'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.flapPhase = Math.random() * Math.PI * 2;
        this.flapSpeed = Math.random() * 0.18 + 0.14; // slightly faster wing flaps
        this.noiseOffset = Math.random() * 1000;
      }
      update() {
        this.flapPhase += this.flapSpeed;
        
        // Ethereal curvilinear motion
        this.angle += Math.sin(time + this.noiseOffset) * 0.02;
        
        const vx = Math.cos(this.angle) * this.speed;
        const vy = (Math.sin(this.angle) + Math.sin(time * 2 + this.noiseOffset) * 0.3) * this.speed * 0.8;
        
        this.x += vx;
        this.y += vy;

        if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
          this.reset();
        }
      }
      draw() {
        const flapScale = 0.25 + 0.75 * Math.abs(Math.sin(this.flapPhase));
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2); // Align heading along movement path
        ctx.globalAlpha = 0.85;
        
        const { isLowEnd } = settingsRef.current;
        if (!isLowEnd) {
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 12;
        }
        
        // Wing 1 (Left)
        ctx.save();
        ctx.scale(-flapScale * this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-15, -20, -30, -10, -25, 10);
        ctx.bezierCurveTo(-20, 25, -5, 15, 0, 0);
        ctx.fill();
        ctx.restore();
        
        // Wing 2 (Right)
        ctx.save();
        ctx.scale(flapScale * this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(15, -20, 30, -10, 25, 10);
        ctx.bezierCurveTo(20, 25, 5, 15, 0, 0);
        ctx.fill();
        ctx.restore();
        
        // Body
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#110c24';
        ctx.beginPath();
        ctx.ellipse(0, 2, 1.5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Antennae
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(-0.5, -6);
        ctx.quadraticCurveTo(-3, -12, -6, -14);
        ctx.moveTo(0.5, -6);
        ctx.quadraticCurveTo(3, -12, 6, -14);
        ctx.stroke();
        
        ctx.restore();
      }
    }

    // Celebration Butterfly Class
    class CelebrationButterfly {
      constructor(canvasWidth, canvasHeight, startX, startY) {
        this.x = startX || canvasWidth / 2;
        this.y = startY || canvasHeight / 2;
        this.size = Math.random() * 9 + 8; // 8px - 17px
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 1.5; // Upward bias
        this.flapSpeed = Math.random() * 0.25 + 0.15;
        this.flapPhase = Math.random() * Math.PI;
        this.colors = ['#F43F5E', '#EC4899', '#A855F7', '#38BDF8', '#34D399', '#FBBF24', '#FB7185', '#E879F9'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.alpha = 1;
      }

      update(width, height) {
        this.x += this.vx + Math.sin(this.flapPhase) * 1.5;
        this.y += this.vy;
        this.flapPhase += this.flapSpeed;

        // Wrap around screen gracefully
        if (this.y < -30) this.y = height + 20;
        if (this.x < -30) this.x = width + 20;
        if (this.x > width + 30) this.x = -20;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowBlur = 14;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        const wingScale = Math.abs(Math.sin(this.flapPhase));

        // Left Wing
        ctx.beginPath();
        ctx.ellipse(-this.size * 0.6 * wingScale, 0, this.size * 0.8 * wingScale, this.size * 0.5, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Right Wing
        ctx.beginPath();
        ctx.ellipse(this.size * 0.6 * wingScale, 0, this.size * 0.8 * wingScale, this.size * 0.5, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-1, -this.size * 0.4, 2, this.size * 0.8);
        ctx.restore();
      }
    }

    // Track last scene to trigger transition events
    let lastScene = null;

    // Initialize Pools
    const starsList = Array.from({ length: 120 }, () => new Star());
    const firefliesList = Array.from({ length: 60 }, () => new Firefly());
    const butterfliesList = Array.from({ length: 24 }, () => new Butterfly());
    const celebrationButterfliesList = Array.from({ length: 100 }, () => new CelebrationButterfly(window.innerWidth || 1200, window.innerHeight || 800));

    const updateAndDrawFrame = () => {
      time += 0.02;
      const { storyIntensity: intensity, isLowEnd: low, currentScene: scene } = settingsRef.current;

      // Reset all celebration butterflies to center to explode outward on YES scene transition
      if (isAccepted(scene) && !isAccepted(lastScene)) {
        for (let i = 0; i < celebrationButterfliesList.length; i++) {
          const b = celebrationButterfliesList[i];
          b.x = canvas.width / 2;
          b.y = canvas.height / 2;
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 2;
          b.vx = Math.cos(angle) * speed;
          b.vy = Math.sin(angle) * speed - 1.5;
          b.flapPhase = Math.random() * Math.PI;
        }
      }
      lastScene = scene;

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
      if (scene !== SCENES.INTRO && scene !== SCENES.ASK_DIALOGUE) {
        const targetFireflies = low ? 16 : 38;
        // Spikes on YES celebration
        const celebrationMultiplier = isAccepted(scene) ? 1.6 : 1.0;
        const activeFirefliesCount = Math.floor(targetFireflies * intensity * celebrationMultiplier);

        for (let i = 0; i < activeFirefliesCount; i++) {
          firefliesList[i].update(mousePos.x, mousePos.y);
          firefliesList[i].draw();
        }
      }

      // 2b. Draw Butterflies (active across all scenes, count based on performance)
      if (isAccepted(scene)) {
        const activeCelebrationCount = low ? 50 : 80;
        for (let i = 0; i < activeCelebrationCount; i++) {
          celebrationButterfliesList[i].update(canvas.width, canvas.height);
          celebrationButterfliesList[i].draw(ctx);
        }
      } else {
        const activeButterfliesCount = low ? 5 : 11;
        for (let i = 0; i < activeButterfliesCount; i++) {
          butterfliesList[i].update();
          butterfliesList[i].draw();
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

  // Memoize floating elements to prevent recreation on re-renders
  const floatingItems = React.useMemo(() => {
    const assets = [
      { val: '🦋', size: 1.6, opacity: 0.38, duration: 18, delay: 0 },
      { val: '🌹', size: 1.5, opacity: 0.33, duration: 22, delay: -4 },
      { val: '🧸', size: 1.8, opacity: 0.28, duration: 26, delay: -8 },
      { val: '🎈', size: 1.7, opacity: 0.28, duration: 20, delay: -12 },
      { val: '🌸', size: 1.3, opacity: 0.38, duration: 19, delay: -3 },
      { val: '🍭', size: 1.4, opacity: 0.28, duration: 24, delay: -6 },
      { val: '💖', size: 1.5, opacity: 0.38, duration: 17, delay: -15 },
      { val: '🫧', size: 1.6, opacity: 0.33, duration: 15, delay: -2 },
      { val: '🍃', size: 1.2, opacity: 0.38, duration: 21, delay: -7 },
      { val: '🌷', size: 1.4, opacity: 0.33, duration: 23, delay: -1 },
      { val: '🦋', size: 1.7, opacity: 0.38, duration: 16, delay: -9 },
      { val: '🧸', size: 1.6, opacity: 0.28, duration: 27, delay: -5 },
      { val: '🌺', size: 1.5, opacity: 0.33, duration: 23, delay: -11 },
      { val: '🎈', size: 1.8, opacity: 0.28, duration: 21, delay: -14 },
      { val: '💖', size: 1.4, opacity: 0.38, duration: 19, delay: -10 },
      { val: '🫧', size: 1.3, opacity: 0.33, duration: 14, delay: -13 }
    ];

    return assets.map((item, idx) => {
      // Position spread
      const x = 5 + (idx * 23) % 90;
      const y = 8 + (idx * 19) % 78;
      const driftX = (idx % 2 === 0 ? 1 : -1) * (20 + (idx * 6) % 35);
      const driftY = -1 * (35 + (idx * 8) % 45); // general upward drift

      return {
        id: idx,
        val: item.val,
        size: item.size,
        opacity: item.opacity,
        duration: item.duration,
        delay: item.delay,
        x,
        y,
        driftX,
        driftY,
        parallaxFactor: 0.015 + (idx % 3) * 0.015
      };
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none transition-colors duration-1000"
      style={{
        background: `radial-gradient(circle at 50% 25%, 
          rgba(${Math.round(12 + storyIntensity * 28)}, ${Math.round(18 + storyIntensity * 12)}, ${Math.round(48 + storyIntensity * 36)}, 0.4) 0%, 
          #050814 65%, 
          #02040a 100%)`
      }}
    >
      {/* CSS Stylesheet for floating drift keyframe animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatDriftAnim {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          55% {
            transform: translate3d(var(--drift-x), var(--drift-y), 0) rotate(180deg);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(360deg);
          }
        }
        .float-drift-element {
          animation: floatDriftAnim var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }
      `}} />

      {/* Cinematic Ambient Night Layer */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b132b] via-[#050814] to-[#02040a] opacity-90" />
      <div className="fixed inset-0 pointer-events-none z-[2] bg-[radial-gradient(circle_at_center,_transparent_45%,_rgba(2,4,10,0.85)_100%)]" />

      {/* Background Canvas for stars, fireflies, and water */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Ambient Floating Elements (Drifting Butterflies, Florals, and 3D toys) */}
      {floatingItems.map((item) => {
        // Calculate mouse parallax translate offsets
        const mouseOffsetW = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
        const mouseOffsetH = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
        const dx = (mousePos.x - mouseOffsetW) * item.parallaxFactor;
        const dy = (mousePos.y - mouseOffsetH) * item.parallaxFactor;

        return (
          <div
            key={item.id}
            className="absolute pointer-events-none select-none float-drift-element font-sans"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: `${item.size}rem`,
              opacity: item.opacity,
              '--drift-x': `${item.driftX}px`,
              '--drift-y': `${item.driftY}px`,
              '--duration': `${item.duration}s`,
              '--delay': `${item.delay}s`,
              filter: `
                drop-shadow(0 8px 12px rgba(0, 0, 0, 0.45))
                drop-shadow(0 0 10px rgba(224, 168, 153, 0.15))
              `,
              transform: `translate3d(${dx}px, ${dy}px, 0)`,
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              zIndex: 3
            }}
          >
            {item.val}
          </div>
        );
      })}

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
