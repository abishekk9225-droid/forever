import React, { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneProvider';

export default function HeartBurst() {
  const canvasRef = useRef(null);
  const { isLowEnd } = useScene();
  const activeParticlesRef = useRef([]);
  const particlePoolRef = useRef([]);

  // Bezier heart path drawing helper
  const drawHeart = (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x, y + height / 4);
    ctx.bezierCurveTo(x - width / 1.5, y - height / 1.5, x - width, y + height / 3, x, y + height);
    ctx.bezierCurveTo(x + width, y + height / 3, x + width / 1.5, y - height / 1.5, x, y + height / 4);
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Populate initial particle pool to avoid allocations at runtime
    const poolSize = 350;
    for (let i = 0; i < poolSize; i++) {
      particlePoolRef.current.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        alpha: 1,
        life: 0,
        maxLife: 0,
        color: '',
        rotation: 0,
        rotSpeed: 0,
        active: false
      });
    }

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = activeParticlesRef.current;

      let hasActive = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.active) continue;

        hasActive = true;

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity influence
        p.rotation += p.rotSpeed;

        p.life -= 1;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          p.active = false;
          particlePoolRef.current.push(p);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 0.75;

        // Draw bezier heart shape
        drawHeart(ctx, 0, 0, p.size, p.size);
        ctx.fill();
        ctx.restore();
      }

      activeParticlesRef.current = particles.filter(p => p.active);

      if (hasActive) {
        animId = requestAnimationFrame(updateAndDraw);
      } else {
        animId = null;
      }
    };

    const triggerBurst = (x, y, count = 15, options = {}) => {
      // Throttle count on low-end mobile devices
      let finalCount = count;
      if (isLowEnd) {
        finalCount = Math.max(5, Math.floor(count * 0.5));
      }

      const colors = options.colors || ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffd8e1', '#d90429'];
      const pool = particlePoolRef.current;

      for (let i = 0; i < finalCount; i++) {
        let p = pool.pop();
        if (!p) {
          // Fallback if pool is empty
          p = { active: false };
        }

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + (options.speed || 1.5);

        p.x = x;
        p.y = y;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed - (options.upwardBoost || 2.0); // Tend to explode upwards
        p.size = Math.random() * 12 + 6;
        p.alpha = 1.0;
        p.maxLife = Math.random() * 40 + 35;
        p.life = p.maxLife;
        p.color = colors[Math.floor(Math.random() * colors.length)];
        p.rotation = Math.random() * Math.PI * 2;
        p.rotSpeed = (Math.random() - 0.5) * 0.08;
        p.active = true;

        activeParticlesRef.current.push(p);
      }

      if (!animId) {
        animId = requestAnimationFrame(updateAndDraw);
      }
    };

    window.triggerHeartBurst = triggerBurst;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.triggerHeartBurst = null;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isLowEnd]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-40"
    />
  );
}
