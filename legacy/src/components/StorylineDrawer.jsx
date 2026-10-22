import React from 'react';
import { useNightSafe } from '../context/NightSafeContext';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Lightbulb, 
  DollarSign, 
  Route
} from 'lucide-react';

export function StorylineDrawer() {
  const { 
    isStorylineDrawerOpen, 
    setIsStorylineDrawerOpen, 
    storylineStep, 
    setStorylineStep,
    navigateRole,
    startJourney,
    simulatePassCheckpoint,
    triggerDuressPin,
    acknowledgeAlert,
    markResponseInProgress,
    submitHazardReport,
    updateHazardStatus,
    applySelectedPlan,
    resetDemoScenario
  } = useNightSafe();

  if (!isStorylineDrawerOpen) return null;

  const scenes = [
    {
      step: 0,
      title: "Scene 0: Set up the problem",
      duration: "10–15s",
      narration: "NightSafe Loop connects three things that are often shown separately in a safety concept: the resident's night journey, the ability to request help, and the property team's decisions about which environmental issues to fix first. This is a simulated prototype, not a live security system.",
      actionLabel: "Start Demo as Resident",
      onAction: () => {
        navigateRole('resident', 'home');
        setStorylineStep(1);
      }
    },
    {
      step: 1,
      title: "Scene 1: Compare Routes",
      duration: "25–35s",
      narration: "NightSafe Loop does not claim to predict crime. It compares the environmental information currently available and explains why one route is preferred. Route A (9 min) is recommended over Route B (7 min) because it has fewer environmental penalties. The score is a model index, and the user can still choose another route.",
      actionLabel: "Select Route A & Start Journey",
      onAction: () => {
        navigateRole('resident', 'routes');
        startJourney('A');
        setStorylineStep(2);
      }
    },
    {
      step: 2,
      title: "Scene 2: Smart-Light Corridor",
      duration: "15–20s",
      narration: "If the township has compatible smart lighting, a future integration could illuminate the selected corridor ahead of the resident and maintain lighting when help is requested. In this prototype, we simulate the behavior; no real lights are connected.",
      actionLabel: "Simulate Passing L-03",
      onAction: () => {
        navigateRole('resident', 'journey');
        simulatePassCheckpoint('L-03');
        setStorylineStep(3);
      }
    },
    {
      step: 3,
      title: "Scene 3: Trigger Duress PIN Discreetly",
      duration: "20–30s",
      narration: "If a resident cannot safely make an obvious call for help, a preconfigured Duress PIN could trigger a discreet alert. The resident interface stays neutral in this demo. The alert is simulated, and a real deployment would need reliable delivery, careful safety testing, and a trained response process.",
      actionLabel: "Simulate Duress PIN (Creates AL-204)",
      onAction: () => {
        navigateRole('resident', 'duress-trigger');
        triggerDuressPin();
        setStorylineStep(4);
      }
    },
    {
      step: 4,
      title: "Scene 4: Security Receives Alert",
      duration: "25–35s",
      narration: "The security team receives alert AL-204 in a dedicated queue with the last available location (Near Lamp L-07) and checkpoint timestamp. This is not proof that a person has arrived; the prototype shows how the alert could be managed and audited.",
      actionLabel: "Switch to Security & Acknowledge AL-204",
      onAction: () => {
        navigateRole('security', 'alert-detail');
        acknowledgeAlert('AL-204');
        markResponseInProgress('AL-204');
        setStorylineStep(5);
      }
    },
    {
      step: 5,
      title: "Scene 5: Resident Reports Hazard",
      duration: "15–25s",
      narration: "Beyond responding to emergencies, residents can report environmental conditions that make night routes less comfortable. Each report retains a source, timestamp, and verification state.",
      actionLabel: "Submit Demo Report HZ-105",
      onAction: () => {
        navigateRole('resident', 'report');
        submitHazardReport({
          category: 'Lighting deficiency / faulty streetlight',
          location: 'Junction L-04 (Central Boulevard)',
          severity: 'High',
          description: 'Lamp is not providing consistent illumination along pedestrian walkway.',
          affectedNode: 'L-04'
        });
        setStorylineStep(6);
      }
    },
    {
      step: 6,
      title: "Scene 6: Management Verifies & Prioritises",
      duration: "25–35s",
      narration: "The management side converts reports into a transparent queue. Evidence confidence is displayed separately, so a serious but uncertain report is sent for verification rather than automatically dismissed.",
      actionLabel: "Switch to Property & Verify HZ-105",
      onAction: () => {
        navigateRole('property', 'reports');
        updateHazardStatus('HZ-105', 'Verified');
        setStorylineStep(7);
      }
    },
    {
      step: 7,
      title: "Scene 7: Optimise Maintenance Budget",
      duration: "35–45s",
      narration: "Instead of only showing a list of complaints, NightSafe Loop helps the property team compare feasible maintenance packages under a limited budget. For our default RM 5,000 budget, the knapsack optimizer selects interventions IN-01, IN-02, and IN-04 for max benefit.",
      actionLabel: "Optimise & Apply RM 5,000 Plan",
      onAction: () => {
        navigateRole('property', 'budget');
        applySelectedPlan();
        setStorylineStep(8);
      }
    },
    {
      step: 8,
      title: "Scene 8: Compare Before and After",
      duration: "20–30s",
      narration: "Finally, the team can see which route segments improve under the model if selected interventions are carried out. Modelled Route A cost decreases from 31 to 24 (ΔC = 7). This closes the loop from resident observation to budget decision and transparent route-condition change.",
      closingLine: "Closing pitch: 'NightSafe Loop connects better-informed night journeys with discreet assistance and evidence-based property improvements. Our prototype demonstrates the workflow with simulated data; the next step is validating the assumptions, operational fit, and integration feasibility with the property team.'",
      actionLabel: "View Route Impact & Close Pitch",
      onAction: () => {
        navigateRole('property', 'budget');
      }
    }
  ];

  const currentScene = scenes[storylineStep] || scenes[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 bg-[#142B4A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">3–5 Minute Hackathon Pitch Guide</h3>
              <p className="text-[11px] text-slate-300">Live Presenter Companion & Narration Script</p>
            </div>
          </div>
          <button
            onClick={() => setIsStorylineDrawerOpen(false)}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scene Selector Stepper */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between overflow-x-auto gap-1 text-xs">
          {scenes.map((s) => (
            <button
              key={s.step}
              onClick={() => setStorylineStep(s.step)}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                storylineStep === s.step
                  ? 'bg-[#2864A6] text-white ring-2 ring-sky-300'
                  : storylineStep > s.step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
              }`}
              title={s.title}
            >
              {storylineStep > s.step ? '✓' : s.step}
            </button>
          ))}
        </div>

        {/* Main Body with Narration */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
              Duration: {currentScene.duration}
            </span>
            <span className="text-xs text-slate-400 font-mono">Step {currentScene.step} of 8</span>
          </div>

          <div>
            <h4 className="text-base font-bold text-[#142B4A]">{currentScene.title}</h4>
          </div>

          {/* Narration box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm leading-relaxed relative">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Suggested Narration Script:
            </div>
            <p className="italic font-serif text-slate-800">
              "{currentScene.narration}"
            </p>
          </div>

          {currentScene.closingLine && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs leading-relaxed space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Official Hackathon Closing Pitch (Section 9):
              </div>
              <p className="font-medium italic">
                {currentScene.closingLine}
              </p>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={currentScene.onAction}
              className="w-full py-3 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{currentScene.actionLabel}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-1.5">
              Clicking automatically navigates the UI and updates simulated state for you.
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setStorylineStep(prev => Math.max(0, prev - 1))}
            disabled={storylineStep === 0}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 disabled:opacity-30 hover:text-slate-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Scene
          </button>

          <button
            onClick={() => setStorylineStep(prev => Math.min(scenes.length - 1, prev + 1))}
            disabled={storylineStep === scenes.length - 1}
            className="flex items-center gap-1 text-xs font-semibold text-[#2864A6] disabled:opacity-30 hover:text-[#1E3C66]"
          >
            Next Scene
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
