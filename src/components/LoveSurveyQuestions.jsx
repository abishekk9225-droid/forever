import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles, MessageCircle } from 'lucide-react';

const ADMIN_PHONE = '6380404055';
const FAST2SMS_API_KEY = 'tOA5S8nMw6IXZRiUzEcNBb93a7xuh2qTYeVsjLgyfQCkWmDl4dTOpwGi2XmRsMJIV5Be4hFk1PaHWfAU';
const SERVICE_ID = 'service_ddahis9';
const TEMPLATE_ID = 'template_x2vxz2f';
const PUBLIC_KEY = 'dGY_nInN-FHeWTw5q';

export default function LoveSurveyQuestions({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      title: "Question 1 of 3 💖",
      prompt: "Unaku enna romba pudichirukku? 💖✨🌟",
      placeholder: "Type your heartfelt answer here...",
      key: "q1"
    },
    {
      id: 2,
      title: "Question 2 of 3 🌹",
      prompt: "Enkitta irunthu yethavathu expect pandriya? (Any wishes or desires?) 🥰",
      placeholder: "Share your thoughts...",
      key: "q2"
    },
    {
      id: 3,
      title: "Question 3 of 3 🥺",
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
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            name: 'Saranya ❤️',
            title: 'New Love Survey Responses Received! 💌',
            message: fullMessage,
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            email: 'abishek.k.officl@gmail.com',
          },
        }),
      });
    } catch (e) {}

    setIsSending(false);
    setIsSubmitted(true);

    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  const currentQ = questions[currentQuestion - 1];

  return (
    <div className="w-full max-w-md mx-auto px-4 z-30 animate-fade-in">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key={`q-${currentQuestion}`}
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/90 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            {/* Step Counter Badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
                {currentQ.title}
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                      step === currentQuestion
                        ? 'bg-gradient-to-r from-rose-500 to-purple-500 w-10'
                        : step < currentQuestion
                        ? 'bg-rose-500/50'
                        : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <MessageCircle className="w-7 h-7 animate-pulse"/>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-white mb-6 leading-relaxed">
              {currentQ.prompt}
            </h3>

            {/* Answer Text Area */}
            <div className="space-y-4 mb-6">
              <textarea
                value={answers[currentQ.key]}
                onChange={(e) => setAnswers({ ...answers, [currentQ.key]: e.target.value })}
                placeholder={currentQ.placeholder}
                rows={4}
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-rose-400/30 text-white text-sm sm:text-base placeholder:text-white/20 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition shadow-inner resize-none"
                required
                autoFocus
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleNext}
              disabled={isSending || !answers[currentQ.key].trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
            >
              {isSending ? (
                <span>Sending Your Heart to Abishek... 💌</span>
              ) : currentQuestion === 3 ? (
                <>
                  <span>Submit My Answers ✨</span>
                  <Send className="w-4 h-4"/>
                </>
              ) : (
                <>
                  <span>Next Question 💖</span>
                  <Sparkles className="w-4 h-4"/>
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/90 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.3)] text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce">
              <Heart className="w-8 h-8 fill-emerald-400"/>
            </div>
            <h3 className="text-2xl font-serif text-white">
              Thank You, Saranya! 🥰
            </h3>
            <p className="text-rose-200 text-sm font-serif italic">
              "Un answers ellam Abishek-oda mail & phone-ku safe-ah send aagiruchu! 💌✨"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
