// ---------------------------------------------------------------------------
// Route risk model — the single definition of "how risky is this route".
//
// Why this module exists
// ----------------------
// The resident live-navigation HUD, the route-comparison cards and the
// schematic map each used to carry their own copy of the route numbers, and
// the DANGER badge was derived from "does any hazard on this route have
// severity High?". That made the *recommended* route (Main Avenue — 94% lit,
// zero sightline and pathway penalties) read as "DANGER: High" purely because
// one broken lamp cover had been reported on it, while the genuinely
// dangerous Garden Shortcut scored exactly the same. The badge also ignored
// hazard status, so a fault the Property team had already resolved still
// kept the route red.
//
// The model
// ---------
//   riskPoints = corridorRisk + hazardRisk
//
//   corridorRisk  How bad the corridor itself is, straight from the canonical
//                 route model: darkness (100 - lighting coverage), blocked
//                 sightlines, damaged pathway.
//
//   hazardRisk    How much the currently OPEN hazards add. A hazard counts
//                 less when the corridor around it is already good: a
//                 shattered lamp cover on a 94% lit avenue with clear
//                 sightlines is a far smaller risk than the same defect on a
//                 58% lit, overgrown garden path.
//
// Danger bands are applied to riskPoints, so the HUD and the comparison card
// always render the same verdict for the same route.
// ---------------------------------------------------------------------------

import {
  SCHEMATIC_NODES,
  SCHEMATIC_ROUTES
} from './nightSafeData';

// ---------------------------------------------------------------------------
// Tunables. Exposed so they can be reasoned about (and tested) in one place.
// ---------------------------------------------------------------------------

// How much each hazard severity contributes, before exposure and status.
const SEVERITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

// How much of that severity actually reaches a passing pedestrian.
const EXPOSURE_WEIGHT = { High: 1.0, Medium: 0.7, Low: 0.4 };

// How much an open hazard still counts once the Property team has engaged.
// A resolved hazard is gone; one with work in progress is being handled.
const STATUS_WEIGHT = {
  'Resolved': 0,
  'In progress': 0.5,
  'Scheduled': 0.75,
  'Reported': 1,
  'Under verification': 1,
  'Verified': 1
};

// Corridor weights — the three things that make a night walk risky.
const DARKNESS_WEIGHT = 0.5;   // per percentage point of unlit corridor
const SIGHTLINE_WEIGHT = 2;    // per penalty point
const PATHWAY_WEIGHT = 2;      // per penalty point

// How much a good corridor discounts the hazards sitting on it.
const HAZARD_CONTEXT_DISCOUNT = 0.6;

// Scales raw hazard load into risk points.
const HAZARD_POINT_SCALE = 5;

// Converts risk points into the 0-100 "Safety Score" the cards show.
const SAFETY_SCORE_SLOPE = 0.8;

// Risk bands. Low <= 22, Moderate <= 45, anything above is High.
// Seeded scenario lands on: Route A 17.6 (Low), Route C 26.5 (Moderate),
// Route B 71.7 (High).
export const DANGER_BANDS = [
  { max: 22, level: 'Low', tone: 'emerald' },
  { max: 45, level: 'Moderate', tone: 'amber' },
  { max: Infinity, level: 'High', tone: 'rose' }
];

const DEFAULT_SEVERITY = 'Medium';
const DEFAULT_EXPOSURE = 'Medium';

function severityWeight(severity) {
  return SEVERITY_WEIGHT[severity] ?? SEVERITY_WEIGHT[DEFAULT_SEVERITY];
}

function exposureWeight(exposure) {
  return EXPOSURE_WEIGHT[exposure] ?? EXPOSURE_WEIGHT[DEFAULT_EXPOSURE];
}

function statusWeight(status) {
  return STATUS_WEIGHT[status] ?? 1;
}

// ---------------------------------------------------------------------------
// Route hazards
// ---------------------------------------------------------------------------

// A hazard belongs to the route(s) it was filed against (`routesAffected`).
// Node membership is only a fallback for records that carry no route
// attribution at all — several nodes (L-05, L-07, L-08) are shared by more
// than one route, so treating node membership as authoritative would file
// Courtyard Link's kerb ramp against the Garden Shortcut as well.
export function hazardsForRoute(routeId, hazards = []) {
  const route = SCHEMATIC_ROUTES[routeId];
  if (!route) return [];

  return hazards.filter(hazard => {
    if (!hazard) return false;
    const attributed = Array.isArray(hazard.routesAffected) && hazard.routesAffected.length > 0;
    if (attributed) return hazard.routesAffected.includes(routeId);
    return route.nodes.includes(hazard.affectedNode);
  });
}

// Hazards still physically present on the ground (a resolved hazard is gone).
export function openHazardsForRoute(routeId, hazards = []) {
  return hazardsForRoute(routeId, hazards).filter(h => h.status !== 'Resolved');
}

// ---------------------------------------------------------------------------
// Risk computation
// ---------------------------------------------------------------------------

function lightingCoverage(routeId) {
  return SCHEMATIC_ROUTES[routeId]?.lightingCoverage ?? 0;
}

// 0 = fully obstructed / unusable, 100 = clear and comfortable.
function sightlineScore(route) {
  return Math.max(0, 100 - (route.penalties?.sightline ?? 0) * 10);
}

function pathwayScore(route) {
  return Math.max(0, 100 - (route.penalties?.pathway ?? 0) * 10);
}

// How good the corridor is overall, 0..1. Used to discount the hazards that
// sit on it.
function corridorQuality(route) {
  const lighting = lightingCoverage(route.id);
  const quality =
    (lighting * 0.5 + sightlineScore(route) * 0.3 + pathwayScore(route) * 0.2) / 100;
  return Math.min(1, Math.max(0, quality));
}

export function corridorRiskPoints(route) {
  const darkness = (100 - lightingCoverage(route.id)) * DARKNESS_WEIGHT;
  const sightline = (route.penalties?.sightline ?? 0) * SIGHTLINE_WEIGHT;
  const pathway = (route.penalties?.pathway ?? 0) * PATHWAY_WEIGHT;
  return darkness + sightline + pathway;
}

export function hazardRiskPoints(route, hazards = []) {
  const contextFactor = 1 - HAZARD_CONTEXT_DISCOUNT * corridorQuality(route);
  const load = openHazardsForRoute(route.id, hazards).reduce((sum, hazard) => {
    const severity = severityWeight(hazard.severity);
    const exposure = exposureWeight(hazard.pedestrianExposure);
    const status = statusWeight(hazard.status);
    return sum + severity * exposure * status;
  }, 0);
  return load * contextFactor * HAZARD_POINT_SCALE;
}

export function dangerBandFor(riskPoints) {
  const band = DANGER_BANDS.find(b => riskPoints <= b.max);
  return band ?? DANGER_BANDS[DANGER_BANDS.length - 1];
}

/**
 * Full risk picture for one route.
 *
 * @param {string} routeId        'A' | 'B' | 'C'
 * @param {Array}  hazards       live hazard list (context state)
 * @param {object} [options]
 * @param {string[]} [options.nodeScope]  restrict hazards to these nodes
 *        (used by the live journey HUD, which only cares about the part of
 *        the route still ahead of the resident)
 */
export function evaluateRoute(routeId, hazards = [], options = {}) {
  const route = SCHEMATIC_ROUTES[routeId];
  if (!route) {
    return {
      routeId,
      riskPoints: 0,
      dangerLevel: 'Low',
      dangerTone: 'emerald',
      score: 0,
      corridorRisk: 0,
      hazardRisk: 0,
      openHazards: [],
      hazards: []
    };
  }

  const scoped = options.nodeScope
    ? hazards.filter(h => !h?.affectedNode || options.nodeScope.includes(h.affectedNode))
    : hazards;

  const corridorRisk = corridorRiskPoints(route);
  const hazardRisk = hazardRiskPoints(route, scoped);
  const riskPoints = Math.round((corridorRisk + hazardRisk) * 10) / 10;
  const band = dangerBandFor(riskPoints);

  return {
    routeId,
    riskPoints,
    dangerLevel: band.level,
    dangerTone: band.tone,
    // 0-100 companion to the risk points. Same scale the comparison card uses.
    score: Math.max(0, Math.min(100, Math.round(100 - riskPoints * SAFETY_SCORE_SLOPE))),
    corridorRisk: Math.round(corridorRisk * 10) / 10,
    hazardRisk: Math.round(hazardRisk * 10) / 10,
    openHazards: openHazardsForRoute(routeId, scoped),
    hazards: hazardsForRoute(routeId, scoped)
  };
}

// ---------------------------------------------------------------------------
// Shared route metrics — every screen reads these, so no two screens can
// disagree about a route's name, ETA, distance or lighting coverage.
// ---------------------------------------------------------------------------

export function routeMetrics(routeId) {
  const route = SCHEMATIC_ROUTES[routeId];
  if (!route) return null;
  return {
    id: route.id,
    name: route.name,
    tagline: route.tagline,
    etaMinutes: route.durationMinutes,
    distanceKm: Math.round((route.distanceMeters / 1000) * 100) / 100,
    distanceMeters: route.distanceMeters,
    lightingCoverage: route.lightingCoverage,
    nodes: route.nodes,
    recommended: route.recommended,
    penalties: route.penalties,
    totalCost: route.totalCost
  };
}

// ---------------------------------------------------------------------------
// Metric descriptors used by the route-comparison cards.
// ---------------------------------------------------------------------------

export function lightingDescriptor(routeId) {
  const coverage = lightingCoverage(routeId);
  if (coverage >= 90) return { value: `Well-lit (${coverage}%)`, status: 'good' };
  if (coverage >= 70) return { value: `Good (${coverage}%)`, status: 'good' };
  if (coverage >= 50) return { value: `Partial (${coverage}%)`, status: 'caution' };
  return { value: `Poor (${coverage}%)`, status: 'warn' };
}

export function sightlineDescriptor(routeId) {
  const penalty = SCHEMATIC_ROUTES[routeId]?.penalties?.sightline ?? 0;
  if (penalty === 0) return { value: 'Clear', status: 'good' };
  if (penalty <= 3) return { value: 'Enclosed', status: 'caution' };
  return { value: 'Overgrown', status: 'warn' };
}

export function walkwayDescriptor(routeId) {
  const penalty = SCHEMATIC_ROUTES[routeId]?.penalties?.pathway ?? 0;
  if (penalty === 0) return { value: 'Paved & Wide', status: 'good' };
  if (penalty <= 3) return { value: 'Paved Courtyard', status: 'good' };
  return { value: 'Uneven Pavers', status: 'warn' };
}

export function hazardDescriptor(routeId, hazards = []) {
  const open = openHazardsForRoute(routeId, hazards);
  if (open.length === 0) return { value: 'None open', status: 'good' };
  const high = open.filter(h => h.severity === 'High').length;
  const label = high > 0 ? `${open.length} open · ${high} high` : `${open.length} open`;
  return {
    value: label,
    status: high > 0 ? 'caution' : 'caution'
  };
}

// Node ids for the part of a route still ahead of the resident.
export function remainingNodeScope(routeId, checkpointIndex = 0) {
  const route = SCHEMATIC_ROUTES[routeId];
  if (!route) return [];
  return route.nodes.slice(Math.max(0, checkpointIndex));
}

// Exposed for the data-model integrity check.
export function knownNodeIds() {
  return new Set(SCHEMATIC_NODES.map(n => n.id));
}
