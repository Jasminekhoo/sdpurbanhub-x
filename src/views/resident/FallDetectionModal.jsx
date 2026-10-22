import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Activity,
  Volume2,
  VolumeX,
} from 'lucide-react';

const COUNTDOWN_TOTAL = 10; // 10 seconds timeout

// ── Warning beep generator ──────────────────────────────────────────────────
function playWarningBeep(freq = 750) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);

    setTimeout(() => {
      try {
        ctx.close();
      } catch (_) {}
    }, 250);
  } catch (_) {}
}

export function FallDetectionModal({ onDismiss, onSosNow, onTimeout }) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_TOTAL);
  const [muted, setMuted] = useState(false);
  const timeoutFiredRef = useRef(false);

  // 10-second Countdown effect
  useEffect(() => {
    // Play initial warning chime
    if (!muted) playWarningBeep(880);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!timeoutFiredRef.current) {
            timeoutFiredRef.current = true;
            onTimeout();
          }
          return 0;
        }

        // Higher pitch as timer nears 0
        if (!muted) {
          const nextVal = prev - 1;
          const pitch = nextVal <= 3 ? 980 : 750;
          playWarningBeep(pitch);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [muted, onTimeout]);

  // Circle radius & circumference for SVG radial progress
  const R = 30;
  const CIRC = 2 * Math.PI * R;
  const progressRatio = secondsLeft / COUNTDOWN_TOTAL;
  const strokeDash = progressRatio * CIRC;

  return (
    <div
      className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end p-3 sm:p-4 animate-fadeIn"
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
    >
      {/* Top Floating Sensor Indicator */}
      <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 shadow-md border border-rose-200 text-rose-700 text-[11px] font-bold backdrop-blur-sm">
          <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>IMPACT DETECTED (3.8G)</span>
        </div>

        <button
          onClick={() => setMuted(!muted)}
          className="w-8 h-8 rounded-full bg-white/95 shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer"
          title={muted ? 'Unmute sound' : 'Mute sound'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
        </button>
      </div>

      {/* Main Alert Card — Light Mode Card */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden animate-slide-up">
        
        {/* Subtle accent header line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500" />

        {/* Pulse Heart & Title */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center shadow-xs">
              <HeartPulse className="w-7 h-7 text-rose-600 animate-bounce" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500" />
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Hard Fall Detected!
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Sudden phone drop & stationary posture registered
            </p>
          </div>
        </div>


        {/* 10-Second Radial Countdown Display */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="relative w-22 h-22 flex items-center justify-center">
            {/* SVG Progress Ring with light mode stroke */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
              <circle
                cx="38"
                cy="38"
                r={R}
                className="stroke-slate-100"
                strokeWidth="5.5"
                fill="none"
              />
              <circle
                cx="38"
                cy="38"
                r={R}
                className={`transition-all duration-1000 ${
                  secondsLeft <= 3 ? 'stroke-rose-600' : 'stroke-amber-500'
                }`}
                strokeWidth="5.5"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC - strokeDash}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Centered Numbers */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black tabular-nums ${
                secondsLeft <= 3 ? 'text-rose-600 scale-110 animate-pulse' : 'text-slate-800'
              }`}>
                {secondsLeft}s
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                remaining
              </span>
            </div>
          </div>

          <div className="text-center mt-1.5 space-y-0.5">
            <div className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Auto SOS in 00:0{secondsLeft}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              If no input is received, help will be dispatched
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* I'm Okay (Dismiss) - Primary green action */}
          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I&apos;m Okay (Cancel Alert)</span>
          </button>

          {/* I Need Help (SOS Now) - Urgent red action */}
          <button
            type="button"
            onClick={onSosNow}
            className="w-full py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-300 transition cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>I Need Help — SOS Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
