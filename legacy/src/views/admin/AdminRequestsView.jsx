import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  Calendar
} from 'lucide-react';
import { RequestDetailModal } from './RequestDetailModal';

export const AdminRequestsView = () => {
  const { requests } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'SOS' | 'Security' | 'Accessibility' | 'Facility'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeModalRequest, setActiveModalRequest] = useState(null);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.personName && req.personName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      req.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' ? true : req.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' ? true : req.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 animate-pulse">Received</span>;
      case 'Assigned':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">Assigned</span>;
      case 'Assistance on the way':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 animate-pulse">On the Way</span>;
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Alerts &amp; Cases Inbox
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Complete filterable incident register across all residential towers
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Case ID (e.g. LC-1001), resident, location, keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy font-medium"
            />
          </div>

          {/* Type Filter (SOS / Security / Accessibility / Facility - Section 5.B) */}
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
            >
              <option value="ALL">All Types</option>
              <option value="SOS">🚨 SOS Urgent</option>
              <option value="Security">🔒 Security</option>
              <option value="Accessibility">♿ Accessibility</option>
              <option value="Facility">🔧 Facility</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-livin-navy"
            >
              <option value="ALL">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Assigned">Assigned</option>
              <option value="Assistance on the way">Assistance on the way</option>
              <option value="Resolved">Resolved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.length}</strong> cases</span>
          {(searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-livin-navy font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Required Table Columns (Section 5.B) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3.5 px-4 font-bold">Case ID</th>
                <th className="py-3.5 px-4 font-bold">Type</th>
                <th className="py-3.5 px-4 font-bold">Resident / Unit</th>
                <th className="py-3.5 px-4 font-bold">Person Needing Help</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold">Priority</th>
                <th className="py-3.5 px-4 font-bold">Submitted Time</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr 
                  key={req.id}
                  onClick={() => setActiveModalRequest(req)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-livin-navy">
                    {req.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.type === 'SOS' ? 'bg-rose-100 text-rose-800' :
                      req.type === 'Security' ? 'bg-amber-100 text-amber-800' :
                      req.type === 'Accessibility' ? 'bg-sky-100 text-livin-navy' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {req.type || 'SOS'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{req.residentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{req.unit}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{req.who}</span>
                    {req.personName && <div className="text-[10px] text-slate-500">{req.personName}</div>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {req.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveModalRequest(req)}
                      className="px-3 py-1.5 bg-livin-navy hover:bg-livin-navy-dark text-white font-bold rounded-xl transition-colors shadow-xs"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeModalRequest && (
        <RequestDetailModal
          request={activeModalRequest}
          onClose={() => setActiveModalRequest(null)}
        />
      )}
    </div>
  );
};
