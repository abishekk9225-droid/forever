import React, { useState, useEffect } from 'react';
import { Lock, Shield, EyeOff, AlertTriangle, Activity } from 'lucide-react';
import { useCamera } from '../context/CameraContext';

/**
 * Mobile Privacy and Screen Protection Component
 * 
 * - Detects app switching and hidden tab state via the Page Visibility API & pagehide.
 * - Immediately renders a full-screen opaque privacy cover to protect photos, messages,
 *   passcode entries, and games from appearing in mobile app-switcher previews.
 * - When an external mobile phone is detected in the laptop webcam view, immediately
 *   renders an emergency pitch-black overlay hiding all content until the phone is absent.
 * - Highest-priority z-[99999999] overlay covers every scene, dialogue, photo, and game.
 * - Smoothly lifts the cover when the phone has been absent for 5 continuous seconds.
 */
export default function PrivacyCover() {
  const [isCoverVisible, setIsCoverVisible] = useState(false);
  const cameraContext = useCamera();

  const isPhoneOverlayActive = cameraContext?.isPhoneOverlayActive || false;
  const phoneOverlayCountdown = cameraContext?.phoneOverlayCountdown || 0;
  const phoneConfidence = cameraContext?.phoneConfidence || 0;
  const lastDetectedClass = cameraContext?.lastDetectedClass || 'cell phone';
  const dismissPhoneOverlay = cameraContext?.dismissPhoneOverlay;
  const diagnosticMode = cameraContext?.diagnosticMode || {
    camera: 'ON',
    model: 'READY',
    detection: 'PHONE DETECTED',
    blackout: 'ACTIVE',
    email: 'IDLE',
  };

  useEffect(() => {
    // 1. Page Visibility API Detection
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsCoverVisible(true);
      } else if (document.visibilityState === 'visible') {
        // Small delay to ensure browser rendering has stabilized after app switcher
        setTimeout(() => {
          setIsCoverVisible(false);
        }, 150);
      }
    };

    const handlePageHide = () => {
      setIsCoverVisible(true);
    };

    const handlePageShow = () => {
      setTimeout(() => {
        setIsCoverVisible(false);
      }, 150);
    };

    // Mobile blur detection (app-switcher gesture)
    const handleWindowBlur = () => {
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        setIsCoverVisible(true);
      }
    };

    const handleWindowFocus = () => {
      setTimeout(() => {
        setIsCoverVisible(false);
      }, 150);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // 2. Prevent accidental context menus on non-input elements
    const handleContextMenu = (e) => {
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return; // Allow standard text editing operations in inputs
      }
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // 1. Highest-Priority Emergency Pitch-Black Overlay
  if (isPhoneOverlayActive) {
    return (
      <div
        className="fixed inset-0 z-[99999999] bg-black flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none overflow-hidden animate-in fade-in duration-100"
        aria-label="Mobile Phone Detected - Privacy Blackout Active"
      >
        <div className="relative z-10 max-w-md w-full p-6 sm:p-8 rounded-3xl bg-neutral-950/98 border border-red-500/60 shadow-[0_0_90px_rgba(239,68,68,0.4)] backdrop-blur-3xl flex flex-col items-center space-y-4 text-white">
          {/* Animated Warning Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_35px_rgba(239,68,68,0.5)]">
            <EyeOff className="w-8 h-8 animate-pulse text-red-400" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/90 border border-red-500/50 text-red-300 font-mono text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>External Device Detected ({phoneConfidence ? `${phoneConfidence}%` : 'Confirmed'})</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              Privacy Blackout Active 🛡️
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              A mobile device was detected in your laptop webcam view. All photos, messages, dialogues, and games are immediately concealed.
            </p>
          </div>

          {/* Restoration Countdown */}
          <div className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-neutral-300 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Restoration Timer:</span>
              <span className="text-red-400 font-bold">
                {phoneOverlayCountdown > 0 ? `${phoneOverlayCountdown}s remaining` : 'Waiting for device to clear...'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 text-left leading-normal">
              Screen automatically restores once the mobile device has been absent from camera view for 5 continuous seconds.
            </p>
          </div>

          {/* Live Diagnostic Status Badges */}
          <div className="w-full p-2.5 rounded-2xl bg-black/60 border border-red-500/30 text-[10px] font-mono grid grid-cols-2 gap-1.5">
            <div className="flex justify-between px-2 py-1 rounded bg-white/[0.03]">
              <span className="text-neutral-500">Camera:</span>
              <span className="text-emerald-400 font-bold">{diagnosticMode.camera}</span>
            </div>
            <div className="flex justify-between px-2 py-1 rounded bg-white/[0.03]">
              <span className="text-neutral-500">Model:</span>
              <span className="text-emerald-400 font-bold">{diagnosticMode.model}</span>
            </div>
            <div className="flex justify-between px-2 py-1 rounded bg-white/[0.03]">
              <span className="text-neutral-500">Detection:</span>
              <span className="text-red-400 font-bold animate-pulse">{diagnosticMode.detection}</span>
            </div>
            <div className="flex justify-between px-2 py-1 rounded bg-white/[0.03]">
              <span className="text-neutral-500">Blackout:</span>
              <span className="text-red-400 font-bold">{diagnosticMode.blackout}</span>
            </div>
            <div className="flex justify-between px-2 py-1 rounded bg-white/[0.03] col-span-2">
              <span className="text-neutral-500">Alert Email:</span>
              <span className={diagnosticMode.email === 'SUCCESS' ? 'text-emerald-400 font-bold' : diagnosticMode.email === 'SENDING' ? 'text-amber-400 animate-pulse font-bold' : 'text-neutral-300'}>
                {diagnosticMode.email === 'SUCCESS' ? 'Sent (Webcam Snapshot Attached)' : diagnosticMode.email}
              </span>
            </div>
          </div>

          {/* Technical Disclosure Notice */}
          <p className="text-[10px] text-neutral-500 leading-normal max-w-xs">
            * Snapshot alert sent to admin was captured from your authorized laptop webcam. Websites cannot take photos using external mobile phones, nor prevent external photography or operating-system screenshots.
          </p>

          {/* Manual dismiss button for emergency override */}
          {dismissPhoneOverlay && (
            <button
              type="button"
              onClick={dismissPhoneOverlay}
              className="py-2 px-5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-neutral-300 hover:text-white text-xs font-medium transition cursor-pointer"
            >
              Dismiss Blackout Overlay
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Tab/App-Switcher Privacy Cover
  if (!isCoverVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] bg-[#030712] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden animate-in fade-in duration-100"
      aria-label="Privacy Protected Screen"
    >
      {/* Background ambient rose glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.12),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-sm w-full p-8 rounded-3xl bg-slate-950/95 border border-rose-500/35 shadow-[0_0_60px_rgba(244,63,94,0.25)] backdrop-blur-3xl flex flex-col items-center space-y-4">
        {/* Pulsing Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.4)]">
          <Lock className="w-8 h-8 text-rose-300 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Saranya's Private Realm 💖
          </h2>
          <p className="text-xs text-rose-200/80 leading-relaxed font-sans">
            Our private memories, messages, and photos are temporarily concealed while you are away.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <Shield className="w-3.5 h-3.5 text-rose-400" />
          <span>Screen Protection Active</span>
        </div>
      </div>
    </div>
  );
}
