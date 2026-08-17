import React, { useEffect, useRef, useState } from 'react';
import { useScene, SCENES } from '../context/SceneProvider';

export default function CelebrationCanvas() {
  const canvasRef = useRef(null);
  const { isLowEnd, isMobile, currentScene } = useScene();
  const [showTypography, setShowTypography] = useState(false);
  const [showSubText, setShowSubText] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const startTime = Date.now();
    let shakeDuration = 0; // ms to shake canvas
    let impactGlow = 0.0;  // radial impact flash opacity

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const CX = canvas.width / 2;
    const CY = canvas.height * 0.35;

    // ─── Celebration Classes ──────────────────────────────

    class Petal {
      constructor(yOffset = -20) {
        this.x = Math.random() * canvas.width;
        this.y = yOffset;
        this.size = Math.random() * 5 + 3;
        this.vy = Math.random() * 1.0 + 0.6;
        this.vx = Math.random() * 0.4 - 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.color = Math.random() > 0.5 ? '#f285a8' : '#ffd8e1';
      }
      update() {
        this.y += this.vy;
        this.x += this.vx + Math.sin(this.y * 0.015) * 0.35;
        this.angle += this.rotSpeed;
        if (this.y > canvas.height + 10) {
          this.y = -15;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Butterfly {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 4 + 4;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -(Math.random() * 1.2 + 0.6);
        this.flapPhase = Math.random() * Math.PI * 2;
        this.flapSpeed = 0.15 + Math.random() * 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.flapPhase += this.flapSpeed;
        if (this.y < -20) {
          this.y = canvas.height + 20;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = '#f285a8';
        ctx.shadowColor = '#f285a8';
        ctx.shadowBlur = 4;

        const wingSpread = Math.abs(Math.sin(this.flapPhase)) * this.size;

        // Draw Left Wing
        ctx.beginPath();
        ctx.ellipse(-this.size / 2, 0, wingSpread / 2, this.size, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw Right Wing
        ctx.beginPath();
        ctx.ellipse(this.size / 2, 0, wingSpread / 2, this.size, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    class FireworkRocket {
      constructor(fromSide) {
        this.fromSide = fromSide;
        this.x = fromSide === 'left' ? 0 : canvas.width;
        this.y = canvas.height;

        // Target location in upper 40% bounds
        const tx = canvas.width * 0.15 + Math.random() * canvas.width * 0.7;
        const ty = canvas.height * 0.1 + Math.random() * canvas.height * 0.3;

        const steps = 60 + Math.random() * 20;
        this.vx = (tx - this.x) / steps;
        this.vy = (ty - this.y) / steps;
        this.tx = tx;
        this.ty = ty;

        this.trail = [];
        this.exploded = false;
        this.particles = [];
        this.color = `hsl(${14 + Math.random() * 32}, 100%, 65%)`; // Magical warm gold-reds
      }
      update() {
        if (!this.exploded) {
          this.trail.push({ x: this.x, y: this.y });
          if (this.trail.length > 8) this.trail.shift();

          this.x += this.vx;
          this.y += this.vy;

          if (Math.hypot(this.x - this.tx, this.y - this.ty) < 10 || this.vy > 0.5) {
            this.exploded = true;
            this.explode();
          }
        } else {
          this.particles.forEach(p => p.update());
          this.particles = this.particles.filter(p => p.alpha > 0);
        }
      }
      explode() {
        const count = isLowEnd ? 18 : 36;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
          const speed = Math.random() * 2.5 + 1.5;
          this.particles.push(new Sparkle(this.x, this.y, angle, speed, this.color));
        }
      }
      draw() {
        if (!this.exploded) {
          if (this.trail.length > 1) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            this.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
            ctx.stroke();
          }
        } else {
          this.particles.forEach(p => p.draw());
        }
      }
    }

    class Sparkle {
      constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.alpha = 1.0;
        this.decay = 0.015 + Math.random() * 0.012;
        this.size = Math.random() * 1.5 + 1.0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.045; // gravity influence
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ─── Set up variables ─────────────────────────────────

    const petals = Array.from({ length: isLowEnd ? 12 : 28 }, () => new Petal(Math.random() * canvas.height));
    const butterflies = [];
    const rockets = [];
    let projectile = null; // initialized at 1.5s
    let impactTriggered = false;

    // Timeline Loop Runner
    const tick = () => {
      const elapsed = Date.now() - startTime; // milliseconds

      ctx.save();
      // Apply Camera Shake on impact
      if (shakeDuration > 0) {
        const shakeX = (Math.random() - 0.5) * 6;
        const shakeY = (Math.random() - 0.5) * 6;
        ctx.translate(shakeX, shakeY);
        shakeDuration -= 16.6; // assuming 60fps
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Stage 0: 0.0s to 1.0s (silence, do not draw heart yet) ---

      // --- Stage 1: 1.0s (show center glowing heart silhouette) ---
      if (elapsed >= 1000) {
        // Draw central glowing heart silhouette
        const pulse = 1.0 + Math.sin(elapsed * 0.007) * 0.05;
        const s = (isMobile ? 18 : 28) * pulse;

        ctx.save();
        ctx.translate(CX, CY);
        ctx.fillStyle = 'rgba(214, 69, 119, 0.9)';
        ctx.shadowColor = '#d64577';
        ctx.shadowBlur = 35;

        ctx.beginPath();
        ctx.moveTo(0, s / 4);
        ctx.bezierCurveTo(-s / 1.5, -s / 1.5, -s, s / 3, 0, s);
        ctx.bezierCurveTo(s, s / 3, s / 1.5, -s / 1.5, 0, s / 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // --- Stage 2: 1.5s to 2.2s (Arrow trajectory sweeps from top-right) ---
      if (elapsed >= 1500 && elapsed < 2200) {
        const progress = (elapsed - 1500) / 700; // 0.0 to 1.0

        // Projectile trajectory coordinates
        const startX = canvas.width + 40;
        const startY = -40;
        const currentX = startX + (CX - startX) * progress;
        const currentY = startY + (CY - startY) * progress;

        // Draw arrow shaft/trail
        ctx.strokeStyle = 'rgba(255, 234, 117, 0.8)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw arrowhead
        ctx.fillStyle = '#ffea75';
        ctx.shadowColor = '#ffe74c';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // --- Stage 3: 2.2s (Impact events trigger) ---
      if (elapsed >= 2200 && !impactTriggered) {
        impactTriggered = true;
        shakeDuration = 220; // 220ms shake
        impactGlow = 1.0;

        // Trigger massive center heartburst
        if (window.triggerHeartBurst) {
          window.triggerHeartBurst(CX, CY, isLowEnd ? 90 : 180, {
            speed: 2.8,
            upwardBoost: 3.5
          });
        }

        // Populate butterflies
        const bCount = isLowEnd ? 4 : 8;
        for (let i = 0; i < bCount; i++) {
          butterflies.push(new Butterfly());
        }

        // Show Text typography overlays
        setTimeout(() => setShowTypography(true), 800);
        setTimeout(() => setShowSubText(true), 2400);

        // Staggered launch bottom corner fireworks over 8-12 seconds
        const fireworksTimeline = [200, 900, 1600, 2400, 3300, 4400, 5600, 7000, 8500];
        fireworksTimeline.forEach((delay) => {
          setTimeout(() => {
            const side = Math.random() > 0.5 ? 'left' : 'right';
            rockets.push(new FireworkRocket(side));
          }, delay);
        });
      }

      // Render impact flash pulse overlay
      if (impactGlow > 0) {
        const rad = (1.0 - impactGlow) * (isMobile ? 180 : 360);
        const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, rad);
        grad.addColorStop(0, `rgba(255, 77, 109, ${impactGlow * 0.65})`);
        grad.addColorStop(0.5, `rgba(180, 50, 140, ${impactGlow * 0.25})`);
        grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        impactGlow = Math.max(0, impactGlow - 0.025);
      }

      // Render Active elements after impact
      if (impactTriggered) {
        // Render falling petals
        petals.forEach(p => {
          p.update();
          p.draw();
        });

        // Render butterflies
        butterflies.forEach(b => {
          b.update();
          b.draw();
        });

        // Render rockets
        rockets.forEach(r => {
          r.update();
          r.draw();
        });
      }

      ctx.restore();
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [isLowEnd, isMobile]);

  return (
    <div className="absolute inset-0 w-full h-full z-15 pointer-events-none select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Typography Overlay centered belowCY */}
      <div className="absolute inset-x-0 bottom-1/4 flex flex-col items-center text-center space-y-4 px-6 z-25">
        <AnimatePresence>
          {showTypography && (
            <motion.h2
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="text-3xl md:text-5xl font-playfair font-black text-rose-100 tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            >
              SHE SAID YES ❤️
            </motion.h2>
          )}

          {showSubText && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="text-base md:text-xl text-rose-200 leading-loose italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
              style={{
                fontFamily: "'Mukta Malar', 'Latha', 'Tamil', sans-serif"
              }}
            >
              "இந்த நிமிடம்...
              நம்முடையது. 🌸"
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
