import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles, Clock, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'abishek.k.officl@gmail.com';
const SERVICE_ID = 'service_ddahis9';
const TEMPLATE_ID = 'template_x2vxz2f';
const PUBLIC_KEY = 'dGY_nInN-FHeWTw5q';

export default function ThinkingTimeWithTimerChallenge({ onComplete, onRestart }) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasSpecialPerson, setHasSpecialPerson] = useState(null); // null | 'yes' | 'no'
  const [specialPersonName, setSpecialPersonName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTimesUp, setIsTimesUp] = useState(false);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft > 0 && !isTimesUp) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isTimesUp) {
      setIsTimesUp(true);
    }
  }, [timeLeft, isTimesUp]);

  const handleNo = () => {
    // If NO, directly proceed to next page
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
      That person/details: "${specialPersonName}"
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
            title: 'New Secret Survey Response! 👀',
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center z-30 animate-fade-in">
      <AnimatePresence mode="wait">
        {!isTimesUp ? (
          <motion.div
            key="active-challenge"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md p-8 rounded-3xl bg-zinc-950/90 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.3)] space-y-6 text-center backdrop-blur-xl animate-glow-pulse"
          >
            {/* Timer Badge */}
            <div className="flex items-center justify-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-widest bg-rose-500/10 py-1.5 px-4 rounded-full w-fit mx-auto border border-rose-500/20">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Time Left: {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>

            {/* The Question */}
            <h3 className="text-xl sm:text-2xl font-serif text-white leading-relaxed">
              Un life la romba special person erukangala, ennaiya thavira now? 🤔💭
            </h3>

            {hasSpecialPerson === null ? (
              <div className="flex gap-4 justify-center mt-4">
                <button
                  onClick={handleYes}
                  className="px-8 py-3.5 rounded-2xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer hover:scale-105 active:scale-95"
                >
                  Yes 🙈
                </button>
                <button
                  onClick={handleNo}
                  className="px-8 py-3.5 rounded-2xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition cursor-pointer hover:scale-105 active:scale-95"
                >
                  No 🤍
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-left">
                <p className="text-xs font-mono text-rose-300 text-center">Yaru adhu? Type here quickly before time runs out:</p>
                <textarea
                  value={specialPersonName}
                  onChange={(e) => setSpecialPersonName(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-rose-400/30 text-white text-sm focus:outline-none focus:border-rose-400 transition resize-none"
                  autoFocus
                />
                <button
                  onClick={handleSubmitYesAnswer}
                  disabled={isSending || !specialPersonName.trim()}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
                >
                  {isSending ? <span>Sending to Abishek... 💌</span> : <><span>Submit & Continue ✨</span><Send className="w-4 h-4"/></>}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Time's Up Screen -> Restart from beginning */
          <motion.div
            key="times-up"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-3xl bg-zinc-950/90 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.3)] space-y-6 text-center backdrop-blur-xl"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 animate-bounce">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-white">
              Time's Up! ⌛💔
            </h3>
            <p className="text-red-200 text-sm font-serif italic">
              "Romba neram yosichathu kku penalty... First la irunthu start pannu!"
            </p>
            <button
              onClick={onRestart}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium text-sm transition cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              Start Again from Beginning 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
