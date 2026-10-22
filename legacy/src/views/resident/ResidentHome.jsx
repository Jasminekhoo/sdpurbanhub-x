import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  HandHeart, 
  CreditCard, 
  Users, 
  Wrench, 
  Radio, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Bell, 
  Info,
  Building,
  Lock,
  ChevronRight
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const ResidentHome = () => {
  const { 
    currentUser, 
    residentCard, 
    requests, 
    notifications,
    unusualActivityEvent,
    handleConfirmUnusualTap,
    simulateUnusualCardTap,
    unfreezeCard,
    navigate, 
    openHomeConsole,
    openPoster,
    showToast 
  } = useApp();

  const [isTapping, setIsTapping] = useState(false);

  // Filter requests for current resident
  const residentRequests = requests
    .filter(r => r.residentName === (currentUser?.name || 'Alex Chen'))
    .slice(0, 3);

  const activeRequest = requests.find(
    r => r.residentName === (currentUser?.name || 'Alex Chen') && r.status !== 'Resolved' && r.status !== 'Cancelled'
  );

  const handleSimulateTap = () => {
    if (residentCard.status === 'Temporarily Blocked') {
      showToast('NFC Access Denied: Card is Temporarily Blocked.', 'error');
      return;
    }
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      showToast('NFC Access Granted: Turnstile #2 unlocked (Simulated)', 'success');
    }, 600);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 animate-pulse">Received</span>;
      case 'Assigned':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800">Assigned</span>;
      case 'Assistance on the way':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 animate-pulse">Assistance on the way</span>;
      case 'Resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Resolved</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header Greeting & Resident Profile (Section 4.A) */}
      <div className="bg-gradient-to-r from-livin-navy via-livin-navy-light to-livin-accent rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-sky-200">
              Aster Residence · Resident &amp; Family App
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Good evening, {currentUser?.name || 'Alex Chen'}
            </h1>
            <p className="text-xs text-sky-100 mt-1 font-mono">
              {currentUser?.unit || 'Tower B · Unit 12-08'} · Primary Caregiver
            </p>
          </div>

          {/* NFC Status Card Badge */}
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs text-right">
            <span className="text-[10px] uppercase tracking-wider font-mono text-sky-200 block">
              NFC Resident ID Card
            </span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${
                residentCard.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400 animate-ping'
              }`}></span>
              <strong className="text-white">{residentCard.status}</strong>
            </div>
          </div>
        </div>

        {/* Clear prominent "I Need Help" quick trigger */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-sky-100">
            Emergency or accessibility needed right now?
          </span>
          <button
            onClick={() => navigate('/resident/request-help')}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>I Need Help &rarr;</span>
          </button>
        </div>
      </div>

      {/* 2. Unusual NFC Activity Alert (Storyline 3 - Section 4.B & 6.3) */}
      {unusualActivityEvent && (
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-md animate-bounce-in text-xs space-y-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Unusual Card Activity Detected. Was this you?
              </h3>
              <p className="text-slate-700 mt-1">
                Card <strong>{unusualActivityEvent.cardToken}</strong> was tapped at <strong>{unusualActivityEvent.location}</strong> ({unusualActivityEvent.time}).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleConfirmUnusualTap(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
            >
              Yes, that was me
            </button>
            <button
              onClick={() => handleConfirmUnusualTap(false)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              No, not me — Freeze Card
            </button>
          </div>
        </div>
      )}

      {/* Card Temporarily Blocked Banner */}
      {residentCard.status === 'Temporarily Blocked' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>NFC Card is <strong>Temporarily Blocked</strong>. Security review case open.</span>
          </div>
          <button
            onClick={unfreezeCard}
            className="px-3 py-1 bg-white hover:bg-slate-50 border border-rose-300 text-rose-800 font-bold rounded-lg text-[11px]"
          >
            Unfreeze (Demo)
          </button>
        </div>
      )}

      {/* 3. Live Active Case Progress Tracker (Section 4.C Timeline) */}
      {activeRequest && (
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-livin-navy bg-sky-50 px-2 py-0.5 rounded">
                Live Case Tracking: {activeRequest.id}
              </span>
              <h3 className="font-extrabold text-slate-900 text-base mt-1">
                {activeRequest.category} ({activeRequest.who})
              </h3>
            </div>
            {getStatusBadge(activeRequest.status)}
          </div>

          {/* Interactive Progress Steps (Received -> Assigned -> Assistance on the way -> Resolved) */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-semibold">
            {[
              { label: 'Received', done: true },
              { label: 'Assigned', done: activeRequest.status !== 'Received' },
              { label: 'On the Way', done: activeRequest.status === 'Assistance on the way' || activeRequest.status === 'Resolved' },
              { label: 'Resolved', done: activeRequest.status === 'Resolved' },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className={`h-2 rounded-full ${
                  step.done ? 'bg-livin-navy' : 'bg-slate-200'
                }`} />
                <span className={step.done ? 'text-livin-navy font-bold' : 'text-slate-400'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <span>Responder: <strong>{activeRequest.assignedTo || 'Dispatching staff...'}</strong></span>
            <button
              onClick={() => navigate('/resident/requests')}
              className="text-livin-navy font-bold hover:underline"
            >
              View Full Timeline &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 4. Large Quick Actions Grid (Section 4.A Requirement) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Community Care Services
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Request Help */}
          <button
            onClick={() => navigate('/resident/request-help')}
            className="bg-white hover:bg-rose-50/50 p-5 rounded-3xl border border-slate-200 hover:border-rose-300 text-left transition-all shadow-xs group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Request Help</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Medical, OKU, Child or SOS</p>
            </div>
          </button>

          {/* Action 2: Report an Issue */}
          <button
            onClick={() => navigate('/resident/report-issue')}
            className="bg-white hover:bg-amber-50/50 p-5 rounded-3xl border border-slate-200 hover:border-amber-300 text-left transition-all shadow-xs group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Report an Issue</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Lifts, ramps, lights, safety</p>
            </div>
          </button>

          {/* Action 3: My NFC Card */}
          <button
            onClick={() => navigate('/resident/card')}
            className="bg-white hover:bg-sky-50/50 p-5 rounded-3xl border border-slate-200 hover:border-sky-300 text-left transition-all shadow-xs group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-100 text-livin-navy flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm">My NFC Card</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Tap simulator &amp; card freeze</p>
            </div>
          </button>

          {/* Action 4: Family Care */}
          <button
            onClick={() => navigate('/resident/family')}
            className="bg-white hover:bg-emerald-50/50 p-5 rounded-3xl border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-xs group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm">Family Care</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Senior parent &amp; child care</p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Home Console Banner (No-Smartphone Access / Storyline 1 Primary Demo) */}
      <div className="bg-gradient-to-r from-slate-900 to-livin-navy rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
              No-Smartphone Access · Storyline 1 Demo
            </span>
          </div>
          <h3 className="text-base font-bold">Home Console / Help Point Concept</h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Simulate an elderly parent (Robert Chen) pressing the physical wall/bedside SOS button in Unit 12-08 without using a smartphone.
          </p>
        </div>
        <button
          onClick={openHomeConsole}
          className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-transform active:scale-95 whitespace-nowrap flex items-center gap-2"
        >
          <Radio className="w-4 h-4" />
          <span>Launch Home Console &rarr;</span>
        </button>
      </div>

      {/* 6. Recent Requests List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Care Requests</h3>
            <p className="text-xs text-slate-500">Synchronized live with Aster Residence security desk</p>
          </div>
          <button
            onClick={() => navigate('/resident/requests')}
            className="text-xs font-semibold text-livin-navy hover:underline"
          >
            View All ({residentRequests.length}) &rarr;
          </button>
        </div>

        <div className="space-y-3">
          {residentRequests.map((req) => (
            <div 
              key={req.id}
              onClick={() => navigate('/resident/requests')}
              className="p-4 rounded-2xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-livin-navy">{req.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-bold text-slate-900">{req.category}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                    {req.who}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">{req.description}</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(req.status)}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
