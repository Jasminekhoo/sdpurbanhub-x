import React, { useState, useEffect, useRef } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import {
  PhoneCall,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Delete,
  Radio,
  Loader2,
  VolumeX,
  Volume2
} from 'lucide-react';

// ── Constants ────────────────────────────────────────────────────────────────
const NORMAL_PIN    = '1234';
const PIN_LENGTH    = 4;
const ETA_START_SEC = 4 * 60 + 15;

const LIVE_UPDATES = [
  { delay: 0,    icon: '🔔', text: 'Alert received by Security Operations' },
  { delay: 2000, icon: '📍', text: 'Your location shared with duty officer' },
  { delay: 5000, icon: '🚔', text: 'Officer dispatched — en route to your location' },
  { delay: 9000, icon: '🛡️', text: 'Security team monitoring your location' },
];

// ── Web Audio siren ──────────────────────────────────────────────────────────
function buildAlarm() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type        = 'sawtooth';
    gain.gain.value = 0.45;

    const CYCLE = 0.8;
    const now   = ctx.currentTime;
    for (let i = 0; i < 120; i++) {
      const t = now + i * CYCLE;
      osc.frequency.setValueAtTime(880,  t);
      osc.frequency.linearRampToValueAtTime(1320, t + CYCLE * 0.5);
      osc.frequency.linearRampToValueAtTime(880,  t + CYCLE);
    }
    osc.start(now);

    return () => {
      try {
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
        osc.stop(ctx.currentTime + 0.2);
        setTimeout(() => ctx.close(), 300);
      } catch (_) {}
    };
  } catch (_) {
    return () => {};
  }
}

// ── Backdrop — defined OUTSIDE SOSModal so it never gets re-mounted ──────────
// Defining it inside the render body would cause React to treat it as a new
// component type on every render, unmounting/remounting and causing flickering.
function Backdrop({ children, center }) {
  return (
    <div
      className={`absolute inset-0 z-50 bg-black/65 flex ${center ? 'items-center justify-center' : 'items-end'}`}
      style={{
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        touchAction: 'none',
      }}
      onPointerDown={e => e.stopPropagation()}
      onPointerUp={e => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

// ── PIN dots ─────────────────────────────────────────────────────────────────
function PinDots({ filled }) {
  return (
    <div className="flex gap-3 justify-center my-4">
      {Array.from({ length: PIN_LENGTH }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
            i < filled
              ? 'bg-slate-800 border-slate-800 scale-110'
              : 'bg-transparent border-slate-400'
          }`}
        />
      ))}
    </div>
  );
}

// ── Numpad ───────────────────────────────────────────────────────────────────
function Numpad({ onDigit, onDelete }) {
  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {keys.map((k, i) => {
        if (k === '') return <div key={i} />;
        if (k === 'del') return (
          <button
            key={i}
            onPointerDown={e => { e.preventDefault(); onDelete(); }}
            className="h-11 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 flex items-center justify-center transition-all"
          >
            <Delete className="w-4 h-4 text-slate-600" />
          </button>
        );
        return (
          <button
            key={i}
            onPointerDown={e => { e.preventDefault(); onDigit(k); }}
            className="h-11 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-lg transition-all shadow-sm"
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SOSModal — render inside the phone screen div (uses absolute positioning)
// ═══════════════════════════════════════════════════════════════════════════
export function SOSModal({ alertId, onClose }) {
  const { duressConfig, resolveAlert, addAlertNote, showToast } = useNightSafe();

  const [phase, setPhase]             = useState('active');
  const [shownUpdates, setShownUpdates] = useState([]);
  const [etaActive, setEtaActive]     = useState(false); // true after officer dispatched
  const [etaSec, setEtaSec]           = useState(ETA_START_SEC);
  const [muted, setMuted]             = useState(false);
  const [pin, setPin]                 = useState('');
  const [pinError, setPinError]       = useState('');

  const stopAlarmRef = useRef(null);

  // ── Start alarm on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const stop = buildAlarm();
    stopAlarmRef.current = stop;
    return () => stop();
  }, []);

  // ── Mute toggle ──────────────────────────────────────────────────────────
  const handleMuteToggle = () => {
    if (!muted) {
      stopAlarmRef.current?.();
      stopAlarmRef.current = () => {};
    } else {
      const stop = buildAlarm();
      stopAlarmRef.current = stop;
    }
    setMuted(m => !m);
  };

  // ── Stream live updates ──────────────────────────────────────────────────
  useEffect(() => {
    const timers = LIVE_UPDATES.map(({ delay, icon, text }) =>
      setTimeout(() => {
        setShownUpdates(prev => [...prev, { icon, text }]);
        if (text.includes('dispatched')) setEtaActive(true);
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // ── ETA countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!etaActive) return;
    const iv = setInterval(() => setEtaSec(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, [etaActive]);

  const formatEta = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ── PIN logic ─────────────────────────────────────────────────────────────
  const handleDigit = d => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setPin(next);
    setPinError('');
    if (next.length === PIN_LENGTH) setTimeout(() => submitPin(next), 150);
  };

  const handleDelete = () => {
    setPin(p => p.slice(0, -1));
    setPinError('');
  };

  const submitPin = entered => {
    const normalPin = duressConfig?.normalPin || '1234';
    const duressPin = duressConfig?.pin || '9142';
    const duressEnabled = duressConfig?.enabled ?? true;

    if (entered === normalPin) {
      if (alertId) resolveAlert(alertId);
      stopAlarmRef.current?.();
      showToast('SOS cancelled. Stay safe.', 'info');
      setPhase('cancelled');
      setTimeout(onClose, 2200);
    } else if (duressEnabled && entered === duressPin) {
      if (alertId) addAlertNote(
        alertId,
        '⚠️ Resident entered DURESS PIN — covert fake cancellation. Maintain full response, do NOT stand down'
      );
      stopAlarmRef.current?.();
      showToast('SOS cancelled.', 'info');
      setPhase('duress-cancelled');
      setTimeout(onClose, 2200);
    } else {
      setPinError('Incorrect PIN. Try again.');
      setPin('');
    }
  };

  // ── Phase: active ─────────────────────────────────────────────────────────
  if (phase === 'active') return (
    <Backdrop>
      <div className="w-full bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">

        {/* Red header — no animate-pulse on wrapper to avoid re-layout */}
        <div className="bg-red-600 px-4 pt-5 pb-3.5 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between gap-2">

            {/* Icon + title */}
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0 w-9 h-9">
                {/* Ping ring stays in its own layer — does not affect layout */}
                <span className="absolute inset-0 rounded-full bg-red-300 opacity-60 animate-ping" />
                <div className="relative w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <div className="text-white font-black text-base tracking-wide leading-tight">
                  SOS ACTIVE
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span className="text-red-100 text-[9px] font-bold uppercase tracking-widest">
                    Live · Security Notified
                  </span>
                </div>
              </div>
            </div>

            {/* ETA badge + mute */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-white/15 border border-white/30 rounded-xl px-2.5 py-1.5 text-center min-w-[52px]">
                {etaActive ? (
                  <>
                    <div className="text-[8px] text-red-200 font-bold uppercase tracking-wider">ETA</div>
                    <div className="text-white font-black text-lg leading-none tabular-nums">
                      {formatEta(etaSec)}
                    </div>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 text-white animate-spin mx-auto" />
                    <div className="text-[8px] text-red-200 font-bold uppercase tracking-wider mt-0.5">
                      Dispatch
                    </div>
                  </>
                )}
              </div>

              <button
                onPointerDown={e => { e.preventDefault(); handleMuteToggle(); }}
                className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center hover:bg-white/30 transition"
                title={muted ? 'Unmute alarm' : 'Mute alarm'}
              >
                {muted
                  ? <VolumeX className="w-3.5 h-3.5 text-white" />
                  : <Volume2 className="w-3.5 h-3.5 text-white" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Location strip */}
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-b border-red-100">
          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
          <span className="text-[10px] text-red-700 font-semibold truncate">
            Near Lamp L-04 (Central Boulevard) · Simulated Location
          </span>
        </div>

        {/* Live updates feed */}
        <div className="px-4 py-3 space-y-2 max-h-[148px] overflow-y-auto">
          <div className="flex items-center gap-1.5 mb-1">
            <Radio className="w-2.5 h-2.5 text-slate-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Security Live Feed
            </span>
          </div>
          {shownUpdates.length === 0 && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Connecting to security operations…</span>
            </div>
          )}
          {shownUpdates.map((u, i) => (
            <div key={i} className="flex items-start gap-2 animate-fade-in">
              <span className="text-sm leading-none mt-0.5">{u.icon}</span>
              <span className="text-[11px] text-slate-700 leading-relaxed">{u.text}</span>
            </div>
          ))}
        </div>

        {/* Cancel action */}
        <div className="px-4 pb-6 pt-2 border-t border-slate-100">
          <button
            onPointerDown={e => { e.preventDefault(); setPhase('cancel-pin'); setPin(''); setPinError(''); }}
            className="w-full py-3 rounded-2xl border-2 border-slate-300 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all"
          >
            Cancel SOS
          </button>
          <p className="text-center text-[9px] text-slate-400 mt-1.5 leading-relaxed">
            PIN required to cancel · Stay calm and stay visible
          </p>
        </div>
      </div>
    </Backdrop>
  );

  // ── Phase: cancel-pin ─────────────────────────────────────────────────────
  if (phase === 'cancel-pin') return (
    <Backdrop>
      <div className="w-full bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">

        <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center gap-2.5">
          <button
            onPointerDown={e => { e.preventDefault(); setPhase('active'); setPin(''); setPinError(''); }}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-900 text-sm leading-tight">Enter PIN to Cancel SOS</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Alert is still live until PIN verified</div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div className="px-4 pb-6 pt-4">
          <PinDots filled={pin.length} />

          {pinError && (
            <div className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-semibold mb-2 animate-fade-in">
              <AlertTriangle className="w-3 h-3" />
              <span>{pinError}</span>
            </div>
          )}

          <Numpad onDigit={handleDigit} onDelete={handleDelete} />
        </div>
      </div>
    </Backdrop>
  );

  // ── Phase: cancelled / duress-cancelled (same UI shown to coercer) ────────
  if (phase === 'cancelled' || phase === 'duress-cancelled') return (
    <Backdrop center>
      <div className="mx-4 w-full max-w-[280px] bg-white rounded-3xl shadow-2xl p-7 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="text-center">
          <div className="font-black text-slate-900 text-base">SOS Cancelled</div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Alert withdrawn. Stay safe.</p>
        </div>
      </div>
    </Backdrop>
  );

  return null;
}
