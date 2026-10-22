// ---------------------------------------------------------------------------
// Data model integrity guard.
//
// All three role consoles (Resident / Security / Property) read from the single
// model in nightSafeData.js. When that model drifts — a dangling id, a status
// the UI filters do not know about, a route whose totalCost disagrees with its
// own penalties — the symptom is a silently empty list or a wrong number
// somewhere in the UI, never an error.
//
// verifyDataModel() checks the invariants below and returns human readable
// problems. It runs once on startup in dev mode only (see NightSafeContext).
// ---------------------------------------------------------------------------

import {
  SCHEMATIC_NODES,
  SCHEMATIC_ROUTES,
  INITIAL_HAZARDS,
  CANDIDATE_INTERVENTIONS,
  INITIAL_ALERTS,
  INITIAL_CHECKPOINT_EVENTS,
  HAZARD_STATUSES,
  ALERT_STATUSES,
  FEED_CATEGORIES,
  feedCategoryFor
} from './nightSafeData';
import { evaluateRoute } from './routeRisk';

const NODE_IDS = new Set(SCHEMATIC_NODES.map(n => n.id));

function routesThroughNode(nodeId) {
  return Object.values(SCHEMATIC_ROUTES)
    .filter(route => route.nodes.includes(nodeId))
    .map(route => route.id);
}

function duplicateIds(items) {
  const seen = new Set();
  const duplicates = new Set();
  (items || []).forEach(item => {
    const id = item && item.id;
    if (!id) return;
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  });
  return [...duplicates];
}

export function verifyDataModel() {
  const problems = [];
  const report = message => problems.push(message);

  // ---- Routes -------------------------------------------------------------
  Object.values(SCHEMATIC_ROUTES).forEach(route => {
    const penaltySum = Object.values(route.penalties || {}).reduce((sum, v) => sum + v, 0);
    const expected = route.baseTimeIndex + penaltySum;
    if (expected !== route.totalCost) {
      report(
        `Route ${route.id}: totalCost ${route.totalCost} but baseTimeIndex ${route.baseTimeIndex} + penalties ${penaltySum} = ${expected}. ` +
        `calculateRouteCost() reports a phantom delta before anything is applied.`
      );
    }
    (route.nodes || []).forEach(nodeId => {
      if (!NODE_IDS.has(nodeId)) report(`Route ${route.id}: references unknown node "${nodeId}".`);
    });
    if (typeof route.lightingCoverage !== 'number' || route.lightingCoverage < 0 || route.lightingCoverage > 100) {
      report(`Route ${route.id}: lightingCoverage is "${route.lightingCoverage}" — the risk model needs a 0-100 number.`);
    }
  });

  // ---- Risk bands ---------------------------------------------------------
  // The resident HUD, the comparison cards and the schematic map all read the
  // DANGER verdict from evaluateRoute(). If the recommended route is not the
  // lowest-risk one, the "Safest" badge and the HUD contradict each other —
  // exactly the bug this guard is here to catch.
  {
    const evaluated = Object.values(SCHEMATIC_ROUTES).map(route => ({
      id: route.id,
      recommended: route.recommended,
      ...evaluateRoute(route.id, INITIAL_HAZARDS)
    }));
    const lowest = evaluated.reduce((best, r) => (r.riskPoints < best.riskPoints ? r : best), evaluated[0]);
    evaluated
      .filter(route => route.recommended && route.id !== lowest.id)
      .forEach(route => {
        report(
          `Route ${route.id} is flagged recommended but is not the lowest-risk route ` +
          `(${route.riskPoints} pts vs Route ${lowest.id} at ${lowest.riskPoints}) — the safest route would show a worse DANGER badge than a riskier one.`
        );
      });
  }

  // ---- Hazards ------------------------------------------------------------
  const hazardIds = new Set(INITIAL_HAZARDS.map(h => h.id));
  const interventionIds = new Set(CANDIDATE_INTERVENTIONS.map(i => i.id));

  duplicateIds(INITIAL_HAZARDS).forEach(id => report(`Duplicate hazard id "${id}".`));

  INITIAL_HAZARDS.forEach(hazard => {
    if (!HAZARD_STATUSES.includes(hazard.status)) {
      report(`Hazard ${hazard.id}: status "${hazard.status}" is not in HAZARD_STATUSES — the Resident and Property filters will not list it.`);
    }
    if (!FEED_CATEGORIES.includes(hazard.feedCategory)) {
      report(`Hazard ${hazard.id}: feedCategory "${hazard.feedCategory}" is not in FEED_CATEGORIES — it will not appear in any Property feed group.`);
    }
    const derivedFeed = feedCategoryFor(hazard.category);
    if (derivedFeed !== hazard.feedCategory) {
      report(`Hazard ${hazard.id}: feedCategory "${hazard.feedCategory}" disagrees with feedCategoryFor("${hazard.category}") = "${derivedFeed}".`);
    }
    if (hazard.affectedNode && !NODE_IDS.has(hazard.affectedNode)) {
      report(`Hazard ${hazard.id}: affectedNode "${hazard.affectedNode}" is not a known lamp node.`);
    }
    if (hazard.affectedNode) {
      const reachable = routesThroughNode(hazard.affectedNode);
      (hazard.routesAffected || []).forEach(routeId => {
        if (!reachable.includes(routeId)) {
          report(`Hazard ${hazard.id}: claims Route ${routeId} but node ${hazard.affectedNode} is not on it (Routes ${reachable.join(', ') || 'none'}).`);
        }
      });
    }
    if (hazard.pairedInterventionId && !interventionIds.has(hazard.pairedInterventionId)) {
      report(`Hazard ${hazard.id}: pairedInterventionId "${hazard.pairedInterventionId}" does not exist in CANDIDATE_INTERVENTIONS — Resident shows a package Property cannot budget for.`);
    }
    if (typeof hazard.estimatedCost !== 'number') {
      report(`Hazard ${hazard.id}: estimatedCost is not a number.`);
    }
  });

  // ---- Interventions ------------------------------------------------------
  duplicateIds(CANDIDATE_INTERVENTIONS).forEach(id => report(`Duplicate intervention id "${id}".`));

  CANDIDATE_INTERVENTIONS.forEach(intervention => {
    if (intervention.targetHazardId && !hazardIds.has(intervention.targetHazardId)) {
      report(`Intervention ${intervention.id}: targetHazardId "${intervention.targetHazardId}" does not exist in INITIAL_HAZARDS.`);
    }
  });

  // Pairing has to agree in both directions.
  INITIAL_HAZARDS.forEach(hazard => {
    if (!hazard.pairedInterventionId) return;
    const partner = CANDIDATE_INTERVENTIONS.find(i => i.id === hazard.pairedInterventionId);
    if (partner && partner.targetHazardId !== hazard.id) {
      report(`Pairing mismatch: hazard ${hazard.id} -> ${partner.id}, but ${partner.id}.targetHazardId is "${partner.targetHazardId}".`);
    }
  });

  // ---- Alerts -------------------------------------------------------------
  duplicateIds(INITIAL_ALERTS).forEach(id => report(`Duplicate alert id "${id}".`));

  INITIAL_ALERTS.forEach(alert => {
    if (!ALERT_STATUSES.includes(alert.status)) {
      report(`Alert ${alert.id}: status "${alert.status}" is not in ALERT_STATUSES — the Security counters will not count it.`);
    }
    if (!alert.resident) report(`Alert ${alert.id}: resident name is empty.`);
    if (!Array.isArray(alert.notes)) report(`Alert ${alert.id}: notes is not an array — addAlertNote() would crash.`);
  });

  // ---- Checkpoint events --------------------------------------------------
  duplicateIds(INITIAL_CHECKPOINT_EVENTS).forEach(id => report(`Duplicate checkpoint event id "${id}".`));

  INITIAL_CHECKPOINT_EVENTS.forEach(event => {
    if (!NODE_IDS.has(event.checkpointId)) {
      report(`Checkpoint event ${event.id}: checkpointId "${event.checkpointId}" is not a known lamp node.`);
    }
  });

  return problems;
}
