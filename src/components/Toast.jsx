import React from 'react';
import { useNightSafe } from '../context/NightSafeContext';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export function Toast() {
  const { toast } = useNightSafe();

  if (!toast) return null;

  const { message, type } = toast;

  let bg = 'bg-slate-900 text-white border-slate-700';
  let icon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;

  if (type === 'success') {
    bg = 'bg-[#142B4A] text-white border-emerald-500/40 shadow-emerald-950/20';
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
  } else if (type === 'warning') {
    bg = 'bg-[#142B4A] text-white border-amber-500/50 shadow-amber-950/20';
    icon = <AlertTriangle className="w-4 h-4 text-[#F4B942] shrink-0" />;
  } else if (type === 'error') {
    bg = 'bg-[#142B4A] text-white border-red-500/50 shadow-red-950/20';
    icon = <AlertOctagon className="w-4 h-4 text-[#C83E4D] shrink-0" />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slide-up">
      <div className={`p-3.5 rounded-xl border shadow-xl flex items-center gap-3 text-xs font-medium backdrop-blur-md ${bg}`}>
        {icon}
        <div className="flex-1 leading-snug">{message}</div>
      </div>
    </div>
  );
}
