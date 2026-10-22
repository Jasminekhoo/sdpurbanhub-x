import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Building2, 
  Accessibility, 
  HelpCircle, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { MALL_CONCEPT } from '../data/seedData';

export const MallPreviewModal = () => {
  const { isMallOpen, closeMall, showToast } = useApp();
  const [requestedHelp, setRequestedHelp] = useState(false);
  const [selectedService, setSelectedService] = useState('Accessibility & Mobility Loan');

  if (!isMallOpen) return null;

  const handleRequestMallHelp = (e) => {
    e.preventDefault();
    setRequestedHelp(true);
    showToast('Mall Concierge Assistance Requested (Simulated Concept Preview)', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-livin-navy to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">{MALL_CONCEPT.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                  Concept Preview
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">{MALL_CONCEPT.operator}</p>
            </div>
          </div>
          <button
            onClick={closeMall}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Concept Notice */}
        <div className="p-3.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Secondary Focus Concept Only (Section 7)</span>
            Demonstrates extending UrbanHub-X's proactive accessibility framework to Sime Darby Property retail assets. Detailed demo storylines remain focused on residential communities.
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Mall Directory Categories */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Retail Community Services Directory
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MALL_CONCEPT.categories.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => setSelectedService(cat.name)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedService === cat.name
                      ? 'border-livin-navy bg-sky-50/70 ring-1 ring-livin-navy'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                    <Accessibility className="w-4 h-4 text-livin-navy" />
                    <span>{cat.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Request Assistance / Accessibility Help Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-livin-navy" />
              <span>Request Mall Assistance / Mobility Loan</span>
            </h4>

            {requestedHelp ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 animate-fade-in flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Mall Help Desk Notified</span>
                  A concierge officer at Main Atrium L1 has reserved: <strong>{selectedService}</strong>. Reference: <strong>KL-MALL-402</strong>.
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestMallHelp} className="space-y-3">
                <div className="text-[11px] text-slate-600">
                  Selected Service: <strong className="text-slate-900">{selectedService}</strong>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter current location (e.g. Near Ground Floor Supermarket Entrance)"
                    defaultValue="Ground Floor Main Atrium"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-livin-navy"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-livin-navy hover:bg-livin-navy-dark text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Request Mall Concierge Aid
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>KL East Mall · Sime Darby Property</span>
          <button
            onClick={closeMall}
            className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 font-semibold"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
