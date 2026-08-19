import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Ticket, Sparkles, Clock, Heart, ArrowRight, UserCheck, 
  Send, ShieldCheck, Smile, Flame 
} from 'lucide-react';

const ADMIN_PHONE = '6380404055';
const FAST2SMS_API_KEY = 'tOA5S8nMw6IXZRiUzEcNBb93a7xuh2qTYeVsjLgyfQCkWmDl4dTOpwGi2XmRsMJIV5Be4hFk1PaHWfAU';
const SERVICE_ID = 'service_ddahis9';
const TEMPLATE_ID = 'template_x2vxz2f';
const PUBLIC_KEY = 'dGY_nInN-FHeWTw5q';

export default function PromiseEntryGate({ onProceed }) {
  const [step, setStep] = useState(1); // 1: Pass, 2: Timer, 3: Truth Gate, 4: Name Guess, 5: Rating Slider
  const [timeLeft, setTimeLeft] = useState(60);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  // Step 4: Name Guess
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState(false);
  const [isNameCorrect, setIsNameCorrect] = useState(false);

  // Step 5: Love Rating Slider
  const [rating, setRating] = useState(100);
  const [isSending, setIsSending] = useState(false);

  // 60-Second Countdown Logic
  useEffect(() => {
    if (step !== 2) return;
    if (timeLeft <= 0) {
      setStep(3);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Runaway "No" button physics
  const dodgeNoButton = () => {
    const randomX = (Math.random() - 0.5) * 260;
    const randomY = (Math.random() - 0.5) * 160;
    setNoPos({ x: randomX, y: randomY });
    setDodgeCount((prev) => prev + 1);
  };

  // Check Name Input (Step 4)
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim().toUpperCase() === 'ABISHEK') {
      setNameError(false);
      setIsNameCorrect(true);

      // Trigger Mini Celebration Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24']
      });

      setTimeout(() => {
        setStep(5);
      }, 1500);
    } else {
      setNameError(true);
    }
  };

  // Submit Love Rating (Step 5) & Trigger EmailJS + Fast2SMS
  const handleRatingSubmit = async () => {
    setIsSending(true);

    const messageText = `Saranya entered the site! 🥰\nGuessed Name: Abishek ❤️\nLove Rating: ${rating}% (${getRatingComment(rating)})\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

    // 1. Fast2SMS notification
    try {
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: `Saranya rated your love at ${rating}%! ❤️ Name confirmed: Abishek.`,
          language: 'english',
          numbers: ADMIN_PHONE,
        }),
      });
    } catch (e) {}

    // 2. EmailJS notification
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
            title: `Love Rating Received: ${rating}% 💖`,
            message: messageText,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            email: 'abishek.k.officl@gmail.com',
          },
        }),
      });
    } catch (e) {}

    setIsSending(false);
    onProceed();
  };

  const getRatingComment = (val) => {
    if (val === 100) return "To Infinity & Beyond! ♾️💖";
    if (val >= 80) return "Romba Romba Adhigam! 🥰✨";
    if (val >= 50) return "Full-ah love thaan! 🌸";
    return "Konjam thaan but sweet! 😜";
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 z-30">
      <AnimatePresence mode="wait">
        {/* SCREEN 1: ENTRY PASS & PROMISE */}
        {step === 1 && (
          <motion.div
            key="screen-1"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Ticket className="w-8 h-8 animate-pulse"/>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">
              Hold on! Entry Pass theva... 🎟️
            </h2>
            <p className="text-rose-200/90 text-sm sm:text-base font-serif italic mb-8 leading-relaxed">
              "Naan kekkuradha accept pannuven nu oru promise panna thaan unlock aagum! 🤍"
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setStep(2)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>I Promise 🤞</span>
              <Sparkles className="w-4 h-4"/>
            </motion.button>
          </motion.div>
        )}

        {/* SCREEN 2: 1:00 MINUTE THINKING TIMER */}
        {step === 2 && (
          <motion.div
            key="screen-2"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-rose-400">
              <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }}/>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300">
                Thinking Time
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-white mb-6">
              Take a breath & Think... 💭
            </h3>

            <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border-2 border-rose-400/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(244,114,182,0.3)] mb-6">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-widest">
                00:{String(timeLeft).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono uppercase text-rose-300/70 mt-1">
                Seconds Left
              </span>
            </div>

            <p className="text-rose-200/90 text-sm sm:text-base font-serif italic mb-6 leading-relaxed">
              "Yedhu nadandhalum, endha situation-la yum naan un kooda thaan iruppen... promise! 🤍✨"
            </p>

            <button
              onClick={() => setStep(3)}
              className="text-xs text-rose-300/70 hover:text-white underline underline-offset-4 transition cursor-pointer"
            >
              Skip timer & enter now ⚡
            </button>
          </motion.div>
        )}

        {/* SCREEN 3: TRUTH CHECK GATE */}
        {step === 3 && (
          <motion.div
            key="screen-3"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-8 h-8 fill-rose-400 animate-bounce"/>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">
              Indha Ulagathulaye... 🌍✨
            </h3>
            <p className="text-rose-200/90 text-sm sm:text-base font-serif italic mb-8 leading-relaxed">
              "Un Amma, Appa, Ma'am thavira unakku romba pudicha innoru person yaarunu sollu... Ok-na 'YES' click pannu! 😜❤️"
            </p>

            <div className="flex items-center justify-center gap-5 relative min-h-[90px] w-full">
              {/* YES BUTTON */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(4)}
                className="py-3.5 px-10 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-base tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.5)] transition cursor-pointer z-10"
              >
                YES 💖
              </motion.button>

              <motion.button
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onMouseEnter={dodgeNoButton}
                onTouchStart={dodgeNoButton}
                onClick={dodgeNoButton}
                className="py-3 px-6 rounded-2xl bg-zinc-900/80 border border-white/20 text-white/50 text-xs hover:text-white/80 transition-colors select-none cursor-pointer"
              >
                No 😢
              </motion.button>
            </div>

            {dodgeCount > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-300/80 italic mt-3"
              >
                {dodgeCount > 2
                  ? "Indha button vela seiyadhu! 'YES' mattum thaan option 😜❤️"
                  : "Oops! You can't touch this 🙈"}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* SCREEN 4: NAME GUESS WITH CELEBRATION */}
        {step === 4 && (
          <motion.div
            key="screen-4"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <UserCheck className="w-8 h-8 animate-pulse"/>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">
              Apdina Yaarunu Sollu? 😉
            </h3>
            <p className="text-rose-200/80 text-xs sm:text-sm font-serif italic mb-6">
              "I think that person's name starts with <strong className="text-rose-400 font-bold text-base">'A'</strong> ✨"
            </p>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setNameError(false);
                }}
                placeholder="Type the name..."
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-rose-400/30 text-center text-white text-lg tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-white/20 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition shadow-inner"
                required
                autoFocus
              />

              {nameError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-rose-400 text-xs"
                >
                  Hmm... correct-ana name type pannu paapom! 🙈
                </motion.p>
              )}

              {isNameCorrect ? (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-medium animate-pulse flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400"/>
                  <span>Aww, exactly! You know me so well 🥰</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-medium text-sm tracking-wider shadow-lg hover:scale-102 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Confirm Name ✨</span>
                  <ArrowRight className="w-4 h-4"/>
                </button>
              )}
            </form>
          </motion.div>
        )}

        {/* SCREEN 5: LOVE PERCENTAGE RATING SLIDER (0 - 100%) */}
        {step === 5 && (
          <motion.div
            key="screen-5"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-rose-400">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse"/>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300">
                Love Meter
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">
              Ok, I Agree! 🥰
            </h3>
            <p className="text-rose-200/80 text-xs sm:text-sm font-serif italic mb-6">
              "Aana ennai evvalavu pudikkum-nu sollu paapom? 💖"
            </p>

            {/* Glowing Percentage Display */}
            <div className="my-6">
              <span className="text-5xl sm:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 drop-shadow-[0_0_20px_rgba(244,114,182,0.6)]">
                {rating}%
              </span>
              <p className="text-xs sm:text-sm font-serif italic text-rose-200 mt-2">
                "{getRatingComment(rating)}"
              </p>
            </div>

            {/* Interactive Neon Slider */}
            <div className="relative my-6 px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full h-3 bg-black/60 rounded-lg appearance-none cursor-pointer accent-rose-500 border border-rose-500/30"
              />
              <div className="flex justify-between text-[10px] font-mono text-rose-300/60 mt-2 px-1">
                <span>0% (Chumma)</span>
                <span>50% (Pudikkum)</span>
                <span>100% (Infinity ❤️)</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRatingSubmit}
              disabled={isSending}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.5)] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <span>Locking & Sending Your Love... 💌</span>
              ) : (
                <>
                  <span>Confirm & Unlock Our World ✨</span>
                  <Heart className="w-4 h-4 fill-white"/>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
