import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HandHeart, 
  Accessibility, 
  Building, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  UserCheck, 
  Info,
  Clock
} from 'lucide-react';

export const AssistanceRequestView = () => {
  const { currentUser, createRequest, navigate } = useApp();

  const assistanceCategories = [
    {
      id: 'Accessibility Support',
      label: 'Accessibility Support',
      desc: 'Wheelchair ramp setup, sensory accessibility, or tactile guidance'
    },
    {
      id: 'Mobility Assistance',
      label: 'Mobility Assistance',
      desc: 'Physical escort, heavy item carrying, or temporary mobility aids'
    },
    {
      id: 'Shared Facilities',
      label: 'Shared Facilities',
      desc: 'Accessible pool lift, lift mechanics, or clubhouse ramp barriers'
    },
    {
      id: 'Community or Property Issue',
      label: 'Community or Property Issue',
      desc: 'Corridor obstruction, lighting repair, or safety handrail loose'
    },
    {
      id: 'Other Assistance',
      label: 'Other Assistance',
      desc: 'General proactive concierge support for residents'
    }
  ];

  const contactMethods = [
    { id: 'In-person assistance', label: 'In-person assistance', icon: UserCheck },
    { id: 'Phone call', label: 'Phone call', icon: Phone },
    { id: 'Text', label: 'Text message', icon: MessageSquare },
    { id: 'No preference', label: 'No preference', icon: HelpCircle }
  ];

  const [selectedCategory, setSelectedCategory] = useState('Accessibility Support');
  const [description, setDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState('In-person assistance');
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = createRequest({
      category: selectedCategory,
      description: description || `Resident requested ${selectedCategory}.`,
      priority: 'Normal',
      preferredContact
    });
    setSubmittedRequest(created);
  };

  if (submittedRequest) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
          Request Logged Successfully
        </span>

        <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
          Assistance Request Received
        </h2>

        {/* Unique Request ID */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Service Tracking ID
          </div>
          <div className="text-3xl font-mono font-extrabold text-livin-navy mt-1">
            {submittedRequest.id}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Status: Submitted (Visible in Admin Console)</span>
          </div>
        </div>

        <div className="text-left text-xs bg-slate-50/60 rounded-xl p-4 border border-slate-100 space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-500">Category:</span>
            <span className="font-semibold text-slate-800">{submittedRequest.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Contact Preference:</span>
            <span className="font-semibold text-slate-800">{submittedRequest.preferredContact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Unit:</span>
            <span className="font-mono text-slate-800">{submittedRequest.unit}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/resident/requests')}
            className="flex-1 py-3 px-4 bg-livin-navy hover:bg-livin-navy-dark text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            View in My Requests &rarr;
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
      <button
        onClick={() => navigate('/resident/home')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Resident Home</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-livin-navy flex items-center justify-center">
            <HandHeart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Request Community Assistance
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Inclusive support for mobility, accessibility, or shared residential facilities
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Assistance Category
            </label>
            <div className="space-y-2">
              {assistanceCategories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedCategory === cat.id
                      ? 'border-livin-navy bg-sky-50/50 ring-1 ring-livin-navy'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="assistance-cat"
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    className="mt-0.5 text-livin-navy focus:ring-livin-navy"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{cat.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Specific Requirements / Location Note <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Visiting elderly relative requires wheelchair ramp assistance at Tower B ground lobby entrance tomorrow at 10 AM..."
              className="w-full p-3.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy transition-all"
            />
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Preferred Contact Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {contactMethods.map((cm) => {
                const Icon = cm.icon;
                const isSelected = preferredContact === cm.id;
                return (
                  <button
                    key={cm.id}
                    type="button"
                    onClick={() => setPreferredContact(cm.id)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-livin-navy bg-sky-50 text-livin-navy font-semibold ring-1 ring-livin-navy'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[11px]">{cm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              UrbanHub-X collects only the minimal information required to dispatch assistance. No invasive personal data is stored.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-livin-navy hover:bg-livin-navy-dark text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            Submit Assistance Request
          </button>
        </form>
      </div>
    </div>
  );
};
