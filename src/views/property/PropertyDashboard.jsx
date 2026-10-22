import React, { useCallback, useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { GoogleMapsTownshipView } from '../../components/GoogleMapsTownshipView';
import {
  SCHEMATIC_NODES,
  SCHEMATIC_ROUTES,
  CANDIDATE_INTERVENTIONS,
  calculateRouteCost
} from '../../data/nightSafeData';
import {
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sliders,
  DollarSign,
  Lightbulb,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Info,
  Footprints,
  Smartphone,
  RotateCcw,
  LayoutDashboard,
  ListChecks,
  Wallet,
  ChevronDown,
  X,
  Maximize2,
  Crown,
  LogOut
} from 'lucide-react';

// The eight M-screens collapsed into three logical nav sections.
// `propertyTab` stays the single source of truth — this is presentation only.
// Evidence feeds rendered on the "Lighting / Corridor" screen. Driven by
// FEED_CATEGORIES so a hazard can never fall outside every group.
const FEED_SECTIONS = [
  {
    feed: 'Light Broken',
    title: 'Streetlight Condition',
    grid: 'grid-cols-1 sm:grid-cols-2',
    emptyText: 'No streetlight condition reports at this time.',
    fallbackCost: '1,500'
  },
  {
    feed: 'Damaged Path',
    title: 'Ground Condition',
    grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    emptyText: 'No ground condition reports at this time.',
    fallbackCost: '2,000'
  },
  {
    feed: 'Overgrown Vege',
    title: 'Overgrown Vegetation',
    grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    emptyText: 'No vegetation obstruction reports at this time.',
    fallbackCost: '800'
  },
  {
    feed: 'Other',
    title: 'Other Environmental Concerns',
    grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    emptyText: 'No other environmental reports at this time.',
    fallbackCost: '1,500'
  }
];

const NAV_GROUPS = [
  {
    id: 'overview-map',
    label: 'Overview & Operations',
    icon: LayoutDashboard,
    items: [
      { id: 'overview', label: 'Management Overview', icon: TrendingUp },
      { id: 'lighting', label: 'Street Condition', icon: Lightbulb }
    ]
  },
  {
    id: 'action-queue',
    label: 'Action Queue',
    icon: ListChecks,
    items: [
      { id: 'reports', label: 'Verification Queue', icon: FileText },
      { id: 'ranking', label: 'Priority Ranking', icon: Sliders }
    ]
  },
  {
    id: 'budget-impact',
    label: 'Budget & Impact',
    icon: Wallet,
    items: [
      { id: 'budget', label: 'Budget & Impact', icon: Wallet }
    ]
  }
];

export function PropertyDashboard() {
  const {
    propertyTab,
    setPropertyTab,
    hazards,
    updateHazardStatus,
    updateHazardMetric,
    budget,
    setBudget,
    optimisedPlan,
    appliedInterventions,
    setAppliedInterventions,
    planApplied,
    applySelectedPlan,
    resetAppliedPlan,
    priorityWeights,
    setPriorityWeights,
    selectedHazardId,
    setSelectedHazardId,
    activeLamps,
    showToast,
    navigateRole,
    resetDemoScenario
  } = useNightSafe();

  // Search & Filters in Reports
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fullscreen map modal
  const [showMapModal, setShowMapModal] = useState(false);

  // Consistent action styling: brand-teal primary vs neutral-outline secondary
  const BTN_PRIMARY =
    'rounded-lg bg-[#1F9D8B] hover:bg-[#178270] text-white font-bold text-xs shadow-sm inline-flex items-center justify-center gap-2 transition-colors';
  const BTN_SECONDARY =
    'rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-sm inline-flex items-center justify-center gap-2 transition-colors';

  // Which nav section owns the current tab (derived — no extra state to desync)
  const activeGroup =
    NAV_GROUPS.find(g => g.items.some(i => i.id === propertyTab)) || NAV_GROUPS[0];

  // Selected Hazard for Inspection
  const activeHazard = hazards.find(h => h.id === selectedHazardId) || hazards[0];
  const handleSelectMapHazard = useCallback(
    (hazard) => setSelectedHazardId(hazard.id),
    [setSelectedHazardId]
  );
  const [selectedRankedId, setSelectedRankedId] = useState('HZ-101');

  // Calculated route impacts (Screen M6)
  const routeACost = calculateRouteCost('A', appliedInterventions);
  const routeBCost = calculateRouteCost('B', appliedInterventions);
  const routeCCost = calculateRouteCost('C', appliedInterventions);

  // Budget two-step view: 'input' | 'results'
  const [budgetView, setBudgetView] = useState(() => (planApplied ? 'results' : 'input'));
  const [selectedPackageId, setSelectedPackageId] = useState('A');

  // Package definitions & calculation helpers
  const packageAIds = optimisedPlan?.selectedIds?.length ? optimisedPlan.selectedIds : ['IN-01', 'IN-02', 'IN-04'];
  const packageBIds = ['IN-03'];
  const packageCIds = ['IN-01', 'IN-05'];

  const getPackageData = (pkgId) => {
    let ids = packageAIds;
    let name = 'Package A: High-Impact Balanced';
    let badge = 'Optimal Knapsack';
    let badgeColor = 'bg-emerald-700 text-white';
    let pillClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let focus = 'Balanced quick-win luminaire repair & landscape trimming';
    let efficiency = '150 RM/pt';

    if (pkgId === 'B') {
      ids = packageBIds;
      name = 'Package B: Footway Infrastructure';
      badge = 'Civil Works Focus';
      badgeColor = 'bg-blue-700 text-white';
      pillClass = 'bg-blue-50 text-blue-700 border-blue-200';
      focus = 'Heavy paver releveling & root excavation along garden shortcut';
      efficiency = '300 RM/pt';
    } else if (pkgId === 'C') {
      ids = packageCIds;
      name = 'Package C: Dark Corridor Relighting';
      badge = 'Capital Lighting Focus';
      badgeColor = 'bg-amber-700 text-white';
      pillClass = 'bg-amber-50 text-amber-700 border-amber-200';
      focus = 'Primary junction lamp repair + supplemental solar bollard luminaires';
      efficiency = '218 RM/pt';
    }

    const selectedItems = CANDIDATE_INTERVENTIONS.filter(it => ids.includes(it.id));
    const totalCost = selectedItems.reduce((acc, it) => acc + it.cost, 0);
    const totalBenefit = selectedItems.reduce((acc, it) => acc + it.modelledBenefit, 0);
    const remainingBudget = Math.max(0, budget - totalCost);

    const excludedItems = CANDIDATE_INTERVENTIONS.filter(it => !ids.includes(it.id)).map(it => {
      let reason = '';
      if (pkgId === 'A') {
        reason = it.cost > remainingBudget
          ? `Exceeds remaining budget (requires RM ${it.cost.toLocaleString()}, RM ${remainingBudget.toLocaleString()} left)`
          : `Lower benefit-to-cost efficiency under 0/1 knapsack weights`;
      } else if (pkgId === 'B') {
        reason = it.cost > remainingBudget
          ? `Budget exhausted by heavy civil footpath repaving (IN-03)`
          : `Excluded: Allocation strictly concentrated on physical pedestrian walkway`;
      } else {
        reason = it.cost > remainingBudget
          ? `Exceeds remaining budget after capital lighting allocation`
          : `Excluded: Allocation strictly focused on luminaire restoration`;
      }
      return { ...it, reason };
    });

    const routeACost = calculateRouteCost('A', ids);
    const routeBCost = calculateRouteCost('B', ids);
    const routeCCost = calculateRouteCost('C', ids);

    return {
      id: pkgId,
      name,
      badge,
      badgeColor,
      pillClass,
      focus,
      efficiency,
      ids,
      selectedItems,
      excludedItems,
      totalCost,
      totalBenefit,
      remainingBudget,
      routeACost,
      routeBCost,
      routeCCost
    };
  };

  const activePackage = getPackageData(selectedPackageId);

  const handleApplyPlan = (pkgId = 'A') => {
    setSelectedPackageId(pkgId);
    const pkg = getPackageData(pkgId);
    applySelectedPlan(pkg.ids);
    setBudgetView('results');
    if (showToast) {
      showToast(`Applied ${pkg.name}! Route impact results updated.`, 'success');
    }
  };

  const handleSelectPackage = (pkgId) => {
    setSelectedPackageId(pkgId);
    const pkg = getPackageData(pkgId);
    applySelectedPlan(pkg.ids);
    if (showToast) {
      showToast(`Selected ${pkg.name}. Results and route impact updated.`, 'info');
    }
  };

  const handleResetBaseline = () => {
    resetAppliedPlan();
    setBudgetView('input');
  };

  // Statistics
  const openHazards = hazards.filter(h => h.status !== 'Resolved').length;
  const highPriority = hazards.filter(h => h.severity === 'High' && h.status !== 'Resolved').length;
  const awaitingVerification = hazards.filter(h => h.status === 'Reported' || h.status === 'Under verification').length;

  // Consolidated summary-bar metrics (replaces the 5 standalone metric cards)
  const summaryMetrics = [
    { label: 'Open Hazards', value: openHazards, hint: 'Lighting & Pathways', valueTone: 'text-slate-900', hintTone: 'text-slate-400' },
    { label: 'High-Priority Items', value: highPriority, hint: 'Require Mitigation', valueTone: 'text-[#C83E4D]', hintTone: 'text-red-600' },
    { label: 'Awaiting Verification', value: awaitingVerification, hint: 'Grounds Check Queue', valueTone: 'text-amber-600', hintTone: 'text-amber-600' },
    { label: 'Illustrative Budget', value: `RM ${budget.toLocaleString()}`, hint: 'Default Allocation', valueTone: 'text-[#2864A6]', hintTone: 'text-sky-600' },
    { label: 'Modelled Route Cost ΔC', value: planApplied ? `-${routeACost.delta} pts` : '0 pts', hint: planApplied ? 'Plan Applied to Simulation' : 'Pending Plan Application', valueTone: 'text-emerald-600', hintTone: 'text-emerald-600' }
  ];

  // Filtered reports
  const filteredHazards = hazards.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || h.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate weighted priority score (Screen M4)
  const calculatePriorityScore = (item) => {
    const sevScore = item.severity === 'High' ? 10 : item.severity === 'Medium' ? 6 : 3;
    const expScore = item.pedestrianExposure === 'High' ? 10 : item.pedestrianExposure === 'Medium' ? 6 : 3;
    const urgScore = item.urgency === 'High' ? 10 : item.urgency === 'Medium' ? 6 : 3;

    const totalWeight = priorityWeights.severity + priorityWeights.exposure + priorityWeights.urgency;
    const weighted = (sevScore * priorityWeights.severity + expScore * priorityWeights.exposure + urgScore * priorityWeights.urgency) / (totalWeight || 1);
    return Math.round(weighted * 10);
  };

  // Sorted ranked hazards for Screen M4
  const rankedHazards = [...hazards].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));

  // When in Inspector mode, render ONLY the Inspector card as a standalone full page
  if (propertyTab === 'inspector') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        {/* Top Navigation Bar */}
        <header className="bg-[#142B4A] border-b border-slate-700 px-6 py-3.5 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPropertyTab('lighting')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-600 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-teal-400" />
              <span>Back to Street Condition</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Hazard Inspector</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                {activeHazard?.id}
              </span>
            </div>
          </div>
        </header>

        {/* Dedicated Full Page Inspector Card */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Header / Title */}
            <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#142B4A] border border-slate-200">
                    {activeHazard?.feedCategory || activeHazard?.category || 'Hazard'}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-medium text-slate-500">Reported on {activeHazard?.reportDate || '18 Oct 2026'} at {(activeHazard?.timestamp || '8:42 PM').replace(/[\s·•].*demo.*/i, '').trim()}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">{activeHazard?.title}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{activeHazard?.location}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${activeHazard?.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  activeHazard?.status === 'In progress' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                  {activeHazard?.status || 'Reported'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Metrics & Description & Change Status */}
              <div className="space-y-6">
                {/* Metrics (Interactive / Manipulatable) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Inspection Metrics</span>
                    <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Interactive</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Severity dropdown */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Severity</span>
                      <select
                        value={activeHazard?.severity || 'Medium'}
                        onChange={(e) => {
                          updateHazardMetric(activeHazard?.id, 'severity', e.target.value);
                          if (showToast) showToast(`Updated Severity to ${e.target.value}`, 'info');
                        }}
                        className={`text-xs font-black bg-white rounded-md border border-slate-300 py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer ${activeHazard?.severity === 'High' ? 'text-red-600' :
                          activeHazard?.severity === 'Low' ? 'text-emerald-600' :
                            'text-amber-600'
                          }`}
                      >
                        <option value="High" style={{ color: '#dc2626' }}>High</option>
                        <option value="Medium" style={{ color: '#d97706' }}>Medium</option>
                        <option value="Low" style={{ color: '#059669' }}>Low</option>
                      </select>
                    </div>

                    {/* Exposure dropdown */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Exposure</span>
                      <select
                        value={activeHazard?.pedestrianExposure || 'Medium'}
                        onChange={(e) => {
                          updateHazardMetric(activeHazard?.id, 'pedestrianExposure', e.target.value);
                          if (showToast) showToast(`Updated Exposure to ${e.target.value}`, 'info');
                        }}
                        className="text-xs font-black text-slate-800 bg-white rounded-md border border-slate-300 py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="High" style={{ color: '#dc2626' }}>High</option>
                        <option value="Medium" style={{ color: '#d97706' }}>Medium</option>
                        <option value="Low" style={{ color: '#059669' }}>Low</option>
                      </select>
                    </div>

                    {/* Confidence dropdown */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Confidence</span>
                      <select
                        value={activeHazard?.evidenceConfidence || 'High'}
                        onChange={(e) => {
                          updateHazardMetric(activeHazard?.id, 'evidenceConfidence', e.target.value);
                          if (showToast) showToast(`Updated Confidence to ${e.target.value}`, 'info');
                        }}
                        className="text-xs font-black text-slate-800 bg-white rounded-md border border-slate-300 py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="High" style={{ color: '#dc2626' }}>High</option>
                        <option value="Medium" style={{ color: '#d97706' }}>Medium</option>
                        <option value="Low" style={{ color: '#059669' }}>Low</option>
                      </select>
                    </div>

                    {/* Cost Benchmark input */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Cost (RM)</span>
                      <div className="flex items-center justify-center bg-white rounded-md border border-slate-300 px-1.5 py-0.5 focus-within:ring-1 focus-within:ring-teal-500">
                        <span className="text-[10px] text-slate-400 font-bold mr-1">RM</span>
                        <input
                          type="number"
                          value={activeHazard?.estimatedCost || 1500}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            updateHazardMetric(activeHazard?.id, 'estimatedCost', val);
                          }}
                          className="w-16 text-xs font-black text-[#1F9D8B] bg-transparent focus:outline-none text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
                    {activeHazard?.description || 'No detailed description provided.'}
                  </div>
                </div>

                {/* Change Status */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Statuses</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        updateHazardStatus(activeHazard?.id, 'Under verification');
                        if (showToast) showToast(`Hazard ${activeHazard?.id} status set to Under Verification`, 'info');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition shadow-sm cursor-pointer ${activeHazard?.status === 'Under verification' || activeHazard?.status === 'Reported'
                        ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                        }`}
                    >
                      Under Verification
                    </button>
                    <button
                      onClick={() => {
                        updateHazardStatus(activeHazard?.id, 'Verified');
                        if (showToast) showToast(`Hazard ${activeHazard?.id} status set to Verified`, 'success');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition shadow-sm cursor-pointer ${activeHazard?.status === 'Verified'
                        ? 'bg-slate-300 text-slate-800 border-slate-400 ring-2 ring-slate-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                    >
                      Verify Report
                    </button>
                    <button
                      onClick={() => {
                        updateHazardStatus(activeHazard?.id, 'In progress');
                        if (showToast) showToast(`Hazard ${activeHazard?.id} status set to In Progress`, 'info');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition shadow-sm cursor-pointer ${activeHazard?.status === 'In progress'
                        ? 'bg-sky-600 text-white border-sky-700 ring-2 ring-sky-300'
                        : 'bg-sky-50 hover:bg-sky-100 text-[#2864A6] border-sky-200'
                        }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => {
                        updateHazardStatus(activeHazard?.id, 'Resolved');
                        if (showToast) showToast(`Hazard ${activeHazard?.id} status set to Resolved`, 'success');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition shadow-sm cursor-pointer ${activeHazard?.status === 'Resolved'
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                        }`}
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Photo Evidence */}
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Photo Evidence Preview</span>
                {activeHazard?.figureUrl ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
                    <img
                      src={activeHazard.figureUrl}
                      alt={activeHazard.title}
                      className="w-full h-72 object-cover"
                    />
                    <div className="p-3 bg-slate-900/95 text-white text-xs flex items-center justify-between">
                      <span className="truncate pr-2 italic">{activeHazard.figureCaption || activeHazard.title}</span>
                      <span className="text-slate-400 font-mono text-[11px] shrink-0 font-bold">{activeHazard.id}</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                    No image attached
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reported By:</span>
                    <strong className="text-slate-800">{activeHazard?.reportedBy || 'Resident'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Affected Node:</span>
                    <strong className="text-slate-800">{activeHazard?.affectedNode || 'Pedestrian Walkway'}</strong>
                  </div>
                </div>

                {/* Geolocation Map */}
                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                  <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2864A6]" />
                      <span>Hazard Geolocation · Google Maps</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{activeHazard?.affectedNode || 'Node'}</span>
                  </div>
                  <div className="h-44 w-full relative">
                    <GoogleMapsTownshipView
                      theme="day"
                      activeLamps={activeHazard?.affectedNode ? [activeHazard.affectedNode] : activeLamps}
                      currentCheckpointNode={activeHazard?.affectedNode || null}
                      hazards={[activeHazard].filter(Boolean)}
                      height="100%"
                      showOverlayLabels={true}
                      showHeader={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172334] flex flex-col font-sans">
      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#142B4A] text-white flex flex-col justify-between p-4 border-r border-slate-700 shrink-0">
          <div className="space-y-6">
            {/* Identity */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E3C66] via-[#2864A6] to-sky-400 p-[1.5px] shadow-md shadow-sky-500/20 shrink-0">
                  <div className="w-full h-full bg-[#0D1726] rounded-[10px] flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-sky-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4l16 16" />
                      <path d="M20 4L4 20" />
                      <circle cx="12" cy="12" r="2.5" className="fill-sky-400 stroke-none" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-0.5">
                    UrbanHub<span className="text-sky-400">-X</span>
                  </h3>
                  <span className="text-[10px] text-teal-300 font-mono">Property Intelligence</span>
                </div>
              </div>
            </div>

            {/* Navigation Links — 8 screens grouped into 3 sections */}
            <nav className="space-y-1.5 text-xs font-semibold">
              {NAV_GROUPS.map((group) => {
                const GroupIcon = group.icon;
                const isActiveGroup = activeGroup.id === group.id;
                const hasSubItems = group.items.length > 1;

                return (
                  <div key={group.id}>
                    <button
                      onClick={() => setPropertyTab(group.items[0].id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${isActiveGroup
                        ? 'bg-[#2864A6] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <GroupIcon className="w-4 h-4" />
                        <span>{group.label}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        {group.id === 'action-queue' && awaitingVerification > 0 && (
                          <span className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${isActiveGroup ? 'bg-white/20 text-white' : 'bg-amber-500 text-slate-950'
                            }`}>
                            {awaitingVerification}
                          </span>
                        )}
                        {hasSubItems && (
                          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isActiveGroup ? 'rotate-180' : 'opacity-60'}`} />
                        )}
                      </span>
                    </button>

                    {isActiveGroup && hasSubItems && (
                      <div className="mt-1 ml-3 pl-3 border-l border-slate-700 space-y-0.5">
                        {group.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isActive = propertyTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setPropertyTab(item.id)}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] transition ${isActive
                                ? 'bg-white/10 text-white font-bold'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                                }`}
                            >
                              <ItemIcon className="w-3.5 h-3.5" />
                              <span className="flex-1 text-left">{item.label}</span>
                              <span className="text-[9px] font-mono opacity-50">{item.code}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3">
            {/* Sign Out Button */}
            <button
              onClick={() => navigateRole('login')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-slate-700 hover:border-rose-800/60 transition-all cursor-pointer shadow-sm group"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* Consolidated summary bar (formerly 5 separate metric cards) */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-stretch">
              {summaryMetrics.map((m, idx) => (
                <div
                  key={m.label}
                  className={`flex-1 min-w-[150px] px-5 py-3.5 ${idx < summaryMetrics.length - 1
                    ? 'border-b border-slate-100 sm:border-b-0 sm:border-r sm:border-slate-200'
                    : ''
                    }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {m.label}
                  </div>
                  <div className={`mt-1 text-xl font-black leading-none ${m.valueTone}`}>
                    {m.value}
                  </div>
                  <div className={`mt-1.5 text-[11px] font-medium ${m.hintTone}`}>
                    {m.hint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------------
            SCREEN M1: MANAGEMENT OVERVIEW
           ------------------------------------------------------------- */}
          {propertyTab === 'overview' && (
            <div className="space-y-6">
              {/* Map Panel (full width) */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2864A6]" />
                    <span>Township Environmental Hazard Map</span>
                  </h3>
                  <button
                    onClick={() => setShowMapModal(true)}
                    className="text-xs text-[#2864A6] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Open Detailed Map →
                  </button>
                </div>

                <GoogleMapsTownshipView
                  theme="day"
                  activeLamps={activeLamps}
                  hazards={hazards}
                  height="300px"
                  showOverlayLabels={false}
                />
              </div>

              {/* Priority Action Queue (below map) */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Priority Action Queue</h3>
                  <button
                    onClick={() => setPropertyTab('ranking')}
                    className="text-xs text-[#2864A6] font-semibold hover:underline"
                  >
                    All Ranked ({rankedHazards.length}) →
                  </button>
                </div>

                <div className="space-y-2">
                  {rankedHazards.slice(0, 4).map((hz, idx) => (
                    <div
                      key={hz.id}
                      onClick={() => {
                        setSelectedHazardId(hz.id);
                        setPropertyTab('inspector');
                      }}
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-[#2864A6] cursor-pointer bg-slate-50/70 hover:bg-sky-50/40 transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#142B4A] text-white font-bold text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{hz.id}: {hz.title}</div>
                          <div className="text-[11px] text-slate-500">{hz.location}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hz.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                          {hz.severity}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Score: {calculatePriorityScore(hz)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* -------------------------------------------------------------
            SCREEN M3: REPORTS & VERIFICATION TABLE
           ------------------------------------------------------------- */}
          {propertyTab === 'reports' && (
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reports & Verification Queue</h3>

                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by ID, location..."
                      className="bg-transparent focus:outline-none w-36"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="all">All</option>
                    <option value="Lighting deficiency / faulty streetlight">Streetlight</option>
                    <option value="Damaged / discontinuous pedestrian path">Ground</option>
                    <option value="Obstructed sightline">Overgrown Vegetation</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                      <th className="py-2.5 px-3">Hazard ID</th>
                      <th className="py-2.5 px-3">Title & Category</th>
                      <th className="py-2.5 px-3">Location Node</th>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">Confidence</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHazards.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{h.id}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{h.title}</div>
                          <div className="text-[10px] text-slate-400">{h.category} · {h.timestamp}</div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{h.location}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              h.severity === 'High' ? 'bg-red-100 text-red-800' :
                              h.severity === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                            {h.severity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${h.evidenceConfidence === 'High'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : h.evidenceConfidence === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                            }`}>
                            {h.evidenceConfidence}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : h.status === 'In progress'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                            }`}>
                            {h.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedHazardId(h.id);
                              setPropertyTab('inspector');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#1F9D8B] hover:bg-[#178270] text-white font-bold text-[10px] transition-colors"
                          >
                            View in Inspector →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
            SCREEN M4: EXPLAINABLE PRIORITY RANKING
           ------------------------------------------------------------- */}
          {propertyTab === 'ranking' && (
            <div className="space-y-4">
              {/* Model Weights Config Accordion */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Explainable Priority Scoring Model</h3>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-700">
                    Total Weight: {priorityWeights.severity + priorityWeights.exposure + priorityWeights.urgency}%
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Severity Weight</span>
                      <span className="font-mono font-bold text-[#2864A6]">{priorityWeights.severity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      step="5"
                      value={priorityWeights.severity}
                      onChange={(e) => setPriorityWeights(prev => ({ ...prev, severity: Number(e.target.value) }))}
                      className="w-full accent-[#2864A6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Pedestrian Exposure Weight</span>
                      <span className="font-mono font-bold text-[#2864A6]">{priorityWeights.exposure}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      step="5"
                      value={priorityWeights.exposure}
                      onChange={(e) => setPriorityWeights(prev => ({ ...prev, exposure: Number(e.target.value) }))}
                      className="w-full accent-[#2864A6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Urgency Weight</span>
                      <span className="font-mono font-bold text-[#2864A6]">{priorityWeights.urgency}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      step="5"
                      value={priorityWeights.urgency}
                      onChange={(e) => setPriorityWeights(prev => ({ ...prev, urgency: Number(e.target.value) }))}
                      className="w-full accent-[#2864A6]"
                    />
                  </div>
                </div>
              </div>

              {/* 2-Column: Ranked Table (8 cols) + "Why this rank?" Side Panel (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left 8 cols: Ranked Table */}
                <div className="lg:col-span-8 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dynamic Ranked Interventions Queue
                    </h4>
                    <span className="text-[11px] text-slate-400">Score = (Sev × Ws + Exp × We + Urg × Wu) / 100</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                          <th className="py-2.5 px-3">Rank</th>
                          <th className="py-2.5 px-3">Hazard / Issue</th>
                          <th className="py-2.5 px-3">Severity</th>
                          <th className="py-2.5 px-3">Exposure</th>
                          <th className="py-2.5 px-3">Score</th>
                          <th className="py-2.5 px-3 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rankedHazards.map((hz, idx) => {
                          const score = calculatePriorityScore(hz);
                          const isSelected = (selectedRankedId || rankedHazards[0].id) === hz.id;
                          return (
                            <tr
                              key={hz.id}
                              onClick={() => setSelectedRankedId(hz.id)}
                              className={`cursor-pointer transition ${isSelected ? 'bg-sky-50/80 font-semibold' : 'hover:bg-slate-50'}`}
                            >
                              <td className="py-2.5 px-3 font-bold text-slate-900">#{idx + 1}</td>
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-slate-800">{hz.id}: {hz.title}</div>
                                <div className="text-[11px] text-slate-400">{hz.location}</div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    hz.severity === 'High' ? 'bg-red-100 text-red-800' :
                                    hz.severity === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                                    'bg-amber-100 text-amber-800'
                                  }`}>
                                  {hz.severity}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  hz.pedestrianExposure === 'High' ? 'bg-red-100 text-red-800' :
                                  hz.pedestrianExposure === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>{hz.pedestrianExposure}</span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`font-extrabold text-sm ${
                                  score >= 70 ? 'text-red-600' :
                                  score >= 45 ? 'text-amber-600' :
                                  'text-emerald-600'
                                }`}>{score}</span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-[#2864A6] text-white' : 'text-[#2864A6] hover:underline'}`}>
                                  {isSelected ? 'Inspecting' : 'Why this rank?'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right 4 cols: "Why this rank?" Side Panel */}
                <div className="lg:col-span-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                  {(() => {
                    const currentItem = rankedHazards.find(h => h.id === (selectedRankedId || rankedHazards[0].id)) || rankedHazards[0];
                    const rankPos = rankedHazards.findIndex(h => h.id === currentItem.id) + 1;
                    const score = calculatePriorityScore(currentItem);

                    return (
                      <div className="space-y-4 text-xs">
                        {/* Header — score big, no gray label */}
                        <div className="border-b pb-3 space-y-1">
                          <span className={`text-3xl font-black tabular-nums ${
                            score >= 70 ? 'text-red-600' :
                            score >= 45 ? 'text-amber-500' :
                            'text-emerald-600'
                          }`}>{score}<span className="text-sm font-semibold text-slate-400 ml-1">/ 100</span></span>
                          <h4 className="font-extrabold text-sm text-slate-900">{currentItem.id}: {currentItem.title}</h4>
                          <div className="text-[11px] text-slate-500">{currentItem.location}</div>
                        </div>

                        {/* Weighted Component Breakdown */}
                        <div className="space-y-2">
                          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                            Model Weight Contributions:
                          </div>

                          {/* Severity card */}
                          <div className={`p-2.5 rounded-lg border space-y-1 ${
                            currentItem.severity === 'High' ? 'bg-red-50 border-red-200' :
                            currentItem.severity === 'Low' ? 'bg-emerald-50 border-emerald-200' :
                            'bg-amber-50 border-amber-200'
                          }`}>
                            <div className="flex justify-between font-semibold">
                              <span className={
                                currentItem.severity === 'High' ? 'text-red-700' :
                                currentItem.severity === 'Low' ? 'text-emerald-700' :
                                'text-amber-700'
                              }>Severity — {currentItem.severity}</span>
                              <span className="text-slate-500 font-mono">Wt: {priorityWeights.severity}%</span>
                            </div>
                            <p className="text-[10px] text-slate-600">
                              {currentItem.severity === 'High'
                                ? 'Critical risk — direct safety threat to night commuters. Immediate intervention warranted.'
                                : currentItem.severity === 'Medium'
                                ? 'Moderate impediment. Escalation likely if not addressed within scheduled maintenance cycle.'
                                : 'Low immediate threat. Monitor and bundle with routine upkeep to minimise mobilisation cost.'}
                            </p>
                          </div>

                          {/* Exposure card */}
                          <div className={`p-2.5 rounded-lg border space-y-1 ${
                            currentItem.pedestrianExposure === 'High' ? 'bg-red-50 border-red-200' :
                            currentItem.pedestrianExposure === 'Low' ? 'bg-emerald-50 border-emerald-200' :
                            'bg-amber-50 border-amber-200'
                          }`}>
                            <div className="flex justify-between font-semibold">
                              <span className={
                                currentItem.pedestrianExposure === 'High' ? 'text-red-700' :
                                currentItem.pedestrianExposure === 'Low' ? 'text-emerald-700' :
                                'text-amber-700'
                              }>Exposure — {currentItem.pedestrianExposure}</span>
                              <span className="text-slate-500 font-mono">Wt: {priorityWeights.exposure}%</span>
                            </div>
                            <p className="text-[10px] text-slate-600">
                              {currentItem.pedestrianExposure === 'High'
                                ? 'High-volume corridor — serves peak resident foot traffic between residential clusters and transit nodes.'
                                : currentItem.pedestrianExposure === 'Medium'
                                ? 'Moderate usage path. Impacts evening commuters but alternative routes are available nearby.'
                                : 'Low foot traffic zone. Impact is localised; deprioritise relative to high-exposure nodes.'}
                            </p>
                          </div>

                          {/* Urgency card */}
                          <div className={`p-2.5 rounded-lg border space-y-1 ${
                            currentItem.urgency === 'High' ? 'bg-red-50 border-red-200' :
                            currentItem.urgency === 'Low' ? 'bg-emerald-50 border-emerald-200' :
                            'bg-amber-50 border-amber-200'
                          }`}>
                            <div className="flex justify-between font-semibold">
                              <span className={
                                currentItem.urgency === 'High' ? 'text-red-700' :
                                currentItem.urgency === 'Low' ? 'text-emerald-700' :
                                'text-amber-700'
                              }>Urgency — {currentItem.urgency}</span>
                              <span className="text-slate-500 font-mono">Wt: {priorityWeights.urgency}%</span>
                            </div>
                            <p className="text-[10px] text-slate-600">
                              {currentItem.urgency === 'High'
                                ? 'Time-sensitive — requires action before the next wet-weather night cycle to prevent liability exposure.'
                                : currentItem.urgency === 'Medium'
                                ? 'Scheduled response adequate. Should be resolved within the current maintenance quarter.'
                                : 'No immediate timeline pressure. Can be deferred to the next planned walkway inspection round.'}
                            </p>
                          </div>
                        </div>

                        {/* Evidence Confidence Safeguard */}
                        <div className={`p-2.5 rounded-lg border text-[11px] space-y-0.5 ${
                          currentItem.evidenceConfidence === 'High' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' :
                          currentItem.evidenceConfidence === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-950' :
                          'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          <div className="font-bold">Evidence Confidence: {currentItem.evidenceConfidence}</div>
                          <p className="text-[10px] leading-tight opacity-80">
                            {currentItem.evidenceConfidence === 'High'
                              ? 'Multiple corroborating reports with photo evidence. Findings are reliable for immediate action.'
                              : currentItem.evidenceConfidence === 'Medium'
                              ? 'Partially verified. On-site inspection recommended before mobilising resources.'
                              : 'Single source report. Held in verification queue — not suppressed, but requires ground-truth confirmation.'}
                          </p>
                        </div>

                        <button
                          onClick={() => setPropertyTab('budget')}
                          className="w-full py-2 px-3 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 transition"
                        >
                          <span>Inspect in Budget Optimiser →</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
            SCREEN M5: BUDGET OPTIMISATION & ROUTE IMPACT
           ------------------------------------------------------------- */}
          {propertyTab === 'budget' && (
            budgetView === 'input' ? (
              /* =========================================================
                 VIEW 1: INPUTS & SOURCES ONLY
                 ========================================================= */
              <div className="space-y-6">
                {/* Budget Allocation Input Card */}
                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#2864A6]" />
                      <span>Available Budget Cap</span>
                    </h4>

                    <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-sm font-mono font-bold text-slate-900">
                      <span className="text-slate-500 font-semibold">RM</span>
                      <input
                        type="number"
                        step="500"
                        min="1000"
                        max="20000"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-24 bg-transparent focus:outline-none text-right font-black"
                      />
                    </div>
                  </div>

                  {/* Quick Budget Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">Quick Presets:</span>
                    {[3000, 5000, 7500, 10000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setBudget(preset)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                          budget === preset
                            ? 'bg-[#2864A6] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        RM {preset.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Sources Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Target Corridors</span>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">Route A & Route B</div>
                      <div className="text-[11px] text-slate-500">Main Ave (620m) & Garden Shortcut (480m)</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Available Candidates</span>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">{CANDIDATE_INTERVENTIONS.length} Interventions</div>
                      <div className="text-[11px] text-slate-500">Lighting, Landscape & Civil Works</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Optimization Model</span>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">0/1 Knapsack Dynamic Prog.</div>
                      <div className="text-[11px] text-slate-500">Maximises environmental penalty reduction</div>
                    </div>
                  </div>
                </div>

                {/* Candidate Interventions Source Catalogue */}
                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Candidate Interventions Data Source
                      </h4>
                      <p className="text-xs text-slate-500">
                        Benchmarked intervention candidates with standard municipal cost rates and target penalty reductions
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Input Dataset
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50 font-bold">
                          <th className="py-3 px-3 text-left w-16">ID</th>
                          <th className="py-3 px-3 text-left">Intervention Details</th>
                          <th className="py-3 px-3 text-left w-36">Category</th>
                          <th className="py-3 px-3 text-left w-36">Target Route</th>
                          <th className="py-3 px-3 text-right w-28">Est. Cost</th>
                          <th className="py-3 px-3 text-center w-40">Penalty Target</th>
                          <th className="py-3 px-3 text-right w-28">Model Benefit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {CANDIDATE_INTERVENTIONS.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-3 font-mono font-bold text-slate-800 align-middle">{item.id}</td>
                            <td className="py-3 px-3 align-middle">
                              <div className="font-semibold text-slate-900">{item.title}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">{item.explanation}</div>
                            </td>
                            <td className="py-3 px-3 align-middle">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-3 align-middle">
                              <span className="font-semibold text-slate-800">{item.targetRoute}</span>
                              <div className="text-[10px] text-slate-400">{item.segmentAffected}</div>
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 align-middle tabular-nums">
                              RM {item.cost.toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-center align-middle">
                              {item.penaltyReduction.lighting && (
                                <span className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                                  Lighting {item.penaltyReduction.lighting} pts
                                </span>
                              )}
                              {item.penaltyReduction.sightline && (
                                <span className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  Sightline {item.penaltyReduction.sightline} pts
                                </span>
                              )}
                              {item.penaltyReduction.pathway && (
                                <span className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                                  Pathway {item.penaltyReduction.pathway} pts
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-[#2864A6] align-middle tabular-nums">
                              +{item.modelledBenefit} pts
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 to-[#142B4A] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Ready to Run Maintenance Optimisation</span>
                    </h4>
                  </div>
                  <button
                    onClick={() => handleApplyPlan('A')}
                    className="px-6 py-3 rounded-lg bg-[#1F9D8B] hover:bg-[#178270] text-white font-bold text-sm shadow-md inline-flex items-center justify-center gap-2 transition"
                  >
                    <span>Apply Plan & View Impact Results</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* =========================================================
                 VIEW 2: RESULTS PAGE (PACKAGE SELECTION ON TOP)
                 ========================================================= */
              <div className="space-y-6">
                {/* Top Navigation: Back Button Only */}
                <div>
                  <button
                    onClick={() => setBudgetView('input')}
                    className={`px-3.5 py-2 ${BTN_SECONDARY} text-xs`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Budget & Inputs</span>
                  </button>
                </div>

                {/* ── ALTERNATIVE PACKAGES SELECTION ON TOP ── */}
                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Select Maintenance Package Strategy
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Package A Card */}
                    {(() => {
                      const pkgA = getPackageData('A');
                      const isSelected = selectedPackageId === 'A';
                      return (
                        <div
                          onClick={() => handleSelectPackage('A')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {pkgA.badge}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{pkgA.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Items: {pkgA.ids.join(', ')}</div>
                          <p className="text-[10px] text-slate-600 mt-1">{pkgA.focus}</p>

                          <div className="pt-2.5 mt-2.5 border-t border-slate-200/80 space-y-1">
                            <div className="flex justify-between">
                              <span>Est. Cost:</span>
                              <strong className="font-mono text-slate-900">RM {pkgA.totalCost.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Unspent:</span>
                              <strong className="font-mono text-emerald-700">RM {pkgA.remainingBudget.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Model Benefit:</span>
                              <strong className="font-mono text-[#2864A6]">+{pkgA.totalBenefit} pts</strong>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Efficiency:</span>
                              <span>{pkgA.efficiency}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Package B Card */}
                    {(() => {
                      const pkgB = getPackageData('B');
                      const isSelected = selectedPackageId === 'B';
                      return (
                        <div
                          onClick={() => handleSelectPackage('B')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/40 shadow-md ring-2 ring-blue-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {pkgB.badge}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{pkgB.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Items: {pkgB.ids.join(', ')}</div>
                          <p className="text-[10px] text-slate-600 mt-1">{pkgB.focus}</p>

                          <div className="pt-2.5 mt-2.5 border-t border-slate-200/80 space-y-1">
                            <div className="flex justify-between">
                              <span>Est. Cost:</span>
                              <strong className="font-mono text-slate-900">RM {pkgB.totalCost.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Unspent:</span>
                              <strong className="font-mono text-slate-600">RM {pkgB.remainingBudget.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Model Benefit:</span>
                              <strong className="font-mono text-[#2864A6]">+{pkgB.totalBenefit} pts</strong>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Efficiency:</span>
                              <span>{pkgB.efficiency}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Package C Card */}
                    {(() => {
                      const pkgC = getPackageData('C');
                      const isSelected = selectedPackageId === 'C';
                      return (
                        <div
                          onClick={() => handleSelectPackage('C')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              isSelected ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {pkgC.badge}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{pkgC.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Items: {pkgC.ids.join(', ')}</div>
                          <p className="text-[10px] text-slate-600 mt-1">{pkgC.focus}</p>

                          <div className="pt-2.5 mt-2.5 border-t border-slate-200/80 space-y-1">
                            <div className="flex justify-between">
                              <span>Est. Cost:</span>
                              <strong className="font-mono text-slate-900">RM {pkgC.totalCost.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Unspent:</span>
                              <strong className="font-mono text-slate-600">RM {pkgC.remainingBudget.toLocaleString()}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Model Benefit:</span>
                              <strong className="font-mono text-[#2864A6]">+{pkgC.totalBenefit} pts</strong>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Efficiency:</span>
                              <span>{pkgC.efficiency}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* ── RECOMMENDED (SELECTED) & EXCLUDED INTERVENTIONS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Selected Package Items (7 cols) */}
                  <div className="lg:col-span-7 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Recommended Feasible Package ({activePackage.selectedItems.length} Selected)</span>
                      </h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${activePackage.pillClass}`}>
                        {activePackage.badge}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {activePackage.selectedItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-emerald-950">{item.id}: {item.title}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-emerald-200 text-emerald-900">
                                {item.targetRoute}
                              </span>
                            </div>
                            <div className="font-mono font-bold text-xs text-emerald-900">
                              RM {item.cost.toLocaleString()}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-snug">{item.explanation}</p>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-emerald-100">
                            <span>Segment: {item.segmentAffected}</span>
                            <span className="font-bold text-[#2864A6]">Modelled Benefit: +{item.modelledBenefit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Excluded Interventions (5 cols) */}
                  <div className="lg:col-span-5 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Excluded Interventions & Explanations ({activePackage.excludedItems.length})
                    </h4>

                    <div className="space-y-2.5">
                      {activePackage.excludedItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-700">{item.id}: {item.title}</span>
                            <span className="font-mono text-xs text-slate-500">RM {item.cost.toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">{item.explanation}</p>
                          <div className="text-[10px] font-semibold text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200 mt-1">
                            Reason Excluded: {item.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── ROUTE IMPACT ANALYSIS (REFLECTS SELECTED PACKAGE) ── */}
                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">Route Impact Analysis</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${activePackage.pillClass}`}>
                        Active Strategy: {activePackage.badge}
                      </span>
                    </div>
                  </div>

                  {/* 3 Routes Cards Comparison */}
                  {(() => {
                    const deltaA = activePackage.routeACost.delta;
                    const deltaB = activePackage.routeBCost.delta;
                    const isImprovedA = deltaA > 0;
                    const isImprovedB = deltaB > 0;
                    // Crown the best improved route:
                    // If only one route improves (green), it gets the crown.
                    // If both routes improve (2 greens), the one with the lowest modelled cost wins.
                    const isBestA = isImprovedA && (!isImprovedB || activePackage.routeACost.totalCost <= activePackage.routeBCost.totalCost);
                    const isBestB = isImprovedB && (!isImprovedA || activePackage.routeBCost.totalCost < activePackage.routeACost.totalCost);

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Route A Card */}
                        <div className={`relative p-4 rounded-xl border transition-all space-y-3 ${
                          isImprovedA
                            ? 'border-emerald-300 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-300/40'
                            : 'border-slate-200 bg-slate-50/60'
                        }`}>
                          {isBestA && (
                            <div 
                              className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-300 text-[10px] font-extrabold flex items-center gap-1 shadow-sm z-10"
                              title="Best Route (Lowest Modelled Cost)"
                            >
                              <Crown className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
                              <span>Best</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                                isImprovedA ? 'bg-emerald-600' : 'bg-slate-500'
                              }`}>
                                A
                              </span>
                              <div>
                                <h5 className="font-bold text-sm text-slate-900">Route A: Main Avenue</h5>
                                <p className="text-[11px] text-slate-500">620m · 9 min walk</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] uppercase font-bold text-slate-400">Modelled Cost</div>
                              <div className="flex items-baseline justify-end gap-1.5">
                                <span className={`text-xl font-black ${isImprovedA ? 'text-emerald-700' : 'text-slate-800'}`}>
                                  {activePackage.routeACost.totalCost}
                                </span>
                                {isImprovedA ? (
                                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Δ -{deltaA}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                    Δ 0
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className={`space-y-1 pt-2 border-t text-[11px] ${isImprovedA ? 'border-emerald-200/80 text-emerald-950' : 'border-slate-200 text-slate-600'}`}>
                            <div className="flex justify-between">
                              <span>Base Distance / Time:</span>
                              <span className="font-mono font-semibold">{activePackage.routeACost.baseTimeIndex}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Lighting Penalty:</span>
                              <span className={`font-mono font-semibold ${activePackage.routeACost.lightingPenalty === 0 ? 'text-emerald-700 font-bold' : 'text-amber-700'}`}>
                                +{activePackage.routeACost.lightingPenalty} {activePackage.routeACost.lightingPenalty === 0 && '(Resolved)'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sightline Penalty:</span>
                              <span className="font-mono font-semibold text-emerald-700">0</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pathway Penalty:</span>
                              <span className="font-mono font-semibold text-emerald-700">0</span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-lg text-[11px] border ${
                            isImprovedA
                              ? 'bg-emerald-100/70 border-emerald-200 text-emerald-900 font-medium'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}>
                            {isImprovedA ? (
                              <span>✓ Luminaire L-04 repaired, restoring continuous illumination.</span>
                            ) : (
                              <span>Baseline: 1 active lighting penalty near Central Boulevard (unaffected by this package).</span>
                            )}
                          </div>
                        </div>

                        {/* Route B Card */}
                        <div className={`relative p-4 rounded-xl border transition-all space-y-3 ${
                          isImprovedB
                            ? 'border-emerald-300 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-300/40'
                            : 'border-slate-200 bg-slate-50/60'
                        }`}>
                          {isBestB && (
                            <div 
                              className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-300 text-[10px] font-extrabold flex items-center gap-1 shadow-sm z-10"
                              title="Best Route (Lowest Modelled Cost)"
                            >
                              <Crown className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
                              <span>Best</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                                isImprovedB ? 'bg-emerald-600' : 'bg-slate-500'
                              }`}>
                                B
                              </span>
                              <div>
                                <h5 className="font-bold text-sm text-slate-900">Route B: Garden Shortcut</h5>
                                <p className="text-[11px] text-slate-500">480m · 7 min walk</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] uppercase font-bold text-slate-400">Modelled Cost</div>
                              <div className="flex items-baseline justify-end gap-1.5">
                                <span className={`text-xl font-black ${isImprovedB ? 'text-emerald-700' : 'text-slate-800'}`}>
                                  {activePackage.routeBCost.totalCost}
                                </span>
                                {isImprovedB ? (
                                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Δ -{deltaB}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                    Δ 0
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className={`space-y-1 pt-2 border-t text-[11px] ${isImprovedB ? 'border-emerald-200/80 text-emerald-950' : 'border-slate-200 text-slate-600'}`}>
                            <div className="flex justify-between">
                              <span>Base Distance / Time:</span>
                              <span className="font-mono font-semibold">{activePackage.routeBCost.baseTimeIndex}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Lighting Penalty:</span>
                              <span className={`font-mono font-semibold ${activePackage.routeBCost.lightingPenalty < 10 ? 'text-emerald-700' : 'text-slate-700'}`}>
                                +{activePackage.routeBCost.lightingPenalty} {activePackage.routeBCost.lightingPenalty < 10 && '(Reduced)'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sightline Penalty:</span>
                              <span className={`font-mono font-semibold ${activePackage.routeBCost.sightlinePenalty === 0 ? 'text-emerald-700 font-bold' : 'text-amber-700'}`}>
                                +{activePackage.routeBCost.sightlinePenalty} {activePackage.routeBCost.sightlinePenalty === 0 && '(Cleared)'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pathway Penalty:</span>
                              <span className={`font-mono font-semibold ${activePackage.routeBCost.pathwayPenalty === 0 ? 'text-emerald-700 font-bold' : 'text-amber-700'}`}>
                                +{activePackage.routeBCost.pathwayPenalty} {activePackage.routeBCost.pathwayPenalty === 0 && '(Repaved)'}
                              </span>
                            </div>
                          </div>

                          <div className={`p-2 rounded-lg text-[11px] border ${
                            isImprovedB
                              ? 'bg-emerald-100/70 border-emerald-200 text-emerald-900 font-medium'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}>
                            {isImprovedB ? (
                              <span>✓ Model improvements applied across Garden Shortcut.</span>
                            ) : (
                              <span>Baseline: Multiple impediments unaddressed across unlit garden pathway.</span>
                            )}
                          </div>
                        </div>

                        {/* Route C Card */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-slate-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                C
                              </span>
                              <div>
                                <h5 className="font-bold text-sm text-slate-900">Route C: Courtyard Link</h5>
                                <p className="text-[11px] text-slate-500">520m · 8 min walk</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] uppercase font-bold text-slate-400">Baseline Cost</div>
                              <div className="flex items-baseline justify-end gap-1.5">
                                <span className="text-xl font-black text-slate-700">
                                  {activePackage.routeCCost.totalCost}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 uppercase">
                                  Baseline Ref
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1 text-slate-600 pt-2 border-t border-slate-200 text-[11px]">
                            <div className="flex justify-between">
                              <span>Base Distance / Time:</span>
                              <span className="font-mono font-semibold">{activePackage.routeCCost.baseTimeIndex}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Lighting Penalty:</span>
                              <span className="font-mono font-semibold text-slate-700">+{activePackage.routeCCost.lightingPenalty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sightline Penalty:</span>
                              <span className="font-mono font-semibold text-slate-700">+{activePackage.routeCCost.sightlinePenalty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pathway Penalty:</span>
                              <span className="font-mono font-semibold text-slate-700">+{activePackage.routeCCost.pathwayPenalty}</span>
                            </div>
                          </div>

                          <div className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-500">
                            Residential courtyard corridor with no active interventions assigned in model.
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Scientific Caveat Banner */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                    <span className="font-bold text-slate-700">Modelled Metric Note:</span> ΔC represents simulated reduction in environmental penalty indices under prototype assumptions. It is not an empirical guarantee of incident elimination.
                  </div>
                </div>
              </div>
            )
          )}

          {/* -------------------------------------------------------------
            SCREEN M7: LIGHTING STATUS / CORRIDOR SIMULATION
           ------------------------------------------------------------- */}
          {propertyTab === 'lighting' && (
            <div className="space-y-6">
              {FEED_SECTIONS.map(section => {
                const feedHazards = hazards.filter(h => (h.feedCategory || 'Other') === section.feed);
                return (
                  <div key={section.feed} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
                    </div>
                    {feedHazards.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">{section.emptyText}</p>
                    ) : (
                      <div className={`grid gap-3 ${section.grid}`}>
                        {feedHazards.map(hz => {
                          const isResolved = hz.status === 'Resolved';
                          const dotColor = isResolved ? 'bg-emerald-500' : hz.severity === 'High' ? 'bg-red-500' : 'bg-yellow-400';
                          const cardBorder = isResolved ? 'border-emerald-200' : hz.severity === 'High' ? 'border-red-300' : 'border-yellow-300';
                          const cardBg = isResolved ? 'bg-emerald-50/40' : hz.severity === 'High' ? 'bg-red-50/60' : 'bg-yellow-50/60';
                          return (
                            <div
                              key={hz.id}
                              onClick={() => {
                                setSelectedHazardId(hz.id);
                                setPropertyTab('inspector');
                              }}
                              className={`p-3.5 rounded-xl border ${cardBorder} ${cardBg} flex gap-3 items-start cursor-pointer hover:shadow-md hover:border-[#2864A6] transition`}
                            >
                              {hz.figureUrl && (
                                <img src={hz.figureUrl} alt={hz.title} className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0" />
                              )}
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                                    <span className="font-bold text-xs text-[#142B4A]">{hz.id}</span>
                                  </div>
                                </div>
                                <div className="text-xs font-semibold text-slate-800 leading-snug truncate">{hz.title}</div>
                                <div className="text-[11px] text-slate-500 truncate">{hz.location}</div>
                                <div className="flex items-center justify-between text-[10px] pt-1">
                                  <span className="text-slate-500">Status: <strong className="text-slate-800">{hz.status}</strong></span>
                                  <span className="text-slate-500">Est: <strong>RM {hz.estimatedCost?.toLocaleString() || section.fallbackCost}</strong></span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* Fullscreen Map Modal */}
      {showMapModal && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#0A0F1D]/80 backdrop-blur-sm"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className="relative flex flex-col flex-1 m-4 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2864A6]" />
                Township Environmental Hazard Map
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-500">Total Hazards: {hazards.length}</span>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                  aria-label="Close map"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Map fills remaining space */}
            <div className="flex-1 min-h-0">
              <GoogleMapsTownshipView
                theme="day"
                activeLamps={activeLamps}
                hazards={hazards}
                onSelectHazard={handleSelectMapHazard}
                height="100%"
                showOverlayLabels={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

