import React, { useState, useEffect } from 'react';
import { Lock, Shield, Sparkles, Smartphone, EyeOff, AlertTriangle } from 'lucide-react';
import { useCamera } from '../context/CameraContext';

/**
 * Mobile Privacy and Screen Protection Component
 * 
 * - Detects app switching and hidden tab state via the Page Visibility API & pagehide.
 * - Immediately renders a full-screen opaque privacy cover to protect photos, messages,
 *   passcode entries, and games from appearing in mobile app-switcher previews.
 * - When an external mobile phone is detected in the laptop webcam view, immediately
 *   renders an emergency pitch-black overlay hiding all content until the phone is absent.
 * - Smoothly lifts the cover when the user returns or the device is removed (after 5s clear period).
 * - Prevents accidental context menu and image dragging on sensitive visuals.
 */
export default function PrivacyCover() {
  const [isCoverVisible, setIsCoverVisible] = useState(false);
  const cameraContext = useCamera();

  const isPhoneOverlayActive = cameraContext?.isPhoneOverlayActive || false;
  const phoneOverlayCountdown = cameraContext?.phoneOverlayCountdown || 0;
  const phoneConfidence = cameraContext?.phoneConfidence || 0;
  const dismissPhoneOverlay = cameraContext?.dismissPhoneOverlay;

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

  // 1. Emergency Phone Detection Pitch-Black Overlay
  if (isPhoneOverlayActive) {
    return (
      <div
        className="fixed inset-0 z-[9999999] bg-black flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden animate-in fade-in duration-150"
        aria-label="Mobile Phone Detected - Privacy Blackout Active"
      >
        <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-neutral-950/95 border border-red-500/50 shadow-[0_0_80px_rgba(239,68,68,0.35)] backdrop-blur-3xl flex flex-col items-center space-y-4 text-white">
          {/* Animated Warning Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_35px_rgba(239,68,68,0.5)]">
            <EyeOff className="w-8 h-8 animate-pulse text-red-400" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 font-mono text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>External Device Detected ({phoneConfidence ? `${phoneConfidence}%` : 'Confirmed'})</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              Privacy Blackout Active 🛡️
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              An external mobile phone or camera was detected in your laptop webcam view. All photos, romantic messages, and game scenes are concealed.
            </p>
          </div>

          {/* Countdown & Status */}
          <div className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-neutral-300 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Restoration Timer:</span>
              <span className="text-red-400 font-bold">
                {phoneOverlayCountdown > 0 ? `${phoneOverlayCountdown}s remaining` : 'Waiting for device to clear...'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 text-left leading-normal">
              Screen automatically restores once the mobile device is removed from camera view for 5 seconds.
            </p>
          </div>

          {/* Technical Disclosure Notice */}
          <p className="text-[10px] text-neutral-500 leading-normal max-w-xs">
            * Snapshot alert sent to admin was captured by your laptop webcam. Websites cannot take photos using external mobile phones.
          </p>

          {/* Manual dismiss button in case of false positive */}
          {dismissPhoneOverlay && (
            <button
              type="button"
              onClick={dismissPhoneOverlay}
              className="py-2 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-neutral-300 hover:text-white text-xs font-medium transition cursor-pointer"
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
