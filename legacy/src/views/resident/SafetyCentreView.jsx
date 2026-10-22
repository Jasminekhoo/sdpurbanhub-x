import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import { 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  KeyRound, 
  HelpCircle, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  EyeOff
} from 'lucide-react';

export function SafetyCentreView() {
  const { 
    residentTab, 
    setResidentTab, 
    duressConfig, 
    setDuressConfig, 
    triggerDuressPin, 
    triggerSos,
    missedCheckpointPrompt,
    resolveMissedPrompt,
    journeyStatus,
    passedCheckpoints,
    duressTriggered,
    showToast
  } = useNightSafe();

  // Local state for Duress Setup (Screen R5)
  const [pinInput, setPinInput] = useState("9142");
  const [pinConfirm, setPinConfirm] = useState("9142");
  const [pinEnabled, setPinEnabled] = useState(duressConfig.enabled);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Local state for SOS (Screen R7)
  const [sosCategory, setSosCategory] = useState("Personal Safety");
  const [sosTriggered, setSosTriggered] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  // Hold timer effect for SOS
  React.useEffect(() => {
    let interval;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsHolding(false);
            triggerSos(sosCategory);
            setSosTriggered(true);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, sosCategory]);

  // Save Duress PIN settings
  const handleSaveDuressPin = () => {
    if (pinInput.length !== 4) {
      showToast('PIN must be 4 numeric digits.', 'error');
      return;
    }
    if (pinInput !== pinConfirm) {
      showToast('PIN numbers do not match.', 'error');
      return;
    }
    setDuressConfig({ enabled: pinEnabled, pin: pinInput });
    showToast('Demo Duress PIN configured. Kept masked for security.', 'success');
  };

  // -------------------------------------------------------------
  // SCREEN R6: DURESS PIN ACTIVATION (NEUTRAL & CALM!)
  // -------------------------------------------------------------
  if (residentTab === 'duress-trigger') {
    return (
      <div className="space-y-4 pb-20">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Discreet Assistance Activation
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Safe Interface
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            In a real scenario, this screen remains visually neutral so that third parties cannot detect that a silent help signal has been sent.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="text-xs font-medium text-slate-700">
              Preconfigured Demo PIN: <span className="font-mono text-slate-900 font-bold">••••</span> (Enabled)
            </div>

            <button
              onClick={() => {
                triggerDuressPin();
                setResidentTab('home');
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Simulate Duress PIN Activation</span>
            </button>
            <p className="text-[10px] text-slate-400">
              Triggers simulated alert AL-204 on Security Console.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 text-[11px] leading-snug flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Safety protocol note:</span> Prototype demonstrates how silent dispatch could occur without flashing sirens or threatening user safety.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN R5: DURESS PIN SETUP
  // -------------------------------------------------------------
  if (residentTab === 'duress-setup') {
    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Set Up Discreet Help</h2>
          <button 
            onClick={() => setResidentTab('safety')}
            className="text-xs text-[#2864A6] hover:underline"
          >
            Back
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
            <Lock className="w-4 h-4" />
            <span>Preconfigured Duress PIN</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            A Duress PIN is a special numeric code you set in advance. When entered anywhere in the app, it creates a silent emergency request without alerting anyone nearby.
          </p>

          <div className="space-y-2 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase">4-Digit Demo Duress PIN</label>
              <input
                type="password"
                maxLength="4"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-[#2864A6]"
                placeholder="••••"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Confirm PIN</label>
              <input
                type="password"
                maxLength="4"
                value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-[#2864A6]"
                placeholder="••••"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-700 font-medium">Enable Demo Duress PIN</span>
              <input
                type="checkbox"
                checked={pinEnabled}
                onChange={(e) => setPinEnabled(e.target.checked)}
                className="w-4 h-4 text-[#2864A6] rounded cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSaveDuressPin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-semibold shadow transition"
          >
            Save Demo Setting
          </button>

          {/* Quick trigger for presenter */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                triggerDuressPin();
                setResidentTab('home');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Duress PIN Now (Scene 3 Action)</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1">
              Shortcut for hackathon presentation without manual typing.
            </p>
          </div>

          {/* How It Works Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="text-xs text-[#2864A6] hover:underline flex items-center gap-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHowItWorks ? 'Hide "How it works"' : 'How Duress PIN works in township deployment'}</span>
            </button>

            {showHowItWorks && (
              <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5 animate-fadeIn">
                <p>• <strong>Discreet Trigger:</strong> When entered under duress, the resident phone pretends to unlock or show a normal screen.</p>
                <p>• <strong>Zero Visible Sirens:</strong> No flashing screen or audible alarm sounds from the resident handset.</p>
                <p>• <strong>Streetlight Infrastructure:</strong> Streetlights: Always on at normal brightness. Location is shared with security for rapid response.</p>
                <p>• <strong>Verified Audit:</strong> The security console creates a high-priority incident with the last recorded sensor checkpoint.</p>
              </div>
            )}
          </div>

          {/* Warning disclaimer */}
          <div className="p-2.5 rounded-lg bg-slate-100 text-[10px] text-slate-500 italic">
            Disclaimer: This prototype simulates an alert only. It does not contact real security services. Never use real financial or personal passwords here.
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN R7: OVERT SOS ACTIVATION
  // -------------------------------------------------------------
  if (residentTab === 'sos') {
    return (
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Request Emergency Help (SOS)</h2>
          <button 
            onClick={() => setResidentTab('safety')}
            className="text-xs text-[#2864A6] hover:underline"
          >
            Cancel
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#C83E4D]" />
              <span>Overt Assistance Request</span>
            </div>
            <p className="text-[11px] text-red-800 leading-snug">
              Open request for on-duty security and emergency contacts. Shares your last simulated checkpoint location.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase">Emergency Category</label>
            <select
              value={sosCategory}
              onChange={(e) => setSosCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none"
            >
              <option value="Personal Safety">Personal Safety</option>
              <option value="Medical Assistance">Medical Assistance</option>
              <option value="Environmental Threat / Fall">Environmental Threat / Fall</option>
              <option value="Other Assistance">Other Assistance</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-1 text-slate-600">
            <div className="font-semibold text-slate-800">Data Shared in Demo:</div>
            <div>• Last Recorded Location: Near Lamp L-04 (Boulevard Walkway)</div>
            <div>• Timestamp: Just now</div>
            <div>• Resident Profile: Aina</div>
          </div>

          {/* Press and Hold to Trigger Simulation (Anti-accidental activation) */}
          <div className="space-y-1 pt-1">
            <button
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onTouchStart={() => setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              className="relative w-full py-4 px-4 rounded-xl bg-[#C83E4D] hover:bg-red-700 text-white font-extrabold text-sm shadow-md overflow-hidden flex items-center justify-center gap-2 select-none active:scale-[0.98] transition-transform"
            >
              {/* Progress fill */}
              <div
                className="absolute inset-y-0 left-0 bg-red-900/60 transition-all duration-75"
                style={{ width: `${holdProgress}%` }}
              ></div>
              <span className="relative z-10 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>{holdProgress > 0 ? `Holding... ${holdProgress}%` : 'Press and Hold 2s for SOS'}</span>
              </span>
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Hold to prevent accidental activation. Or click instant demo button below.
            </p>
          </div>

          {/* Direct Instant Action for Pitch Presentation */}
          <button
            onClick={() => {
              triggerSos(sosCategory);
              setSosTriggered(true);
            }}
            className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <span>Single Click Demo Trigger (Scene 7/R7)</span>
          </button>

          {sosTriggered && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center justify-between animate-fadeIn">
              <span>Demo alert created — dispatched to Security Console.</span>
              <button 
                onClick={() => setResidentTab('home')}
                className="underline font-bold"
              >
                Return Home
              </button>
            </div>
          )}

          <div className="text-[10px] text-slate-400 text-center italic">
            Demo alert created — no real emergency services are contacted.
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN R8: CHECKPOINT / MISSED CHECK-IN PROMPT
  // -------------------------------------------------------------
  if (missedCheckpointPrompt) {
    return (
      <div className="space-y-4 pb-20">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce" />
            <span>Journey Check-in Prompt</span>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            "We haven't recorded your next checkpoint. Are you okay?"
          </p>

          <p className="text-[11px] text-amber-800 leading-snug">
            Missing a checkpoint can happen due to GPS drift, phone sleep mode, or pauses, and is not proof of an emergency.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => resolveMissedPrompt('okay')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I'm Okay (Clear Prompt)</span>
            </button>

            <button
              onClick={() => resolveMissedPrompt('help')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#C83E4D] hover:bg-red-700 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>I Need Help (Open SOS)</span>
            </button>

            <button
              onClick={() => resolveMissedPrompt('no_response')}
              className="w-full py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <span>No Response (Simulate 90s Timeout)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN R4: SAFETY CENTRE HOME
  // -------------------------------------------------------------
  return (
    <div className="space-y-4 pb-20">
      <div>
        <h2 className="text-base font-bold text-slate-900">Safety Centre</h2>
        <p className="text-xs text-slate-500">Emergency & discreet assistance options</p>
      </div>

      {/* 3 Main Action Cards */}
      <div className="space-y-2.5">
        {/* Card 1: SOS */}
        <div
          onClick={() => setResidentTab('sos')}
          className="p-3.5 rounded-xl bg-white hover:bg-red-50/40 border border-slate-200 hover:border-red-300 cursor-pointer transition shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#C83E4D] flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">SOS — I need help now</h4>
              <p className="text-[11px] text-slate-500">Open request for on-duty security</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Card 2: Duress PIN */}
        <div
          onClick={() => setResidentTab('duress-setup')}
          className="p-3.5 rounded-xl bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 cursor-pointer transition shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Duress PIN — Discreet Help</h4>
              <p className="text-[11px] text-slate-500">Silent notification without overt sirens</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Card 3: Journey Check-ins */}
        <div
          onClick={() => setResidentTab('journey')}
          className="p-3.5 rounded-xl bg-white hover:bg-sky-50/40 border border-slate-200 hover:border-sky-300 cursor-pointer transition shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#2864A6] flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Journey Check-ins</h4>
              <p className="text-[11px] text-slate-500">
                {journeyStatus === 'in_progress' ? 'Active check-ins in progress' : 'No active walk recorded'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Comparison Panel */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
        <div className="font-bold text-slate-800">Understanding Assistance Levels:</div>
        <div className="space-y-1.5 text-[11px] text-slate-600">
          <div><strong className="text-slate-900">• SOS:</strong> User-initiated overt call when personal safety or medical help is needed.</div>
          <div><strong className="text-slate-900">• Duress PIN:</strong> Silent trigger used when overt action could escalate risk.</div>
          <div><strong className="text-slate-900">• Missed Checkpoint:</strong> Prompt to confirm wellbeing; not proof of danger.</div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] text-slate-500 leading-snug">
        <span className="font-semibold text-slate-700">Privacy Notice:</span> Location tracking is simulated and active only during an explicit walk. Real deployments require strict resident opt-in.
      </div>
    </div>
  );
}
