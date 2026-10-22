import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  HeartPulse, 
  ShieldAlert, 
  Accessibility, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  PhoneCall, 
  Clock,
  Info
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const EmergencyRequestView = () => {
  const { currentUser, createRequest, navigate } = useApp();

  const emergencyCategories = [
    {
      id: 'Medical Assistance',
      label: 'Medical Assistance',
      icon: HeartPulse,
      desc: 'Immediate on-site first aid, vitals check, or fall assistance'
    },
    {
      id: 'Immediate Safety Concern',
      label: 'Immediate Safety Concern',
      icon: ShieldAlert,
      desc: 'Suspicious individual, security incident, or perimeter alarm'
    },
    {
      id: 'Mobility Assistance',
      label: 'Mobility Assistance',
      icon: Accessibility,
      desc: 'Urgent lift stall, wheelchair transfer, or physical barrier trap'
    },
    {
      id: 'Other Urgent Help',
      label: 'Other Urgent Help',
      icon: HelpCircle,
      desc: 'Immediate emergency requiring urgent guardhouse team dispatch'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('Medical Assistance');
  const [description, setDescription] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    const created = createRequest({
      category: selectedCategory,
      description: description || `Urgent assistance requested for ${selectedCategory}.`,
      priority: 'Urgent',
      preferredContact: 'In-person assistance (Immediate responder dispatch)'
    });
    setSubmittedRequest(created);
  };

  // If already submitted in this view, render the clear success & confirmation screen
  if (submittedRequest) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 uppercase tracking-wider">
          Urgent Alert Dispatched
        </span>

        <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
          Emergency Assistance Sent
        </h2>

        {/* Unique Request ID */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Emergency Tracking ID
          </div>
          <div className="text-3xl font-mono font-extrabold text-slate-900 mt-1">
            {submittedRequest.id}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Status: Awaiting Acknowledgement by Admin Console</span>
          </div>
        </div>

        {/* Location & Details */}
        <div className="text-left text-xs bg-slate-50/60 rounded-xl p-4 border border-slate-100 space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-500">Residence / Unit:</span>
            <span className="font-semibold text-slate-800">{submittedRequest.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Category:</span>
            <span className="font-semibold text-slate-800">{submittedRequest.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Time Logged:</span>
            <span className="font-mono text-slate-800">{new Date(submittedRequest.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Mandatory Hackathon Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-6 text-left flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Hackathon Prototype Notice</span>
            Demo only — this prototype simulates building concierge and guardhouse notifications and does not contact real external emergency services (e.g. 999/BOMBA).
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/resident/requests')}
            className="flex-1 py-3 px-4 bg-livin-navy hover:bg-livin-navy-dark text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Track in My Requests &rarr;
          </button>
          <button
            onClick={() => navigate('/resident/home')}
            className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Top back button */}
      <button
        onClick={() => navigate('/resident/home')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Resident Home</span>
      </button>

      {/* Main card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Request Emergency Assistance
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Alerts Aster Residence on-duty security and first aid response team
            </p>
          </div>
        </div>

        {/* Location badge (pre-filled sample residence/unit) */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs mb-6">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Building2 className="w-4 h-4 text-livin-navy" />
            <span>Pre-filled Dispatch Location:</span>
          </div>
          <span className="font-mono font-semibold text-livin-navy bg-white px-2.5 py-1 rounded-md border border-slate-200">
            {currentUser?.property || 'Aster Residence'} · {currentUser?.unit || 'Tower B · Unit 12-08'}
          </span>
        </div>

        <form onSubmit={handleOpenConfirm} className="space-y-6">
          {/* Emergency Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Select Nature of Emergency
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencyCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${
                      isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{cat.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{cat.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Short Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Short Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Resident feeling severe dizziness; assistance needed at doorway..."
              className="w-full p-3.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Demo disclaimer banner */}
          <div className="p-3.5 rounded-xl bg-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>
              This is a hackathon prototype for Sime Darby Property. Submitting alerts the simulated Admin Operations Console.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 group"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Send Emergency Alert</span>
          </button>
        </form>
      </div>

      {/* Confirmation Dialog before submission (Requirement 4.B) */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        isUrgent={true}
        title="Confirm Emergency Alert Dispatch"
        message={`Are you sure you want to broadcast an urgent "${selectedCategory}" alert for Aster Residence ${currentUser?.unit || 'Tower B · Unit 12-08'}? On-duty staff will be notified immediately.`}
        confirmText="Confirm & Dispatch Alert"
        cancelText="Review"
      />
    </div>
  );
};
