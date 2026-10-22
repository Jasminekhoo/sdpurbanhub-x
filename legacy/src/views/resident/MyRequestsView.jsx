import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  X, 
  Plus,
  Calendar,
  XCircle
} from 'lucide-react';

export const MyRequestsView = () => {
  const { requests, currentUser, navigate, cancelRequest } = useApp();

  const [filter, setFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const residentRequests = requests.filter(
    r => r.residentName === (currentUser?.name || 'Alex Chen')
  );

  const filteredRequests = residentRequests.filter(r => {
    if (filter === 'Active') return r.status !== 'Resolved' && r.status !== 'Cancelled';
    if (filter === 'Resolved') return r.status === 'Resolved';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 animate-pulse">Received</span>;
      case 'Assigned':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">Assigned</span>;
      case 'Assistance on the way':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 animate-pulse">Assistance on the way</span>;
      case 'Resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Resolved</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Requests &amp; Care Progress
          </h1>
          <p className="text-slate-500 font-medium">
            Live progress synchronized with Aster Residence Management Dashboard
          </p>
        </div>

        <button
          onClick={() => navigate('/resident/request-help')}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Care Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-slate-200/70 rounded-xl w-fit font-bold">
        {['All', 'Active', 'Resolved'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === tab
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
            <span className="ml-1 text-[11px] text-slate-400">
              ({
                tab === 'All' ? residentRequests.length :
                tab === 'Active' ? residentRequests.filter(r => r.status !== 'Resolved' && r.status !== 'Cancelled').length :
                residentRequests.filter(r => r.status === 'Resolved').length
              })
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No requests found</h3>
          <p className="text-slate-500 mt-1">Everything is in order.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-livin-navy/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-livin-navy bg-slate-100 px-2 py-0.5 rounded">
                    {req.id}
                  </span>
                  <span className="font-bold text-slate-900">
                    {req.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-livin-navy">
                    For: {req.who}
                  </span>
                  {req.priority === 'Urgent' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700">
                      URGENT
                    </span>
                  )}
                </div>

                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="text-slate-600 font-semibold">
                    Location: {req.location}
                  </span>
                  {req.assignedTo && req.assignedTo !== 'Unassigned' && (
                    <span className="text-livin-navy font-bold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      Assigned: {req.assignedTo}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {getStatusBadge(req.status)}
                <button
                  type="button"
                  className="text-livin-navy font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>View Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-livin-navy bg-slate-100 px-2 py-0.5 rounded">
                    {selectedRequest.id}
                  </span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {selectedRequest.category} ({selectedRequest.who})
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & metadata */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] font-bold uppercase block mb-0.5">Details</span>
                <p className="text-slate-700 leading-relaxed">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Location</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.location}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Source</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.source || 'Resident App'}</span>
                </div>
              </div>

              {selectedRequest.assignedTo && selectedRequest.assignedTo !== 'Unassigned' && (
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-livin-navy" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-livin-navy block">Assigned Responder</span>
                    <span className="font-bold text-slate-900">{selectedRequest.assignedTo}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chronological Activity History */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-livin-navy" />
                <span>Status &amp; Notification History ({selectedRequest.activityHistory.length})</span>
              </h4>

              <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                {selectedRequest.activityHistory.map((item, idx) => (
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
                        By: <span className="text-slate-700">{item.actorRole}</span>
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

            {/* Cancel Button if not resolved */}
            {selectedRequest.status !== 'Resolved' && selectedRequest.status !== 'Cancelled' && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    cancelRequest(selectedRequest.id);
                    setSelectedRequest(null);
                  }}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-colors"
                >
                  Cancel Request (Accidental Trigger)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
