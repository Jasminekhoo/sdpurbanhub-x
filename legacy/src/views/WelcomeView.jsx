import React from 'react';
import { useNightSafe } from '../context/NightSafeContext';
import { 
  Smartphone, 
  Shield, 
  Building2, 
  Compass, 
  Lock, 
  TrendingUp, 
  RotateCcw,
  ArrowRight,
  Info
} from 'lucide-react';

export function WelcomeView() {
  const { navigateRole, resetDemoScenario } = useNightSafe();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0D1726] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#2864A6]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-20 right-10 w-[350px] h-[350px] bg-[#F4B942]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142B4A] border border-sky-400/30 text-sky-300 text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sime Darby Property University Hackathon 2026 · Track: People
          </div>

          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-[#2864A6] flex items-center justify-center border border-sky-400/40 shadow-xl">
              <span className="text-[#F4B942] font-black text-2xl tracking-tighter">NL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              NightSafe Loop
            </h1>
          </div>

          <p className="text-lg sm:text-xl font-medium text-amber-300/90 max-w-2xl mx-auto">
            Better-lit journeys. Faster help. Smarter community improvements.
          </p>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            NightSafe Loop connects night-walking route conditions, discreet emergency assistance, safety reporting, and budget-aware property maintenance decisions in one explainable workflow.
          </p>

          {/* Prototype Badge & Safety Disclaimer */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-mono">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Prototype Demo · Simulated Data · No real emergency services or streetlights connected</span>
          </div>
        </div>

        {/* 3 Pillars Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="p-4 rounded-xl bg-[#142B4A]/60 border border-slate-800 backdrop-blur-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-800">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">1. Informed Night Routes</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare paths by lighting condition and obstruction penalties to choose the safest route.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#142B4A]/60 border border-slate-800 backdrop-blur-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">2. Discreet Duress & SOS</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quietly notify on-duty security using a preconfigured Duress PIN without theatrical screens.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#142B4A]/60 border border-slate-800 backdrop-blur-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">3. Budget-Aware Decisions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Property managers optimize RM 5,000 maintenance budgets with explainable algorithms and inspect modeled route improvements.
            </p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-3">
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Demo Workspace to Enter
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Resident Card */}
            <div
              onClick={() => navigateRole('resident', 'home')}
              className="group p-5 rounded-xl bg-[#142B4A] hover:bg-[#1E3C66] border border-slate-700 hover:border-sky-400 cursor-pointer transition shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#2864A6] flex items-center justify-center text-white shadow">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                  Resident App
                </h4>
                <p className="text-xs text-slate-300">
                  Mobile experience for Aina. Route comparison, journey preview, Duress PIN, and hazard reporting.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-amber-300 pt-3 border-t border-slate-800">
                <span>Continue as Resident</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Security Card */}
            <div
              onClick={() => navigateRole('security', 'overview')}
              className="group p-5 rounded-xl bg-[#142B4A] hover:bg-[#1E3C66] border border-slate-700 hover:border-sky-400 cursor-pointer transition shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#C83E4D] flex items-center justify-center text-white shadow">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                  Security Operations
                </h4>
                <p className="text-xs text-slate-300">
                  Desktop control room. Real-time alert queue, checkpoint events, AL-204 Duress acknowledgement, and audit trail.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-amber-300 pt-3 border-t border-slate-800">
                <span>Continue as Security</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Property Management Card */}
            <div
              onClick={() => navigateRole('property', 'overview')}
              className="group p-5 rounded-xl bg-[#142B4A] hover:bg-[#1E3C66] border border-slate-700 hover:border-sky-400 cursor-pointer transition shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#1F9D8B] flex items-center justify-center text-white shadow">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                  Property Intelligence
                </h4>
                <p className="text-xs text-slate-300">
                  Desktop decision support. Hazard verification, explainable priority ranking, budget optimization & route impact ΔC.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-amber-300 pt-3 border-t border-slate-800">
                <span>Continue as Property Mgmt</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span>Demo Session: Persisted in Local State</span>
            <span>•</span>
            <button
              onClick={resetDemoScenario}
              className="text-slate-300 hover:text-white underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo Scenario
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
