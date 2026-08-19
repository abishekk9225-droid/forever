import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Phone, KeyRound, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';

const ADMIN_PHONE = '6380404055';
const FAST2SMS_API_KEY = 'tOA5S8nMw6IXZRiUzEcNBb93a7xuh2qTYeVsjLgyfQCkWmDl4dTOpwGi2XmRsMJIV5Be4hFk1PaHWfAU';

export default function AdminLoginGate({ onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);

    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: randomOtp,
          numbers: ADMIN_PHONE,
        }),
      });

      const resData = await response.json();
      console.log("Fast2SMS Response:", resData);
      setStep('otp');
    } catch (err) {
      console.warn("SMS error fallback:", err);
      setStep('otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '9225') {
      if (typeof window.unlockAudio === 'function') window.unlockAudio();
      onLoginSuccess();
    } else {
      setErrorMsg('Invalid OTP. Please enter the 4-digit code sent to your phone (or 9225).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05020a]/95 backdrop-blur-3xl px-4">
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-md p-8 rounded-3xl bg-zinc-950/90 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Phone className="w-8 h-8 animate-pulse"/>
            </div>

            <h2 className="text-2xl font-serif text-white mb-2">Welcome Back</h2>
            <p className="text-xs text-rose-300/70 mb-6">
              Enter registered mobile to receive access OTP
            </p>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="px-4 py-3.5 rounded-2xl bg-black/60 border border-rose-400/30 text-center text-white font-mono text-lg tracking-wider">
                +91 {ADMIN_PHONE}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,114,182,0.4)] transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    <span>Sending SMS OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Request Login OTP</span>
                    <ChevronRight className="w-4 h-4"/>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-md p-8 rounded-3xl bg-zinc-950/90 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <KeyRound className="w-8 h-8 animate-pulse"/>
            </div>

            <h2 className="text-2xl font-serif text-white mb-2">Verify Mobile OTP</h2>
            <p className="text-xs text-rose-300/70 mb-6">
              Enter the 4-digit code sent to <span className="text-rose-400 font-mono">+91 {ADMIN_PHONE}</span>
            </p>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="• • • •"
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-rose-400/30 text-center text-white text-3xl tracking-[0.6em] focus:outline-none focus:border-rose-400 transition"
                required
                autoFocus
              />

              {errorMsg && <p className="text-rose-400 text-xs">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,114,182,0.4)] transition cursor-pointer"
              >
                <span>Unlock Experience</span>
                <CheckCircle2 className="w-4 h-4"/>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
