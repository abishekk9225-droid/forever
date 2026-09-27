import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, ArrowRight, Loader2, Volume2 } from 'lucide-react';
import { sendEmail } from '../utils/emailService';

const MAX_RECORD_SECONDS = 40;
const TARGET_EMAIL = 'abishekk9225@gmail.com';

export default function VoiceMessageScene({ onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordedBlobRef = useRef(null);
  const streamRef = useRef(null);
  const durationRef = useRef(0);
  const audioPreviewRef = useRef(null);

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
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  // Detect optimal supported audio recording format (Opus mono @ 16kbps prioritized)
  const getAudioRecordingOptions = () => {
    const candidateTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mp4',
      'audio/aac',
    ];

    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
      for (const mimeType of candidateTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          return { mimeType, audioBitsPerSecond: 16000 };
        }
      }
    }
    return { audioBitsPerSecond: 16000 };
  };

  // 1. அதிக சுருக்கத்துடன் (Highly Compressed) ரெக்கார்டிங் தொடங்குதல்
  const startRecording = async () => {
    if (isSending) return;
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1, // Mono channel to halve payload
          sampleRate: 16000, // 16kHz speech frequency optimization
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const options = getAudioRecordingOptions();

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
        const mimeType = mediaRecorderRef.current?.mimeType || options.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        recordedBlobRef.current = blob;
        setHasRecorded(true);
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (timerRef.current) clearInterval(timerRef.current);
      };

      // Collect data chunks every 500ms
      mediaRecorderRef.current.start(500);
      setIsRecording(true);
      setHasRecorded(false);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setRecordDuration(durationRef.current);

        // Auto-stop when limit reached
        if (durationRef.current >= MAX_RECORD_SECONDS) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied or unavailable:', err);
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

  // Playback preview toggle
  const togglePreview = () => {
    if (!recordedBlobRef.current) return;

    if (isPlayingPreview && audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
      return;
    }

    try {
      const url = URL.createObjectURL(recordedBlobRef.current);
      const audio = new Audio(url);
      audioPreviewRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.onerror = () => setIsPlayingPreview(false);
      audio.play().then(() => setIsPlayingPreview(true)).catch(() => setIsPlayingPreview(false));
    } catch (e) {
      console.warn('Audio preview error:', e);
    }
  };

  // 4. இலவச temporary audio host-க்கு ஆடியோவை பதிவேற்றுதல் (tmpfiles.org / filebin.net)
  const uploadAudioBlob = async (blob) => {
    const extension = blob.type?.includes('ogg')
      ? 'ogg'
      : blob.type?.includes('mp4')
      ? 'mp4'
      : 'webm';
    const filename = `saranya_voice_note_${Date.now()}.${extension}`;

    // Strategy 1: tmpfiles.org
    try {
      const formData = new FormData();
      formData.append('file', blob, filename);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data?.data?.url) {
          const pageUrl = data.data.url;
          const directUrl = pageUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          return { pageUrl, directUrl };
        }
      }
    } catch (e) {
      console.warn('tmpfiles.org upload attempt failed:', e);
    }

    // Strategy 2: filebin.net fallback
    try {
      const binId = `saranya-voice-${Date.now()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`https://filebin.net/${binId}/${filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': blob.type || 'audio/webm',
        },
        body: blob,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok || res.status === 201) {
        const directUrl = `https://filebin.net/${binId}/${filename}`;
        return { pageUrl: directUrl, directUrl };
      }
    } catch (e) {
      console.warn('filebin.net fallback upload failed:', e);
    }

    return null;
  };

  // 5. ஆடியோவை பின்னணியில் அமைதியாக EmailJS-க்கு அனுப்புதல்
  const dispatchAudioEmail = async (blob, durationSeconds) => {
    if (!blob || blob.size === 0) return;

    try {
      const durationText = formatTime(durationSeconds);
      const formattedTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'medium',
      });

      // 1. Convert Blob to Base64
      let base64Audio = '';
      let base64AudioClean = '';
      try {
        base64Audio = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result || '');
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        if (base64Audio && base64Audio.includes(',')) {
          base64AudioClean = base64Audio.split(',')[1];
        } else {
          base64AudioClean = base64Audio;
        }
      } catch (err) {
        console.warn('Base64 encoding error:', err);
      }

      // 2. Upload to temporary audio host for a direct playable link
      const uploadResult = await uploadAudioBlob(blob);
      const audioPlaybackLink = uploadResult?.directUrl || uploadResult?.pageUrl || '';
      const audioPageLink = uploadResult?.pageUrl || '';

      // EmailJS enforces strict 50KB total variables limit.
      // If base64 is <= 35,000 characters, we can safely include voice_data without risk of 413
      const isBase64SafeForEmailJS = base64AudioClean && base64AudioClean.length < 35000;

      // Construct clear and organized email message body
      const messageLines = [
        '🎙️ New Voice Note from Saranya! ❤️',
        '',
        `⏱️ Duration: ${durationText} (${durationSeconds} seconds)`,
        `📅 Recorded At: ${formattedTime} (IST)`,
        `📦 File Size: ~${Math.round(blob.size / 1024)} KB`,
        `🎵 Audio Format: ${blob.type || 'audio/webm;codecs=opus'}`,
        '',
      ];

      if (audioPlaybackLink) {
        messageLines.push('🎧 Direct Audio Playback / Download:');
        messageLines.push(`👉 ${audioPlaybackLink}`);
        messageLines.push('');
        if (audioPageLink && audioPageLink !== audioPlaybackLink) {
          messageLines.push('🌐 Audio Web Page:');
          messageLines.push(`👉 ${audioPageLink}`);
          messageLines.push('');
        }
      } else if (isBase64SafeForEmailJS) {
        messageLines.push('💾 Voice Note audio data is attached directly inside this email.');
      } else {
        messageLines.push('✨ Voice Note recorded successfully.');
      }

      messageLines.push('With endless love,');
      messageLines.push('Saranya ❤️');

      const templateParams = {
        title: '🎙️ New Voice Note from Saranya!',
        subject: '🎙️ New Voice Note from Saranya!',
        name: 'Saranya ❤️',
        message: messageLines.join('\n'),
        time: formattedTime,
        duration: `${durationText} (${durationSeconds}s)`,
        audio_link: audioPlaybackLink || '',
        audio_url: audioPlaybackLink || '',
        download_link: audioPlaybackLink || '',
        email: TARGET_EMAIL,
        to_email: TARGET_EMAIL,
        recipient: TARGET_EMAIL,
        recipient_email: TARGET_EMAIL,
        // Only include base64 when safely under EmailJS 50KB limit to prevent 413 failure
        ...(isBase64SafeForEmailJS ? { voice_data: base64AudioClean } : {}),
      };

      await sendEmail(templateParams);
      console.log('✅ Voice note email successfully delivered to', TARGET_EMAIL);
    } catch (error) {
      // Keep 100% silent in UI - never disrupt the user's flow
      console.error('Voice note email dispatch failed:', error);
    }
  };

  // 6. அடுத்த காட்சிக்குத் தாவுதல் (Continue Journey)
  const handleProceed = async () => {
    if (isSending) return;
    setIsSending(true);

    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    }

    let blobToSend = recordedBlobRef.current;
    const isCurrentlyRecording =
      isRecording ||
      (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording');

    try {
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
        const duration = durationRef.current || recordDuration;
        const dispatchPromise = dispatchAudioEmail(blobToSend, duration);

        // Fail-safe smooth delay: Show "Saving your voice... ✨" for at least 1.2s, 
        // with max wait 3.0s so app never blocks or freezes
        await Promise.all([
          Promise.race([
            dispatchPromise,
            new Promise((resolve) => setTimeout(resolve, 3000)),
          ]),
          new Promise((resolve) => setTimeout(resolve, 1200)),
        ]);
      }
    } catch (err) {
      console.error('Error during voice proceed:', err);
    } finally {
      // திரையில் எந்த பாப்-அப் அல்லது எரரும் இல்லாமல் அமைதியாக அடுத்த காட்சிக்குச் செல்லும்
      if (typeof onComplete === 'function') {
        onComplete();
      }
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
              disabled={isSending}
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-[0_0_40px_rgba(244,63,94,0.4)] cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white hover:scale-105'
              } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Recording... {formatTime(recordDuration)} / 0:40</span>
                  <div className="flex items-center gap-1 ml-2">
                    <span className="w-1 h-3 bg-rose-400 animate-bounce rounded-full"></span>
                    <span className="w-1 h-5 bg-rose-500 animate-bounce rounded-full [animation-delay:0.15s]"></span>
                    <span className="w-1 h-4 bg-pink-400 animate-bounce rounded-full [animation-delay:0.3s]"></span>
                  </div>
                </div>
                {/* Progress bar towards 40s */}
                <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${Math.min(100, (recordDuration / MAX_RECORD_SECONDS) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ) : hasRecorded ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-pink-300 text-sm font-medium">
                  Voice note recorded softly ✨ ({formatTime(recordDuration)})
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-medium border border-pink-500/30 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingPreview ? 'Pause Audio' : 'Listen Preview'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={startRecording}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  >
                    <span>Re-record</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs">
                Tap the mic to start recording (Max 40s)
              </p>
            )}

            {isSending && (
              <div className="mt-3 flex items-center justify-center gap-2 text-pink-400 text-sm font-medium animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Saving your voice... ✨</span>
              </div>
            )}
          </div>
        </div>

        {/* Continue / Send Button */}
        {isSending ? (
          <button
            type="button"
            disabled
            className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 opacity-90 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-wait"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Saving your voice... ✨</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleProceed}
            className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{hasRecorded ? 'Send & Continue Journey' : 'Continue Journey'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
