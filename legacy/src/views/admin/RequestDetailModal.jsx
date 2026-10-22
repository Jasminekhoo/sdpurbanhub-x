import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  Building, 
  MessageSquare, 
  Send,
  Check,
  MapPin,
  Radio
} from 'lucide-react';

export const RequestDetailModal = ({ request, onClose }) => {
  const { staffResponders, updateRequestStatus, acknowledgeAlert } = useApp();

  const [selectedStatus, setSelectedStatus] = useState(request.status);
  const [selectedStaff, setSelectedStaff] = useState(
    request.assignedTo === 'Unassigned' ? staffResponders[0].name : request.assignedTo
  );
  const [internalNote, setInternalNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Statuses from Section 4.C & 5.B: Received -> Assigned -> Assistance on the way -> Resolved
  const statuses = [
    'Received',
    'Assigned',
    'Assistance on the way',
    'Resolved',
    'Closed'
  ];

  const handleFastAcknowledge = () => {
    acknowledgeAlert(request.id);
    setSelectedStatus('Assigned');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleApplyChanges = (e) => {
    e.preventDefault();
    updateRequestStatus(request.id, selectedStatus, selectedStaff, internalNote);
    setInternalNote('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-livin-navy bg-slate-100 px-2 py-0.5 rounded">
                {request.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                request.priority === 'Urgent' 
                  ? 'bg-rose-100 text-rose-700' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {request.priority.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold bg-sky-50 text-livin-navy">
                {request.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              {request.category}
            </h2>
            <div className="text-slate-500 font-medium mt-0.5">
              Subject: <strong>{request.personName || request.who}</strong> ({request.who})
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Urgent Alert Banner & Fast Acknowledge Action (Storyline 1 Requirement) */}
        {request.status === 'Received' && (
          <div className="my-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-rose-950 block">
                  Action Required: Alert Awaiting Management Acknowledgement
                </span>
                <span className="text-[11px] text-rose-800">
                  Click Acknowledge to assign response officer and advance status to Assigned.
                </span>
              </div>
            </div>
            <button
              onClick={handleFastAcknowledge}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              Acknowledge Alert
            </button>
          </div>
        )}

        {/* Resident & Unit Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Resident / Unit</span>
            <span className="font-bold text-slate-900">{request.residentName} ({request.unit})</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Compound Location</span>
            <span className="font-bold text-slate-900">{request.location}</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Source Channel</span>
            <span className="font-bold text-slate-900">{request.source || 'Resident App'}</span>
          </div>
        </div>

        {/* Request Description */}
        <div className="mb-4">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
            Resident-Provided Case Note
          </span>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
            {request.description}
          </div>
        </div>

        {/* Admin Controls: Status, Assign Staff & Add Note */}
        <form onSubmit={handleApplyChanges} className="p-4 sm:p-5 bg-sky-50/50 rounded-2xl border border-sky-100 my-4 space-y-4">
          <div className="font-bold uppercase tracking-wider text-livin-navy text-[11px]">
            Operations Dispatch Controls
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Status Selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Advance Status (Timeline Flow)
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full font-bold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Responder Assignment */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Assign Responder Team
              </label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
              >
                {staffResponders.map(staff => (
                  <option key={staff.id} value={`${staff.name} (${staff.role})`}>
                    {staff.name} — {staff.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Internal Action Note */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Internal Action Note <span className="text-slate-400 font-normal">(appends to resident &amp; family timeline)</span>
            </label>
            <input
              type="text"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="e.g. Officer dispatched with first aid kit; responder en route to Level 12..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-livin-navy hover:bg-livin-navy-dark text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Timeline Updated & Notified' : 'Update Status & Notify Resident/Family'}</span>
          </button>
        </form>

        {/* Activity History */}
        <div className="pt-3 border-t border-slate-100">
          <h4 className="font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-livin-navy" />
            <span>Audit History &amp; Notification Trail ({request.activityHistory.length})</span>
          </h4>

          <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
            {request.activityHistory.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-3 pl-1">
                <div className="w-5 h-5 rounded-full bg-livin-navy text-white flex items-center justify-center text-[10px] font-bold z-10">
                  •
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900">{item.action}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{item.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Actor: <span className="text-slate-700 font-bold">{item.actorRole}</span>
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 mt-1 italic">
                      "{item.note}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
