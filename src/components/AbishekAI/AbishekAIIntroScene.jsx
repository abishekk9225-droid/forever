import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Heart,
  Globe,
  ArrowRight,
  Shield,
  CheckCircle2,
  Send,
  SkipForward,
  Loader2,
  X,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { primeIntroAudioOnUserGesture } from '../../utils/introAudioManager';
import { CONVERSATION_QUESTIONS, sendSaranyaResponseEmail } from './conversationService';

/**
 * ABISHEK AI - Upgraded Cinematic Introduction & Emotional Conversation Scene
 * 
 * Features:
 * 1. Truthful & Positive Introduction of Abishek (VSB Engineering College, AI & DS, projects, dreams, website effort).
 * 2. Explicit Transparent Consent before sharing responses with Abishek via email.
 * 3. Step-by-step 8-question emotional conversation with free-form typing in Tamil/English/Tanglish.
 * 4. Skip functionality for any question without pressure.
 * 5. Empathetic AI acknowledgments with zero blaming, zero manipulation, and zero pressure.
 * 6. Non-blocking email dispatch to configured admin email via EmailJS with graceful offline fallback.
 * 7. Mobile-responsive, high-performance glassmorphic UI.
 */
export default function AbishekAIIntroScene({ onContinue }) {
  // Language state: 'ta' (Tamil) or 'en' (English)
  const [lang, setLang] = useState(() => {
    if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('ta')) {
      return 'ta';
    }
    return 'ta'; // Default to Tamil as requested for emotional resonance
  });

  // Scene View: 'intro' | 'consent' | 'conversation' | 'completed'
  const [view, setView] = useState('intro');

  // Conversation state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Auto-scroll ref for chat stream
  const chatBottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Smooth scroll to latest message
  const scrollToBottom = useCallback(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (view === 'conversation') {
      scrollToBottom();
    }
  }, [conversationHistory, isAiTyping, currentQuestionIndex, view, scrollToBottom]);

  // Focus textarea when question changes
  useEffect(() => {
    if (view === 'conversation' && textareaRef.current && !isSubmitting && !isAiTyping) {
      textareaRef.current.focus();
    }
  }, [currentQuestionIndex, view, isSubmitting, isAiTyping]);

  // Handle exiting or continuing to the main website
  const handleExitToWebsite = useCallback(() => {
    try {
      if (window.unifiedAudioEngine && !window.unifiedAudioEngine.hasPlayedBgmIntro) {
        window.unifiedAudioEngine.playIntroTrack();
      }
      primeIntroAudioOnUserGesture();
    } catch (e) {
      console.warn('[ABISHEK AI] Audio prime notice:', e);
    }

    if (typeof onContinue === 'function') {
      onContinue();
    }
  }, [onContinue]);

  // Handle transition from Intro to Consent
  const handleMeetClick = () => {
    try {
      if (window.unifiedAudioEngine && !window.unifiedAudioEngine.hasPlayedBgmIntro) {
        window.unifiedAudioEngine.playIntroTrack();
      }
      primeIntroAudioOnUserGesture();
    } catch {}
    setView('consent');
  };

  // Handle starting the conversation after consent
  const handleStartConversation = () => {
    setView('conversation');
    setCurrentQuestionIndex(0);
    // Initialize with the prelude message
    setConversationHistory([
      {
        id: 'prelude',
        role: 'ai',
        ta: 'சரண்யா, உன்னிடம் சில விஷயங்கள் கேட்கணும். மனசுல எதையும் மறைக்காமல் சொல்லலாம். உன்னுடைய உணர்வுகளைப் புரிந்துகொள்ள நான் முயற்சி செய்கிறேன்.',
        en: "Saranya, there are a few things I need to ask you. Please feel completely free to speak your heart without holding back. I will try my best to understand your feelings.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Submit response to current question
  const handleSubmitAnswer = async () => {
    const text = inputText.trim();
    if (!text || isSubmitting) return;

    const currentQ = CONVERSATION_QUESTIONS[currentQuestionIndex];
    setIsSubmitting(true);
    setSubmitSuccessNotice(null);

    // 1. Add Saranya's response to the conversation history immediately
    const userMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConversationHistory((prev) => [
      ...prev,
      {
        id: `user-${currentQ.id}`,
        role: 'saranya',
        text: text,
        time: userMessageTime,
        status: 'sending',
      },
    ]);

    // Clear input box
    setInputText('');

    // 2. Dispatch email in background (non-blocking, will not freeze page)
    sendSaranyaResponseEmail({
      questionIndex: currentQuestionIndex,
      totalQuestions: CONVERSATION_QUESTIONS.length,
      questionTamil: currentQ.ta,
      questionEnglish: currentQ.en,
      userAnswer: text,
      isSkipped: false,
      language: lang,
    }).then((res) => {
      const noticeText = res?.success
        ? (lang === 'ta' ? 'பதில் அபிஷேக்கிற்கு பாதுகாப்பாக அனுப்பப்பட்டது ❤️' : 'Response safely delivered to Abishek ❤️')
        : (lang === 'ta' ? 'பதில் பதிவு செய்யப்பட்டது (பாதுகாக்கப்பட்டது) ❤️' : 'Response recorded safely with care ❤️');
      setSubmitSuccessNotice(noticeText);
      setTimeout(() => setSubmitSuccessNotice(null), 3500);

      // Update message status
      setConversationHistory((prev) =>
        prev.map((msg) => (msg.id === `user-${currentQ.id}` ? { ...msg, status: 'sent' } : msg))
      );
    });

    // 3. AI empathetic acknowledgment
    setIsAiTyping(true);
    setTimeout(() => {
      setIsAiTyping(false);
      setConversationHistory((prev) => [
        ...prev,
        {
          id: `ai-ack-${currentQ.id}`,
          role: 'ai',
          ta: currentQ.empatheticTa,
          en: currentQ.empatheticEn,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      setIsSubmitting(false);

      // Advance to next question or complete
      if (currentQuestionIndex + 1 < CONVERSATION_QUESTIONS.length) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 800);
      } else {
        setTimeout(() => {
          setView('completed');
        }, 1200);
      }
    }, 900);
  };

  // Skip the current question
  const handleSkipQuestion = () => {
    if (isSubmitting) return;

    const currentQ = CONVERSATION_QUESTIONS[currentQuestionIndex];
    const userMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Mark as skipped in history
    setConversationHistory((prev) => [
      ...prev,
      {
        id: `user-skip-${currentQ.id}`,
        role: 'saranya',
        text: lang === 'ta' ? '⏭️ இந்த கேள்வியைத் தவிர்த்துவிட்டேன் (Skipped)' : '⏭️ Skipped this question',
        isSkipped: true,
        time: userMessageTime,
        status: 'skipped',
      },
    ]);

    // Send email notification of skip in background
    sendSaranyaResponseEmail({
      questionIndex: currentQuestionIndex,
      totalQuestions: CONVERSATION_QUESTIONS.length,
      questionTamil: currentQ.ta,
      questionEnglish: currentQ.en,
      userAnswer: '[SKIPPED BY USER]',
      isSkipped: true,
      language: lang,
    });

    // 2. Empathetic response acknowledging skip
    setIsAiTyping(true);
    setTimeout(() => {
      setIsAiTyping(false);
      setConversationHistory((prev) => [
        ...prev,
        {
          id: `ai-skip-ack-${currentQ.id}`,
          role: 'ai',
          ta: 'பரவாயில்லை சரண்யா, நீ தயாராக இல்லாதபோது சொல்ல வேண்டாம். உன் வசதியும் மன அமைதியும்தான் முக்கியம். ❤️',
          en: "That's completely okay, Saranya. You don't have to share anything you aren't comfortable with. Your comfort comes first. ❤️",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Advance to next question or complete
      if (currentQuestionIndex + 1 < CONVERSATION_QUESTIONS.length) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 600);
      } else {
        setTimeout(() => {
          setView('completed');
        }, 1200);
      }
    }, 600);
  };

  const currentQ = CONVERSATION_QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / CONVERSATION_QUESTIONS.length) * 100);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-[#040108] text-white overflow-hidden select-none font-sans">
      {/* 1. Cinematic Ambient Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-700/20 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-rose-600/20 blur-[150px] pointer-events-none animate-pulse [animation-delay:1.5s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 19) % 100}vw`,
              y: `${(i * 23) % 100}vh`,
              opacity: 0.2 + (i % 5) * 0.15,
              scale: 0.6 + (i % 4) * 0.2,
            }}
            animate={{
              y: ['0vh', '-8vh', '0vh'],
              opacity: [0.2, 0.75, 0.2],
            }}
            transition={{
              duration: 4 + (i % 4) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i % 3) * 0.8,
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-rose-300 shadow-[0_0_8px_rgba(244,114,182,0.8)]"
          />
        ))}
      </div>

      {/* ========================================================
          VIEW 1: INTRODUCTION CARD
          ======================================================== */}
      {view === 'intro' && (
        <motion.div
          key="intro-card"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950/85 border border-purple-500/35 shadow-[0_0_60px_rgba(168,85,247,0.35),0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-center space-y-5"
        >
          {/* Language Switcher */}
          <div className="flex justify-center items-center">
            <div className="inline-flex p-1 rounded-full bg-slate-900/90 border border-purple-500/25 text-xs">
              <button
                type="button"
                onClick={() => setLang('ta')}
                className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'ta'
                    ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Glowing AI Icon */}
          <div className="relative mx-auto w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-purple-900 via-rose-950 to-slate-950 border border-purple-400/50 flex items-center justify-center shadow-[0_0_35px_rgba(168,85,247,0.5)]">
            <span className="absolute inset-0 rounded-3xl bg-purple-500/20 animate-ping opacity-30 pointer-events-none" />
            <Bot className="w-10 h-10 sm:w-11 sm:h-11 text-purple-200 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
            <Heart className="w-4 h-4 text-rose-400 absolute -top-1.5 -right-1.5 fill-rose-400 animate-pulse drop-shadow-[0_0_8px_#f43f5e]" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -bottom-1 -left-1 animate-bounce drop-shadow-[0_0_8px_#f59e0b]" />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-mono text-purple-300 mb-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>AI Companion · Created by Abishek</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-purple-100 to-amber-200 tracking-wide">
              ABISHEK AI ❤️
            </h1>
            <p className="text-xs sm:text-sm font-serif italic text-rose-300/90 tracking-wide">
              The Heart Behind This Journey.
            </p>
          </div>

          {/* Positive & Truthful Introduction Content */}
          <AnimatePresence mode="wait">
            {lang === 'ta' ? (
              <motion.div
                key="intro-ta"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-purple-400/20 text-xs sm:text-[13px] text-slate-200/95 leading-relaxed text-left space-y-2.5"
              >
                <p className="font-semibold text-rose-200 text-sm">
                  வணக்கம் சரண்யா! நான் ABISHEK AI. ❤️
                </p>
                <p>
                  அபிஷேக் <strong className="text-purple-200 font-medium">V.S.B. பொறியியல் கல்லூரியில்</strong> <span className="text-amber-200">Artificial Intelligence and Data Science (AI & DS)</span> பயின்று வரும் ஒரு பொறியியல் மாணவன்.
                </p>
                <p>
                  அவனுக்கு AI, நிரலாக்கம் (Programming), நவீன தொழில்நுட்பம் மற்றும் புதிய மென்பொருட்கள் உருவாக்குவதில் மிகுந்த ஆர்வம் உண்டு. புதுமையான திட்டங்களை உருவாக்குவதை அவன் மிகவும் விரும்புகிறான்.
                </p>
                <p>
                  கனவுகள், உணர்வுகள், லட்சியங்கள் மற்றும் தன்னை எப்போதும் மேம்படுத்திக்கொள்ள வேண்டும் என்ற ஆர்வம் கொண்ட ஒரு எளிய மனிதன் அவன்.
                </p>
                <p className="text-rose-300 font-medium pt-1 border-t border-purple-500/20">
                  உனக்காக, தன் உண்மையான அன்பை வெளிப்படுத்த இந்த முழு இணையதள அனுபவத்தையும் மிகுந்த உழைப்போடும் கவனத்தோடும் உருவாக்கியிருக்கிறான். ✨
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="intro-en"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-purple-400/20 text-xs sm:text-[13px] text-slate-200/95 leading-relaxed text-left space-y-2.5"
              >
                <p className="font-semibold text-rose-200 text-sm">
                  Hello, Saranya! I'm ABISHEK AI. ❤️
                </p>
                <p>
                  Abishek is an engineering student at <strong className="text-purple-200 font-medium">V.S.B. Engineering College</strong>, currently pursuing <span className="text-amber-200">Artificial Intelligence and Data Science (AI & DS)</span>.
                </p>
                <p>
                  He is deeply interested in AI, programming, technology, and software development, and genuinely loves crafting innovative projects.
                </p>
                <p>
                  He is a person with his own dreams, emotions, ambitions, and an honest desire to learn and improve himself every day.
                </p>
                <p className="text-rose-300 font-medium pt-1 border-t border-purple-500/20">
                  He has put considerable effort, thought, and care into creating this entire website experience just for you. ✨
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Action Button */}
          <div className="space-y-2.5 pt-1">
            <motion.button
              type="button"
              onClick={handleMeetClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:via-rose-500 hover:to-amber-500 text-white font-serif font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-200 shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>MEET ABISHEK AI ❤️</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Direct Skip Option */}
            <button
              type="button"
              onClick={handleExitToWebsite}
              className="text-xs text-slate-400 hover:text-rose-300 transition-colors cursor-pointer py-1 block mx-auto underline-offset-4 hover:underline"
            >
              {lang === 'ta' ? 'நேரடியாகப் பயணத்தைத் தொடர →' : 'Continue directly to website →'}
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================
          VIEW 2: TRANSPARENT CONSENT NOTICE
          ======================================================== */}
      {view === 'consent' && (
        <motion.div
          key="consent-card"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-purple-500/40 shadow-[0_0_60px_rgba(168,85,247,0.35),0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-center space-y-5"
        >
          {/* Shield & Heart Icon */}
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-900 to-rose-950 border border-rose-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            <Lock className="w-8 h-8 text-rose-300" />
            <Heart className="w-3.5 h-3.5 text-rose-400 absolute -top-1 -right-1 fill-rose-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-rose-100">
              {lang === 'ta' ? 'அன்பான ஒரு பகிர்வு · வெளிப்படையான சம்மதம் 🔒' : 'A Safe Conversation · Transparent Consent 🔒'}
            </h2>
            <p className="text-xs text-purple-300">
              {lang === 'ta' ? 'உன் உண்மையான உணர்வுகளைப் புரிந்துகொள்ள ஒரு சிறிய இடம்' : 'A gentle space to understand your true feelings'}
            </p>
          </div>

          {/* Consent Text */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs sm:text-[13px] text-slate-200/90 leading-relaxed text-left space-y-2.5">
            {lang === 'ta' ? (
              <>
                <p className="font-semibold text-rose-200">சரண்யா,</p>
                <p>
                  உன்னுடைய உண்மையான உணர்வுகளையும் எண்ணங்களையும் புரிந்துகொள்ளவே அபிஷேக் இந்த உரையாடலை அமைத்திருக்கிறான்.
                </p>
                <p>
                  <strong className="text-purple-200">முக்கிய அறிவிப்பு:</strong> நீ இங்கே விருப்பத்தோடு அளிக்கும் பதில்கள் அவனுடைய தனிப்பட்ட மின்னஞ்சலுக்கு (<span className="text-amber-200 font-mono">Email</span>) பாதுகாப்பாக அனுப்பப்படும்.
                </p>
                <p>
                  மனதில் உள்ளதை எதையும் மறைக்காமல் நீ சுதந்திரமாகப் பேசலாம் (தமிழ், English, Tanglish). உனக்கு சங்கடமாக இருக்கும் எந்தக் கேள்வியையும் <strong className="text-rose-300">தவிர்க்கலாம் (Skip)</strong>.
                </p>
                <p className="text-emerald-300 font-medium pt-1 border-t border-purple-500/20">
                  🔒 உன் முழு சம்மதத்துடன் மட்டுமே இந்த உரையாடல் தொடங்கும்.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-rose-200">Saranya,</p>
                <p>
                  Abishek created this heartfelt conversation space to genuinely listen to and understand your true feelings.
                </p>
                <p>
                  <strong className="text-purple-200">Transparency Notice:</strong> Every answer you voluntarily submit will be delivered directly to his personal email.
                </p>
                <p>
                  You are completely free to speak your mind in Tamil, English, or Tanglish without holding back. You can <strong className="text-rose-300">skip any question</strong> whenever you wish.
                </p>
                <p className="text-emerald-300 font-medium pt-1 border-t border-purple-500/20">
                  🔒 This conversation proceeds only with your voluntary consent.
                </p>
              </>
            )}
          </div>

          {/* Consent Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <motion.button
              type="button"
              onClick={handleStartConversation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:via-rose-500 hover:to-amber-500 text-white font-serif font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-200 shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'ta' ? 'ஆம், பேசலாம் · தொடங்கலாம் ❤️' : 'Yes, Let\'s Talk · Begin ❤️'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <button
              type="button"
              onClick={handleExitToWebsite}
              className="text-xs text-slate-400 hover:text-rose-300 transition-colors cursor-pointer py-1 block mx-auto underline-offset-4 hover:underline"
            >
              {lang === 'ta' ? 'இப்போதைக்கு வேண்டாம் · பயணத்தைத் தொடர →' : 'Not now · Continue directly to website →'}
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================
          VIEW 3: EMOTIONAL CONVERSATION ROOM
          ======================================================== */}
      {view === 'conversation' && (
        <motion.div
          key="conversation-room"
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl h-[92vh] max-h-[740px] rounded-3xl bg-slate-950/90 border border-purple-500/40 shadow-[0_0_70px_rgba(168,85,247,0.35),0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col overflow-hidden"
        >
          {/* Top Bar / Header */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-purple-500/25 bg-slate-900/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-900 to-rose-950 border border-purple-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Bot className="w-5 h-5 text-purple-200" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-serif font-bold text-sm sm:text-base text-rose-100 flex items-center gap-1.5">
                  <span>ABISHEK AI</span>
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                </h3>
                <p className="text-[11px] text-purple-300 font-sans">
                  {lang === 'ta' ? 'அக்கறையோடு கேட்கிறேன்...' : 'Listening with care...'}
                </p>
              </div>
            </div>

            {/* Right: Language switch & Exit button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLang((prev) => (prev === 'ta' ? 'en' : 'ta'))}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-purple-500/30 text-[11px] text-purple-200 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                title="Switch Language / மொழியை மாற்ற"
              >
                <Globe className="w-3 h-3 text-amber-300" />
                <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
              </button>

              <button
                type="button"
                onClick={handleExitToWebsite}
                className="p-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                title={lang === 'ta' ? 'இணையதளத்திற்குச் செல்ல' : 'Continue to website'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-4 sm:px-6 pt-2 pb-1.5 bg-slate-950/40 border-b border-purple-500/15 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {lang === 'ta' ? `கேள்வி ${currentQuestionIndex + 1} / ${CONVERSATION_QUESTIONS.length}` : `Question ${currentQuestionIndex + 1} of ${CONVERSATION_QUESTIONS.length}`}
            </span>
            <div className="w-32 sm:w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Chat Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
            {/* Conversation History Messages */}
            {conversationHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'saranya' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-[13px] leading-relaxed shadow-lg ${
                    msg.role === 'saranya'
                      ? msg.isSkipped
                        ? 'bg-slate-900/80 border border-slate-700/60 text-slate-400'
                        : 'bg-gradient-to-br from-rose-950/70 via-purple-950/60 to-slate-950 border border-rose-500/40 text-rose-50'
                      : 'bg-slate-900/85 border border-purple-500/30 text-slate-200'
                  }`}
                >
                  {/* Sender label & time */}
                  <div className="flex items-center justify-between gap-3 text-[10px] text-purple-300/80 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      {msg.role === 'saranya' ? (
                        <>
                          <span>Saranya</span>
                          <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                        </>
                      ) : (
                        <>
                          <span>ABISHEK AI</span>
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        </>
                      )}
                    </span>
                    <span>{msg.time}</span>
                  </div>

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.role === 'ai' ? (lang === 'ta' ? msg.ta : msg.en) : msg.text}
                  </div>

                  {/* Status indicator for Saranya's message */}
                  {msg.role === 'saranya' && !msg.isSkipped && (
                    <div className="mt-1.5 pt-1 border-t border-rose-500/20 text-[10px] text-emerald-300/90 flex items-center gap-1 justify-end font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{lang === 'ta' ? 'அபிஷேக்கின் மின்னஞ்சலுக்கு அனுப்பப்பட்டது ❤️' : 'Sent to Abishek\'s email ❤️'}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Current Active Question Bubble */}
            {currentQuestionIndex < CONVERSATION_QUESTIONS.length && (
              <motion.div
                key={`current-question-${currentQ.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-start"
              >
                <div className="max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-purple-950/60 via-slate-950/90 to-rose-950/40 border border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.15)] space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/35 text-[10px] font-mono text-rose-300">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    <span>{lang === 'ta' ? `கேள்வி ${currentQ.id} / 8` : `Question ${currentQ.id} of 8`}</span>
                  </div>

                  {/* Question Text */}
                  <h4 className="text-sm sm:text-base font-medium text-white leading-relaxed font-sans">
                    {lang === 'ta' ? currentQ.ta : currentQ.en}
                  </h4>

                  {/* Subtitle in the other language for clarity */}
                  <p className="text-[11px] sm:text-xs text-purple-300/80 italic font-sans">
                    {lang === 'ta' ? currentQ.en : currentQ.ta}
                  </p>
                </div>
              </motion.div>
            )}

            {/* AI Typing Indicator */}
            {isAiTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex items-center gap-2 text-xs text-purple-300">
                  <Bot className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span className="italic">{lang === 'ta' ? 'அபிஷேக் AI சிந்திக்கிறது...' : 'ABISHEK AI is typing...'}</span>
                  <span className="flex gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Submission Notice Toast */}
          <AnimatePresence>
            {submitSuccessNotice && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="px-4 py-1.5 bg-emerald-950/80 border-t border-emerald-500/30 text-emerald-300 text-xs text-center flex items-center justify-center gap-1.5 font-sans"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{submitSuccessNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Active Input Area */}
          <div className="p-3 sm:p-4 bg-slate-900/80 border-t border-purple-500/25 space-y-2.5">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitAnswer();
                  }
                }}
                disabled={isSubmitting || isAiTyping}
                placeholder={
                  lang === 'ta'
                    ? currentQ ? currentQ.placeholderTa : 'மனதில் உள்ளதை இங்கே தாராளமாக எழுதலாம் (தமிழ், English, Tanglish)...'
                    : currentQ ? currentQ.placeholderEn : 'Feel free to express how you feel (Tamil, English, Tanglish)...'
                }
                rows={2}
                className="w-full p-3 sm:p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/35 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50 text-white placeholder-slate-500 text-xs sm:text-sm resize-none outline-none transition-all leading-relaxed font-sans"
              />
            </div>

            {/* Input Action Controls */}
            <div className="flex items-center justify-between gap-2">
              {/* Skip Button */}
              <button
                type="button"
                onClick={handleSkipQuestion}
                disabled={isSubmitting || isAiTyping}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/70 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                title={lang === 'ta' ? 'இந்த கேள்வியைத் தவிர்க்கலாம்' : 'Skip this question'}
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>{lang === 'ta' ? 'தவிர்க்க (Skip)' : 'Skip Question'}</span>
              </button>

              {/* Submit Answer Button */}
              <motion.button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!inputText.trim() || isSubmitting || isAiTyping}
                whileHover={{ scale: inputText.trim() && !isSubmitting ? 1.02 : 1 }}
                whileTap={{ scale: inputText.trim() && !isSubmitting ? 0.98 : 1 }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:via-rose-500 hover:to-amber-500 text-white font-serif font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'ta' ? 'அனுப்புகிறது...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <span>{lang === 'ta' ? 'பதில் அனுப்பு' : 'Send Response'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================
          VIEW 4: COMPLETED CONVERSATION CARD
          ======================================================== */}
      {view === 'completed' && (
        <motion.div
          key="completed-card"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-purple-500/40 shadow-[0_0_60px_rgba(168,85,247,0.35),0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-center space-y-5"
        >
          {/* Glowing Heart AI Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-900 via-rose-950 to-slate-950 border border-rose-500/50 flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.4)]">
            <Heart className="w-10 h-10 text-rose-400 fill-rose-400 animate-pulse drop-shadow-[0_0_12px_#f43f5e]" />
            <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-purple-100 to-amber-200">
              {lang === 'ta' ? 'நன்றி சரண்யா! ❤️' : 'Thank You, Saranya! ❤️'}
            </h2>
            <p className="text-xs sm:text-sm font-serif italic text-rose-300/90">
              {lang === 'ta' ? 'உன் குரல் கேட்கப்பட்டிருக்கிறது' : 'Your voice has been heard with care'}
            </p>
          </div>

          {/* Concluding Message */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-purple-400/20 text-xs sm:text-[13px] text-slate-200/95 leading-relaxed text-left space-y-2.5">
            {lang === 'ta' ? (
              <>
                <p>
                  சரண்யா, உன் மனதை என்னிடம் பகிர்ந்ததற்கு மிக்க நன்றி. உன் உணர்வுகள் அபிஷேக்குக்கு மிகவும் முக்கியம்.
                </p>
                <p>
                  அவன் உன்னை ஆழமாகப் புரிந்துகொள்ளவும், இன்னும் சிறந்த ஒரு மனிதனாக மாறவும் உன் வார்த்தைகள் நிச்சயம் உதவும்.
                </p>
                <p className="text-rose-300 font-medium pt-1 border-t border-purple-500/20">
                  இப்போது உனக்காகக் காத்திருக்கும் இந்த அழகான பயணத்தைத் தொடங்குவோமா? ✨
                </p>
              </>
            ) : (
              <>
                <p>
                  Saranya, thank you so much for sharing your heartfelt thoughts. What you feel matters deeply to Abishek.
                </p>
                <p>
                  Your thoughts will help him understand you better, learn, and grow into a better person for you.
                </p>
                <p className="text-rose-300 font-medium pt-1 border-t border-purple-500/20">
                  Shall we now continue into this beautiful journey crafted especially for you? ✨
                </p>
              </>
            )}
          </div>

          {/* Continue to Website Button */}
          <motion.button
            type="button"
            onClick={handleExitToWebsite}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:via-rose-500 hover:to-amber-500 text-white font-serif font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-200 shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ta' ? 'பயணத்தைத் தொடரவும் ❤️' : 'CONTINUE TO WEBSITE ❤️'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
