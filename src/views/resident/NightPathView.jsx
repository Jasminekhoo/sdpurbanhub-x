import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import {
  MapPin,
  Navigation2,
  ChevronRight,
  Locate,
  Search,
  X,
  ShieldCheck,
  Zap,
  Ruler,
} from 'lucide-react';

import { ELMINA_LOCATIONS } from '../../data/cityOfElminaAreas';
import { GoogleMapsTownshipView } from '../../components/GoogleMapsTownshipView';

// Map location labels to approximate GPS coords for pin display
const LOCATION_COORDS = {
  'The Eighth, Elmina Green':       { lat: 3.1835, lng: 101.5120 },
  'Elmina Central Park':            { lat: 3.1872, lng: 101.5168 },
  'Elmina Lakeside Mall':           { lat: 3.1905, lng: 101.5205 },
  'Elmina East Clubhouse':          { lat: 3.1895, lng: 101.5165 },
  'Elmina West Neighbourhood Park': { lat: 3.1820, lng: 101.5145 },
  'Elmina Boulevard':               { lat: 3.1870, lng: 101.5135 },
  'Granada Wellness Hub':           { lat: 3.1830, lng: 101.5180 },
  'Elmina Heritage Trail':          { lat: 3.1855, lng: 101.5215 },
  'Elmina North Gate':              { lat: 3.1885, lng: 101.5238 },
};

export function NightPathView() {
  const { setResidentTab, routeCategory, setRouteCategory, setSelectedRouteId } = useNightSafe();

  const [from, setFrom]             = useState('');
  const [to, setTo]                 = useState('');
  const [fromFocus, setFromFocus]   = useState(false);
  const [toFocus, setToFocus]       = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  const fromSelected = ELMINA_LOCATIONS.find(l => l.label === from);
  const toSelected   = ELMINA_LOCATIONS.find(l => l.label === to);
  const canConfirm   = from.trim().length > 0 && to.trim().length > 0;

  // Build GPS pin objects for the map
  const fromPin = from ? (LOCATION_COORDS[from] ? { ...LOCATION_COORDS[from], label: from } : null) : null;
  const toPin   = to   ? (LOCATION_COORDS[to]   ? { ...LOCATION_COORDS[to],   label: to }   : null) : null;

  const handleEnableLocation = () => {
    setLocationGranted(true);
    setFrom(ELMINA_LOCATIONS[2]?.label || 'The Eighth, Elmina Green');
  };

  const handleConfirm = () => {
    setResidentTab('routes');
  };

  const filteredFrom = ELMINA_LOCATIONS.filter(l =>
    from.length === 0
      ? l.label !== from
      : l.label.toLowerCase().includes(from.toLowerCase()) && l.label !== from
  );
  const filteredTo = ELMINA_LOCATIONS.filter(l =>
    to.length === 0
      ? l.label !== to
      : l.label.toLowerCase().includes(to.toLowerCase()) && l.label !== to
  );

  return (
    <div className="flex flex-col h-full pb-0">
      {/* ── Top Panel: Location Inputs ──────────────────────────────── */}
      <div className="shrink-0 bg-white border-b border-slate-200 shadow-sm px-3 pt-3 pb-2 space-y-2 z-10 relative">

        {/* From input */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-[#2864A6] focus-within:ring-1 focus-within:ring-[#2864A6]/20 transition">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2864A6] shrink-0" />
            <input
              type="text"
              value={from}
              onChange={e => setFrom(e.target.value)}
              onFocus={() => setFromFocus(true)}
              onBlur={() => setTimeout(() => setFromFocus(false), 150)}
              placeholder="Current location"
              className="flex-1 text-xs bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {from ? (
              <button onClick={() => setFrom('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleEnableLocation}
                className="flex items-center gap-1 text-[10px] font-semibold text-[#2864A6] hover:text-[#1E3C66] whitespace-nowrap"
                title="Enable GPS location"
              >
                <Locate className="w-3.5 h-3.5" />
                <span>{locationGranted ? 'Located' : 'Use GPS'}</span>
              </button>
            )}
          </div>

          {/* From dropdown */}
          {fromFocus && filteredFrom.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-30">
              {filteredFrom.map(loc => (
                <button
                  key={loc.id}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 transition border-b border-slate-100 last:border-0"
                  onMouseDown={() => { setFrom(loc.label); setFromFocus(false); }}
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 truncate">{loc.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{loc.sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connector dot line */}
        <div className="flex items-center gap-2 px-1">
          <div className="ml-1 flex flex-col items-center gap-0.5">
            <div className="w-0.5 h-1 bg-slate-300 rounded" />
            <div className="w-0.5 h-1 bg-slate-300 rounded" />
          </div>
        </div>

        {/* To input */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/20 transition">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <input
              type="text"
              value={to}
              onChange={e => setTo(e.target.value)}
              onFocus={() => setToFocus(true)}
              onBlur={() => setTimeout(() => setToFocus(false), 150)}
              placeholder="Choose destination"
              className="flex-1 text-xs bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {to && (
              <button onClick={() => setTo('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* To dropdown */}
          {toFocus && filteredTo.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-30">
              {filteredTo.map(loc => (
                <button
                  key={loc.id}
                  type="button"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 transition border-b border-slate-100 last:border-0"
                  onMouseDown={() => { setTo(loc.label); setToFocus(false); }}
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 truncate">{loc.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{loc.sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Route Priority Preference Selector */}
        <div className="pt-0.5 pb-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span className="uppercase tracking-wider">Route Priority</span>
            <span className="text-[9px] text-slate-400 font-medium">Choose focus</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {[
              { id: 'safest', label: 'Safest', routeId: 'A', icon: ShieldCheck, active: 'bg-emerald-600 text-white border-emerald-600', iconColor: 'text-emerald-600' },
              { id: 'fastest', label: 'Fastest', routeId: 'B', icon: Zap, active: 'bg-amber-500 text-white border-amber-500', iconColor: 'text-amber-500' },
              { id: 'shortest', label: 'Shortest', routeId: 'C', icon: Ruler, active: 'bg-[#2864A6] text-white border-[#2864A6]', iconColor: 'text-[#2864A6]' },
            ].map(cat => {
              const isActive = (routeCategory || 'safest') === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (setRouteCategory) setRouteCategory(cat.id);
                    if (setSelectedRouteId) setSelectedRouteId(cat.routeId);
                  }}
                  className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] font-bold border transition-all ${
                    isActive ? `${cat.active} shadow-sm` : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-white' : cat.iconColor}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm ${
            canConfirm
              ? 'bg-[#2864A6] hover:bg-[#1E3C66] text-white cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Navigation2 className="w-3.5 h-3.5" />
          <span>Find Safe Routes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Map Area ────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Google Maps (light mode, simple pin mode) */}
        <GoogleMapsTownshipView
          theme="day"
          simpleMode={true}
          fromPin={fromPin}
          toPin={toPin}
          showOverlayLabels={false}
          showHeader={false}
        />

        {/* Floating hint if nothing typed yet */}
        {!from && !to && (
          <div className="absolute bottom-4 left-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-md z-10">
            <Search className="w-3.5 h-3.5 text-[#2864A6] shrink-0" />
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Enter your <span className="text-slate-900 font-semibold">origin</span> and <span className="text-slate-900 font-semibold">destination</span> above to compare safe night routes across Elmina.
            </p>
          </div>
        )}

        {/* From/To legend on map when selected */}
        {(from || to) && (
          <div className="absolute top-2 right-2 space-y-1 z-10">
            {from && (
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#2864A6]/30 rounded-lg px-2 py-1 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#2864A6] shrink-0" />
                <span className="text-[9px] text-slate-700 font-semibold max-w-[100px] truncate">{from}</span>
              </div>
            )}
            {to && (
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-rose-400/30 rounded-lg px-2 py-1 shadow-sm">
                <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                <span className="text-[9px] text-slate-700 font-semibold max-w-[100px] truncate">{to}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
