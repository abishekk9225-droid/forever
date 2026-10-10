import React, { useEffect, useRef } from 'react';
import CinematicRainbowBorder from './CinematicRainbowBorder';

/**
 * Reusable Cinematic Scene Atmosphere Component
 * Provides continuous dark ambient environment, floating dust, gentle petals,
 * soft vignette, and traveling rainbow border with optimal 60 FPS performance.
 */
export default function CinematicSceneAtmosphere({
  showBorder = false,
  showPetals = true,
  showDust = true,
  accentGlow = 'rose', // 'rose' | 'amber' | 'violet'
  children,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!showDust && !showPetals) return;
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

    // Dust particles (28 lightweight specks)
    const dustParticles = showDust
      ? Array.from({ length: 28 }).map(() => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.6 + 0.6,
          vx: (Math.random() - 0.48) * 0.35,
          vy: -(Math.random() * 0.3 + 0.1),
          opacity: Math.random() * 0.4 + 0.15,
          isGold: Math.random() > 0.6,
        }))
      : [];

    // Falling petals (14 lightweight organic petals)
    const petals = showPetals
      ? Array.from({ length: 14 }).map(() => ({
          x: Math.random() * width,
          y: Math.random() * height - height,
          size: Math.random() * 7 + 5,
          vx: (Math.random() - 0.45) * 0.6,
          vy: Math.random() * 0.7 + 0.4,
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 0.02,
          swayAmp: Math.random() * 1.5 + 0.6,
          swaySpeed: Math.random() * 0.015 + 0.008,
          opacity: Math.random() * 0.35 + 0.25,
          isRose: Math.random() > 0.4,
        }))
      : [];

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Render dust
      for (let i = 0; i < dustParticles.length; i++) {
        const p = dustParticles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? `rgba(251, 191, 36, ${p.opacity})`
          : `rgba(244, 114, 182, ${p.opacity * 0.75})`;
        ctx.fill();
      }

      // Render petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(frameCount * p.swaySpeed) * p.swayAmp;
        p.angle += p.vAngle;

        if (p.y > height + 20) {
          p.y = -15;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -15;
        if (p.x < -20) p.x = width + 15;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(Math.cos(p.angle * 0.6), 1);

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.5, p.size * 0.75, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.5, -p.size * 0.75, -p.size * 0.5, 0, -p.size);

        ctx.fillStyle = p.isRose
          ? `rgba(244, 114, 182, ${p.opacity})`
          : `rgba(255, 241, 242, ${p.opacity})`;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [showDust, showPetals]);

  return (
    <>
      {/* Universal Screen Rainbow Border */}
      {showBorder && <CinematicRainbowBorder mode="screen" />}

      {/* Atmospheric Overhead Light Bloom */}
      <div
        className="fixed -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[650px] pointer-events-none rounded-full blur-[130px] opacity-30 z-0"
        style={{
          background:
            accentGlow === 'amber'
              ? 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.4) 0%, rgba(244, 114, 182, 0.15) 50%, transparent 75%)'
              : accentGlow === 'violet'
              ? 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.35) 0%, rgba(244, 63, 94, 0.18) 50%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(244, 63, 94, 0.35) 0%, rgba(217, 70, 239, 0.18) 50%, transparent 75%)',
        }}
      />

      {/* Cinematic Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(circle at center, transparent 45%, rgba(3, 2, 6, 0.7) 85%, rgba(3, 2, 6, 0.95) 100%)',
        }}
      />

      {/* Canvas for Petals & Dust */}
      {(showDust || showPetals) && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[2]"
          style={{ opacity: 0.85 }}
        />
      )}

      {children}
    </>
  );
}
