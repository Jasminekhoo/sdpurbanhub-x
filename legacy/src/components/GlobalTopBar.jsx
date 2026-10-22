import React from 'react';
import { useNightSafe } from '../context/NightSafeContext';
import { 
  Shield, 
  Smartphone, 
  Building2, 
  RotateCcw, 
  HelpCircle, 
  PlayCircle,
  AlertOctagon
} from 'lucide-react';

export function GlobalTopBar() {
  const { 
    role, 
    navigateRole, 
    resetDemoScenario, 
    alerts, 
  } = useNightSafe();

  const activeAlertCount = alerts.filter(a => a.status !== 'Resolved — demo').length;

  return (
    <header className="sticky top-0 z-40 bg-[#142B4A] text-white border-b border-slate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Developer Tag */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateRole('select')}>
          <div className="w-9 h-9 rounded-lg bg-[#2864A6] flex items-center justify-center border border-sky-400/30 shadow-inner">
            <span className="text-[#F4B942] font-black text-lg tracking-tighter">NL</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">NightSafe Loop</span>
              <span className="text-[10px] bg-[#2864A6]/80 text-sky-200 px-1.5 py-0.5 rounded font-medium border border-sky-400/20">
                SDP Hackathon 2026
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono hidden sm:block">
              Simulated Township Safety & Decision Support
            </div>
          </div>
        </div>

        {/* Global Role Switcher Tabs */}
        <div className="flex items-center bg-[#0D1726] p-1 rounded-lg border border-slate-700/80">
          <button
            onClick={() => navigateRole('resident')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              role === 'resident'
                ? 'bg-[#2864A6] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Resident App</span>
          </button>

          <button
            onClick={() => navigateRole('security')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              role === 'security'
                ? 'bg-[#2864A6] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security</span>
            {activeAlertCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C83E4D] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigateRole('property')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              role === 'property'
                ? 'bg-[#2864A6] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Property Mgmt</span>
          </button>
        </div>

        {/* Right Tools: Storyline presenter helper & Demo Reset */}
        <div className="flex items-center gap-2">

          {/* Reset Demo button */}
          <button
            onClick={resetDemoScenario}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition border border-transparent hover:border-slate-700"
            title="Reset scenario to pristine initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>
        </div>
      </div>

    
    </header>
  );
}
