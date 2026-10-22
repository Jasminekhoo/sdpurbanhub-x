import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Info,
  Building,
  Lock,
  Unlock,
  KeyRound
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const ResidentCardView = () => {
  const { 
    currentUser, 
    residentCard, 
    simulateUnusualCardTap,
    handleConfirmUnusualTap,
    unfreezeCard,
    showToast 
  } = useApp();

  const [isTapping, setIsTapping] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);

  const handleSimulateTap = () => {
    if (residentCard.status === 'Temporarily Blocked') {
      showToast('NFC Access Denied: Card is currently Temporarily Blocked.', 'error');
      return;
    }

    setIsTapping(true);
    setTapSuccess(false);

    setTimeout(() => {
      setIsTapping(false);
      setTapSuccess(true);
      showToast('Simulated NFC Access Granted: Turnstile #2 unlocked', 'success');
      setTimeout(() => setTapSuccess(false), 3000);
    }, 600);
  };

  const handleManualFreeze = () => {
    handleConfirmUnusualTap(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in text-xs">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          NFC Resident ID Card
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Secure token credential for Aster Residence perimeter and facilities
        </p>
      </div>

      {/* Visual NFC Card Representation (Section 4.B) */}
      <div 
        className={`w-full aspect-[1.58/1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden transition-all duration-300 ${
          residentCard.status === 'Active'
            ? 'bg-gradient-to-tr from-slate-950 via-livin-navy to-slate-900 border border-sky-400/20'
            : 'bg-gradient-to-tr from-stone-900 via-rose-950 to-stone-900 border border-rose-500/40'
        }`}
      >
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-300" />
              <span className="font-extrabold text-sm tracking-wide uppercase">
                Aster Residence
              </span>
            </div>
            <div className="text-[10px] font-mono text-sky-200 mt-0.5 tracking-wider">
              SIME DARBY PROPERTY
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/15">
            <Radio className={`w-3 h-3 ${isTapping ? 'animate-ping text-sky-300' : 'text-emerald-400'}`} />
            <span>{residentCard.status}</span>
          </div>
        </div>

        {/* Micro Chip & Token Badge */}
        <div className="relative z-10 my-4 sm:my-6 flex items-center justify-between">
          <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-600/40 shadow-inner flex flex-col justify-around p-1 opacity-90">
            <div className="w-full h-0.5 bg-amber-700/30"></div>
            <div className="w-3/4 h-0.5 bg-amber-700/30"></div>
            <div className="w-full h-0.5 bg-amber-700/30"></div>
          </div>

          <div className="font-mono text-[11px] text-sky-200/90 tracking-widest flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-sky-300" />
            <span>TOKEN: {residentCard.token || 'TK-8821-99B4'}</span>
          </div>
        </div>

        {/* Cardholder name & unit (NO IC or Medical Data - Section 4.B Requirement) */}
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Cardholder</div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              {currentUser?.name || 'Alex Chen'}
            </div>
            <div className="text-xs font-mono text-sky-200 mt-0.5">
              {currentUser?.unit || 'Tower B · Unit 12-08'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-mono text-slate-400 tracking-wider">CARD SERIAL</div>
            <div className="text-xs sm:text-sm font-mono font-bold tracking-widest text-slate-200">
              {residentCard.number}
            </div>
          </div>
        </div>
      </div>

      {/* Tap feedback */}
      {tapSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Simulated Contactless Tap Successful</span>
            Turnstile #2 authenticated securely. No IC or biometric records accessed.
          </div>
        </div>
      )}

      {/* Interactive Demo Actions Grid (Section 4.B & Storyline 3) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
          Clickable NFC Demo Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Action 1: Simulate NFC Tap */}
          <button
            onClick={handleSimulateTap}
            disabled={isTapping || residentCard.status === 'Temporarily Blocked'}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
              residentCard.status === 'Temporarily Blocked'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-livin-navy hover:bg-livin-navy-dark text-white'
            }`}
          >
            <Radio className={`w-4 h-4 ${isTapping ? 'animate-ping' : ''}`} />
            <span>{isTapping ? 'Authenticating...' : 'Simulate NFC Tap (Turnstile)'}</span>
          </button>

          {/* Action 2: Storyline 3 Unusual Activity Trigger */}
          <button
            onClick={simulateUnusualCardTap}
            className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Simulate Unusual Activity</span>
          </button>
        </div>

        {/* Freeze / Unfreeze Button */}
        {residentCard.status === 'Active' ? (
          <button
            onClick={() => setIsFreezeModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Freeze Card (Temporarily Block)</span>
          </button>
        ) : (
          <button
            onClick={unfreezeCard}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Unlock className="w-4 h-4" />
            <span>Unfreeze &amp; Reactivate Card</span>
          </button>
        )}
      </div>

      {/* Privacy Guarantee Note (Section 4.B & 8) */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block text-slate-800">Token-Only Security Principle</span>
          The NFC card represents an encrypted access token only. <strong>No IC numbers, medical records, or sensitive health data are ever stored on the physical card.</strong>
        </div>
      </div>

      {/* Confirmation Modal for Freeze */}
      <ConfirmationModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        onConfirm={handleManualFreeze}
        isDestructive={true}
        title="Confirm Freezing Resident Card?"
        message="Freezing this card will update its status to Temporarily Blocked and alert Property Management for security verification."
        confirmText="Freeze Card"
      />
    </div>
  );
};
