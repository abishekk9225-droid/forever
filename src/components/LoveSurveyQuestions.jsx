import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles, Feather } from 'lucide-react';
import { sendEmail } from '../utils/emailService';
import CinematicSceneAtmosphere from './CinematicSceneAtmosphere';

const ADMIN_PHONE = '6380404055';
const FAST2SMS_API_KEY = 'tOA5S8nMw6IXZRiUzEcNBb93a7xuh2qTYeVsjLgyfQCkWmDl4dTOpwGi2XmRsMJIV5Be4hFk1PaHWfAU';

export default function LoveSurveyQuestions({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConverge, setShowConverge] = useState(false);

  const questions = [
    {
      id: 1,
      title: "Letter Page I 💖",
      prompt: "unaku yenta yenna romba pudikum nu sollu ? 💖✨🌟",
      placeholder: "Write your heartfelt answer here...",
      key: "q1"
    },
    {
      id: 2,
      title: "Letter Page II 🌹",
      prompt: "Enkitta irunthu yethavathu expect pandriya? (Any wishes or desires?) 🥰",
      placeholder: "Share your thoughts...",
      key: "q2"
    },
    {
      id: 3,
      title: "Letter Page III 🥺",
      prompt: "Naan unna romba disturb panra maari irukena? (Be honest!) 🤍",
      placeholder: "Type your honest answer...",
      key: "q3"
    }
  ];

  const handleNext = () => {
    const activeKey = questions[currentQuestion - 1].key;
    if (!answers[activeKey].trim()) return;

    if (currentQuestion < 3) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitAllAnswers();
    }
  };

  const submitAllAnswers = async () => {
    setIsSending(true);

    const fullMessage = `
      💖 Saranya's Love Survey Answers:
      ---------------------------------
      1️⃣ Why/How much she likes you:
      "${answers.q1}"

      2️⃣ What she expects from you:
      "${answers.q2}"

      3️⃣ Does she feel disturbed by you:
      "${answers.q3}"
      ---------------------------------
      Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `;

    // 1. Send via Fast2SMS
    try {
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: `Saranya answered your 3 questions! Check your Gmail for her heartfelt replies. ❤️`,
          language: 'english',
          numbers: ADMIN_PHONE,
        }),
      });
    } catch (e) {}

    // 2. Send via EmailJS
    try {
      await sendEmail({
        title: 'New Love Survey Responses Received! 💌',
        message: fullMessage,
      });
    } catch (e) {
      console.error('Failed to send love survey email:', e);
    }

    setIsSending(false);
    setIsSubmitted(true);
    setShowConverge(true);

    // After cards converge into the final words, call onComplete
    setTimeout(() => {
      onComplete();
    }, 4500);
  };

  const currentQ = questions[currentQuestion - 1];

  return (
    <div className="w-full max-w-xl mx-auto px-4 z-30 relative select-none animate-fade-in">
      {/* Cinematic Shared Atmosphere */}
      <CinematicSceneAtmosphere accentGlow="rose" />

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key={`q-${currentQuestion}`}
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/35 shadow-[0_0_60px_rgba(244,114,182,0.25)] text-center relative overflow-hidden"
          >
            {/* Soft Ambient Light Sweep on Letter Card */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '100%', opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-32 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(254,205,211,0.2), transparent)',
              }}
            />

            {/* Step Counter Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-300 flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-rose-400" />
                {currentQ.title}
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-400 ${
                      step === currentQuestion
                        ? 'bg-gradient-to-r from-rose-500 to-amber-400 w-9 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                        : step < currentQuestion
                        ? 'bg-rose-500/50 w-5'
                        : 'bg-zinc-800 w-5'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-rose-500/15 to-purple-600/15 border border-rose-400/30 flex items-center justify-center text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Heart className="w-7 h-7 text-rose-400 animate-pulse fill-rose-500/30"/>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-white/95 mb-6 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {currentQ.prompt}
            </h3>

            {/* Handwritten Underline Accent */}
            <div className="w-24 h-0.5 mx-auto -mt-3 mb-6 bg-gradient-to-r from-transparent via-rose-400/60 to-transparent rounded-full" />

            {/* Answer Text Area with Rose/Gold Glow */}
            <div className="space-y-4 mb-6 relative">
              <textarea
                value={answers[currentQ.key]}
                onChange={(e) => setAnswers({ ...answers, [currentQ.key]: e.target.value })}
                placeholder={currentQ.placeholder}
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-black/60 border border-rose-400/30 text-white text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/20 transition-all duration-300 shadow-inner resize-none font-serif leading-relaxed"
                required
                autoFocus
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={isSending || !answers[currentQ.key].trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
            >
              {isSending ? (
                <span>Sending Your Heart to Abishek... 💌</span>
              ) : currentQuestion === 3 ? (
                <>
                  <span>Submit My Words ✨</span>
                  <Send className="w-4 h-4"/>
                </>
              ) : (
                <>
                  <span>Next Page 💖</span>
                  <Sparkles className="w-4 h-4"/>
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          /* ================================================================= */
          /* COMPLETION: CARDS CONVERGE INTO "SOME WORDS ARE NEVER SPOKEN"     */
          /* ================================================================= */
          <motion.div
            key="success-converge"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="p-8 sm:p-12 rounded-3xl backdrop-blur-3xl bg-zinc-950/90 border border-rose-500/35 shadow-[0_0_60px_rgba(244,114,182,0.35)] text-center space-y-6 relative overflow-hidden"
          >
            {/* Converging Memory Cards Animation */}
            {showConverge && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                <motion.div
                  initial={{ x: -120, y: -60, rotate: -15, opacity: 0 }}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute w-28 h-20 bg-rose-500/20 border border-rose-400/40 rounded-xl"
                />
                <motion.div
                  initial={{ x: 120, y: 60, rotate: 15, opacity: 0 }}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute w-28 h-20 bg-amber-500/20 border border-amber-400/40 rounded-xl"
                />
              </div>
            )}

            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <Heart className="w-8 h-8 fill-rose-500 text-rose-400 animate-heartbeat"/>
            </div>

            <div className="space-y-3 relative z-10">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-2xl font-serif text-slate-100 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
              >
                "Some words are never spoken..."
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-xl sm:text-3xl font-serif text-amber-200 font-medium tracking-wide drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]"
              >
                because the heart already knows them. ❤️
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 2.2 }}
              className="text-xs text-rose-300/80 font-serif italic pt-2"
            >
              Un answers ellam Abishek-oda mail-ku safe-ah send aagiruchu... ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
