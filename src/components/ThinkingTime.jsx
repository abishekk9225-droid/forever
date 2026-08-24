import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Send, AlertCircle, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';

const ADMIN_EMAIL = 'abishek.k.officl@gmail.com';
const SERVICE_ID = 'service_ddahis9';
const TEMPLATE_ID = 'template_x2vxz2f';
const PUBLIC_KEY = 'dGY_nInN-FHeWTw5q';

export default function ThinkingTime({ onComplete, onRestart }) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 Minutes (180s)
  const [hasSpecialPerson, setHasSpecialPerson] = useState(null);
  const [specialPersonName, setSpecialPersonName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTimesUp, setIsTimesUp] = useState(false);
  
  const canvasRef = useRef(null);
  const totalDuration = 180; // 3 minutes

  // Main countdown timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isTimesUp) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isTimesUp) {
      setIsTimesUp(true);
    }
  }, [timeLeft, isTimesUp]);

  // Ethereal floating canvas particles effect inside the timer card
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let particles = [];

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();

    // Create particles
    const particleCount = 25;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.5 ? '#e0a899' : '#0ea5e9',
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.02 + 0.01
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.phaseSpeed;

        // Soft boundaries wrapping
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Render soft neon ember node
        ctx.save();
        ctx.globalAlpha = p.alpha * (0.3 + Math.abs(Math.sin(p.phase)) * 0.7);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const triggerExplosiveCelebration = () => {
    // Multi-colored double confetti explosion from side corners
    const defaults = { spread: 360, ticks: 100, gravity: 0.8, decay: 0.94, startVelocity: 30, colors: ['#E0A899', '#B76E79', '#0ea5e9', '#ec4899', '#ffd700'] };
    
    confetti({
      ...defaults,
      particleCount: 80,
      scalar: 1.2,
      origin: { x: 0.2, y: 0.5 }
    });
    
    confetti({
      ...defaults,
      particleCount: 80,
      scalar: 1.2,
      origin: { x: 0.8, y: 0.5 }
    });

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#E0A899', '#B76E79', '#0ea5e9', '#ffffff']
    });
  };

  const handleSkip = () => {
    triggerExplosiveCelebration();
    // Short delay to let the explosion be seen before transition
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  const handleNo = () => {
    onComplete();
  };

  const handleYes = () => {
    setHasSpecialPerson('yes');
  };

  const handleSubmitYesAnswer = async () => {
    if (!specialPersonName.trim()) return;
    setIsSending(true);

    const message = `
      🚨 Special Person Alert!
      ---------------------------------
      Saranya was asked: "Un life la romba special person erukangala ennaiya thavira now?"
      Her Answer: YES!
      Details: "${specialPersonName}"
      ---------------------------------
      Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `;

    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            name: 'Saranya ❤️',
            title: 'Special Person Response! 👀',
            message: message,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            email: ADMIN_EMAIL,
          },
        }),
      });
    } catch (e) {}

    setIsSending(false);
    onComplete();
  };

  // Convert seconds left to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Progress ratio for rings
  const progressRatio = timeLeft / totalDuration;
  const strokeDash = 2 * Math.PI * 80; // r=80 circle perimeter
  const dashOffset = strokeDash * (1 - progressRatio);

  return (
    <div className="flex flex-col items-center justify-center min-h-[580px] p-6 text-center z-30 w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isTimesUp ? (
          <motion.div
            key="challenge-cyber"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.8 }}
            className="w-full p-8 rounded-3xl relative overflow-hidden space-y-6 backdrop-blur-2xl"
            style={{
              background: 'radial-gradient(circle at center, rgba(16, 8, 25, 0.93) 0%, rgba(6, 3, 10, 0.97) 100%)',
              border: '1px solid rgba(224, 168, 153, 0.4)',
              boxShadow: '0 0 35px rgba(224, 168, 153, 0.15), inset 0 0 20px rgba(183, 110, 121, 0.08), 0 20px 50px rgba(0, 0, 0, 0.65)'
            }}
          >
            {/* Embedded canvas for ambient cyber particle dust */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none opacity-20" />

            <div className="relative z-10 space-y-6 flex flex-col items-center">
              
              {/* Pulsating Holographic Sci-Fi Clock Ring & digital text */}
              <div className="relative w-48 h-48 flex items-center justify-center select-none">
                
                {/* Glowing Outer Shadow Ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#e0a899]/15 animate-[spin_60s_linear_infinite]" />
                
                {/* SVG Radial Rings */}
                <svg className="absolute w-44 h-44 transform -rotate-90">
                  {/* Background Track Circle */}
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-[#b76e79]/10"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  {/* Holographic Glowing Time Ring */}
                  <motion.circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-[#e0a899]"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 76}
                    animate={{ strokeDashoffset: 2 * Math.PI * 76 * (1 - progressRatio) }}
                    transition={{ ease: 'linear', duration: 1 }}
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(224, 168, 153, 0.75))'
                    }}
                  />
                  {/* Inner Rapid Tech Ring (Cyberpunk cyan dot) */}
                  <circle
                    cx="88"
                    cy="88"
                    r="68"
                    className="stroke-sky-500/25"
                    strokeDasharray="4 8"
                    strokeWidth="2"
                    fill="transparent"
                  />
                </svg>

                {/* Digital Typography Display */}
                <div className="flex flex-col items-center justify-center z-10">
                  <motion.span 
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                    className="text-4xl font-mono font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  >
                    {formatTime(timeLeft)}
                  </motion.span>
                  <span className="text-[10px] font-mono text-[#e0a899] tracking-[0.25em] uppercase mt-1 animate-pulse">
                    Hologram Active
                  </span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-serif text-rose-100 leading-relaxed max-w-[300px]">
                "Un life la romba special person erukangala, ennaiya thavira now?" 🤔💭
              </h3>

              {hasSpecialPerson === null ? (
                <div className="w-full space-y-4 pt-2">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleYes}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#b76e79] to-[#e0a899] text-zinc-950 font-bold hover:scale-105 active:scale-95 transition shadow-[0_0_20px_rgba(224,168,153,0.35)] cursor-pointer"
                    >
                      Yes 🙈
                    </button>
                    <button
                      onClick={handleNo}
                      className="px-8 py-3 rounded-2xl bg-zinc-900/80 border border-zinc-700/50 text-zinc-300 font-medium hover:bg-zinc-800 transition cursor-pointer hover:scale-105 active:scale-95"
                    >
                      No 🤍
                    </button>
                  </div>

                  {/* Tranquil Skip Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleSkip}
                      className="px-5 py-2 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-300 hover:bg-sky-500/20 active:scale-95 text-xs font-mono tracking-wider flex items-center justify-center gap-2 mx-auto transition cursor-pointer"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>Skip Timer ⚡</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left w-full">
                  <p className="text-xs font-mono text-[#e0a899] text-center">Yaru adhu? Type here quickly before time runs out:</p>
                  <textarea
                    value={specialPersonName}
                    onChange={(e) => setSpecialPersonName(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-rose-400/25 text-white text-sm focus:outline-none focus:border-[#e0a899] focus:ring-1 focus:ring-[#e0a899] transition resize-none"
                    autoFocus
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleSubmitYesAnswer}
                      disabled={isSending || !specialPersonName.trim()}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#b76e79] via-[#e0a899] to-sky-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
                    >
                      {isSending ? <span>Sending to Abishek... 💌</span> : <><span>Submit & Continue ✨</span><Send className="w-4 h-4"/></>}
                    </button>
                    
                    <button
                      onClick={handleSkip}
                      className="py-2.5 text-xs font-mono text-zinc-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FastForward className="w-3 h-3" />
                      <span>Skip anyway ➔</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="penalty-cyber"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-8 rounded-3xl bg-zinc-950/90 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.3)] space-y-6 text-center backdrop-blur-xl"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 animate-bounce">
              <AlertCircle className="w-8 h-8"/>
            </div>
            <h3 className="text-2xl font-serif text-white">Time's Up! ⌛💔</h3>
            <p className="text-red-200 text-sm font-serif italic">
              "Romba neram yosichathu kku penalty... First la irunthu start pannu!"
            </p>
            <button
              onClick={onRestart}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium text-sm transition cursor-pointer"
            >
              Start Again from Beginning 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

