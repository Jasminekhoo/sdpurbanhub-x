import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TOWNSHIP_INFO,
  RESIDENT_PROFILE,
  SCHEMATIC_NODES,
  SCHEMATIC_ROUTES,
  INITIAL_HAZARDS,
  CANDIDATE_INTERVENTIONS,
  DURESS_ALERT_SEED,
  INITIAL_ALERTS,
  INITIAL_CHECKPOINT_EVENTS,
  solveKnapsackBudget,
  calculateRouteCost,
  nextId,
  feedCategoryFor
} from '../data/nightSafeData';
import { verifyDataModel } from '../data/modelIntegrity';

const NightSafeContext = createContext();

// ---------------------------------------------------------------------------
// Schema versioning. Bump SCHEMA_VERSION whenever the shape of the seeded
// collections changes. Cached localStorage copies written by an older schema
// are discarded on load, so all three role consoles always render exactly what
// nightSafeData.js defines — no stale demo queue from a previous build.
// ---------------------------------------------------------------------------
const SCHEMA_VERSION = 2;
const PERSISTED_KEYS = ['ns_alerts', 'ns_hazards', 'ns_checkpoints'];

(function purgeStaleSchema() {
  try {
    if (localStorage.getItem('ns_schema_version') !== String(SCHEMA_VERSION)) {
      PERSISTED_KEYS.forEach(key => localStorage.removeItem(key));
      localStorage.setItem('ns_schema_version', String(SCHEMA_VERSION));
    }
  } catch (e) {
    // No localStorage available (SSR / privacy mode) — nothing to purge.
  }
})();

// Dev-only guard: surface any model drift (dangling ids, unknown statuses,
// route costs that disagree with their penalties) instead of letting it show up
// as a mysteriously empty list or a wrong number somewhere in the three roles.
if (import.meta.env?.DEV) {
  const problems = verifyDataModel();
  if (problems.length > 0) {
    console.warn(
      `[UrbanHub-X] data model check found ${problems.length} issue(s):\n` +
      problems.map(p => ` • ${p}`).join('\n')
    );
  }
}

export function NightSafeProvider({ children }) {
  // Current demo role: 'select' | 'resident' | 'security' | 'property'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('ns_role') || 'select';
  });

  // Current active sub-tab per role
  const [residentTab, setResidentTab] = useState('home'); // 'home' | 'routes' | 'journey' | 'safety' | 'duress-setup' | 'duress-trigger' | 'sos' | 'checkpoints' | 'report' | 'my-reports' | 'settings'
  const [securityTab, setSecurityTab] = useState('overview'); // 'overview' | 'alert-detail' | 'checkpoints' | 'history'
  const [propertyTab, setPropertyTab] = useState('overview'); // 'overview' | 'hazard-map' | 'reports' | 'ranking' | 'budget' | 'lighting'

  // Selected alert in Security view
  const [selectedAlertId, setSelectedAlertId] = useState('AL-204');

  // Selected hazard in Property view
  const [selectedHazardId, setSelectedHazardId] = useState('HZ-101');

  // Priority Model weights (Screen M4)
  const [priorityWeights, setPriorityWeights] = useState({
    severity: 40,
    exposure: 35,
    urgency: 25
  });

  // Resident Journey state
  const [selectedRouteId, setSelectedRouteId] = useState('A');
  const [routeCategory, setRouteCategory] = useState('safest'); // 'safest' | 'fastest' | 'shortest'
  const [journeyStatus, setJourneyStatus] = useState('idle'); // 'idle' | 'in_progress' | 'ended'
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [passedCheckpoints, setPassedCheckpoints] = useState(['L-01']);
  const [missedCheckpointPrompt, setMissedCheckpointPrompt] = useState(false);
  const [checkinsEnabled, setCheckinsEnabled] = useState(true);

  // Lighting simulation states
  const [activeLamps, setActiveLamps] = useState(['L-01', 'L-02']);

  // Fall detection simulation state
  const [fallDetectionActive, setFallDetectionActive] = useState(false);

  // PIN configuration (Normal cancel PIN + Duress fake cancel PIN)
  const [duressConfig, setDuressConfig] = useState(() => {
    const saved = localStorage.getItem('ns_pin_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          enabled: parsed.enabled ?? true,
          pin: parsed.pin || '9142',
          normalPin: parsed.normalPin || '1234'
        };
      } catch (e) {}
    }
    return {
      enabled: true,
      pin: '9142',
      normalPin: '1234'
    };
  });
  const [duressTriggered, setDuressTriggered] = useState(false);

  // Security Alerts list — seeded with demo queue on first load
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('ns_alerts');
    if (!saved) return INITIAL_ALERTS;
    try {
      const parsed = JSON.parse(saved);
      // Clean any legacy cached "(Demo Resident)" strings in resident name
      return parsed.map(a => ({
        ...a,
        resident: a.resident ? a.resident.replace(/\s*\(Demo Resident\)/gi, '') : a.resident
      }));
    } catch {
      return INITIAL_ALERTS;
    }
  });

  // Hazards list — guaranteed reliable images and synchronized across all roles
  const [hazards, setHazards] = useState(() => {
    const saved = localStorage.getItem('ns_hazards');
    if (!saved) return INITIAL_HAZARDS;
    try {
      const parsed = JSON.parse(saved);
      // Map seed hazards so figureUrl, severity, feedCategory, assignedPath always reflect latest data
      const mergedSeeds = INITIAL_HAZARDS.map(initH => {
        const existing = parsed.find(p => p.id === initH.id);
        return existing
          ? {
              ...initH,
              ...existing,
              figureUrl: initH.figureUrl,
              feedCategory: initH.feedCategory,
              assignedPath: initH.assignedPath || existing.assignedPath,
              reportedBy: initH.reportedBy,
              severity: existing.severity || initH.severity
            }
          : initH;
      });
      const userAdded = parsed.filter(p => !INITIAL_HAZARDS.some(initH => initH.id === p.id));
      return [...mergedSeeds, ...userAdded];
    } catch {
      return INITIAL_HAZARDS;
    }
  });

  // Checkpoint events
  const [checkpointEvents, setCheckpointEvents] = useState(() => {
    const saved = localStorage.getItem('ns_checkpoints');
    if (!saved) return INITIAL_CHECKPOINT_EVENTS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(cp => ({
        ...cp,
        residentName: cp.residentName ? cp.residentName.replace(/\s*\(Demo Resident\)/gi, '') : cp.residentName
      }));
    } catch {
      return INITIAL_CHECKPOINT_EVENTS;
    }
  });

  // Budget Optimization (Screen M5)
  const [budget, setBudget] = useState(5000);
  const [optimisedPlan, setOptimisedPlan] = useState(() => solveKnapsackBudget(5000));
  const [appliedInterventions, setAppliedInterventions] = useState([]);
  const [planApplied, setPlanApplied] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Storyline Presenter Helper (Scenes 0 to 8)
  const [storylineStep, setStorylineStep] = useState(0);
  const [isStorylineDrawerOpen, setIsStorylineDrawerOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ns_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ns_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('ns_hazards', JSON.stringify(hazards));
  }, [hazards]);

  useEffect(() => {
    localStorage.setItem('ns_checkpoints', JSON.stringify(checkpointEvents));
  }, [checkpointEvents]);

  useEffect(() => {
    localStorage.setItem('ns_pin_config', JSON.stringify(duressConfig));
  }, [duressConfig]);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  // Re-run knapsack when budget changes
  useEffect(() => {
    setOptimisedPlan(solveKnapsackBudget(budget));
  }, [budget]);

  // Navigation helper
  const navigateRole = (newRole, optionalTab = null) => {
    setRole(newRole);
    if (optionalTab) {
      if (newRole === 'resident') setResidentTab(optionalTab);
      if (newRole === 'security') setSecurityTab(optionalTab);
      if (newRole === 'property') setPropertyTab(optionalTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // RESIDENT ACTIONS
  // -------------------------------------------------------------

  // Start journey (Scene 2)
  const startJourney = (routeId = selectedRouteId) => {
    setSelectedRouteId(routeId);
    setJourneyStatus('in_progress');
    setCheckpointIndex(0);
    setPassedCheckpoints(['L-01']);
    setMissedCheckpointPrompt(false);

    const route = SCHEMATIC_ROUTES[routeId];
    setActiveLamps(route.nodes.slice(0, 3)); // track first few nodes for checkpoint display
    setResidentTab('journey');
    showToast(`Journey started along ${route.name}.`, 'success');
  };

  // Simulate passing checkpoint (e.g. L-03)
  const simulatePassCheckpoint = (nodeId = 'L-03') => {
    const route = SCHEMATIC_ROUTES[selectedRouteId];
    const nodeIndex = route.nodes.indexOf(nodeId);
    
    if (nodeIndex !== -1) {
      setCheckpointIndex(nodeIndex);
      const passed = route.nodes.slice(0, nodeIndex + 1);
      setPassedCheckpoints(passed);

      // Track current position in checkpoint nodes
      const ahead = route.nodes.slice(nodeIndex, nodeIndex + 3);
      setActiveLamps(ahead);

      // Add to checkpoint audit event log
      setCheckpointEvents(prev => {
        const newEvent = {
          id: nextId('CP', prev),
          checkpointId: nodeId,
          checkpointName: SCHEMATIC_NODES.find(n => n.id === nodeId)?.name || nodeId,
          residentName: RESIDENT_PROFILE.title,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Passed',
          source: 'Simulated Checkpoint Node'
        };
        return [newEvent, ...prev];
      });

      showToast(`Checkpoint ${nodeId} passed.`, 'success');
    }
  };

  // Simulate missed checkpoint prompt (Screen R8)
  const simulateMissedCheckpoint = () => {
    setMissedCheckpointPrompt(true);
    showToast('Simulated: Checkpoint ping overdue. Confirmation prompt displayed.', 'warning');
  };

  const resolveMissedPrompt = (responseType) => {
    setMissedCheckpointPrompt(false);
    if (responseType === 'okay') {
      showToast("Check-in confirmed: Resident marked 'I am okay'.", 'success');
    } else if (responseType === 'help') {
      setResidentTab('sos');
    } else if (responseType === 'no_response') {
      // Create follow up alert for security
      const followUpAlert = {
        id: nextId('AL', alerts),
        type: 'Missed Checkpoint / No Response',
        severity: 'Medium',
        resident: RESIDENT_PROFILE.title,
        residentId: 'RES-8821',
        location: 'Near Lamp L-03 (Boulevard Walkway)',
        lastCheckpoint: 'L-02 · 9:09 PM',
        alertReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locationFreshness: 'Simulated checkpoint overdue · Prompt unconfirmed',
        status: 'Awaiting security acknowledgement',
        notes: ['Automatic prompt timed out after 90 seconds in simulation.'],
        category: 'Checkpoint Overdue',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDuress: false
      };
      setAlerts(prev => [followUpAlert, ...prev]);
      showToast('Simulated follow-up alert dispatched to Security Dashboard.', 'warning');
    }
  };

  // End journey
  const endJourney = () => {
    setJourneyStatus('ended');
    setActiveLamps([]);
    setMissedCheckpointPrompt(false);
    showToast('Journey ended. Simulated location sharing stopped.', 'info');
  };

  // Trigger Duress PIN discreetly (Scene 3 - Screen R6)
  const triggerDuressPin = () => {
    setDuressTriggered(true);

    // Create AL-204 in shared alerts
    const duressAlert = {
      ...DURESS_ALERT_SEED,
      alertReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAlerts(prev => {
      // Avoid duplicate AL-204
      const filtered = prev.filter(a => a.id !== 'AL-204');
      return [duressAlert, ...filtered];
    });

    // Subtly navigate or keep resident screen neutral
    setResidentTab('home');
    showToast('Request received. (UI remains neutral for user safety)', 'info');
  };

  // Trigger Overt SOS (Screen R7) — returns the new alert ID
  const triggerSos = (category = 'Personal Safety') => {
    const newId = nextId('AL', alerts);
    const newAlert = {
      id: newId,
      type: 'Emergency SOS Alert',
      severity: 'High',
      resident: RESIDENT_PROFILE.title,
      residentId: 'RES-8821',
      location: 'Near Lamp L-04 (Boulevard)',
      lastCheckpoint: 'L-03 · 9:12 PM',
      alertReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      locationFreshness: 'Last available demo location — not live tracking',
      status: 'Awaiting security acknowledgement',
      notes: [],
      category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDuress: false
    };

    setAlerts(prev => [newAlert, ...prev]);
    showToast(`Demo SOS alert ${newId} dispatched to Security Operations.`, 'warning');
    return newId;
  };

  // Fall Detection Simulation Demo
  const triggerFallDetectionDemo = () => {
    setFallDetectionActive(true);
    showToast('Simulated phone accelerometer fall impact (3.8G)!', 'warning');
  };

  const cancelFallDetection = () => {
    setFallDetectionActive(false);
  };

  // Walking Demo: advance to next node and trigger safety confirmation modal
  const triggerWalkingDemo = () => {
    const route = SCHEMATIC_ROUTES[selectedRouteId] || SCHEMATIC_ROUTES.A;
    const nextIdx = (checkpointIndex + 1) % route.nodes.length;
    const nextNodeId = route.nodes[nextIdx];

    setCheckpointIndex(nextIdx);
    const passed = route.nodes.slice(0, nextIdx + 1);
    setPassedCheckpoints(passed);

    // Track current position nodes
    const ahead = route.nodes.slice(nextIdx, nextIdx + 3);
    setActiveLamps(ahead);

    // Log checkpoint event
    setCheckpointEvents(prev => {
      const newEvent = {
        id: nextId('CP', prev),
        checkpointId: nextNodeId,
        checkpointName: SCHEMATIC_NODES.find(n => n.id === nextNodeId)?.name || nextNodeId,
        residentName: RESIDENT_PROFILE.title,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Passed',
        source: 'Walking Demo Sensor'
      };
      return [newEvent, ...prev];
    });

    // Popup safety confirmation message
    setMissedCheckpointPrompt(true);
    showToast(`Arrived at Node ${nextNodeId}. Please confirm your safety.`, 'info');
  };

  // Submit hazard report (Scene 5 - Screen R9)
  const submitHazardReport = ({ category, location, severity, description, title, contactInfo, affectedNode = 'L-04' }) => {
    const newId = nextId('HZ', hazards);

    // Derive the affected routes from the node the report is pinned to, so the
    // Resident feed, Property inspector and the schematic map all agree.
    // (Previously hardcoded to ['A'] or ['B'] regardless of the real node.)
    const routesAffected = Object.values(SCHEMATIC_ROUTES)
      .filter(route => route.nodes.includes(affectedNode))
      .map(route => route.id);
    const assignedPath = routesAffected.length
      ? `Route ${routesAffected.join(', ')}`
      : 'Unassigned';

    const now = new Date();

    const newHazard = {
      id: newId,
      title: title || `${category.split('/')[0].trim()} at ${location}`,
      category,
      feedCategory: feedCategoryFor(category),
      location,
      contactInfo: contactInfo || '',
      affectedNode,
      routesAffected,
      assignedPath,
      severity,
      pedestrianExposure: 'High',
      urgency: severity === 'High' ? 'High' : 'Medium',
      evidenceConfidence: 'Medium',
      status: 'Reported',
      reportDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      figureUrl: null,
      figureCaption: '',
      source: 'Resident report',
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportedBy: `${RESIDENT_PROFILE.title} (Resident)`,
      description: description || 'Reported by resident via mobile prototype form.',
      estimatedCost: 1500,
      pairedInterventionId: null
    };

    setHazards(prev => [newHazard, ...prev]);
    showToast(`Hazard report ${newId} submitted. Visible in Property Management console.`, 'success');
    return newHazard;
  };

  // -------------------------------------------------------------
  // SECURITY ACTIONS (Screens S1 - S4)
  // -------------------------------------------------------------

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'Acknowledged' } : a
    ));
    showToast(`Alert ${alertId} acknowledged by Duty Security Lead.`, 'success');
  };

  const markResponseInProgress = (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'Response in progress' } : a
    ));
    showToast(`Alert ${alertId} status marked: 'Response in progress'.`, 'info');
  };

  const addAlertNote = (alertId, noteText) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAlerts(prev => prev.map(a => {
      if (a.id !== alertId) return a;
      return {
        ...a,
        notes: [...(a.notes || []), `${now} — Officer: ${noteText}`]
      };
    }));
    showToast('Incident audit note appended.', 'success');
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: 'Resolved — demo' } : a
    ));
    showToast(`Alert ${alertId} marked as 'Resolved — demo'.`, 'info');
  };

  // -------------------------------------------------------------
  // PROPERTY MANAGEMENT ACTIONS (Screens M1 - M8)
  // -------------------------------------------------------------

  const updateHazardStatus = (hazardId, newStatus) => {
    setHazards(prev => prev.map(h => 
      h.id === hazardId ? { ...h, status: newStatus } : h
    ));
    showToast(`Hazard ${hazardId} updated to '${newStatus}'.`, 'success');
  };

  const updateHazardMetric = (hazardId, field, value) => {
    setHazards(prev => prev.map(h => 
      h.id === hazardId ? { ...h, [field]: value } : h
    ));
  };

  const applySelectedPlan = (customIds) => {
    const ids = Array.isArray(customIds) ? customIds : optimisedPlan.selectedIds;
    setAppliedInterventions(ids);
    setPlanApplied(true);

    // Also update matching hazards to 'Verified' or 'In progress'
    setHazards(prev => prev.map(h => {
      if (ids.includes(h.pairedInterventionId)) {
        return { ...h, status: 'In progress' };
      }
      return h;
    }));

    showToast(`Maintenance plan applied! Modelled route conditions updated for Route A & B.`, 'success');
  };

  const resetAppliedPlan = () => {
    setAppliedInterventions([]);
    setPlanApplied(false);
    showToast('Applied plan reset to baseline.', 'info');
  };

  // -------------------------------------------------------------
  // RESET DEMO SCENARIO (Section 4 & 5)
  // -------------------------------------------------------------
  const resetDemoScenario = () => {
    setRole('select');
    setResidentTab('home');
    setSecurityTab('overview');
    setPropertyTab('overview');
    setSelectedRouteId('A');
    setJourneyStatus('idle');
    setCheckpointIndex(0);
    setPassedCheckpoints(['L-01']);
    setMissedCheckpointPrompt(false);
    setActiveLamps(['L-01', 'L-02']);
    setDuressTriggered(false);
    setAlerts(INITIAL_ALERTS);
    setHazards(INITIAL_HAZARDS);
    setCheckpointEvents(INITIAL_CHECKPOINT_EVENTS);
    setBudget(5000);
    setOptimisedPlan(solveKnapsackBudget(5000));
    setAppliedInterventions([]);
    setPlanApplied(false);
    setStorylineStep(0);
    
    localStorage.removeItem('ns_role');
    localStorage.removeItem('ns_alerts');
    localStorage.removeItem('ns_hazards');
    localStorage.removeItem('ns_checkpoints');
    localStorage.removeItem('ns_pin_config');

    showToast('Demo scenario reset to initial clean state.', 'info');
  };

  return (
    <NightSafeContext.Provider
      value={{
        // Role & Tab Navigation
        role,
        setRole,
        residentTab,
        setResidentTab,
        securityTab,
        setSecurityTab,
        propertyTab,
        setPropertyTab,
        navigateRole,
        selectedAlertId,
        setSelectedAlertId,
        selectedHazardId,
        setSelectedHazardId,

        // Data & Models
        townshipInfo: TOWNSHIP_INFO,
        residentProfile: RESIDENT_PROFILE,
        routes: SCHEMATIC_ROUTES,
        nodes: SCHEMATIC_NODES,
        hazards,
        alerts,
        checkpointEvents,
        candidateInterventions: CANDIDATE_INTERVENTIONS,

        // Journey State
        selectedRouteId,
        setSelectedRouteId,
        routeCategory,
        setRouteCategory,
        journeyStatus,
        checkpointIndex,
        passedCheckpoints,
        missedCheckpointPrompt,
        checkinsEnabled,
        setCheckinsEnabled,
        activeLamps,
        duressConfig,
        setDuressConfig,
        duressTriggered,

        // Journey Actions
        startJourney,
        simulatePassCheckpoint,
        simulateMissedCheckpoint,
        resolveMissedPrompt,
        endJourney,
        triggerDuressPin,
        triggerSos,
        fallDetectionActive,
        triggerFallDetectionDemo,
        cancelFallDetection,
        triggerWalkingDemo,
        submitHazardReport,

        // Security Actions
        acknowledgeAlert,
        markResponseInProgress,
        addAlertNote,
        resolveAlert,

        // Property Actions
        priorityWeights,
        setPriorityWeights,
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

        // Global Reset & Toast
        toast,
        showToast,
        resetDemoScenario,

        // Storyline Helper (safe no-op fallbacks)
        storylineStep: 0,
        setStorylineStep: () => {},
        isStorylineDrawerOpen: false,
        setIsStorylineDrawerOpen: () => {}
      }}
    >
      {children}
    </NightSafeContext.Provider>
  );
}

export function useNightSafe() {
  const context = useContext(NightSafeContext);
  if (!context) throw new Error('useNightSafe must be used within NightSafeProvider');
  return context;
}
