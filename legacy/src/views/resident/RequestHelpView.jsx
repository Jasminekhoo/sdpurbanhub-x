import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  HeartPulse, 
  ShieldAlert, 
  Accessibility, 
  Users, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Info,
  XCircle
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const RequestHelpView = () => {
  const { currentUser, createRequest, navigate, cancelRequest } = useApp();

  const whoOptions = [
    { id: 'Elderly resident', label: 'Elderly resident', desc: 'Senior citizen / parent' },
    { id: 'Child', label: 'Child', desc: 'Dependent child in compound' },
    { id: 'Person with disability (OKU)', label: 'Person with disability (OKU)', desc: 'Accessibility / mobility aid' },
    { id: 'Myself', label: 'Myself', desc: 'Resident in unit' },
    { id: 'Someone else', label: 'Someone else', desc: 'Neighbor or guest' },
  ];

  const helpTypes = [
    { id: 'Medical or urgent assistance', label: 'Medical or urgent assistance', icon: HeartPulse, priority: 'Urgent' },
    { id: 'Safety concern', label: 'Safety concern', icon: ShieldAlert, priority: 'Urgent' },
    { id: 'Mobility or accessibility assistance', label: 'Mobility / accessibility assistance', icon: Accessibility, priority: 'Normal' },
    { id: 'Escort home', label: 'Escort home', icon: Users, priority: 'Normal' },
    { id: 'Other', label: 'Other assistance', icon: AlertTriangle, priority: 'Normal' },
  ];

  const locations = [
    'Home unit',
    'Lobby',
    'Lift',
    'Car park',
    'Common area / Playground',
    'Clubhouse / Swimming pool',
    'Other'
  ];

  // Form State
  const [who, setWho] = useState('Elderly resident');
  const [type, setType] = useState('Medical or urgent assistance');
  const [location, setLocation] = useState('Home unit');
  const [note, setNote] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submittedCase, setSubmittedCase] = useState(null);

  // Quick Demo Presets (Section 6 Storyline 2)
  const applyPreset = (presetName) => {
    if (presetName === 'elderly') {
      setWho('Elderly resident');
      setType('Medical or urgent assistance');
      setLocation('Home unit');
      setNote('Senior parent Robert Chen feeling dizziness; on-site vitals check requested.');
    } else if (presetName === 'child') {
      setWho('Child');
      setType('Safety concern');
      setLocation('Common area / Playground');
      setNote('Child Chloe Chen at podium playground; perimeter escort to Tower B lobby requested.');
    } else if (presetName === 'oku') {
      setWho('Person with disability (OKU)');
      setType('Mobility or accessibility assistance');
      setLocation('Lobby');
      setNote('Wheelchair ramp assistance and lift holding requested for Encik Harun.');
    }
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    const selectedHelpObj = helpTypes.find(h => h.id === type);
    const priority = selectedHelpObj ? selectedHelpObj.priority : 'Normal';

    const created = createRequest({
      who,
      type: priority === 'Urgent' ? 'SOS' : 'Accessibility',
      category: type,
      location,
      description: note || `${type} requested for ${who} at ${location}.`,
      priority,
      source: 'Resident App (Care Flow)'
    });

    setSubmittedCase(created);
  };

  // Confirmation Success View (Section 4.C)
  if (submittedCase) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center animate-fade-in text-xs space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
          Help Request Sent to Property Management
        </span>

        <h2 className="text-2xl font-extrabold text-slate-900">
          Request Dispatched Successfully
        </h2>

        {/* Case ID Box */}
        <div className="my-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            Live Case Tracking Identifier
          </div>
          <div className="text-3xl font-mono font-extrabold text-livin-navy mt-1">
            {submittedCase.id}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Status: {submittedCase.status}</span>
          </div>
        </div>

        {/* Details Summary */}
        <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Person needing help:</span>
            <span className="font-bold text-slate-800">{submittedCase.personName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Type of help:</span>
            <span className="font-bold text-slate-800">{submittedCase.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Dispatch Location:</span>
            <span className="font-semibold text-slate-800">{submittedCase.location}</span>
          </div>
        </div>

        {/* Progress Tracker Preview */}
        <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 text-left space-y-2">
          <span className="font-bold text-livin-navy block text-[11px]">Progress Workflow</span>
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-600">
            <span className="font-bold text-livin-navy">1. Received ✓</span>
            <span>&rarr;</span>
            <span>2. Assigned</span>
            <span>&rarr;</span>
            <span>3. On the Way</span>
            <span>&rarr;</span>
            <span>4. Resolved</span>
          </div>
        </div>

        {/* Action Buttons & Cancel Option (Section 8) */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate('/resident/requests')}
            className="flex-1 py-3 px-4 bg-livin-navy hover:bg-livin-navy-dark text-white font-bold rounded-xl shadow-sm transition-colors"
          >
            Track in My Requests &rarr;
          </button>
          <button
            onClick={() => {
              cancelRequest(submittedCase.id);
              navigate('/resident/home');
            }}
            className="py-3 px-4 border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold rounded-xl transition-colors"
          >
            Cancel Request (Accidental Trigger)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-xs">
      <button
        onClick={() => navigate('/resident/home')}
        className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
            Core Care Flow · Hackathon 2.0
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Request Assistance or Emergency Help
          </h1>
          <p className="text-slate-500 mt-0.5">
            Dispatches immediately to Aster Residence security &amp; concierge console
          </p>
        </div>

        {/* Quick Demo Presets (Section 6 Storyline 2 Requirement) */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-livin-navy text-[11px]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Judge Demo Presets (1-Click Fill)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => applyPreset('elderly')}
              className="p-2.5 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-left font-semibold text-slate-800 transition-all text-[11px]"
            >
              👵 Elderly Parent SOS
              <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Senior dizziness check</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('child')}
              className="p-2.5 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-left font-semibold text-slate-800 transition-all text-[11px]"
            >
              🧒 Child Needs Help
              <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Playground escort</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('oku')}
              className="p-2.5 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-left font-semibold text-slate-800 transition-all text-[11px]"
            >
              ♿ OKU Accessibility
              <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Lobby ramp setup</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleOpenConfirm} className="space-y-6">
          {/* Step 1: Who needs help? (Section 4.C) */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-2">
              1. Who Needs Help?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {whoOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setWho(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    who === opt.id
                      ? 'border-livin-navy bg-sky-50 text-livin-navy font-bold ring-1 ring-livin-navy'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Type of help (Section 4.C) */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-2">
              2. Type of Assistance Needed
            </label>
            <div className="space-y-2">
              {helpTypes.map((ht) => {
                const Icon = ht.icon;
                const isSelected = type === ht.id;
                return (
                  <label
                    key={ht.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? ht.priority === 'Urgent'
                          ? 'border-rose-500 bg-rose-50/70 ring-1 ring-rose-500 text-rose-950 font-bold'
                          : 'border-livin-navy bg-sky-50/70 ring-1 ring-livin-navy text-slate-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="help-type"
                        checked={isSelected}
                        onChange={() => setType(ht.id)}
                        className="text-livin-navy focus:ring-livin-navy"
                      />
                      <Icon className="w-4 h-4 text-slate-600" />
                      <span>{ht.label}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ht.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ht.priority}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step 3: Location (Section 4.C) */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-2">
              3. Location in Compound
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-livin-navy"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc} (Aster Residence)</option>
              ))}
            </select>
          </div>

          {/* Step 4: Optional Short Note (No medical diagnosis required) */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-1.5">
              4. Optional Short Note <span className="text-slate-400 font-normal lowercase">(no diagnosis required)</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Elderly resident feels dizzy; please bring wheelchair and check vitals..."
              className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
            />
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 group"
          >
            <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Trigger Demo Alert / Send Help Request</span>
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        isUrgent={type.includes('urgent') || type.includes('Safety')}
        title="Confirm Dispatching Assistance Alert"
        message={`Send assistance alert for "${who}" at "${location}"? Aster Residence operations desk will be notified immediately.`}
        confirmText="Confirm & Dispatch"
      />
    </div>
  );
};
