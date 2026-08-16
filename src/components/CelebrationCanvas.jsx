import React, { useEffect, useRef } from 'react';

export default function CelebrationCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
      if (!ctx) return;
    } catch (e) {
      return; // Canvas not supported — CSS fallback handles it
    }

    let animationId;
    const startTime = Date.now();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isMobile = window.innerWidth < 768;
    const CX = canvas.width / 2;
    const CY = canvas.height * 0.35;

    // ─── Classes ────────────────────────────────────────────

    class Projectile {
      constructor() {
        this.x = canvas.width * 0.05;
        this.y = canvas.height * 0.9;
        this.tx = CX;
        this.ty = CY;
        const steps = 55;
        this.vx = (this.tx - this.x) / steps;
        this.vy = (this.ty - this.y) / steps;
        this.done = false;
        this.trail = [];
        this.size = 10;
      }
      update() {
        if (this.done) return;
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 12) this.trail.shift();
        this.x += this.vx;
        this.y += this.vy;
        if (Math.hypot(this.x - this.tx, this.y - this.ty) < 14) this.done = true;
      }
      draw() {
        if (this.done) return;
        // Trail
        this.trail.forEach((pt, i) => {
          const a = (i / this.trail.length) * 0.4;
          ctx.fillStyle = `rgba(255, 80, 120, ${a})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        // Heart projectile
        const s = this.size;
        ctx.fillStyle = '#ff4d7e';
        ctx.shadowColor = '#ff4d7e';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(this.x - s/2, this.y - s/2, this.x - s, this.y + s/3, this.x, this.y + s);
        ctx.bezierCurveTo(this.x + s, this.y + s/3, this.x + s/2, this.y - s/2, this.x, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Rocket {
      constructor(side) {
        this.side = side;
        this.x = side === 'left' ? 0 : canvas.width;
        this.y = canvas.height;
        const targetX = CX + (Math.random() * 160 - 80);
        const targetY = canvas.height * 0.2 + Math.random() * 120;
        const steps = 55 + Math.random() * 20;
        this.vx = (targetX - this.x) / steps;
        this.vy = (targetY - this.y) / steps;
        this.tx = targetX; this.ty = targetY;
        this.exploded = false;
        this.particles = [];
        this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
        this.trail = [];
      }
      update() {
        if (!this.exploded) {
          this.trail.push({ x: this.x, y: this.y });
          if (this.trail.length > 8) this.trail.shift();
          this.x += this.vx; this.y += this.vy;
          if (Math.hypot(this.x - this.tx, this.y - this.ty) < 10 || this.vy > 0) {
            this.exploded = true; this.explode();
          }
        } else {
          this.particles.forEach(p => p.update());
          this.particles = this.particles.filter(p => p.alpha > 0);
        }
      }
      explode() {
        for (let i = 0; i < 42; i++) {
          const angle = (Math.PI * 2 * i) / 42 + Math.random() * 0.4;
          this.particles.push(new FWParticle(this.x, this.y, angle, Math.random() * 3.5 + 2, this.color));
        }
      }
      draw() {
        if (!this.exploded) {
          if (this.trail.length > 1) {
            ctx.strokeStyle = this.color; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(this.trail[0].x, this.trail[0].y);
            this.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
            ctx.stroke();
          }
        } else {
          this.particles.forEach(p => p.draw());
        }
      }
    }

    class FWParticle {
      constructor(x, y, angle, speed, color) {
        this.x = x; this.y = y;
        this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
        this.color = color; this.alpha = 1;
        this.size = Math.random() * 2 + 1; this.decay = Math.random() * 0.015 + 0.01;
      }
      update() { this.x += this.vx; this.y += this.vy; this.vy += 0.04; this.alpha -= this.decay; }
      draw() {
        ctx.save(); ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 4;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    class Petal {
      constructor(initialY = -20) {
        this.x = Math.random() * canvas.width;
        this.y = initialY;
        this.size = Math.random() * 6 + 3;
        this.speedY = Math.random() * 1.2 + 0.7;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.04 - 0.02;
        const r = Math.random();
        this.color = r < 0.5 ? '#ff4d6d' : r < 0.8 ? '#fefae0' : '#ffb3c6';
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.02) * 0.4;
        this.angle += this.spin;
        if (this.y > canvas.height + 20) { this.y = -20; this.x = Math.random() * canvas.width; }
      }
      draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    class RisingHeart {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 10 + 5;
        this.speedY = -(Math.random() * 0.7 + 0.4);
        this.wobbleVal = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.alpha = Math.random() * 0.35 + 0.2;
      }
      update() {
        this.y += this.speedY;
        this.wobbleVal += this.wobbleSpeed;
        this.x += Math.sin(this.wobbleVal) * 0.4;
        if (this.y < -20) { this.y = canvas.height + 20; this.x = Math.random() * canvas.width; }
      }
      draw() {
        ctx.save(); ctx.translate(this.x, this.y);
        ctx.fillStyle = `rgba(214,69,119,${this.alpha})`;
        ctx.shadowColor = 'rgba(214,69,119,0.25)'; ctx.shadowBlur = 6;
        const s = this.size;
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.bezierCurveTo(-s/2,-s/2,-s,-s/3,0,s);
        ctx.bezierCurveTo(s,-s/3,s/2,-s/2,0,0);
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }

    class FlyingBird {
      constructor(side) {
        this.x = side === 'left' ? -40 : canvas.width + 40;
        this.y = canvas.height * 0.4 + (Math.random() * 120 - 60);
        this.speedX = side === 'left' ? Math.random() * 1.8 + 1.5 : -(Math.random() * 1.8 + 1.5);
        this.wobbleVal = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.04 + Math.random() * 0.03;
        this.wingState = 0; this.size = Math.random() * 5 + 7;
        this.alpha = 1;
      }
      update() {
        this.x += this.speedX;
        this.wobbleVal += this.wobbleSpeed;
        this.y += Math.sin(this.wobbleVal) * 1;
        this.wingState += 0.18;
        const d = Math.abs(this.x - canvas.width / 2);
        if (d < 100) this.alpha -= 0.018;
      }
      draw() {
        ctx.save(); ctx.translate(this.x, this.y);
        ctx.fillStyle = '#3b5998'; ctx.globalAlpha = Math.max(0, this.alpha);
        const s = this.size, wingY = Math.sin(this.wingState) * s;
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.quadraticCurveTo(-s/2,-s/2+wingY,-s,0);
        ctx.quadraticCurveTo(-s/2,s/4,0,s/3);
        ctx.quadraticCurveTo(s/2,s/4,s,0);
        ctx.quadraticCurveTo(s/2,-s/2+wingY,0,0);
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }

    // ─── State ───────────────────────────────────────────────

    let projectile = new Projectile();
    let rockets = [];
    let petals = Array.from({ length: isMobile ? 20 : 45 }, (_, i) =>
      new Petal(Math.random() * canvas.height)
    );
    let risingHearts = [];
    let flyingBirds = [];
    let impactTriggered = false;
    let pulseAngle = 0;
    let impactPulse = 0; // 0→1 radial burst on impact

    const loop = () => {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const elapsed = (Date.now() - startTime) / 1000;

        // Impact triggered when projectile reaches center
        if (!impactTriggered && projectile.done) {
          impactTriggered = true;
          impactPulse = 1.0;
          // Launch fireworks immediately on impact
          for (let i = 0; i < 3; i++) {
            rockets.push(new Rocket('left'));
            rockets.push(new Rocket('right'));
          }
        }

        // Center glow heart (pre-impact)
        if (!impactTriggered) {
          pulseAngle += 0.04;
          const s = 18 + Math.sin(pulseAngle) * 4;
          ctx.fillStyle = 'rgba(214,69,119,0.85)';
          ctx.shadowColor = '#d64577'; ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.moveTo(CX, CY);
          ctx.bezierCurveTo(CX-s/2,CY-s/2,CX-s,CY+s/3,CX,CY+s);
          ctx.bezierCurveTo(CX+s,CY+s/3,CX+s/2,CY-s/2,CX,CY);
          ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
        }

        // Projectile travel
        if (!impactTriggered) { projectile.update(); projectile.draw(); }

        // Impact radial burst
        if (impactPulse > 0) {
          const r = (1 - impactPulse) * (isMobile ? 140 : 280);
          const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, r);
          grad.addColorStop(0, `rgba(214,69,119,${impactPulse * 0.5})`);
          grad.addColorStop(0.5, `rgba(150,40,120,${impactPulse * 0.15})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          impactPulse = Math.max(0, impactPulse - 0.018);
        }

        // Continuous warm glow
        pulseAngle += 0.015;
        if (impactTriggered) {
          const glowScale = 1 + Math.sin(pulseAngle) * 0.06;
          const r = (isMobile ? 110 : 220) * glowScale;
          const grad = ctx.createRadialGradient(CX, CY * 0.95, 10, CX, CY * 0.95, r);
          grad.addColorStop(0, 'rgba(214,69,119,0.12)');
          grad.addColorStop(0.5, 'rgba(109,40,217,0.04)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Fireworks (12 seconds after impact)
        if (impactTriggered && elapsed < 13) {
          if (Math.floor(elapsed * 10) % 14 === 0 && Math.random() < 0.28) {
            rockets.push(new Rocket('left'));
            rockets.push(new Rocket('right'));
          }
        }
        rockets.forEach(r => r.update()); rockets.forEach(r => r.draw());
        rockets = rockets.filter(r => !r.exploded || r.particles.length > 0);

        // Petals
        petals.forEach(p => { p.update(); p.draw(); });

        // Rising hearts (after impact)
        if (impactTriggered && risingHearts.length < (isMobile ? 10 : 22)) {
          risingHearts.push(new RisingHeart());
        }
        risingHearts.forEach(h => { h.update(); h.draw(); });

        // Birds
        if (impactTriggered && elapsed < 10 && flyingBirds.length < 4 && Math.random() < 0.008) {
          flyingBirds.push(new FlyingBird('left'));
          flyingBirds.push(new FlyingBird('right'));
        }
        flyingBirds.forEach(b => { b.update(); b.draw(); });
        flyingBirds = flyingBirds.filter(b => b.alpha > 0);

        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(loop);
      } catch (e) {
        // Canvas error — fail silently, story continues via React
        animationId = requestAnimationFrame(loop);
      }
    };
    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none block"
    />
  );
}
