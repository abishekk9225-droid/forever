import React, { useEffect, useRef, useState } from 'react';
import { useScene, SCENES } from '../context/SceneProvider';

export default function CelebrationCanvas() {
  const canvasRef = useRef(null);
  const { isLowEnd, isMobile, currentScene } = useScene();
  const [showTypography, setShowTypography] = useState(false);
  const [showSubText, setShowSubText] = useState(false);
  
  const timeoutsRef = useRef([]);

  const addSafeTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const startTime = Date.now();
    let shakeDuration = 0;
    let impactGlow = 0.0;
    let arrowTrail = []; // Array of {x, y, alpha} for motion blur trail

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const CX = canvas.width / 2;
    const CY = canvas.height * 0.35;

    // ─── YES Celebration Classes ──────────────────────────

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

        ctx.beginPath();
        ctx.ellipse(-this.size / 2, 0, wingSpread / 2, this.size, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(this.size / 2, 0, wingSpread / 2, this.size, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    class FireworkRocket {
      constructor(fromSide) {
        this.fromSide = fromSide;
        this.x = fromSide === 'left' ? 20 : canvas.width - 20; // launch from bottom corners
        this.y = canvas.height;

        // Diagonal trajectories towards upper sky
        const tx = fromSide === 'left' 
          ? canvas.width * (0.2 + Math.random() * 0.25)
          : canvas.width * (0.55 + Math.random() * 0.25);
        const ty = canvas.height * 0.1 + Math.random() * canvas.height * 0.3;

        const steps = 60 + Math.random() * 20;
        this.vx = (tx - this.x) / steps;
        this.vy = (ty - this.y) / steps;
        this.tx = tx;
        this.ty = ty;

        this.trail = [];
        this.exploded = false;
        this.particles = [];
        this.color = `hsl(${14 + Math.random() * 32}, 100%, 65%)`;
      }
      update() {
        if (!this.exploded) {
          this.trail.push({ x: this.x, y: this.y });
          if (this.trail.length > 8) this.trail.shift();

          this.x += this.vx;
          this.y += this.vy;

          if (Math.hypot(this.x - this.tx, this.y - this.ty) < 12 || this.vy > 0.5) {
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
            ctx.lineWidth = 2.5;
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
        this.vy += 0.045;
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
    let impactTriggered = false;

    // Timeline Loop Runner
    const tick = () => {
      const elapsed = Date.now() - startTime;

      ctx.save();

      // Apply camera shake on impact (2.2s to 2.4s)
      if (currentScene === SCENES.YES && elapsed >= 2200 && elapsed < 2400) {
        const shakeAmount = 8 * (1.0 - (elapsed - 2200) / 200);
        const shakeX = (Math.random() - 0.5) * shakeAmount;
        const shakeY = (Math.random() - 0.5) * shakeAmount;
        ctx.translate(shakeX, shakeY);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentScene === SCENES.YES) {
        // ==========================================
        // YES Celebration Timeline
        // ==========================================

        // 0.7s onward: draw center glowing heart silhouette
        if (elapsed >= 700) {
          const pulse = 1.0 + Math.sin(elapsed * 0.007) * 0.05;
          const s = (isMobile ? 18 : 28) * pulse;

          ctx.save();
          ctx.translate(CX, CY);
          ctx.fillStyle = 'rgba(255, 77, 109, 0.9)';
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

        // 1.0s to 2.2s: Arrow travels visibly from off-screen top-right
        if (elapsed >= 1000 && elapsed < 2200) {
          const progress = (elapsed - 1000) / 1200; // 0.0 to 1.0

          const startX = canvas.width + 45;
          const startY = -45;
          const currentX = startX + (CX - startX) * progress;
          const currentY = startY + (CY - startY) * progress;

          // Save trail positions for motion blur fletching fanning
          arrowTrail.push({ x: currentX, y: currentY });
          if (arrowTrail.length > 8) arrowTrail.shift();

          // Draw fletching fanning motion trail
          ctx.save();
          arrowTrail.forEach((pt, idx) => {
            const alpha = (idx / arrowTrail.length) * 0.22;
            ctx.fillStyle = `rgba(255, 234, 117, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();

          // Calculate unit vectors for drawing fletched arrow shaft
          const dx = CX - startX;
          const dy = CY - startY;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;

          const arrowLen = 50;
          const tailX = currentX - ux * arrowLen;
          const tailY = currentY - uy * arrowLen;

          // Draw golden glowing arrow shaft
          ctx.save();
          ctx.strokeStyle = '#ffea75';
          ctx.shadowColor = '#ffe74c';
          ctx.shadowBlur = 10;
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();

          // Draw arrowhead
          ctx.fillStyle = '#ffea75';
          ctx.beginPath();
          ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 2.2s: Arrow Impact
        if (elapsed >= 2200 && !impactTriggered) {
          impactTriggered = true;
          impactGlow = 1.0;

          // 2.2s onward: Radial light flash (drawn via impactGlow) and HeartBurst
          if (window.triggerHeartBurst) {
            window.triggerHeartBurst(CX, CY, isLowEnd ? 100 : 220, {
              speed: 3.2,
              upwardBoost: 3.8
            });
          }

          // 2.5s onward: Butterflies and Fireflies explode
          addSafeTimeout(() => {
            const bCount = isLowEnd ? 4 : 8;
            for (let i = 0; i < bCount; i++) {
              butterflies.push(new Butterfly());
            }
          }, 300);

          // 3.0s+: Show typography overlays
          addSafeTimeout(() => setShowTypography(true), 800);
          addSafeTimeout(() => setShowSubText(true), 2400);

          // 2.5s onward: diagonal corner fireworks launch
          const fireworksTimeline = [300, 1000, 1800, 2700, 3800, 4800, 6000, 7400, 8800];
          fireworksTimeline.forEach((delay) => {
            addSafeTimeout(() => {
              const side = Math.random() > 0.5 ? 'left' : 'right';
              rockets.push(new FireworkRocket(side));
            }, delay);
          });
        }

        // Draw radial flash explosion (2.3s onward)
        if (impactGlow > 0) {
          // Draw full-screen white/pink flash first on impact
          if (impactGlow > 0.85) {
            ctx.fillStyle = `rgba(255, 255, 255, ${(impactGlow - 0.85) / 0.15})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          const rad = (1.0 - impactGlow) * (isMobile ? 180 : 360);
          const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, rad);
          grad.addColorStop(0, `rgba(255, 77, 109, ${impactGlow * 0.7})`);
          grad.addColorStop(0.5, `rgba(180, 50, 140, ${impactGlow * 0.3})`);
          grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          impactGlow = Math.max(0, impactGlow - 0.02);
        }

        if (impactTriggered) {
          petals.forEach(p => {
            p.update();
            p.draw();
          });

          butterflies.forEach(b => {
            b.update();
            b.draw();
          });

          rockets.forEach(r => {
            r.update();
            r.draw();
          });
        }
      } else if (currentScene === SCENES.LET_ME_THINK) {
        // ==========================================
        // NO Heartbreak Split Timeline
        // ==========================================
        const s = (isMobile ? 18 : 28);

        if (elapsed < 800) {
          // 0.0s to 0.8s: draw glowing center heart
          ctx.save();
          ctx.translate(CX, CY);
          ctx.fillStyle = 'rgba(255, 77, 109, 0.8)';
          ctx.shadowColor = '#d64577';
          ctx.shadowBlur = 25;
          ctx.beginPath();
          ctx.moveTo(0, s / 4);
          ctx.bezierCurveTo(-s / 1.5, -s / 1.5, -s, s / 3, 0, s);
          ctx.bezierCurveTo(s, s / 3, s / 1.5, -s / 1.5, 0, s / 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (elapsed >= 800 && elapsed < 1800) {
          // 0.8s to 1.8s: Draw central heart with drawing crack line
          ctx.save();
          ctx.translate(CX, CY);
          ctx.fillStyle = 'rgba(255, 77, 109, 0.8)';
          ctx.shadowColor = '#d64577';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(0, s / 4);
          ctx.bezierCurveTo(-s / 1.5, -s / 1.5, -s, s / 3, 0, s);
          ctx.bezierCurveTo(s, s / 3, s / 1.5, -s / 1.5, 0, s / 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Draw zig-zag crack line progressively
          const crackProgress = (elapsed - 800) / 1000;
          ctx.save();
          ctx.translate(CX, CY);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(0, s / 4);
          
          const nodes = [
            { x: -3, y: s * 0.25 },
            { x: 2, y: s * 0.5 },
            { x: -2, y: s * 0.7 },
            { x: 0, y: s }
          ];

          const showNodes = Math.floor(crackProgress * nodes.length);
          for (let i = 0; i < showNodes; i++) {
            ctx.lineTo(nodes[i].x, nodes[i].y);
          }
          ctx.stroke();
          ctx.restore();
        } else {
          // 1.8s onward: split halves fall down under gravity
          const dt = (elapsed - 1800) / 1000; // time offset in seconds
          const gravity = 950; // gravity acceleration px/s^2

          // Left Half offsets
          const lx = -dt * 55;
          const ly = 0.5 * gravity * dt * dt;
          const lRot = -dt * 0.75;

          // Right Half offsets
          const rx = dt * 55;
          const ry = 0.5 * gravity * dt * dt;
          const rRot = dt * 0.75;

          // Draw Left split piece
          ctx.save();
          ctx.translate(CX + lx, CY + ly);
          ctx.rotate(lRot);
          ctx.fillStyle = 'rgba(255, 77, 109, 0.65)';
          ctx.shadowColor = '#d64577';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(0, s / 4);
          ctx.bezierCurveTo(-s / 1.5, -s / 1.5, -s, s / 3, 0, s);
          ctx.lineTo(-2, s * 0.7);
          ctx.lineTo(2, s * 0.5);
          ctx.lineTo(-3, s * 0.25);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Draw Right split piece
          ctx.save();
          ctx.translate(CX + rx, CY + ry);
          ctx.rotate(rRot);
          ctx.fillStyle = 'rgba(255, 77, 109, 0.65)';
          ctx.shadowColor = '#d64577';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(0, s / 4);
          ctx.lineTo(-3, s * 0.25);
          ctx.lineTo(2, s * 0.5);
          ctx.lineTo(-2, s * 0.7);
          ctx.lineTo(0, s);
          ctx.bezierCurveTo(s, s / 3, s / 1.5, -s / 1.5, 0, s / 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [currentScene, isLowEnd, isMobile]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-15 pointer-events-none select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Typography Overlay */}
      {currentScene === SCENES.YES && (
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
      )}
    </div>
  );
}
