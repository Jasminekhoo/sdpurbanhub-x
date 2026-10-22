import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { GoogleMapsTownshipView } from '../../components/GoogleMapsTownshipView';
import { HAZARD_STATUSES } from '../../data/nightSafeData';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  Plus,
  Info,
  ChevronRight,
  Phone,
  Edit3,
  Layers,
  History,
  ChevronDown
} from 'lucide-react';

export function HazardReportView() {
  const { 
    hazards, 
    submitHazardReport, 
    residentTab, 
    setResidentTab, 
    showToast 
  } = useNightSafe();

  const titlePresets = [
    "Broken street lamp cover",
    "Severely cracked pedestrian pathway",
    "Overgrown vegetation blocking sightline",
    "Dark pathway / unlit area",
    "Uneven pavers / trip hazard"
  ];

  const defaultLocations = [
    { label: "Junction L-04 (Central Boulevard)", node: "L-04", category: "Lighting deficiency / faulty streetlight" },
    { label: "Garden Shortcut Path (Lamp L-06)", node: "L-06", category: "Obstructed sightline" },
    { label: "Garden Shortcut midpoint", node: "L-06", category: "Damaged / discontinuous pedestrian path" },
    { label: "North Avenue Pedestrian Walkway (Lamp L-03)", node: "L-03", category: "Lighting deficiency / faulty streetlight" },
    { label: "Central Transit Stop Approach (Lamp L-08)", node: "L-08", category: "Lighting deficiency / faulty streetlight" },
    { label: "Community Residence Entrance (Lamp L-01)", node: "L-01", category: "Other environmental concern" }
  ];

  const [title, setTitle] = useState("Broken street lamp cover");
  const [category, setCategory] = useState("Lighting deficiency / faulty streetlight");
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [location, setLocation] = useState("Junction L-04 (Central Boulevard)");
  const [customLocationText, setCustomLocationText] = useState("");
  const [affectedNode, setAffectedNode] = useState("L-04");
  const [severity, setSeverity] = useState("High");
  const [description, setDescription] = useState("Lamp is not providing consistent illumination along pedestrian walkway.");
  const [contactInfo, setContactInfo] = useState("");
  const [photoAttached, setPhotoAttached] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalLocation = isCustomLocation ? customLocationText.trim() : location;
    if (!finalLocation) {
      showToast('Please specify a location.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Please provide a brief description of the issue.', 'error');
      return;
    }

    const created = submitHazardReport({
      title: title.trim() || `${category.split('/')[0].trim()} at ${finalLocation}`,
      category,
      location: finalLocation,
      affectedNode: isCustomLocation ? 'L-04' : affectedNode,
      severity,
      description,
      contactInfo: contactInfo.trim()
    });

    setSubmittedReport(created);
  };

  // Local state for R10 tab & filter
  const [historyTab, setHistoryTab] = useState('reports'); // 'reports' | 'journeys'
  const [reportStatusFilter, setReportStatusFilter] = useState('all');
  const [selectedReportId, setSelectedReportId] = useState(null);

  // -------------------------------------------------------------
  // SCREEN R10: MY REPORTS & HISTORY
  // -------------------------------------------------------------
  if (residentTab === 'my-reports') {
    const filteredReports = hazards.filter(h => {
      if (reportStatusFilter === 'all') return true;
      return h.status.toLowerCase() === reportStatusFilter.toLowerCase();
    });

    const mockJourneyHistory = [
      {
        id: "JH-101",
        date: "Today",
        route: "Route A — Main Avenue",
        startTime: "8:35 PM",
        endTime: "8:44 PM",
        duration: "9 min",
        checkpointsRecorded: "L-01 → L-02 → L-03 → L-04 → L-08",
        status: "Completed Safely"
      },
      {
        id: "JH-102",
        date: "Yesterday",
        route: "Route B — Garden Shortcut",
        startTime: "9:10 PM",
        endTime: "9:18 PM",
        duration: "8 min",
        checkpointsRecorded: "L-01 → L-05 → L-06 → L-07 → L-08",
        status: "Completed (Check-in logged)"
      }
    ];

    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Reports & History</h2>
            <p className="text-xs text-slate-500">Tracked observations and pedestrian walks</p>
          </div>
          <button
            onClick={() => setResidentTab('report')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2864A6] text-white text-xs font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Report</span>
          </button>
        </div>

        {/* Tab switch between Reports and Journey History */}
        <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold border border-slate-200">
          <button
            onClick={() => setHistoryTab('reports')}
            className={`flex-1 py-1.5 rounded-md transition ${historyTab === 'reports' ? 'bg-white text-[#2864A6] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Hazard Reports ({hazards.length})
          </button>
          <button
            onClick={() => setHistoryTab('journeys')}
            className={`flex-1 py-1.5 rounded-md transition ${historyTab === 'journeys' ? 'bg-white text-[#2864A6] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Journey History (2)
          </button>
        </div>

        {/* Reports Tab */}
        {historyTab === 'reports' && (
          <div className="space-y-3">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
              {['all', ...HAZARD_STATUSES].map((st) => (
                <button
                  key={st}
                  onClick={() => setReportStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition capitalize font-semibold ${
                    reportStatusFilter === st
                      ? 'bg-[#2864A6] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredReports.map((h) => {
                const isSelected = selectedReportId === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedReportId(isSelected ? null : h.id)}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 cursor-pointer hover:border-[#2864A6] transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          h.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {h.severity}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{h.id}: {h.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        h.status === 'Verified' || h.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : h.status === 'In progress'
                          ? 'bg-sky-100 text-[#2864A6]'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {h.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">{h.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {h.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {h.timestamp}
                      </span>
                    </div>

                    {/* Expandable Report Detail Drawer */}
                    {isSelected && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200 bg-slate-50/80 -mx-3.5 -mb-3.5 p-3 rounded-b-xl text-xs space-y-1.5 animate-fadeIn">
                        <div className="text-[10px] font-bold uppercase text-slate-400">Audit & Management Verification:</div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>Source: <strong>{h.source}</strong></div>
                          <div>Confidence: <strong>{h.evidenceConfidence}</strong></div>
                          <div>Severity: <strong>{h.severity}</strong></div>
                          <div>Assigned Action: <strong>{h.pairedInterventionId ? `Package ${h.pairedInterventionId}` : 'Under Review'}</strong></div>
                        </div>

                        {/* Map Geolocation */}
                        <div className="h-28 w-full rounded-lg border border-slate-200 overflow-hidden relative mt-1.5 bg-slate-100">
                          <GoogleMapsTownshipView
                            theme="day"
                            currentCheckpointNode={h.affectedNode || null}
                            activeLamps={h.affectedNode ? [h.affectedNode] : []}
                            hazards={[h]}
                            height="100%"
                            showOverlayLabels={false}
                            showHeader={false}
                          />
                        </div>

                        <div className="text-[10px] text-slate-400 italic pt-1">
                          Updates sync dynamically with Property Management decisions.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Journey History Tab */}
        {historyTab === 'journeys' && (
          <div className="space-y-2.5">
            {mockJourneyHistory.map((jh) => (
              <div key={jh.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{jh.route}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {jh.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Time: {jh.date} · {jh.startTime} to {jh.endTime} ({jh.duration})
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono">
                  Checkpoints: {jh.checkpointsRecorded}
                </div>
                <div className="text-[10px] text-slate-400">
                  Telemetry archived under strict journey-only privacy policy.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN R9: HAZARD REPORT FORM (Card Only)
  // -------------------------------------------------------------
  return (
    <div className="pb-20 pt-1">
      {submittedReport ? (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3 shadow-sm animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-emerald-950">Report Submitted Successfully</h3>
          <div className="text-xs text-emerald-900 space-y-1">
            <p>Title: <strong>{submittedReport.title}</strong></p>
            <p>Location: <strong>{submittedReport.location}</strong></p>
            {submittedReport.contactInfo && (
              <p>Contact: <strong>{submittedReport.contactInfo}</strong></p>
            )}
            <p>Report ID: <strong className="font-mono">{submittedReport.id}</strong></p>
            <p className="text-[11px] text-emerald-800 pt-1">
              This report is recorded and visible to the community and management.
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setSubmittedReport(null)}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
            >
              Submit Another Report
            </button>
            <button
              onClick={() => setResidentTab('home')}
              className="py-2 px-3 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition cursor-pointer"
            >
              Back to Feed
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
          {/* Title (Selectable presets + Editable input) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                <span>Issue Title</span>
              </label>
              <span className="text-[10px] text-slate-400">Select preset or edit</span>
            </div>

            {/* Title Presets Chips */}
            <div className="flex flex-wrap gap-1 pb-1">
              {titlePresets.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => {
                    setTitle(preset);
                    if (preset.toLowerCase().includes('lamp') || preset.toLowerCase().includes('light')) {
                      setCategory("Lighting deficiency / faulty streetlight");
                    } else if (preset.toLowerCase().includes('vegetation') || preset.toLowerCase().includes('sightline')) {
                      setCategory("Obstructed sightline");
                    } else if (preset.toLowerCase().includes('pathway') || preset.toLowerCase().includes('pavers')) {
                      setCategory("Damaged / discontinuous pedestrian path");
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    title === preset
                      ? 'bg-[#2864A6] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Editable Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken street lamp cover at walkway"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
            />
          </div>

          {/* Location (Default categories/presets or Customize) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Location</span>
              </label>

              {/* Mode Toggle: Default vs Custom */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setIsCustomLocation(false)}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    !isCustomLocation ? 'bg-white text-[#2864A6] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Default
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomLocation(true)}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    isCustomLocation ? 'bg-white text-[#2864A6] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {!isCustomLocation ? (
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  const match = defaultLocations.find(l => l.label === e.target.value);
                  if (match) {
                    setAffectedNode(match.node);
                    if (match.category) setCategory(match.category);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition cursor-pointer"
              >
                {defaultLocations.map(loc => (
                  <option key={loc.label} value={loc.label}>{loc.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customLocationText}
                onChange={(e) => setCustomLocationText(e.target.value)}
                placeholder="Enter custom location (e.g. Near Block C lift lobby walkway)"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
              />
            )}

            {/* Google Map Location Preview */}
            <div className="h-32 w-full rounded-xl border border-slate-200 overflow-hidden relative mt-1.5 bg-slate-100">
              <GoogleMapsTownshipView
                theme="day"
                currentCheckpointNode={affectedNode}
                activeLamps={[affectedNode]}
                height="100%"
                showOverlayLabels={false}
                showHeader={false}
              />
              <div className="absolute top-1.5 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md border border-slate-200 shadow-2xs flex items-center gap-1 z-10 pointer-events-none">
                <MapPin className="w-2.5 h-2.5 text-[#2864A6]" />
                <span className="text-[9px] font-bold text-slate-700">Location Preview ({affectedNode}) · Google Maps</span>
              </div>
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Perceived Severity</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    severity === s
                      ? s === 'High'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-2xs'
                        : s === 'Medium'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-2xs'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
              placeholder="Describe condition, lighting deficit, or pavement irregularity..."
            />
          </div>

          {/* Contact Info (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                <span>Contact Info (Optional)</span>
              </label>
              <span className="text-[10px] text-slate-400">Optional</span>
            </div>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="e.g. +60 12-389 4521 or Unit 12-08"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
            />
          </div>

          {/* Photo attachment placeholder */}
          <div 
            onClick={() => {
              setPhotoAttached(!photoAttached);
              showToast(photoAttached ? 'Demo photo removed' : 'Simulated photo attached', 'info');
            }}
            className="p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 cursor-pointer text-center text-xs text-slate-600 flex items-center justify-center gap-2 transition"
          >
            <Camera className="w-4 h-4 text-slate-400" />
            <span>{photoAttached ? '✓ Photo Attached: inspection_site.jpg' : 'Attach Photo (Optional)'}</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            Submit Hazard Report
          </button>
        </form>
      )}

      {/* Past Records Section (1-2 recent records) */}
      <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#2864A6]" />
            <span className="text-xs font-bold text-slate-800">Recent Past Reports</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {hazards.slice(0, 2).length}
            </span>
          </div>
          <button
            onClick={() => setResidentTab('home')}
            className="text-[11px] font-semibold text-[#2864A6] hover:underline cursor-pointer"
          >
            View in Feed →
          </button>
        </div>

        <div className="space-y-2">
          {hazards.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {item.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  item.status === 'Verified' || item.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'In progress'
                    ? 'bg-sky-100 text-[#2864A6]'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.status || 'Reported'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <div className="flex items-center gap-1 truncate max-w-[190px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{item.reportDate || '18 Oct 2026'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
