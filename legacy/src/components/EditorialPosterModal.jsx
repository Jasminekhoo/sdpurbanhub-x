import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Sliders, Printer, Check, Compass, Layers } from 'lucide-react';

export const EditorialPosterModal = () => {
  const { isPosterOpen, closePoster } = useApp();

  const [motionField, setMotionField] = useState('vertical-drop'); // vertical-drop, ascending-line, directional-flow, outward-radial, ripple-waves
  const [accentColor, setAccentColor] = useState('#214B74'); // SDP Navy, Forest Olive, Terracotta
  const [title, setTitle] = useState('URBANHUB-X // ASTER');
  const [isCopied, setIsCopied] = useState(false);

  if (!isPosterOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const motionOptions = [
    { id: 'vertical-drop', label: 'Vertical Drop' },
    { id: 'ascending-line', label: 'Ascending Line' },
    { id: 'directional-flow', label: 'Directional Flow' },
    { id: 'outward-radial', label: 'Radial Dispersion' },
    { id: 'ripple-waves', label: 'Fine Ripple Waves' },
  ];

  const colorOptions = [
    { hex: '#214B74', name: 'SDP Navy' },
    { hex: '#2D5A43', name: 'Sanctuary Olive' },
    { hex: '#8B422B', name: 'Terracotta Earth' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col lg:flex-row max-h-[92vh]">
        
        {/* Left / Center: The 3:4 Editorial Poster Canvas */}
        <div className="flex-1 bg-stone-900 p-6 sm:p-8 flex items-center justify-center overflow-auto">
          {/* 3:4 Aspect Ratio Poster Frame */}
          <div 
            id="editorial-poster-frame"
            className="w-full max-w-[420px] aspect-[3/4] bg-[#F7F5F0] rounded-sm shadow-2xl overflow-hidden flex flex-col relative select-none border border-stone-300"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0,0,0,0.1)'
            }}
          >
            {/* ========================================================
                [TOP HALF (50%)]: Exhibition-grade architectural photo
               ======================================================== */}
            <div className="h-1/2 w-full relative overflow-hidden bg-slate-800">
              {/* Refined exhibition photograph SVG/CSS rendering */}
              <svg 
                viewBox="0 0 600 800" 
                preserveAspectRatio="xMidYMid slice" 
                className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.98] saturate-[0.88]"
              >
                <defs>
                  {/* Sky gradient - natural morning light with fine art grading */}
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C8D4DF" />
                    <stop offset="60%" stopColor="#E2E7EC" />
                    <stop offset="100%" stopColor="#F0ECE4" />
                  </linearGradient>

                  <linearGradient id="towerFacet1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2E3B4E" />
                    <stop offset="100%" stopColor="#1E2734" />
                  </linearGradient>

                  <linearGradient id="towerFacet2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4A5B72" />
                    <stop offset="100%" stopColor="#354458" />
                  </linearGradient>

                  <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                    <stop offset="100%" stopColor="rgba(33,75,116,0.3)" />
                  </linearGradient>

                  {/* Fine grain filter */}
                  <filter id="photoGrain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0" />
                    <feComposite in2="SourceGraphic" in="glitch" operator="in" />
                  </filter>
                </defs>

                {/* Sky */}
                <rect width="600" height="800" fill="url(#skyGrad)" />

                {/* Ambient mist/cloud layer */}
                <circle cx="150" cy="400" r="320" fill="#ffffff" opacity="0.3" filter="blur(60px)" />
                <circle cx="500" cy="500" r="280" fill="#E8DEC8" opacity="0.25" filter="blur(70px)" />

                {/* Architectural Subject: Aster Residence Tower */}
                {/* Secondary background tower */}
                <path d="M 380 320 L 510 260 L 510 800 L 380 800 Z" fill="#718296" opacity="0.75" />
                <path d="M 445 290 L 510 260 L 510 800 L 445 800 Z" fill="#58677A" opacity="0.65" />

                {/* Main Monolith Tower (Aster Residence) */}
                <path d="M 120 180 L 340 110 L 340 800 L 120 800 Z" fill="url(#towerFacet1)" />
                <path d="M 340 110 L 440 150 L 440 800 L 340 800 Z" fill="url(#towerFacet2)" />

                {/* Architectural balcony grids and rhythmic fenestration */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <g key={`balcony-${i}`} opacity="0.85">
                    <line 
                      x1="130" 
                      y1={210 + i * 32} 
                      x2="330" 
                      y2={145 + i * 32} 
                      stroke="#8AA0B8" 
                      strokeWidth="1.2" 
                    />
                    <line 
                      x1="350" 
                      y1={155 + i * 32} 
                      x2="430" 
                      y2={190 + i * 32} 
                      stroke="#61758A" 
                      strokeWidth="1" 
                    />
                    {/* Architectural cantilever accent */}
                    <rect 
                      x={160 + (i % 3) * 45} 
                      y={202 + i * 32} 
                      width="35" 
                      height="6" 
                      fill="#C5D3E0" 
                      opacity="0.9" 
                    />
                  </g>
                ))}

                {/* Vertical structural mullions */}
                <line x1="180" y1="165" x2="180" y2="800" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1="240" y1="145" x2="240" y2="800" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <line x1="300" y1="125" x2="300" y2="800" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

                {/* Biophilic green vertical terracing on facade */}
                <path d="M 270 380 Q 285 370 310 375 L 310 395 Q 285 390 270 380 Z" fill="#4B6350" opacity="0.9" />
                <path d="M 230 480 Q 255 470 280 475 L 280 495 Q 255 490 230 480 Z" fill="#526E58" opacity="0.9" />

                {/* Diagonal editorial light sheen */}
                <polygon points="120,180 340,110 390,800 120,800" fill="url(#glassReflection)" />
              </svg>

              {/* Photo top-left archival typography tag */}
              <div className="absolute top-4 left-4 z-10 font-mono text-[9px] tracking-widest text-slate-800 uppercase bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-white/50">
                PLATE I · EXHIBITION SPECIMEN
              </div>

              {/* Photo top-right coordinates */}
              <div className="absolute top-4 right-4 z-10 font-mono text-[8.5px] tracking-wider text-slate-700 bg-white/60 px-1.5 py-0.5 rounded-xs">
                3.1390° N, 101.6869° E
              </div>

              {/* Bottom edge subtle hairline split rule */}
              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-stone-300 z-20"></div>
            </div>

            {/* ========================================================
                [BOTTOM HALF (50%)]: Minimalist Surrealist Risograph Print
               ======================================================== */}
            <div 
              className="h-1/2 w-full relative overflow-hidden bg-[#F7F5F0] flex flex-col justify-between p-5"
              style={{
                backgroundColor: '#F7F5F0',
                backgroundImage: 'radial-gradient(rgba(24,24,27,0.12) 0.65px, transparent 0.65px)',
                backgroundSize: '8px 8px'
              }}
            >
              {/* Dynamic Motion Field (Ultra-fine linework, broken trajectory, stipple dots) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <pattern id="stippleDense" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="0.6" fill={accentColor} opacity="0.75" />
                      <circle cx="7" cy="5" r="0.5" fill="#18181B" opacity="0.8" />
                      <circle cx="4" cy="8" r="0.4" fill={accentColor} opacity="0.5" />
                    </pattern>
                  </defs>

                  {/* 1. Choice: Vertical Drop */}
                  {motionField === 'vertical-drop' && (
                    <g>
                      {Array.from({ length: 22 }).map((_, i) => (
                        <g key={`vdrop-${i}`}>
                          <line
                            x1={40 + i * 15}
                            y1="0"
                            x2={40 + i * 15}
                            y2={120 + ((i * 37) % 180)}
                            stroke={i % 3 === 0 ? accentColor : '#18181B'}
                            strokeWidth={i % 4 === 0 ? '0.9' : '0.45'}
                            strokeDasharray={i % 2 === 0 ? '4 3 1 2' : '2 5'}
                            opacity={0.3 + (i % 5) * 0.12}
                          />
                          {/* Stipple micro clusters along trajectories */}
                          <circle cx={40 + i * 15} cy={60 + (i * 20) % 100} r="1" fill={accentColor} opacity="0.6" />
                          <circle cx={40 + i * 15} cy={140 + (i * 15) % 80} r="0.7" fill="#18181B" opacity="0.4" />
                        </g>
                      ))}
                      {/* Density gradient near silhouette */}
                      <circle cx="200" cy="260" r="70" fill="url(#stippleDense)" opacity="0.5" />
                    </g>
                  )}

                  {/* 2. Choice: Ascending Line */}
                  {motionField === 'ascending-line' && (
                    <g>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <g key={`asc-${i}`}>
                          <line
                            x1={30 + i * 15}
                            y1="400"
                            x2={60 + i * 13}
                            y2={400 - (100 + ((i * 43) % 250))}
                            stroke={i % 2 === 0 ? accentColor : '#18181B'}
                            strokeWidth="0.5"
                            strokeDasharray={i % 3 === 0 ? '6 2 1 3' : '3 4'}
                            opacity={0.35 + (i % 4) * 0.15}
                          />
                          <circle cx={60 + i * 13} cy={400 - (100 + ((i * 43) % 250))} r="1.2" fill={accentColor} />
                        </g>
                      ))}
                    </g>
                  )}

                  {/* 3. Choice: Directional Flow */}
                  {motionField === 'directional-flow' && (
                    <g>
                      {Array.from({ length: 16 }).map((_, i) => (
                        <path
                          key={`flow-${i}`}
                          d={`M 0 ${60 + i * 20} Q 180 ${120 + i * 14} 400 ${40 + i * 24}`}
                          fill="none"
                          stroke={i % 2 === 0 ? accentColor : '#18181B'}
                          strokeWidth="0.55"
                          strokeDasharray={i % 3 === 0 ? '4 2 2 4' : '6 3'}
                          opacity={0.35 + (i % 3) * 0.15}
                        />
                      ))}
                      <circle cx="200" cy="260" r="50" fill="url(#stippleDense)" opacity="0.4" />
                    </g>
                  )}

                  {/* 4. Choice: Outward Radial Dispersion */}
                  {motionField === 'outward-radial' && (
                    <g>
                      {Array.from({ length: 32 }).map((_, i) => {
                        const angle = (i / 32) * Math.PI * 2;
                        const r1 = 30;
                        const r2 = 140 + ((i * 19) % 50);
                        const x1 = 200 + Math.cos(angle) * r1;
                        const y1 = 250 + Math.sin(angle) * r1;
                        const x2 = 200 + Math.cos(angle) * r2;
                        const y2 = 250 + Math.sin(angle) * r2;
                        return (
                          <line
                            key={`rad-${i}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={i % 3 === 0 ? accentColor : '#18181B'}
                            strokeWidth="0.5"
                            strokeDasharray="2 4 1 3"
                            opacity={0.45}
                          />
                        );
                      })}
                      <circle cx="200" cy="250" r="60" fill="none" stroke={accentColor} strokeWidth="0.4" strokeDasharray="3 3" opacity="0.5" />
                      <circle cx="200" cy="250" r="110" fill="none" stroke="#18181B" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.3" />
                    </g>
                  )}

                  {/* 5. Choice: Fine Ripple Waves */}
                  {motionField === 'ripple-waves' && (
                    <g>
                      {Array.from({ length: 18 }).map((_, i) => (
                        <circle
                          key={`ripple-${i}`}
                          cx="200"
                          cy="260"
                          r={18 + i * 14}
                          fill="none"
                          stroke={i % 2 === 0 ? accentColor : '#18181B'}
                          strokeWidth={i % 4 === 0 ? '0.8' : '0.4'}
                          strokeDasharray={i % 3 === 0 ? '3 3' : '1 4'}
                          opacity={0.6 - i * 0.025}
                        />
                      ))}
                    </g>
                  )}

                  {/* Risograph Misalignment Artifact: Slight offset colored duplicate */}
                  <g transform="translate(1.2, 0.8)" opacity="0.35">
                    <polygon points="196,220 204,220 206,260 194,260" fill={accentColor} />
                  </g>

                  {/* ===================================================
                      MAIN ANCHOR: Highly scaled-down minimalist visual silhouette
                      of Aster Residence placed as a small anchor within vast negative space
                     =================================================== */}
                  <g id="main-anchor" transform="translate(193, 230)">
                    {/* Minimalist architectural silhouette */}
                    <polygon points="5,0 9,3 9,45 1,45 1,3" fill="#18181B" />
                    <rect x="3.5" y="-5" width="2" height="6" fill="#18181B" />
                    {/* Micro baseline anchor line */}
                    <line x1="-30" y1="46" x2="40" y2="46" stroke="#18181B" strokeWidth="0.8" />
                    {/* Micro anchor coordinate point */}
                    <circle cx="5" cy="46" r="1.5" fill={accentColor} />
                  </g>
                </svg>
              </div>

              {/* Micro-typography - Top Bar of Print Section */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-stone-700 leading-tight">
                    SDP-ARCHIVE // VOL. 04
                  </div>
                  <div className="font-mono text-[7.5px] text-stone-500 tracking-wider mt-0.5">
                    REF: SIME-DARBY-HACKATHON-2026
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-[8.5px] tracking-widest uppercase text-stone-700">
                    SEC-B / FL-12
                  </div>
                  <div className="font-mono text-[7px] text-stone-500 tracking-wider">
                    [DIR: 090° EAST]
                  </div>
                </div>
              </div>

              {/* Vertical Micro-text integrated along graphic margin */}
              <div 
                className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-[6.5px] uppercase tracking-[0.3em] text-stone-400 select-none pointer-events-none"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                PASSIVE MONITORING · ZERO RES-CONSUMPTION · EST. 2026
              </div>

              <div 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[6.5px] uppercase tracking-[0.3em] text-stone-400 select-none pointer-events-none"
                style={{ writingMode: 'vertical-rl' }}
              >
                RISOGRAPH PRINT PROCESS · 2-COLOR MONOCHROME SEPARATION
              </div>

              {/* Typography & Micro-Layout - Bottom Footer */}
              <div className="relative z-10 pt-2 border-t border-stone-300/80">
                <div className="flex items-end justify-between">
                  <div>
                    {/* Short title with restrained experimental typography */}
                    <h2 className="font-sans font-extrabold text-[15px] sm:text-[16px] tracking-[0.18em] text-stone-900 uppercase leading-none">
                      {title}
                    </h2>
                    <div className="font-mono text-[7.5px] tracking-[0.22em] text-stone-600 mt-1 uppercase">
                      INCLUSIVE COMMUNITY SAFETY · PROACTIVE CARE PLATFORM
                    </div>
                  </div>

                  <div className="text-right font-mono text-[8px] text-stone-700 flex flex-col items-end">
                    <span className="inline-block px-1.5 py-0.5 bg-stone-200 text-stone-800 text-[7px] font-bold tracking-widest rounded-xs">
                      EDITION 01/50
                    </span>
                    <span className="text-[7px] text-stone-400 mt-0.5 tracking-wider">
                      --ar 3:4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Controls Drawer */}
        <div className="w-full lg:w-80 p-6 flex flex-col justify-between bg-white border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-livin-navy" />
                <h3 className="font-bold text-slate-900 text-base">Editorial Poster</h3>
              </div>
              <button
                onClick={closePoster}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Generated directly from <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-livin-navy font-mono">gemini-code-1792220856470.md</code>:
              A high-end 3:4 vertical editorial poster split into equal 1:1 top photographic &amp; bottom Risograph print art sections.
            </p>

            {/* Motion Field Selector */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                <Compass className="w-3.5 h-3.5 text-livin-navy" />
                Dynamic Field Trajectory
              </label>
              <div className="space-y-1.5">
                {motionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setMotionField(opt.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                      motionField === opt.id
                        ? 'bg-livin-navy text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {motionField === opt.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Palette Selector */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-livin-navy" />
                Risograph Ink Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setAccentColor(col.hex)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      accentColor === col.hex
                        ? 'border-livin-navy ring-2 ring-livin-navy/20 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div 
                      className="w-full h-5 rounded mb-1 shadow-inner"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-[10px] font-medium text-slate-700 block truncate">
                      {col.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Preset Selector */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-slate-800 block mb-2">
                Editorial Micro-Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-livin-navy"
                placeholder="Title text"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-livin-navy text-white text-xs font-semibold rounded-xl hover:bg-livin-navy-dark transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Poster</span>
            </button>
            <button
              onClick={closePoster}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
