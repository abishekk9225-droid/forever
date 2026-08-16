import React, { useEffect, useRef, useState } from 'react';

// Maps scene → how many stars, firefly intensity, warm moonlight level
const SCENE_ENV = {
  scene1_mystery:    { stars: 6,  fireflies: 0,  warmth: 0.0 },
  scene2_check:      { stars: 8,  fireflies: 0,  warmth: 0.0 },
  scene2_stop:       { stars: 8,  fireflies: 0,  warmth: 0.0 },
  scene3_call:       { stars: 15, fireflies: 4,  warmth: 0.1 },
  scene4_feelings:   { stars: 20, fireflies: 8,  warmth: 0.15 },
  scene4_transition: { stars: 30, fireflies: 14, warmth: 0.2 },
  scene5_poetry:     { stars: 35, fireflies: 18, warmth: 0.25 },
  scene6_lovemeter:  { stars: 30, fireflies: 12, warmth: 0.2 },
  scene7_buildup:    { stars: 40, fireflies: 22, warmth: 0.3 },
  scene8_letter:     { stars: 45, fireflies: 25, warmth: 0.35 },
  scene9_suspense:   { stars: 50, fireflies: 5,  warmth: 0.0 }, // Focus, dim fireflies
  scene10_proposal:  { stars: 55, fireflies: 8,  warmth: 0.4 },
  scene11_yes:       { stars: 70, fireflies: 35, warmth: 0.6 },
  scene11_final:     { stars: 60, fireflies: 20, warmth: 0.5 },
  let_me_think:      { stars: 30, fireflies: 8,  warmth: 0.1 },
};

export default function BackgroundEffects({ scene = 'scene1_mystery' }) {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(true);
  const sceneRef = useRef(scene);

  useEffect(() => { sceneRef.current = scene; }, [scene]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    const handleMouseMove = (e) => {
      if (window.innerWidth >= 768) setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Particle (rising hearts/orbs) ---
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 2.5 + 1;
        this.speedY = -(Math.random() * 0.35 + 0.12);
        this.speedX = (Math.random() - 0.5) * 0.12;
        this.opacity = Math.random() * 0.3 + 0.08;
        this.wobbleSpeed = Math.random() * 0.02 + 0.005;
        this.wobbleVal = Math.random() * Math.PI * 2;
        this.isHeart = Math.random() > 0.72;
      }
      update() {
        this.y += this.speedY;
        this.wobbleVal += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobbleVal) * 0.1;
        if (this.y < 100) this.opacity -= 0.003;
        if (this.y < 0 || this.opacity <= 0) this.reset();
      }
      draw() {
        ctx.fillStyle = `rgba(214, 69, 119, ${this.opacity})`;
        ctx.shadowColor = 'rgba(214, 69, 119, 0.25)';
        ctx.shadowBlur = 3;
        if (this.isHeart) {
          const x = this.x, y = this.y, s = this.size * 1.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(x - s/2, y - s/2, x - s, y + s/3, x, y + s);
          ctx.bezierCurveTo(x + s, y + s/3, x + s/2, y - s/2, x, y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    }

    // --- Star ---
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.7;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseOpacity = Math.random() * 0.5 + 0.15;
        this.opacity = this.baseOpacity;
        this.twinkleSpeed = Math.random() * 0.02 + 0.006;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.phase += this.twinkleSpeed;
        this.opacity = this.baseOpacity + Math.sin(this.phase) * 0.15;
      }
      draw() {
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, this.opacity)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- Firefly ---
    class Firefly {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * 0.3 + Math.random() * canvas.height * 0.6;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.phase = Math.random() * Math.PI * 2;
        this.phaseSpeed = Math.random() * 0.03 + 0.01;
        this.size = Math.random() * 1.5 + 1;
      }
      update() {
        this.phase += this.phaseSpeed;
        this.x += this.vx + Math.sin(this.phase * 0.7) * 0.3;
        this.y += this.vy + Math.cos(this.phase) * 0.2;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < canvas.height * 0.2 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        const glow = 0.3 + Math.abs(Math.sin(this.phase)) * 0.5;
        ctx.fillStyle = `rgba(253, 224, 71, ${glow})`;
        ctx.shadowColor = 'rgba(253, 224, 71, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Pools — sized based on device
    const baseCount = isMobile ? 14 : 28;
    const particles = Array.from({ length: baseCount }, () => new Particle());

    // Stars and fireflies are managed dynamically per scene
    let stars = [];
    let fireflies = [];
    let lastStarCount = -1;
    let lastFireflyCount = -1;

    const animate = () => {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const env = SCENE_ENV[sceneRef.current] || SCENE_ENV['scene1_mystery'];
        const targetStars = isMobile ? Math.floor(env.stars * 0.6) : env.stars;
        const targetFireflies = isMobile ? Math.floor(env.fireflies * 0.5) : env.fireflies;

        // Adjust stars count
        if (targetStars !== lastStarCount) {
          while (stars.length < targetStars) stars.push(new Star());
          if (stars.length > targetStars) stars.splice(targetStars);
          lastStarCount = targetStars;
        }

        // Adjust firefly count
        if (targetFireflies !== lastFireflyCount) {
          while (fireflies.length < targetFireflies) fireflies.push(new Firefly());
          if (fireflies.length > targetFireflies) fireflies.splice(targetFireflies);
          lastFireflyCount = targetFireflies;
        }

        stars.forEach(s => { s.update(); s.draw(); });
        particles.forEach(p => { p.update(); p.draw(); });
        fireflies.forEach(f => { f.update(); f.draw(); });

        animationFrameId = requestAnimationFrame(animate);
      } catch (e) {
        // Fail silently — story must continue
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  const env = SCENE_ENV[scene] || SCENE_ENV['scene1_mystery'];
  const warmth = env.warmth;

  const bgStyle = isMobile
    ? {
        background: `radial-gradient(circle at 50% 45%,
          rgba(${Math.round(59 + warmth * 80)}, ${Math.round(9 + warmth * 10)}, ${Math.round(24 + warmth * 10)}, ${0.22 + warmth * 0.12}) 0%,
          rgba(4, 1, 7, 1) 85%)`
      }
    : {
        background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px,
          rgba(${Math.round(59 + warmth * 80)}, ${Math.round(9 + warmth * 10)}, ${Math.round(24 + warmth * 10)}, ${0.28 + warmth * 0.15}) 0%,
          rgba(4, 1, 7, 1) 75%)`
      };

  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
      style={bgStyle}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />

      {/* Ambient blur spots — warmth-aware */}
      <div
        className="absolute top-1/4 left-1/4 w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full filter blur-[80px] md:blur-[120px] animate-glow-pulse pointer-events-none transition-all duration-[3000ms]"
        style={{ backgroundColor: `rgba(${Math.round(59 + warmth * 60)}, 28, ${Math.round(130 - warmth * 50)}, ${0.05 + warmth * 0.06})` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full filter blur-[90px] md:blur-[140px] animate-glow-pulse pointer-events-none transition-all duration-[3000ms]"
        style={{ backgroundColor: `rgba(${Math.round(120 + warmth * 94)}, ${Math.round(18 + warmth * 20)}, ${Math.round(60 + warmth * 20)}, ${0.05 + warmth * 0.06})`, animationDelay: '-1.5s' }}
      />
    </div>
  );
}
