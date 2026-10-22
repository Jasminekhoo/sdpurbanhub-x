import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Leaf, 
  Phone, 
  MapPin, 
  Building2, 
  HelpCircle,
  EyeOff,
  LogOut
} from 'lucide-react';

export const ResidentProfileView = () => {
  const { currentUser, logout, navigate, resetDemoData, openPoster } = useApp();

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Resident Profile &amp; Privacy
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Minimal-footprint privacy-first community architecture
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-livin-navy text-white flex items-center justify-center font-bold text-xl">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{currentUser?.name || 'Alex Chen'}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser?.email || 'resident@livincare.demo'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-livin-navy">
              Aster Residence Resident
            </span>
          </div>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              Assigned Property:
            </span>
            <span className="font-semibold text-slate-800">Aster Residence</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              Residential Unit:
            </span>
            <span className="font-semibold text-slate-800">{currentUser?.unit || 'Tower B · Unit 12-08'}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400" />
              Emergency Contact:
            </span>
            <span className="font-semibold text-slate-800">{currentUser?.emergencyContact || 'Elena Chen (+60 12-998 1234)'}</span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantees (Section 8 Requirement) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm">Privacy &amp; Data Ethics Commitment</h3>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">No Continuous Location Tracking</span>
              UrbanHub-X operates purely on resident-initiated alerts. We never track your real-time GPS or in-home movement.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Zero Mandatory Wearables or In-Unit Cameras</span>
              Designed to eliminate unnecessary hardware and e-waste. Uses existing mobile web browsers and guardhouse networks.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Inclusive Non-App Alternatives Available</span>
              Residents can also request assistance directly at the security counter or via dedicated intercom lines.
            </div>
          </div>
        </div>
      </div>

      {/* Account actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <button
          onClick={openPoster}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-livin-navy text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          View Sime Darby Campaign Poster (3:4)
        </button>
        <button
          onClick={resetDemoData}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          Reset Demo Data to Initial Seed
        </button>
        <button
          onClick={logout}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Resident Portal</span>
        </button>
      </div>
    </div>
  );
};
