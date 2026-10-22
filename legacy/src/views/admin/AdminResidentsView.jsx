import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  Accessibility, 
  Radio, 
  CheckCircle2, 
  Info,
  Lock
} from 'lucide-react';

export const AdminResidentsView = () => {
  const { residentSupportList } = useApp();

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sky-800 text-[11px]">
          <Users className="w-4 h-4 text-livin-navy" />
          <span>Section 5.C · Proactive Resident Care Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Resident Support &amp; Accessibility Registry
        </h1>
        <p className="text-slate-500 font-medium">
          Authorised support profiles for senior citizens, OKU residents, and registered family dependants
        </p>
      </div>

      {/* Privacy & Consent Notice (Section 5.C Requirement) */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-slate-800 block">Minimal Service Delivery Data</span>
          Only information strictly needed for physical aid dispatch is exposed to on-duty staff. Medical diagnosis, continuous health history, and private identifiers are not recorded.
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3.5 px-4 font-bold">Resident Name</th>
                <th className="py-3.5 px-4 font-bold">Unit</th>
                <th className="py-3.5 px-4 font-bold">Care Category</th>
                <th className="py-3.5 px-4 font-bold">Support Profile</th>
                <th className="py-3.5 px-4 font-bold">Access Channel</th>
                <th className="py-3.5 px-4 font-bold">Registered Caregiver</th>
                <th className="py-3.5 px-4 font-bold">Consent Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {residentSupportList.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {res.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                    {res.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-livin-navy">
                      {res.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                    {res.supportProfile}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {res.hasHomeConsole ? (
                      <span className="flex items-center gap-1 font-bold text-rose-700">
                        <Radio className="w-3.5 h-3.5" />
                        Home Console
                      </span>
                    ) : (
                      'NFC Tag / Intercom'
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">
                    {res.familyCaregiver}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Consent Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
