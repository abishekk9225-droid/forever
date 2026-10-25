import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
  Loader2,
  Smartphone,
  EyeOff,
  Activity,
  Mail,
} from 'lucide-react';
import { sendEmail } from '../utils/emailService';
import { initPhoneDetector, detectPhoneInVideo } from '../utils/phoneDetector';

const CameraContext = createContext(null);

const DEFAULT_COOLDOWN_MS = 60000; // 60 seconds cooldown between separate email photo alerts
const CLEAR_DELAY_MS = 5000; // 5 continuous seconds phone absence required before lifting blackout overlay

export function CameraProvider({ children }) {
  const [stream, setStream] = useState(null);
  // cameraStatus: 'INITIAL' | 'REQUESTING' | 'ACTIVE' | 'DENIED' | 'UNSUPPORTED' | 'CLOSED'
  const [cameraStatus, setCameraStatus] = useState('INITIAL');
  const [errorMessage, setErrorMessage] = useState(null);

  // User consent & settings
  const [hasConsent, setHasConsent] = useState(() => {
    return localStorage.getItem('camera_presence_consent') === 'true';
  });
  const [allowPhotoAlerts, setAllowPhotoAlerts] = useState(() => {
    const saved = localStorage.getItem('camera_photo_alerts');
    return saved !== null ? saved === 'true' : true;
  });

  // Mobile phone privacy detection settings & states
  const [phoneDetectionEnabled, setPhoneDetectionEnabled] = useState(() => {
    const saved = localStorage.getItem('camera_phone_detection');
    return saved !== null ? saved === 'true' : true;
  });
  // phoneDetectorStatus: 'UNLOADED' | 'LOADING' | 'READY' | 'ERROR'
  const [phoneDetectorStatus, setPhoneDetectorStatus] = useState('UNLOADED');
  const [phoneDetectorError, setPhoneDetectorError] = useState(null);
  const [isPhoneDetected, setIsPhoneDetected] = useState(false);
  const [isPhoneOverlayActive, setIsPhoneOverlayActive] = useState(false);
  const [phoneOverlayCountdown, setPhoneOverlayCountdown] = useState(0);
  const [phoneConfidence, setPhoneConfidence] = useState(0);
  const [lastDetectedClass, setLastDetectedClass] = useState(null);

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [showDiagnosticHud, setShowDiagnosticHud] = useState(false);

  // Email alert delivery status: 'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'
  const [alertStatus, setAlertStatus] = useState('IDLE');
  const [lastAlertEvent, setLastAlertEvent] = useState(null);
  const [lastAlertTime, setLastAlertTime] = useState(null);

  const streamRef = useRef(null);
  const rootVideoRef = useRef(null);
  const lastAlertTimestampRef = useRef(0);
  const isRequestingRef = useRef(false);

  // Phone detection loop refs
  const consecutivePhoneFramesRef = useRef(0);
  const lastPhoneSeenTimestampRef = useRef(0);
  const isDetectingPhoneRef = useRef(false);
  const hasAlertFiredForCurrentEpisodeRef = useRef(false);

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('camera_presence_consent', hasConsent ? 'true' : 'false');
  }, [hasConsent]);

  useEffect(() => {
    localStorage.setItem('camera_photo_alerts', allowPhotoAlerts ? 'true' : 'false');
  }, [allowPhotoAlerts]);

  useEffect(() => {
    localStorage.setItem('camera_phone_detection', phoneDetectionEnabled ? 'true' : 'false');
  }, [phoneDetectionEnabled]);

  // Ensure rootVideoRef always connects to active stream
  useEffect(() => {
    const video = rootVideoRef.current;
    if (video && stream && stream.active) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      video.play().catch(() => {});
    }
  }, [stream]);

  // Stop camera tracks cleanly
  const stopCamera = useCallback((force = false) => {
    if (!force) {
      // Scene transition or non-forced unmount: DO NOT stop persistent tracks
      return;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (rootVideoRef.current) {
      rootVideoRef.current.srcObject = null;
    }
    setStream(null);
    setCameraStatus('CLOSED');
    setIsPhoneDetected(false);
    setIsPhoneOverlayActive(false);
    setPhoneOverlayCountdown(0);
    consecutivePhoneFramesRef.current = 0;
  }, []);

  // Request or re-use camera stream
  const requestCamera = useCallback(async (requireUserConsentCheck = true) => {
    // If stream is already active and healthy, reuse it immediately
    if (streamRef.current && streamRef.current.active) {
      const activeVideoTrack = streamRef.current.getVideoTracks().find((t) => t.readyState === 'live');
      if (activeVideoTrack) {
        setCameraStatus('ACTIVE');
        setStream(streamRef.current);
        if (rootVideoRef.current && rootVideoRef.current.srcObject !== streamRef.current) {
          rootVideoRef.current.srcObject = streamRef.current;
          rootVideoRef.current.play().catch(() => {});
        }
        return streamRef.current;
      }
    }

    if (isRequestingRef.current) return null;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Camera is not supported on this device/browser.');
      setCameraStatus('UNSUPPORTED');
      setErrorMessage('Camera is not supported on your browser or device.');
      return null;
    }

    isRequestingRef.current = true;
    setCameraStatus('REQUESTING');
    setErrorMessage(null);

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = newStream;
      setStream(newStream);
      setCameraStatus('ACTIVE');
      setHasConsent(true);

      // Connect to background root video so browser never suspends the tracks
      if (rootVideoRef.current) {
        rootVideoRef.current.srcObject = newStream;
        rootVideoRef.current.play().catch(() => {});
      }

      // Handle track endings gracefully (e.g., hardware unplugged, OS permission revoked)
      newStream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          console.warn('Camera track ended by browser/hardware.');
          streamRef.current = null;
          setStream(null);
          setCameraStatus('CLOSED');
          setIsPhoneDetected(false);
          setIsPhoneOverlayActive(false);
          setPhoneOverlayCountdown(0);
        };
      });

      return newStream;
    } catch (err) {
      console.warn('Camera permission dismissed, denied or unavailable:', err);
      setCameraStatus('DENIED');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera access was denied. You can continue reading and enjoying all scenes normally!');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device was detected on your system. You can continue without camera.');
      } else {
        setErrorMessage('Camera could not be accessed. Navigation and all scenes remain fully functional.');
      }
      return null;
    } finally {
      isRequestingRef.current = false;
    }
  }, []);

  // Show consent modal on initial entry if consent was never granted or denied
  useEffect(() => {
    if (!hasConsent && cameraStatus === 'INITIAL') {
      const timer = setTimeout(() => {
        setShowConsentModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [hasConsent, cameraStatus]);

  // Clean capture helper that captures exactly ONE frame onto off-screen canvas and sends email
  const triggerAlert = useCallback(async (eventName = 'Milestone Reached', extraDetails = {}) => {
    // 1. Consent check
    if (!allowPhotoAlerts) {
      console.log(`[CameraAlert] Photo alerts disabled by user setting. Skipping snapshot for: ${eventName}`);
      return false;
    }

    // 2. Cooldown check to prevent spam / duplicate alerts across rapid episodes
    const now = Date.now();
    const elapsed = now - lastAlertTimestampRef.current;
    if (elapsed < DEFAULT_COOLDOWN_MS) {
      const remainingSecs = Math.ceil((DEFAULT_COOLDOWN_MS - elapsed) / 1000);
      console.log(`[CameraAlert] Rate-limit cooldown active (${remainingSecs}s remaining). Skipping duplicate alert for: ${eventName}`);
      return false;
    }

    // 3. Ensure video feed is available
    const video = rootVideoRef.current;
    if (!video || !streamRef.current || !streamRef.current.active) {
      console.warn('[CameraAlert] Cannot capture snapshot: Camera stream is not active.');
      return false;
    }

    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('[CameraAlert] Root video element dimensions not ready yet for snapshot.');
      return false;
    }

    setAlertStatus('SENDING');
    lastAlertTimestampRef.current = now;

    try {
      // Offscreen canvas capture
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not acquire canvas 2D context');

      // Draw exactly one frame from the authorized laptop webcam
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.88);
      });

      if (!blob || blob.size === 0) {
        throw new Error('Canvas snapshot returned empty blob');
      }

      const formattedTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const safeEventSlug = eventName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const filename = `saranya_alert_${safeEventSlug}_${Date.now()}.jpg`;

      // Dispatch alert email using existing emailService
      await sendEmail({
        title: `📸 Privacy Alert: ${eventName} ❤️`,
        message: [
          `Event: ${eventName}`,
          `Detection Time: ${formattedTime} (IST)`,
          `Camera Resolution: ${canvas.width}x${canvas.height}`,
          `Snapshot Size: ${Math.round(blob.size / 1024)} KB`,
          extraDetails.note ? `Note: ${extraDetails.note}` : '',
          extraDetails.scene ? `Current Scene: ${extraDetails.scene}` : '',
          `Notice: Attached snapshot was captured from the authorized laptop webcam. Websites cannot take photos using external mobile phone hardware.`,
        ].filter(Boolean).join('\n'),
        imageBlob: blob,
        filename,
      });

      setAlertStatus('SUCCESS');
      setLastAlertEvent(eventName);
      setLastAlertTime(formattedTime);

      setTimeout(() => {
        setAlertStatus('IDLE');
      }, 5000);

      return true;
    } catch (err) {
      console.error('[CameraAlert] Failed to capture or send snapshot alert:', err);
      // Reset timestamp on failure so retries aren't blocked for 60s
      lastAlertTimestampRef.current = 0;
      setAlertStatus('ERROR');
      setTimeout(() => {
        setAlertStatus('IDLE');
      }, 6000);
      return false;
    }
  }, [allowPhotoAlerts]);

  // Safely attach stream to any secondary video element (e.g., inside PasscodeGate)
  const attachVideo = useCallback((videoElement) => {
    if (!videoElement || !streamRef.current) return;
    if (videoElement.srcObject !== streamRef.current) {
      videoElement.srcObject = streamRef.current;
      videoElement.play().catch(() => {});
    }
  }, []);

  // --------------------------------------------------------------------------
  // Mobile Phone Detection Engine Loop
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!phoneDetectionEnabled || cameraStatus !== 'ACTIVE' || !streamRef.current) {
      setIsPhoneDetected(false);
      consecutivePhoneFramesRef.current = 0;
      return;
    }

    let isMounted = true;
    let intervalId = null;

    // Initialize detector model
    const startDetectionLoop = async () => {
      setPhoneDetectorStatus('LOADING');
      setPhoneDetectorError(null);

      try {
        await initPhoneDetector();
        if (!isMounted) return;
        setPhoneDetectorStatus('READY');
      } catch (err) {
        if (!isMounted) return;
        console.warn('[PhoneDetection] Initialization failed:', err);
        setPhoneDetectorStatus('ERROR');
        setPhoneDetectorError(
          'On-device detector failed to load (network/WebGL limitation). All scenes remain fully accessible!'
        );
        return;
      }

      // Run inference tick every 350ms for responsive and reliable phone detection
      intervalId = setInterval(async () => {
        if (!isMounted || isDetectingPhoneRef.current) return;
        const video = rootVideoRef.current;
        if (!video || video.readyState < 2 || video.videoWidth === 0) return;

        isDetectingPhoneRef.current = true;
        try {
          const result = await detectPhoneInVideo(video, 0.48);
          if (!isMounted) return;

          if (result.topClass) {
            setLastDetectedClass(result.topClass);
          }

          if (result.detected) {
            consecutivePhoneFramesRef.current += 1;
            lastPhoneSeenTimestampRef.current = Date.now();
            setPhoneConfidence(result.confidence);

            // Require 2 consecutive frames to prevent single-frame false positives
            if (consecutivePhoneFramesRef.current >= 2) {
              // 1. Immediately activate pitch-black privacy blackout overlay
              setIsPhoneDetected(true);
              setIsPhoneOverlayActive(true);

              // 2. Schedule email snapshot delivery in background without delaying blackout
              if (!hasAlertFiredForCurrentEpisodeRef.current) {
                hasAlertFiredForCurrentEpisodeRef.current = true;
                triggerAlert('Mobile Phone In View Detected', {
                  note: `Mobile device visible in laptop webcam feed (${result.confidence}% confidence). Screen concealed behind highest-priority blackout overlay.`,
                  scene: 'Protected Content',
                }).catch((alertErr) => {
                  console.warn('[PhoneDetection] Alert email dispatch caught error:', alertErr);
                });
              }
            }
          } else {
            consecutivePhoneFramesRef.current = 0;
            setIsPhoneDetected(false);

            // If blackout overlay is active, enforce 5-second absence before lifting
            if (lastPhoneSeenTimestampRef.current > 0) {
              const elapsed = Date.now() - lastPhoneSeenTimestampRef.current;
              if (elapsed >= CLEAR_DELAY_MS) {
                // Device has been absent for 5 continuous seconds: restore screen cleanly
                setIsPhoneOverlayActive(false);
                setPhoneOverlayCountdown(0);
                lastPhoneSeenTimestampRef.current = 0;
                hasAlertFiredForCurrentEpisodeRef.current = false;
              } else {
                const remaining = Math.max(1, Math.ceil((CLEAR_DELAY_MS - elapsed) / 1000));
                setPhoneOverlayCountdown(remaining);
              }
            }
          }
        } catch (inferenceErr) {
          console.warn('[PhoneDetection] Inference error:', inferenceErr);
        } finally {
          isDetectingPhoneRef.current = false;
        }
      }, 350);
    };

    startDetectionLoop();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [phoneDetectionEnabled, cameraStatus, triggerAlert]);

  // Genuine snapshot email test (tests real snapshot capture and EmailJS delivery without simulating phone detection)
  const testEmailDeliveryAlert = useCallback(async () => {
    return await triggerAlert('Diagnostic Test Alert', {
      note: 'Admin verified email delivery and laptop webcam snapshot functionality.',
      scene: 'Diagnostic Panel',
    });
  }, [triggerAlert]);

  const dismissPhoneOverlay = useCallback(() => {
    setIsPhoneDetected(false);
    setIsPhoneOverlayActive(false);
    setPhoneOverlayCountdown(0);
    lastPhoneSeenTimestampRef.current = 0;
    consecutivePhoneFramesRef.current = 0;
    hasAlertFiredForCurrentEpisodeRef.current = false;
  }, []);

  const handleConsentAccept = async () => {
    setShowConsentModal(false);
    setHasConsent(true);
    await requestCamera(false);
  };

  const handleConsentDecline = () => {
    setShowConsentModal(false);
    setHasConsent(false);
    setCameraStatus('DENIED');
  };

  // Diagnostic mode summary values
  const diagnosticMode = {
    camera: cameraStatus === 'ACTIVE' ? 'ON' : 'OFF',
    model:
      phoneDetectorStatus === 'READY'
        ? 'READY'
        : phoneDetectorStatus === 'LOADING'
        ? 'LOADING'
        : phoneDetectorStatus === 'ERROR'
        ? 'FAILED'
        : 'IDLE',
    detection: isPhoneDetected
      ? 'PHONE DETECTED'
      : phoneDetectionEnabled && phoneDetectorStatus === 'READY' && cameraStatus === 'ACTIVE'
      ? 'RUNNING'
      : 'IDLE',
    blackout: isPhoneOverlayActive ? 'ACTIVE' : 'INACTIVE',
    email:
      alertStatus === 'SENDING'
        ? 'SENDING'
        : alertStatus === 'SUCCESS'
        ? 'SUCCESS'
        : alertStatus === 'ERROR'
        ? 'FAILED'
        : 'IDLE',
    confidence: phoneConfidence,
    countdown: phoneOverlayCountdown,
    lastDetectedClass,
    lastAlertTime,
  };

  return (
    <CameraContext.Provider
      value={{
        stream,
        streamRef,
        cameraStatus,
        setCameraStatus,
        errorMessage,
        isCameraActive: cameraStatus === 'ACTIVE',
        hasConsent,
        allowPhotoAlerts,
        setAllowPhotoAlerts,
        phoneDetectionEnabled,
        setPhoneDetectionEnabled,
        phoneDetectorStatus,
        phoneDetectorError,
        isPhoneDetected,
        isPhoneOverlayActive,
        phoneOverlayCountdown,
        phoneConfidence,
        lastDetectedClass,
        dismissPhoneOverlay,
        testEmailDeliveryAlert,
        alertStatus,
        lastAlertEvent,
        lastAlertTime,
        requestCamera,
        stopCamera,
        triggerAlert,
        attachVideo,
        diagnosticMode,
        showDiagnosticHud,
        setShowDiagnosticHud,
        isPersistent: true,
      }}
    >
      {/* 1. In-viewport background video element that keeps camera tracks and WebGL frames active across scenes */}
      <video
        ref={rootVideoRef}
        playsInline
        muted
        autoPlay
        aria-hidden="true"
        width={320}
        height={240}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '240px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      />

      {/* 2. Clear Camera Presence & Photo Alert Notice (Transparency & Consent) */}
      {showConsentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-slate-950/95 border border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.3)] text-white text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.5)]">
              <Camera className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                Camera Presence & Privacy Protection ❤️
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed font-sans">
                Our romantic journey uses your front camera for real-time presence detection across each scene.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-rose-400/20 text-left space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>100% On-Device Privacy:</strong> Live video processing runs locally inside your browser; no video frames are continuously uploaded.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Mobile Privacy Monitoring:</strong> When an external mobile phone is held in front of the camera, the screen immediately blacks out to protect your private journey.
                </span>
              </div>
            </div>

            {/* Checkbox settings */}
            <div className="flex flex-col gap-2 px-2 pt-1 text-xs text-slate-300 text-left">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowPhotoAlerts}
                  onChange={(e) => setAllowPhotoAlerts(e.target.checked)}
                  className="rounded border-rose-400/40 text-rose-500 focus:ring-rose-500 w-4 h-4 bg-slate-900"
                />
                <span>Allow milestone & privacy email photo alerts</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={phoneDetectionEnabled}
                  onChange={(e) => setPhoneDetectionEnabled(e.target.checked)}
                  className="rounded border-rose-400/40 text-rose-500 focus:ring-rose-500 w-4 h-4 bg-slate-900"
                />
                <span>Enable mobile phone privacy monitoring</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleConsentAccept}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-medium text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(244,63,94,0.5)] transition active:scale-95 cursor-pointer"
              >
                Allow & Enter Journey ❤️
              </button>
              <button
                type="button"
                onClick={handleConsentDecline}
                className="py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-slate-300 hover:text-white font-medium text-xs transition cursor-pointer"
              >
                Continue Without Camera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Camera Active Indicator & Settings Pill */}
      {cameraStatus === 'ACTIVE' && (
        <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-40 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowSettingsPopover((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-rose-500/40 text-rose-200 text-xs font-mono shadow-[0_0_15px_rgba(244,63,94,0.3)] backdrop-blur-md transition active:scale-95 cursor-pointer"
            title="Camera presence active · Tap for settings & diagnostics"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
            <Camera className="w-3.5 h-3.5 text-rose-300" />
            <span className="hidden sm:inline">Presence Active</span>
            {phoneDetectionEnabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Phone detection monitoring" />
            )}
          </button>

          {/* Quick Settings Popover with Real Diagnostics */}
          {showSettingsPopover && (
            <div className="absolute top-10 left-0 w-80 p-4 rounded-2xl bg-slate-950/95 border border-rose-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white text-xs space-y-3 animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-semibold text-rose-300 font-serif text-sm">Privacy & Camera Controls</span>
                <button
                  type="button"
                  onClick={() => setShowSettingsPopover(false)}
                  className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Camera Stream Toggle */}
              <div className="flex items-center justify-between">
                <span>Camera Stream:</span>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera(true);
                    setShowSettingsPopover(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 hover:text-white text-[11px] transition cursor-pointer"
                >
                  Turn Off
                </button>
              </div>

              {/* Email Alerts Toggle */}
              <div className="flex items-center justify-between">
                <span>Email Photo Alerts:</span>
                <button
                  type="button"
                  onClick={() => setAllowPhotoAlerts((prev) => !prev)}
                  className={`px-2 py-1 rounded-lg border text-[11px] transition cursor-pointer ${
                    allowPhotoAlerts
                      ? 'bg-rose-950/70 border-rose-500/40 text-rose-200'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {allowPhotoAlerts ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Mobile Phone Detection Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-rose-300" />
                  <span>Phone Detection:</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhoneDetectionEnabled((prev) => !prev)}
                  className={`px-2 py-1 rounded-lg border text-[11px] transition cursor-pointer ${
                    phoneDetectionEnabled
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {phoneDetectionEnabled ? 'Monitoring' : 'Disabled'}
                </button>
              </div>

              {/* Dedicated Diagnostic Mode Section */}
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-rose-200">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-rose-400" /> Safe Diagnostic Mode
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDiagnosticHud((prev) => !prev)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
                  >
                    {showDiagnosticHud ? 'Hide HUD' : 'Pin HUD'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <div className="p-1 rounded bg-black/40 flex items-center justify-between">
                    <span className="text-slate-400">Camera:</span>
                    <span className={diagnosticMode.camera === 'ON' ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {diagnosticMode.camera}
                    </span>
                  </div>

                  <div className="p-1 rounded bg-black/40 flex items-center justify-between">
                    <span className="text-slate-400">Model:</span>
                    <span
                      className={
                        diagnosticMode.model === 'READY'
                          ? 'text-emerald-400 font-bold'
                          : diagnosticMode.model === 'LOADING'
                          ? 'text-amber-400 animate-pulse font-bold'
                          : diagnosticMode.model === 'FAILED'
                          ? 'text-red-400 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {diagnosticMode.model}
                    </span>
                  </div>

                  <div className="p-1 rounded bg-black/40 flex items-center justify-between col-span-2">
                    <span className="text-slate-400">Detection:</span>
                    <span
                      className={
                        diagnosticMode.detection === 'PHONE DETECTED'
                          ? 'text-red-400 font-bold animate-pulse'
                          : diagnosticMode.detection === 'RUNNING'
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {diagnosticMode.detection}
                      {phoneConfidence > 0 && ` (${phoneConfidence}%)`}
                    </span>
                  </div>

                  <div className="p-1 rounded bg-black/40 flex items-center justify-between col-span-2">
                    <span className="text-slate-400">Privacy Blackout:</span>
                    <span
                      className={
                        diagnosticMode.blackout === 'ACTIVE'
                          ? 'text-red-400 font-bold animate-pulse'
                          : 'text-slate-400'
                      }
                    >
                      {diagnosticMode.blackout}
                      {phoneOverlayCountdown > 0 && ` (${phoneOverlayCountdown}s)`}
                    </span>
                  </div>

                  <div className="p-1 rounded bg-black/40 flex items-center justify-between col-span-2">
                    <span className="text-slate-400">Email:</span>
                    <span
                      className={
                        diagnosticMode.email === 'SUCCESS'
                          ? 'text-emerald-400 font-bold'
                          : diagnosticMode.email === 'SENDING'
                          ? 'text-amber-400 font-bold animate-pulse'
                          : diagnosticMode.email === 'FAILED'
                          ? 'text-red-400 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {diagnosticMode.email}
                    </span>
                  </div>
                </div>

                {phoneDetectorError && (
                  <div className="text-[10px] text-red-300 leading-tight p-1.5 rounded-lg bg-red-950/50 border border-red-500/30">
                    {phoneDetectorError}
                  </div>
                )}

                {/* Honest verification snapshot test button */}
                <button
                  type="button"
                  onClick={testEmailDeliveryAlert}
                  className="w-full mt-1 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-[11px] font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Test Laptop Webcam Snapshot Email</span>
                </button>
              </div>

              {/* Technical Limitations Notice */}
              <div className="pt-1 border-t border-white/10 text-[9px] text-slate-500 leading-tight">
                * Laptop webcam detection runs locally. Websites cannot block external photography or operating-system screenshots.
              </div>

              {lastAlertEvent && (
                <div className="pt-1 text-[10px] text-slate-400 border-t border-white/10">
                  Last alert: <span className="text-rose-300">{lastAlertEvent}</span>
                  {lastAlertTime && <div>{lastAlertTime}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Optional Live Diagnostic HUD (Floating in top-right when pinned) */}
      {showDiagnosticHud && cameraStatus === 'ACTIVE' && (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 p-3 rounded-2xl bg-slate-950/90 border border-rose-500/40 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl text-white font-mono text-[10px] space-y-1.5 w-52 pointer-events-auto">
          <div className="flex items-center justify-between pb-1 border-b border-white/10 font-bold text-rose-300 font-sans">
            <span>Diagnostics HUD</span>
            <button
              type="button"
              onClick={() => setShowDiagnosticHud(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Camera:</span>
            <span className="text-emerald-400 font-bold">{diagnosticMode.camera}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Model:</span>
            <span className={diagnosticMode.model === 'READY' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {diagnosticMode.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Detection:</span>
            <span className={diagnosticMode.detection === 'PHONE DETECTED' ? 'text-red-400 font-bold animate-pulse' : 'text-emerald-400 font-bold'}>
              {diagnosticMode.detection}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Blackout:</span>
            <span className={diagnosticMode.blackout === 'ACTIVE' ? 'text-red-400 font-bold' : 'text-slate-400'}>
              {diagnosticMode.blackout}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Email:</span>
            <span className={diagnosticMode.email === 'SUCCESS' ? 'text-emerald-400 font-bold' : diagnosticMode.email === 'SENDING' ? 'text-amber-400' : 'text-slate-400'}>
              {diagnosticMode.email}
            </span>
          </div>
        </div>
      )}

      {/* 5. Alert Status Toast (Discreet Notification of Photo Alert Outcome) */}
      {alertStatus === 'SENDING' && !showDiagnosticHud && (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 border border-rose-500/40 text-rose-200 text-xs font-mono shadow-[0_0_15px_rgba(244,63,94,0.3)] backdrop-blur-md animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
            <span>Sending memory snapshot...</span>
          </div>
        </div>
      )}

      {alertStatus === 'SUCCESS' && !showDiagnosticHud && (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 pointer-events-none animate-in fade-in duration-300">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Keepsake snapshot sent ❤️</span>
          </div>
        </div>
      )}

      {alertStatus === 'ERROR' && !showDiagnosticHud && (
        <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 pointer-events-none animate-in fade-in duration-300">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-mono shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-md">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Snapshot delivery failed (cooldown/network)</span>
          </div>
        </div>
      )}

      {children}
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  return context || null;
}
