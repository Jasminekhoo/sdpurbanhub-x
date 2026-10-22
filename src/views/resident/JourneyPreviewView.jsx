import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { GoogleMapsTownshipView } from '../../components/GoogleMapsTownshipView';
import {
  evaluateRoute,
  routeMetrics,
  remainingNodeScope
} from '../../data/routeRisk';
import { 
  Lightbulb, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowLeft,
  Compass,
  Footprints,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  StopCircle,
} from 'lucide-react';

export function JourneyPreviewView() {
  const { 
    selectedRouteId, 
    routes, 
    journeyStatus, 
    endJourney,
    checkpointIndex, 
    activeLamps, 
    hazards, 
    alerts,
    setResidentTab,
    missedCheckpointPrompt,
    resolveMissedPrompt,
    triggerWalkingDemo,
  } = useNightSafe();

  const route = routes[selectedRouteId] || routes.A;
  const currentNodeId = route.nodes[checkpointIndex] || route.nodes[0];

  const metrics = routeMetrics(selectedRouteId) || routeMetrics('A');

  // Metrics calculation
  const totalNodes = route.nodes.length;
  const progressRatio = Math.min(checkpointIndex / Math.max(totalNodes - 1, 1), 1);
  const remainingMinutes = Math.max(1, Math.round(metrics.etaMinutes * (1 - progressRatio * 0.8)));
  const remainingDistanceKm = Math.max(0.05, (metrics.distanceMeters * (1 - progressRatio * 0.85) / 1000)).toFixed(2);

  // Lighting coverage is infrastructure condition, so it comes straight from
  // the canonical route model rather than being re-derived per screen.
  const lightingPercentage = metrics.lightingCoverage;

  // Danger is a route-level risk score, not "does any hazard read High?".
  // Only the hazards on the part of the route still ahead count, and hazards
  // the Property team has already resolved drop out entirely.
  const routeRisk = evaluateRoute(selectedRouteId, hazards, {
    nodeScope: remainingNodeScope(selectedRouteId, checkpointIndex)
  });
  const dangerLevel = routeRisk.dangerLevel;

  return (
    <div className="relative flex-1 flex flex-col h-full bg-[#F5F7FA] overflow-hidden select-none">
      
      {/* ── Top Bar (Light Mode Header) ── */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between shadow-2xs z-20">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setResidentTab('routes')}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-600 transition cursor-pointer"
            title="Back to Route Choice"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                selectedRouteId === 'A' ? 'bg-emerald-500' : selectedRouteId === 'B' ? 'bg-amber-500' : 'bg-sky-500'
              } animate-pulse`} />
              <span className="text-xs font-bold text-slate-800 truncate">
                {route.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                (Route {selectedRouteId})
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Live Path Navigation · Node {currentNodeId}
            </div>
          </div>
        </div>

        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Active
        </span>
      </div>

      {/* ── Main Map Canvas with Floating HUD Condition Annotations ── */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-100">
        <GoogleMapsTownshipView
          theme="day"
          selectedRoute={selectedRouteId}
          activeLamps={activeLamps}
          currentCheckpointNode={currentNodeId}
          hazards={hazards}
          alerts={alerts}
          height="100%"
          showLegend={false}
          showOverlayLabels={true}
          showHeader={false}
        />

        {/* ── Live Condition Annotations Placed Directly Over Map ── */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 pointer-events-auto">
          <div className="p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md">
            <div className="grid grid-cols-4 divide-x divide-slate-100 text-center">
              
              {/* 1. Time */}
              <div className="px-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-[#2864A6] mb-0.5">
                  <Clock className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Time</span>
                </div>
                <span className="text-xs font-black text-slate-800 tabular-nums">
                  {remainingMinutes} min
                </span>
              </div>

              {/* 2. Distance Leave */}
              <div className="px-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-emerald-600 mb-0.5">
                  <Compass className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Leave</span>
                </div>
                <span className="text-xs font-black text-slate-800 tabular-nums">
                  {remainingDistanceKm} km
                </span>
              </div>

              {/* 3. Light */}
              <div className="px-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                  <Lightbulb className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Light</span>
                </div>
                <span className="text-xs font-black text-slate-800 tabular-nums">
                  {lightingPercentage}%
                </span>
              </div>

              {/* 4. Danger */}
              <div className="px-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 mb-0.5">
                  <ShieldAlert className={`w-3 h-3 ${
                    dangerLevel === 'High' ? 'text-red-500' : dangerLevel === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'
                  }`} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Danger</span>
                </div>
                <span className={`text-xs font-black ${
                  dangerLevel === 'High' ? 'text-red-600' : dangerLevel === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {dangerLevel}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Current Node Pin Overlay */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-slate-700 text-[10px] font-bold shadow-md backdrop-blur-sm">
            <Footprints className="w-3 h-3 text-[#2864A6]" />
            <span>At Checkpoint: Node {currentNodeId}</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Bar: End Journey Button ── */}
      <div className="shrink-0 bg-white border-t border-slate-200 px-3 py-2 z-20 shadow-xs">
        <button
          type="button"
          onClick={() => {
            endJourney();
            setResidentTab('home');
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <StopCircle className="w-4 h-4 text-red-400" />
          <span>End Journey</span>
        </button>
      </div>

      {/* ── Safety Check-in Confirmation Modal (Pops up upon arriving at next node) ── */}
      {missedCheckpointPrompt && (
        <div 
          className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end p-3.5 animate-fadeIn"
          style={{ touchAction: 'none' }}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
        >
          <div className="w-full bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3.5 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-900 leading-tight">Safety Confirmation</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-[#1E3C66]">
                    Node {currentNodeId}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  You just arrived at checkpoint {currentNodeId}. Please confirm you are safe.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-medium">
              &ldquo;You have arrived at checkpoint {currentNodeId}. Everything looking fine on your journey?&rdquo;
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => resolveMissedPrompt('okay')}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I&apos;m Safe · Continue Walking</span>
              </button>

              <button
                type="button"
                onClick={() => resolveMissedPrompt('help')}
                className="w-full py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-200 transition cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>I Feel Unsafe / Need Assistance</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
