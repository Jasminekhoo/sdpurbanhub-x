import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  ShieldCheck, 
  Radio, 
  Heart, 
  AlertTriangle, 
  Clock, 
  Info, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export const FamilyCareView = () => {
  const { familyDependants, requests, openHomeConsole, navigate } = useApp();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-xs">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Family &amp; Guardian Care Circle</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Linked Family Dependants
        </h1>
        <p className="text-slate-500 mt-0.5">
          Permission-based safety updates for authorized senior family members and children
        </p>
      </div>

      {/* Privacy Notice (Section 4.D Requirement) */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block text-slate-800">Consent &amp; Privacy Architecture</span>
          Access is strictly permission-based and can be revoked by the resident at any time. UrbanHub-X <strong>never tracks real-time GPS locations or continuous biometric health data</strong>.
        </div>
      </div>

      {/* Dependants List */}
      <div className="space-y-4">
        {familyDependants.map((dep) => {
          // Check if there is an active help request for this dependant
          const activeReq = requests.find(
            r => (r.who.toLowerCase().includes('elderly') && dep.category.includes('Elderly')) ||
                 (r.who.toLowerCase().includes('child') && dep.category.includes('Child')) ||
                 r.personName?.includes(dep.name)
          );

          return (
            <div 
              key={dep.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-livin-navy flex items-center justify-center font-bold text-base">
                    {dep.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{dep.name}</h3>
                    <div className="text-slate-500 font-medium">{dep.relation} · {dep.unit}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{dep.consentStatus}</span>
                </div>
              </div>

              {/* Status & Active Request Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Care Status:</span>
                  {activeReq && activeReq.status !== 'Resolved' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                      Active Alert: {activeReq.status} ({activeReq.id})
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Normal / Safe
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Primary Access Channel:</span>
                  <span className="font-semibold text-slate-800">{dep.primaryDevice}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Support Profile:</span>
                  <span className="font-semibold text-slate-800">{dep.accessibilityNeed}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                {dep.category === 'Elderly resident' ? (
                  <button
                    onClick={openHomeConsole}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Test Home Console SOS</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    NFC Guardian ping enabled
                  </span>
                )}

                <button
                  onClick={() => navigate('/resident/requests')}
                  className="text-livin-navy font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Family Request History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
