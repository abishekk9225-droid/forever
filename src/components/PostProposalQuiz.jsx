import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';

const ADMIN_PHONE = '6380404055';
const FAST2SMS_API_KEY = 'tOA5S8nMw6IXZRiUzEcNBb93a7xuh2qTYeVsjLgyfQCkWmDl4dTOpwGi2XmRsMJIV5Be4hFk1PaHWfAU';
const SERVICE_ID = 'service_ddahis9';
const TEMPLATE_ID = 'template_x2vxz2f';
const PUBLIC_KEY = 'dGY_nInN-FHeWTw5q';

const QUESTIONS = [
  {
    id: 1,
    category: "Our Memory",
    question: "நாம முதல் முதலா பேசி சிரிச்ச அந்த தருணம் உனக்கு இன்னும் ஞாபகம் இருக்கா?",
    options: [
      { text: "எப்பவுமே என் மனசுல பத்திரமா இருக்கு ❤️" },
      { text: "மறக்கவே முடியாத ஒரு மேஜிக் ✨" }
    ]
  },
  {
    id: 2,
    category: "The Bond",
    question: "என்கிட்ட உனக்கு ரொம்ப பிடிச்ச ஒரு விஷயம் எது?",
    options: [
      { text: "உன்னோட இந்த அன்பும் அக்கறையும் 🥰" },
      { text: "உன்னோட சிரிப்பும் குழந்தை மனசும் ✨" }
    ]
  },
  {
    id: 3,
    category: "The Promise",
    question: "வாழ்க்கையோட கடைசி வரைக்கும் இந்த கையை விடாம கூடவே இருப்பியா?",
    options: [
      { text: "எந்த ஜென்மமானாலும் உன் கூடத்தான் 💍" },
      { text: "Forever & Always with you ❤️" }
    ]
  }
];

export default function PostProposalQuiz({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);

  const handleSelectOption = async (option) => {
    const updatedAnswers = { ...answers, [QUESTIONS[currentIndex].category]: option.text };
    setAnswers(updatedAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);

      const summaryText = `Proposal Answers:\n1. Memory: ${updatedAnswers['Our Memory']}\n2. Bond: ${updatedAnswers['The Bond']}\n3. Promise: ${updatedAnswers['The Promise']}`;

      // 1. Fast2SMS Trigger
      try {
        await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: `Saranya answered YES! Answers:\n1. ${updatedAnswers['Our Memory']}\n2. ${updatedAnswers['The Bond']}\n3. ${updatedAnswers['The Promise']}`,
            language: 'english',
            numbers: ADMIN_PHONE,
          }),
        });
      } catch (e) {}

      // 2. EmailJS Trigger to Gmail
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
              title: 'Proposal Quiz Responses & YES! 💖',
              message: summaryText,
              time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              email: 'abishek.k.officl@gmail.com'
            }
          })
        });
      } catch (e) {}

      if (onComplete) onComplete();
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey Abishek! ❤️ I said YES to Forever! 💍✨\n\nHere are my answers:\n1. ${answers['Our Memory'] || ''}\n2. ${answers['The Bond'] || ''}\n3. ${answers['The Promise'] || ''}\n\nForever & Always with you! 💖`
    );
    window.open(`https://wa.me/91${ADMIN_PHONE}?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 px-4 z-40 relative">
      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key={`quiz-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -25 }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-400/90 flex items-center gap-1.5">
                <Stars className="w-3.5 h-3.5 text-rose-400"/>
                {QUESTIONS[currentIndex].category} • {currentIndex + 1}/3
              </span>
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse"/>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-white/95 mb-8 leading-relaxed">
              "{QUESTIONS[currentIndex].question}"
            </h3>

            <div className="space-y-4">
              {QUESTIONS[currentIndex].options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-rose-400/20 hover:border-rose-400/70 hover:bg-rose-500/15 text-white text-left text-sm sm:text-base flex items-center justify-between transition-all duration-300 group cursor-pointer shadow-lg"
                >
                  <span className="font-medium pr-4">{opt.text}</span>
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 group-hover:bg-rose-500 group-hover:text-white transition">
                    <ArrowRight className="w-4 h-4"/>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-zinc-950/85 border border-rose-400/30 text-center shadow-[0_0_40px_rgba(244,114,182,0.25)] space-y-4"
          >
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto drop-shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-bounce"/>
            <h4 className="text-2xl font-serif text-white">Your Love is Sealed ❤️</h4>
            <p className="text-rose-200/70 text-xs sm:text-sm">
              Your sweet answers have been delivered straight to Abishek.
            </p>

            <button
              onClick={openWhatsApp}
              className="mt-4 w-full py-3.5 px-6 rounded-2xl bg-[#25D366]/90 hover:bg-[#25D366] text-white font-medium text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.4)] transition cursor-pointer"
            >
              <MessageCircle className="w-5 h-5"/>
              <span>Send to Abishek on WhatsApp 💬</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
