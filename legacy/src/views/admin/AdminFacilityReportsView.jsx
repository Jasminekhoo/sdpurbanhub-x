import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';

export const AdminFacilityReportsView = () => {
  const { facilityReports, showToast } = useApp();

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-800 text-[11px]">
          <Wrench className="w-4 h-4 text-amber-600" />
          <span>Facility &amp; Accessibility Barriers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Facility Maintenance &amp; Barrier Reports
        </h1>
        <p className="text-slate-500 font-medium">
          Resident-reported physical barriers, lifts, wheelchair ramps, and compound lighting
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3.5 px-4 font-bold">Report ID</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold">Issue Description</th>
                <th className="py-3.5 px-4 font-bold">Reported By</th>
                <th className="py-3.5 px-4 font-bold">Reported Time</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilityReports.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-livin-navy">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {item.location}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {item.reportedBy}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {item.reportedAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
