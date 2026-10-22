import React, { useState, useRef } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { ResidentHomeView } from './ResidentHomeView';
import { NightPathView } from './NightPathView';
import { RouteComparisonView } from './RouteComparisonView';
import { JourneyPreviewView } from './JourneyPreviewView';
import { HazardReportView } from './HazardReportView';
import { SettingsView } from './SettingsView';
import { SOSModal } from './SOSModal';
import { FallDetectionModal } from './FallDetectionModal';
import {
  Home,
  Compass,
  AlertTriangle,
  Settings,
  Smartphone,
  Maximize2,
  Minimize2,
  PhoneCall,
  Activity,
  Footprints,
} from 'lucide-react';

const LONG_PRESS_MS = 600;

export function ResidentContainer() {
  const {
    residentTab,
    setResidentTab,
    navigateRole,
    triggerSos,
    fallDetectionActive,
    triggerFallDetectionDemo,
    cancelFallDetection,
    triggerWalkingDemo,
    showToast,
  } = useNightSafe();

  const [phoneFrame, setPhoneFrame] = useState(true);

  // SOS modal
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosAlertId, setSosAlertId]   = useState(null);

  // Long-press state
  const [pressing, setPressing]       = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0–100
  const pressTimer = useRef(null);
  const pressStart = useRef(null);
  const rafRef     = useRef(null);

  const fireSOS = (category = 'Personal Safety') => {
    const id = triggerSos(category);
    setSosAlertId(id);
    setSosModalOpen(true);
  };

  // Guard ref: prevents double-fire when both touchstart+mousedown fire on the same tap
  const isPointerDown = useRef(false);

  const startPress = (e) => {
    // Only start once per physical interaction
    if (isPointerDown.current) return;
    isPointerDown.current = true;
    e.preventDefault();

    setPressing(true);
    pressStart.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - pressStart.current;
      const pct = Math.min((elapsed / LONG_PRESS_MS) * 100, 100);
      setHoldProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    pressTimer.current = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      setPressing(false);
      setHoldProgress(0);
      isPointerDown.current = false;
      fireSOS();
    }, LONG_PRESS_MS);
  };

  const cancelPress = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    clearTimeout(pressTimer.current);
    cancelAnimationFrame(rafRef.current);
    setPressing(false);
    setHoldProgress(0);
  };

  // SVG ring params
  const R    = 26;
  const CIRC = 2 * Math.PI * R;
  const strokeDash = (holdProgress / 100) * CIRC;

  // Render sub-view
  let content = <ResidentHomeView />;
  if (residentTab === 'routes-entry')                      content = <NightPathView />;
  else if (residentTab === 'routes')                       content = <RouteComparisonView />;
  else if (residentTab === 'journey')                      content = <JourneyPreviewView />;
  else if (['report', 'my-reports'].includes(residentTab)) content = <HazardReportView />;
  else if (residentTab === 'settings')                     content = <SettingsView />;

  return (
    <div className="py-4 px-2 sm:px-4 flex flex-col items-center justify-center min-h-screen bg-[#0D1726] text-[#172334]">

      {/* Control bar above phone frame */}
      <div className="w-full max-w-[400px] mb-2 px-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
          <span>UrbanHub-X · Mobile App</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Walking Demo trigger */}
          <button
            onClick={triggerWalkingDemo}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/35 text-[11px] font-bold text-emerald-300 transition cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
            title="Simulate walking step to next node & trigger safety check-in prompt"
          >
            <Footprints className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Walking Demo</span>
          </button>
          {/* Fall Detection Demo trigger */}
          <button
            onClick={triggerFallDetectionDemo}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/35 text-[11px] font-bold text-rose-300 transition cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
            title="Simulate sudden impact / phone fall detection"
          >
            <Activity className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>Fall Demo</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setPhoneFrame(!phoneFrame)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 text-[11px] text-slate-300 transition"
          >
            {phoneFrame ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            <span>{phoneFrame ? 'Expand' : 'Phone'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Device Chassis Frame */}
      <div className={`relative transition-all duration-300 w-full ${
        phoneFrame
          ? 'max-w-[400px] h-[850px] rounded-[46px] p-3.5 bg-slate-900 shadow-2xl border-4 border-slate-700'
          : 'max-w-xl h-auto min-h-[750px] rounded-2xl p-4 bg-white shadow-xl border border-slate-700'
      }`}>
        {/* Dynamic Island notch */}
        {phoneFrame && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        )}

        {/* Screen Viewport */}
        <div className={`relative w-full h-full bg-[#F5F7FA] flex flex-col overflow-hidden ${
          phoneFrame ? 'rounded-[36px]' : 'rounded-xl'
        }`}>

          {/* Fixed Top Header */}
          <header className={`shrink-0 z-30 bg-[#0B1326] border-b border-slate-800/90 shadow-md flex items-center justify-center ${
            phoneFrame ? 'pt-8 pb-3 px-4' : 'py-3.5 px-4'
          }`}>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-base font-black tracking-[0.25em] text-white uppercase select-none">
                UrbanHub<span className="bg-gradient-to-r from-sky-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">-X</span>
              </h1>
              <div className="w-5 h-[2px] rounded-full bg-gradient-to-r from-sky-500 to-teal-400 mt-0.5 opacity-80" />
            </div>
          </header>



          {/* Scrollable Content */}
          <div className={`flex-1 min-h-0 ${
            ['routes-entry', 'routes', 'journey'].includes(residentTab)
              ? 'overflow-hidden flex flex-col'
              : 'overflow-y-auto px-4 pt-3 pb-6'
          }`}>
            {content}
          </div>

          {/* ── Bottom Navigation with inline SOS ── */}
          <nav
            className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 flex items-center justify-around shadow-lg"
            style={{ paddingTop: '6px', paddingBottom: '6px' }}
          >
            {/* Home */}
            <button
              onClick={() => setResidentTab('home')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                residentTab === 'home' ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Night Path */}
            <button
              onClick={() => setResidentTab('routes-entry')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                ['routes-entry', 'routes', 'journey'].includes(residentTab) ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Night Path</span>
            </button>

            {/* ── SOS Long-Press Button (centre) ── */}
            <div className="flex flex-col items-center gap-0.5 select-none">
              <div
                className="relative flex items-center justify-center"
                style={{ width: 62, height: 62 }}
              >
                {/* SVG progress ring */}
                <svg
                  width={62} height={62}
                  className="absolute inset-0 -rotate-90"
                  style={{ pointerEvents: 'none' }}
                >
                  {/* Track */}
                  <circle cx={31} cy={31} r={R} fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth={4} />
                  {/* Fill */}
                  <circle
                    cx={31} cy={31} r={R}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={`${strokeDash} ${CIRC}`}
                    style={{ transition: pressing ? 'none' : 'stroke-dasharray 0.15s ease' }}
                  />
                </svg>

                {/* Button face */}
                <button
                  onPointerDown={startPress}
                  onPointerUp={cancelPress}
                  onPointerLeave={cancelPress}
                  onPointerCancel={cancelPress}
                  onContextMenu={e => e.preventDefault()}
                  style={{ touchAction: 'none', userSelect: 'none' }}
                  className={`relative z-10 w-[52px] h-[52px] rounded-full flex flex-col items-center justify-center gap-0.5 border-[3px] border-white shadow-lg shadow-red-900/40 transition-transform ${
                    pressing ? 'bg-red-700 scale-95' : 'bg-red-600 hover:bg-red-700'
                  }`}
                  title="Hold to send SOS"
                  aria-label="Emergency SOS — hold to activate"
                >
                  <PhoneCall className="w-5 h-5 text-white" />
                  <span className="text-[8px] font-black tracking-widest leading-none text-white">SOS</span>
                </button>
              </div>

              <span className={`text-[9px] font-bold tracking-wide leading-none -mt-0.5 ${
                pressing ? 'text-red-600' : 'text-red-500'
              }`}>
                {pressing ? 'Hold…' : 'Emergency'}
              </span>
            </div>

            {/* Report */}
            <button
              onClick={() => setResidentTab('report')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                ['report', 'my-reports'].includes(residentTab) ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setResidentTab('settings')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                residentTab === 'settings' ? 'text-[#2864A6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Fall Detection Modal (10s Countdown & Care Message) */}
          {fallDetectionActive && (
            <FallDetectionModal
              onDismiss={() => {
                cancelFallDetection();
                showToast("Glad you're okay! Fall alert cancelled.", 'success');
              }}
              onSosNow={() => {
                cancelFallDetection();
                fireSOS('Fall Detection Emergency — Resident Confirmed');
              }}
              onTimeout={() => {
                cancelFallDetection();
                fireSOS('Fall Detection Emergency — Unresponsive Resident (10s timeout)');
              }}
            />
          )}

          {/* SOS Modal — absolute inside phone screen, clipped by overflow-hidden */}
          {sosModalOpen && (
            <SOSModal
              alertId={sosAlertId}
              onClose={() => {
                setSosModalOpen(false);
                setSosAlertId(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
