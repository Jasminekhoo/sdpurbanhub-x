// NightSafe Loop - Shared Data Model & Simulated Scenario
// Hackathon Context: Sime Darby Property University Hackathon 2026

import {
  BROKEN_STREET_LIGHT_IMG,
  OVERGROWN_VEGETATION_IMG,
  DAMAGED_PATHWAY_IMG
} from '../assets/hazardImages';
import {
  BROKEN_STREET_LIGHT_2_JPEG_IMG,
  DAMAGED_PATHWAY_2_JPEG_IMG,
  DAMAGED_PATHWAY_3_JPEG_IMG,
  OVERGROWN_VEGETATION_2_JPEG_IMG
} from '../assets/allHazardPictures';

export {
  CITY_OF_ELMINA_DATA,
  ELMINA_CATEGORIES,
  ELMINA_LOCATIONS,
  searchElminaLocations,
  getLocationsByCategory
} from './cityOfElminaAreas';

export const TOWNSHIP_INFO = {
  name: "Sime Darby Property — Sample Township (Demo Environment)",
  badge: "Prototype Demo · Simulated Data",
  disclaimer: "No real emergency services or streetlights are connected.",
  hackathonTrack: "People: Safety & Security, Accessibility & Inclusion, Getting Around",
  studentTeam: "2 Quantity Surveying & 2 Computer Science Students"
};

// ---------------------------------------------------------------------------
// Canonical enumerations — single source of truth shared by all three roles
// (Resident / Security / Property). Every seed record must only use values
// from these lists, otherwise the UI filters and badges break silently.
// ---------------------------------------------------------------------------

// Hazard lifecycle: reachable via the Property Inspector status buttons.
// 'Reported' -> 'Under verification' -> 'Verified' -> 'In progress' -> 'Resolved'
// 'Scheduled' is assigned by Property when work is queued for a later cycle.
export const HAZARD_STATUSES = [
  'Reported',
  'Under verification',
  'Verified',
  'Scheduled',
  'In progress',
  'Resolved'
];

// Alert lifecycle: driven by the Security console action buttons.
export const ALERT_STATUSES = [
  'Awaiting security acknowledgement',
  'Acknowledged',
  'Response in progress',
  'Resolved — demo'
];

export const SEVERITY_LEVELS = ['High', 'Medium', 'Low'];

// Evidence feeds used by the Property "Lighting / Corridor" screen to group
// hazards, and by the Resident feed. Every hazard must land in exactly one.
export const FEED_CATEGORIES = ['Light Broken', 'Damaged Path', 'Overgrown Vege', 'Other'];

// Derives the evidence feed from a hazard category. This reproduces the
// feedCategory already stored on every seed hazard, and guarantees that
// hazards submitted through the Resident form also land in a visible feed
// instead of disappearing from the Property grouping.
export function feedCategoryFor(category = '') {
  const c = String(category).toLowerCase();
  if (c.includes('light')) return 'Light Broken';
  if (c.includes('sightline') || c.includes('vegetation') || c.includes('overgrown') || c.includes('vege')) return 'Overgrown Vege';
  if (c.includes('path') || c.includes('pavement') || c.includes('paver') || c.includes('kerb')) return 'Damaged Path';
  return 'Other';
}

export const RESIDENT_PROFILE = {
  name: "Aina",
  title: "Aina",
  origin: "Community Residence",
  destination: "Central Transit Stop",
  estimatedTime: "8–10 min",
  emergencyContact: "Emergency Contact",
  phoneSimulated: "Active during journey",
  duressPin: "9142",
  duressPinEnabled: true
};

// Schematic lamp & checkpoint nodes across the township
export const SCHEMATIC_NODES = [
  {
    id: "L-01",
    name: "Community Residence Gate",
    area: "Origin Point",
    x: 80,
    y: 280,
    type: "checkpoint_lamp",
    defaultState: "normal", // 'normal' | 'active' | 'fault'
    description: "Well-lit entrance gate with automated sensor"
  },
  {
    id: "L-02",
    name: "North Avenue Junction",
    area: "Route A — Main Avenue",
    x: 220,
    y: 120,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Main avenue node with broad pedestrian sidewalk"
  },
  {
    id: "L-03",
    name: "Main Avenue Pedestrian Walkway",
    area: "Route A — Main Avenue",
    x: 420,
    y: 120,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Mid-avenue checkpoint with continuous paving"
  },
  {
    id: "L-04",
    name: "Central Boulevard Junction",
    area: "Route A — Main Avenue",
    x: 600,
    y: 160,
    type: "checkpoint_lamp",
    defaultState: "fault", // HZ-101 lighting deficiency reported here
    description: "Reported lighting deficiency (HZ-101). Reduced night visibility."
  },
  {
    id: "L-05",
    name: "Garden Shortcut East Gate",
    area: "Route B — Garden Shortcut",
    x: 240,
    y: 380,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Pedestrian gate into garden pathway"
  },
  {
    id: "L-06",
    name: "Garden Shortcut Path",
    area: "Route B — Garden Shortcut",
    x: 420,
    y: 380,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Partially shaded pathway with overgrown shrubs (HZ-102 & HZ-103)"
  },
  {
    id: "L-07",
    name: "Garden Junction",
    area: "Route B — Garden Shortcut",
    x: 580,
    y: 350,
    type: "checkpoint_lamp",
    defaultState: "normal",
    description: "Junction between shortcut and boulevard. Checkpoint for Duress Demo."
  },
  {
    id: "L-08",
    name: "Central Transit Stop",
    area: "Destination Point",
    x: 740,
    y: 240,
    type: "checkpoint_lamp",
    defaultState: "fault", // HZ-104 flickering lamp
    description: "Well-trafficked bus & LRT connector hub. Reported flickering lamp."
  }
];

// Route definitions with baseline and penalty breakdowns
export const SCHEMATIC_ROUTES = {
  A: {
    id: "A",
    name: "Main Avenue",
    tagline: "Recommended Night Route",
    durationMinutes: 9,
    distanceMeters: 620,
    nodes: ["L-01", "L-02", "L-03", "L-04", "L-08"],
    // Share of the corridor that is lit after dusk, 0-100. Canonical field:
    // the risk model, the live-navigation HUD and the route-comparison cards
    // all read it from here so they cannot drift apart.
    lightingCoverage: 94,
    baseTimeIndex: 24,
    penalties: {
      lighting: 7, // fault near L-04
      sightline: 0,
      pathway: 0
    },
    totalCost: 31,
    recommended: true,
    recommendationReason: "Lower modelled environmental cost despite being slightly longer. Better continuous lighting coverage and wider walkway with unobstructed sightlines.",
    caveat: "Route cost is an illustrative environmental model index, not a guarantee of safety or crime prevention.",
    confidence: "High (validated via 3 recent daytime & dusk audits)"
  },
  B: {
    id: "B",
    name: "Garden Shortcut",
    tagline: "Fastest by distance, higher environmental penalties",
    durationMinutes: 7,
    distanceMeters: 480,
    nodes: ["L-01", "L-05", "L-06", "L-07", "L-08"],
    lightingCoverage: 58,
    baseTimeIndex: 18,
    penalties: {
      lighting: 10, // unlit path segment
      sightline: 8,  // overgrown shrubs
      pathway: 7    // damaged pavers & tree roots
    },
    totalCost: 43,
    recommended: false,
    recommendationReason: "Contains multiple environmental penalties: lighting deficiency, overgrown vegetation obstructing sightlines, and damaged pavement section.",
    caveat: "Route cost is an illustrative environmental model index, not a guarantee of safety or crime prevention.",
    confidence: "Medium (pending physical inspection of pavers)"
  },
  C: {
    id: "C",
    name: "Courtyard Link",
    tagline: "Shortest walking path via residential inner courtyard",
    durationMinutes: 8,
    distanceMeters: 520,
    nodes: ["L-01", "L-05", "L-07", "L-08"],
    lightingCoverage: 78,
    baseTimeIndex: 16,
    penalties: {
      lighting: 5,
      sightline: 2,
      pathway: 1
    },
    // 16 + (5 + 2 + 1) = 24. Was 26, which made calculateRouteCost() report a
    // phantom "ΔC 2 pts" improvement before any intervention was applied.
    totalCost: 24,
    recommended: false,
    recommendationReason: "Shortest physical corridor connecting directly through courtyard gates with moderate night illumination.",
    caveat: "Route cost is an illustrative environmental model index, not a guarantee of safety or crime prevention.",
    confidence: "High (residential pathway check)"
  }
};

// Initial Hazards dataset — 3 feeds matched to actual site photos
export const INITIAL_HAZARDS = [
  {
    id: "HZ-101",
    title: "Broken street lamp cover at pedestrian junction",
    category: "Lighting deficiency / faulty streetlight",
    feedCategory: "Light Broken",
    location: "Junction L-04 (Central Boulevard)",
    assignedPath: "Route A",
    affectedNode: "L-04",
    routesAffected: ["A"],
    severity: "High",
    pedestrianExposure: "High",
    urgency: "High",
    evidenceConfidence: "High",
    status: "Reported",
    reportDate: "18 Oct 2026",
    figureUrl: BROKEN_STREET_LIGHT_IMG,
    figureCaption: "Street lamp casing completely shattered, bulb exposed to weather",
    source: "Resident report",
    timestamp: "8:42 PM",
    reportedBy: "Aina (Resident)",
    description: "The lamp cover on the streetlight at Junction L-04 is completely shattered. The bare bulb and wiring are exposed to rain, creating both a safety and electrical hazard for passing pedestrians.",
    estimatedCost: 1800,
    pairedInterventionId: "IN-01"
  },
  {
    id: "HZ-104",
    title: "Damaged lamp post and flickering luminaire",
    category: "Lighting deficiency / faulty streetlight",
    feedCategory: "Light Broken",
    location: "Transit Connector Hub (Lamp L-08)",
    // L-08 (Central Transit Stop) is the shared terminus of Route A, B and C,
    // so this hazard belongs to all three — matching IN-04's penalty reduction.
    assignedPath: "Route A, B & C",
    affectedNode: "L-08",
    routesAffected: ["A", "B", "C"],
    severity: "Medium",
    pedestrianExposure: "High",
    urgency: "High",
    evidenceConfidence: "High",
    status: "Under verification",
    reportDate: "20 Oct 2026",
    figureUrl: BROKEN_STREET_LIGHT_2_JPEG_IMG,
    figureCaption: "Bent housing bracket with intermittently flickering LED pole head",
    source: "Security Routine Audit",
    timestamp: "6:47 PM",
    reportedBy: "Zul (Security Patrol)",
    description: "Street lamp pole head fixture exhibiting loose wiring and rapid strobing/flickering. Significantly degrades night-time visibility for commuters walking toward transit stop.",
    estimatedCost: 1200,
    pairedInterventionId: "IN-04"
  },
  {
    id: "HZ-103",
    title: "Severely cracked and broken pedestrian pathway",
    category: "Damaged / discontinuous pedestrian path",
    feedCategory: "Damaged Path",
    location: "Garden Shortcut midpoint",
    assignedPath: "Route B",
    affectedNode: "L-06",
    routesAffected: ["B"],
    severity: "High",
    pedestrianExposure: "Medium",
    urgency: "High",
    evidenceConfidence: "High",
    status: "Reported",
    reportDate: "17 Oct 2026",
    figureUrl: DAMAGED_PATHWAY_IMG,
    figureCaption: "Severely fractured concrete path with exposed rubble and deep fissures",
    source: "Resident report",
    timestamp: "7:10 PM",
    reportedBy: "Alex Chen (Resident)",
    description: "The concrete pedestrian pathway at the Garden Shortcut midpoint has severely cracked and broken apart, with exposed gravel and rubble. The surface is highly uneven and poses a significant trip and fall hazard, especially at night.",
    estimatedCost: 4500,
    pairedInterventionId: "IN-03"
  },
  {
    id: "HZ-105",
    title: "Sunken sidewalk pavers and erosion hole",
    category: "Damaged / discontinuous pedestrian path",
    feedCategory: "Damaged Path",
    location: "North Avenue Crossing (Lamp L-02)",
    assignedPath: "Route A",
    affectedNode: "L-02",
    routesAffected: ["A"],
    severity: "Medium",
    pedestrianExposure: "High",
    urgency: "Medium",
    evidenceConfidence: "High",
    status: "Under verification",
    reportDate: "20 Oct 2026",
    figureUrl: DAMAGED_PATHWAY_2_JPEG_IMG,
    figureCaption: "Subsided paving tiles with uneven elevation drop exceeding 65mm",
    source: "Resident report",
    timestamp: "6:49 PM",
    reportedBy: "Farah (Resident)",
    description: "Ground subsidence beneath sidewalk pavers creating an abrupt step drop. Could cause ankle sprains or damage to accessibility aids during rainy nights.",
    estimatedCost: 2100,
    // IN-05 is an unrelated capital lighting improvement (it declares
    // targetHazardId: null), so no package currently covers this hazard.
    // Pointing it at IN-05 made the pairing contradict IN-05's own metadata.
    pairedInterventionId: null
  },
  {
    id: "HZ-106",
    title: "Broken kerbstone and curb ramp discontinuity",
    category: "Damaged / discontinuous pedestrian path",
    feedCategory: "Damaged Path",
    location: "Courtyard Link East Access (Lamp L-05)",
    assignedPath: "Route C",
    affectedNode: "L-05",
    routesAffected: ["C"],
    severity: "Medium",
    pedestrianExposure: "Medium",
    urgency: "Medium",
    evidenceConfidence: "High",
    status: "Reported",
    reportDate: "20 Oct 2026",
    figureUrl: DAMAGED_PATHWAY_3_JPEG_IMG,
    figureCaption: "Chipped concrete kerb with exposed aggregate and broken accessibility slope",
    source: "Facilities Inspection",
    timestamp: "6:49 PM",
    reportedBy: "Kamal (Property Maintenance)",
    description: "Kerb ramp at entrance to residential inner courtyard is fractured, blocking smooth pram and wheelchair access from road level to elevated walkway.",
    estimatedCost: 1500,
    pairedInterventionId: "IN-06"
  },
  {
    id: "HZ-102",
    title: "Overgrown vegetation blocking pedestrian sightline",
    category: "Obstructed sightline",
    feedCategory: "Overgrown Vege",
    location: "Garden Shortcut near Lamp L-06",
    assignedPath: "Route B",
    affectedNode: "L-06",
    routesAffected: ["B"],
    severity: "Medium",
    pedestrianExposure: "Medium",
    urgency: "Medium",
    evidenceConfidence: "High",
    status: "Under verification",
    reportDate: "18 Oct 2026",
    figureUrl: OVERGROWN_VEGETATION_IMG,
    figureCaption: "Dense overhanging tree branches encroaching across the roadside walkway",
    source: "Property Grounds Inspection",
    timestamp: "5:15 PM",
    reportedBy: "Anonymous Resident",
    description: "Heavy tree branches and overgrown shrubs are hanging over the walkway, blocking sightlines around the bend near Lamp L-06. Workers are visible attempting to clear the obstruction.",
    estimatedCost: 900,
    pairedInterventionId: "IN-02"
  },
  {
    id: "HZ-107",
    title: "Dense hedge encroachment across footpath",
    category: "Obstructed sightline",
    feedCategory: "Overgrown Vege",
    location: "Courtyard Inner Perimeter (Lamp L-07)",
    assignedPath: "Route C",
    affectedNode: "L-07",
    routesAffected: ["C"],
    severity: "Low",
    pedestrianExposure: "Low",
    urgency: "Low",
    evidenceConfidence: "High",
    status: "Scheduled",
    reportDate: "20 Oct 2026",
    figureUrl: OVERGROWN_VEGETATION_2_JPEG_IMG,
    figureCaption: "Overgrown roadside shrubs narrowing available walking width to under 0.8m",
    source: "Resident report",
    timestamp: "6:50 PM",
    reportedBy: "Siti Nur (Resident)",
    description: "Untrimmed landscaping hedges narrowing the walkway corridor. Requires pedestrians to squeeze past vegetation or step onto adjacent turf.",
    estimatedCost: 650,
    pairedInterventionId: "IN-07"
  }
];

// Candidate Interventions Catalogue (Section 5)
export const CANDIDATE_INTERVENTIONS = [
  {
    id: "IN-01",
    title: "Repair lamp L-04 at Boulevard Junction",
    category: "Lighting Maintenance",
    cost: 1800,
    modelledBenefit: 12,
    targetHazardId: "HZ-101",
    targetRoute: "Route A",
    segmentAffected: "Central Boulevard (L-04)",
    penaltyReduction: { lighting: -7 },
    explanation: "Replaces faulty luminaire with energy-efficient LED luminaire. Resolves HZ-101, reducing Route A cost by 7 points."
  },
  {
    id: "IN-02",
    title: "Trim vegetation near Garden Shortcut",
    category: "Landscape Management",
    cost: 900,
    modelledBenefit: 6,
    targetHazardId: "HZ-102",
    targetRoute: "Route B",
    segmentAffected: "Garden Shortcut Path (L-06)",
    penaltyReduction: { sightline: -6 },
    explanation: "Clears sightline obstruction around bend. Resolves HZ-102, reducing Route B cost by 6 points."
  },
  {
    id: "IN-03",
    title: "Repair damaged pathway section",
    category: "Civil Works / Footpath",
    cost: 4500,
    modelledBenefit: 15,
    targetHazardId: "HZ-103",
    targetRoute: "Route B",
    segmentAffected: "Garden Shortcut midpoint",
    penaltyReduction: { pathway: -7 },
    explanation: "Excavates intrusive roots and relevels interlocking pavers. Resolves HZ-103, reducing Route B cost by 7 points."
  },
  {
    id: "IN-04",
    title: "Repair flickering lamp near Transit Stop",
    category: "Lighting Maintenance",
    cost: 1200,
    modelledBenefit: 8,
    targetHazardId: "HZ-104",
    targetRoute: "Route A, B & C",
    segmentAffected: "Transit Stop Approach (L-08)",
    penaltyReduction: { lighting: -3 },
    explanation: "Replaces faulty LED driver. Resolves HZ-104 at the shared transit terminus, reducing lighting penalties on Route A, B and C by 3 points each."
  },
  {
    id: "IN-05",
    title: "Add / improve lighting at dark path segment",
    category: "Capital Improvement",
    cost: 3000,
    modelledBenefit: 10,
    targetHazardId: null,
    targetRoute: "Route B",
    segmentAffected: "Garden Entrance (L-05 to L-06)",
    penaltyReduction: { lighting: -5 },
    explanation: "Installs supplemental solar bollard luminaires on previously unlit section of garden path."
  },
  {
    id: "IN-06",
    title: "Rebuild kerb ramp at Courtyard Link East Access",
    category: "Civil Works / Footpath",
    cost: 1500,
    modelledBenefit: 6,
    targetHazardId: "HZ-106",
    targetRoute: "Route C",
    segmentAffected: "Courtyard Link East Access (L-05)",
    penaltyReduction: { pathway: -1 },
    explanation: "Reconstructs the fractured kerb ramp and restores a continuous accessibility slope. Resolves HZ-106, reducing Route C cost by 1 point."
  },
  {
    id: "IN-07",
    title: "Clear hedge encroachment at Courtyard Inner Perimeter",
    category: "Landscape Management",
    cost: 650,
    modelledBenefit: 4,
    targetHazardId: "HZ-107",
    targetRoute: "Route C",
    segmentAffected: "Courtyard Inner Perimeter (L-07)",
    penaltyReduction: { sightline: -2 },
    explanation: "Cuts back perimeter hedging to restore a clearance of at least 1.2m. Resolves HZ-107, reducing Route C cost by 2 points."
  }
];

// Initial Alerts — seeded demo queue so the Security console is populated on first
// load. Presenter can still trigger new Duress PIN / SOS cases on top of these.
export const INITIAL_ALERTS = [
  {
    id: "AL-204",
    type: "Discreet Duress Alert",
    severity: "High",
    resident: "Aina",
    residentId: "RES-8821",
    location: "Near Lamp L-07, Garden Junction",
    lastCheckpoint: "L-07 · 9:14 PM",
    alertReceived: "9:15 PM",
    locationFreshness: "Last available demo location — not live tracking",
    status: "Awaiting security acknowledgement",
    notes: [],
    category: "Personal Safety (Discreet)",
    timestamp: "9:15 PM",
    isDuress: true
  },
  {
    id: "AL-946",
    type: "Emergency SOS Alert",
    severity: "High",
    resident: "Aina",
    residentId: "RES-8821",
    location: "Near Lamp L-04 (Central Boulevard Junction)",
    lastCheckpoint: "L-03 · 9:12 PM",
    alertReceived: "9:22 PM",
    locationFreshness: "Last available demo location — not live tracking",
    status: "Awaiting security acknowledgement",
    notes: [],
    category: "Personal Safety",
    timestamp: "9:22 PM",
    isDuress: false
  },
  {
    id: "AL-941",
    type: "Emergency SOS Alert",
    severity: "High",
    resident: "Marcus Lim",
    residentId: "RES-7734",
    location: "Near Lamp L-06 (Garden Shortcut Path)",
    lastCheckpoint: "L-05 · 9:08 PM",
    alertReceived: "9:11 PM",
    locationFreshness: "Last available demo location — not live tracking",
    status: "Response in progress",
    notes: [
      "9:12 PM — Officer: Alert acknowledged by Duty Security Lead.",
      "9:14 PM — Officer: Patrol unit dispatched to Garden Shortcut Path."
    ],
    category: "Personal Safety",
    timestamp: "9:11 PM",
    isDuress: false
  },
  {
    id: "AL-938",
    type: "Missed Checkpoint / No Response",
    severity: "Medium",
    resident: "Aina",
    residentId: "RES-8821",
    location: "Near Lamp L-03 (Main Avenue Pedestrian Walkway)",
    lastCheckpoint: "L-02 · 9:09 PM",
    alertReceived: "9:05 PM",
    locationFreshness: "Simulated checkpoint overdue · Prompt unconfirmed",
    status: "Acknowledged",
    notes: ["9:06 PM — Officer: Wellbeing callback attempted, pending resident reply."],
    category: "Checkpoint Overdue",
    timestamp: "9:05 PM",
    isDuress: false
  },
  {
    id: "AL-469",
    type: "Emergency SOS Alert",
    severity: "High",
    resident: "Priya Nair",
    residentId: "RES-6612",
    location: "Near Lamp L-02 (North Avenue Junction)",
    lastCheckpoint: "L-01 · 8:52 PM",
    alertReceived: "8:54 PM",
    locationFreshness: "Last available demo location — not live tracking",
    status: "Resolved — demo",
    notes: [
      "8:56 PM — Officer: Patrol guard arrived on scene, resident safe.",
      "9:02 PM — Officer: Case closed, luminaires returned to corridor mode."
    ],
    category: "Personal Safety",
    timestamp: "8:54 PM",
    isDuress: false
  }
];

// Preconfigured Duress Alert (Scene 3 & 4)
export const DURESS_ALERT_SEED = {
  id: "AL-204",
  type: "Discreet Duress Alert",
  severity: "High",
  resident: "Aina",
  residentId: "RES-8821",
  location: "Near Lamp L-07, Garden Junction",
  lastCheckpoint: "L-07 · 9:14 PM",
  alertReceived: "9:15 PM",
  locationFreshness: "Last available demo location — not live tracking",
  status: "Awaiting security acknowledgement", // 'Awaiting security acknowledgement' | 'Acknowledged' | 'Response in progress' | 'Resolved — demo'
  notes: [],
  category: "Personal Safety (Discreet)",
  timestamp: "9:15 PM",
  isDuress: true
};

// Checkpoint event log
export const INITIAL_CHECKPOINT_EVENTS = [
  {
    id: "CP-301",
    checkpointId: "L-01",
    checkpointName: "Community Residence Gate",
    residentName: "Aina",
    timestamp: "9:05 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-302",
    checkpointId: "L-02",
    checkpointName: "North Avenue Junction",
    residentName: "Aina",
    timestamp: "9:09 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-303",
    checkpointId: "L-03",
    checkpointName: "Main Avenue Pedestrian Walkway",
    residentName: "Aina",
    timestamp: "9:12 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-304",
    checkpointId: "L-04",
    checkpointName: "Central Boulevard Junction",
    residentName: "Aina",
    timestamp: "9:16 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-305",
    checkpointId: "L-05",
    checkpointName: "Garden Shortcut East Gate",
    residentName: "Marcus Lim",
    timestamp: "9:08 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-306",
    checkpointId: "L-06",
    checkpointName: "Garden Shortcut Path",
    residentName: "Marcus Lim",
    timestamp: "9:10 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-307",
    checkpointId: "L-07",
    checkpointName: "Garden Junction",
    residentName: "Aina",
    timestamp: "9:14 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  },
  {
    id: "CP-308",
    checkpointId: "L-08",
    checkpointName: "Central Transit Stop",
    residentName: "Priya Nair",
    timestamp: "8:58 PM",
    status: "Passed",
    source: "Simulated GPS Node"
  }
];

// ---------------------------------------------------------------------------
// Generates the next collision-free identifier for a collection.
// Ids look like "HZ-108" / "AL-947" / "CP-309". Deriving the counter from the
// current maximum — instead of Date.now() or array length — keeps ids unique
// even after records are deleted or several are created in the same tick.
// ---------------------------------------------------------------------------
export function nextId(prefix, items = [], width = 3) {
  const used = new Set();
  let max = 0;

  (items || []).forEach(item => {
    const id = String(item?.id ?? '');
    if (!id) return;
    used.add(id);
    const match = id.match(/(\d+)$/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });

  let candidate;
  do {
    max += 1;
    candidate = `${prefix}-${String(max).padStart(width, '0')}`;
  } while (used.has(candidate));

  return candidate;
}

// Knapsack 0/1 Budget Optimisation helper
export function solveKnapsackBudget(budget, items = CANDIDATE_INTERVENTIONS) {
  const n = items.length;
  const b = Math.floor(budget);
  
  // DP table: dp[i][w] = max benefit using first i items with budget w
  // Scale budget by step of 100 for fast dynamic programming
  const step = 100;
  const scaledB = Math.max(0, Math.floor(b / step));
  const dp = Array.from({ length: n + 1 }, () => new Array(scaledB + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const itemWeight = Math.ceil(item.cost / step);
    const itemVal = item.modelledBenefit;

    for (let w = 0; w <= scaledB; w++) {
      if (itemWeight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - itemWeight] + itemVal);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected items
  let w = scaledB;
  const selected = [];
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const item = items[i - 1];
      selected.push(item.id);
      w -= Math.ceil(item.cost / step);
    }
  }

  const selectedItems = items.filter(it => selected.includes(it.id));
  const totalCost = selectedItems.reduce((acc, it) => acc + it.cost, 0);
  const totalBenefit = selectedItems.reduce((acc, it) => acc + it.modelledBenefit, 0);
  const remainingBudget = budget - totalCost;

  const excludedItems = items
    .filter(it => !selected.includes(it.id))
    .map(it => ({
      ...it,
      reason: it.cost > remainingBudget
        ? `Exceeds remaining budget (requires RM ${it.cost.toLocaleString()}, RM ${remainingBudget.toLocaleString()} left)`
        : `Lower benefit-to-cost efficiency under current model weights`
    }));

  return {
    selectedIds: selected,
    selectedItems,
    excludedItems,
    totalCost,
    totalBenefit,
    remainingBudget
  };
}

// Model formula: Route Cost = Base Time Index + Lighting Penalty + Sightline Penalty + Pathway Penalty
export function calculateRouteCost(routeId, appliedInterventions = []) {
  const base = SCHEMATIC_ROUTES[routeId];
  let lightingPenalty = base.penalties.lighting;
  let sightlinePenalty = base.penalties.sightline;
  let pathwayPenalty = base.penalties.pathway;

  // Apply reductions if selected interventions are marked applied
  appliedInterventions.forEach(id => {
    const intervention = CANDIDATE_INTERVENTIONS.find(it => it.id === id);
    if (!intervention) return;
    if (intervention.penaltyReduction.lighting) {
      if (routeId === 'A' && (id === 'IN-01' || id === 'IN-04')) {
        lightingPenalty = Math.max(0, lightingPenalty + intervention.penaltyReduction.lighting);
      }
      if (routeId === 'B' && (id === 'IN-04' || id === 'IN-05')) {
        lightingPenalty = Math.max(0, lightingPenalty + intervention.penaltyReduction.lighting);
      }
      // L-08 is shared by every route, so IN-04 also improves Route C.
      if (routeId === 'C' && id === 'IN-04') {
        lightingPenalty = Math.max(0, lightingPenalty + intervention.penaltyReduction.lighting);
      }
    }
    if (intervention.penaltyReduction.sightline) {
      if (routeId === 'B' && id === 'IN-02') {
        sightlinePenalty = Math.max(0, sightlinePenalty + intervention.penaltyReduction.sightline);
      }
      if (routeId === 'C' && id === 'IN-07') {
        sightlinePenalty = Math.max(0, sightlinePenalty + intervention.penaltyReduction.sightline);
      }
    }
    if (intervention.penaltyReduction.pathway) {
      if (routeId === 'B' && id === 'IN-03') {
        pathwayPenalty = Math.max(0, pathwayPenalty + intervention.penaltyReduction.pathway);
      }
      if (routeId === 'C' && id === 'IN-06') {
        pathwayPenalty = Math.max(0, pathwayPenalty + intervention.penaltyReduction.pathway);
      }
    }
  });

  const total = base.baseTimeIndex + lightingPenalty + sightlinePenalty + pathwayPenalty;
  return {
    baseTimeIndex: base.baseTimeIndex,
    lightingPenalty,
    sightlinePenalty,
    pathwayPenalty,
    totalCost: total,
    delta: base.totalCost - total
  };
}
