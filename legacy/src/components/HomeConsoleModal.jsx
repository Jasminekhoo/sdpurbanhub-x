import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Radio, 
  AlertTriangle, 
  Volume2, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Info,
  Clock,
  PhoneCall
} from 'lucide-react';

export const HomeConsoleModal = () => {
  const { isHomeConsoleOpen, closeHomeConsole, triggerConsoleSos, navigate } = useApp();
  const [triggeredCase, setTriggeredCase] = useState(null);
  const [isBeeping, setIsBeeping] = useState(false);

  if (!isHomeConsoleOpen) return null;

  const handleSimulateSos = () => {
    setIsBeeping(true);
    setTimeout(() => {
      setIsBeeping(false);
      const created = triggerConsoleSos();
      setTriggeredCase(created);
    }, 700);
  };

  const handleClose = () => {
    setTriggeredCase(null);
    closeHomeConsole();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold">
              SOS
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Optional Home Console / Help Point</h3>
              <p className="text-[11px] text-slate-400 font-mono">No-Smartphone Community Access</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Console Concept Banner */}
        <div className="p-4 bg-sky-50 border-b border-sky-100 text-xs text-sky-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sky-900">Optional / Future Deployment Concept</span>
            Designed for elderly residents (e.g. Robert Chen), children, or OKU residents who do not carry smartphones. Wall-mounted or bedside push button using existing building power &amp; Wi-Fi.
          </div>
        </div>

        {/* The Simulated Hardware Console */}
        <div className="p-6 bg-slate-100 flex flex-col items-center justify-center border-b border-slate-200">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-md border-2 border-slate-300 text-center relative overflow-hidden">
            
            {/* Status LED & Speaker Grill */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className={`w-2.5 h-2.5 rounded-full ${isBeeping ? 'bg-rose-600 animate-ping' : 'bg-emerald-500'}`}></span>
                {isBeeping ? 'BROADCASTING...' : 'ONLINE (L12-08)'}
              </span>
              <div className="flex gap-0.5">
                <span className="w-1 h-3 bg-slate-300 rounded-full"></span>
                <span className="w-1 h-3 bg-slate-300 rounded-full"></span>
                <span className="w-1 h-3 bg-slate-300 rounded-full"></span>
              </div>
            </div>

            <div className="text-xs text-slate-600 font-medium mb-4">
              Unit 12-08 · Resident: <strong className="text-slate-800">Robert Chen (Age 74)</strong>
            </div>

            {/* Giant Physical SOS Push Button */}
            <button
              onClick={handleSimulateSos}
              disabled={isBeeping}
              className={`w-36 h-36 rounded-full mx-auto font-black text-white text-xl tracking-wider shadow-xl transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 border-4 ${
                isBeeping 
                  ? 'bg-rose-700 border-rose-900 animate-pulse' 
                  : 'bg-rose-600 hover:bg-rose-500 border-rose-200 shadow-rose-600/30'
              }`}
            >
              <AlertTriangle className="w-8 h-8" />
              <span>SOS HELP</span>
              <span className="text-[9px] font-normal tracking-normal opacity-80">PRESS FOR AID</span>
            </button>

            <div className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              AST-CONSOLE-REV2
            </div>
          </div>
        </div>

        {/* Live Feedback / Result */}
        {triggeredCase ? (
          <div className="p-6 bg-white animate-fade-in text-xs space-y-3">
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-950">
              <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Console SOS Dispatched Successfully!</span>
                Case <strong>{triggeredCase.id}</strong> logged for Robert Chen at Aster Residence Unit 12-08.
                Dispatched to Guardhouse console &amp; linked family caregiver view.
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  navigate('/resident/requests');
                }}
                className="flex-1 py-2.5 bg-livin-navy hover:bg-livin-navy-dark text-white rounded-xl font-semibold text-center transition-colors"
              >
                Track in My Requests &rarr;
              </button>
              <button
                onClick={() => {
                  handleClose();
                  navigate('/resident/family');
                }}
                className="flex-1 py-2.5 bg-sky-100 hover:bg-sky-200 text-livin-navy rounded-xl font-semibold text-center transition-colors"
              >
                View Family Care
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 text-center text-xs text-slate-500 space-y-2">
            <p>
              Clicking <strong>SOS HELP</strong> simulates an elderly resident in Unit 12-08 calling for aid without using a smartphone.
            </p>
            <p className="text-[11px] text-slate-400">
              This fulfills <strong>Storyline 1 (Primary Demo)</strong> from Hackathon Prompt 2.0.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
