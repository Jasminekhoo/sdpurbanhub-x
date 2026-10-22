import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export const ReportIssueView = () => {
  const { reportFacilityIssue, navigate } = useApp();

  const issueCategories = [
    { id: 'Damaged ramp / accessibility barrier', label: 'Damaged ramp / accessibility barrier', icon: AlertTriangle },
    { id: 'Lift out of service', label: 'Lift out of service', icon: Building2 },
    { id: 'Broken lighting', label: 'Broken lighting / dark corridor', icon: Lightbulb },
    { id: 'Security concern', label: 'Perimeter or security concern', icon: ShieldAlert },
    { id: 'Other facility issue', label: 'Other facility / common area issue', icon: HelpCircle },
  ];

  const [category, setCategory] = useState('Damaged ramp / accessibility barrier');
  const [location, setLocation] = useState('Tower B Podium Walkway');
  const [description, setDescription] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = reportFacilityIssue({
      category,
      location,
      description: description || `Reported ${category} at ${location}.`
    });
    setSubmittedReport(created);
  };

  if (submittedReport) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center animate-fade-in text-xs space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
          Facility Report Logged
        </span>

        <h2 className="text-xl font-extrabold text-slate-900">
          Issue Dispatched to Maintenance
        </h2>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Case Reference</div>
          <div className="text-2xl font-mono font-extrabold text-livin-navy mt-1">{submittedReport.id}</div>
          <div className="text-amber-800 font-semibold mt-1">Status: {submittedReport.status}</div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => navigate('/resident/requests')}
            className="flex-1 py-3 bg-livin-navy hover:bg-livin-navy-dark text-white font-bold rounded-xl transition-colors"
          >
            Track in My Requests &rarr;
          </button>
          <button
            onClick={() => navigate('/resident/home')}
            className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-xs">
      <button
        onClick={() => navigate('/resident/home')}
        className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
            Community Maintenance &amp; Accessibility
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Report a Facility or Accessibility Barrier
          </h1>
          <p className="text-slate-500 mt-0.5">
            Help keep Aster Residence safe, inclusive, and well-maintained
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-2">
              Select Issue Category
            </label>
            <div className="space-y-2">
              {issueCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-livin-navy bg-sky-50 text-livin-navy font-bold ring-1 ring-livin-navy'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="issue-cat"
                      checked={isSelected}
                      onChange={() => setCategory(cat.id)}
                      className="text-livin-navy focus:ring-livin-navy"
                    />
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{cat.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-1.5">
              Specific Location in Compound
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tower B Podium Walkway, Car park B1 Bay 12, Lift #2"
              required
              className="w-full p-3 rounded-xl border border-slate-200 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-livin-navy"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-1.5">
              Description of the Issue
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Anti-slip rubber edge is loose, posing a tripping hazard for wheelchair users or elderly..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
            />
          </div>

          {/* Photo Placeholder */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-1.5">
              Attach Photo <span className="text-slate-400 font-normal lowercase">(optional placeholder)</span>
            </label>
            <div 
              onClick={() => setPhotoAdded(!photoAdded)}
              className="border-2 border-dashed border-slate-300 hover:border-livin-navy rounded-2xl p-4 text-center cursor-pointer transition-colors"
            >
              <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="font-semibold text-slate-700">
                {photoAdded ? '✓ Simulated Photo Attached (barrier-specimen.jpg)' : 'Click to simulate adding photo'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-livin-navy hover:bg-livin-navy-dark text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Submit Facility Report
          </button>
        </form>
      </div>
    </div>
  );
};
