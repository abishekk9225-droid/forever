import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, CheckCircle2, Loader2 } from 'lucide-react';

const SERVICE_ID = 'service_8z99rkh';
const TEMPLATE_ID = 'template_2op6g7i';
const PUBLIC_KEY = 'VUHgOes-Xiqh0fnh9';

export default function SecretMessageCard() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || status === 'sending') return;

    setStatus('sending');

    const payload = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        name: 'Saranya ❤️',
        title: 'Forever Proposal Response 💌',
        message: message.trim(),
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        email: 'abishek.k.officl@gmail.com',
      },
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 px-4 z-40 relative">
      <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-zinc-950/85 border border-rose-400/30 shadow-[0_0_40px_rgba(244,114,182,0.25)]">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse"/>
          <h3 className="text-white font-serif italic text-xl tracking-wide">
            Leave a note for Abishek
          </h3>
        </div>

        <p className="text-rose-200/70 text-xs sm:text-sm font-light mb-4">
          Write anything in your heart... it lands directly in his inbox ✨
        </p>

        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]"/>
              <h4 className="text-white font-medium text-lg">Your note was delivered ❤️</h4>
              <p className="text-white/60 text-xs mt-1">He will cherish every single word.</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.value || e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-rose-500/30 text-white placeholder-white/40 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition duration-300 resize-none shadow-inner"
                />
              </div>

              {status === 'error' && (
                <p className="text-rose-400 text-xs">
                  Delivery hiccup. Please check internet and tap Send again!
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !message.trim()}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,114,182,0.4)] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white"/>
                    <span>Sending your note...</span>
                  </>
                ) : (
                  <>
                    <span>Send Secret Note</span>
                    <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300"/>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
