import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';

export const AdminNfcSecurityView = () => {
  const { nfcRecords, unfreezeCard, showToast } = useApp();

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-purple-700 text-[11px]">
          <CreditCard className="w-4 h-4 text-purple-600" />
          <span>Section 5.D · Token-Based Access Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          NFC Security &amp; Credential Management
        </h1>
        <p className="text-slate-500 font-medium">
          Token-only credential status, unusual tap incident reviews, and suspension logs
        </p>
      </div>

      {/* Security Principles Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-slate-800 block">Encrypted Token Architecture</span>
          UrbanHub-X handles card events using unique cryptographic tokens (e.g. <code>TK-8821-99B4</code>). <strong>Raw identity cards (IC numbers), biometric patterns, or health records are never linked to NFC tokens.</strong>
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Active &amp; Suspended Card Credentials</h3>
          <span className="text-slate-400 font-mono text-[11px]">{nfcRecords.length} registered credentials</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3.5 px-4 font-bold">Secure Token ID</th>
                <th className="py-3.5 px-4 font-bold">Cardholder Name</th>
                <th className="py-3.5 px-4 font-bold">Unit Assignment</th>
                <th className="py-3.5 px-4 font-bold">Credential Status</th>
                <th className="py-3.5 px-4 font-bold">Last Recorded Event</th>
                <th className="py-3.5 px-4 font-bold text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nfcRecords.map((card) => {
                const isBlocked = card.status === 'Temporarily Blocked';
                return (
                  <tr key={card.cardId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-livin-navy flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                      <span>{card.cardId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {card.residentName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {card.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isBlocked
                          ? 'bg-rose-100 text-rose-700 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {card.lastEvent}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isBlocked ? (
                        <button
                          onClick={unfreezeCard}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-[11px]"
                        >
                          Mark Reviewed &amp; Unblock
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No action required</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
