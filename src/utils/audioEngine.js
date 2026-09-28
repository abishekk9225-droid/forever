// ============================================================================
// UNIFIED CINEMATIC AUDIO & HEARTBEAT ENGINE (Web Audio API)
// Provides studio-grade audio mixing, Web Audio GainNodes, glitch-free ramps,
// dynamic ducking (Priority 1: Heartbeat, Priority 2: Music), master compression,
// and single-instance lifetime management.
// ============================================================================

class UnifiedAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.masterCompressor = null;
    this.heartbeatGain = null;
    this.heartbeatFilter = null;
    this.musicGain = null;

    // Heartbeat state
    this.currentBPM = 54;
    this.targetBPM = 54;
    this.currentVolume = 0.24; // Starting level within suggested 0.20 - 0.30
    this.targetVolume = 0.24;
    this.isMuted = false;
    this.isPaused = false;
    this.silenceUntil = 0;
    this.nextBeatTime = 0;
    this.schedulerTimer = null;

    // Music state
    this.currentTrack = 'intro'; // 'intro' | 'abi1' | 'celebration'
    this.isPlayingMusic = false;
    this.baseMusicVolume = 0.09; // Starting intro level within suggested 0.08 - 0.12
    this.tracks = {};
    this.listeners = new Set();
    this.beatListeners = new Set();
    this.isInitialized = false;

    // Bindings
    this.scheduleLoop = this.scheduleLoop.bind(this);
    this.handleUserInteraction = this.handleUserInteraction.bind(this);
  }

  init() {
    if (this.isInitialized && this.audioCtx) return;

    try {
      const AudioCtxClass = typeof window !== 'undefined'
        ? (window.AudioContext || window.webkitAudioContext)
        : null;

      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      const now = this.audioCtx.currentTime;

      // 1. Master Dynamics Compressor (Prevents any clipping / distortion at climax)
      if (!this.masterCompressor) {
        this.masterCompressor = this.audioCtx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-6, now);
        this.masterCompressor.knee.setValueAtTime(12, now);
        this.masterCompressor.ratio.setValueAtTime(12, now);
        this.masterCompressor.attack.setValueAtTime(0.003, now);
        this.masterCompressor.release.setValueAtTime(0.25, now);
        this.masterCompressor.connect(this.audioCtx.destination);
      }

      // 2. Heartbeat Gain & Lowpass Resonant Filter
      if (!this.heartbeatGain) {
        this.heartbeatGain = this.audioCtx.createGain();
        this.heartbeatGain.gain.setValueAtTime(this.targetVolume, now);
        this.heartbeatGain.connect(this.masterCompressor);

        this.heartbeatFilter = this.audioCtx.createBiquadFilter();
        this.heartbeatFilter.type = 'lowpass';
        this.heartbeatFilter.frequency.setValueAtTime(180, now);
        this.heartbeatFilter.Q.setValueAtTime(2.0, now);
        this.heartbeatFilter.connect(this.heartbeatGain);
      }

      // 3. Music Master GainNode
      if (!this.musicGain) {
        this.musicGain = this.audioCtx.createGain();
        this.musicGain.gain.setValueAtTime(this.baseMusicVolume, now);
        this.musicGain.connect(this.masterCompressor);
      }

      // 4. Initialize Single-Instance HTML Audio Elements for each track
      this.initTrack('intro', '/bgm-intro.mp3');
      this.initTrack('abi1', '/abi.1.mp3');
      this.initTrack('celebration', '/bgm.mp3');
      this.initTrack('ka', '/ka.mpe');

      this.nextBeatTime = now + 0.1;

      // 5. Start Heartbeat Scheduler Loop (35ms interval)
      if (!this.schedulerTimer) {
        this.schedulerTimer = setInterval(this.scheduleLoop, 35);
      }

      this.isInitialized = true;
    } catch (e) {
      console.warn('UnifiedAudioEngine initialization deferred:', e);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.handleUserInteraction, { passive: true });
      window.addEventListener('touchstart', this.handleUserInteraction, { passive: true });
      window.addEventListener('keydown', this.handleUserInteraction, { passive: true });
    }
  }

  initTrack(id, src) {
    if (this.tracks[id] || typeof window === 'undefined') return;

    try {
      const candidates = id === 'ka' ? ['/ka.mpe', '/ka.mp3', '/ka.m4a', '/bgm.mp3'] : [src];
      let currentCandidateIdx = 0;
      const audio = new Audio(candidates[0]);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 1.0; // Volume is controlled exclusively via Web Audio GainNode

      // Gracefully try candidate extensions if initial file fails to load
      audio.addEventListener('error', () => {
        if (currentCandidateIdx < candidates.length - 1) {
          currentCandidateIdx++;
          audio.src = candidates[currentCandidateIdx];
        }
      });

      let trackGain = null;
      let sourceNode = null;

      if (this.audioCtx) {
        try {
          trackGain = this.audioCtx.createGain();
          trackGain.gain.setValueAtTime(id === this.currentTrack ? 1.0 : 0.0001, this.audioCtx.currentTime);
          trackGain.connect(this.musicGain);

          sourceNode = this.audioCtx.createMediaElementSource(audio);
          sourceNode.connect(trackGain);
        } catch (err) {
          console.warn(`Web Audio routing for track "${id}" fell back to direct audio:`, err);
        }
      }

      this.tracks[id] = {
        element: audio,
        trackGain,
        sourceNode,
        src,
      };
    } catch (e) {
      console.warn(`Failed to initialize track ${id}:`, e);
    }
  }

  handleUserInteraction() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    // Auto-start intro on first interaction if requested
    if (!this.isPlayingMusic && this.currentTrack === 'intro') {
      this.playIntroTrack();
    }
  }

  // ==========================================================================
  // MUSIC CONTROLLER
  // ==========================================================================

  playIntroTrack() {
    this.init();
    this.resumeContext();

    if (this.currentTrack === 'intro' && this.isPlayingMusic) {
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    // Smoothly fade out any other playing track
    ['abi1', 'celebration'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
          setTimeout(() => {
            other.element.pause();
            other.element.currentTime = 0;
          }, 1250);
        } else {
          other.element.pause();
          other.element.currentTime = 0;
        }
      }
    });

    const intro = this.tracks['intro'];
    if (intro && intro.element) {
      this.currentTrack = 'intro';

      if (intro.trackGain && this.audioCtx) {
        intro.trackGain.gain.cancelScheduledValues(now);
        intro.trackGain.gain.setValueAtTime(0.0001, now);
        intro.trackGain.gain.linearRampToValueAtTime(1.0, now + 1.5);
      }

      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value || 0.0001, now);
        // Soft starting level: 0.09 (between suggested 0.08 - 0.12)
        this.musicGain.gain.linearRampToValueAtTime(0.09, now + 2.0);
      }

      intro.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('Intro playback prevented by browser autoplay policy:', e);
      });
    }
  }

  // Requirement 4: abi.1 starts ONLY when Abishek's typing scene is reached
  // Ramp: 0.05 -> 0.08 -> 0.12 -> 0.15 -> maintain
  playAbi1Track() {
    this.init();
    this.resumeContext();

    if (this.currentTrack === 'abi1' && this.isPlayingMusic) {
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    // Smoothly fade out intro and celebration
    ['intro', 'celebration'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
          setTimeout(() => {
            other.element.pause();
            other.element.currentTime = 0;
          }, 1250);
        } else {
          other.element.pause();
          other.element.currentTime = 0;
        }
      }
    });

    const abi1 = this.tracks['abi1'];
    if (abi1 && abi1.element) {
      this.currentTrack = 'abi1';

      if (abi1.trackGain && this.audioCtx) {
        abi1.trackGain.gain.cancelScheduledValues(now);
        abi1.trackGain.gain.setValueAtTime(1.0, now);
      }

      // Smooth volume ramp: 0.05 -> 0.08 -> 0.12 -> 0.15 -> maintain
      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(0.05, now);
        this.musicGain.gain.linearRampToValueAtTime(0.08, now + 1.5);
        this.musicGain.gain.linearRampToValueAtTime(0.12, now + 3.2);
        this.musicGain.gain.linearRampToValueAtTime(0.15, now + 5.0);
      }

      abi1.element.currentTime = 0;
      abi1.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('abi.1 playback error:', e);
      });
    }
  }

  playCelebrationTrack(startTime = 0) {
    this.init();
    this.resumeContext();

    if (this.currentTrack === 'celebration' && this.isPlayingMusic && startTime === 0) {
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    ['intro', 'abi1'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
          setTimeout(() => {
            other.element.pause();
            other.element.currentTime = 0;
          }, 1100);
        } else {
          other.element.pause();
          other.element.currentTime = 0;
        }
      }
    });

    const celebration = this.tracks['celebration'];
    if (celebration && celebration.element) {
      this.currentTrack = 'celebration';

      if (celebration.trackGain && this.audioCtx) {
        celebration.trackGain.gain.cancelScheduledValues(now);
        celebration.trackGain.gain.setValueAtTime(1.0, now);
      }

      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        // Controlled volume for celebration music so heartbeat remains audible
        this.musicGain.gain.setValueAtTime(0.16, now);
      }

      if (startTime > 0) {
        celebration.element.currentTime = startTime;
      }

      celebration.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('Celebration playback error:', e);
      });
    }
  }

  // Play ka track for the emotional waiting scene ("100 ஜென்மம் காத்திருப்பேன்...")
  playKaTrack() {
    this.init();
    this.resumeContext();

    if (this.currentTrack === 'ka' && this.isPlayingMusic) {
      return;
    }

    const now = this.audioCtx ? this.audioCtx.currentTime : 0;

    // Smoothly fade out any currently playing track over 2 seconds
    ['intro', 'abi1', 'celebration'].forEach((otherId) => {
      const other = this.tracks[otherId];
      if (other && other.element && !other.element.paused) {
        if (other.trackGain && this.audioCtx) {
          other.trackGain.gain.cancelScheduledValues(now);
          other.trackGain.gain.setValueAtTime(other.trackGain.gain.value, now);
          other.trackGain.gain.linearRampToValueAtTime(0.0001, now + 2.0);
          setTimeout(() => {
            other.element.pause();
          }, 2050);
        } else {
          other.element.pause();
        }
      }
    });

    const ka = this.tracks['ka'];
    if (ka && ka.element) {
      this.currentTrack = 'ka';

      if (ka.trackGain && this.audioCtx) {
        ka.trackGain.gain.cancelScheduledValues(now);
        ka.trackGain.gain.setValueAtTime(0.0001, now);
        ka.trackGain.gain.linearRampToValueAtTime(1.0, now + 2.5);
      }

      if (this.musicGain && this.audioCtx) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(0.04, now);
        this.musicGain.gain.linearRampToValueAtTime(0.16, now + 3.0);
      }

      ka.element.currentTime = 0;
      ka.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch((e) => {
        console.warn('ka track playback notice:', e);
      });
    }
  }

  // Requirement 3: After voice recording scene is completed, DO NOT stop audio.
  // Smoothly reduce current music volume to a soft background ambience level (~0.045).
  fadeToSoftAmbience(targetGain = 0.045, durationSec = 3.5) {
    if (!this.audioCtx || !this.musicGain) return;

    const now = this.audioCtx.currentTime;
    const currentGain = this.musicGain.gain.value;

    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(currentGain, now);
    this.musicGain.gain.linearRampToValueAtTime(targetGain, now + durationSec);
  }

  // General smooth music fade method
  fadeMusic(targetGain, durationSec = 1.5) {
    if (!this.audioCtx || !this.musicGain) return;

    const now = this.audioCtx.currentTime;
    const currentGain = this.musicGain.gain.value;

    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(currentGain, now);
    this.musicGain.gain.linearRampToValueAtTime(targetGain, now + durationSec);
  }

  toggleSound() {
    const active = this.tracks[this.currentTrack];
    if (!active || !active.element) return;

    if (this.isPlayingMusic) {
      if (this.audioCtx && this.musicGain) {
        const now = this.audioCtx.currentTime;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
        this.musicGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
        setTimeout(() => {
          active.element.pause();
          this.isPlayingMusic = false;
          this.notifyState();
        }, 320);
      } else {
        active.element.pause();
        this.isPlayingMusic = false;
        this.notifyState();
      }
    } else {
      this.resumeContext();
      if (this.audioCtx && this.musicGain) {
        const now = this.audioCtx.currentTime;
        const targetVol = this.currentTrack === 'abi1' ? 0.15 : 0.09;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(0.0001, now);
        this.musicGain.gain.linearRampToValueAtTime(targetVol, now + 0.5);
      }
      active.element.play().then(() => {
        this.isPlayingMusic = true;
        this.notifyState();
      }).catch(() => {});
    }
  }

  resumeContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyState() {
    this.listeners.forEach((cb) => {
      try {
        cb({
          currentTrack: this.currentTrack,
          isPlaying: this.isPlayingMusic,
        });
      } catch {}
    });
  }

  // ==========================================================================
  // HEARTBEAT CONTROLLER & AUDIO DUCKING (PRIORITY 1)
  // ==========================================================================

  start() {
    this.init();
    this.resumeContext();
    this.isPaused = false;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.resumeContext();
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.heartbeatGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      const target = this.isMuted ? 0.0001 : this.currentVolume;
      this.heartbeatGain.gain.setTargetAtTime(target, now, 0.05);
    }
  }

  // Sets target BPM and Heartbeat Volume with automatic music ducking
  setTargetBPM(bpm, volume) {
    if (typeof bpm === 'number' && bpm > 0) {
      this.targetBPM = bpm;
    }
    if (typeof volume === 'number' && volume >= 0) {
      this.targetVolume = volume;
    }

    if (!this.audioCtx) {
      this.init();
    }

    // AUDIO DUCKING / MIXING RULE:
    // Priority 1: HEARTBEAT — always audible
    // Priority 2: BGM / SONG — emotional background layer
    // When heartbeat becomes stronger: duck the music so heartbeat is always clearly above
    if (this.audioCtx && this.musicGain && !this.isMuted) {
      const now = this.audioCtx.currentTime;
      const currentGain = this.musicGain.gain.value;

      // When heartbeat is very intense (>= 0.45, e.g. proposal / I LOVE YOU),
      // ceiling for music is strictly capped at 0.08
      if (this.targetVolume >= 0.45 && currentGain > 0.08) {
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.setValueAtTime(currentGain, now);
        this.musicGain.gain.linearRampToValueAtTime(0.075, now + 1.2);
      }
    }
  }

  // Dramatic silence (e.g. 250ms silence immediately before "I LOVE YOU")
  silence(durationMs = 250) {
    if (!this.audioCtx) return;
    this.silenceUntil = this.audioCtx.currentTime + durationMs / 1000;
  }

  // Precision Web Audio Heartbeat Synthesizer: "LUB" followed by "DUB"
  playBeat(time, bpm, volume) {
    if (!this.audioCtx || this.audioCtx.state !== 'running' || !this.heartbeatFilter) return;

    // Time gap between LUB and DUB shortens slightly as BPM accelerates
    const lubDubGap = Math.max(0.09, Math.min(0.15, 0.14 * (75 / Math.max(50, bpm))));

    try {
      // 1. "LUB" - Deep low-frequency pulse (55-75 Hz, short attack, exponential decay)
      const oscLub = this.audioCtx.createOscillator();
      const gainLub = this.audioCtx.createGain();
      oscLub.type = 'sine';
      oscLub.frequency.setValueAtTime(68, time);
      oscLub.frequency.exponentialRampToValueAtTime(40, time + 0.15);

      gainLub.gain.setValueAtTime(0.0001, time);
      gainLub.gain.linearRampToValueAtTime(volume, time + 0.024);
      gainLub.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

      // Deep sub-harmonic layer for chest resonance
      const subLub = this.audioCtx.createOscillator();
      const subGainLub = this.audioCtx.createGain();
      subLub.type = 'sine';
      subLub.frequency.setValueAtTime(38, time);
      subLub.frequency.exponentialRampToValueAtTime(26, time + 0.16);

      subGainLub.gain.setValueAtTime(0.0001, time);
      subGainLub.gain.linearRampToValueAtTime(volume * 0.35, time + 0.024);
      subGainLub.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

      oscLub.connect(gainLub);
      gainLub.connect(this.heartbeatFilter);
      subLub.connect(subGainLub);
      subGainLub.connect(this.heartbeatFilter);

      oscLub.start(time);
      oscLub.stop(time + 0.17);
      subLub.start(time);
      subLub.stop(time + 0.17);

      // 2. "DUB" - Slightly higher frequency (75-110 Hz, shorter and softer)
      const tDub = time + lubDubGap;
      const oscDub = this.audioCtx.createOscillator();
      const gainDub = this.audioCtx.createGain();
      oscDub.type = 'sine';
      oscDub.frequency.setValueAtTime(92, tDub);
      oscDub.frequency.exponentialRampToValueAtTime(54, tDub + 0.11);

      gainDub.gain.setValueAtTime(0.0001, tDub);
      gainDub.gain.linearRampToValueAtTime(volume * 0.7, tDub + 0.018);
      gainDub.gain.exponentialRampToValueAtTime(0.0001, tDub + 0.12);

      oscDub.connect(gainDub);
      gainDub.connect(this.heartbeatFilter);

      oscDub.start(tDub);
      oscDub.stop(tDub + 0.13);

      // Broadcast visual triggers
      this.notifyBeatListeners('LUB', bpm, volume);
      setTimeout(() => {
        this.notifyBeatListeners('DUB', bpm, volume);
      }, lubDubGap * 1000);
    } catch {}
  }

  // Lookahead Scheduler for Heartbeat (Every 35ms, schedules next 120ms)
  scheduleLoop() {
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;

    // Smooth BPM and Volume interpolation
    this.currentBPM += (this.targetBPM - this.currentBPM) * 0.07;
    this.currentVolume += (this.targetVolume - this.currentVolume) * 0.07;

    // Update heartbeat master gain
    if (this.heartbeatGain && !this.isMuted) {
      this.heartbeatGain.gain.setValueAtTime(this.currentVolume, now);
    }

    // Schedule beats within lookahead window (120ms)
    while (this.nextBeatTime < now + 0.12) {
      if (!this.isPaused && this.nextBeatTime > this.silenceUntil) {
        this.playBeat(this.nextBeatTime, this.currentBPM, this.currentVolume);
      }

      // Cardiac cycle period: 60 / BPM
      const beatInterval = 60 / Math.max(45, this.currentBPM);
      this.nextBeatTime += beatInterval;
    }
  }

  subscribeBeat(callback) {
    this.beatListeners.add(callback);
    return () => this.beatListeners.delete(callback);
  }

  notifyBeatListeners(type, bpm, volume) {
    this.beatListeners.forEach((cb) => {
      try {
        cb(type, bpm, volume);
      } catch {}
    });
  }

  destroy() {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    Object.values(this.tracks).forEach((t) => {
      if (t.element) {
        t.element.pause();
        t.element.src = '';
      }
    });
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', this.handleUserInteraction);
      window.removeEventListener('touchstart', this.handleUserInteraction);
      window.removeEventListener('keydown', this.handleUserInteraction);
    }
  }
}

// Single persistent global audio engine instance
export const globalAudioEngine = new UnifiedAudioEngine();

if (typeof window !== 'undefined') {
  window.heartbeatEngine = globalAudioEngine;
  window.unifiedAudioEngine = globalAudioEngine;
}
