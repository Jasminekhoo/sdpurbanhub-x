import React, { useState } from 'react';
import { useNightSafe } from '../../context/NightSafeContext';
import {
  User,
  Sliders,
  Shield,
  Info,
  PhoneCall,
  Lock,
  KeyRound,
  Bell,
  MapPin,
  Camera,
  Mic,
  Eye,
  Type,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Save,
  Building2,
  Smartphone,
  ExternalLink,
  HelpCircle,
  Mail,
  Home,
  AlertTriangle,
  ShieldAlert,
  Activity,
  HeartPulse,
  LogOut,
} from 'lucide-react';

export function SettingsView() {
  const {
    duressConfig,
    setDuressConfig,
    triggerFallDetectionDemo,
    showToast,
    navigateRole,
  } = useNightSafe();

  // Active section tab
  const [activeSection, setActiveSection] = useState('profile'); // 'profile' | 'general' | 'account' | 'about'

  // --- Profile State ---
  const [profileName, setProfileName] = useState('Aina');
  const [profileUnit, setProfileUnit] = useState('Tower B · Unit 12-08');
  const [profileEmail, setProfileEmail] = useState('aina.resident@livincare.demo');
  const [profilePhone, setProfilePhone] = useState('+60 12-389 4521');
  const [profileBio, setProfileBio] = useState('Community resident at Aster Residence');
  const [profileSaved, setProfileSaved] = useState(false);

  // --- Account State ---
  // Password & PIN (Normal cancel PIN + Duress fake cancel PIN)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [normalPin, setNormalPin] = useState(duressConfig?.normalPin || '1234');
  const [duressPin, setDuressPin] = useState(duressConfig?.pin || '9142');
  const [pinEnabled, setPinEnabled] = useState(duressConfig?.enabled ?? true);

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('Elena Chen');
  const [emergencyPhone, setEmergencyPhone] = useState('+60 12-998 1234');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Family Member');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // --- General State ---
  // Notifications
  const [notiPush, setNotiPush] = useState(true);
  const [notiSosAlerts, setNotiSosAlerts] = useState(true);
  const [notiCommunityReports, setNotiCommunityReports] = useState(true);
  const [notiCheckpoints, setNotiCheckpoints] = useState(true);

  // Device Access Permissions
  const [permLocation, setPermLocation] = useState(true);
  const [permCamera, setPermCamera] = useState(true);
  const [permAudio, setPermAudio] = useState(false);

  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderHints, setScreenReaderHints] = useState(false);
  const [textSize, setTextSize] = useState('normal'); // 'normal' | 'large'

  // Custom Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#2864A6]' : 'bg-slate-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'
          }`}
      />
    </button>
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    showToast('Profile information updated successfully.', 'success');
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleUpdateSecurity = (e) => {
    e.preventDefault();
    if (setDuressConfig) {
      setDuressConfig({
        enabled: pinEnabled,
        pin: duressPin,
        normalPin: normalPin
      });
    }
    showToast('PIN codes, password & emergency contact updated.', 'success');
  };

  const handleSignOut = () => {
    if (showToast) showToast('Signed out of resident account.', 'info');
    if (navigateRole) navigateRole('select');
  };

  return (
    <div className="space-y-4 pb-24 pt-1">

      {/* Navigation Tabs (Profile, General, Account, About) */}
      <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold border border-slate-200">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'general', label: 'General', icon: Sliders },
          { id: 'account', label: 'Account', icon: Shield },
          { id: 'about', label: 'About', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 text-xs cursor-pointer ${isActive
                  ? 'bg-white text-[#2864A6] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: PROFILE */}
      {/* ========================================================= */}
      {activeSection === 'profile' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Profile Overview Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2864A6] to-sky-400 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                {profileName.charAt(0) || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 truncate">{profileName}</h3>
                <p className="text-[11px] text-slate-500 truncate">{profileUnit}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#2864A6] border border-sky-100">
                  Verified Resident
                </span>
              </div>
            </div>

            {/* Sign Out Button (within the card, right next to profile info) */}
            <button
              type="button"
              onClick={handleSignOut}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Sign out of resident account"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">Edit Resident Information</span>
              <span className="text-[10px] text-slate-400">Community Directory</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Unit / Residence</label>
              <div className="relative">
                <Home className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profileUnit}
                  onChange={(e) => setProfileUnit(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                  placeholder="e.g. Tower B · Unit 12-08"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Mobile Phone</label>
              <div className="relative">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                  placeholder="+60 12-345 6789"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Bio / Notes</label>
              <textarea
                rows={2}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                placeholder="Brief notes or accessibility preferences"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{profileSaved ? 'Profile Updated' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: GENERAL (Notifications, Access, Accessibility) */}
      {/* ========================================================= */}
      {activeSection === 'general' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Notifications Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Bell className="w-4 h-4 text-[#2864A6]" />
              <div>
                <h3 className="text-xs font-bold text-slate-800">Notifications</h3>
                <p className="text-[10px] text-slate-400">Manage how and when you receive community alerts</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-50">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="font-semibold text-slate-800">Push Notifications</div>
                  <div className="text-[10px] text-slate-400">Receive alerts on mobile device</div>
                </div>
                <ToggleSwitch checked={notiPush} onChange={setNotiPush} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-semibold text-slate-800">SOS & Emergency Broadcasts</div>
                  <div className="text-[10px] text-slate-400">Immediate dispatch alerts and status changes</div>
                </div>
                <ToggleSwitch checked={notiSosAlerts} onChange={setNotiSosAlerts} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-semibold text-slate-800">Community Hazard Updates</div>
                  <div className="text-[10px] text-slate-400">New verified reports along common routes</div>
                </div>
                <ToggleSwitch checked={notiCommunityReports} onChange={setNotiCommunityReports} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-semibold text-slate-800">Journey Checkpoint Reminders</div>
                  <div className="text-[10px] text-slate-400">Automated check-in prompts during night walks</div>
                </div>
                <ToggleSwitch checked={notiCheckpoints} onChange={setNotiCheckpoints} />
              </div>
            </div>
          </div>

          {/* Access Permissions (Location, Camera, Audio) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-800">Device Access Permissions</h3>
                <p className="text-[10px] text-slate-400">Control hardware access for safety features</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-50">
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#2864A6] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Location Access</div>
                    <div className="text-[10px] text-slate-400">Shared only during active SOS / journey</div>
                  </div>
                </div>
                <ToggleSwitch checked={permLocation} onChange={setPermLocation} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Camera Access</div>
                    <div className="text-[10px] text-slate-400">Attach photo evidence to hazard reports</div>
                  </div>
                </div>
                <ToggleSwitch checked={permCamera} onChange={setPermCamera} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Audio / Microphone</div>
                    <div className="text-[10px] text-slate-400">Voice check-ins and duress listening</div>
                  </div>
                </div>
                <ToggleSwitch checked={permAudio} onChange={setPermAudio} />
              </div>
            </div>
          </div>

          {/* Fall Detection & Impact Sensor Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Fall Detection & Sensor Safety</h3>
                  <p className="text-[10px] text-slate-400">Continuous accelerometer impact monitoring</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                Active
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Detects sudden high-G deceleration spikes followed by stationary posture. Initiates a Care Message and a <strong>10-second countdown</strong>. If uncancelled, triggers automated SOS alert dispatch to Security.
            </p>

            <div className="pt-1 flex items-center justify-between">
              <div className="text-[11px] font-semibold text-slate-700">
                Test Demonstration:
              </div>
              <button
                type="button"
                onClick={triggerFallDetectionDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Simulate Fall (10s Demo)</span>
              </button>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Eye className="w-4 h-4 text-[#2864A6]" />
              <div>
                <h3 className="text-xs font-bold text-slate-800">Accessibility</h3>
                <p className="text-[10px] text-slate-400">Visual aids and navigation readability</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-50">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="font-semibold text-slate-800">High Contrast Mode</div>
                  <div className="text-[10px] text-slate-400">Enhance edge contrast and text borders</div>
                </div>
                <ToggleSwitch checked={highContrast} onChange={setHighContrast} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-semibold text-slate-800">Reduced Motion</div>
                  <div className="text-[10px] text-slate-400">Minimize animations and pulse transitions</div>
                </div>
                <ToggleSwitch checked={reducedMotion} onChange={setReducedMotion} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-semibold text-slate-800">Screen Reader Accessibility Hints</div>
                  <div className="text-[10px] text-slate-400">Augment map checkpoints with audio cues</div>
                </div>
                <ToggleSwitch checked={screenReaderHints} onChange={setScreenReaderHints} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-semibold text-slate-800">Text Size</div>
                  <div className="text-[10px] text-slate-400">Scale readable typography</div>
                </div>
                <div className="flex gap-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setTextSize('normal')}
                    className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${textSize === 'normal'
                        ? 'bg-[#2864A6] text-white border-[#2864A6] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextSize('large')}
                    className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${textSize === 'large'
                        ? 'bg-[#2864A6] text-white border-[#2864A6] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Large
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: ACCOUNT (Edit Profile, Password, PIN, Emergency) */}
      {/* ========================================================= */}
      {activeSection === 'account' && (
        <form onSubmit={handleUpdateSecurity} className="space-y-4 animate-fadeIn">
          {/* Emergency Contact Sub-section */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold text-slate-800">Emergency Contact</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-100">
                Primary
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              This contact receives an immediate SMS notification whenever you trigger an SOS alert or silent duress code.
            </p>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Elena Chen"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Phone Number</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="e.g. +60 12-998 1234"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Relationship</label>
                <select
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                >
                  <option value="Family Member">Family Member</option>
                  <option value="Parent / Guardian">Parent / Guardian</option>
                  <option value="Spouse / Partner">Spouse / Partner</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password & Security */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Lock className="w-4 h-4 text-[#2864A6]" />
              <h3 className="text-xs font-bold text-slate-800">Update Password</h3>
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2864A6]/20 focus:border-[#2864A6] transition"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Two-Factor Authentication</span>
                  <p className="text-[10px] text-slate-400">Require OTP confirmation for new logins</p>
                </div>
                <ToggleSwitch checked={twoFactorAuth} onChange={setTwoFactorAuth} />
              </div>
            </div>
          </div>

          {/* PIN Configuration: 2 Types of PIN */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
            <div className="border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#2864A6]" />
                <h3 className="text-xs font-bold text-slate-800">SOS Cancellation PIN Codes</h3>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Two PIN types for personal security during an active emergency
              </p>
            </div>

            {/* PIN 1: Normal PIN (True Cancel) */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">1. Normal PIN (True Cancel)</span>
                    <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      Safe
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Enter when you are safe. Fully cancels the active SOS alert, silences the siren, and informs Security that you are safe.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-600">4-Digit PIN:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={normalPin}
                  onChange={(e) => setNormalPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  className="w-24 px-2.5 py-1.5 text-center tracking-widest font-mono text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>
            </div>

            {/* PIN 2: Duress PIN (Fake Cancel) */}
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">2. Duress PIN (Fake Cancel)</span>
                    <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                      Coerced / Covert
                    </span>
                  </div>
                </div>
                <ToggleSwitch checked={pinEnabled} onChange={setPinEnabled} />
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Use if an intruder forces you to cancel. Displays a <strong>fake "SOS Cancelled"</strong> screen to deceive them, while covertly keeping security response at maximum priority.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-600">4-Digit PIN:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={duressPin}
                  onChange={(e) => setDuressPin(e.target.value.replace(/\D/g, ''))}
                  disabled={!pinEnabled}
                  placeholder="9142"
                  className="w-24 px-2.5 py-1.5 text-center tracking-widest font-mono text-xs font-bold rounded-lg bg-white border border-amber-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Save Account Settings Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Account & Security Settings</span>
          </button>
        </form>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: ABOUT */}
      {/* ========================================================= */}
      {activeSection === 'about' && (
        <div className="space-y-4 animate-fadeIn">
          {/* About App Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1E3C66] via-[#2864A6] to-sky-400 p-[2px] shadow-md shadow-sky-500/20">
                <div className="w-full h-full bg-[#0D1726] rounded-[10px] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-sky-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4l16 16" />
                    <path d="M20 4L4 20" />
                    <circle cx="12" cy="12" r="2.5" className="fill-sky-400 stroke-none" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight text-slate-900">
                  UrbanHub<span className="text-sky-500">-X</span>
                </h3>
                <p className="text-[11px] text-slate-500">People Track · Safety & Inclusion</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-1">
              <p><strong>App:</strong> UrbanHub-X Community & Safety</p>
              <p><strong>Version:</strong> 2.4.0 (Release 2026)</p>
              <p><strong>Track:</strong> People: Safety & Security, Getting Around</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Terms of Service</span>
                <span className="text-[11px] text-[#2864A6] hover:underline cursor-pointer flex items-center gap-1">
                  Read <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Privacy Policy (Journey-Only)</span>
                <span className="text-[11px] text-[#2864A6] hover:underline cursor-pointer flex items-center gap-1">
                  Review <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold text-slate-700">Help & Support Concierge</span>
                <span className="text-[11px] text-[#2864A6] hover:underline cursor-pointer flex items-center gap-1">
                  Contact <HelpCircle className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
