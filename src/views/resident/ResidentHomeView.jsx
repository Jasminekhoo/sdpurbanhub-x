import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import {
  MapPin,
  Clock,
  ThumbsUp,
  Calendar,
  Camera,
  AlertTriangle,
  User,
  UserX,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { getHazardImage } from '../../assets/hazardImages';

export function ResidentHomeView() {
  const { hazards, showToast } = useNightSafe();

  const [upvotes, setUpvotes] = useState({ 'HZ-103': 22, 'HZ-102': 8, 'HZ-101': 14 });
  const [upvotedItems, setUpvotedItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleToggleUpvote = (id) => {
    const isUpvoted = upvotedItems[id];
    setUpvotedItems(prev => ({ ...prev, [id]: !isUpvoted }));
    setUpvotes(prev => ({ ...prev, [id]: (prev[id] || 0) + (isUpvoted ? -1 : 1) }));
    if (!isUpvoted && showToast) {
      showToast('Thank you for confirming this community hazard report!', 'success');
    }
  };

  const getCleanCategoryName = (item) => {
    if (item.feedCategory) return item.feedCategory;
    const text = ((item.category || '') + ' ' + (item.title || '')).toLowerCase();
    if (text.includes('path') || text.includes('pavement')) return 'Damaged Path';
    if (text.includes('vegetation') || text.includes('sightline') || text.includes('vege')) return 'Overgrown Vege';
    if (text.includes('light') || text.includes('lamp')) return 'Light Broken';
    return item.category || 'Environmental Hazard';
  };

  const getAuthorDisplay = (item) => {
    return item.reportedBy || 'Resident';
  };

  // 3 feed categories matching Property Street Condition
  const categories = ['All', 'Light Broken', 'Damaged Path', 'Overgrown Vege'];

  // Identify and filter feeds across the 3 canonical categories
  const canonicalFeeds = hazards.filter(h => {
    const text = ((h.category || '') + ' ' + (h.title || '') + ' ' + (h.feedCategory || '') + ' ' + h.id).toLowerCase();
    return (
      text.includes('path') ||
      text.includes('pavement') ||
      text.includes('vegetation') ||
      text.includes('sightline') ||
      text.includes('light') ||
      text.includes('lamp') ||
      ['hz-101', 'hz-102', 'hz-103', 'hz-104', 'hz-105', 'hz-106', 'hz-107'].includes(h.id?.toLowerCase())
    );
  });

  // Grouped sort to align with Property Street Condition:
  // 1. Streetlight Condition ('Light Broken')
  // 2. Ground Condition ('Damaged Path')
  // 3. Overgrown Vegetation ('Overgrown Vege')
  const sortedFeeds = [...canonicalFeeds].sort((a, b) => {
    const orderScore = (item) => {
      const name = getCleanCategoryName(item);
      if (name === 'Light Broken') return 1;
      if (name === 'Damaged Path') return 2;
      if (name === 'Overgrown Vege') return 3;
      return 4;
    };
    if (orderScore(a) !== orderScore(b)) {
      return orderScore(a) - orderScore(b);
    }
    return (a.id || '').localeCompare(b.id || '');
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Filters: area, sortOrder ('latest' | 'hottest'), date
  const [selectedArea, setSelectedArea] = useState('All');
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' | 'hottest'
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD' or null
  
  // Calendar month/year navigation state (defaults to October 2026 for demo data)
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(9); // 0-indexed: 9 = October

  // Derive distinct locations dynamically from hazards data + approved township areas
  const areas = [
    'All',
    'Garden Shortcut',
    'Central Boulevard',
    'North Avenue Crossing',
    'Courtyard Link',
    'Courtyard Inner Perimeter',
    'Transit Connector Hub'
  ];

  // Helper to convert reportDate (e.g. "18 Oct 2026") to YYYY-MM-DD
  const parseReportDate = (str = '') => {
    if (!str) return null;
    const parts = str.trim().split(' ');
    if (parts.length < 3) return null;
    const day = parts[0].padStart(2, '0');
    const monthNames = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
    const month = monthNames[parts[1].toLowerCase().slice(0, 3)] || '10';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  };

  // Helper to format YYYY-MM-DD back to display string (e.g. "18 Oct 2026")
  const formatIsoDate = (isoStr) => {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-');
    const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(d, 10)} ${mNames[parseInt(m, 10) - 1]} ${y}`;
  };

  const activeFiltersCount = (selectedArea !== 'All' ? 1 : 0) +
    (sortOrder !== 'latest' ? 1 : 0) +
    (selectedDate ? 1 : 0);

  const resetFilters = () => {
    setSelectedArea('All');
    setSortOrder('latest');
    setSelectedDate(null);
  };

  const filteredHazards = sortedFeeds.filter(h => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = (h.title || '').toLowerCase().includes(q) ||
        (h.description || '').toLowerCase().includes(q) ||
        (h.location || '').toLowerCase().includes(q) ||
        getCleanCategoryName(h).toLowerCase().includes(q);
      if (!match) return false;
    }

    // Area filter
    if (selectedArea !== 'All') {
      if (!((h.location || '').toLowerCase().includes(selectedArea.toLowerCase()))) return false;
    }

    // Date filter (calendar date matching)
    if (selectedDate) {
      const hDateIso = parseReportDate(h.reportDate);
      if (hDateIso !== selectedDate) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortOrder === 'hottest') {
      const countA = upvotes[a.id] || 0;
      const countB = upvotes[b.id] || 0;
      if (countB !== countA) return countB - countA;
    } else {
      // 'latest': sort by reportDate / timestamp descending
      const dateA = parseReportDate(a.reportDate) || '';
      const dateB = parseReportDate(b.reportDate) || '';
      if (dateB !== dateA) return dateB.localeCompare(dateA);
    }
    return 0;
  });

  return (
    <div className="space-y-4 pb-6 pt-1">
      {/* Search Bar & Filter Button (replaces category section) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setFilterModalOpen(true)}
          className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition cursor-pointer shadow-sm ${activeFiltersCount > 0
              ? 'bg-[#2864A6] text-white border-[#2864A6]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
            }`}
          title="Open filters"
        >
          <Filter className="w-4 h-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter summary pill if filters applied */}
      {(activeFiltersCount > 0 || searchQuery) && (
        <div className="flex items-center justify-between text-[11px] bg-sky-50/80 border border-sky-100 px-3 py-1.5 rounded-lg text-slate-600">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-semibold text-[#2864A6]">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded bg-white border border-sky-200 text-slate-700">
                "{searchQuery}"
              </span>
            )}
            {selectedArea !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-white border border-sky-200 text-slate-700">
                Area: {selectedArea}
              </span>
            )}
            {sortOrder !== 'latest' && (
              <span className="px-2 py-0.5 rounded bg-white border border-sky-200 text-slate-700">
                Sort: Hottest
              </span>
            )}
            {selectedDate && (
              <span className="px-2 py-0.5 rounded bg-white border border-sky-200 text-slate-700">
                Date: {formatIsoDate(selectedDate)}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              resetFilters();
            }}
            className="text-[#2864A6] hover:underline font-semibold ml-2 whitespace-nowrap cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Modal Popup */}
      {filterModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-fadeIn" onClick={() => setFilterModalOpen(false)}>
          <div
            className="bg-white rounded-t-2xl w-full shadow-xl border border-slate-200 overflow-hidden transform transition-all flex flex-col"
            style={{ maxHeight: '88%' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#2864A6] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Filter Community Feeds</h3>
              </div>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {/* Filter 1: Area */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Area / Location</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {areas.map(area => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${selectedArea === area
                          ? 'bg-[#2864A6] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 2: Sort by Latest / Hottest */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sort By</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSortOrder('latest')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${sortOrder === 'latest'
                        ? 'bg-[#2864A6] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    Latest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder('hottest')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${sortOrder === 'hottest'
                        ? 'bg-[#2864A6] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    Hottest
                  </button>
                </div>
              </div>

              {/* Filter 3: Calendar Date Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Report Date</span>
                  </label>
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="text-[11px] font-semibold text-[#2864A6] hover:underline cursor-pointer"
                    >
                      Clear date
                    </button>
                  )}
                </div>

                {/* Calendar Card Component */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2">
                  {/* Calendar Month & Year Selector with Navigation */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        {new Date(calYear, calMonth, 1).toLocaleDateString('en-US', { month: 'long' })}
                      </span>
                      {/* Year Dropdown */}
                      <select
                        value={calYear}
                        onChange={(e) => setCalYear(parseInt(e.target.value, 10))}
                        className="text-xs font-bold text-[#2864A6] bg-white border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#2864A6] cursor-pointer shadow-2xs"
                      >
                        {Array.from({ length: 15 }, (_, i) => 2020 + i).map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (calMonth === 0) {
                            setCalMonth(11);
                            setCalYear(prev => prev - 1);
                          } else {
                            setCalMonth(prev => prev - 1);
                          }
                        }}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition cursor-pointer"
                        title="Previous month"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (calMonth === 11) {
                            setCalMonth(0);
                            setCalYear(prev => prev + 1);
                          } else {
                            setCalMonth(prev => prev + 1);
                          }
                        }}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition cursor-pointer"
                        title="Next month"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <div key={d} className="py-0.5">{d}</div>
                    ))}
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                      const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
                      const cells = [];

                      // Empty slots before 1st of month
                      for (let i = 0; i < firstDayIndex; i++) {
                        cells.push(<div key={`empty-${i}`} className="h-7 w-7" />);
                      }

                      // Month days
                      for (let day = 1; day <= daysInMonth; day++) {
                        const mStr = String(calMonth + 1).padStart(2, '0');
                        const dStr = String(day).padStart(2, '0');
                        const dateIso = `${calYear}-${mStr}-${dStr}`;
                        const isSelected = selectedDate === dateIso;
                        
                        // Check if demo feeds exist on this day (17 or 18 Oct 2026)
                        const hasFeedReports = canonicalFeeds.some(f => parseReportDate(f.reportDate) === dateIso);

                        cells.push(
                          <button
                            key={dateIso}
                            type="button"
                            onClick={() => setSelectedDate(isSelected ? null : dateIso)}
                            className={`h-7 w-7 mx-auto rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition relative cursor-pointer ${
                              isSelected
                                ? 'bg-[#2864A6] text-white shadow-xs font-bold'
                                : hasFeedReports
                                ? 'bg-sky-100/80 text-[#1E3C66] font-bold hover:bg-sky-200/70'
                                : 'text-slate-700 hover:bg-slate-200/80'
                            }`}
                          >
                            <span>{day}</span>
                            {/* Dot indicator for days with reports */}
                            {hasFeedReports && !isSelected && (
                              <span className="w-1 h-1 rounded-full bg-sky-500 absolute bottom-0.5" />
                            )}
                          </button>
                        );
                      }
                      return cells;
                    })()}
                  </div>

                  {/* Calendar Legend / Selection Info */}
                  <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span>Has report</span>
                    </div>
                    {selectedDate ? (
                      <span className="font-semibold text-[#2864A6]">
                        Selected: {formatIsoDate(selectedDate)}
                      </span>
                    ) : (
                      <span className="italic text-slate-400">All dates</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed Cards */}
      <div className="space-y-4">
        {filteredHazards.map((item, index) => {
          const count = upvotes[item.id] || 0;
          const hasUpvoted = upvotedItems[item.id];
          const authorName = getAuthorDisplay(item);
          const isAnonymous = authorName.toLowerCase().includes('anonymous');
          const cleanTime = (item.timestamp || '').replace(/·.*$/g, '').trim();
          const imgSrc = item.figureUrl || getHazardImage(item);

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Figure — full-width photo */}
              <div className="relative bg-slate-900 overflow-hidden">
                <img
                  src={imgSrc}
                  alt={item.figureCaption || item.title}
                  className="w-full h-56 object-cover block"
                  loading="eager"
                  onError={(e) => {
                    const fallback = getHazardImage(item);
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
              </div>

              {/* Caption strip */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Camera className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <p className="text-[11px] text-slate-600 italic truncate">{item.figureCaption || item.title}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                    {item.feedCategory || item.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{item.id}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Author & Date/Time Row — Date and Time together at same level */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Resident Name / Anonymous */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${isAnonymous
                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                        : 'bg-sky-50 border-sky-200 text-[#2864A6]'
                      }`}>
                      {isAnonymous ? <UserX className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {authorName}
                    </span>
                  </div>

                  {/* Date and Time together at same level */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.reportDate || '18 Oct 2026'}</span>
                    <span className="text-slate-300">·</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cleanTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                {/* Footer: location + upvote */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate max-w-[200px]">{item.location}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleUpvote(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${hasUpvoted
                        ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-sky-600 text-sky-600' : ''}`} />
                    <span>{count}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

