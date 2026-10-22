import React, { useState, useEffect, useMemo } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { GoogleMapsTownshipView } from '../../components/GoogleMapsTownshipView';
import {
  evaluateRoute,
  routeMetrics,
  lightingDescriptor,
  sightlineDescriptor,
  walkwayDescriptor,
  hazardDescriptor
} from '../../data/routeRisk';
import {
  Clock,
  Ruler,
  ShieldCheck,
  Lightbulb,
  Eye,
  Footprints,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Play,
  Zap,
  Sparkles,
} from 'lucide-react';

// ── Route categories at top ───────────────────────────────────────────────────
// `badgeKey` says which canonical metric the badge shows, so the numbers stay
// in step with nightSafeData instead of being retyped here.
const CATEGORIES = [
  {
    id: 'safest',
    label: 'Safest',
    badgeKey: 'score',
    icon: ShieldCheck,
    routeId: 'A',
    activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    inactiveColor: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
    iconColor: 'text-emerald-600',
    ringColor: 'ring-emerald-500',
    summary: 'Focuses on maximum lighting, clear sightlines & active guard corridor.',
  },
  {
    id: 'fastest',
    label: 'Fastest',
    badgeKey: 'eta',
    icon: Zap,
    routeId: 'B',
    activeColor: 'bg-amber-500 text-white border-amber-500 shadow-sm',
    inactiveColor: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
    iconColor: 'text-amber-500',
    ringColor: 'ring-amber-400',
    summary: 'Direct cut-through. Saves time but has lower lighting and uneven pavement.',
  },
  {
    id: 'shortest',
    label: 'Shortest',
    badgeKey: 'distance',
    icon: Ruler,
    routeId: 'C',
    activeColor: 'bg-[#2864A6] text-white border-[#2864A6] shadow-sm',
    inactiveColor: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
    iconColor: 'text-[#2864A6]',
    ringColor: 'ring-[#2864A6]',
    summary: 'Minimum walking distance through internal residential courtyard link.',
  },
];

// Presentation copy only — every *number* below comes from the data model.
const ROUTE_COPY = {
  A: {
    label: 'Route A',
    category: 'safest',
    categoryLabel: 'Safest Choice',
    color: 'emerald',
    highlightNote: 'Best continuous illumination and active emergency points',
    reason: 'Paved, well-lit avenue. Minor streetlight fault near L-04 is noted.',
  },
  B: {
    label: 'Route B',
    category: 'fastest',
    categoryLabel: 'Fastest ETA',
    color: 'amber',
    highlightNote: 'Fastest route to transit hub',
    reason: 'Fastest cut-through, but passes low-lit garden sections with overgrown vegetation and uneven pavers.',
  },
  C: {
    label: 'Route C',
    category: 'shortest',
    categoryLabel: 'Shortest Distance',
    color: 'blue',
    highlightNote: 'Shortest walking distance of the three corridors',
    reason: 'Shortest physical distance through residential inner courtyard link with steady lighting.',
  },
};

const ROUTE_IDS = ['A', 'B', 'C'];

const colorMap = {
  emerald: { ring: 'ring-emerald-600 border-emerald-600', badge: 'bg-emerald-600 text-white', bg: 'bg-emerald-50/70', bar: 'bg-emerald-600', pill: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  amber:   { ring: 'ring-amber-500 border-amber-500', badge: 'bg-amber-500 text-white', bg: 'bg-amber-50/70',   bar: 'bg-amber-500',    pill: 'bg-amber-50 text-amber-800 border-amber-200' },
  blue:    { ring: 'ring-[#2864A6] border-[#2864A6]', badge: 'bg-[#2864A6] text-white', bg: 'bg-sky-50/70',     bar: 'bg-[#2864A6]',    pill: 'bg-sky-50 text-sky-800 border-sky-200' },
  slate:   { ring: 'ring-slate-400 border-slate-400', badge: 'bg-slate-600 text-white', bg: 'bg-slate-50',      bar: 'bg-slate-500',    pill: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const statusStyle = {
  good:    'text-emerald-700 bg-emerald-50 border-emerald-200',
  caution: 'text-amber-700  bg-amber-50  border-amber-200',
  warn:    'text-rose-700   bg-rose-50   border-rose-200',
};

const safetyColor = (score) => {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 65) return 'text-amber-600';
  return 'text-rose-600';
};

const safetyLabel = (score) => {
  if (score >= 80) return 'High';
  if (score >= 65) return 'Good';
  return 'At Risk';
};

// Every card metric is recomputed from the canonical route model, so the
// comparison cards can never contradict the live-navigation HUD.
function buildRouteData(hazards = []) {
  return ROUTE_IDS.map((id) => {
    const metrics = routeMetrics(id);
    const risk = evaluateRoute(id, hazards);
    const copy = ROUTE_COPY[id];
    return {
      ...copy,
      id,
      name: metrics.name,
      type: metrics.tagline,
      etaMin: metrics.etaMinutes,
      distanceKm: metrics.distanceKm,
      safetyScore: risk.score,
      safetyLabel: safetyLabel(risk.score),
      dangerLevel: risk.dangerLevel,
      recommended: metrics.recommended,
      lightCoverage: `${metrics.lightingCoverage}%`,
      metrics: [
        { icon: Lightbulb, label: 'Street Lighting', ...lightingDescriptor(id) },
        { icon: Eye, label: 'Sightlines', ...sightlineDescriptor(id) },
        { icon: Footprints, label: 'Walkway Condition', ...walkwayDescriptor(id) },
        { icon: AlertTriangle, label: 'Known Hazards', ...hazardDescriptor(id, hazards) },
      ],
    };
  });
}

export function RouteComparisonView() {
  const { setResidentTab, selectedRouteId, setSelectedRouteId, routeCategory, setRouteCategory, startJourney, activeLamps, hazards } = useNightSafe();

  const ROUTE_DATA = useMemo(() => buildRouteData(hazards), [hazards]);

  // Category badges read the same numbers the cards render.
  // Keyed by CATEGORIES[].badgeKey so the badge can never fall back to a
  // hardcoded literal.
  const categoryBadges = useMemo(() => {
    const byId = Object.fromEntries(ROUTE_DATA.map(r => [r.id, r]));
    return {
      score: `${byId.A.safetyScore}/100`,
      eta: `${byId.B.etaMin} min`,
      distance: `${byId.C.distanceKm} km`,
    };
  }, [ROUTE_DATA]);

  // Initialize from context or routeId
  const [activeCategory, setActiveCategory] = useState(routeCategory || 'safest');
  const [selected, setSelected] = useState(selectedRouteId || 'A');

  // Keep in sync with parent context if changed externally
  useEffect(() => {
    if (routeCategory && routeCategory !== activeCategory) {
      setActiveCategory(routeCategory);
      const matched = CATEGORIES.find(c => c.id === routeCategory);
      if (matched) {
        setSelected(matched.routeId);
        setSelectedRouteId(matched.routeId);
      }
    }
  }, [routeCategory]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (setRouteCategory) setRouteCategory(catId);
    const matched = CATEGORIES.find(c => c.id === catId);
    if (matched) {
      setSelected(matched.routeId);
      setSelectedRouteId(matched.routeId);
    }
  };

  const handleRouteCardClick = (route) => {
    setSelected(route.id);
    setSelectedRouteId(route.id);
    setActiveCategory(route.category);
    if (setRouteCategory) setRouteCategory(route.category);
  };

  const handleChoose = (id) => {
    setSelected(id);
    setSelectedRouteId(id);
    startJourney(id);
    setResidentTab('journey');
  };

  // Re-order routes so the chosen category's recommended route is shown first
  const sortedRoutes = [...ROUTE_DATA].sort((a, b) => {
    if (a.category === activeCategory) return -1;
    if (b.category === activeCategory) return 1;
    return 0;
  });

  const activeCategoryObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA]">

      {/* ── Sticky Back Bar ──────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-2 px-4 pt-3 pb-2 bg-[#F5F7FA] border-b border-slate-200 z-10">
        <button
          onClick={() => setResidentTab('routes-entry')}
          className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
        </button>
        <div>
          <span className="text-xs font-bold text-slate-800">Choose a Safe Route</span>
          <span className="block text-[9px] text-slate-400 font-medium">Elmina Township · Real-time NightSafe</span>
        </div>
      </div>

      {/* ── Top Category Bar: Fastest / Safest / Shortest ────────── */}
      <div className="shrink-0 bg-white px-3.5 pt-2.5 pb-2.5 border-b border-slate-200 shadow-[0_2px_4px_rgba(0,0,0,0.03)] z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#2864A6]" />
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              Route Category
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Tap to select priority
          </span>
        </div>

        {/* Category Buttons (Safest / Fastest / Shortest) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-1.5 rounded-lg border text-center transition-all ${
                  isActive
                    ? cat.activeColor
                    : `${cat.inactiveColor} text-slate-600`
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : cat.iconColor}`} />
                  <span className="text-xs font-bold leading-none">{cat.label}</span>
                </div>
                <span className={`text-[9px] font-medium leading-none ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                  {categoryBadges[cat.badgeKey]}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div className={`absolute -top-1 right-1 w-2 h-2 rounded-full bg-white ring-2 ${cat.ringColor} shadow-sm`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Context Hint */}
        <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-1.5 text-[10px] text-slate-600">
          <activeCategoryObj.icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${activeCategoryObj.iconColor}`} />
          <p className="leading-snug">
            <span className="font-bold text-slate-800">{activeCategoryObj.label} Mode: </span>
            {activeCategoryObj.summary}
          </p>
        </div>
      </div>

      {/* ── Route Google Maps Preview ────────────────────────────── */}
      <div className="shrink-0 h-44 w-full border-b border-slate-200 relative overflow-hidden bg-slate-100">
        <GoogleMapsTownshipView
          theme="day"
          selectedRoute={selected}
          activeLamps={activeLamps}
          hazards={hazards}
          height="100%"
          showOverlayLabels={false}
          showHeader={false}
        />
        <div className="absolute top-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 z-10 pointer-events-none">
          <span className={`w-2 h-2 rounded-full ${
            selected === 'A' ? 'bg-emerald-500' : selected === 'B' ? 'bg-amber-500' : 'bg-[#2864A6]'
          }`} />
          <span className="text-[10px] font-bold text-slate-800">Route {selected} Preview · Google Maps</span>
        </div>
      </div>

      {/* ── Scrollable Route Cards ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3.5">
        {sortedRoutes.map((route) => {
          const isSelected = selected === route.id;
          const c = colorMap[route.color] || colorMap.blue;

          return (
            <div
              key={route.id}
              onClick={() => handleRouteCardClick(route)}
              className={`relative rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? `${c.bg} ${c.ring} ring-2 shadow-md`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Recommended badge */}
              {route.recommended && (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                  ✦ Recommended
                </div>
              )}

              <div className="p-3.5 space-y-2.5">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold shadow-sm ${
                      isSelected ? c.badge : 'bg-slate-100 text-slate-600'
                    }`}>
                      {route.id}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-tight">{route.name}</div>
                      <div className="text-[10px] text-slate-500">{route.type}</div>
                    </div>
                  </div>

                  {/* Safety score */}
                  <div className="text-right">
                    <div className={`text-lg font-extrabold leading-tight ${safetyColor(route.safetyScore)}`}>
                      {route.safetyScore}
                      <span className="text-[10px] font-semibold text-slate-400">/100</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium">Safety Score</div>
                  </div>
                </div>

                {/* Stats row: ETA · Distance · Lighting */}
                <div className="flex items-center gap-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                  <div className="flex-1 flex flex-col items-center py-2 border-r border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                    <span className="text-xs font-bold text-slate-800">{route.etaMin} min</span>
                    <span className="text-[9px] text-slate-400">ETA</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-2 border-r border-slate-100">
                    <Ruler className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                    <span className="text-xs font-bold text-slate-800">{route.distanceKm} km</span>
                    <span className="text-[9px] text-slate-400">Distance</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center py-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                    <span className="text-xs font-bold text-slate-800">{route.lightCoverage}</span>
                    <span className="text-[9px] text-slate-400">Lit</span>
                  </div>
                </div>

                {/* Safety score bar */}
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${c.bar}`}
                    style={{ width: `${route.safetyScore}%` }}
                  />
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {route.metrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-semibold ${statusStyle[m.status]}`}
                      >
                        <Icon className="w-3 h-3 shrink-0" />
                        <span className="truncate">{m.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reason description */}
                <p className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
                  {route.reason}
                </p>

                {/* Choose button — visible when selected */}
                {isSelected && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleChoose(route.id); }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-98 ${c.badge}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start — {route.label} ({route.name})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
