import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  ArrowRight, 
  Filter, 
  ShieldAlert, 
  Radio, 
  Wrench,
  Users,
  ChevronRight
} from 'lucide-react';
import { RequestDetailModal } from './RequestDetailModal';

export const AdminDashboard = () => {
  const { requests, facilityReports, acknowledgeAlert, navigate, openHomeConsole } = useApp();

  const [activeModalRequest, setActiveModalRequest] = useState(null);

  // Dynamic KPI summary cards (Section 5.A Requirement)
  const openUrgentAlerts = requests.filter(r => r.priority === 'Urgent' && r.status !== 'Resolved' && r.status !== 'Cancelled');
  const awaitingAssignment = requests.filter(r => r.status === 'Received');
  const activeAssistanceCases = requests.filter(r => r.status === 'Assigned' || r.status === 'Assistance on the way');
  const facilityIssuesAwaiting = facilityReports.filter(f => f.status !== 'Resolved');

  const recentRequests = requests.slice(0, 5);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 animate-pulse">Received</span>;
      case 'Assigned':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800">Assigned</span>;
      case 'Assistance on the way':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 animate-pulse">On the Way</span>;
      case 'Resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Resolved</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* 1. Header with Property Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-purple-700 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span>Operations &amp; Security Console</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono">Aster Residence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Community Operations Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Proactive care response, accessibility requests, and facility barriers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openHomeConsole}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Test Console SOS (Storyline 1)</span>
          </button>
        </div>
      </div>

      {/* 2. Four Required Summary Cards (Section 5.A Requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Open urgent alerts */}
        <div className={`p-5 rounded-3xl border shadow-sm transition-all ${
          openUrgentAlerts.length > 0 
            ? 'bg-rose-50/70 border-rose-300 text-rose-950' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[11px] text-rose-700">
              Open Urgent Alerts
            </span>
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              openUrgentAlerts.length > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-mono font-extrabold mt-2 text-rose-600">
            {openUrgentAlerts.length}
          </div>
          <div className="text-[11px] text-rose-800 font-semibold mt-1">
            {openUrgentAlerts.length > 0 ? 'Immediate action required' : 'Perimeter calm'}
          </div>
        </div>

        {/* Card 2: Help requests awaiting assignment */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-600">
              Awaiting Assignment
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-mono font-extrabold text-slate-900 mt-2">
            {awaitingAssignment.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cases status: Received
          </div>
        </div>

        {/* Card 3: Active assistance cases */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-600">
              Active Assistance Cases
            </span>
            <span className="w-8 h-8 rounded-xl bg-sky-50 text-livin-navy flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-mono font-extrabold text-slate-900 mt-2">
            {activeAssistanceCases.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Assigned or en route
          </div>
        </div>

        {/* Card 4: Facility issues awaiting action */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-600">
              Facility Issues
            </span>
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-mono font-extrabold text-slate-900 mt-2">
            {facilityIssuesAwaiting.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Ramps, lifts &amp; lights
          </div>
        </div>
      </div>

      {/* 3. Urgent Alerts Banner (Storyline 1 Requirement) */}
      {openUrgentAlerts.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 shadow-sm animate-fade-in space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
            <h2 className="font-extrabold text-rose-950 text-sm">
              Urgent Incident Notifications ({openUrgentAlerts.length})
            </h2>
          </div>

          <div className="space-y-3">
            {openUrgentAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="bg-white rounded-2xl p-4 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      {alert.id}
                    </span>
                    <span className="font-bold text-slate-900">{alert.category}</span>
                    <span className="text-slate-400 font-mono">· {alert.location}</span>
                  </div>
                  <p className="text-slate-700 font-medium mt-1">
                    {alert.description}
                  </p>
                  <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-2">
                    <span>Target: <strong className="text-slate-800">{alert.personName || alert.who}</strong></span>
                    <span>·</span>
                    <span>Source: <strong className="text-livin-navy">{alert.source || 'App'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status === 'Received' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs"
                    >
                      Acknowledge &amp; Assign
                    </button>
                  )}
                  <button
                    onClick={() => setActiveModalRequest(alert)}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors whitespace-nowrap"
                  >
                    Manage &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Recent Alerts and Cases Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Incident &amp; Assistance Feed</h3>
            <p className="text-slate-500">Live synchronized feed across all residential blocks</p>
          </div>
          <button
            onClick={() => navigate('/admin/requests')}
            className="text-livin-navy font-bold hover:underline"
          >
            Open Full Inbox &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-3">Case ID</th>
                <th className="py-3 px-3">Resident / Person</th>
                <th className="py-3 px-3">Type / Category</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-livin-navy">
                    {req.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{req.personName || req.residentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{req.unit}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800">{req.category}</span>
                    <span className="block text-[10px] text-slate-500">{req.who}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {req.location}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-semibold">
                    {req.assignedTo || 'Unassigned'}
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setActiveModalRequest(req)}
                      className="px-2.5 py-1 font-bold text-livin-navy bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {activeModalRequest && (
        <RequestDetailModal
          request={activeModalRequest}
          onClose={() => setActiveModalRequest(null)}
        />
      )}
    </div>
  );
};
