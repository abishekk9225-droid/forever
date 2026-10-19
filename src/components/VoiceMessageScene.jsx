import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Sparkles,
  ArrowRight,
  Loader2,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { sendEmail } from '../utils/emailService';
import CinematicRainbowBorder from './CinematicRainbowBorder';

const MAX_RECORD_SECONDS = 40;
const TARGET_EMAIL = 'kabishekkabishek677@gmail.com';

export default function VoiceMessageScene({ onComplete }) {
  // 10. Proper states: 'IDLE' | 'RECORDING' | 'PROCESSING' | 'SENT' | 'ERROR'
  const [status, setStatus] = useState(() => {
    if (typeof window !== 'undefined' && window.__savedVoiceRecording?.file) {
      return 'SENT';
    }
    return 'IDLE';
  });

  const [recordedFile, setRecordedFile] = useState(() => {
    return typeof window !== 'undefined' ? window.__savedVoiceRecording?.file || null : null;
  });
  const [recordedBlob, setRecordedBlob] = useState(() => {
    return typeof window !== 'undefined' ? window.__savedVoiceRecording?.blob || null : null;
  });
  const [recordDuration, setRecordDuration] = useState(() => {
    return typeof window !== 'undefined' ? window.__savedVoiceRecording?.duration || 0 : 0;
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Refs for audio handling and cleanup
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordedBlobRef = useRef(
    typeof window !== 'undefined' ? window.__savedVoiceRecording?.blob || null : null
  );
  const recordedFileRef = useRef(
    typeof window !== 'undefined' ? window.__savedVoiceRecording?.file || null : null
  );
  const streamRef = useRef(null);
  const durationRef = useRef(
    typeof window !== 'undefined' ? window.__savedVoiceRecording?.duration || 0 : 0
  );
  const audioPreviewRef = useRef(null);
  const previewUrlRef = useRef(null);
  const shouldProceedAfterProcessingRef = useRef(false);

  // 19. Cleanup: stop tracks, stop recorder, revoke preview URLs
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  // 3. Detect supported MIME types instead of hardcoding an unsupported type
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

  // 4 & 5. Upload audio Blob to temporary audio host for a direct playable link
  const uploadAudioBlob = async (blob, filename) => {
    // Strategy 1: tmpfiles.org
    try {
      const formData = new FormData();
      formData.append('file', blob, filename);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

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
      const timeoutId = setTimeout(() => controller.abort(), 6000);

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

  // 7 & 8. Send actual audio file through existing EmailJS mechanism
  const dispatchAudioEmail = async (file, blob, durationSeconds) => {
    if (!file || !(file instanceof File) || file.size === 0) {
      throw new Error('Valid audio file is required for delivery.');
    }

    const durationText = formatTime(durationSeconds);
    const formattedTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    // 1. Convert Blob to Base64
    let base64AudioClean = '';
    try {
      const base64DataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result || '');
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      if (typeof base64DataUrl === 'string' && base64DataUrl.includes(',')) {
        base64AudioClean = base64DataUrl.split(',')[1];
      }
    } catch (err) {
      console.warn('Base64 encoding error:', err);
    }

    // 2. Upload to temporary host for direct playback link
    const uploadResult = await uploadAudioBlob(blob, file.name);
    const audioPlaybackLink = uploadResult?.directUrl || uploadResult?.pageUrl || '';
    const audioPageLink = uploadResult?.pageUrl || '';

    // EmailJS enforces strict 50KB total variables ceiling on free tier.
    // If base64 is <= 35,000 chars, we safely attach voice_data
    const isBase64SafeForEmailJS = base64AudioClean && base64AudioClean.length < 35000;

    const messageLines = [
      '🎙️ New Voice Note from Saranya! ❤️',
      '',
      `📁 File Name: ${file.name}`,
      `⏱️ Duration: ${durationText} (${durationSeconds} seconds)`,
      `📅 Recorded At: ${formattedTime} (IST)`,
      `📦 File Size: ~${Math.round(blob.size / 1024)} KB (${blob.size} bytes)`,
      `🎵 Audio Format: ${blob.type || file.type || 'audio/webm'}`,
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
      messageLines.push('💾 Voice Note audio data is encoded directly inside this email.');
    } else {
      messageLines.push('✨ Voice Note recorded and stored safely.');
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
      filename: file.name,
      file_size: `${Math.round(blob.size / 1024)} KB`,
      email: TARGET_EMAIL,
      to_email: TARGET_EMAIL,
      recipient: TARGET_EMAIL,
      recipient_email: TARGET_EMAIL,
      ...(isBase64SafeForEmailJS ? { voice_data: base64AudioClean } : {}),
    };

    // Calls existing sendEmail utility with project's EmailJS configuration
    await sendEmail(templateParams);
    console.log('✅ Voice note email successfully delivered to', TARGET_EMAIL);
  };

  // 1 & 2. Request microphone permission and start recording
  const startRecording = async () => {
    // Prevent multiple MediaRecorder instances
    if (status === 'RECORDING' || status === 'PROCESSING') return;

    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    }

    setErrorMessage('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const options = getAudioRecordingOptions();
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch {
        recorder = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];
      durationRef.current = 0;
      setRecordDuration(0);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Stop audio tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        const mime = recorder.mimeType || options.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        const ext = mime.includes('ogg')
          ? 'ogg'
          : mime.includes('mp4') || mime.includes('aac')
          ? 'mp4'
          : 'webm';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `Saranya_Voice_Message_${timestamp}.${ext}`;
        const file = new File([blob], filename, {
          type: mime,
          lastModified: Date.now(),
        });

        // 5. Verify file instanceof File and file.size > 0
        if (!(file instanceof File) || file.size === 0) {
          setStatus('ERROR');
          setErrorMessage('Audio recording was empty. Please speak clearly into the microphone.');
          return;
        }

        // Store Blob/File in React state and ref
        recordedBlobRef.current = blob;
        recordedFileRef.current = file;
        setRecordedBlob(blob);
        setRecordedFile(file);

        // 6. Persist to window so recording never disappears when component continues
        if (typeof window !== 'undefined') {
          window.__savedVoiceRecording = {
            file,
            blob,
            filename,
            duration: durationRef.current,
            timestamp: Date.now(),
          };
        }

        // 12. Show short processing state: "Keeping this little piece of your voice... ❤️"
        setStatus('PROCESSING');

        const duration = durationRef.current;
        try {
          // Keep processing state visible smoothly
          await Promise.all([
            dispatchAudioEmail(file, blob, duration),
            new Promise((resolve) => setTimeout(resolve, 1400)),
          ]);
          // 13. Subtle confirmation on success
          setStatus('SENT');

          if (shouldProceedAfterProcessingRef.current) {
            setTimeout(() => {
              if (typeof onComplete === 'function') onComplete();
            }, 800);
          }
        } catch (err) {
          console.error('Voice delivery failed:', err);
          // 14. Error state: Keep actual File/Blob available
          setStatus('ERROR');
          setErrorMessage('Unable to send voice note right now. Your recording is safely saved.');
        }
      };

      recorder.start(500);
      setStatus('RECORDING');

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setRecordDuration(durationRef.current);

        if (durationRef.current >= MAX_RECORD_SECONDS) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied or unavailable:', err);
      setStatus('ERROR');
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser to record.'
          : 'Could not access microphone. Please check your audio device settings.'
      );
    }
  };

  // Stop recording properly
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      try {
        recorder.stop();
      } catch (e) {
        console.warn('Error stopping MediaRecorder:', e);
      }
    }
  };

  // Retry sending if delivery failed previously
  const handleRetrySend = async () => {
    const file = recordedFileRef.current || recordedFile;
    const blob = recordedBlobRef.current || recordedBlob;
    if (!file || !blob || file.size === 0) return;

    setStatus('PROCESSING');
    setErrorMessage('');
    try {
      await Promise.all([
        dispatchAudioEmail(file, blob, durationRef.current || recordDuration),
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ]);
      setStatus('SENT');
    } catch (err) {
      console.error('Retry send failed:', err);
      setStatus('ERROR');
      setErrorMessage('Delivery attempt failed again. You can save the voice message locally.');
    }
  };

  // 15. Fallback: Save Voice Message locally (Download audio file)
  const handleDownloadVoice = () => {
    const file = recordedFileRef.current || recordedFile;
    const blob = recordedBlobRef.current || recordedBlob;
    if (!blob) return;

    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file?.name || `Saranya_Voice_Message_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error('Audio download failed:', err);
    }
  };

  // Audio preview toggle
  const togglePreview = () => {
    const blob = recordedBlobRef.current || recordedBlob;
    if (!blob) return;

    if (isPlayingPreview && audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
      return;
    }

    try {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const url = URL.createObjectURL(blob);
      previewUrlRef.current = url;
      const audio = new Audio(url);
      audioPreviewRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.onerror = () => setIsPlayingPreview(false);
      audio.play().then(() => setIsPlayingPreview(true)).catch(() => setIsPlayingPreview(false));
    } catch (e) {
      console.warn('Audio preview error:', e);
      setIsPlayingPreview(false);
    }
  };

  // 16 & 18. Continue Journey button navigation
  const handleProceed = () => {
    if (status === 'RECORDING') {
      shouldProceedAfterProcessingRef.current = true;
      stopRecording();
      return;
    }

    if (status === 'PROCESSING') {
      // Waiting for processing to finish
      shouldProceedAfterProcessingRef.current = true;
      return;
    }

    if (typeof onComplete === 'function') {
      if (typeof window !== 'undefined' && window.soundController?.fadeToSoftAmbience) {
        window.soundController.fadeToSoftAmbience(0.045, 3.5);
      }
      onComplete();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none animate-in fade-in zoom-in-95 duration-700">
      {/* Screen-level Travelling Rainbow Border */}
      <CinematicRainbowBorder mode="screen" />
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-pink-600/15 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Main Glassmorphic Container (preserves exact dimensions & aesthetic) */}
      <div className="max-w-md w-full bg-slate-900/85 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_60px_rgba(244,63,94,0.3)] relative z-10 space-y-8 overflow-hidden">
        {/* Card-level Travelling Rainbow Border */}
        <CinematicRainbowBorder mode="card" borderRadius={40} />
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

        {/* Central Interactive Microphone Button & Status Display */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative">
            {/* Visual: Soft pulsing rose glow around mic while recording */}
            {status === 'RECORDING' && (
              <>
                <div className="absolute -inset-4 rounded-full bg-rose-500/30 animate-ping pointer-events-none"></div>
                <div className="absolute -inset-8 rounded-full bg-pink-500/20 blur-md animate-pulse pointer-events-none"></div>
              </>
            )}

            {status === 'RECORDING' ? (
              <button
                type="button"
                onClick={stopRecording}
                className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-[0_0_60px_rgba(244,63,94,0.6)] bg-rose-600 text-white animate-pulse cursor-pointer relative z-10"
                title="Stop Recording"
              >
                <Square className="w-8 h-8 fill-white" />
              </button>
            ) : status === 'PROCESSING' ? (
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-slate-800/80 border border-pink-500/40 text-pink-300 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
                <Loader2 className="w-10 h-10 animate-spin text-pink-400" />
              </div>
            ) : status === 'SENT' ? (
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            ) : status === 'ERROR' && recordedBlobRef.current ? (
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-rose-950/80 border border-rose-500/50 text-rose-300 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
                <AlertCircle className="w-10 h-10 text-rose-400" />
              </div>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-[0_0_40px_rgba(244,63,94,0.4)] bg-gradient-to-tr from-pink-600 to-rose-500 text-white hover:scale-105 hover:shadow-[0_0_50px_rgba(244,63,94,0.6)] cursor-pointer"
                title="Start Recording"
              >
                <Mic className="w-10 h-10" />
              </button>
            )}
          </div>

          <div className="mt-5 w-full">
            {/* RECORDING STATE */}
            {status === 'RECORDING' && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  {/* Tiny REC indicator */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    REC
                  </span>

                  <span className="text-rose-400 text-sm font-semibold">
                    {formatTime(recordDuration)} / 0:40
                  </span>

                  {/* Animated Waveform / Equalizer */}
                  <div className="flex items-center gap-1 h-5 px-1">
                    <span className="w-1 bg-rose-400 rounded-full animate-bounce h-3 [animation-duration:600ms]"></span>
                    <span className="w-1 bg-pink-500 rounded-full animate-bounce h-5 [animation-duration:800ms] [animation-delay:150ms]"></span>
                    <span className="w-1 bg-rose-500 rounded-full animate-bounce h-6 [animation-duration:700ms] [animation-delay:300ms]"></span>
                    <span className="w-1 bg-pink-400 rounded-full animate-bounce h-4 [animation-duration:900ms] [animation-delay:200ms]"></span>
                    <span className="w-1 bg-rose-400 rounded-full animate-bounce h-5 [animation-duration:650ms] [animation-delay:350ms]"></span>
                  </div>
                </div>

                {/* Live progress bar towards 40s */}
                <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-1000 ease-linear rounded-full"
                    style={{
                      width: `${Math.min(100, (recordDuration / MAX_RECORD_SECONDS) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* PROCESSING STATE: 12. "Keeping this little piece of your voice... ❤️" */}
            {status === 'PROCESSING' && (
              <div className="flex flex-col items-center gap-2 animate-pulse">
                <div className="flex items-center gap-2 text-pink-300 text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Keeping this little piece of your voice... ❤️</span>
                </div>
                <p className="text-slate-500 text-xs">Securing audio and delivering safely...</p>
              </div>
            )}

            {/* SENT STATE: 13. "Your voice is safely kept. ❤️" */}
            {status === 'SENT' && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-pink-300 text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Your voice is safely kept. ❤️</span>
                </div>
                <p className="text-slate-400 text-xs">
                  {recordedFile?.name
                    ? `${recordedFile.name} (${formatTime(recordDuration)})`
                    : `Recorded (${formatTime(recordDuration)})`}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-medium border border-pink-500/30 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingPreview ? 'Pause Audio' : 'Listen Preview'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadVoice}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                    title="Save audio file to your device"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Voice Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={startRecording}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    <span>Record Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* ERROR STATE: 14. "Your recording is safe here. We'll try again. ❤️" */}
            {status === 'ERROR' && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-rose-300 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>Your recording is safe here. We'll try again. ❤️</span>
                </div>
                {errorMessage && (
                  <p className="text-slate-400 text-xs max-w-xs">{errorMessage}</p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                  {recordedBlobRef.current && (
                    <>
                      <button
                        type="button"
                        onClick={togglePreview}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-medium border border-pink-500/30 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlayingPreview ? 'Pause Audio' : 'Listen Preview'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRetrySend}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 text-xs font-medium border border-rose-500/40 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Try Sending Again</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadVoice}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save Voice Message</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={startRecording}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    <span>Record Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* IDLE STATE */}
            {status === 'IDLE' && (
              <p className="text-slate-400 text-xs">
                Tap the mic to start recording (Max 40s)
              </p>
            )}
          </div>
        </div>

        {/* 16. Continue Journey Button */}
        {status === 'RECORDING' ? (
          <button
            type="button"
            onClick={stopRecording}
            className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Stop & Save Recording</span>
          </button>
        ) : status === 'PROCESSING' ? (
          <button
            type="button"
            disabled
            className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 opacity-90 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-wait"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Keeping this little piece of your voice... ❤️</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleProceed}
            className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
