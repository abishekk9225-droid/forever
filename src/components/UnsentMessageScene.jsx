import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Send, CheckCheck, Clock, Check } from 'lucide-react';
import { useHeartbeat } from '../context/HeartbeatContext';
import { sendEmail } from '../utils/emailService';
import CinematicRainbowBorder from './CinematicRainbowBorder';

// ============================================================================
// 1. LIGHTWEIGHT 60FPS RAIN & AMBIENT GLOW CANVAS
// ============================================================================
function RainAndBokehCanvas({ intensity = 1.0, rainActive = true, particleActive = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
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

    // Raindrops
    const numDrops = 45;
    const drops = Array.from({ length: numDrops }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 20 + 15,
      speed: Math.random() * 8 + 12,
      opacity: Math.random() * 0.25 + 0.1,
    }));

    // Floating warm bokeh particles
    const numBokeh = 28;
    const bokehs = Array.from({ length: numBokeh }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 4 + 1.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      opacity: Math.random() * 0.45 + 0.2,
      color: Math.random() > 0.4 ? 'rgba(251, 191, 36,' : 'rgba(244, 63, 94,',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Rain
      if (rainActive) {
        ctx.strokeStyle = `rgba(186, 230, 253, ${0.35 * intensity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        drops.forEach((d) => {
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2, d.y + d.len * intensity);
          d.y += d.speed * (0.6 + intensity * 0.5);
          d.x -= 1;
          if (d.y > height) {
            d.y = -d.len;
            d.x = Math.random() * (width + 50);
          }
        });
        ctx.stroke();
      }

      // Render Warm Floating Bokeh Particles
      if (particleActive) {
        bokehs.forEach((b) => {
          b.x += b.vx;
          b.y += b.vy;
          if (b.y < -10) b.y = height + 10;
          if (b.x < -10) b.x = width + 10;
          if (b.x > width + 10) b.x = -10;

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = `${b.color}${b.opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = b.color === 'rgba(251, 191, 36,' ? '#f59e0b' : '#f43f5e';
          ctx.fill();
        });
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [intensity, rainActive, particleActive]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
}

// ============================================================================
// 2. GLOWING CONVERGING PARTICLES HEART CANVAS (PHASE 7 & CLIMAX)
// ============================================================================
function HeartParticlesCanvas({ active = false, heartText = 'ABISHEK ❤️ SARANYA' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
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

    const centerX = width / 2;
    const centerY = height / 2 - 20;

    // Mathematical parametric heart shape targets
    const particleCount = 140;
    const scale = Math.min(width, height) > 600 ? 11 : 8.5;

    const particles = Array.from({ length: particleCount }).map((_, i) => {
      const t = (i / particleCount) * Math.PI * 2;
      // Heart equation
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      const targetX = centerX + hx * scale;
      const targetY = centerY + hy * scale;

      // Start from scattered outer positions
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 350 + 200;

      return {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        targetX,
        targetY,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.8 + 1.8,
        color: i % 2 === 0 ? '#f43f5e' : '#fbbf24',
        alpha: Math.random() * 0.4 + 0.6,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const beat = Math.sin(frame * 0.05) * 0.05 + 1;

      particles.forEach((p) => {
        // Smooth lerp to target
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * 0.045;
        p.y += dy * 0.045;

        // Add subtle beating oscillation around target
        const pulse = Math.sin(frame * 0.06 + p.pulseOffset) * 2;

        ctx.beginPath();
        ctx.arc(p.x, p.y + pulse, p.size * beat, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [active, heartText]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />;
}

// ============================================================================
// 3. FLUTTERING BUTTERFLIES DECORATION
// ============================================================================
function FlutteringButterflies({ count = 6 }) {
  const butterflies = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: `${15 + ((i * 18) % 70)}%`,
        left: `${10 + ((i * 24) % 80)}%`,
        delay: i * 0.6,
        duration: 5 + (i % 3),
        size: 20 + (i % 3) * 6,
        emoji: i % 2 === 0 ? '🦋' : '✨',
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.85, 0.4, 0.9, 0],
            x: [0, 25, -20, 30, 0],
            y: [0, -30, -60, -90, -120],
            rotate: [0, 15, -12, 10, 0],
            scale: [0.7, 1.1, 0.9, 1.05, 0.7],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: 'easeInOut',
          }}
          className="absolute"
          style={{ top: b.top, left: b.left, fontSize: `${b.size}px` }}
        >
          {b.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: "THE LAST UNSENT MESSAGE ❤️"
// ============================================================================
export default function UnsentMessageScene({ onComplete }) {
  const { setTargetBPM } = useHeartbeat();

  // Phase controller (1 through 9, plus 'accepting' climax)
  const [phase, setPhase] = useState(1);
  const [subStep, setSubStep] = useState(0);

  // Phase 2 Chat Typing States
  const [typedMessage, setTypedMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [chatStep, setChatStep] = useState(0);

  // Phase 9 Button & Click Climax States
  const [showButton, setShowButton] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptStage, setAcceptStage] = useState(0);
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'

  const hasSentEmailRef = useRef(false);
  const mountedRef = useRef(true);

  // Sync initial heartbeat
  useEffect(() => {
    mountedRef.current = true;
    setTargetBPM(62, 0.22);
    return () => {
      mountedRef.current = false;
    };
  }, [setTargetBPM]);

  // ==========================================================================
  // TIMELINE MANAGER FOR ALL 9 PHASES
  // ==========================================================================
  useEffect(() => {
    let timer;

    // ------------------------------------------------------------------------
    // PHASE 1: Complete Black -> Warm Glow Point -> 2 Tamil Lines -> Fade Out
    // ------------------------------------------------------------------------
    if (phase === 1) {
      setTargetBPM(62, 0.22);
      timer = setTimeout(() => {
        setSubStep(1); // Show warm light point & line 1
        timer = setTimeout(() => {
          setSubStep(2); // Show line 2
          timer = setTimeout(() => {
            setSubStep(3); // Fade out
            timer = setTimeout(() => {
              setPhase(2);
              setSubStep(0);
            }, 1200);
          }, 3500);
        }, 3200);
      }, 1000);
    }

    // ------------------------------------------------------------------------
    // PHASE 2: The Unsent Message (Cinematic Chat Typing & Deleting)
    // ------------------------------------------------------------------------
    else if (phase === 2) {
      setTargetBPM(66, 0.24);
      // Chat message lines to type
      const fullMsg1 =
        'நான் உன்னிடம் ஒரு விஷயம் சொல்லணும்...\n\nநான் உன்னை பிடித்திருக்கிறேன் என்று சொல்வது சுலபம்...\n\nஆனா... என் மனசுல நீ எவ்வளவு முக்கியம் என்று சொல்ல வார்த்தைகள் போதாது.';
      const fullMsg2 =
        'ஒருவேளை... நான் உன் வாழ்க்கையில் ஒரு சிறிய நினைவாக மட்டும் இருந்தாலும்...\n\nஅந்த நினைவு கூட எனக்கு ரொம்ப precious. ❤️';

      if (chatStep === 0) {
        // Start typing message 1
        let charIdx = 0;
        const interval = setInterval(() => {
          if (charIdx <= fullMsg1.length) {
            setTypedMessage(fullMsg1.slice(0, charIdx));
            charIdx++;
          } else {
            clearInterval(interval);
            // Pause, then delete
            timer = setTimeout(() => {
              setIsDeleting(true);
              let delIdx = fullMsg1.length;
              const delInterval = setInterval(() => {
                if (delIdx >= 0) {
                  setTypedMessage(fullMsg1.slice(0, delIdx));
                  delIdx -= 3; // fast cinematic backspace
                } else {
                  clearInterval(delInterval);
                  setIsDeleting(false);
                  setChatStep(1);
                }
              }, 30);
            }, 2400);
          }
        }, 45);
        return () => clearInterval(interval);
      } else if (chatStep === 1) {
        // Screen quiet, then type second message
        timer = setTimeout(() => {
          let charIdx = 0;
          const interval = setInterval(() => {
            if (charIdx <= fullMsg2.length) {
              setTypedMessage(fullMsg2.slice(0, charIdx));
              charIdx++;
            } else {
              clearInterval(interval);
              // Pause before moving to Phase 3
              timer = setTimeout(() => {
                setPhase(3);
                setSubStep(0);
              }, 3800);
            }
          }, 45);
          return () => clearInterval(interval);
        }, 1200);
      }
    }

    // ------------------------------------------------------------------------
    // PHASE 3: Rain + Memory Reflections
    // ------------------------------------------------------------------------
    else if (phase === 3) {
      setTargetBPM(70, 0.26);
      timer = setTimeout(() => {
        setSubStep(1); // Line 1: "நான் உன்னை..."
        timer = setTimeout(() => {
          setSubStep(2); // Line 2: "நான் விரும்புவது ஒன்றுதான்..."
          setTargetBPM(74, 0.28); // heartbeat slightly increases
          timer = setTimeout(() => {
            setSubStep(3); // Line 3: "ஒருநாள்... நீ உன் மனசை..."
            timer = setTimeout(() => {
              setSubStep(4); // Line 4: "அதில் என்னையும்..."
              timer = setTimeout(() => {
                setSubStep(5); // Line 5: "அது எனக்கு போதும். ❤️"
                timer = setTimeout(() => {
                  setPhase(4);
                  setSubStep(0);
                }, 4000);
              }, 3000);
            }, 3000);
          }, 2800);
        }, 3000);
      }, 800);
    }

    // ------------------------------------------------------------------------
    // PHASE 4: The Most Emotional Part (Window push, single butterfly, golden lamp)
    // ------------------------------------------------------------------------
    else if (phase === 4) {
      setTargetBPM(72, 0.26);
      timer = setTimeout(() => {
        setSubStep(1); // "நான் perfect இல்ல..."
        timer = setTimeout(() => {
          setSubStep(2); // "என்னிடம் எல்லா பதிலும் இல்ல..."
          timer = setTimeout(() => {
            setSubStep(3); // "ஆனா..." (long pause)
            timer = setTimeout(() => {
              setSubStep(4); // "உன்னை சந்தித்த பிறகு..."
              timer = setTimeout(() => {
                setSubStep(5); // "அந்த உணர்வை நான் ஒருபோதும் பொய்யாக சொல்ல மாட்டேன்."
                timer = setTimeout(() => {
                  setPhase(5);
                  setSubStep(0);
                }, 4200);
              }, 3400);
            }, 3600);
          }, 2600);
        }, 2600);
      }, 800);
    }

    // ------------------------------------------------------------------------
    // PHASE 5: Her Choice (Soft Rose Light, Unpressured Sincerity)
    // ------------------------------------------------------------------------
    else if (phase === 5) {
      setTargetBPM(68, 0.24);
      timer = setTimeout(() => {
        setSubStep(1); // "நான் உன்னிடம் ஒரு பதிலை கேட்க வரல..."
        timer = setTimeout(() => {
          setSubStep(2); // "என் மனசுல இருந்த உண்மையை மட்டும் சொல்ல வரேன்."
          timer = setTimeout(() => {
            setSubStep(3); // "நான் எதிர்பார்ப்பது ஒரு வார்த்தை இல்ல... என் வாழ்க்கை முழுக்க உன் நினைவுகள் இருக்கணும் என்ற ஆசை மட்டும். ❤️"
            timer = setTimeout(() => {
              setPhase(6);
              setSubStep(0);
            }, 4500);
          }, 3200);
        }, 3200);
      }, 800);
    }

    // ------------------------------------------------------------------------
    // PHASE 6: Hopeful Romantic Turn (Golden light, petals, butterflies)
    // ------------------------------------------------------------------------
    else if (phase === 6) {
      setTargetBPM(74, 0.28);
      timer = setTimeout(() => {
        setSubStep(1); // "ஆனா... உன் மனசில் ஒருநாள்..."
        timer = setTimeout(() => {
          setSubStep(2); // "‘இவன் என்னை உண்மையாக நேசிக்கிறான்...’ என்று..."
          timer = setTimeout(() => {
            setSubStep(3); // "அந்த ஒரு உணர்வை நான் வாழ்க்கை முழுக்க மதிப்பேன். ❤️"
            timer = setTimeout(() => {
              setPhase(7);
              setSubStep(0);
            }, 4200);
          }, 3400);
        }, 3200);
      }, 800);
    }

    // ------------------------------------------------------------------------
    // PHASE 7: The Heart Moment (Glowing Particles Heart + ABISHEK ❤️ SARANYA)
    // ------------------------------------------------------------------------
    else if (phase === 7) {
      setTargetBPM(78, 0.32); // Heartbeat slightly stronger
      timer = setTimeout(() => {
        setSubStep(1); // Particles converge & names appear
        timer = setTimeout(() => {
          setPhase(8);
          setSubStep(0);
        }, 5500);
      }, 800);
    }

    // ------------------------------------------------------------------------
    // PHASE 8: Final Handwritten Letter
    // ------------------------------------------------------------------------
    else if (phase === 8) {
      setTargetBPM(74, 0.28);
      timer = setTimeout(() => {
        setSubStep(1); // "எனக்கு உன்னிடம் ஒரு பெரிய promise மட்டும்..."
        timer = setTimeout(() => {
          setSubStep(2); // "உன்னை நான் ஒருபோதும் கட்டாயப்படுத்த மாட்டேன்."
          timer = setTimeout(() => {
            setSubStep(3); // "உன் மனசை மாற்ற நான் முயற்சி செய்ய மாட்டேன்."
            timer = setTimeout(() => {
              setSubStep(4); // "ஆனா... என் மனசில் இருக்கும் இந்த உண்மையான அன்பை மட்டும்..."
              timer = setTimeout(() => {
                setSubStep(5); // "நான் மறைக்கவும் மாட்டேன். ❤️"
                timer = setTimeout(() => {
                  setPhase(9);
                  setSubStep(0);
                }, 3800);
              }, 3000);
            }, 3000);
          }, 2800);
        }, 2800);
      }, 800);
    }

    // ------------------------------------------------------------------------
    // PHASE 9: Emotional Climax & "சம்மதம் ❤️" Button
    // ------------------------------------------------------------------------
    else if (phase === 9) {
      setTargetBPM(80, 0.32);
      timer = setTimeout(() => {
        setSubStep(1); // "ஒருநாள்..."
        timer = setTimeout(() => {
          setSubStep(2); // "நீயே..."
          timer = setTimeout(() => {
            setSubStep(3); // "உன் மனசால..."
            timer = setTimeout(() => {
              setSubStep(4); // "என்னை தேர்வு செய்தால்..."
              timer = setTimeout(() => {
                setSubStep(5); // Final line: "அந்த ஒரு 'சம்மதம்'..."
                // Wait 3 seconds after final line, then show button
                timer = setTimeout(() => {
                  setShowButton(true);
                }, 3000);
              }, 2600);
            }, 2200);
          }, 1800);
        }, 1800);
      }, 600);
    }

    return () => clearTimeout(timer);
  }, [phase, chatStep, setTargetBPM]);

  // ==========================================================================
  // "சம்மதம் ❤️" BUTTON CLICK HANDLER & CINEMATIC REACTION SEQUENCE
  // ==========================================================================
  const handleSammathamClick = async () => {
    if (isAccepted) return;
    setIsAccepted(true);

    // 1. Send Email Notification (Single send protection)
    if (!hasSentEmailRef.current) {
      hasSentEmailRef.current = true;
      setEmailStatus('sending');
      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      sendEmail({
        title: '❤️ A Special Moment',
        message: [
          '🌹 She clicked "சம்மதம் ❤️" in the cinematic experience.',
          '',
          '• Scene: The Last Unsent Message ❤️',
          '• Action: Sammatham Clicked (Voluntary Heart Choice)',
          `• Date & Time: ${nowStr} (IST)`,
          '• Sincerity: Pure, Unforced Love & Acceptance',
        ].join('\n'),
      })
        .then((res) => {
          if (mountedRef.current) {
            setEmailStatus('sent');
          }
        })
        .catch((err) => {
          console.warn('Email notification notice:', err);
          if (mountedRef.current) {
            setEmailStatus('error');
          }
        });
    }

    // 2. Cinematic 6-Second Progressive Reaction
    // 0–1s: Screen slightly darkens
    setAcceptStage(1);
    setTargetBPM(86, 0.36);

    // 1–2s: Heartbeat intensifies
    setTimeout(() => {
      if (!mountedRef.current) return;
      setAcceptStage(2);
      setTargetBPM(94, 0.42);
    }, 1200);

    // 2–3s: Golden particles explode softly
    setTimeout(() => {
      if (!mountedRef.current) return;
      setAcceptStage(3);
    }, 2400);

    // 3–4s: Hundreds of butterflies appear & fly
    setTimeout(() => {
      if (!mountedRef.current) return;
      setAcceptStage(4);
    }, 3600);

    // 4–5s: Butterflies form giant glowing heart with "சம்மதம் ❤️"
    setTimeout(() => {
      if (!mountedRef.current) return;
      setAcceptStage(5);
    }, 4800);

    // 5–6s+: Emotional climax lines + Final golden light expansion -> onComplete
    setTimeout(() => {
      if (!mountedRef.current) return;
      setAcceptStage(6);

      // Golden expansion into FingerprintLock
      setTimeout(() => {
        if (!mountedRef.current) return;
        setAcceptStage(7); // Full golden fade
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1200);
      }, 7000);
    }, 6200);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 select-none overflow-hidden bg-[#030206] text-white font-sans">
      {/* 1. Universal Travelling Rainbow Border */}
      <CinematicRainbowBorder
        mode="screen"
        className={phase >= 6 ? 'opacity-100 transition-opacity duration-1000' : 'opacity-60'}
      />

      {/* 2. Dynamic Rain and Floating Bokeh Particles Layer */}
      <RainAndBokehCanvas
        intensity={phase === 3 ? 1.0 : phase === 4 ? 0.4 : 0.2}
        rainActive={phase === 3 || phase === 4}
        particleActive={phase >= 4}
      />

      {/* 3. Glowing Converging Particles Canvas (Phase 7 & Climax) */}
      <HeartParticlesCanvas active={phase === 7 || (isAccepted && acceptStage >= 5)} />

      {/* 4. Ambient Colored Glow Lights (Rose, Magenta, Violet, Warm Gold) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: phase >= 6 ? [1, 1.25, 1] : [1, 1.1, 1],
            opacity: phase === 1 ? 0.2 : phase === 5 ? 0.5 : 0.35,
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/5 w-80 h-80 rounded-full blur-[100px] bg-rose-600/25"
        />
        <motion.div
          animate={{
            scale: phase >= 6 ? [1.2, 1, 1.2] : [1, 1.15, 1],
            opacity: phase >= 6 ? 0.45 : 0.2,
          }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/5 w-96 h-96 rounded-full blur-[120px] bg-amber-500/25"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] bg-purple-900/20" />
      </div>

      {/* 5. Fluttering Butterflies (Phase 4 single, Phase 6+, Climax) */}
      {(phase === 4 || phase >= 6 || isAccepted) && (
        <FlutteringButterflies count={isAccepted ? 18 : phase >= 6 ? 8 : 1} />
      )}

      {/* ==================================================================== */}
      {/* SCENE CONTENT CONTAINER */}
      {/* ==================================================================== */}
      <div className="relative z-20 w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center px-4 py-6">
        <AnimatePresence mode="wait">
          {/* ---------------------------------------------------------------- */}
          {/* PHASE 1: COMPLETE BLACK -> WARM LIGHT -> FIRST LINES            */}
          {/* ---------------------------------------------------------------- */}
          {phase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0 }}
              animate={{ opacity: subStep === 3 ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="space-y-6 flex flex-col items-center justify-center min-h-[360px]"
            >
              {subStep >= 1 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_25px_#f59e0b,0_0_50px_#f43f5e]"
                />
              )}

              {subStep >= 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5 }}
                  className="text-lg sm:text-2xl font-serif text-slate-200 font-light leading-relaxed tracking-wide"
                >
                  சில வார்த்தைகள்...
                  <br />
                  <span className="text-amber-200/90 font-normal">சொல்லப்படாமல் போனால் கூட...</span>
                </motion.p>
              )}

              {subStep >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5 }}
                  className="text-xl sm:text-2xl md:text-3xl font-serif text-rose-300 font-medium leading-relaxed drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                >
                  அவை மனசுக்குள் மட்டும்
                  <br />
                  வாழ்ந்து கொண்டே இருக்கும். ❤️
                </motion.p>
              )}
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PHASE 2: FICTIONAL CINEMATIC CHAT UI (UNSENT MESSAGE)           */}
          {/* ---------------------------------------------------------------- */}
          {phase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2 }}
              className="w-full space-y-4"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-400 bg-rose-950/40 px-3.5 py-1 rounded-full border border-rose-500/20 backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  The Unsent Message ❤️
                </span>
              </div>

              {/* Fictional Cinematic Phone / Message Window */}
              <div className="w-full rounded-3xl bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-5 sm:p-7 shadow-[0_0_60px_rgba(244,63,94,0.15)] space-y-4 text-left">
                {/* Chat Top Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-serif text-white font-bold shadow-md">
                      S
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide">Saranya 🌸</h4>
                      <p className="text-[11px] text-rose-300/80 font-mono">
                        {isDeleting ? 'clearing text...' : 'typing deeply...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Midnight</span>
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="min-h-[140px] p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-zinc-900/60 border border-rose-500/20 shadow-inner">
                  <p className="text-sm sm:text-base md:text-lg font-serif text-rose-100 leading-relaxed whitespace-pre-line tracking-wide">
                    {typedMessage}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-2 h-4 ml-1 bg-amber-400 align-middle shadow-[0_0_8px_#fbbf24]"
                    />
                  </p>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
                  <span className="italic font-serif text-slate-400">
                    {chatStep === 0 ? 'Drafting from the soul...' : 'Preserved forever in memory ✨'}
                  </span>
                  <div className="flex items-center gap-1 text-rose-400/80">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Unsent with love</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PHASE 3: RAIN + MEMORY (WINDOW PANE & WARM LAMP)                */}
          {/* ---------------------------------------------------------------- */}
          {phase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full space-y-6 flex flex-col items-center"
            >
              {/* Rainy Window & Warm Lamp Silhouette Graphic */}
              <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-slate-900/80 to-zinc-950/90 shadow-2xl flex items-center justify-center">
                {/* Lamp Glow */}
                <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-amber-400/30 blur-xl animate-pulse" />
                <div className="text-3xl opacity-75">🪑 🌧️ 🕯️</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 text-[10px] font-mono tracking-widest text-amber-200/60 uppercase">
                  A Quiet Rainy Night
                </span>
              </div>

              {/* Text Progression */}
              <div className="space-y-4 max-w-md">
                {subStep >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg font-serif text-slate-200 leading-relaxed"
                  >
                    நான் உன்னை
                    <br />
                    என்னோட வாழ்க்கைக்குள்
                    <br />
                    கட்டாயமாக கொண்டு வர விரும்பவில்லை...
                  </motion.p>
                )}

                {subStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg font-serif text-amber-300 font-medium"
                  >
                    நான் விரும்புவது ஒன்றுதான்...
                  </motion.p>
                )}

                {subStep >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm sm:text-base font-serif text-slate-300 leading-relaxed"
                  >
                    ஒருநாள்...
                    <br />
                    நீ உன் மனசை அமைதியாக கேட்டுப் பார்த்து...
                  </motion.p>
                )}

                {subStep >= 4 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg font-serif text-rose-200 font-medium"
                  >
                    அதில் என்னையும்
                    <br />
                    ஒரு சிறிய இடத்தில் பார்த்தால்...
                  </motion.p>
                )}

                {subStep >= 5 && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xl sm:text-2xl font-serif text-rose-400 font-semibold drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] pt-2"
                  >
                    அது எனக்கு போதும். ❤️
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PHASE 4: THE MOST EMOTIONAL PART (PURE SINCERITY)               */}
          {/* ---------------------------------------------------------------- */}
          {phase === 4 && (
            <motion.div
              key="phase4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              className="w-full space-y-5 max-w-md p-6 rounded-3xl bg-zinc-950/70 backdrop-blur-xl border border-amber-500/20 shadow-[0_0_50px_rgba(251,191,36,0.15)]"
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 text-sm">
                🦋
              </div>

              <div className="space-y-3.5">
                {subStep >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg font-serif text-slate-300"
                  >
                    நான் perfect இல்ல...
                  </motion.p>
                )}

                {subStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg font-serif text-slate-300"
                  >
                    என்னிடம் எல்லா பதிலும் இல்ல...
                  </motion.p>
                )}

                {subStep >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xl font-serif text-amber-300 font-semibold italic"
                  >
                    ஆனா...
                  </motion.p>
                )}

                {subStep >= 4 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-xl font-serif text-rose-200 leading-relaxed"
                  >
                    உன்னை சந்தித்த பிறகு
                    <br />
                    என் மனசு உண்மையாக
                    <br />
                    <span className="text-amber-300 font-medium">ஒருவரை விரும்ப கற்றுக்கொண்டது.</span>
                  </motion.p>
                )}

                {subStep >= 5 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm sm:text-base font-serif text-slate-200 italic pt-2 border-t border-white/10"
                  >
                    "அந்த உணர்வை நான் ஒருபோதும் பொய்யாக சொல்ல மாட்டேன்."
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PHASE 5: HER CHOICE (NO PRESSURE, ONLY PURE LOVE)               */}
          {/* ---------------------------------------------------------------- */}
          {phase === 5 && (
            <motion.div
              key="phase5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              className="w-full space-y-6 max-w-md"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-4">
                {subStep >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg font-serif text-slate-300 leading-relaxed"
                  >
                    நான் உன்னிடம்
                    <br />
                    ஒரு பதிலை கேட்க வரல...
                  </motion.p>
                )}

                {subStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg font-serif text-slate-300 leading-relaxed"
                  >
                    என் மனசுல இருந்த உண்மையை மட்டும் சொல்ல வரேன்.
                  </motion.p>
                )}

                {subStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="pt-4 p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 backdrop-blur-md"
                  >
                    <p className="text-lg sm:text-2xl font-serif text-amber-200 font-medium leading-relaxed drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                      நான் எதிர்பார்ப்பது ஒரு வார்த்தை இல்ல...
                      <br />
                      <span className="text-rose-400 font-semibold">
                        என் வாழ்க்கை முழுக்க உன் நினைவுகள் இருக்கணும் என்ற ஆசை மட்டும். ❤️
                      </span>
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PHASE 6: HOPEFUL ROMANTIC TURN (GOLDEN LIGHT + PETALS)          */}
          {/* ---------------------------------------------------------------- */}
          {phase === 6 && (
            <motion.div
              key="phase6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full space-y-6 max-w-md p-6 rounded-3xl bg-gradient-to-b from-amber-950/30 via-zinc-950/70 to-zinc-950/90 border border-amber-400/30 backdrop-blur-xl shadow-[0_0_60px_rgba(251,191,36,0.2)]"
            >
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-300">
                ✨ A Hopeful Heart ✨
              </span>

              <div className="space-y-4">
                {subStep >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg font-serif text-slate-200"
                  >
                    ஆனா...
                    <br />
                    உன் மனசில் ஒருநாள்...
                  </motion.p>
                )}

                {subStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg sm:text-xl font-serif text-amber-200 italic leading-relaxed"
                  >
                    ‘இவன் என்னை உண்மையாக நேசிக்கிறான்...’
                    <br />
                    என்று ஒரு சிறிய உணர்வு வந்தால்...
                  </motion.p>
                )}

                {subStep >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xl sm:text-2xl font-serif text-rose-300 font-semibold leading-relaxed drop-shadow-[0_0_20px_rgba(244,63,94,0.7)] pt-2"
                  >
                    அந்த ஒரு உணர்வை
                    <br />
                    நான் வாழ்க்கை முழுக்க
                    <br />
                    மதிப்பேன். ❤️
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PHASE 7: THE HEART MOMENT (ABISHEK ❤️ SARANYA)                  */}
          {/* ---------------------------------------------------------------- */}
          {phase === 7 && (
            <motion.div
              key="phase7"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5 }}
              className="w-full flex flex-col items-center justify-center space-y-6 min-h-[360px]"
            >
              {/* Centered Glowing Name Heart */}
              <div className="relative p-8 rounded-full flex flex-col items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.6)]"
                >
                  <Heart className="w-10 h-10 text-rose-400 fill-rose-500/60 drop-shadow-[0_0_15px_#f43f5e]" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                  className="mt-6 space-y-1"
                >
                  <h3 className="text-2xl sm:text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 font-bold tracking-wider drop-shadow-[0_0_25px_rgba(244,63,94,0.8)]">
                    ABISHEK ❤️ SARANYA
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300/80">
                    Two Souls • One Gentle Rhythm
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PHASE 8: FINAL HANDWRITTEN LETTER                               */}
          {/* ---------------------------------------------------------------- */}
          {phase === 8 && (
            <motion.div
              key="phase8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-950/85 backdrop-blur-2xl border border-rose-500/30 shadow-[0_0_60px_rgba(244,63,94,0.2)] text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-300">
                  💌 Abishek's Solemn Promise
                </span>
                <Sparkles className="w-4 h-4 text-rose-400" />
              </div>

              <div className="space-y-3.5 text-sm sm:text-base font-serif text-slate-200 leading-relaxed">
                {subStep >= 1 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-200 font-medium">
                    எனக்கு உன்னிடம் ஒரு பெரிய promise மட்டும்...
                  </motion.p>
                )}

                {subStep >= 2 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-300">
                    • உன்னை நான் ஒருபோதும் கட்டாயப்படுத்த மாட்டேன்.
                  </motion.p>
                )}

                {subStep >= 3 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-300">
                    • உன் மனசை மாற்ற நான் முயற்சி செய்ய மாட்டேன்.
                  </motion.p>
                )}

                {subStep >= 4 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-200 pt-1">
                    ஆனா... என் மனசில் இருக்கும் இந்த உண்மையான அன்பை மட்டும்...
                  </motion.p>
                )}

                {subStep >= 5 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-base sm:text-lg font-semibold text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                  >
                    நான் மறைக்கவும் மாட்டேன். ❤️
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* PHASE 9: EMOTIONAL CLIMAX & "சம்மதம் ❤️" BUTTON                  */}
          {/* ---------------------------------------------------------------- */}
          {phase === 9 && !isAccepted && (
            <motion.div
              key="phase9"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full space-y-6 max-w-md flex flex-col items-center"
            >
              <div className="space-y-3">
                {subStep >= 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-serif text-slate-300"
                  >
                    ஒருநாள்...
                  </motion.p>
                )}

                {subStep >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-serif text-amber-200 font-medium"
                  >
                    நீயே...
                  </motion.p>
                )}

                {subStep >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-serif text-pink-300"
                  >
                    உன் மனசால...
                  </motion.p>
                )}

                {subStep >= 4 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-serif text-white font-semibold"
                  >
                    என்னை தேர்வு செய்தால்...
                  </motion.p>
                )}

                {subStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="pt-3"
                  >
                    <p className="text-xl sm:text-2xl md:text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 font-bold leading-relaxed drop-shadow-[0_0_25px_rgba(244,63,94,0.8)]">
                      அந்த ஒரு 'சம்மதம்'...
                      <br />
                      என் வாழ்க்கையின்
                      <br />
                      மிக அழகான நினைவாக இருக்கும். ❤️
                    </p>
                  </motion.div>
                )}
              </div>

              {/* ONLY ONE BEAUTIFUL BUTTON: "சம்மதம் ❤️" */}
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="pt-4 flex flex-col items-center space-y-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSammathamClick}
                    className="relative group px-12 sm:px-16 py-4 sm:py-5 rounded-full font-serif text-lg sm:text-xl font-bold text-white tracking-wider cursor-pointer shadow-[0_0_40px_rgba(244,63,94,0.6)] border border-amber-300/40 backdrop-blur-2xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(244,63,94,0.9) 0%, rgba(236,72,153,0.85) 50%, rgba(168,85,247,0.8) 100%)',
                    }}
                  >
                    {/* Animated Glow Border */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 opacity-30 blur-md group-hover:opacity-75 transition-opacity" />

                    <Heart className="w-5 h-5 text-amber-200 fill-amber-200 animate-pulse relative z-10" />
                    <span className="relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      சம்மதம் ❤️
                    </span>
                    <Sparkles className="w-5 h-5 text-amber-200 animate-spin relative z-10" />
                  </motion.button>

                  <p className="text-[11px] font-serif text-slate-400/80 italic">
                    A gentle choice of your heart ✨
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* POST-CLICK CINEMATIC CLIMAX REACTION                             */}
          {/* ---------------------------------------------------------------- */}
          {isAccepted && (
            <motion.div
              key="acceptedClimax"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-6 max-w-lg flex flex-col items-center justify-center"
            >
              {acceptStage >= 5 && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="p-6 rounded-3xl bg-rose-950/60 border border-amber-400/40 backdrop-blur-2xl shadow-[0_0_70px_rgba(244,63,94,0.7)]"
                >
                  <h2 className="text-3xl sm:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-200 font-bold tracking-wide drop-shadow-[0_0_30px_#f43f5e]">
                    சம்மதம் ❤️
                  </h2>
                </motion.div>
              )}

              {acceptStage >= 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="space-y-4 max-w-md"
                >
                  <p className="text-lg sm:text-xl font-serif text-slate-200">
                    சில பதில்கள்...
                    <br />
                    வார்த்தைகளால் வருவதில்லை.
                  </p>

                  <p className="text-xl sm:text-2xl font-serif text-amber-200 font-medium">
                    ஒரு சிறிய 'சம்மதம்' போதும்...
                    <br />
                    ஒரு வாழ்க்கை முழுவதும் நினைவாக இருக்க. ❤️
                  </p>

                  <p className="text-sm sm:text-base font-serif text-rose-300 italic pt-2">
                    Thank you for choosing with your heart. ❤️
                  </p>

                  {emailStatus === 'sent' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Moment recorded with love ✨</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Climax Expanding Golden Light Layer into FingerprintLock */}
      {acceptStage === 7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-tr from-amber-200/90 via-rose-200/90 to-white"
        />
      )}
    </div>
  );
}
