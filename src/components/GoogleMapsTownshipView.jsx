import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadGoogleMapsScript, resetGoogleMapsLoader } from '../utils/googleMapsLoader';
import { ELMINA_CENTER, NODE_COORDINATES, ROUTE_GPS_PATHS, HAZARD_COORDINATES } from '../data/elminaGeoData';
import { SchematicTownshipMap } from './SchematicTownshipMap';

export function GoogleMapsTownshipView({
  theme = 'day',
  selectedRoute = 'A',
  activeLamps = [],
  currentCheckpointNode = null,
  hazards = [],
  onSelectHazard = null,
  alerts = [],
  height = '100%',
  showHeader = false,
  showOverlayLabels = true,
  // Optional origin/destination pin lat/lng for NightPathView
  fromPin = null,  // { lat, lng, label }
  toPin = null,    // { lat, lng, label }
  simpleMode = false, // true = minimal overlays (just pins), for location picker
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const circlesRef = useRef([]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // 'idle' | 'loading' | 'loaded' | 'error' | 'no_key'
  const [loadState, setLoadState] = useState('idle');

  // ── Step 1: Start loading script ───────────────────────────────────────────
  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      setLoadState('no_key');
      return;
    }

    let cancelled = false;
    setLoadState('loading');

    // onAuthFailure: called by googleMapsLoader when gm_authFailure fires.
    // This can happen before OR after the script's onload — the loader handles
    // both orderings, so we just need to react here.
    const handleAuthFailure = () => {
      if (!cancelled) setLoadState('error');
    };

    loadGoogleMapsScript(apiKey, handleAuthFailure)
      .then(() => {
        if (!cancelled) setLoadState('loaded');
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('[GoogleMapsTownshipView] Maps load failed — using schematic fallback:', err?.message || err);
          setLoadState('error');
        }
      });

    return () => { cancelled = true; };
  }, [apiKey]);

  // ── Step 2: Init map once script is loaded AND div is in the DOM ───────────
  useEffect(() => {
    if (loadState !== 'loaded') return;
    if (!mapContainerRef.current) return;
    if (!window.google || !window.google.maps) return;

    // Destroy old instance if any
    if (mapInstanceRef.current) {
      clearMapObjects();
      mapInstanceRef.current = null;
    }

    const maps = window.google.maps;
    const isDark = theme === 'night';

    const lightStyle = [
      { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#374151' }] },
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d1fae5' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bae6fd' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
      { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#cbd5e1' }] },
      { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
    ];

    const darkStyle = [
      { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#253d68' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6693' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
    ];

    // Guard: gm_authFailure may have fired between state update and this effect.
    // Constructing a Map with an invalid auth throws synchronously and would
    // propagate as an unhandled React render error — catch it and fall back.
    let map;
    try {
      map = new maps.Map(mapContainerRef.current, {
        center: ELMINA_CENTER,
        zoom: 15.5,
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: maps.ControlPosition.RIGHT_CENTER },
        fullscreenControl: false,
        styles: isDark ? darkStyle : lightStyle,
      });
    } catch (initErr) {
      console.warn('[GoogleMapsTownshipView] Map init failed — falling back to schematic:', initErr?.message || initErr);
      setLoadState('error');
      return;
    }

    mapInstanceRef.current = map;
    renderOverlays(maps, map);

    return () => {
      clearMapObjects();
      mapInstanceRef.current = null;
    };
  }, [loadState, theme]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearMapObjects = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];
  };

  const renderOverlays = (maps, map) => {
    clearMapObjects();

    if (simpleMode) {
      // ── Simple mode: just origin/destination pins ──────────────────────────
      if (fromPin) {
        const marker = new maps.Marker({
          position: { lat: fromPin.lat, lng: fromPin.lng },
          map,
          title: fromPin.label || 'Origin',
          zIndex: 20,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#2864A6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5,
          },
        });
        markersRef.current.push(marker);
      }

      if (toPin) {
        const marker = new maps.Marker({
          position: { lat: toPin.lat, lng: toPin.lng },
          map,
          title: toPin.label || 'Destination',
          zIndex: 20,
          icon: {
            path: maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
        markersRef.current.push(marker);
      }

      // Draw a dashed line between the two pins
      if (fromPin && toPin) {
        const line = new maps.Polyline({
          path: [
            { lat: fromPin.lat, lng: fromPin.lng },
            { lat: toPin.lat, lng: toPin.lng },
          ],
          geodesic: true,
          strokeColor: '#2864A6',
          strokeOpacity: 0,
          strokeWeight: 0,
          icons: [{
            icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.8, strokeWeight: 2.5, strokeColor: '#2864A6', scale: 4 },
            offset: '0',
            repeat: '16px',
          }],
          map,
        });
        polylinesRef.current.push(line);
      }
      return;
    }

    // ── Full mode: routes + nodes + hazards ───────────────────────────────────
    // 1. Draw Routes
    ['A', 'B', 'C'].forEach((rId) => {
      const isSelected = selectedRoute === rId;
      const color = rId === 'A' ? '#10b981' : rId === 'B' ? '#f59e0b' : '#2864a6';

      const polyline = new maps.Polyline({
        path: ROUTE_GPS_PATHS[rId],
        geodesic: true,
        strokeColor: color,
        strokeOpacity: isSelected ? 0.95 : 0.35,
        strokeWeight: isSelected ? 6 : 3,
        map,
        zIndex: isSelected ? 10 : 2,
      });
      polylinesRef.current.push(polyline);
    });

    // 2. Draw Checkpoint Lamp Nodes
    Object.entries(NODE_COORDINATES).forEach(([nodeId, pos]) => {
      const isCurrent = currentCheckpointNode === nodeId;
      const isLit = activeLamps.includes(nodeId);

      if (isLit) {
        const circle = new maps.Circle({
          strokeColor: '#f59e0b',
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: '#fef08a',
          fillOpacity: 0.25,
          map,
          center: pos,
          radius: 45,
          zIndex: 5,
        });
        circlesRef.current.push(circle);
      }

      const marker = new maps.Marker({
        position: pos,
        map,
        title: `${pos.name} (${nodeId})`,
        zIndex: isCurrent ? 25 : 15,
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale: isCurrent ? 9 : 6.5,
          fillColor: isCurrent ? '#0284c7' : isLit ? '#f59e0b' : '#64748b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
      markersRef.current.push(marker);
    });

    // 3. Draw Hazard pins
    hazards.forEach((h) => {
      const hCoord = HAZARD_COORDINATES[h.id];
      if (!hCoord) return;

      const marker = new maps.Marker({
        position: hCoord,
        map,
        title: h.title,
        zIndex: 20,
        icon: {
          path: maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 4.5,
          fillColor: h.severity === 'High' ? '#ef4444' : '#f59e0b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
        },
      });
      if (onSelectHazard) {
        marker.addListener('click', () => onSelectHazard(h));
      }
      markersRef.current.push(marker);
    });
  };

  // ── Update overlays when props change (after map is ready) ─────────────────
  useEffect(() => {
    if (loadState === 'loaded' && window.google?.maps && mapInstanceRef.current) {
      renderOverlays(window.google.maps, mapInstanceRef.current);
    }
  }, [selectedRoute, activeLamps, currentCheckpointNode, hazards, onSelectHazard, fromPin, toPin]);

  // ── Render ─────────────────────────────────────────────────────────────────
  // Always render the map container div so mapContainerRef.current is available.
  // Show schematic overlay on top when not loaded.
  const showFallback = loadState === 'no_key' || loadState === 'error';

  if (showFallback) {
    return (
      <div className="relative w-full h-full">
        <SchematicTownshipMap
          theme={theme}
          selectedRoute={selectedRoute}
          activeLamps={activeLamps}
          currentCheckpointNode={currentCheckpointNode}
          hazards={hazards}
          alerts={alerts}
          onSelectHazard={onSelectHazard}
          height={height}
          showLegend={false}
          showOverlayLabels={showOverlayLabels}
          showHeader={showHeader}
        />
        {loadState === 'error' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetGoogleMapsLoader();
              setLoadState('loading');
              loadGoogleMapsScript(apiKey, () => setLoadState('error'))
                .then(() => setLoadState('loaded'))
                .catch(() => setLoadState('error'));
            }}
            className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-600/95 hover:bg-amber-700 active:scale-95 text-white text-[10px] font-semibold shadow-md backdrop-blur-sm transition-all cursor-pointer"
            title="Click to retry connecting to Google Maps"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-pulse" />
            <span>Google Maps: Pending Cloud Activation · Click to Retry</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map container — always in DOM so ref is available on first render */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ height, minHeight: '300px' }}
      />

      {/* Loading shimmer overlay — sits on top until map tiles load */}
      {(loadState === 'idle' || loadState === 'loading') && (
        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-8 h-8 border-2 border-[#2864A6] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading map…</span>
        </div>
      )}
    </div>
  );
}
