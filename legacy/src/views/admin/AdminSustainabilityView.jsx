import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Leaf, 
  TrendingUp, 
  Info, 
  CheckCircle2, 
  FileText, 
  Accessibility, 
  HeartHandshake
} from 'lucide-react';
import { SUSTAINABILITY_KPIS } from '../../data/seedData';

export const AdminSustainabilityView = () => {
  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-emerald-700 text-[11px]">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Section 5.E · Inclusive Community Impact</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Community Impact &amp; Sustainability Indicators
        </h1>
        <p className="text-slate-500 font-medium">
          “Care that responds. A community that includes everyone.”
        </p>
      </div>

      {/* Mandatory Labeling Notice (Section 5.E Requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block">Illustrative Prototype Indicators Notice</span>
          All values shown below are <strong>illustrative prototype indicators</strong> designed for the Sime Darby Property Hackathon. They represent proposed operational metrics rather than measured real-world findings. No speculative carbon figures are claimed.
        </div>
      </div>

      {/* The 4 Required Section 5.E Prototype Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUSTAINABILITY_KPIS.map((kpi, idx) => (
          <div 
            key={idx}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                  {kpi.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {kpi.badge}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-livin-navy">
                  {kpi.value}
                </span>
                <span className="text-slate-500 font-medium">
                  {kpi.unit}
                </span>
              </div>

              <p className="mt-3 text-slate-600 leading-relaxed">
                {kpi.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Community Benefit
              </span>
              <span className="text-slate-400 font-mono text-[10px]">HACKATHON MVP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Zero-Expensive-Hardware Philosophy (Section 10 Requirement) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-base">
          Inclusive Design Without Mandatory Smartphone Ownership
        </h3>
        <p className="text-slate-600 leading-relaxed">
          The central innovation of UrbanHub-X is connecting elderly residents (via physical Home Console buttons), children (via NFC keyfobs), and OKU residents directly to security and concierge staff without requiring every resident to own or navigate a complicated smartphone app.
        </p>
      </div>
    </div>
  );
};
